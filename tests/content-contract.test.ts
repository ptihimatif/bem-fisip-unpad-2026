import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";

const fixture = JSON.parse(
  readFileSync(resolve(process.cwd(), "sanity/fixtures/2026-content-contract.json"), "utf8"),
) as { _fixtureOnly: boolean; term: string; siteSettings: { _id: string }; cabinetProfile: { _id: string }; organizationUnit: { term: string }; member: { term: string; organizationUnit: { _ref: string } }; post: { term: string; postCategory: string } };

test("fixture is explicitly isolated to the 2026 content contract", () => {
  assert.equal(fixture._fixtureOnly, true);
  assert.equal(fixture.term, "2026");
  assert.match(fixture.siteSettings._id, /siteSettings-2026$/);
  assert.match(fixture.cabinetProfile._id, /cabinetProfile-2026$/);
  assert.equal(fixture.organizationUnit.term, fixture.term);
  assert.equal(fixture.member.term, fixture.term);
  assert.equal(fixture.member.organizationUnit._ref, "fixture-unit-2026");
  assert.equal(fixture.post.term, fixture.term);
  assert.ok(["artikel", "kajian"].includes(fixture.post.postCategory));
});
