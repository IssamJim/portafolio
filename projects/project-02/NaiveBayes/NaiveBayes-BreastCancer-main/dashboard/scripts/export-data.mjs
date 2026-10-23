import { writeFileSync } from 'node:fs';
import { readMat } from './mat.mjs';
import { predict, validateData } from '../dist/model.js';

const source = new URL('../../CasosTrainTestWisconsin.mat', import.meta.url);
const {Train: train, Test: test, Casos: all} = readMat(source);
for (const rows of [train, test, all]) {
  if (!rows?.length || rows.some(r => r.length !== 11 || ![2, 4].includes(r[10]) || r.slice(1, 10).some(x => !Number.isInteger(x) || x < 1 || x > 10))) throw new Error('Unexpected source dataset');
}
const model = {priors: {}, likelihoods: {}};
const counts = rows => ({benign: rows.filter(r => r[10] === 2).length, malignant: rows.filter(r => r[10] === 4).length, total: rows.length});
for (const c of [2, 4]) {
  const rows = train.filter(r => r[10] === c);
  model.priors[c] = rows.length / train.length;
  model.likelihoods[c] = Array.from({length: 10}, (_, v) => Array.from({length: 9}, (_, j) => (1 + rows.filter(r => r[j + 1] === v + 1).length) / (rows.length + 10)));
}
const trainIds = new Set(train.map(r => r[0]));
const testIds = new Set(test.map(r => r[0]));
const trainRows = new Set(train.map(r => JSON.stringify(r)));
const sharedIds = [...testIds].filter(id => trainIds.has(id));
const sharedRows = [...new Set(test.map(r => JSON.stringify(r)))].filter(r => trainRows.has(r));
const data = {
  schemaVersion: 1,
  provenance: {source: 'CasosTrainTestWisconsin.mat', verification: 'Clasificador.mat', method: 'Categorical Naive Bayes · Laplace smoothing α = 1', split: 'Fixed split supplied with the project; split-generation procedure unavailable.', train: counts(train), test: counts(test), all: counts(all), sharedIds, sharedRows: sharedRows.length},
  model,
  records: test.map((r, index) => ({index, id: r[0], values: r.slice(1, 10), actual: r[10], predicted: predict(r.slice(1, 10), model).label, sharedId: trainIds.has(r[0]), duplicate: trainRows.has(JSON.stringify(r))}))
};
validateData(data);
const saved = readMat(new URL('../../Clasificador.mat', import.meta.url));
if (data.records.some((r, i) => r.predicted !== saved.Conteo[i][2])) throw new Error('Predictions differ from saved MATLAB workspace');
writeFileSync(new URL('../dist/data.json', import.meta.url), JSON.stringify(data));
console.log(`Exported ${data.records.length} verified test predictions; ${sharedIds.length} shared IDs; ${sharedRows.length} identical rows.`);
