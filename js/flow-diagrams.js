(function () {
  'use strict';

  var projectConfigs = {
    'mangrok-recipe-vault.html': {
      id: 'mangrok',
      title: 'Mangrok Recipe Vault — live architecture flow',
      copy: 'Follow how recipe capture, client-side secrecy, collaboration, printing, and human-reviewed inheritance move through the product.',
      lanes: [
        {
          kind: 'logic',
          title: 'Logic flow',
          badge: 'User journey',
          steps: [
            ['Capture recipe', 'A user adds recipe content, story, media, and a visibility class.', 'Create → classify → enrich'],
            ['Protect secrets', 'Sensitive notes are sealed before durable storage and separated from general metadata.', 'Secret notes ≠ public fields'],
            ['Share safely', 'The owner grants scoped viewer, contributor, or custodian access with expiry and revocation.', 'Role + expiry + revocation'],
            ['Version and restore', 'Collaboration creates recoverable history so family knowledge can be restored.', 'Draft → publish → restore'],
            ['Print or preserve', 'Reviewed records become cookbook layouts and controlled print requests.', 'Review → render → order'],
            ['Legacy review', 'Inheritance requests enter a human-reviewed gate before private content is released.', 'No automatic release']
          ]
        },
        {
          kind: 'code',
          title: 'Code flow',
          badge: 'Runtime path',
          steps: [
            ['PWA shell boots', 'The offline-capable client resolves local data and authenticated session state.', 'Service worker + IndexedDB'],
            ['Crypto boundary executes', 'Web Crypto derives a key and encrypts secret fields before persistence.', 'PBKDF2 → AES-256-GCM'],
            ['Supabase client writes', 'Structured rows and private media references are submitted through authenticated APIs.', 'Auth → PostgREST → Storage'],
            ['RLS policies evaluate', 'PostgreSQL row-level security decides which actor may read, edit, print, or administer.', 'Owner / viewer / custodian'],
            ['Edge function handles print', 'A server-side function validates completeness and enforces idempotent provider handoff.', 'Validate → deduplicate → submit']
          ]
        },
        {
          kind: 'data',
          title: 'Data flow',
          badge: 'Storage path',
          steps: [
            ['Form input', 'Recipe, ingredients, instructions, story, access class, and attachments enter the model.'],
            ['Split data plane', 'General metadata, encrypted notes, and binary media are separated by sensitivity and storage needs.'],
            ['Policy-bound persistence', 'PostgreSQL holds relational records while private object storage holds media behind signed access.'],
            ['Derived outputs', 'Sharing links, audit history, export bundles, and cookbook layouts derive from canonical records.']
          ]
        }
      ],
      summary: [
        ['Trust boundary', 'Client-side encryption before storage'],
        ['Core systems', 'PWA, Web Crypto, Supabase and PostgreSQL'],
        ['Release gate', 'Human review before legacy release']
      ]
    },
    'where-it-happened.html': {
      id: 'where-it-happened',
      title: 'Where It Happened — live architecture flow',
      copy: 'See how a place becomes a styled memory map, shareable design state, exportable artifact, and honest checkout handoff.',
      lanes: [
        {
          kind: 'logic',
          title: 'Logic flow',
          badge: 'Creator journey',
          steps: [
            ['Choose place', 'The user selects a city, landmark, geolocation, or exact coordinates.'],
            ['Style memory', 'Map mood, story preset, layout, caption, and output format shape the poster.'],
            ['Preview design', 'The live creator keeps the map and poster state synchronized as controls change.'],
            ['Save or share', 'The design is stored locally, encoded into a URL hash, or exported as PNG/PDF.'],
            ['Checkout safely', 'A real provider handoff occurs only when checkout is configured; otherwise the app uses an explicit request fallback.']
          ]
        },
        {
          kind: 'code',
          title: 'Code flow',
          badge: 'Front-end runtime',
          steps: [
            ['Static shell loads', 'GitHub Pages serves the core UI before the heavier map runtime is requested.', 'HTML/CSS/JS → lazy map boot'],
            ['Map engine resolves', 'MapLibre initializes the map with OpenFreeMap vector styles and active theme layers.', 'MapLibre + vector tiles'],
            ['State engine syncs', 'Control events update a central design object that drives rendering, local persistence, and sharing.', 'Event → state → render'],
            ['Renderer exports', 'The poster view becomes a watermarked image or browser-printable PDF.', 'Poster DOM → PNG/PDF'],
            ['Checkout adapter decides', 'Code redirects to a configured provider or shows a transparent order-request path.', 'No fake success state']
          ]
        },
        {
          kind: 'data',
          title: 'Data flow',
          badge: 'Design state',
          steps: [
            ['Place data arrives', 'Preset data, search results, geolocation, or manual coordinates form the geographic anchor.'],
            ['Design payload forms', 'Color mood, labels, layout, crop, zoom, marker state, and text become a serializable object.'],
            ['Client persistence', 'Drafts and cart snapshots live locally while shareable state is compressed into the URL hash.'],
            ['Commerce handoff', 'A sanitized product and design payload reaches the checkout adapter or order-request fallback.']
          ]
        }
      ],
      summary: [
        ['Rendering core', 'MapLibre, OpenFreeMap, and the poster DOM'],
        ['State strategy', 'URL hash, local draft, and cart snapshot'],
        ['Commerce rule', 'Real checkout or explicit fallback only']
      ]
    },
    'my-seventh-meal.html': {
      id: 'my-seventh-meal',
      title: 'My Seventh Meal — live architecture flow',
      copy: 'The flow makes the truth boundary explicit: AI proposes, the user confirms, and deterministic nutrition logic performs the final calculation.',
      lanes: [
        {
          kind: 'logic',
          title: 'Logic flow',
          badge: 'Decision chain',
          steps: [
            ['Capture meal', 'The user photographs a plate or enters the meal manually.'],
            ['Generate candidates', 'A multimodal model proposes one to three plausible dishes or components.'],
            ['Ask high-impact questions', 'The system asks only clarifications likely to materially change the result.'],
            ['Confirm structure', 'The user confirms dishes, portions, oils, sides, ingredients, and recipe variations.'],
            ['Calculate deterministically', 'A versioned engine calculates nutrients from structured food records and reference data.'],
            ['Learn the household', 'Corrections become reusable meal and household-recipe memory for future logging.']
          ]
        },
        {
          kind: 'code',
          title: 'Code flow',
          badge: 'Service path',
          steps: [
            ['Mobile client submits', 'The React Native client uploads a photo or manual meal object to the API.', 'Expo client → FastAPI'],
            ['Inference adapter runs', 'A provider-abstracted multimodal service returns candidates and uncertainty signals.', 'Image → candidate list'],
            ['Question policy executes', 'A clarification policy selects the smallest useful set of follow-up questions.', 'Maximize information gain'],
            ['Nutrition engine computes', 'Confirmed structure maps to canonical foods and versioned deterministic calculation rules.', 'Confirmed input → truth service'],
            ['User memory persists', 'Corrected meal profiles and household recipes are saved for reuse.', 'Feedback loop']
          ]
        },
        {
          kind: 'data',
          title: 'Data flow',
          badge: 'Truth boundary',
          steps: [
            ['Unstructured capture', 'Photo pixels and text descriptions arrive as evidence, not as final truth.'],
            ['Structured meal object', 'Confirmation converts evidence into dishes, ingredients, yields, oils, portions, and provenance.'],
            ['Reference mapping', 'Canonical food records resolve against curated and USDA-aligned nutrient sources.'],
            ['Versioned output', 'The result stores nutrients, ranges, confidence notes, and the calculation version that produced them.']
          ]
        }
      ],
      summary: [
        ['Core principle', 'AI suggests; deterministic rules decide'],
        ['Primary stack', 'React Native, FastAPI, PostgreSQL, multimodal AI'],
        ['Learning loop', 'User corrections improve future recall']
      ]
    },
    'mlops-solution-accelerator.html': {
      id: 'mlops',
      title: 'Automated ML Pipeline Platform — live architecture flow',
      copy: 'Track data from validation through feature preparation, model tournaments, experiment evidence, selection, and governed registration.',
      lanes: [
        {
          kind: 'logic',
          title: 'Logic flow',
          badge: 'ML lifecycle',
          steps: [
            ['Ingest and profile', 'Raw tabular data is validated, typed, and profiled before training begins.'],
            ['Assemble recipes', 'The platform generates model and preprocessing combinations for the declared task family.'],
            ['Run tournaments', 'Candidates compete under repeatable cross-validation and optimization rules.'],
            ['Track evidence', 'Metrics, parameters, artifacts, and lineage are recorded for every run.'],
            ['Package winners', 'The best candidate becomes a reusable, governed model output.']
          ]
        },
        {
          kind: 'code',
          title: 'Code flow',
          badge: 'Execution path',
          steps: [
            ['Azure ML pipeline starts', 'Reusable components orchestrate preparation, training, evaluation, and registration.', '18 reusable components'],
            ['Search engines execute', 'PyCaret, FLAML, and Optuna strategies generate candidate pipelines and hyperparameters.', 'Search + compare'],
            ['Experiment logging fires', 'Each run emits metrics, parameters, models, and artifacts into MLflow lineage.', 'Run-level observability'],
            ['Ranking selects a winner', 'Selection code ranks 457 recipes against the declared objective and constraints.', 'Best candidate chosen'],
            ['Registry receives output', 'The winning model and metadata move into the governed model registry.', 'Approve → register']
          ]
        },
        {
          kind: 'data',
          title: 'Data flow',
          badge: 'Experiment plane',
          steps: [
            ['Source dataset', 'Input tables and feature candidates enter the Azure ML workspace.'],
            ['Prepared feature sets', 'Transforms produce train, validation, and test assets plus reusable preprocessing outputs.'],
            ['Run artifacts', 'Metrics, plots, models, and configuration snapshots accumulate in experiment storage.'],
            ['Registered output', 'The winning model, provenance, and evaluation metadata become a governed deployable asset.']
          ]
        }
      ],
      summary: [
        ['Platform scale', '457 model and preprocessing recipes'],
        ['Execution fabric', 'Azure ML, PyCaret, FLAML, and Optuna'],
        ['Evidence system', 'MLflow lineage and tracked artifacts']
      ]
    },
    'agentic-knowledge-runtime.html': {
      id: 'agentic-runtime',
      title: 'Agentic Knowledge & Research Runtime — live architecture flow',
      copy: 'Follow the durable loop between task planning, hybrid retrieval, evidence graphs, drafting, critique, repair, evaluation, and publication.',
      lanes: [
        {
          kind: 'logic',
          title: 'Logic flow',
          badge: 'Research loop',
          steps: [
            ['Accept question', 'The runtime receives a research request, required output, and quality constraints.'],
            ['Plan and retrieve', 'Agents decompose the task and gather source evidence through hybrid retrieval.'],
            ['Build evidence graph', 'Claims, citations, source notes, and support relationships become inspectable graph objects.'],
            ['Draft and critique', 'Generation agents propose an answer while critique agents identify unsupported or incomplete parts.'],
            ['Repair and re-evaluate', 'The system loops until quality gates pass or an escalation condition is reached.'],
            ['Publish', 'Only validated outputs are released together with traceable supporting evidence.']
          ]
        },
        {
          kind: 'code',
          title: 'Code flow',
          badge: 'Orchestration path',
          steps: [
            ['Temporal workflow starts', 'Durable orchestration manages agent execution, state, retries, and timeouts.', 'Workflow entrypoint'],
            ['Retrieval adapters run', 'Lexical, semantic, and vector paths access indexed corpora and evidence stores.', 'Hybrid retrieval'],
            ['Reasoning modules execute', 'DSPy-style modules plan, synthesize, cite, and format candidate outputs.', 'Planner → writer → critic'],
            ['Evaluation gate runs', 'Promptfoo and test harnesses score grounding, completeness, formatting, and failure cases.', '200+ automated tests'],
            ['Repair loop or release', 'Failed outputs return to critique-and-repair; successful outputs move to publishing.', 'Gate-controlled release']
          ]
        },
        {
          kind: 'data',
          title: 'Data flow',
          badge: 'Evidence plane',
          steps: [
            ['Source material enters', 'Documents, passages, and structured references become searchable evidence.'],
            ['Vector storage indexes', 'Embeddings and metadata support semantic retrieval and source linking.'],
            ['Evidence graph forms', 'Claims, citations, and support chains become first-class runtime records.'],
            ['Evaluation artifacts persist', 'Scores, traces, failures, repaired drafts, and release decisions are retained for regression analysis.']
          ]
        }
      ],
      summary: [
        ['Control plane', 'Temporal durable orchestration'],
        ['Knowledge plane', 'Hybrid retrieval, Weaviate, and evidence graphs'],
        ['Quality gate', 'Critique and repair with 200+ tests']
      ]
    }
  };

  function el(tag, className, text) {
    var node = document.createElement(tag);
    if (className) node.className = className;
    if (typeof text === 'string') node.textContent = text;
    return node;
  }

  function buildStep(step, index) {
    var item = el('li', 'flow-step');
    var number = el('span', 'flow-step-index', String(index + 1).padStart(2, '0'));
    number.setAttribute('aria-hidden', 'true');
    item.appendChild(number);
    item.appendChild(el('h4', '', step[0]));
    item.appendChild(el('p', '', step[1]));
    if (step[2]) item.appendChild(el('span', 'flow-mini', step[2]));
    return item;
  }

  function buildLane(lane) {
    var article = el('article', 'flow-lane');
    article.setAttribute('data-flow-kind', lane.kind);

    var head = el('div', 'flow-lane-head');
    head.appendChild(el('h3', '', lane.title));
    head.appendChild(el('span', 'flow-badge', lane.badge));
    article.appendChild(head);

    var list = el('ol', 'flow-track');
    lane.steps.forEach(function (step, index) {
      list.appendChild(buildStep(step, index));
    });
    article.appendChild(list);
    return article;
  }

  function visibleSteps(section) {
    return Array.prototype.slice.call(section.querySelectorAll('.flow-lane:not([hidden]) .flow-step'));
  }

  function createRunner(section) {
    var timer = null;
    var index = -1;
    var prefersReducedMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    function stop() {
      if (timer) window.clearInterval(timer);
      timer = null;
      section.classList.remove('is-running');
    }

    function advance() {
      var steps = visibleSteps(section);
      if (!steps.length) return;
      steps.forEach(function (step) { step.classList.remove('is-current'); });
      index = (index + 1) % steps.length;
      steps[index].classList.add('is-current');
    }

    function start() {
      stop();
      advance();
      if (prefersReducedMotion) return;
      section.classList.add('is-running');
      timer = window.setInterval(advance, 1350);
    }

    return { start: start, stop: stop, isRunning: function () { return Boolean(timer); } };
  }

  function buildSection(config) {
    var section = el('section', 'flow-showcase');
    section.id = 'flow-' + config.id;
    section.setAttribute('aria-labelledby', section.id + '-title');

    var header = el('header');
    header.appendChild(el('p', 'flow-kicker', 'Interactive system view'));
    var title = el('h2', '', config.title);
    title.id = section.id + '-title';
    header.appendChild(title);
    header.appendChild(el('p', 'flow-copy', config.copy));
    header.appendChild(el('span', 'flow-live-status', 'Live flow playback'));
    section.appendChild(header);

    var toolbar = el('div', 'flow-toolbar');
    toolbar.setAttribute('role', 'group');
    toolbar.setAttribute('aria-label', 'Filter animated architecture flow');

    ['all', 'logic', 'code', 'data'].forEach(function (filter, index) {
      var labels = { all: 'All flows', logic: 'Logic flow', code: 'Code flow', data: 'Data flow' };
      var button = el('button', 'flow-filter', labels[filter]);
      button.type = 'button';
      button.setAttribute('data-flow-filter', filter);
      button.setAttribute('aria-pressed', index === 0 ? 'true' : 'false');
      toolbar.appendChild(button);
    });

    var play = el('button', 'flow-play-toggle', 'Pause animation');
    play.type = 'button';
    play.setAttribute('aria-pressed', 'false');
    toolbar.appendChild(play);
    section.appendChild(toolbar);

    var grid = el('div', 'flow-grid');
    config.lanes.forEach(function (lane) { grid.appendChild(buildLane(lane)); });
    section.appendChild(grid);

    var summary = el('div', 'flow-summary');
    summary.setAttribute('aria-label', 'Architecture summary');
    config.summary.forEach(function (entry) {
      var card = el('article');
      card.appendChild(el('span', '', entry[0]));
      card.appendChild(el('strong', '', entry[1]));
      summary.appendChild(card);
    });
    section.appendChild(summary);

    var runner = createRunner(section);

    toolbar.querySelectorAll('.flow-filter').forEach(function (button) {
      button.addEventListener('click', function () {
        var filter = button.getAttribute('data-flow-filter') || 'all';
        toolbar.querySelectorAll('.flow-filter').forEach(function (candidate) {
          candidate.setAttribute('aria-pressed', candidate === button ? 'true' : 'false');
        });
        section.querySelectorAll('.flow-lane').forEach(function (lane) {
          lane.hidden = filter !== 'all' && lane.getAttribute('data-flow-kind') !== filter;
        });
        if (play.getAttribute('aria-pressed') === 'false') runner.start();
      });
    });

    play.addEventListener('click', function () {
      var paused = play.getAttribute('aria-pressed') === 'true';
      if (paused) {
        play.setAttribute('aria-pressed', 'false');
        play.textContent = 'Pause animation';
        runner.start();
      } else {
        play.setAttribute('aria-pressed', 'true');
        play.textContent = 'Play animation';
        runner.stop();
      }
    });

    var observer = 'IntersectionObserver' in window
      ? new IntersectionObserver(function (entries) {
          entries.forEach(function (entry) {
            if (entry.isIntersecting && play.getAttribute('aria-pressed') === 'false') runner.start();
            else if (!entry.isIntersecting) runner.stop();
          });
        }, { threshold: 0.16 })
      : null;

    if (observer) observer.observe(section);
    else runner.start();

    return section;
  }

  function insertSection(section) {
    var main = document.querySelector('main.case-study-wrap') || document.querySelector('main');
    if (!main) return;

    var anchor = main.querySelector('.case-hero-meta') ||
      main.querySelector('.stats-line') ||
      main.querySelector('.case-metrics') ||
      main.querySelector('.case-callout');

    if (anchor && anchor.parentNode) {
      anchor.parentNode.insertBefore(section, anchor.nextSibling);
      return;
    }

    var firstHeading = main.querySelector('h2');
    if (firstHeading && firstHeading.parentNode) firstHeading.parentNode.insertBefore(section, firstHeading);
    else main.appendChild(section);
  }

  var slug = window.location.pathname.split('/').pop() || '';
  var config = projectConfigs[slug];
  if (!config || document.querySelector('.flow-showcase')) return;
  insertSection(buildSection(config));
})();
