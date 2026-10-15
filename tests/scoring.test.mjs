import test from "node:test";
import assert from "node:assert/strict";
import {
  MODEL_VERSION, PRIMARY_CUTOFF, MAX_SCORE,
  agePoints, sexPoints, bmiPoints, packYearsPoints, asthmaPoints,
  calculateBmi, calculatePackYears, predictedRisk, calculateScore,
} from "../dist/src/scoring.js";

test("frozen version and cutoff are the final rule", () => {
  assert.equal(MODEL_VERSION, "Clinical5_integer_20260914_v1");
  assert.equal(PRIMARY_CUTOFF, 3);
  assert.equal(MAX_SCORE, 21);
});

test("age boundaries are exact", () => {
  const cases = [[40,0],[44,0],[45,1],[49,1],[50,2],[54,2],[55,3],[59,3],[60,4],[64,4],[65,5],[69,5],[70,6],[74,6],[75,7],[100,7]];
  for (const [input, expected] of cases) assert.equal(agePoints(input), expected, `age ${input}`);
});

test("BMI boundaries are exact", () => {
  const cases = [[18.49,3],[18.5,1],[23.99,1],[24,0],[27.99,0],[28,1],[40,1]];
  for (const [input, expected] of cases) assert.equal(bmiPoints(input), expected, `BMI ${input}`);
});

test("pack-year boundaries are exact", () => {
  const cases = [[0,0],[0.01,1],[10,1],[10.01,2],[20,2],[20.01,2],[40,2],[40.01,3]];
  for (const [input, expected] of cases) assert.equal(packYearsPoints(input), expected, `pack-years ${input}`);
});

test("sex and asthma points are exact", () => {
  assert.equal(sexPoints("female"), 0);
  assert.equal(sexPoints("male"), 2);
  assert.equal(asthmaPoints("no"), 0);
  assert.equal(asthmaPoints("yes"), 6);
});

test("helper calculations are correct", () => {
  assert.ok(Math.abs(calculateBmi(170, 68) - 23.5294117647) < 1e-9);
  assert.equal(calculatePackYears([{cigarettesPerDay: 10, years: 20}, {cigarettesPerDay: 20, years: 5}]), 15);
});

test("cutoff classifies score 2 as negative and score 3 as positive", () => {
  const score2 = calculateScore({age:40, sex:"male", bmi:25, packYears:0, asthma:"no"});
  const score3 = calculateScore({age:55, sex:"female", bmi:25, packYears:0, asthma:"no"});
  assert.equal(score2.total, 2);
  assert.equal(score2.screenPositive, false);
  assert.equal(score3.total, 3);
  assert.equal(score3.screenPositive, true);
});

test("minimum and maximum scores are 0 and 21", () => {
  const minimum = calculateScore({age:40, sex:"female", bmi:25, packYears:0, asthma:"no"});
  const maximum = calculateScore({age:75, sex:"male", bmi:18, packYears:41, asthma:"yes"});
  assert.equal(minimum.total, 0);
  assert.equal(maximum.total, 21);
});

test("all 640 category combinations stay within the frozen range", () => {
  const ages = [40,45,50,55,60,65,70,75];
  const sexes = ["female","male"];
  const bmis = [18,20,25,30];
  const packs = [0,5,15,30,50];
  const asthma = ["no","yes"];
  let count = 0;
  for (const age of ages) for (const sex of sexes) for (const bmi of bmis) for (const packYears of packs) for (const history of asthma) {
    const result = calculateScore({age,sex,bmi,packYears,asthma:history});
    assert.ok(Number.isInteger(result.total));
    assert.ok(result.total >= 0 && result.total <= 21);
    count += 1;
  }
  assert.equal(count, 640);
});

test("risk mapping uses the frozen logistic equation", () => {
  assert.ok(Math.abs(predictedRisk(0) - 0.00736860972551582) < 1e-14);
  const expected21 = 1 / (1 + Math.exp(-(-4.9031303382268 + 0.393767915695901 * 21)));
  assert.ok(Math.abs(predictedRisk(21) - expected21) < 1e-14);
});

test("invalid values are rejected", () => {
  assert.throws(() => agePoints(39));
  assert.throws(() => bmiPoints(0));
  assert.throws(() => packYearsPoints(-1));
  assert.throws(() => calculateBmi(80, 60));
});
