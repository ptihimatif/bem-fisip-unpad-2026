/** Approved five-cover import. Run through `sanity exec --with-user-token`. */
import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import { resolve } from "node:path";
import { getCliClient } from "sanity/cli";

const target = { projectId: "jcpcptq3", dataset: "production" };
const root = resolve("outputs/progul-2026-10-26");
const ids = ["program-003", "program-002", "program-004", "program-008", "program-007"];
const mode = process.argv.filter((value) => ["--dry-run", "--apply", "--verify", "--rollback"].includes(value));
if (mode.length !== 1) throw new Error("Choose exactly one import mode");
const client = getCliClient({ ...target, apiVersion: "2026-09-04", useCdn: false });
if (client.config().projectId !== target.projectId || client.config().dataset !== target.dataset) throw new Error("Wrong Sanity target");
const json = async (name) => JSON.parse(await readFile(resolve(root, name), "utf8"));
const save = async (name, data, exclusive = false) => writeFile(resolve(root, name), `${JSON.stringify(data, null, 2)}\n`, exclusive ? { flag: "wx" } : undefined);
const otherFields = (doc) => Object.fromEntries(Object.entries(doc).filter(([key]) => !["_rev", "_updatedAt", "coverImage", "isFeatured"].includes(key)));

async function documents() {
  const rows = await client.getDocuments(ids);
  const drafts = await client.getDocuments(ids.map((id) => `drafts.${id}`));
  if (drafts.some(Boolean)) throw new Error("A target has a draft; review before changing its published record");
  for (let index = 0; index < rows.length; index++) {
    if (rows[index]?._id !== ids[index] || rows[index]._type !== "program" || rows[index].term !== "2026") throw new Error("Unexpected target record");
  }
  return rows;
}

async function verify(plan, receipt) {
  const current = await documents();
  for (const doc of current) {
    const before = plan.before.find((item) => item._id === doc._id);
    const cover = receipt.covers.find((item) => item.documentId === doc._id);
    assert.ok(cover, "Missing cover receipt");
    assert.equal(doc.coverImage?.asset?._ref, cover.assetId);
    assert.equal(doc.coverImage?.alt, cover.alt);
    assert.equal(doc.isFeatured, true);
    assert.deepEqual(otherFields(doc), otherFields(before), `Unrelated fields changed on ${doc._id}`);
    const asset = await client.getDocument(cover.assetId);
    assert.equal(asset?.sha1hash, cover.sha1, "Asset bytes differ from inspected source");
  }
  const published = await client.fetch('*[_type == "program" && term == "2026" && _id in $ids]{_id,coverImage,isFeatured}', { ids }, { perspective: "published", useCdn: false });
  assert.equal(published.length, 5);
  for (const doc of published) {
    const cover = receipt.covers.find((item) => item.documentId === doc._id);
    assert.equal(doc.coverImage?.asset?._ref, cover.assetId);
    assert.equal(doc.isFeatured, true);
  }
  assert.equal(await client.fetch('count(*[_type == "program" && term == "2026"])'), plan.programCount);
  console.log("Verified all five published covers, exact source asset hashes, Featured flags, unchanged unrelated fields, and unchanged program count.");
}

async function main() {
  await mkdir(root, { recursive: true });
  if (mode[0] === "--dry-run") {
    const map = await json("approved-map.json");
    assert.deepEqual(map.map((item) => item.documentId), ids);
    const source = await json("source-manifest.json");
    for (const item of map) {
      const entry = source.find((file) => file.id === item.sourceId && file.program === item.program);
      assert.ok(entry, "Source was not inspected");
      const bytes = await readFile(resolve(root, "source", item.program, `${item.sourceId}.jpg`));
      assert.equal(createHash("sha256").update(bytes).digest("hex"), entry.sha256);
      item.sha256 = entry.sha256;
    }
    const before = await documents();
    const programCount = await client.fetch('count(*[_type == "program" && term == "2026"])');
    await save("import-plan.json", { target, fields: ["coverImage", "isFeatured"], map, before, programCount });
    console.log("Prepared five-cover plan; no production mutation.");
    console.log(JSON.stringify(before.map((doc) => ({ id: doc._id, name: doc.name, featuredBefore: doc.isFeatured, featuredAfter: true }))));
    return;
  }
  const plan = await json("import-plan.json");
  assert.deepEqual(plan.target, target);
  assert.deepEqual(plan.before.map((doc) => doc._id), ids);
  if (mode[0] === "--verify") return verify(plan, await json("import-receipt.json"));
  if (mode[0] === "--rollback") {
    const receipt = await json("import-receipt.json");
    const current = await documents();
    let transaction = client.transaction();
    for (const doc of current) {
      const before = plan.before.find((item) => item._id === doc._id);
      const cover = receipt.covers.find((item) => item.documentId === doc._id);
      assert.deepEqual(doc.coverImage, { _type: "image", alt: cover.alt, asset: { _type: "reference", _ref: cover.assetId } }, "Cover changed since import; refuse rollback");
      assert.equal(doc.isFeatured, true, "Featured flag changed since import; refuse rollback");
      transaction = transaction.patch(doc._id, (patch) => {
        patch = patch.ifRevisionId(doc._rev);
        for (const field of ["coverImage", "isFeatured"]) patch = Object.hasOwn(before, field) ? patch.set({ [field]: before[field] }) : patch.unset([field]);
        return patch;
      });
    }
    await transaction.commit();
    console.log("Restored only the five coverImage/isFeatured pairs. Assets retained for recovery.");
    return;
  }
  const current = await documents();
  for (const doc of current) assert.equal(doc._rev, plan.before.find((item) => item._id === doc._id)._rev, "Record changed since preflight");
  // Never overwrite the pre-write backup, including when an upload is retried.
  try { await save("programs-before.json", plan.before, true); }
  catch (error) { if (error.code !== "EEXIST") throw error; assert.deepEqual(await json("programs-before.json"), plan.before); }
  let receipt;
  try { receipt = await json("import-receipt.json"); } catch (error) { if (error.code !== "ENOENT") throw error; receipt = { target, covers: [] }; }
  for (const item of plan.map) {
    const bytes = await readFile(resolve(root, "source", item.program, `${item.sourceId}.jpg`));
    assert.equal(createHash("sha256").update(bytes).digest("hex"), item.sha256);
    const sha1 = createHash("sha1").update(bytes).digest("hex");
    const existing = receipt.covers.find((cover) => cover.documentId === item.documentId);
    if (existing) { assert.equal(existing.sha1, sha1); continue; }
    const asset = await client.assets.upload("image", bytes, { filename: `${item.program.toLowerCase()}-client-cover.jpg` });
    assert.equal(asset.sha1hash, sha1);
    receipt.covers.push({ ...item, sha1, assetId: asset._id });
    await save("import-receipt.json", receipt);
    console.log(`Uploaded verified cover for ${item.program}`);
  }
  let transaction = client.transaction();
  for (const doc of current) {
    const cover = receipt.covers.find((item) => item.documentId === doc._id);
    transaction = transaction.patch(doc._id, (patch) => patch.ifRevisionId(doc._rev).set({
      coverImage: { _type: "image", alt: cover.alt, asset: { _type: "reference", _ref: cover.assetId } },
      isFeatured: true,
    }));
  }
  await transaction.commit();
  await verify(plan, receipt);
}
main().catch((error) => { console.error(error.message); process.exitCode = 1; });
