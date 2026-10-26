/** Apply/verify/roll back only the four reviewed additive About fields. */
import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { readFile, writeFile } from "node:fs/promises";
import { resolve } from "node:path";
import { getCliClient } from "sanity/cli";

const root = resolve("outputs/pre-release-cms");
const fields = ["visionHighlights", "missionItems", "workCultureItems", "logoExplanationItems"];
const mode = process.argv.filter((value) => ["--apply", "--verify", "--rollback"].includes(value));
if (mode.length !== 1) throw new Error("Choose --apply, --verify, or --rollback");
const client = getCliClient({ projectId: "jcpcptq3", dataset: "production", apiVersion: "2026-09-04", useCdn: false });
const json = async (name) => JSON.parse(await readFile(resolve(root, name), "utf8"));
const otherFields = (doc) => Object.fromEntries(Object.entries(doc).filter(([key]) => ![...fields, "_rev", "_updatedAt"].includes(key)));

async function verify(plan, before) {
  const current = await client.getDocument("cabinetProfile-2026");
  for (const field of fields) assert.deepEqual(current[field], plan.set[field]);
  assert.deepEqual(otherFields(current), otherFields(before), "Unrelated cabinet fields changed");
  const published = await client.fetch('*[_id == "cabinetProfile-2026" && term == "2026"][0]{visionHighlights,missionItems,workCultureItems,logoExplanationItems}', {}, { perspective: "published", useCdn: false });
  assert.deepEqual(published, plan.set);
  console.log("Verified 3 vision explanations, 5 missions, 3 culture cards, 8 logo explanations; all unrelated cabinet fields unchanged.");
}

async function main() {
  const plan = await json("about-content-plan.json");
  assert.deepEqual(plan.target, { projectId: "jcpcptq3", dataset: "production", documentId: "cabinetProfile-2026" });
  assert.equal(client.config().projectId, plan.target.projectId);
  assert.equal(client.config().dataset, plan.target.dataset);
  assert.deepEqual(Object.keys(plan.set), fields);
  assert.deepEqual(fields.map((field) => plan.set[field].length), [3, 5, 3, 8]);
  if (mode[0] === "--verify") return verify(plan, await json("about-content-before.json"));
  const [current, draft] = await Promise.all([client.getDocument(plan.target.documentId), client.getDocument(`drafts.${plan.target.documentId}`)]);
  assert.ok(current?._type === "cabinetProfile" && current.term === "2026");
  assert.ok(!draft, "A draft exists; review before changing published content");
  if (mode[0] === "--rollback") {
    const before = await json("about-content-before.json");
    let patch = client.patch(current._id).ifRevisionId(current._rev);
    for (const field of fields) {
      assert.deepEqual(current[field], plan.set[field], "Field changed since publication; refuse rollback");
      patch = Object.hasOwn(before, field) ? patch.set({ [field]: before[field] }) : patch.unset([field]);
    }
    await patch.commit();
    console.log("Restored only the four structured About fields.");
    return;
  }
  assert.equal(current._rev, plan.expectedRevision, "Cabinet changed since preflight");
  assert.deepEqual(plan.conflicts, []);
  for (const field of fields) assert.ok(!current[field]?.length, "An approved target field now contains content");
  for (const [path, hash] of Object.entries(plan.sourceHashes)) {
    assert.equal(createHash("sha256").update(await readFile(resolve(path))).digest("hex"), hash, "Source changed since review");
  }
  // Exclusive backup prevents accidental loss of the original recovery point.
  await writeFile(resolve(root, "about-content-before.json"), `${JSON.stringify(current, null, 2)}\n`, { flag: "wx" });
  await client.patch(current._id).ifRevisionId(current._rev).set(plan.set).commit();
  await verify(plan, current);
}
main().catch((error) => { console.error(error.message); process.exitCode = 1; });
