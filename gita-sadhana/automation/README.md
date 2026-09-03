# Gita Sadhana Cloud Automation

This directory contains the deterministic control plane for the public Gita Sadhana journey.

## Active schedule

- **7:07 AM America/New_York:** `.github/workflows/gita-daily-lesson.yml`
- **9:07 AM America/New_York:** `.github/workflows/gita-publish.yml`

The seven-minute offset is intentional. It remains “around 7” and “around 9” while avoiding GitHub Actions’ busiest top-of-hour window.

## Delivery and publication

At 7:07 AM, GitHub Actions:

1. reads `gita-progress.json`;
2. chooses the exact next one or two verses without crossing a chapter boundary;
3. downloads the official Divine Life Society PDF and verse-specific IIT Kanpur Gita Supersite pages;
4. uses GitHub Copilot CLI with the workflow’s short-lived `GITHUB_TOKEN`;
5. validates the generated bilingual lesson deterministically; and
6. creates an issue assigned to the repository owner.

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
- No long-lived API key is stored in the repository.
- Failures create a deduplicated alert issue assigned to the owner.

## Commands

```bash
node gita-sadhana/automation/gita-automation.mjs self-test
node gita-sadhana/automation/gita-automation.mjs prepare
node gita-sadhana/automation/gita-automation.mjs stage
node gita-sadhana/automation/gita-automation.mjs publish
node gita-sadhana/automation/gita-automation.mjs verify
node gita-sadhana/automation/gita-automation.mjs close
node gita-sadhana/automation/gita-automation.mjs alert
```

The scheduled workflows also expose `workflow_dispatch` for an intentional manual run from GitHub Actions.
