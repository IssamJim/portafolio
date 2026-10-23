import { FEATURES, className, predict, evaluate, validateData } from './model.js';

const $ = id => document.getElementById(id);
const percent = value => value === null ? '—' : `${(value * 100).toFixed(2)}%`;
const state = {data: null, selected: 0, filter: 'all', query: '', actual: 'all', page: 0};
const pageSize = 7;
let ready = false;

async function load() {
  $('dashboard').hidden = true;
  $('load-status').hidden = false;
  $('load-status').setAttribute('role', 'status');
  $('load-status').innerHTML = '<span class="spinner"></span> Loading the saved experiment…';
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 12000);
  try {
    const response = await fetch('./data.json', {signal: controller.signal});
    if (!response.ok) throw new Error(`Data request failed (${response.status}).`);
    state.data = validateData(await response.json());
    if (!state.data.records.length) {
      $('load-status').innerHTML = '<h2>No test samples available</h2><p>The experiment has a model, but no test results to explore. Export the source data again to populate this dashboard.</p><button id="retry" class="button button-white">Reload experiment</button>';
      $('retry').onclick = load;
      return;
    }
    if (!ready) bindEvents();
    renderOverview();
    $('sample').innerHTML = state.data.records.map((r, i) => `<option value="${i}">Sample ${r.id} · row ${i + 1} · ${className(r.actual)}${r.actual !== r.predicted ? ' · misclassified' : ''}</option>`).join('');
    $('sliders').innerHTML = FEATURES.map((name, j) => `<div><label class="slider-label" for="feature-${j}"><span>${name}</span><output id="value-${j}" for="feature-${j}"></output></label><input id="feature-${j}" data-feature="${j}" type="range" min="1" max="10" step="1" aria-label="${name}"><div class="range-labels" aria-hidden="true"><span>1</span><span>10</span></div></div>`).join('');
    selectSample(0);
    renderTable();
    $('load-status').hidden = true;
    $('dashboard').hidden = false;
  } catch (error) {
    $('load-status').setAttribute('role', 'alert');
    $('load-status').innerHTML = '<h2>We couldn’t load this experiment</h2><p id="error-message"></p><button id="retry" class="button button-white">Try again ↻</button><p class="small-note">Run the local server with npm start. If the data is missing or invalid, run npm run build.</p>';
    $('error-message').textContent = error.name === 'AbortError' ? 'The data request timed out. Check that the local server is running.' : error.message;
    $('retry').onclick = load;
  } finally {clearTimeout(timeout);}
}

function renderOverview() {
  const {records, provenance: p} = state.data;
  const stats = evaluate(records);
  const metrics = [
    ['Overall accuracy', (stats.accuracy * 100).toFixed(2), '%', `${stats.correct} of ${stats.total} test samples correct`, '↗'],
    ['Malignant recall', (stats.recall * 100).toFixed(0), '%', `${stats.matrix[1][1]} of ${p.test.malignant} malignant samples detected`, '◎'],
    ['Misclassified samples', stats.total - stats.correct, '', `${stats.matrix[0][1]} benign samples predicted malignant`, '≠']
  ];
  $('metrics').innerHTML = metrics.map(([label, value, suffix, caption, icon], i) => `<article class="card metric ${i === 0 ? 'metric-accent' : ''}"><div class="metric-label">${label}<span class="metric-icon" aria-hidden="true">${icon}</span></div><p class="metric-value">${value}<small>${suffix}</small></p><p class="metric-caption">${caption}</p></article>`).join('');
  $('shared-count').textContent = p.sharedIds.length;
  $('overlap-number').textContent = p.sharedIds.length;
  $('duplicate-number').textContent = p.sharedRows;
  $('matrix').innerHTML = `<table class="confusion" aria-label="Confusion matrix: actual class in rows, predicted class in columns"><thead><tr><th scope="col">Actual / predicted</th><th scope="col">Benign</th><th scope="col">Malignant</th></tr></thead><tbody><tr><th scope="row">Benign</th><td>${stats.matrix[0][0]}</td><td class="off">${stats.matrix[0][1]}</td></tr><tr><th scope="row">Malignant</th><td class="zero">${stats.matrix[1][0]}</td><td>${stats.matrix[1][1]}</td></tr></tbody></table>`;
  $('extra-metrics').innerHTML = [['Malignant precision', stats.precision], ['Malignant F1-score', stats.f1], ['Benign recall / specificity', stats.specificity]].map(([label, value]) => `<div><span>${label}</span><b>${percent(value)}</b></div>`).join('');
  $('dataset-split').innerHTML = `<div class="dataset-values"><div><strong>${p.train.total}</strong>Training samples</div><div><strong>${p.test.total}</strong>Test samples</div><div><strong>${p.all.total}</strong>Total</div></div><div class="split-bar" aria-label="${p.train.total} training samples and ${p.test.total} test samples"><span style="width:${p.train.total / p.all.total * 100}%"></span></div>`;
}

