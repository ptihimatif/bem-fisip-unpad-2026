/**
 * Import only the client-approved Mapres and 2026 proker into jcpcptq3/production.
 * Run via: sanity exec scripts/import_mapres_proker.mjs --with-user-token -- --dry-run|--apply|--verify
 * The exact pre-write program records and created IDs are kept in the ignored outputs directory.
 */
import { mkdir, readFile, writeFile } from "node:fs/promises";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { getCliClient } from "sanity/cli";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const source = JSON.parse(await readFile(join(root, "scripts", "mapres-proker-source.json"), "utf8"));
const outputDir = join(root, "outputs", "mapres-proker-2026-10-22");
const backupPath = join(outputDir, "programs-before.json");
const statePath = join(outputDir, "import-state.json");
const target = { projectId: "jcpcptq3", dataset: "production", term: "2026" };

// Exact published 2026 unit IDs and names, checked again immediately before writing.
const unitMap = {
  "Biro kesekretariatan": ["02bd419d-81b5-40e0-8eb6-b945f7444c6e", "Biro Kesekretariatan"],
  "Biro keuangan": ["647f79a7-9956-486b-9895-4771d5357d9b", "Biro Keuangan"],
  "Biro rda": ["352b5714-67fa-43d1-8e11-ec6d584171fe", "Biro Riset, Data, dan Analisis"],
  "Sosial masyarakat": ["9c6cc7a5-df10-4db2-b600-c3ba1a2556b1", "Departemen Sosial Masyarakat"],
  "Lingkungan Hidup": ["a35dfc88-c78b-4019-8a72-97707f1f7ee4", "Departemen Lingkungan Hidup"],
  "Olahraga": ["8cab5f92-b56b-47f3-af17-946bd3e937ea", "Departemen Olahraga"],
  "Seni Budaya": ["3de65689-7990-495a-a3ae-de2fe11e28da", "Departemen Seni Budaya"],
  "Akademik dan Profesi": ["48505ab2-6b34-44aa-983b-8691f985cae1", "Departemen Akademik dan Keprofesian"],
  "Ekonomi Kreatif": ["5775743e-69bf-4c9f-9199-29a4f4536488", "Departemen Ekonomi Kreatif"],
  "KPSDM": ["121d20e1-19dc-4adb-aa02-bfe41e2bd456", "Departemen Kaderisasi dan Pengembangan"],
  "MSDO": ["5b60e775-a222-4795-966d-7882ab743401", "Biro Manajemen Sumber Daya Organisasi"],
  "Media kreatif": ["64e3efe4-743c-46e1-8dbe-e0a3c0f5d8ed", "Departemen Media Kreatif"],
  "Hubungan Internal": ["6a85548f-39a1-4787-a088-75cce72bac94", "Departemen Hubungan Internal"],
  "Hubungan Eksternal": ["4116dba1-5259-4c4a-b818-ef344c74f76d", "Departemen Hubungan Eksternal"],
  "Proaksi": ["ae029a94-ca2f-4a59-b767-4cb654a582b5", "Departemen Propaganda dan Aksi"],
  "Kastrat": ["e86f97b6-52fb-4ed4-a050-1ccb544a23da", "Departemen Kajian Strategis"],
  "Adkesma": ["3f5d4e22-9a94-4e78-a0ee-93c0346a9937", "Departemen Advokasi dan Kesejahteraan Mahasiswa"],
};

// These five are already published. Preserve their descriptions, images, links, dates, and featured flags.
const existingMap = {
  "KPSDM|FILS": ["program-002", "fils"],
  "KPSDM|ORASI": ["program-003", "orasi"],
  "Seni Budaya|FISTAORA-ART": ["program-004", "fistaora-art"],
  "Hubungan Internal|FISIPAW": ["program-007", "fisipaw"],
  "Sosial masyarakat|Social Camping": ["program-008", "soscamp"],
};

function fail(message) { throw new Error(message); }
function normalize(value) { return value.normalize("NFKC").trim().toLocaleLowerCase("id"); }
function slugify(value) {
  return value.normalize("NFKD").replace(/[\u0300-\u036f]/g, "").toLowerCase()
    .replace(/&/g, " and ").replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}
function sourceKey(group, name) { return `${group}|${name}`; }
function contentWithoutSystem(document) {
  return Object.fromEntries(Object.entries(document).filter(([key]) => !key.startsWith("_"))
    .sort(([left], [right]) => left.localeCompare(right)));
}
function same(a, b) { return JSON.stringify(a) === JSON.stringify(b); }

