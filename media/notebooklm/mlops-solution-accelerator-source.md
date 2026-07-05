# NotebookLM source packet: Automated ML Pipeline Platform

## Project name

Automated ML Pipeline Platform

## One-line description

An end-to-end Azure ML pipeline that automatically finds, tunes, evaluates, and registers the best model for classification, regression, or clustering tasks.

## Audience

Technical recruiters, AI/ML platform leaders, MLOps engineers, data science leaders, and EB1-A-style evidence reviewers who need to understand the project's system design, automation, and engineering discipline.

## Core problem

Manual model selection is slow, inconsistent, and difficult to reproduce. Data science teams often test models in notebooks, compare results informally, and rely on hand-selected winners. The goal of this platform is to make model selection systematic, repeatable, and production-ready.

## Solution summary

The platform accepts a dataset and YAML configuration, validates and profiles the data, runs a three-phase model tournament, tunes the winning candidate, evaluates it on holdout data, and registers the winner in Azure ML.

## Visual architecture

Dataset + YAML config → data validation and ingestion → preprocessing and feature engineering → parallel baseline tournament using PyCaret and FLAML → Phase A champion → 457 recipe variant search → Optuna hyperparameter optimization → holdout evaluation → Azure ML model registration.

## Three-phase tournament

Phase A runs a fast baseline tournament using PyCaret and FLAML in parallel. The best baseline becomes the Phase A champion.

Phase B scores 457 auto-generated model and preprocessing recipes against the profile of the dataset. The strongest recipe becomes the Phase B champion.

Phase C uses Optuna hyperparameter optimization to refine the winning candidate before final holdout evaluation.

## Config-driven design

Datasets, task types, compute targets, and stage parameters are controlled by YAML configuration. New use cases can be added without hardcoding pipeline logic.

## Supported task families

The platform supports classification, regression, and clustering. It includes task-specific preprocessing and scoring. For classification, it can handle class imbalance with SMOTE and feature selection with Boruta.

## Reproducibility

Every run is tracked in nested MLflow experiments. The parent pipeline run connects to per-step and per-model child runs, so each registered model can be traced back to its exact data, config, metrics, and hyperparameters.

## Azure ML deployment

The platform runs against an actual Azure ML workspace and compute cluster, not only a local notebook simulation. It includes operational tooling to monitor jobs and extract results.

## Public proof metrics

- 457 candidate recipes
- 18 reusable components
- 19 pipeline steps
- 3 task families: classification, regression, clustering
- PyCaret and FLAML baseline engines
- Optuna hyperparameter optimization
- MLflow nested experiment tracking
- Azure ML workspace and compute cluster execution

## Applied example

One configuration applies the platform to telecom customer-churn prediction. It uses dual-engine baselines, Boruta feature selection, SMOTE class-imbalance handling, and a 50-trial Optuna search.

## Technology stack

Python, Azure ML, PyCaret, FLAML, Optuna, MLflow.

## Suggested video narrative

1. Open with the problem: manual model selection is slow and hard to reproduce.
2. Introduce the solution: a config-driven Azure ML pipeline that runs a model tournament automatically.
3. Show the data and YAML config entering the platform.
4. Show validation, preprocessing, and feature engineering.
5. Show the three-phase tournament: baseline engines, 457 recipe search, and Optuna tuning.
6. Show holdout evaluation and Azure ML registration.
7. Close with engineering proof: reusable components, pipeline steps, task-family support, MLflow tracking, and Azure compute execution.

## Suggested infographic layout

Title: Automated ML Pipeline Platform

Subtitle: From dataset and config to registered production-ready model.

Top row: dataset, YAML config, data validation, preprocessing.

Middle row: PyCaret + FLAML baseline tournament, Phase A champion, 457 recipe search, Optuna HPO.

Bottom row: holdout evaluation, Azure ML registry, proof metrics.

Callout: The platform replaces manual model choice with repeatable, tracked, config-driven automation.

## Tone

Confident, practical, and systems-oriented. Avoid exaggerated claims. Make it feel like a serious MLOps platform built for reproducibility and scale.
