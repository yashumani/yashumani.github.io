# Portfolio Publication Readiness Checklist

This file keeps public-site decisions explicit. The website is public, so project names, metrics, and security notes should be treated as publishable content.

## Current public case studies

These are wired into the public site and can receive metrics/media upgrades:

| Project | Status | Next metric work |
|---|---|---|
| Agentic Knowledge & Research Runtime | Public | Confirm research time saved, review-cycle reduction, adoption, and stakeholder count if safe. |
| Automated ML Pipeline Platform | Public | Confirm manual model-selection time reduced, retraining cadence, model governance usage, and business/user adoption if safe. |

## 2026-08-01 GitHub review decision

GitHub was reviewed with owner-authorized access on 2026-08-01. The website
repository is accessible for push/admin operations. Public GitHub shows six
public repositories; authenticated metadata also confirms private repositories
used for petition planning and private engineering work.

Promotion decisions:

- Keep `MLOPS_SOLUTION_ACCELRATOR` as the strongest public engineering case
  study.
- Keep `yashumani.github.io` as the public presentation layer for case studies
  and working papers.
- Treat the local AI workspace as private evidence reviewed: summarize at the
  architecture level only until public README, test proof, demo media, and
  security review are ready.
- Treat the Discord workflow integration as supporting private evidence only
  until public-safe documentation and tests exist.
- Hold `french-accent-training` until before/after samples, evaluation notes,
  and outcome evidence exist.
- De-emphasize `Stocks_analysis`, `Wedding-countdown`, and `pavbhaji` for the
  EB-1A public narrative because they are older, off-domain, or empty in their
  current form.

## 2026-08-01 design and pending-state review

- Completed the shared Apple-inspired editorial redesign across the homepage,
  public case studies, and working-paper pages without adding new portfolio
  claims.
- Kept every unverified business metric pending. No workplace number was
  inferred from the old resume or substituted from self-authored material.
- Replaced raw `TBD` presentation labels with `Pending` or
  `Pending verification` so incomplete items are clear without making the
  public site look broken.
- Kept the four existing roadmap items open: public-safe metrics,
  execution-proof media, future catalog promotion gates, and GitHub cleanup.
- Made visible content independent of scroll-triggered JavaScript so full-page
  captures, crawlers, print, and no-JavaScript rendering do not appear blank.

## Safe placeholder metrics

Use `Pending verification` for any metric that is not confirmed yet. Replace
only after validation.

Recommended placeholders:

- Years analytics, BI, and automation experience
- Executive / BI workflows automated
- Estimated manual hours saved
- Stakeholders or teams served
- Adoption or active users
- SLA improvement
- Cost or revenue impact, only if public-safe and evidence-backed

## Draft project categories

### Private candidates

Projects in this category can become future case studies after they have enough public proof:

- Architecture/design artifacts: publish only when paired with implementation evidence.
- Workflow/integration projects: publish after documentation, test coverage, and safety model are visible.
- Applied-ML training projects: publish after before/after examples and evaluation notes exist.
- Local AI workspace projects: publish architecture-level only until public README, CI, and safe packaging are ready.

### Security-blocked drafts

Do not publish project names, specifics, screenshots, repos, or metrics for drafts that have unresolved credential/API-key issues. Keep them out of the public repo and public website until:

1. The credential/API key is rotated.
2. Git history and published artifacts are sanitized.
3. Any benchmark/production claims have evidence.
4. A public-safe summary is written from scratch.

## Claim rules

Use this standard for every metric:

- Specific beats vague.
- Public-safe beats impressive.
- Evidence-backed beats promotional.
- Placeholder beats guessing.

Bad:

- Massive impact
- Enterprise-grade
- 10x better
- Huge savings

Better:

- 200+ automated tests
- 457 candidate recipes
- 18 reusable Azure ML components
- 13 source adapters
- Pending verification: hours saved
