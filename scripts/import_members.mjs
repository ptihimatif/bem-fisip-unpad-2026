/**
 * Import the approved 2026 member list and matched ID-card images.
 *
 * Run through `sanity exec` so the CLI supplies the signed-in user's token:
 *   pnpm exec sanity exec scripts/import_members.mjs --with-user-token -- --dry-run
 *   pnpm exec sanity exec scripts/import_members.mjs --with-user-token -- --apply
 *   pnpm exec sanity exec scripts/import_members.mjs --with-user-token -- --verify
 *
 * Source data, image mapping, backup, and resume state stay in the ignored
 * outputs/member-import-preflight directory. Never commit those files.
 */

import { createHash } from "node:crypto";
import { createReadStream } from "node:fs";
import { readFile, rename, writeFile } from "node:fs/promises";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { getCliClient } from "sanity/cli";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const workDir = join(root, "outputs", "member-import-preflight");
const workbookPath = join(root, "docs", "data fungsionaris.xlsx");
const planPath = join(workDir, "dry-run.json");
const photoMapPath = join(workDir, "photo-map.json");
const statePath = join(workDir, "import-state.json");
const backupPath = join(workDir, "production-before-members-2026-10-05.tar.gz");
const target = { projectId: "jcpcptq3", dataset: "production", term: "2026" };
const backupHash = "d6e2cb150106774ad3f1de7ec26b553e080e6c34ff34666897867b079f2216de";

function sha256(bytes) {
  return createHash("sha256").update(bytes).digest("hex");
}

function sameTarget(value) {
  return value?.projectId === target.projectId && value?.dataset === target.dataset;
}

function fail(message) {
  throw new Error(message);
}

async function readJson(path) {
  return JSON.parse(await readFile(path, "utf8"));
}

async function saveState(state) {
  const temporaryPath = `${statePath}.tmp`;
  await writeFile(temporaryPath, `${JSON.stringify(state, null, 2)}\n`, "utf8");
  await rename(temporaryPath, statePath);
}

async function findAsset(client, filename, bytes) {
  const sha1 = createHash("sha1").update(bytes).digest("hex");
  const assets = await client.fetch(
    '*[_type == "sanity.imageAsset" && originalFilename == $filename && sha1hash == $sha1]{_id}',
    { filename, sha1 },
    { perspective: "raw" },
  );
  if (assets.length > 1) fail(`More than one matching image asset: ${filename}`);
  return assets[0]?._id;
}

