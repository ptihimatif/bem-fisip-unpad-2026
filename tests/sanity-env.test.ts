import test from "node:test";
import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";

function inspect(extra: Record<string, string>) {
  return spawnSync(process.execPath, ["--import", "tsx", "-e", "import('./sanity/env.ts').then(() => console.log('loaded'))"], {
    encoding: "utf8",
    env: { ...process.env, CI: "true", NODE_ENV: "production", NEXT_PUBLIC_SANITY_PROJECT_ID: "", NEXT_PUBLIC_SANITY_DATASET: "", SANITY_TEST_MODE: "false", ...extra },
  });
}

test("CI is not permission for a release build to omit Sanity identifiers", () => {
  const result = inspect({});
  assert.notEqual(result.status, 0);
  assert.match(result.stderr, /Missing environment variable/);
});

test("only explicit isolated mode permits placeholder Sanity identifiers", () => {
  const result = inspect({ SANITY_TEST_MODE: "true" });
  assert.equal(result.status, 0, result.stderr);
  assert.match(result.stdout, /loaded/);
});
