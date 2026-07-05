# NotebookLM source packet: Agentic Knowledge & Research Runtime

## Project name

Agentic Knowledge & Research Runtime

## One-line description

A multi-agent research platform that turns scattered source material into cited, critique-reviewed research artifacts with an auditable evidence trail.

## Audience

Technical recruiters, AI/ML leaders, data platform leaders, research engineering reviewers, and EB1-A-style evidence reviewers who need to understand the project's originality, engineering discipline, and production-readiness.

## Core problem

Most AI research assistant tools produce a one-shot answer from a prompt. That creates risk because the answer may contain unsupported claims, weak citations, or untraceable reasoning. The goal of this platform is to treat AI-assisted research as a controlled pipeline instead of a chatbot response.

## Solution summary

The runtime ingests source material from multiple adapters, extracts structured content, builds an evidence graph, retrieves relevant supporting material, compiles a cited artifact, and then sends that artifact through critique and repair before publication.

## Visual architecture

Source adapters → extraction and parsing → evidence graph → vector index → hybrid retrieval and reranking → knowledge compiler → critique / repair / council loop → cited research artifact.

## Source adapters

The platform supports a discover → fetch → extract contract across thirteen source types, including web pages, YouTube, GitHub repositories, arXiv, Crossref, Hacker News, RSS/Atom, PDFs, Office documents, images, and screenshots.

## Evidence model

The project uses an evidence graph rather than a flat vector store. Source documents, extracted chunks, tables, media, claims, and concepts are modeled with explicit references. This allows each generated answer to trace back to the specific source chunk that supports it.

## Retrieval strategy

The runtime combines keyword search, vector search, and reranking. This hybrid retrieval approach is designed to reduce irrelevant matches and improve grounding compared with relying only on vector similarity.

## Critique and repair

A separate reviewing agent checks generated artifacts for unsupported claims. Weak sections are repaired automatically. For higher-risk outputs, multiple independent drafts can be compared before a final artifact is accepted.

## Durable orchestration

Long-running research jobs use Temporal so they can survive crashes and restarts instead of losing work mid-pipeline.

## Engineering discipline

The project uses typed, testable AI programs through DSPy, automated evaluation gates through Promptfoo, and run history through MLflow. It is positioned as a production-grade system, not a weekend prototype.

## Public proof metrics

- 92 commits
- 98% solo-authored
- 200+ automated tests passing
- 13 source connectors
- 14 phased, evidence-gated releases
- Azure Container Apps deployment
- VPN-gated, fail-closed security posture
- metered and capped API usage in live runs

## Technology stack

Python, Temporal, Weaviate, DSPy, MLflow, Promptfoo, Azure Container Apps, Docling.

## Suggested video narrative

1. Open with the risk: AI research tools often answer without a trustworthy audit trail.
2. Introduce the solution: a multi-agent runtime that treats research as a pipeline.
3. Show the source layer: web, video, code, research feeds, and documents.
4. Show the evidence graph: every answer is tied to source chunks and citations.
5. Show the retrieval and compiler stages: hybrid retrieval, reranking, and cited artifact drafting.
6. Show critique and repair: unsupported claims are challenged before publication.
7. Close with engineering proof: tests, commits, Temporal, MLflow, Promptfoo, and Azure deployment.

## Suggested infographic layout

Title: Agentic Knowledge & Research Runtime

Subtitle: From scattered sources to cited, critique-reviewed research artifacts.

Top row: source adapters, extraction, evidence graph.

Middle row: hybrid retrieval, knowledge compiler, critique / repair.

Bottom row: proof metrics and technology stack.

Callout: Every published claim must trace back to source evidence.

## Tone

Confident, technical, and evidence-based. Avoid exaggerated AI hype. Make it sound like a serious engineering case study.
