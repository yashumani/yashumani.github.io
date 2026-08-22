# Yashu Sharma — Product, Data & AI Systems

Static GitHub Pages portfolio for product engineering, business intelligence, data analytics, applied AI, MLOps, agent architecture, and technical writing.

## Information architecture

- **Featured work:** Mangrok Recipe Vault, Where It Happened, My Seventh Meal, DQ Check Platform, Unified Knowledge Base — AI Brain, HarnessLab — Agentic Harness Builder, Automated ML Pipeline Platform, and Agentic Knowledge & Research Runtime.
- **Engineering proof:** implementation choices, security boundaries, reproducibility, performance, safe failure behavior, and honest current-state limits.
- **Capabilities:** product/data strategy, applied AI, agent-harness design, platform engineering, security/reliability, measurement, and delivery.
- **Writing:** working papers on accountable AI systems, decision-grade analytics, technical interviewing, and operating discipline.

The visual system is an original implementation. It uses a developer-portfolio content model—projects, technical tags, case studies, writing, and experience—without copying third-party template code or licensed assets.

## Local preview

```bash
python3 -m http.server 8000
```

Open `http://localhost:8000`.

## Quality checks

The published site has no runtime build dependency. Development-only checks validate metadata, local links, anchors, assets, JavaScript syntax, responsive layout, theme persistence, legacy routes, project source attribution, animated architecture views, and core accessibility landmarks.

```bash
npm install
npx playwright install chromium
npm run check
```

Pull requests and pushes to `main` run the same checks in GitHub Actions. The browser job tests desktop and mobile Chromium and uploads full-page screenshots plus the Playwright report as a short-lived workflow artifact.

## Structure

```text
index.html                  Portfolio homepage
projects/                   Technical case studies
blogs/                      Writing index and articles
css/style.css               Ordered stylesheet entrypoint
css/base.css                Tokens, reset, navigation, and shared primitives
css/projects.css            Project-card visuals and technical mockups
css/sections.css            Homepage sections and content modules
css/case.css                Case-study and writing layouts
css/flow-diagrams.css       Shared animated architecture and execution visuals
css/media.css               Responsive and print behavior
css/fixes.css               Compatibility corrections loaded last
js/main.js                  Ordered runtime loader
js/main-core.js             Theme, navigation, headings, reveals, and project-flow loading
js/portfolio-projects.js    Homepage project inventory and case-study action placement
js/portfolio-sources*.js    Project and paper source attribution
js/flow-diagrams.js         Shared project architecture and execution diagrams
js/harnesslab-flow.js       HarnessLab-specific architecture and execution view
scripts/validate-site.mjs   Dependency-free static validation
playwright.config.mjs       Desktop/mobile browser-test configuration
tests/                      Interaction, content, layout, route, and screenshot checks
assets/                     Profile image and architecture diagrams
```

## Implementation principles

- No build dependency is required for the portfolio itself.
- Content remains usable without JavaScript; JavaScript adds inventory updates, attribution, navigation behavior, and interactive architecture views.
- Dark/light theme preference persists locally.
- Case studies distinguish live functionality, source-complete work, planned architecture, and external activation boundaries.
- Project claims are tied to repositories, specifications, standards, or other named sources where applicable.
- Existing project and article URLs remain in place.
- Legacy homepage anchors route visitors to the nearest replacement section.
- Automated checks fail on broken internal references, missing metadata, duplicate IDs, document-level mobile overflow, missing source attribution, and interaction regressions.
