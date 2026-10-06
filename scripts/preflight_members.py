"""Validate the client workbook and prepare member documents without writing to Sanity.

Usage: python scripts/preflight_members.py [--write-plan]
The optional plan contains names and stays in the ignored local outputs directory.
"""

from __future__ import annotations

import argparse
import hashlib
import io
import json
import re
import sys
import unicodedata
import urllib.parse
import urllib.request
import xml.etree.ElementTree as ET
import zipfile
from collections import Counter, defaultdict
from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]
WORKBOOK = ROOT / "docs" / "data fungsionaris.xlsx"
OUTPUT = ROOT / "outputs" / "member-import-preflight" / "dry-run.json"
NS = "{http://schemas.openxmlformats.org/spreadsheetml/2006/main}"
TERM = "2026"

# Only documented spelling differences between workbook roles and Sanity units.
ALIASES = {
    "Departemen Kaderisasi dan Pengembangan Sumber Daya Mahasiswa":
        "Departemen Kaderisasi dan Pengembangan",
    "Departemen Advokasi Kesejahteraan Mahasiswa":
        "Departemen Advokasi dan Kesejahteraan Mahasiswa",
}


def clean(value: str) -> str:
    return " ".join(unicodedata.normalize("NFC", value).split())


def match_key(value: str) -> str:
    value = unicodedata.normalize("NFKC", value).casefold().replace("&", "dan")
    return re.sub(r"[\s,]+", " ", value).strip()


def public_env(name: str) -> str:
    lines = (ROOT / ".env.local").read_text(encoding="utf-8").splitlines()
    for line in lines:
        key, separator, value = line.partition("=")
        if separator and key.strip() == name:
            return value.strip().strip('"\'')
    raise ValueError(f"Missing public environment setting: {name}")


def read_workbook() -> tuple[list[dict[str, str | int]], list[int], str]:
    source = WORKBOOK.read_bytes()
    with zipfile.ZipFile(io.BytesIO(source)) as archive:
        sheets = [
            name for name in archive.namelist()
            if re.fullmatch(r"xl/worksheets/sheet\d+\.xml", name)
        ]
        if sheets != ["xl/worksheets/sheet1.xml"]:
            raise ValueError(f"Expected one worksheet; found {len(sheets)}")

        shared = []
        if "xl/sharedStrings.xml" in archive.namelist():
            root = ET.fromstring(archive.read("xl/sharedStrings.xml"))
            shared = [
                "".join(text.text or "" for text in item.iter(f"{NS}t"))
                for item in root.findall(f"{NS}si")
            ]

        sheet = ET.fromstring(archive.read(sheets[0]))
        rows = []
        for row in sheet.findall(f".//{NS}sheetData/{NS}row"):
            cells = {}
            for cell in row.findall(f"{NS}c"):
                column = re.match(r"[A-Z]+", cell.attrib["r"]).group()
                value = cell.find(f"{NS}v")
                if cell.attrib.get("t") == "s" and value is not None:
                    cells[column] = shared[int(value.text)]
                elif cell.attrib.get("t") == "inlineStr":
                    inline = cell.find(f"{NS}is")
                    cells[column] = "".join(inline.itertext()) if inline is not None else ""
                else:
                    cells[column] = value.text if value is not None else ""
            rows.append((int(row.attrib["r"]), cells))

    if not rows or rows[0][1].get("A") != "Jabatan" or rows[0][1].get("B") != "Nama Lengkap":
        raise ValueError("Expected columns A=Jabatan and B=Nama Lengkap")

    members = []
    blank_rows = []
    for source_row, cells in rows[1:]:
        if any(value.strip() for key, value in cells.items() if key not in {"A", "B"}):
            raise ValueError(f"Unexpected populated column in workbook row {source_row}")
        role = clean(cells.get("A", ""))
        name = clean(cells.get("B", ""))
        if not role and not name:
            blank_rows.append(source_row)
            continue
        if not role or not name:
            raise ValueError(f"Missing name or role in workbook row {source_row}")
        members.append({"sourceRow": source_row, "name": name, "role": role})

    return members, blank_rows, hashlib.sha256(source).hexdigest()


