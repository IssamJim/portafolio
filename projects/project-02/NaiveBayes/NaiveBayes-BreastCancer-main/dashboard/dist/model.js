export const FEATURES = ['Clump thickness', 'Cell size uniformity', 'Cell shape uniformity', 'Marginal adhesion', 'Epithelial cell size', 'Bare nuclei', 'Bland chromatin', 'Normal nucleoli', 'Mitoses'];
export const className = value => value === 4 ? 'Malignant' : 'Benign';

export function predict(values, model) {
  if (values.length !== 9 || values.some(v => !Number.isInteger(v) || v < 1 || v > 10)) throw new Error('All nine feature values must be integers from 1 to 10.');
  const logs = [2, 4].map(c => Math.log(model.priors[c]) + values.reduce((sum, v, j) => sum + Math.log(model.likelihoods[c][v - 1][j]), 0));
  const max = Math.max(...logs);
  const weights = logs.map(x => Math.exp(x - max));
  const support = weights.map(w => w / (weights[0] + weights[1]));
  return {label: logs[0] > logs[1] ? 2 : 4, support, logs, evidence: values.map((v, j) => Math.log(model.likelihoods[4][v - 1][j] / model.likelihoods[2][v - 1][j]))};
}

export function evaluate(records) {
  const matrix = [[0, 0], [0, 0]];
  for (const r of records) matrix[r.actual === 4 ? 1 : 0][r.predicted === 4 ? 1 : 0]++;
  const [[tn, fp], [fn, tp]] = matrix;
  const ratio = (a, b) => b ? a / b : null;
  return {matrix, correct: tn + tp, total: records.length, accuracy: ratio(tn + tp, records.length), recall: ratio(tp, tp + fn), precision: ratio(tp, tp + fp), specificity: ratio(tn, tn + fp), f1: ratio(2 * tp, 2 * tp + fp + fn)};
}

export function validateData(data) {
  if (data?.schemaVersion !== 1 || !Array.isArray(data.records) || !data.model || !data.provenance) throw new Error('The experiment data has an unsupported format.');
  for (const c of [2, 4]) {
    const table = data.model.likelihoods?.[c];
    if (!(data.model.priors?.[c] > 0 && data.model.priors[c] < 1) || !Array.isArray(table) || table.length !== 10 || table.some(row => !Array.isArray(row) || row.length !== 9 || row.some(p => !Number.isFinite(p) || p <= 0 || p > 1))) throw new Error('The model contains invalid probabilities.');
  }
  if (Math.abs(data.model.priors[2] + data.model.priors[4] - 1) > 1e-8) throw new Error('Class priors must sum to one.');
  for (let j = 0; j < 9; j++) for (const c of [2, 4]) if (Math.abs(data.model.likelihoods[c].reduce((sum, row) => sum + row[j], 0) - 1) > 1e-8) throw new Error('Feature likelihoods must sum to one.');
  data.records.forEach(r => {
    if (!Number.isFinite(r.id) || ![2, 4].includes(r.actual) || ![2, 4].includes(r.predicted) || !Array.isArray(r.values)) throw new Error('Invalid test record.');
    if (predict(r.values, data.model).label !== r.predicted) throw new Error('Saved predictions do not match the model.');
  });
  return data;
}
