import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { readMat } from '../scripts/mat.mjs';
import { predict, evaluate, validateData } from '../dist/model.js';

const data = JSON.parse(readFileSync(new URL('../dist/data.json', import.meta.url)));
const original = readMat(new URL('../../Clasificador.mat', import.meta.url));

test('All 239 predictions and normalized scores match saved MATLAB outputs', () => {
  assert.equal(data.records.length, 239);
  data.records.forEach((r, i) => {
    const result = predict(r.values, data.model);
    assert.equal(result.label, original.Conteo[i][2]);
    const [benign, malignant] = original.Conteo[i];
    assert.ok(Math.abs(result.support[1] - malignant / (benign + malignant)) < 1e-12);
  });
});
test('Evaluation uses malignant as positive and reproduces the confusion matrix', () => {
  const stats = evaluate(data.records);
  assert.deepEqual(stats.matrix, [[151, 4], [0, 84]]);
  assert.equal(stats.accuracy, 235 / 239);
  assert.equal(stats.precision, 84 / 88);
  assert.equal(stats.recall, 1);
  assert.equal(stats.f1, 168 / 172);
});
test('Model inputs reject missing, fractional, and out-of-range values', () => {
  for (const values of [[], Array(9).fill(0), Array(9).fill(11), Array(9).fill(1.5), Array(9).fill(NaN)]) assert.throws(() => predict(values, data.model));
  for (const value of [1, 10]) assert.ok(Number.isFinite(predict(Array(9).fill(value), data.model).support[0]));
});
test('Overlaps are measured from source and exported accurately', () => {
  assert.equal(data.provenance.sharedIds.length, 22);
  assert.equal(data.provenance.sharedRows, 4);
  assert.ok(data.records.some(r => r.sharedId));
  assert.equal(new Set(data.records.filter(r => r.duplicate).map(r => JSON.stringify([r.id, ...r.values, r.actual]))).size, 4);
});
test('Empty evaluation does not invent accuracy', () => {
  const stats = evaluate([]);
  assert.equal(stats.accuracy, null);
  assert.equal(stats.recall, null);
});
test('Bad data and mismatched predictions are rejected', () => {
  assert.equal(validateData(data), data);
  assert.throws(() => validateData({}));
  const broken = structuredClone(data); broken.records[0].predicted = broken.records[0].predicted === 2 ? 4 : 2;
  assert.throws(() => validateData(broken));
  const badProbability = structuredClone(data); badProbability.model.likelihoods[2][0][0] = 0;
  assert.throws(() => validateData(badProbability));
});