def sanity_query(query: str, project_id: str, dataset: str, api_version: str) -> list[dict]:
    if not re.fullmatch(r"[a-z0-9-]+", project_id):
        raise ValueError("Invalid public Sanity project ID")
    if not re.fullmatch(r"[a-z0-9-]+", dataset):
        raise ValueError("Invalid public Sanity dataset name")
    params = urllib.parse.urlencode({"query": query, "perspective": "published"})
    url = f"https://{project_id}.api.sanity.io/v{api_version}/data/query/{dataset}?{params}"
    request = urllib.request.Request(url, headers={"User-Agent": "bem-member-preflight/1.0"})
    with urllib.request.urlopen(request, timeout=20) as response:
        return json.load(response)["result"]


def unit_label(role: str) -> str | None:
    if role in {"Ketua", "Wakil Ketua", "Sekretaris Umum"}:
        return "Pengurus Inti"
    match = re.fullmatch(r"(?:Staf|(?:Wakil )?Kepala) ((?:Bidang|Biro|Departemen) .+)", role)
    return match.group(1) if match else None


def main() -> int:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--write-plan", action="store_true", help="save ignored local JSON with member names")
    args = parser.parse_args()

    members, blank_rows, workbook_hash = read_workbook()
    project_id = public_env("NEXT_PUBLIC_SANITY_PROJECT_ID")
    dataset = public_env("NEXT_PUBLIC_SANITY_DATASET")
    api_version = public_env("NEXT_PUBLIC_SANITY_API_VERSION")
    units = sanity_query(
        '*[_type == "organizationUnit" && term == "2026"]{_id,officialName,unitKind}',
        project_id, dataset, api_version,
    )
    existing = sanity_query(
        '*[_type == "member" && term == "2026"]{name}',
        project_id, dataset, api_version,
    )

    unit_by_key = defaultdict(list)
    for unit in units:
        unit_by_key[match_key(unit["officialName"])].append(unit)

    seen_names = defaultdict(list)
    existing_names = {match_key(member["name"]) for member in existing if member.get("name")}
    alias_uses = Counter()
    unit_counts = Counter()
    errors = []
    records = []
    aliases = {match_key(source): target for source, target in ALIASES.items()}

    for member in members:
        row = member["sourceRow"]
        name_key = match_key(member["name"])
        seen_names[name_key].append(row)
        if name_key in existing_names:
            errors.append(f"Row {row}: name already exists in published 2026 members")

        label = unit_label(member["role"])
        if label is None:
            errors.append(f"Row {row}: unsupported role label {member['role']!r}")
            continue
        key = match_key(label)
        if key in aliases:
            alias_uses[f"{label} -> {aliases[key]}"] += 1
            key = match_key(aliases[key])
        matches = unit_by_key.get(key, [])
        if len(matches) != 1:
            errors.append(f"Row {row}: {label!r} matched {len(matches)} published units")
            continue

        unit = matches[0]
        unit_counts[unit["officialName"]] += 1
        records.append({
            "sourceRow": row,
            "unitName": unit["officialName"],
            "document": {
                "_type": "member",
                "term": TERM,
                "name": member["name"],
                "role": member["role"],
                "organizationUnit": {"_type": "reference", "_ref": unit["_id"]},
                "displayOrder": row - 2,
            },
        })

    for name_rows in seen_names.values():
        if len(name_rows) > 1:
            errors.append(f"Duplicate workbook name at rows {name_rows}")

    summary = {
        "sourceRows": len(members),
        "blankSeparatorRows": blank_rows,
        "publishedUnits": len(units),
        "publishedMembersAlreadyPresent": len(existing),
        "mappedRows": len(records),
        "unitCounts": dict(sorted(unit_counts.items())),
        "aliasesUsed": dict(sorted(alias_uses.items())),
        "errors": errors,
    }
    print(json.dumps(summary, ensure_ascii=False, indent=2))
    if errors:
        return 1

    if args.write_plan:
        OUTPUT.parent.mkdir(parents=True, exist_ok=True)
        OUTPUT.write_text(json.dumps({
            "source": {
                "file": str(WORKBOOK.relative_to(ROOT)),
                "sha256": workbook_hash,
                "memberCount": len(members),
            },
            "target": {"projectId": project_id, "dataset": dataset, "term": TERM},
            "records": records,
        }, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
        print(f"Local dry-run plan written: {OUTPUT.relative_to(ROOT)}")
    return 0


if __name__ == "__main__":
    try:
        sys.exit(main())
    except (OSError, ValueError, zipfile.BadZipFile, KeyError) as error:
        print(f"Preflight failed: {error}", file=sys.stderr)
        sys.exit(1)
