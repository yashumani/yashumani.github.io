# Gita Sadhana Cloud Automation

This directory contains the deterministic control plane for the public Gita Sadhana journey.

## Active schedule

- **7:07 AM America/New_York:** `.github/workflows/gita-daily-lesson.yml`
- **9:07 AM America/New_York:** `.github/workflows/gita-publish.yml`

The seven-minute offset is intentional. It remains “around 7” and “around 9” while avoiding GitHub Actions’ busiest top-of-hour window.

## Verified source chain

The daily teacher uses two complementary sources:

1. **Primary reading edition:** the official Sri Swami Sivananda / Divine Life Society PDF. Each run downloads the PDF, validates its PDF signature, extracts its text, confirms the edition’s explicit 701-verse statement, and checks first-verse and Chapter 13 sentinels.
2. **Exact Sanskrit source:** `gita-sadhana/data/sanskrit-701.json`, an immutable reduced corpus containing only ancient Devanagari text and Roman transliteration. It was built from a pinned upstream commit and verified against its Git blob hash. Its 701 positions, all chapter counts, and the distinctive 35-verse Chapter 13 numbering are revalidated before every lesson.

The former IIT Kanpur page is not an operational dependency. Its public site migrated to a JavaScript application in September 2026, so the automation deliberately avoids scraping its placeholder page.

## Daily delivery and publication

At 7:07 AM, GitHub Actions:

1. reads `gita-progress.json`;
2. chooses the exact next one or two verses without crossing a chapter boundary;
3. verifies the local Sanskrit corpus and downloads the official DLS PDF;
4. constructs verse-specific evidence and an authoritative teacher prompt;
5. uses GitHub Copilot CLI with the workflow’s short-lived `GITHUB_TOKEN`;
6. validates the generated bilingual lesson deterministically; and
7. creates a GitHub issue assigned to the repository owner.

That assigned issue is the morning listening lesson and the immutable staging record.

At 9:07 AM, GitHub Actions:

1. finds the oldest unprocessed packet;
2. validates its expected state, IDs, sequence, verse boundaries, and content fields;
3. publishes the exact staged lesson objects without interpretive rewriting;
4. updates the manifest and public progress in one commit;
5. waits until GitHub Pages exposes the new JSON; and
6. comments on and closes the staging issue.

## Safety properties

- The AI never decides which verse comes next.
- A failed run cannot advance `gita-progress.json`.
- A packet is idempotent and can be retried safely.
- Previously explored Gita 5.18 does not count toward sequential completion.
- The selected Sri Swami Sivananda / Divine Life Society numbering remains 701.
- The 35-verse Chapter 13 numbering is tested explicitly.
- Exact Sanskrit and transliteration are supplied as evidence rather than generated from memory.
- No long-lived API key is stored in the repository.
- Failures create a deduplicated alert issue assigned to the owner.

## Main commands

```bash
node gita-sadhana/automation/gita-automation.mjs self-test
node gita-sadhana/automation/source-preflight.mjs
node gita-sadhana/automation/gita-automation.mjs stage
node gita-sadhana/automation/gita-automation.mjs publish
node gita-sadhana/automation/gita-automation.mjs verify
node gita-sadhana/automation/gita-automation.mjs close
node gita-sadhana/automation/gita-automation.mjs alert
```

The scheduled workflows also expose `workflow_dispatch` for an intentional manual run from GitHub Actions.
