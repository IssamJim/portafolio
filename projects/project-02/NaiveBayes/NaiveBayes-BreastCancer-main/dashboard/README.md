# Bayes Lab dashboard

A local HTML, Tailwind CSS, and vanilla JavaScript dashboard for the original MATLAB experiment. No backend service, CDN, tracking, or runtime framework is required. The existing MATLAB files are unchanged.

## Run

With Node.js installed, open a terminal in this `dashboard` directory:

```sh
npm ci
npm run build
npm test
npm start
```

Open http://127.0.0.1:4173. Use `PORT` to select a different port. The checked-in `dist` folder includes the compiled CSS and exported data, so `npm start` alone can serve the existing snapshot without installing build dependencies. Opening `index.html` directly from the filesystem is unsupported because the page fetches JSON and uses JavaScript modules.

## Explore

- Overview metrics and the confusion matrix use the real supplied test set.
- Choose a test sample, edit its nine sliders, and inspect feature log likelihood ratios. Edited inputs are explicitly hypothetical and do not change the dataset or evaluation metrics. Reset restores the selected sample.
- Filter by sample ID, actual class, misclassification, or training-set overlap. The arrow in a row opens that exact test row in the prediction lab; IDs are not assumed unique.
- CSV export follows the active table filters and includes all matching rows, not just the current page.
- Data failures show a retry action; empty experiments and empty search results have dedicated states.

## Data and model

`npm run data` reads `../CasosTrainTestWisconsin.mat` and exports `dist/data.json`. The numeric MAT v5 reader uses Node's standard library; it is intentionally scoped to these repository files. The export reconstructs categorical Naive Bayes using Laplace smoothing with alpha 1 and verifies every predicted label against `../Clasificador.mat`. The automated tests also compare normalized class scores with the saved MATLAB results.

The browser computes scores in log space, then normalizes the two class scores. This avoids numerical underflow but does not calibrate the model. Displayed support is not a clinical risk estimate. The dashboard consistently treats malignant as the positive class, whereas the MATLAB script treats benign as positive.

The supplied split has 444 training and 239 test rows, 22 shared sample IDs, and four distinct identical rows in both sets. These limitations remain visible. No live activity log or repeated experiments are present; the UI makes no claims about recent training activity. This is an educational experiment, not a validated diagnostic system.

## Files

- `dist/index.html`: semantic dashboard structure.
- `dist/app.js`: interactions and rendering.
- `dist/model.js`: prediction, evaluation, and data validation shared with tests.
- `src/styles.css`: Tailwind entry and responsive component styles.
- `dist/styles.css`: generated static stylesheet.
- `dist/data.json`: generated source-derived model and test records.
- `scripts/export-data.mjs`, `scripts/mat.mjs`: reproducible data export.
- `scripts/serve.mjs`: local-only static preview server.
- `tests/model.test.mjs`: regression tests against the original experiment.

After changing the source data, export again and run tests. The MATLAB workspace must correspond to the same experiment; mismatches intentionally fail export. After changing CSS or utility classes, run `npm run build`.
