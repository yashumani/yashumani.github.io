(function () {
  'use strict';

  window.PORTFOLIO_PROJECT_SOURCES = {
    'dq-check-platform.html': [
      {
        label: 'ISO/IEC 25012:2008 — Data quality model',
        url: 'https://www.iso.org/standard/35736.html',
        note: 'Published data-quality characteristics. DQ Check applies and extends these ideas in a browser research workflow; it does not claim to originate the standard.'
      },
      {
        label: 'Microsoft Power BI — Decomposition tree',
        url: 'https://learn.microsoft.com/en-us/power-bi/visuals/power-bi-visualization-decomposition-tree',
        note: 'Prior art for guided multi-dimensional drill-down and root-cause exploration.'
      },
      {
        label: 'Google Cloud BigQuery — Contribution analysis',
        url: 'https://cloud.google.com/bigquery/docs/contribution-analysis',
        note: 'Published method for identifying combinations of dimensions that contribute to metric movement.'
      },
      {
        label: 'Drill-down Anomaly Lab repository',
        url: 'https://github.com/yashumani/drill-down-anamoly',
        note: 'Primary implementation evidence for the project described on this page.'
      }
    ],
    'mangrok-recipe-vault.html': [
      {
        label: 'Ink & Switch — Local-first software',
        url: 'https://www.inkandswitch.com/essay/local-first/',
        note: 'Prior-art framing for software that remains useful while keeping primary data under user control.'
      },
      {
        label: 'W3C — Web Cryptography API',
        url: 'https://www.w3.org/TR/WebCryptoAPI/',
        note: 'Browser cryptography standard used by the implementation; Mangrok does not claim to have invented the underlying cryptographic primitives.'
      },
      {
        label: 'Supabase — Row Level Security',
        url: 'https://supabase.com/docs/guides/database/postgres/row-level-security',
        note: 'Product documentation for the database authorization mechanism used by the cloud-ready schema.'
      },
      {
        label: 'Mangrok repository',
        url: 'https://github.com/yashumani/MANGROK-app-site',
        note: 'Primary implementation and current-state evidence for the case study.'
      }
    ],
    'where-it-happened.html': [
      {
        label: 'MapLibre GL JS documentation',
        url: 'https://maplibre.org/maplibre-gl-js/docs/',
        note: 'Mapping library documentation for the vector-map renderer used in the product.'
      },
      {
        label: 'OpenFreeMap quick start',
        url: 'https://openfreemap.org/quick_start/',
        note: 'Map-style and tile-service documentation used by the public storefront.'
      },
      {
        label: 'GitHub Pages — Publishing source',
        url: 'https://docs.github.com/en/pages/getting-started-with-github-pages/configuring-a-publishing-source-for-your-github-pages-site',
        note: 'Hosting documentation for the static deployment model.'
      },
      {
        label: 'Where It Happened repository',
        url: 'https://github.com/yashumani/where-it-happened',
        note: 'Primary implementation evidence for the case study.'
      }
    ],
    'my-seventh-meal.html': [
      {
        label: 'USDA FoodData Central',
        url: 'https://fdc.nal.usda.gov/',
        note: 'Published food-composition data and terminology relevant to deterministic nutrient calculation.'
      },
      {
        label: 'USDA FoodData Central API guide',
        url: 'https://fdc.nal.usda.gov/api-guide/',
        note: 'Official API documentation for structured food and nutrient records.'
      },
      {
        label: 'ICMR–National Institute of Nutrition — Indian Food Composition Tables',
        url: 'https://www.nin.res.in/achievements.html',
        note: 'Indian food-composition reference work relevant to South Asian meal coverage.'
      }
    ],
    'governed-ai-brain.html': [
      {
        label: 'Model Context Protocol — Introduction',
        url: 'https://modelcontextprotocol.io/docs/getting-started/intro',
        note: 'Published protocol and adapter model used by the MCP-facing interface.'
      },
      {
        label: 'Model Context Protocol — 2026 specification release',
        url: 'https://blog.modelcontextprotocol.io/posts/2026-07-28/',
        note: 'Current public specification context reviewed for this portfolio release.'
      },
      {
        label: 'NIST AI Risk Management Framework',
        url: 'https://www.nist.gov/itl/ai-risk-management-framework',
        note: 'External governance context. The knowledge-object, review, and context-pack design is this project’s implementation and synthesis.'
      }
    ],
    'mlops-solution-accelerator.html': [
      {
        label: 'Azure Machine Learning — Create component pipelines with Python',
        url: 'https://learn.microsoft.com/en-us/azure/machine-learning/how-to-create-component-pipeline-python',
        note: 'Official component-pipeline documentation for the orchestration layer.'
      },
      {
        label: 'MLflow Tracking',
        url: 'https://mlflow.org/docs/latest/ml/tracking/',
        note: 'Published experiment-tracking and lineage capability used by the platform.'
      },
      {
        label: 'Optuna — Efficient optimization algorithms',
        url: 'https://optuna.readthedocs.io/en/stable/tutorial/10_key_features/003_efficient_optimization_algorithms.html',
        note: 'Optimization-library documentation for sampling and pruning behavior.'
      },
      {
        label: 'FLAML documentation',
        url: 'https://microsoft.github.io/FLAML/',
        note: 'AutoML library documentation for one of the candidate-search paths.'
      }
    ],
    'agentic-knowledge-runtime.html': [
      {
        label: 'Temporal documentation',
        url: 'https://docs.temporal.io/',
        note: 'Durable-execution documentation for workflows that must survive interruption and retry.'
      },
      {
        label: 'Weaviate — Hybrid search',
        url: 'https://docs.weaviate.io/weaviate/search/hybrid',
        note: 'Published retrieval capability combining lexical and vector search.'
      },
      {
        label: 'DSPy documentation',
        url: 'https://dspy.ai/',
        note: 'Framework documentation for programmatic language-model optimization.'
      },
      {
        label: 'Promptfoo — Node API and evaluation',
        url: 'https://www.promptfoo.dev/docs/usage/node-api-reference/',
        note: 'Evaluation-tool documentation for repeatable prompt and model checks.'
      }
    ]
  };

  window.PORTFOLIO_PAPER_SOURCES = {
    'metric-contracts-for-decision-grade-analytics.html': [
      {
        label: 'dbt Semantic Layer',
        url: 'https://docs.getdbt.com/docs/use-dbt-semantic-layer/dbt-sl',
        note: 'Published semantic-layer approach for centrally defined and governed metrics.'
      },
      {
        label: 'LinkedIn Engineering — Unified Metrics Platform',
        url: 'https://www.linkedin.com/blog/engineering/data-management/unified-metrics-platform',
        note: 'Industry prior art for reusable metric definitions and consistent business logic.'
      },
      {
        label: 'Uber Engineering — uMetric',
        url: 'https://www.uber.com/blog/umetric/',
        note: 'Industry prior art for a metric-definition platform and standardized analytical semantics.'
      }
    ],
    'from-variance-to-decision.html': [
      {
        label: 'Microsoft Power BI — Decomposition tree',
        url: 'https://learn.microsoft.com/en-us/power-bi/visuals/power-bi-visualization-decomposition-tree',
        note: 'Published guided drill-down approach for explaining a measure by dimensions.'
      },
      {
        label: 'Google Cloud BigQuery — Contribution analysis',
        url: 'https://cloud.google.com/bigquery/docs/contribution-analysis',
        note: 'Published contribution-analysis method for ranking dimension combinations.'
      },
      {
        label: 'LinkedIn ThirdEye',
        url: 'https://github.com/linkedin/ThirdEye',
        note: 'Open-source prior art for anomaly detection, monitoring, and root-cause investigation.'
      }
    ],
    'ai-proposes-deterministic-systems-decide.html': [
      {
        label: 'NIST AI Risk Management Framework',
        url: 'https://www.nist.gov/itl/ai-risk-management-framework',
        note: 'Lifecycle risk-management context for separating model behavior from system controls.'
      },
      {
        label: 'NIST Generative AI Profile',
        url: 'https://www.nist.gov/publications/artificial-intelligence-risk-management-framework-generative-artificial-intelligence',
        note: 'Published guidance for generative-AI risks, measurement, and management.'
      }
    ],
    'ai-powered-vs-ai-generated.html': [
      {
        label: 'NIST AI Risk Management Framework',
        url: 'https://www.nist.gov/itl/ai-risk-management-framework',
        note: 'External governance context. The artifact/workflow/system/operating-model distinction is the author’s synthesis.'
      },
      {
        label: 'NIST Generative AI Profile',
        url: 'https://www.nist.gov/publications/artificial-intelligence-risk-management-framework-generative-artificial-intelligence',
        note: 'Published generative-AI risk-management guidance.'
      }
    ],
    'neurodivergent-ai-architect.html': [
      {
        label: 'NIMH — Attention-Deficit/Hyperactivity Disorder',
        url: 'https://www.nimh.nih.gov/health/topics/attention-deficit-hyperactivity-disorder-adhd',
        note: 'Federal health information used only for the clinical boundary; the paper is a personal operating note.'
      },
      {
        label: 'NIMH — Obsessive-Compulsive Disorder',
        url: 'https://www.nimh.nih.gov/health/topics/obsessive-compulsive-disorder-ocd',
        note: 'Federal health information used only for the clinical boundary.'
      },
      {
        label: 'W3C — Cognitive and Learning Disabilities Accessibility Task Force guidance',
        url: 'https://www.w3.org/WAI/standards-guidelines/coga/',
        note: 'Accessibility guidance relevant to reducing hidden cognitive load and ambiguity.'
      }
    ]
  };
})();
