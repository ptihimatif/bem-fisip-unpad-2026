/** Read-only Sanity preflight. Produces a reviewable four-field plan; never publishes. */
import { readFile, writeFile, mkdir } from "node:fs/promises";
import { createHash } from "node:crypto";
import { resolve } from "node:path";
import ts from "typescript";
import { getCliClient } from "sanity/cli";

const root = process.cwd();
const sourceHashes = {};
async function constants(path) {
  const source = await readFile(resolve(root, path), "utf8");
  sourceHashes[path] = createHash("sha256").update(source).digest("hex");
  const file = ts.createSourceFile(path, source, ts.ScriptTarget.Latest, true, ts.ScriptKind.TSX);
  const declarations = new Map();
  for (const statement of file.statements) {
    if (!ts.isVariableStatement(statement)) continue;
    for (const declaration of statement.declarationList.declarations) {
      if (ts.isIdentifier(declaration.name)) declarations.set(declaration.name.text, declaration.initializer);
    }
  }
  function literal(node) {
    if (!node) throw new Error("Missing source initializer");
    if (ts.isStringLiteral(node) || ts.isNumericLiteral(node)) return ts.isNumericLiteral(node) ? Number(node.text) : node.text;
    if (ts.isPrefixUnaryExpression(node) && node.operator === ts.SyntaxKind.MinusToken) return -literal(node.operand);
    if (ts.isAsExpression(node) || ts.isParenthesizedExpression(node)) return literal(node.expression);
    if (node.kind === ts.SyntaxKind.TrueKeyword) return true;
    if (node.kind === ts.SyntaxKind.FalseKeyword) return false;
    if (ts.isIdentifier(node)) return literal(declarations.get(node.text));
    if (ts.isArrayLiteralExpression(node)) return node.elements.flatMap((item) => ts.isSpreadElement(item) ? literal(item.expression) : [literal(item)]);
    if (ts.isObjectLiteralExpression(node)) return Object.fromEntries(node.properties.filter(ts.isPropertyAssignment).map((property) => [property.name.getText(file).replace(/^['"]|['"]$/g, ""), literal(property.initializer)]));
    throw new Error(`Unsupported source expression: ${node.getText(file)}`);
  }
  return (name) => literal(declarations.get(name));
}

async function main() {
  const [vision, missions, culture, logo] = await Promise.all([
    constants("components/about/VisiSection.tsx"), constants("components/about/MisiSection.tsx"),
    constants("components/about/BudayaKerjaSection.tsx"), constants("components/about/logo-section.ts"),
  ]);
  const keys = ["wave", "pendar", "mentari", "rays", "sun", "yellow", "blue", "synergy"];
  const set = {
    visionHighlights: vision("PENJABARAN").map((item) => ({ _key: `vision-${item.term}`, _type: "object", phrase: item.phrase, description: item.body })),
    missionItems: missions("MISI").map((item) => ({ _key: `mission-${item.no}`, _type: "object", title: item.title, description: item.body })),
    workCultureItems: culture("BUDAYA").map((item, index) => ({ _key: `culture-${index + 1}`, _type: "object", title: item.title, description: item.body })),
    logoExplanationItems: logo("explanations").slice(1).map((item, index) => ({ _key: `logo-${keys[index]}`, _type: "object", elementKey: keys[index], title: item.title, description: item.description })),
  };
  const counts = Object.values(set).map((items) => items.length).join(",");
  if (counts !== "3,5,3,8") throw new Error(`Unexpected source inventory: ${counts}`);
  const client = getCliClient({ projectId: "jcpcptq3", dataset: "production", apiVersion: "2026-09-04", useCdn: false });
  if (client.config().projectId !== "jcpcptq3" || client.config().dataset !== "production") throw new Error("Wrong Sanity target");
  const [current, draft] = await Promise.all([client.getDocument("cabinetProfile-2026"), client.getDocument("drafts.cabinetProfile-2026")]);
  if (!current || current._type !== "cabinetProfile" || current.term !== "2026") throw new Error("Expected 2026 cabinet document is missing");
  const existing = Object.fromEntries(Object.keys(set).map((key) => [key, current[key] ?? null]));
  const conflicts = Object.keys(set).filter((key) => current[key]?.length);
  const plan = { status: "REVIEW ONLY; NO PRODUCTION MUTATION", target: { projectId: "jcpcptq3", dataset: "production", documentId: current._id }, expectedRevision: current._rev, hasDraft: Boolean(draft), sourceHashes, existingStructuredFields: existing, conflicts, set };
  const output = resolve(root, "outputs/pre-release-cms/about-content-plan.json");
  await mkdir(resolve(root, "outputs/pre-release-cms"), { recursive: true });
  await writeFile(output, `${JSON.stringify(plan, null, 2)}\n`, "utf8");
  console.log(`Prepared read-only cabinet migration plan: 3 vision explanations, 5 missions, 3 culture cards, 8 logo explanations; ${conflicts.length} existing-field conflicts; draft=${Boolean(draft)}. No data published.`);
  console.log(output);
}
main().catch((error) => { console.error(error.message); process.exitCode = 1; });
