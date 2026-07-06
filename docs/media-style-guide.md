# Site UI Style Guide for Generated Media

Use this guide for NotebookLM infographics, Video Overviews, slides, and any generated media that should visually match `yashumani.github.io`.

## Color tokens

| Token | Light | Dark |
|---|---|---|
| Background | `#ffffff` | `#111113` |
| Text | `#1a1a1a` | `#e9e9ea` |
| Muted text | `#6b6b6b` | `#9a9a9e` |
| Accent / link | `#5468d4` | `#8b9bf0` |
| Border | `#e6e6e6` | `#2a2a2e` |
| Surface / cards | `#f8f5ef` | `#171719` |

Use a muted periwinkle-blue accent, hex `#5468d4`. Avoid bright blue, saturated neon colors, and corporate navy.

## Typography

- Body/headings: Lora or a similar editorial serif.
- Meta text, labels, captions, stats: system sans-serif such as `-apple-system` or Segoe UI.
- Avoid script fonts, heavy geometric display fonts, and overly decorative type.

## Visual language

- Minimal, editorial, content-first.
- Hairline borders and subtle rounded cards are acceptable.
- No glossy 3D effects.
- No cartoon robots, stock-photo dashboards, emoji icon systems, or overly dramatic startup-pitch visuals.
- Diagrams should feel like technical case-study diagrams, not marketing illustrations.

## NotebookLM infographic guidance

Recommended settings:

- Visual style: Professional.
- Orientation: Landscape.
- Level of detail: Standard.

Prompt language to reuse:

> Use a muted periwinkle-blue (#5468d4) accent on a white or near-white background, serif display type for the headline, clean sans-serif for labels, no glossy 3D effects, no stock-photo imagery, and a minimal technical case-study style.

## NotebookLM Video Overview guidance

Recommended settings:

- Format: Explainer.
- Visual style: Classic or similarly restrained.
- Focus: architecture, metrics, proof, and engineering discipline.

Avoid cinematic over-dramatization. The video should feel like a credible technical walkthrough, not a hype reel.

## Output paths

Use the actual repo structure below:

- Agentic infographic PNG → `assets/images/agentic-knowledge-runtime/infographic.png`
- Agentic video MP4 → `assets/video/agentic-knowledge-runtime/overview.mp4`
- MLOps infographic PNG → `assets/images/mlops-solution-accelerator/infographic.png`
- MLOps video MP4 → `assets/video/mlops-solution-accelerator/overview.mp4`

After adding real media files, add a `<figure class="media-figure">` block to the relevant project page.
