import assert from "node:assert/strict";
import test from "node:test";
import { publicationFilters } from "../lib/publications";

test("publication filters normalize unknown values and reject unsafe page offsets", () => {
  for (const page of ["-1", "1tail", "Infinity", "9007199254740993", "9007199254740991", "0"]) {
    assert.equal(publicationFilters({ page }).page, 1);
  }
  assert.deepEqual(publicationFilters({ category: "KAJIAN", sort: "TERLAMA", page: "2" }), { category: "kajian", sort: "terlama", page: 2 });
  assert.deepEqual(publicationFilters({ category: "invalid", sort: "invalid", page: ["2"] }), { category: "semua", sort: "terbaru", page: 1 });
});
