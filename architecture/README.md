# Portfolio architecture atlas

Nine published project cases are represented by 36 Archify readers: one bounded component map and three sequential views (logic, code, data) per project.

## Source and claim boundaries

The source of truth for this redraw is the portfolio case HTML and its existing flow-description modules. This is a visual and information-architecture update, not a new audit of all nine application repositories or live infrastructure. Each reader repeats its project maturity and evidence boundary. My Seventh Meal remains proposed, AI Brain remains a scaffold, and queued ForkWise runner work is not represented as executed. No unrelated personal or employer material is imported.

`definitions.json` authors the component overviews. `scripts/build-archify.mjs` extracts the published sequential descriptions, creates typed specs, validates them at showcase quality, and calls Archify `deliver`. The sequential views intentionally use the workflow renderer; edges encode the published step order. Unlabeled next-step edges add no protocol or service relationship beyond that explicit order. Full descriptions remain in the readable alternatives.

## Reproduce

Generator: tt-a1i/archify, package 2.17.0-dev.1, pinned revision `5769acefcc2ebd696a4f9ed3ac9cb6cca1d75c70`.

```sh
curl --fail --location https://raw.githubusercontent.com/tt-a1i/archify/5769acefcc2ebd696a4f9ed3ac9cb6cca1d75c70/archify.zip -o /tmp/archify.zip
unzip /tmp/archify.zip -d /tmp/archify-tool
ARCHIFY_HOME=/tmp/archify-tool/archify node scripts/build-archify.mjs
node scripts/check-archify.mjs
```

Outputs: `specs/` (editable JSON), `maps/` (unchanged delivered HTML), `receipts/` (hashes, byte counts, and deterministic acceptance), `catalog.json` (source and readable steps).

Generated HTML has its own renderer contract and is checked by `check-archify.mjs`, not the hand-authored site's metadata/regex rules. Every output must have 9/9 showcase checks, zero errors/warnings, and matching specification/artifact hashes. Browser evidence is separate: the Playwright architecture suite checks the site integration and standalone readers. A deterministic receipt is not a claim of visual or live-deployment review.

## Reading and performance

Case pages load at most one selected iframe, only near the desktop viewport or after a mobile reader requests it. The parent uses Archify's embed mode; the full reader has theme, pan/zoom, search, focus and export controls. Readable HTML and direct links work without application JavaScript. Optional Google Fonts may be requested by the upstream reader; its functional runtime is inline. There is no model call or paid diagram service in this workflow.

Existing numerical ECharts and specialized drill-down explorers remain separate from these component and step-order maps. Original source descriptions are retained for provenance, not silently rewritten as production claims.

Archify is MIT-licensed. See `LICENSE-ARCHIFY.txt` and the pinned upstream repository.
