# Gita Sadhana — Active Daily Automation

The daily Bhagavad Gita journey is scheduled in GitHub Actions and runs independently of Mani’s phone or computer.

## Active schedules

| Workflow | Time | Purpose |
|---|---:|---|
| `Gita Sadhana — 7 AM Daily Lesson` | **7:07 AM America/New_York, daily** | Generates, verifies, validates, and delivers the next listening lesson as an assigned GitHub issue |
| `Gita Sadhana — 9 AM Website Publisher` | **9:07 AM America/New_York, daily** | Publishes the exact staged lesson to the public site, updates progress, verifies deployment, and closes the issue |

The seven-minute offset is deliberate: it satisfies the requested “around 7” and “around 9” schedule while avoiding the busiest top-of-hour GitHub Actions window.

## Public destination

- Website: https://yashumani.github.io/gita-sadhana/
- Repository: https://github.com/yashumani/yashumani.github.io
- Progress state: `gita-sadhana/gita-progress.json`
- Manifest: `gita-sadhana/content/manifest.json`
- Lesson files: `gita-sadhana/content/lessons/`
- Exact Sanskrit corpus: `gita-sadhana/data/sanskrit-701.json`

## Morning experience

The 7:07 AM workflow creates a GitHub issue assigned to `yashumani`. GitHub delivers that through the account’s enabled web, mobile, and email notification settings. The issue contains the complete listening-friendly lesson:

- exact Sanskrit in Devanagari;
- Roman transliteration;
- natural spoken Hindi;
- clear English as a second lens;
- meaningful interpretive comparisons where necessary;
- modern-life application;
- Hindi and English reflection questions;
- source notes; and
- the exact validated website-publication packet.

## Two-stage integrity

The 9:07 AM task is not a second writer. It validates and publishes the same packet produced at 7:07 AM. This prevents the morning lesson and the website from drifting apart.

The workflow rejects a packet when it is stale, malformed, out of sequence, crosses a chapter boundary, duplicates an ID, conflicts with an existing lesson, or calculates the next verse incorrectly.

## Sequence rules

- The selected Sri Swami Sivananda / Divine Life Society edition uses **701 verses**.
- Normally two consecutive shlokas are taught each morning.
- When only one shloka remains in a chapter, only that shloka is taught.
- A day never crosses from one chapter into the next.
- Gita 5.18 remains preserved as an earlier exploration and does not count until the sequential journey reaches it.
- The deterministic progress record—not AI memory—chooses the next verse.

## Verified sources

Every morning run uses:

1. the official Divine Life Society PDF for the selected reading edition, its 701-verse numbering, transliteration, translation, and commentary context; and
2. a locally stored 701-verse Sanskrit/IAST corpus built from a pinned `gita-quotes` source commit derived from VedicScriptures data.

The local corpus was reduced to ancient Sanskrit and transliteration only. Its upstream Git blob hash, total count, every chapter count, canonical order, and sentinel verses 1.1, 13.1, and 18.78 were checked before it was committed. These checks are repeated by the morning source preflight.

The automation does not depend on the migrated IIT Kanpur webpage. The AI writes fresh Hindi and English explanations rather than copying long modern translations.

## Credentials and cost control

The workflow uses GitHub Copilot CLI with GitHub Actions’ short-lived `GITHUB_TOKEN`. It does not store an OpenAI key, GitHub personal access token, or other long-lived secret in the repository. Usage is subject to the repository owner’s current GitHub Copilot entitlement and limits.

## Failure behavior

Any incomplete 7:07 AM or 9:07 AM run leaves public progress unchanged. A deduplicated alert issue is created and assigned to the repository owner. The unprocessed staging issue remains available for a later safe retry.

## Technical implementation

See [`gita-sadhana/automation/README.md`](automation/README.md), [`gita-sadhana/automation/source-preflight.mjs`](automation/source-preflight.mjs), and [`gita-sadhana/automation/gita-automation.mjs`](automation/gita-automation.mjs).
