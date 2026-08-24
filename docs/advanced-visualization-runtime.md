# Advanced visualization runtime

## Purpose

The portfolio keeps the existing case-study narrative, static diagrams, animated HTML/CSS execution flows, and text alternatives. This runtime adds optional exploration for use cases that benefit from pan, zoom, selection, multiple views, trace replay, fullscreen inspection, and animated analytical charts.

It does not replace the evidence in a case study. It provides another way to inspect that evidence.

## Pinned libraries

```text
AntV G6       5.1.1
Apache ECharts 6.1.0
```

The runtime loads the browser bundles from jsDelivr only when an advanced explorer approaches the viewport:

```text
https://cdn.jsdelivr.net/npm/@antv/g6@5.1.1/dist/g6.min.js
https://cdn.jsdelivr.net/npm/echarts@6.1.0/dist/echarts.min.js
```

No library is loaded on the homepage, resume, presentation, papers, or project pages that do not use an advanced explorer.

## Current project coverage

### HarnessLab — Agentic Harness Builder

AntV G6 views:

1. Requirement-to-harness architecture
2. Permission and approval boundary
3. One-worker Architecture Critic trace

The graph preserves the current execution boundary:

```text
one worker
one provider call
no tools
no child agents
no external actions
48 KiB context limit
confidence threshold 0.70
```

It does not depict live MCP tools, A2A peers, arbitrary code execution, production changes, or a completed adaptive swarm.

### Unified Knowledge Base — AI Brain

AntV G6 views:

1. Evidence-to-publication governance lifecycle
2. Identity, policy, retrieval, and context access path
3. REST, MCP, SDK, and CLI adapters over shared services

The visualization states that the public project is an active scaffold using synthetic examples and an in-memory store. It does not present PostgreSQL persistence, production identity, or hybrid retrieval as completed work.

### DQ Check Platform

Apache ECharts views:

1. Browser-supported quality characteristics versus characteristics requiring governed external context
2. Quality-gated cohort investigation loop
3. Documented public-demo limits of 25 MB and 100,000 rows

The quality view is categorical. It does not display a measured model score. The investigation view represents attribution and exploration, not causal proof.

### Automated ML Pipeline Platform

Apache ECharts views:

1. Model-tournament funnel
2. Documented implementation inventory
3. Dataset-to-registered-model lineage path

The inventory uses documented project counts:

```text
457 candidate recipes
18 reusable components
5 pipeline stages
3 task families
50 Optuna trials in the churn configuration
```

The chart does not add accuracy, latency, adoption, ROI, or time-saved values.

## Runtime behavior

`js/advanced-exploration.js` owns:

- project route detection;
- project-specific graph and chart data;
- pinned lazy library loading;
- view tabs;
- graph search and focus;
- trace replay;
- pan, zoom, and selection;
- reset and fullscreen controls;
- detail panels;
- dark/light theme re-rendering;
- responsive resize behavior;
- reduced-motion handling;
- graceful CDN failure;
- text alternatives.

`css/advanced-exploration.css` owns:

- portfolio-compatible visual treatment;
- desktop and mobile layouts;
- stage, detail, and control regions;
- fullscreen behavior;
- text fallback presentation;
- print behavior.

`js/portfolio-sources-visualization.js` adds the upstream library documentation and repositories to each affected case study's source-attribution section.

## Accessibility and failure behavior

Every explorer includes:

- an `aria-label` on the visualization stage;
- a live status region;
- keyboard-accessible controls;
- a persistent text alternative;
- reduced-motion behavior;
- a print-safe fallback;
- content that remains available if the external library fails to load.

The external library is an enhancement, not a content dependency.

## Testing strategy

The Playwright suite replaces G6 and ECharts with small browser mocks. This validates the portfolio-owned integration without making pull-request checks depend on an external CDN.

The tests cover:

- all four project routes;
- pinned engine labels;
- three views per explorer;
- graph and chart rendering contracts;
- graph search, view switching, and trace replay;
- source attribution;
- document-level overflow;
- mobile layouts through the existing project route matrix;
- complete fallback behavior when jsDelivr is blocked.

Static syntax checks include the advanced runtime, visualization source extension, and browser-test file.

## Extension model

A future project can be added by defining one configuration entry in `js/advanced-exploration.js` and adding source attribution where needed.

A configuration must provide:

```text
project id
engine: g6 or echarts
three or fewer focused views
plain-language summary
current-state disclosure
source-backed nodes, edges, categories, and values
text fallback
```

Do not add fabricated sample metrics merely to make a chart look richer. A sparse source-backed visualization is preferable to an impressive but unsupported one.