async function main() {
  const dryRun = process.argv.includes("--dry-run");
  const apply = process.argv.includes("--apply");
  const verify = process.argv.includes("--verify");
  if ([dryRun, apply, verify].filter(Boolean).length !== 1) {
    fail("Specify exactly one of --dry-run, --apply, or --verify");
  }

  const [plan, photoMap, workbook, backup] = await Promise.all([
    readJson(planPath),
    readJson(photoMapPath),
    readFile(workbookPath),
    readFile(backupPath),
  ]);
  const workbookHash = sha256(workbook);
  if (sha256(backup) !== backupHash) fail("Verified pre-import backup is missing or changed");
  if (!sameTarget(plan.target) || !sameTarget(photoMap.target)) fail("Sanity target mismatch");
  if (plan.target.term !== target.term) fail("Content term mismatch");
  if (plan.source.sha256 !== workbookHash || photoMap.workbookSha256 !== workbookHash) {
    fail("Workbook changed since validation");
  }
  if (plan.records.length !== 268 || photoMap.cards.length !== 265) {
    fail("Expected exactly 268 members and 265 matched card images");
  }

  const recordsByRow = new Map(plan.records.map((record) => [record.sourceRow, record]));
  if (recordsByRow.size !== 268) fail("Duplicate source row in member plan");
  const names = new Set(plan.records.map((record) => record.document.name.normalize("NFKC").toLowerCase()));
  if (names.size !== 268) fail("Duplicate member name in plan");
  const cardNumbers = new Set();
  const photoRows = new Set();
  for (const card of photoMap.cards) {
    if (!recordsByRow.has(card.sourceRow)) fail(`Unknown workbook row for card ${card.card}`);
    if (cardNumbers.has(card.card) || photoRows.has(card.sourceRow)) fail("Duplicate image mapping");
    cardNumbers.add(card.card);
    photoRows.add(card.sourceRow);
    const imagePath = resolve(root, card.file);
    if (!imagePath.startsWith(`${join(root, "docs")}${"\\"}`)) fail("Image outside docs");
    if (sha256(await readFile(imagePath)) !== card.sha256) fail(`Card ${card.card} changed`);
  }
  if (photoMap.unmatchedCards.join(",") !== "2,74,90" ||
      photoMap.membersWithoutCard.join(",") !== "134,262,266") {
    fail("Unexpected unresolved image mapping");
  }

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
  const [units, existingMembers] = await Promise.all([
    client.fetch('*[_type == "organizationUnit" && term == "2026"]{_id,term}', {}, { perspective: "raw" }),
    client.fetch('*[_type == "member"]{_id,name,role,term,organizationUnit,displayOrder,_createdAt,photo}', {}, { perspective: "raw" }),
  ]);
  const unitIds = new Set(units.filter((unit) => !unit._id.startsWith("drafts.")).map((unit) => unit._id));
  if (unitIds.size !== 23) fail("Expected 23 published 2026 organization units");
  for (const record of plan.records) {
    const document = record.document;
    if (document._type !== "member" || document.term !== target.term ||
        !document.name || !document.role || document._id ||
        !unitIds.has(document.organizationUnit?._ref)) {
      fail(`Invalid member plan at workbook row ${record.sourceRow}`);
    }
  }

  let state;
  try {
    state = await readJson(statePath);
  } catch (error) {
    if (error.code !== "ENOENT") throw error;
  }
  if (state && (state.workbookHash !== workbookHash || state.backupHash !== backupHash ||
      !sameTarget(state.target))) fail("Existing import state belongs to another source or target");
  if (!state && existingMembers.length !== 0) fail("Members already exist; refusing a new import");
  if (state) {
    const knownIds = new Set(Object.values(state.created));
    for (const member of existingMembers) {
      if (!knownIds.has(member._id) && member.name !== recordsByRow.get(state.inFlightRow)?.document.name) {
        fail("Found a member outside this import state; reconcile before resuming");
      }
    }
  }
  console.log(`Preflight: ${plan.records.length} members, ${photoMap.cards.length} mapped photos, ${unitIds.size} units, ${existingMembers.length} existing members`);
  if (dryRun) return;

  if (verify) {
    if (!state || Object.keys(state.created).length !== 268 ||
        Object.keys(state.attached).length !== 265 || existingMembers.length !== 268) {
      fail("Import state or Sanity member count is incomplete");
    }
    const byId = new Map(existingMembers.map((member) => [member._id, member]));
    for (const record of plan.records) {
      const row = record.sourceRow;
      const expected = record.document;
      const actual = byId.get(state.created[row]);
      if (!actual || actual._id.startsWith("drafts.") || actual.name !== expected.name ||
          actual.role !== expected.role || actual.term !== expected.term ||
          actual.displayOrder !== expected.displayOrder ||
          actual.organizationUnit?._ref !== expected.organizationUnit._ref) {
        fail(`Published member fields differ at workbook row ${row}`);
      }
      const card = photoMap.cards.find((item) => item.sourceRow === row);
      if (card) {
        if (actual.photo?._type !== "image" ||
            actual.photo.asset?._ref !== state.assets[card.card] ||
            actual.photo.alt !== `Foto ${expected.name}`) {
          fail(`Photo reference differs at workbook row ${row}`);
        }
      } else if (actual.photo) {
        fail(`Unexpected photo on workbook row ${row}`);
      }
    }
    const assetIds = Object.values(state.assets);
    if (assetIds.length !== 265 || new Set(assetIds).size !== 265) {
      fail("Unexpected number of uploaded image assets");
    }
    const assets = await client.fetch(
      '*[_id in $ids]{_id,originalFilename,sha1hash}',
      { ids: assetIds },
      { perspective: "raw" },
    );
    if (assets.length !== 265) fail("One or more image assets are missing");
    const assetsById = new Map(assets.map((asset) => [asset._id, asset]));
    for (const card of photoMap.cards) {
      const asset = assetsById.get(state.assets[card.card]);
      const bytes = await readFile(resolve(root, card.file));
      const sha1 = createHash("sha1").update(bytes).digest("hex");
      if (asset?.originalFilename !== `member-2026-card-${card.card}.png` ||
          asset.sha1hash !== sha1) fail(`Uploaded asset differs for card ${card.card}`);
    }
    const published = await client.fetch(
      '{"members": count(*[_type == "member" && term == "2026"]), "withPhoto": count(*[_type == "member" && term == "2026" && defined(photo.asset._ref)])}',
      {},
      { perspective: "published" },
    );
    if (published.members !== 268 || published.withPhoto !== 265) {
      fail("Published perspective member or photo count differs");
    }
    console.log("Verified: 268 published members, 23 valid unit references, 265 exact image assets and attachments, 3 members without photos");
    return;
  }

  state ??= {
    target,
    workbookHash,
    backupHash,
    startedAt: new Date().toISOString(),
    inFlightRow: null,
    created: {},
    assets: {},
    attached: {},
  };
  await saveState(state);
  const currentById = new Map(existingMembers.map((member) => [member._id, member]));
  for (const record of plan.records) {
    const row = record.sourceRow;
    if (state.created[row]) {
      if (!currentById.has(state.created[row])) fail(`Created member missing at row ${row}`);
      continue;
    }
    if (state.inFlightRow && state.inFlightRow !== row) fail("Another row is marked in flight");
    const uncertain = existingMembers.filter((member) =>
      member.name === record.document.name && member.role === record.document.role &&
      member.organizationUnit?._ref === record.document.organizationUnit._ref &&
      member._createdAt >= state.startedAt);
    if (state.inFlightRow === row) {
      if (uncertain.length > 1) fail(`Multiple matching members at row ${row}`);
      if (uncertain.length === 1) {
        state.created[row] = uncertain[0]._id;
        state.inFlightRow = null;
        await saveState(state);
        continue;
      }
    } else if (uncertain.length) {
      fail(`Untracked member already exists at row ${row}`);
    }
    state.inFlightRow = row;
    await saveState(state);
    const created = await client.create(record.document);
    state.created[row] = created._id;
    currentById.set(created._id, created);
    state.inFlightRow = null;
    await saveState(state);
    if (Object.keys(state.created).length % 20 === 0) console.log(`Created ${Object.keys(state.created).length}/268 members`);
  }

  for (const card of photoMap.cards) {
    const row = card.sourceRow;
    const memberId = state.created[row];
    const imagePath = resolve(root, card.file);
    const bytes = await readFile(imagePath);
    if (sha256(bytes) !== card.sha256) fail(`Card ${card.card} changed during import`);
    const filename = `member-2026-card-${card.card}.png`;
    if (!state.assets[card.card]) {
      let assetId = await findAsset(client, filename, bytes);
      if (!assetId) {
        const asset = await client.assets.upload("image", createReadStream(imagePath), { filename });
        assetId = asset._id;
      }
      state.assets[card.card] = assetId;
      await saveState(state);
    }
    if (!state.attached[row]) {
      const current = await client.getDocument(memberId);
      if (!current) fail(`Member missing before photo attachment at row ${row}`);
      if (current.photo?.asset?._ref && current.photo.asset._ref !== state.assets[card.card]) {
        fail(`Different photo already attached at row ${row}`);
      }
      if (!current.photo?.asset?._ref) {
        await client.patch(memberId).set({
          photo: {
            _type: "image",
            asset: { _type: "reference", _ref: state.assets[card.card] },
            alt: `Foto ${recordsByRow.get(row).document.name}`,
          },
        }).commit();
      }
      state.attached[row] = card.card;
      await saveState(state);
    }
    if (Object.keys(state.attached).length % 20 === 0 && state.attached[row] === card.card) {
      console.log(`Attached ${Object.keys(state.attached).length}/265 photos`);
    }
  }
  console.log(`Import complete: ${Object.keys(state.created).length} members, ${Object.keys(state.attached).length} photos`);
}

main().catch((error) => {
  console.error(`Import stopped: ${error.message}`);
  process.exitCode = 1;
});
