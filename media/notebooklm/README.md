# NotebookLM media workflow for portfolio assets

This folder contains public-safe source packets and prompts for generating portfolio media in NotebookLM.

## Goal

Use NotebookLM to create polished visual assets for each project page:

- a narrated Video Overview for the website
- a short vertical Video Overview for LinkedIn-style sharing, where available
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

## NotebookLM output notes

- Video Overviews are generated from notebook sources in the Studio panel. Use `Explainer` for the website version because it is more structured and easier to understand as a technical case study.
- `Short` and `Cinematic` Video Overviews may require Google AI Pro / Ultra, English output, and an 18+ account depending on your NotebookLM access.
- Infographics can be generated from the Studio panel and downloaded as PNG files.
- Slide Decks can be generated from the Studio panel and downloaded as PDF or PowerPoint files.
- All outputs are AI-generated, so validate text, diagrams, labels, and claims before publishing.

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
