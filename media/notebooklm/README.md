# NotebookLM media workflow for portfolio assets

This folder contains public-safe source packets and prompts for generating portfolio media in NotebookLM.

## Goal

Use NotebookLM to create polished visual assets for each project page:

- a short narrated Video Overview for the website
- a one-page infographic for LinkedIn / portfolio screenshots
- optionally, a slide deck for presentations or EB1-A evidence packaging

## Recommended workflow

1. Create one NotebookLM notebook per project.
2. Upload the matching `*-source.md` file as the primary source.
3. Upload the matching SVG architecture diagram from `assets/diagrams/` as a visual source if NotebookLM allows image uploads in your account.
4. Use the matching `*-prompts.md` file to generate outputs.
5. Export the best outputs.
6. Save final files into the portfolio repo using these target paths:

| Project | Video output target | Infographic output target |
|---|---|---|
| Agentic Knowledge & Research Runtime | `assets/video/agentic-knowledge-runtime/notebooklm-overview.mp4` | `assets/images/agentic-knowledge-runtime/notebooklm-infographic.png` |
| Automated ML Pipeline Platform | `assets/video/mlops-solution-accelerator/notebooklm-overview.mp4` | `assets/images/mlops-solution-accelerator/notebooklm-infographic.png` |

## Public-safety rule

Only use material already safe for the public portfolio. Do not upload private EB1-A petition drafts, confidential employer material, internal screenshots, proprietary datasets, or private repository contents unless they have been sanitized.

## Quality bar

The final media should feel like a technical case-study visual, not a generic AI promo. Prioritize:

- architecture clarity
- measurable engineering proof
- production-readiness
- credible technical language
- low hype
- clean visual hierarchy
