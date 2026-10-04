# Gita Sadhana — one-shot completion

On October 4, 2026, the owner requested completion of the whole archive in one effort rather than recurring daily/accelerated delivery. Both ChatGPT Gita tasks were disabled. The teacher and publisher workflows have no cron schedules; their manual recovery entrypoints are retained.

## Run

`.github/workflows/gita-complete.yml` is triggered manually or by an explicit update to `gita-sadhana/automation/bulk-request.json` on `main`. It never schedules or requeues itself. The single release record is issue #90. Do not restore recurring notifications without a new user request.

One release includes many bounded work units; it does not attempt to squeeze hundreds of full lessons into one model response. First, a pilot work unit must pass. Then up to eight jobs can process independent chunks concurrently. Each chunk covers at most eight verses and remains inside a chapter; generation and review calls are capped at two episodes/four verses. A failed attempt receives at most one corrective retry. Missing or rejected content blocks the single final publication.

## Preservation and quality

The canonical 701-verse Sanskrit corpus and original Divine Life Society source are validated before work starts. Chapter 13 has 35 verses. Already published lesson files are preserved byte for byte. Existing staged packets are reused regardless of issue date or open/closed state, with conflicts rejected. Historical Sanskrit/transliteration discrepancies are written to `legacy-text-audit.json` and stop the release before paid model generation; they are not silently repaired or hidden.

New lessons retain the full schema: exact Sanskrit and Roman transliteration, important terms, Hindi/English context, substantial natural Hindi and clear English, Text/Commentary/Inference distinctions, applications, Hindi/English reflection questions, episode summaries, practice, and a deterministic valid next-verse preview. New commentary is original rather than copied at length from modern translations. Copilot receives a read-only task file, without shell, repository-write, URL, or delegation tools. A separate model invocation reviews each new batch. This is model-based editorial review, not human scholarly certification.

All new lesson objects must pass both structural/source checks and review. Generation artifacts are immutable inputs to assembly, and draft hashes detect later changes. Assembly fails on missing verses, duplicates, gaps, concurrent repository changes, altered staged packets, missing reviews, or historical canonical-text discrepancies.

## Output and completion definition

A successful release adds the remaining lesson files and advances the authoritative manifest/progress together in one commit. It also creates `complete.html`, `complete-listening-archive.md`, `content/complete-archive.json`, and `content/bulk-completion-audit.json`. The readable archive includes the lesson content and available original episode summaries, not the machine-readable issue publication packets.

The existing Pages configuration is preserved. Branch-based Pages receives an explicit build request; a custom-workflow Pages site receives a complete-site artifact. Completion is recorded only after the public progress is 701/null and every one of the 701 public lesson files, plus the archive and metadata files, matches the validated local bytes. A committed counter alone is not deployment verification.

Source, result, teacher/reviewer, release and verification artifacts are retained in GitHub Actions. Issue #90 receives one terminal result rather than per-verse issues or heartbeat messages. A failure leaves the issue open with a run link. Inspect that failure before manually retrying; do not alter content to bypass a failed check.

Stable study site: https://yashumani.github.io/gita-sadhana/