if (source.term !== target.term || source.mapres?.length !== 10 ||
    source.groups?.length !== 17 || source.groups.reduce((sum, group) => sum + group.programs.length, 0) !== 86 ||
    Object.keys(unitMap).length !== 17 || Object.keys(existingMap).length !== 5) {
  fail("Source inventory differs from the reviewed 10 Mapres / 86 proker / 17 units");
}
const expectedMapres = source.mapres.map((person, index) => ({
  _type: "mapres",
  term: target.term,
  nama_mapres: person.name,
  studyProgram: person.studyProgram,
  cohortYear: person.cohortYear,
  ...(person.rank ? { rank: person.rank } : {}),
  displayOrder: index + 1,
}));
const expectedPrograms = source.groups.flatMap((group) => group.programs.map((name, index) => {
  const [unitId] = unitMap[group.sourceHeading] ?? fail(`Unmapped unit: ${group.sourceHeading}`);
  return {
    sourceHeading: group.sourceHeading,
    name,
    unitId,
    displayOrder: index + 1,
    existing: existingMap[sourceKey(group.sourceHeading, name)],
    slug: `${slugify(group.sourceHeading)}-${slugify(name)}`,
  };
}));
if (new Set(expectedMapres.map((person) => normalize(person.nama_mapres))).size !== 10 ||
    new Set(expectedPrograms.map((program) => sourceKey(program.unitId, normalize(program.name)))).size !== 86 ||
    new Set(expectedPrograms.map((program) => program.slug)).size !== 86 ||
    expectedPrograms.filter((program) => program.existing).length !== 5) {
  fail("Duplicate or missing source mapping");
}

async function snapshot(client) {
  const [units, programs, mapres] = await Promise.all([
    client.fetch('*[_type == "organizationUnit" && term == $term]{_id,officialName,term}', { term: target.term }, { perspective: "raw" }),
    client.fetch('*[_type == "program"]', {}, { perspective: "raw" }),
    client.fetch('*[_type == "mapres"]', {}, { perspective: "raw" }),
  ]);
  return { units, programs, mapres };
}
function checkUnits(units) {
  const byId = new Map(units.filter((unit) => !unit._id.startsWith("drafts.")).map((unit) => [unit._id, unit]));
  for (const [heading, [id, name]] of Object.entries(unitMap)) {
    if (byId.get(id)?.officialName !== name || byId.get(id)?.term !== target.term) fail(`Unit mismatch: ${heading}`);
    if (units.some((unit) => unit._id === `drafts.${id}`)) fail(`Unit has an unpublished draft: ${heading}`);
  }
}
function checkExisting(programs) {
  if (programs.length !== 5 || programs.some((program) => program._id.startsWith("drafts.") || program.term !== target.term)) {
    fail("Expected exactly five published 2026 programs and no drafts before import");
  }
  for (const [key, [id, slug]] of Object.entries(existingMap)) {
    const document = programs.find((program) => program._id === id);
    if (!document || document._type !== "program" || document.slug?.current !== slug) fail(`Existing program mismatch: ${key}`);
  }
}
function findPublished(snapshotValue, type) {
  return snapshotValue.filter((document) => document._type === type && !document._id.startsWith("drafts."));
}
function verify(snapshotValue, before) {
  const mapres = findPublished(snapshotValue.mapres, "mapres");
  const programs = findPublished(snapshotValue.programs, "program");
  if (mapres.length !== 10 || programs.length !== 86) fail(`Count mismatch: ${mapres.length} Mapres, ${programs.length} programs`);
  const mapresByName = new Map(mapres.map((person) => [normalize(person.nama_mapres), person]));
  for (const expected of expectedMapres) {
    const actual = mapresByName.get(normalize(expected.nama_mapres));
    if (!actual || actual.term !== target.term || actual.studyProgram !== expected.studyProgram ||
        actual.cohortYear !== expected.cohortYear || actual.rank !== expected.rank ||
        actual.displayOrder !== expected.displayOrder || actual.achievementTitle ||
        Object.keys(actual).some((key) => key.toLowerCase().includes("delegasi"))) fail(`Mapres mismatch: ${expected.nama_mapres}`);
  }
  const byUnitName = new Map(programs.map((program) => [
    sourceKey(program.organizationUnit?._ref, normalize(program.name)), program,
  ]));
  if (byUnitName.size !== 86) fail("Duplicate published program name within a unit");
  for (const expected of expectedPrograms) {
    const actual = byUnitName.get(sourceKey(expected.unitId, normalize(expected.name)));
    if (!actual || actual.term !== target.term || actual.displayOrder !== expected.displayOrder ||
        (expected.existing && actual._id !== expected.existing[0]) ||
        (!expected.existing && actual.slug?.current !== expected.slug)) fail(`Program mismatch: ${expected.sourceHeading} / ${expected.name}`);
    if (expected.existing && before) {
      const original = before.find((program) => program._id === actual._id);
      const oldFields = contentWithoutSystem(original);
      const newFields = contentWithoutSystem(actual);
      for (const field of ["name", "organizationUnit", "displayOrder"]) {
        delete oldFields[field];
        delete newFields[field];
      }
      if (!same(oldFields, newFields)) fail(`Unexpected existing program field change: ${actual._id}`);
    }
  }
  return { mapres, programs };
}

