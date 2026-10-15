# Clinical5 static screening calculator

A dependency-free, bilingual, browser-local calculator for the frozen Clinical5 integer score.

## Frozen specification

- Version: `Clinical5_integer_20260914_v1`
- Population: adults aged ≥40 years without a prior COPD diagnosis
- Target: pre-bronchodilator airflow limitation (`FEV1/FVC <0.70`)
- Total score: 0–21
- Primary screening cutoff: ≥3
- A positive screen recommends spirometry; it is not a COPD diagnosis.

The executable rule is in `dist/src/scoring.js`; the machine-readable publication rule is in `dist/data/score-spec.json`.

## Local verification

Requires Node.js 20 or later. No package installation is needed.

```bash
node --test
node scripts/serve.mjs
```

Then open `http://127.0.0.1:4173`.

## GitHub Pages

The included workflow tests the frozen scoring boundaries before deploying `dist/`. In repository settings, select **GitHub Actions** as the Pages source. Every push to `main` will then test and deploy the site.

## Privacy and scope

All calculations run in the browser. Patient inputs are not sent to a server or written to local storage; only the language preference is retained. This research-use tool does not provide a diagnosis or replace clinical assessment.