function selectSample(index) {
  state.selected = index;
  $('sample').value = index;
  state.data.records[index].values.forEach((value, j) => {$(`feature-${j}`).value = value;});
  renderPrediction();
}

function renderPrediction() {
  const record = state.data.records[state.selected];
  const values = FEATURES.map((_, j) => Number($(`feature-${j}`).value));
  values.forEach((value, j) => {$(`value-${j}`).textContent = value;});
  const modified = values.some((v, j) => v !== record.values[j]);
  const result = predict(values, state.data.model);
  $('input-kind').textContent = modified ? 'Hypothetical · edited inputs' : 'Real test sample';
  $('actual-label').textContent = modified ? 'Actual class unknown for edited inputs' : `Actual: ${className(record.actual)}${record.sharedId ? ' · ID also in training' : ''}`;
  const agrees = result.label === record.actual;
  let explanation = modified ? 'No ground-truth label exists for these edited values.' : `Ground truth: ${className(record.actual)}. ${agrees ? 'This prediction matches the saved test label.' : 'This is one of the misclassified test samples.'}`;
  if (!modified && record.duplicate) explanation += ' This exact row also appears in training.';
  $('prediction').innerHTML = `<div><p class="prediction-kicker">MODEL PREDICTION</p><div class="prediction-title"><span class="prediction-symbol" aria-hidden="true">${result.label === 2 ? '↘' : '↗'}</span>${className(result.label)}</div><p class="prediction-sub">${modified ? 'Hypothetical sample · live calculation' : `Sample ${record.id} · test row ${state.selected + 1}`}</p></div><div class="support-block"><div class="support-label"><span>Relative model support</span><span>Normalized class scores</span></div><div class="support-bar" role="img" aria-label="Benign support ${percent(result.support[0])}; malignant support ${percent(result.support[1])}"><span class="support-benign" style="width:${result.support[0] * 100}%"></span><span class="support-malignant" style="width:${result.support[1] * 100}%"></span></div><div class="support-legend"><span>Benign <b>${percent(result.support[0])}</b></span><span>Malignant <b>${percent(result.support[1])}</b></span></div></div><div class="prediction-note"><strong>${modified ? 'Exploration mode' : agrees ? 'Correct on this test sample' : 'Misclassified on this test sample'}</strong>${explanation}<p class="mt-3">These scores explain the model’s choice. They are not calibrated clinical risk estimates.</p></div>`;
  const scale = Math.max(1, ...result.evidence.map(Math.abs));
  $('evidence-chart').innerHTML = result.evidence.map((value, j) => `<div class="evidence-row"><span>${FEATURES[j]}</span><div class="evidence-track" aria-hidden="true"><span class="evidence-half"><span class="evidence-bar" style="width:${value < 0 ? Math.abs(value) / scale * 100 : 0}%"></span></span><span class="evidence-half"><span class="evidence-bar" style="width:${value > 0 ? value / scale * 100 : 0}%"></span></span></div><span>${value.toFixed(2)} · ${value > 0 ? 'malignant' : value < 0 ? 'benign' : 'neutral'}</span></div>`).join('');
  const {priors} = state.data.model;
  $('prior-note').textContent = `Training priors: benign ${percent(priors[2])}, malignant ${percent(priors[4])}. Prior log ratio: ${Math.log(priors[4] / priors[2]).toFixed(2)}. Contributions use natural logarithms.`;
}

function filteredRecords() {
  return state.data.records.filter(r => String(r.id).includes(state.query) && (state.actual === 'all' || r.actual === Number(state.actual)) && (state.filter === 'all' || state.filter === 'errors' && r.actual !== r.predicted || state.filter === 'overlap' && r.sharedId));
}

