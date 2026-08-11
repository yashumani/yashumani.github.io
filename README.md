# Yashu Sharma — Product, Data & AI Systems

Static GitHub Pages portfolio for product engineering, business intelligence, data analytics, applied AI, MLOps, and technical writing.

## Information architecture

- **Featured work:** Mangrok Recipe Vault, Where It Happened, My Seventh Meal, Automated ML Pipeline Platform, and Agentic Knowledge & Research Runtime.
- **Engineering proof:** implementation choices, security boundaries, reproducibility, performance, and safe failure behavior.
- **Capabilities:** product/data strategy, applied AI, platform engineering, security/reliability, measurement, and delivery.
- **Writing:** working papers on accountable AI systems and operating discipline.

The visual system is an original implementation. It uses a developer-portfolio content model—projects, technical tags, case studies, writing, and experience—without copying third-party template code or licensed assets.

## Local preview

```bash
python3 -m http.server 8000
```

Open `http://localhost:8000`.

## Quality checks

The published site has no runtime build dependency. Development-only checks validate metadata, local links, anchors, assets, JavaScript syntax, responsive layout, project filtering, theme persistence, legacy routes, and core accessibility landmarks.

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
css/media.css               Responsive and print behavior
css/fixes.css               Compatibility corrections loaded last
js/main.js                  Theme, navigation state, filters, and year
scripts/validate-site.mjs   Dependency-free static validation
playwright.config.mjs       Desktop/mobile browser-test configuration
tests/                      Interaction, layout, route, and screenshot checks
assets/                     Profile image and architecture diagrams
```

## Implementation principles

- No build dependency is required for the portfolio itself.
- Content remains usable without JavaScript.
- Dark/light theme preference persists locally.
- Project filters enhance the homepage but do not hide content by default.
- Case studies distinguish live functionality, source-complete work, planned architecture, and external activation boundaries.
- Existing project and article URLs remain in place.
- Legacy homepage anchors route visitors to the nearest replacement section.
- Automated checks fail on broken internal references, missing metadata, duplicate IDs, document-level mobile overflow, and interaction regressions.
