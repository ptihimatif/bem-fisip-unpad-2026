/**
 * Publish the four client-approved 2026 cabinet values and descriptions.
 *
 * Run with the signed-in Sanity CLI account:
 *   sanity exec scripts/update_cabinet_values.mjs --with-user-token -- --dry-run
 *   sanity exec scripts/update_cabinet_values.mjs --with-user-token -- --apply
 *   sanity exec scripts/update_cabinet_values.mjs --with-user-token -- --verify
 *
 * The pre-update document backup stays in the ignored outputs directory.
 */

import { mkdir, readFile, writeFile } from "node:fs/promises";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { getCliClient } from "sanity/cli";

const target = { projectId: "jcpcptq3", dataset: "production" };
const id = "cabinetProfile-2026";
const backupPath = join(
  resolve(dirname(fileURLToPath(import.meta.url)), ".."),
  "outputs",
  "cabinet-values-2026-10-08",
  "cabinetProfile-2026-before.json",
);

const values = [
  {
    _key: "nilaiempati2026",
    _type: "cabinetValue",
    title: "Empati",
    description:
      "BEM FISIP Unpad menjunjung tinggi nilai empati sebagai dasar dalam memahami dan merespons kebutuhan mahasiswa. Dengan empati, organisasi hadir lebih dekat, peka terhadap permasalahan, serta mampu menciptakan lingkungan yang inklusif dan suportif.",
  },
  {
    _key: "nilairesilien2026",
    _type: "cabinetValue",
    title: "Resilien",
    description:
      "Resiliensi menjadi kekuatan untuk menghadapi tantangan dan dinamika organisasi. Nilai ini menekankan kemampuan beradaptasi, bangkit dari kesulitan, serta menjaga konsistensi dalam mewujudkan visi dan misi organisasi.",
  },
  {
    _key: "nilaikolaboratif2026",
    _type: "cabinetValue",
    title: "Kolaboratif",
    description:
      "Semangat kolaborasi diwujudkan melalui kerja sama lintas departemen, biro, maupun dengan stakeholder lainnya. Nilai ini mencerminkan keterbukaan, sinergi, dan komitmen untuk membangun gerakan mahasiswa yang berdampak.",
  },
  {
    _key: "nilaimeritokrasi2026",
    _type: "cabinetValue",
    title: "Meritokrasi",
    description:
      "BEM FISIP Unpad menegakkan prinsip meritokrasi dengan memberikan kesempatan berdasarkan kemampuan, prestasi, dan kontribusi nyata. Nilai ini memastikan setiap individu dihargai secara adil, profesional, dan proporsional sesuai kapasitasnya.",
  },
];

function fail(message) {
  throw new Error(message);
}

function sameValues(actual) {
  return Array.isArray(actual) &&
    actual.length === values.length &&
    actual.every((item, index) =>
      item?._key === values[index]._key &&
      item?._type === values[index]._type &&
      item?.title === values[index].title &&
      item?.description === values[index].description);
}

async function verifyPublishedQuery(client) {
  const projected = await client.fetch(
    '*[_id == $id && term == $term][0]{values[]{_key,title,description}}',
    { id, term: "2026" },
    { perspective: "published" },
  );
  if (!Array.isArray(projected?.values) || projected.values.length !== values.length ||
      !projected.values.every((item, index) =>
        item._key === values[index]._key &&
        item.title === values[index].title &&
        item.description === values[index].description)) {
    fail("Published GROQ projection does not match the approved values");
  }
}

function otherContent(document) {
  return JSON.stringify(
    Object.fromEntries(
      Object.entries(document)
        .filter(([key]) => !key.startsWith("_") && key !== "values")
        .sort(([left], [right]) => left.localeCompare(right)),
    ),
  );
}

async function main() {
  const modes = ["--dry-run", "--apply", "--verify"].filter((mode) => process.argv.includes(mode));
  if (modes.length !== 1) fail("Specify exactly one of --dry-run, --apply, or --verify");
  const mode = modes[0];

  const client = getCliClient({
    projectId: target.projectId,
    dataset: target.dataset,
    apiVersion: "2026-09-04",
    useCdn: false,
  });
  const config = client.config();
  if (config.projectId !== target.projectId || config.dataset !== target.dataset || !config.token) {
    fail("CLI is not authenticated for the expected Sanity target");
  }

  const [current, draft] = await Promise.all([
    client.getDocument(id),
    client.getDocument(`drafts.${id}`),
  ]);
  if (!current || current._type !== "cabinetProfile" || current.term !== "2026") {
    fail("Expected 2026 cabinet singleton is missing or has the wrong type/term");
  }
  if (draft) fail("An unpublished cabinet draft exists; reconcile it before updating published content");
  if (mode === "--verify") {
    if (!sameValues(current.values)) fail("Published values do not match the approved four entries");
    await verifyPublishedQuery(client);
    console.log("Verified four published values and descriptions in jcpcptq3/production");
    return;
  }
  if (sameValues(current.values)) {
    console.log("The four approved values are already published; no write needed");
    return;
  }
  const previousNames = ["Empati", "Resilien", "Kolaboratif", "Meritokrasi"];
  if (JSON.stringify(current.values) !== JSON.stringify(previousNames)) {
    fail("Current values differ from the inspected four-name list; review before replacing");
  }
  console.log(`Preflight: ${target.projectId}/${target.dataset}, ${id}, revision ${current._rev}, four existing names`);
  if (mode === "--dry-run") return;

  await mkdir(dirname(backupPath), { recursive: true });
  const backup = `${JSON.stringify(current, null, 2)}\n`;
  try {
    await writeFile(backupPath, backup, { encoding: "utf8", flag: "wx" });
  } catch (error) {
    if (error.code !== "EEXIST") throw error;
    if (await readFile(backupPath, "utf8") !== backup) {
      fail("An existing backup differs from the current source revision");
    }
  }

  await client.patch(id).ifRevisionId(current._rev).set({ values }).commit();
  const after = await client.getDocument(id);
  if (!after || !sameValues(after.values) || otherContent(after) !== otherContent(current)) {
    fail("Post-write verification failed; inspect the backup and current document");
  }
  await verifyPublishedQuery(client);
  console.log(`Published and verified four values; pre-update document saved at ${backupPath}`);
}

main().catch((error) => {
  console.error(`Values update stopped: ${error.message}`);
  process.exitCode = 1;
});