function renderTable() {
  const records = filteredRecords();
  state.page = Math.min(state.page, Math.max(0, Math.ceil(records.length / pageSize) - 1));
  const start = state.page * pageSize;
  const subset = records.slice(start, start + pageSize);
  $('result-count').textContent = records.length;
  $('rows').innerHTML = subset.map(r => `<tr><td>${r.id}${r.sharedId ? '<span title="ID also appears in training" aria-label="ID also appears in training"> ◇</span>' : ''}</td><td><span class="class-pill ${r.actual === 4 ? 'malignant' : ''}">${className(r.actual)}</span></td><td><span class="class-pill ${r.predicted === 4 ? 'malignant' : ''}">${className(r.predicted)}</span></td><td><span class="${r.actual === r.predicted ? 'result-pass' : 'result-fail'}">${r.actual === r.predicted ? '✓ Correct' : '↗ Misclassified'}</span></td><td><button class="row-button" data-sample="${r.index}" aria-label="Explore sample ${r.id}, test row ${r.index + 1}">↗</button></td></tr>`).join('');
  $('empty-results').hidden = records.length > 0;
  $('page-info').textContent = records.length ? `Showing ${start + 1}–${Math.min(start + pageSize, records.length)} of ${records.length} samples` : '0 matching samples';
  $('previous').disabled = state.page === 0;
  $('next').disabled = start + pageSize >= records.length;
  $('export').disabled = records.length === 0;
  $('export').textContent = state.filter !== 'all' || state.query || state.actual !== 'all' ? '↓ Export filtered results' : '↓ Export results';
}

function bindEvents() {
  ready = true;
  $('sample').addEventListener('change', e => selectSample(Number(e.target.value)));
  $('sliders').addEventListener('input', e => {if (e.target.matches('input[type=range]')) renderPrediction();});
  $('reset').addEventListener('click', () => selectSample(state.selected));
  $('search').addEventListener('input', e => {state.query = e.target.value.trim(); state.page = 0; renderTable();});
  $('class-filter').addEventListener('change', e => {state.actual = e.target.value; state.page = 0; renderTable();});
  document.querySelectorAll('[data-filter]').forEach(button => button.addEventListener('click', () => {
    state.filter = button.dataset.filter;
    state.page = 0;
    document.querySelectorAll('[data-filter]').forEach(b => {b.classList.toggle('active', b === button); b.setAttribute('aria-pressed', String(b === button));});
    renderTable();
  }));
  $('clear-filters').addEventListener('click', () => {
    state.query = ''; state.actual = 'all'; $('search').value = ''; $('class-filter').value = 'all';
    document.querySelector('[data-filter="all"]').click();
  });
  $('previous').addEventListener('click', () => {state.page--; renderTable();});
  $('next').addEventListener('click', () => {state.page++; renderTable();});
  $('rows').addEventListener('click', e => {
    const button = e.target.closest('[data-sample]');
    if (!button) return;
    selectSample(Number(button.dataset.sample));
    $('workbench').scrollIntoView({behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth'});
    $('sample').focus({preventScroll:true});
  });
  $('export').addEventListener('click', () => {
    const csv = [['test_row', 'sample_id', ...FEATURES, 'actual_class', 'predicted_class', 'correct', 'id_in_training', 'exact_row_in_training'], ...filteredRecords().map(r => [r.index + 1, r.id, ...r.values, className(r.actual), className(r.predicted), r.actual === r.predicted, r.sharedId, r.duplicate])].map(row => row.join(',')).join('\r\n');
    const url = URL.createObjectURL(new Blob([csv], {type:'text/csv;charset=utf-8'}));
    const a = document.createElement('a'); a.href = url; a.download = 'wisconsin-test-results.csv'; a.click(); setTimeout(() => URL.revokeObjectURL(url), 1000);
  });
  const links = [...document.querySelectorAll('.nav-link')];
  const observer = new IntersectionObserver(entries => {
    const visible = entries.filter(e => e.isIntersecting).sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top)[0];
    if (!visible) return;
    links.forEach(link => {const active = link.hash === `#${visible.target.id}`; link.classList.toggle('active', active); if(active) link.setAttribute('aria-current', 'location'); else link.removeAttribute('aria-current');});
  }, {rootMargin:'-5% 0px -60% 0px'});
  document.querySelectorAll('#overview, #workbench, #results, #quality').forEach(section => observer.observe(section));
}

load();
