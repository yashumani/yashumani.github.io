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

## Structure

```text
index.html                  Portfolio homepage
projects/                   Technical case studies
blogs/                      Writing index and articles
css/style.css               Core design system and page compatibility styles
css/media.css               Responsive and print behavior
js/main.js                  Theme, navigation state, filters, and year
assets/                     Profile image and architecture diagrams
```

## Implementation principles

- No build dependency is required for the portfolio itself.
- Content remains usable without JavaScript.
- Dark/light theme preference persists locally.
- Project filters enhance the homepage but do not hide content by default.
- Case studies distinguish live functionality, source-complete work, planned architecture, and external activation boundaries.
- Existing project and article URLs remain in place.
