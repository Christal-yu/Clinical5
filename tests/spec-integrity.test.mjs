import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { MODEL_VERSION, PRIMARY_CUTOFF, MAX_SCORE, RISK_INTERCEPT, RISK_SLOPE } from "../dist/src/scoring.js";

const spec = JSON.parse(await readFile(new URL("../dist/data/score-spec.json", import.meta.url), "utf8"));

test("machine-readable specification matches executable constants", () => {
  assert.equal(spec.version, MODEL_VERSION);
  assert.deepEqual(spec.score_range, [0, MAX_SCORE]);
  assert.equal(spec.primary_cutoff, PRIMARY_CUTOFF);
  assert.equal(spec.risk_model.intercept, RISK_INTERCEPT);
  assert.equal(spec.risk_model.slope, RISK_SLOPE);
});

test("published category points match the frozen score", () => {
  assert.deepEqual(spec.items.sex, {female: 0, male: 2});
  assert.deepEqual(spec.items.history_of_asthma, {no: 0, yes: 6});
  assert.deepEqual(spec.items.age_years.map(x => x.points), [0,1,2,3,4,5,6,7]);
  assert.deepEqual(spec.items.bmi_kg_m2.map(x => x.points), [3,1,0,1]);
  assert.deepEqual(spec.items.pack_years.map(x => x.points), [0,1,2,2,3]);
});
