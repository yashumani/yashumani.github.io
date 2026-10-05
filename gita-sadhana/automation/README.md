# Gita Sadhana automation: historical and manual tools

The complete 701-verse study archive has been prepared and published from locally validated, independently assistant-reviewed content. The public state is in `../gita-progress.json`, `../content/manifest.json`, `../content/lessons/`, and `../content/complete-archive.json`. See [`../AUTOMATION.md`](../AUTOMATION.md) for the current public archive and source policy.

There is no recurring Gita generation or publication schedule. The teacher, manual publisher, one-shot bulk, quota audit, and transcription repair workflows remain in `.github/workflows/` as historical or manually dispatched recovery tools. They must not be used to regenerate this complete archive or to incur Copilot usage. The original pilot's monthly provider quota failure is historical recovery evidence; it was not a dependency of local completion.

For current deterministic checks, run:

```bash
node gita-sadhana/automation/verify-complete-publication.mjs
node gita-sadhana/automation/gita-automation.mjs self-test
node gita-sadhana/automation/gita-bulk.mjs self-test
node gita-sadhana/automation/gita-bulk-worker.mjs self-test
npm run check:static
npm run check:syntax
```

The `verify-complete-publication.mjs` check requires all 701 tracked, published lessons in canonical order. It is wired into the main-branch site-quality workflow. The pinned corpus and primary source edition remain documented in `../AUTOMATION.md`.
