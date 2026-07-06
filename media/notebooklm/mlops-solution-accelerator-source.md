# Automated ML Pipeline Platform — NotebookLM Source Packet

Source material for generating video overviews, infographics, and study guides in NotebookLM. Written for narration/summarization, not as a public web page.

## Project summary

An Azure ML platform that replaces manual, one-off model selection with a systematic, config-driven tournament. Given a dataset and YAML config, it validates data, runs baseline AutoML engines, searches hundreds of model/preprocessing recipes, tunes the winner, evaluates it properly, and registers the final model with traceable lineage.

## Problem

Building a machine learning model often means manually trying algorithms, tuning hyperparameters by hand, comparing notebook results, and eventually picking a winner. That process is slow, inconsistent, and hard to reproduce later when someone asks why a model was chosen.

This platform turns model selection into a repeatable MLOps pipeline with full experiment history.

## What it does

Given a dataset and YAML config, the pipeline runs through five stages:

1. **Data validation and ingestion** — schema, type, and quality checks, then loading from the configured Azure ML datastore.
2. **Preprocessing and feature engineering** — encoding, scaling, imputation, feature selection, dimensionality reduction, and task-specific transformations.
3. **Baseline tournament / Phase A** — PyCaret and FLAML run in parallel against the prepared data; the best baseline becomes the Phase A champion.
4. **Variant search / Phase B** — a library of 457 candidate model/preprocessing recipes is scored against the dataset profile and the most promising candidates are run and compared.
5. **Hyperparameter optimization and final evaluation / Phase C** — Optuna tunes the selected model, the final candidate is evaluated on holdout data, and the model is registered in Azure ML.

The implementation is an Azure ML pipeline made of 18 reusable, independently versioned components, not one monolithic script.

## Architecture

Dataset + YAML config → data validation and ingestion → preprocessing and feature engineering → PyCaret + FLAML baseline tournament → Phase A champion → 457 recipe variant search → Optuna HPO → holdout evaluation → Azure ML model registration.

## Why the architecture matters

### A real tournament

The three-phase tournament mirrors how a strong data science team works: fast baselines, curated variant search, and focused hyperparameter tuning. The 457-recipe library expands the search beyond whatever one engineer would manually try.

### Config-driven design

Datasets, task type, compute target, and stage parameters live in YAML config. Adding a new use case means creating a new config, not rewriting pipeline code.

### Component contracts

The pipeline is built from 18 Azure ML components, each with an explicit input/output contract. This makes each stage easier to test, version, and reason about independently.

### Reproducibility through MLflow

Every run creates a parent MLflow experiment with child runs for steps and models. A registered model can be traced back to the exact dataset version, config, preprocessing choices, model candidates, and hyperparameters that produced it.

### Real-world dataset handling

The platform supports messy business data patterns, including class imbalance through SMOTE and feature selection through Boruta for classification tasks.

### Runs on real infrastructure

The pipeline submits to an Azure ML workspace and compute cluster, with operational tooling for monitoring jobs and extracting results.

## Proof metrics

- 457 candidate model/preprocessing recipes
- 18 reusable Azure ML components
- 5 pipeline stages
- 3 task families: classification, regression, clustering
- PyCaret and FLAML baseline engines
- Optuna hyperparameter optimization
- Nested MLflow tracking
- Azure ML workspace and compute cluster execution
- 50-trial Optuna search in the telecom churn configuration

## Applied telecom churn use case

One production config applies the platform to telecom customer-churn prediction. It uses dual baseline engines, Boruta feature selection, SMOTE for class imbalance, and a 50-trial Optuna search. This demonstrates the general platform applied to a real high-value business problem pattern.

## Impact framing

The impact is replacing manual notebook-based model selection with a reproducible model tournament. The system creates governance evidence: what data was used, what candidates were tried, what won, how it was tuned, and what model was registered.

Placeholder impact metrics to confirm later:

- Manual model-selection effort reduced
- Data scientist hours saved
- Number of recurring retraining runs
- Number of use cases/configs supported
- Stakeholders or teams served
- Model governance review time reduced

## Tech stack

Python 3.10, Azure ML SDK v2, Azure ML component YAMLs, MLflow, PyCaret, FLAML, Optuna, SHAP.

## Use-case scenarios

- New dataset / new business problem: create a config and let the tournament run.
- Model governance and audit: inspect the full trail from raw data to registered model.
- Recurring retraining: rerun the same config as data changes and compare winners over time.
- Build-vs-buy benchmarking: compare in-house automated model selection against external platforms.

## FAQ

### How is this different from just using PyCaret or FLAML directly?

PyCaret and FLAML are baseline engines inside Phase A. The platform adds the orchestration around them: data validation, 457-recipe variant search, HPO, lineage, and model registration.

### Why not stop after the baseline model?

Baseline AutoML tools are fast but generic. The variant search scores hundreds of curated recipes against the dataset profile, then Optuna tunes the best candidate.

### What happens if the champion changes between runs?

Each run is independently tracked with an MLflow experiment, config snapshot, and candidate ledger. Changes between runs remain inspectable.

## One-sentence summary

A config-driven Azure ML platform that turns manual model selection into a reproducible tournament from dataset to registered model.
