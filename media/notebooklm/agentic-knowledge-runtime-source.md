# Agentic Knowledge & Research Runtime — NotebookLM Source Packet

Source material for generating video overviews, infographics, and study guides in NotebookLM. Written for narration/summarization, not as a public web page.

## Project summary

A multi-agent research platform that turns scattered, messy source material into cited, fact-checked artifacts. The system is built as a governed research pipeline: every published claim is designed to trace back to a specific chunk of a specific source document, and every output passes through automated review before publication.

## Problem

Most AI research assistant tools produce an answer in one shot. There is often no paper trail. If the answer is wrong, it is difficult to determine which source it came from, whether the source was reliable, or whether the model invented the claim.

This system treats research as a governed pipeline rather than a single model call. The core question it is designed to answer is: "Where did this claim come from?"

## What it does

Given a research question, the system:

1. Pulls in raw material from source types such as web pages, YouTube videos, GitHub repositories, academic sources, Hacker News, RSS feeds, PDFs, Office documents, and images/screenshots.
2. Extracts and normalizes that raw material into structured evidence: text chunks, tables, and media, each with a source reference.
3. Stores the evidence in a graph structure that models relationships between sources, chunks, claims, and concepts.
4. Indexes the evidence for retrieval using Weaviate.
5. Retrieves candidate evidence using keyword search, vector similarity, and reranking.
6. Assembles evidence into a bundle and passes it to a knowledge compiler.
7. Drafts an answer or artifact.
8. Runs the draft through critique and repair before publication.

## Architecture

Source adapters → extraction and parsing → evidence graph → vector index → hybrid retrieval and reranking → knowledge compiler → critique / repair / council loop → cited artifact.

## Why the architecture matters

### Source adapters, not scrapers

The source layer uses adapter contracts rather than ad-hoc scraping scripts. Each adapter is responsible for discovering, estimating cost, fetching, extracting assets, normalizing, deduplicating, checking policy, and reporting health. This makes new source types pluggable without rewriting the rest of the pipeline.

### Evidence graph, not just a vector store

Most RAG systems chunk documents and embed them. This system models an explicit graph: source documents, evidence chunks, media assets, table artifacts, claims, and concepts. The vector database is a projection used for retrieval, not the source of truth. This is what makes claim-level traceability possible.

### Hybrid retrieval

Pure vector similarity is weak for exact facts, rare terms, and precise source matching. The runtime combines exact lookup, BM25 keyword search, vector search, and reranking. This reduces irrelevant retrieval compared with vector-only search.

### Critique / repair / council loop

A separate reviewing stage checks drafts against cited evidence. Unsupported sections can be repaired automatically. Higher-stakes outputs can be compared across multiple drafts. Unsupported high-confidence claims are blocked from publishing.

### Durable orchestration

Research jobs can take a long time and involve many sources. Temporal gives the pipeline durable orchestration so jobs can be retried, replayed, and resumed after failure rather than starting over.

### Typed programs and evaluation gates

Reasoning steps are written as typed, testable programs using DSPy rather than loose prompt strings. Changes are checked through Promptfoo evaluation gates and logged in MLflow for run history.

## Proof metrics

- 92 commits
- 98% solo-authored
- 14 phased, evidence-gated releases
- 200+ automated tests passing
- 13 source adapters
- Real cloud deployment on Azure Container Apps
- VPN-gated, fail-closed security posture
- Metered/capped live API usage

## Impact framing

The impact is not "AI writes summaries." The impact is converting research from one-shot generation into a traceable, reviewable workflow. The system makes claims source-grounded, exposes contradictions and gaps, and adds a critique gate before an artifact is considered publishable.

Placeholder impact metrics to confirm later:

- Research review time reduced
- Analyst hours saved
- Number of research workflows supported
- Number of source sets processed
- Stakeholders or users served

## Tech stack

Python, Temporal, Weaviate, DSPy, MLflow, Promptfoo, Azure Container Apps, Docling.

## Use-case scenarios

- Competitive or market research with source-linked claim maps.
- Technical due diligence across public GitHub repos, docs, talks, and public materials.
- Ongoing topic monitoring with repeated refreshes over time.
- Literature or prior-art synthesis across academic and community sources.

## FAQ

### How is this different from asking ChatGPT or Perplexity a question?

Those tools generate an answer in one pass with limited visibility into which exact source justified each sentence. This system builds an evidence graph first, drafts from retrieved evidence, and then checks the draft against evidence before publishing.

### What happens if a source contradicts another source?

The evidence graph can model support and contradiction. The evidence bundle can include conflicts and gaps rather than silently choosing one source.

### What stops it from hallucinating when evidence is thin?

The publish gate blocks unsupported high-confidence claims. If evidence does not support a claim, the critique/repair stage fixes or blocks it.

## One-sentence summary

A multi-agent research platform that turns scattered source material into cited, fact-checked artifacts with the release discipline, evaluation gates, and durability expected from production infrastructure.
