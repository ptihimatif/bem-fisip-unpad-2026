import { spawn } from "node:child_process";
import { readFile } from "node:fs/promises";

const env = {
  ...process.env,
  SANITY_TEST_MODE: "true",
  NEXT_PUBLIC_SITE_ENV: "staging",
  NEXT_PUBLIC_SITE_URL: "http://127.0.0.1:3123",
  NEXT_PUBLIC_SANITY_PROJECT_ID: "ci-placeholder",
  NEXT_PUBLIC_SANITY_DATASET: "ci-placeholder",
  SANITY_REVALIDATE_SECRET: "isolated-browser-webhook-secret",
};
if (env.VERCEL || env.NETLIFY) throw new Error("Run isolated checks in local/CI environments, not a deployment build");

async function run(args) {
  const code = await new Promise((resolve, reject) => {
    const child = spawn(process.execPath, args, { env, stdio: "inherit" });
    child.on("error", reject);
    child.on("exit", (status) => resolve(status ?? 1));
  });
  if (code !== 0) process.exit(code);
}
if (!process.argv.includes("--skip-build")) await run(["node_modules/next/dist/bin/next", "build"]);
if (!process.argv.includes("--build-only")) {
  const html = await readFile(".next-check/server/app/index.html", "utf8");
  if (!html.includes("Mahasiswa Uji")) throw new Error("The last build is not an isolated fixture build; run pnpm test:browser");
  await run(["node_modules/@playwright/test/cli.js", "test"]);
}
