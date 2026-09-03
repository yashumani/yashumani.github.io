# Yashu Sharma — Product, Data & AI Systems

Static GitHub Pages portfolio for product engineering, business intelligence, data analytics, applied AI, MLOps, agent architecture, career history, presentations, and technical writing.

## Information architecture

- **Profile highlights:** DQ Check Platform remains first; the AI Enterprise Conference field report is second, presenting independent conference learning through original visual reconstructions, field notes, follow-up research, and BI/analytics implications.
- **Featured work:** Mangrok Recipe Vault, Where It Happened, My Seventh Meal, DQ Check Platform, Unified Knowledge Base — AI Brain, HarnessLab — Agentic Harness Builder, Automated ML Pipeline Platform, and Agentic Knowledge & Research Runtime.
- **Resume:** source-labeled career history from the available March 2023 resume snapshot, the owner-confirmed current title, education, certifications, skills, and a clear separation between employment and independent portfolio work.
- **Professional presentation:** a fifteen-slide interactive web presentation explaining the career record, capabilities, portfolio systems, AI philosophy, and professional direction.
- **Engineering proof:** implementation choices, security boundaries, reproducibility, performance, safe failure behavior, and honest current-state limits.
- **Advanced exploration:** lazy-loaded graph and analytical explorers for HarnessLab, the AI Brain, DQ Check, and the Automated ML Platform, while retaining the original diagrams and text alternatives.
- **Capabilities:** product/data strategy, applied AI, agent-harness design, platform engineering, security/reliability, measurement, and delivery.
- **Writing:** working papers on accountable AI systems, decision-grade analytics, technical interviewing, and operating discipline.

The visual system is an original implementation. It uses a developer-portfolio content model—projects, technical tags, case studies, writing, career history, and evidence—without copying third-party template code or licensed assets.

## Resume source boundary

The public resume page distinguishes three sources:

1. Career history and education from `Yashu_Sharma_resume_exp_update.docx`, last modified March 4, 2023.
2. The current title, Senior Manager in Business Intelligence and Data Analytics, supplied directly by the profile owner.
3. Independent systems grounded in current repositories and case studies, and explicitly not presented as employer experience.

The page does not infer the current employer, current-role dates, team scope, or business-impact metrics without a reconciled resume source. The phone number from the historical resume is not published on the website.

## Advanced visualization boundary

The optional advanced explorers use pinned browser libraries:

- AntV G6 `5.1.1` for architecture, permission, governance, access, and execution-trace graphs.
- Apache ECharts `6.1.0` for data-quality coverage, investigation flow, model-tournament, implementation-count, and lineage charts.

The libraries load only after an explorer approaches the viewport. Existing case-study copy, static architecture, animated HTML/CSS flow diagrams, and text alternatives remain available if the CDN cannot load or JavaScript is disabled.

The project-specific graph models, labels, views, and evidence boundaries are maintained in this repository. Upstream libraries receive attribution in the affected case studies. Quantitative explorers use only documented project counts or categorical architecture facts; they do not fabricate accuracy, ROI, adoption, latency, or time-saved metrics.

See [`docs/advanced-visualization-runtime.md`](docs/advanced-visualization-runtime.md).

## Local preview

```bash
python3 -m http.server 8000
```

Open `http://localhost:8000`.

## Quality checks

The published site has no runtime build dependency. Development-only checks validate metadata, local links, anchors, assets, JavaScript syntax, responsive layout, theme persistence, legacy routes, project source attribution, resume source boundaries, interactive presentation controls, advanced-explorer fallbacks and interactions, animated architecture views, and core accessibility landmarks.

```bash
npm install
npx playwright install chromium
npm run check
```

Pull requests and pushes to `main` run the same checks in GitHub Actions. The browser job tests desktop and mobile Chromium and uploads full-page screenshots plus the Playwright report as a short-lived workflow artifact.

## Structure

```text
index.html                         Portfolio homepage
resume.html                        Source-labeled career profile and professional direction
professional-profile.html          Fifteen-slide interactive professional presentation
projects/                          Technical case studies
blogs/                             Writing index and articles
css/style.css                      Ordered stylesheet entrypoint
css/profile-highlights.css         Homepage highlight cards and mobile evidence layout
css/base.css                       Tokens, reset, navigation, and shared primitives
css/projects.css                   Project-card visuals and technical mockups
css/sections.css                   Homepage sections and content modules
css/case.css                       Case-study and writing layouts
css/resume.css                     Resume timeline, capability, project, and print layouts
css/presentation.css               Full-screen, mobile, and print presentation layouts
css/flow-diagrams.css              Shared animated architecture and execution visuals
css/advanced-exploration.css       G6/ECharts explorer, fallback, fullscreen, and print layouts
css/media.css                      Responsive and print behavior
css/fixes.css                      Compatibility corrections loaded last
js/main.js                         Ordered runtime loader
js/portfolio-ai-enterprise-journey.js  DQ Check and conference field-report highlights
js/main-core.js                    Theme, navigation, headings, reveals, and project-flow loading
js/portfolio-resume.js             Resume navigation and homepage career summary
js/presentation.js                 Slide navigation, keyboard controls, hashes, and fullscreen behavior
js/portfolio-projects.js           Homepage project inventory and case-study action placement
js/portfolio-sources*.js           Project, paper, and visualization source attribution
js/advanced-exploration.js         Lazy G6/ECharts runtime and project-specific exploration models
js/flow-diagrams.js                Shared project architecture and execution diagrams
js/harnesslab-flow.js              HarnessLab-specific architecture and execution view
scripts/validate-site.mjs          Dependency-free static validation
playwright.config.mjs              Desktop/mobile browser-test configuration
tests/                             Interaction, content, layout, route, and screenshot checks
assets/                            Profile image and architecture diagrams
```

## Implementation principles

- No build dependency is required for the portfolio itself.
- Core pages remain readable without JavaScript; JavaScript adds homepage inventory updates, resume navigation, attribution, navigation behavior, interactive presentation controls, project architecture views, and optional advanced exploration.
- Advanced visualization libraries are pinned, lazy-loaded, and replaceable behind one project-owned runtime.
- Every advanced explorer keeps a text alternative and survives library-load failure.
- Dark/light theme preference persists locally and re-renders active explorers.
- Career history, current owner-supplied information, and independent portfolio evidence remain visibly separated.
- The conference field report is labeled as independent learning; reconstructed visuals are not presented as official conference materials or employer work.
- The professional presentation repeats the same source boundary instead of converting portfolio projects into employer experience.
- Case studies distinguish live functionality, source-complete work, planned architecture, and external activation boundaries.
- Project claims are tied to repositories, specifications, standards, or other named sources where applicable.
- Existing project and article URLs remain in place.
- Legacy homepage anchors route visitors to the nearest replacement section.
- Automated checks fail on broken internal references, missing metadata, duplicate IDs, document-level mobile overflow, missing source attribution, missing resume/presentation routes, advanced-explorer regressions, and interaction failures.
