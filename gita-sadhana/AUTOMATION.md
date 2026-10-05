# Gita Sadhana — complete archive

The public study is at [yashumani.github.io/gita-sadhana/](https://yashumani.github.io/gita-sadhana/). The [complete reading archive](https://yashumani.github.io/gita-sadhana/complete.html) and [downloadable text](https://yashumani.github.io/gita-sadhana/complete-listening-archive.md) cover all 701 verses in the selected Divine Life Society/Sivananda numbering. Chapter 13 has 35 verses in this edition. The structured archive is `content/complete-archive.json`.

The 123 lessons previously published were preserved byte for byte during the one-time completion. Another 177 previously reviewed lessons were recovered, and 401 verses were locally authored or repaired with independent assistant review before publication. Assistant review is not human scholarly certification. Source notes and interpretive distinctions remain in each lesson.

## Current workflow state

The daily lesson and website publisher workflows are manual-only; there is no recurring Gita publication schedule. Do not run the older one-shot bulk generation or manual teacher workflow for this completed archive. GitHub Copilot was not used to prepare the 701-verse publication. The historical workflow files remain for audit and recovery context.

`gita-progress.json`, `content/manifest.json`, and `content/lessons/` are the tracked public state. `content/complete-archive.json` and `complete.html` provide the full reader. Every push to `main` runs the site-quality workflow, including `gita-sadhana/automation/verify-complete-publication.mjs`, static and syntax checks, and browser tests. GitHub Pages serves the resulting static site.

## Source and integrity

The primary reading edition is the [Divine Life Society PDF](https://www.dlshq.org/download2/bgita.pdf). Exact Sanskrit and transliteration come from the repository's pinned 701-verse corpus in `data/sanskrit-701.json`, derived from upstream commit `cddb2aabcb18b2ddf4ca965a0e673c1eee43146b`. The complete-publication verifier checks every public lesson's ID, order, chapter, verse number, canonical Sanskrit, transliteration, bilingual fields, source notes, publication status, and equality with the downloadable structured archive. It also checks all 354 episode recaps and the final progress record.

Browser controls for natural English voice are tested without downloading the speech model. Live model synthesis was not part of the local completion or publication gate.