async function main() {
  const modes = ["--dry-run", "--apply", "--verify"].filter((mode) => process.argv.includes(mode));
  if (modes.length !== 1) fail("Specify exactly one of --dry-run, --apply, --verify");
  const client = getCliClient({ projectId: target.projectId, dataset: target.dataset, apiVersion: "2026-09-04", useCdn: false });
  const config = client.config();
  if (config.projectId !== target.projectId || config.dataset !== target.dataset || !config.token) fail("Wrong or unauthenticated Sanity target");
  const current = await snapshot(client);
  checkUnits(current.units);
  if (modes[0] === "--verify") {
    const before = JSON.parse(await readFile(backupPath, "utf8"));
    verify(current, before);
    console.log("Verified 10 Mapres and 86 programs in jcpcptq3/production");
    return;
  }
  checkExisting(current.programs);
  if (current.mapres.some((item) => !item._id.startsWith("drafts."))) {
    fail("Published Mapres records already exist; refusing to overwrite them");
  }
  console.log(`Preflight: ${expectedMapres.length} Mapres, ${expectedPrograms.length} proker across 17 units; 5 existing programs, 81 new programs`);
  for (const program of expectedPrograms.filter((item) => item.existing)) {
    const original = current.programs.find((item) => item._id === program.existing[0]);
    console.log(`Patch ${original._id}: ${original.name} -> ${program.name}; unit ${original.organizationUnit?._ref} -> ${program.unitId}; order ${original.displayOrder} -> ${program.displayOrder}`);
  }
  if (modes[0] === "--dry-run") return;

  await mkdir(outputDir, { recursive: true });
  await writeFile(backupPath, `${JSON.stringify(current.programs, null, 2)}\n`, { encoding: "utf8", flag: "wx" });
  const transaction = client.transaction();
  for (const person of expectedMapres) transaction.create(person);
  for (const program of expectedPrograms) {
    if (program.existing) {
      const original = current.programs.find((item) => item._id === program.existing[0]);
      transaction.patch(original._id, (patch) => patch.ifRevisionId(original._rev).set({
        name: program.name,
        organizationUnit: { _type: "reference", _ref: program.unitId },
        displayOrder: program.displayOrder,
      }));
    } else {
      transaction.create({
        _type: "program",
        term: target.term,
        name: program.name,
        slug: { _type: "slug", current: program.slug },
        organizationUnit: { _type: "reference", _ref: program.unitId },
        displayOrder: program.displayOrder,
        isFeatured: false,
      });
    }
  }
  await transaction.commit({ visibility: "sync" });
  const after = await snapshot(client);
  const published = verify(after, current.programs);
  const oldIds = new Set(current.programs.map((program) => program._id));
  const state = {
    target,
    sourceUrl: source.sourceUrl,
    revisionId: source.revisionId,
    createdMapresIds: published.mapres.map((person) => person._id),
    createdProgramIds: published.programs.filter((program) => !oldIds.has(program._id)).map((program) => program._id),
    patchedProgramIds: Object.values(existingMap).map(([id]) => id),
  };
  await writeFile(statePath, `${JSON.stringify(state, null, 2)}\n`, { encoding: "utf8", flag: "wx" });
  console.log("Published and verified 10 Mapres, 81 new programs, and 5 narrowly patched programs");
}

main().catch((error) => {
  console.error(`Mapres/proker import stopped: ${error.message}`);
  process.exitCode = 1;
});
