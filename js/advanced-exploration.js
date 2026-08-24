(function () {
  'use strict';

  var G6_URL = 'https://cdn.jsdelivr.net/npm/@antv/g6@5.1.1/dist/g6.min.js';
  var ECHARTS_URL = 'https://cdn.jsdelivr.net/npm/echarts@6.1.0/dist/echarts.min.js';
  var reducedMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var loaders = {};

  var palette = {
    experience: { light: '#e9f7f4', dark: '#163a34', stroke: '#0f9f8f' },
    control: { light: '#ece9ff', dark: '#282248', stroke: '#6657f2' },
    provider: { light: '#fff0d8', dark: '#3b2810', stroke: '#a85b00' },
    data: { light: '#eaf2ff', dark: '#192b45', stroke: '#4678c8' },
    evidence: { light: '#ffe8ee', dark: '#3d1721', stroke: '#b93856' },
    external: { light: '#eff0eb', dark: '#292d33', stroke: '#7b8088' }
  };

  function node(id, label, layer, x, y, description, evidence) {
    return { id: id, label: label, layer: layer, x: x, y: y, description: description, evidence: evidence || '' };
  }

  function edge(id, source, target, label, kind) {
    return { id: id, source: source, target: target, label: label || '', kind: kind || 'flow' };
  }

  var configs = {
    'agentic-harness-builder.html': {
      id: 'harnesslab',
      engine: 'g6',
      title: 'Explore the HarnessLab control plane',
      intro: 'Switch between requirement architecture, permission boundaries, and the one-worker critic trace. Pan, zoom, select a node, search, or replay the bounded path.',
      disclosure: 'The graph reflects implemented contracts and documented current-state boundaries. It does not represent a production swarm or live MCP/A2A execution.',
      views: [
        {
          id: 'architecture',
          label: 'Architecture',
          summary: 'Requirement interpretation stays deterministic. Provider guidance is optional and the validated HarnessResult remains the durable artifact.',
          nodes: [
            node('requirement', 'Requirement', 'experience', 70, 150, 'Objective, systems, constraints, risk, and success criteria entered in the browser.', 'Implemented browser requirement composer.'),
            node('interpreter', 'Requirement interpreter', 'control', 290, 80, 'Extracts structure and identifies the architecture decision without executing tools.', 'Deterministic browser engine.'),
            node('router', 'Architecture router', 'control', 290, 220, 'Chooses deterministic software, an LLM feature, a workflow, a single agent, or bounded temporary workers.', 'Implemented architecture-selection contract.'),
            node('gateway', 'Provider-neutral gateway', 'provider', 520, 70, 'Optional server boundary for deterministic, configured Ollama, or OpenRouter free-only analysis.', 'GET /health, POST /v1/analyze, POST /v1/critique.'),
            node('permissions', 'Permissions and approvals', 'control', 520, 210, 'Records allowed, denied, and approval-required actions before any worker is considered.', 'Deterministic control-plane output.'),
            node('artifacts', 'Artifact contract', 'evidence', 750, 80, 'Defines structured outputs, trace events, evaluation requirements, and retained evidence.', 'Validated HarnessResult schema.'),
            node('workspace', 'Immutable browser version', 'data', 750, 220, 'Saves the original requirement and validated result as a browser-local project version.', 'Local version history and JSON backup.'),
            node('critic', 'Temporary architecture critic', 'provider', 970, 150, 'One bounded reviewer may inspect an existing result through exactly one provider call.', 'One worker, no tools, no child agents, no external actions.')
          ],
          edges: [
            edge('h-a1', 'requirement', 'interpreter', 'interpret'),
            edge('h-a2', 'requirement', 'router', 'classify'),
            edge('h-a3', 'interpreter', 'gateway', 'optional guidance'),
            edge('h-a4', 'router', 'permissions', 'bound'),
            edge('h-a5', 'gateway', 'artifacts', 'validated result'),
            edge('h-a6', 'permissions', 'artifacts', 'policy'),
            edge('h-a7', 'artifacts', 'workspace', 'save'),
            edge('h-a8', 'artifacts', 'critic', 'review'),
            edge('h-a9', 'critic', 'workspace', 'review artifact')
          ],
          trace: ['requirement', 'interpreter', 'router', 'permissions', 'artifacts', 'critic', 'workspace']
        },
        {
          id: 'permissions',
          label: 'Permission boundary',
          summary: 'Agency is constrained before execution. The current critic cannot add tools, expand scope, or weaken denied and approval-required actions.',
          nodes: [
            node('objective', 'Requested objective', 'experience', 70, 150, 'The user states the outcome and relevant systems.', 'Input requirement.'),
            node('risk', 'Risk classification', 'control', 280, 60, 'The deterministic engine identifies destructive, financial, security-sensitive, and production-impacting work.', 'Current planner output.'),
            node('allowed', 'Allowed actions', 'control', 500, 50, 'Analysis, architecture guidance, and structured artifact generation within the stated boundary.', 'Permission matrix.'),
            node('approval', 'Approval required', 'provider', 500, 150, 'Consequential actions stay behind explicit human approval.', 'Approval gates.'),
            node('denied', 'Denied actions', 'evidence', 500, 250, 'No arbitrary code, commands, files, databases, deployments, purchases, or production changes.', 'Current execution boundary.'),
            node('worker', 'Temporary critic', 'provider', 730, 100, 'Receives a whitelist-only 48 KiB context envelope and one provider-call budget.', 'TemporaryWorker contract.'),
            node('merge', 'Deterministic merge gate', 'control', 730, 220, 'Only supported medium/high-confidence findings may add bounded notes or questions.', 'Cannot weaken the control plane.'),
            node('reviewed', 'Reviewed HarnessResult', 'data', 970, 150, 'Retains accepted and rejected findings, provenance, trace, and the review artifact.', 'Immutable saved version when the user chooses to save.')
          ],
          edges: [
            edge('h-p1', 'objective', 'risk'),
            edge('h-p2', 'risk', 'allowed'),
            edge('h-p3', 'risk', 'approval'),
            edge('h-p4', 'risk', 'denied'),
            edge('h-p5', 'allowed', 'worker'),
            edge('h-p6', 'approval', 'worker'),
            edge('h-p7', 'denied', 'merge', 'preserve'),
            edge('h-p8', 'worker', 'merge', 'typed review'),
            edge('h-p9', 'merge', 'reviewed')
          ],
          trace: ['objective', 'risk', 'allowed', 'worker', 'merge', 'reviewed']
        },
        {
          id: 'critic-trace',
          label: 'Critic trace',
          summary: 'The only executed temporary worker follows a fixed, inspectable lifecycle and returns advice rather than authority.',
          nodes: [
            node('validated', 'Validated HarnessResult', 'data', 60, 150, 'The critic accepts only the existing validated result.', 'Input contract.'),
            node('compile', 'Minimum-context compiler', 'control', 270, 150, 'Builds a whitelist-only envelope without credentials, tools, full chat history, or production data.', '48 KiB serialized limit.'),
            node('call', 'One provider call', 'provider', 480, 150, 'Deterministic, configured Ollama, or OpenRouter free-only provider.', 'Call budget = 1.'),
            node('validate', 'Review schema validator', 'control', 690, 80, 'Requires the fixed verdict, confidence, summary, and bounded finding categories.', 'Maximum six findings.'),
            node('accept', 'Finding acceptance', 'control', 690, 220, 'Applies only medium/high severity findings at confidence 0.70 or above.', 'Rejected findings remain retained.'),
            node('artifact', 'TemporaryAgentReview', 'evidence', 900, 80, 'Stores provider, model, latency, context size, accepted/rejected findings, and failures.', 'Retained review artifact.'),
            node('result', 'Reviewed result', 'data', 900, 220, 'Adds bounded questions, notes, evaluation, and trace without changing protected controls.', 'Portable result and optional saved version.')
          ],
          edges: [
            edge('h-c1', 'validated', 'compile'),
            edge('h-c2', 'compile', 'call'),
            edge('h-c3', 'call', 'validate'),
            edge('h-c4', 'validate', 'accept'),
            edge('h-c5', 'accept', 'artifact'),
            edge('h-c6', 'artifact', 'result')
          ],
          trace: ['validated', 'compile', 'call', 'validate', 'accept', 'artifact', 'result']
        }
      ]
    },

    'governed-ai-brain.html': {
      id: 'ai-brain',
      engine: 'g6',
      title: 'Explore the governed context architecture',
      intro: 'Trace evidence from ingestion to publication, inspect policy filtering before model exposure, and compare the shared service core with its adapters.',
      disclosure: 'The public project is an active scaffold using synthetic examples and an in-memory store. Durable persistence, production identity, and retrieval infrastructure remain unfinished.',
      views: [
        {
          id: 'governance',
          label: 'Governance lifecycle',
          summary: 'The durable product is approved context, not a generated answer. Candidate and published knowledge remain separate states.',
          nodes: [
            node('source', 'Source evidence', 'experience', 60, 150, 'Submitted text or parsed source material enters as evidence with a source path.', 'Current source-submission scaffold.'),
            node('compiler', 'Deterministic compiler', 'control', 270, 80, 'Creates candidate knowledge from evidence before optional model enrichment.', 'Compiler abstraction.'),
            node('enrich', 'Optional AI enrichment', 'provider', 270, 220, 'Local-first or explicitly configured hosted provider suggests summaries, risks, and reviewer questions.', 'Advisory only.'),
            node('candidate', 'Candidate object', 'data', 500, 150, 'A proposed metric, rule, report, system, owner, or other reusable object awaits review.', 'Review queue state.'),
            node('review', 'Human review', 'control', 720, 150, 'A reviewer approves, rejects, or requests changes; the model cannot publish official knowledge.', 'Governance service.'),
            node('published', 'Published object', 'data', 940, 80, 'Approved knowledge becomes available to permission-aware retrieval.', 'Current in-memory publication path.'),
            node('context', 'Context pack', 'evidence', 940, 220, 'Approved objects, evidence, caveats, and policy decisions become reusable context for a consumer.', 'Context-pack service.')
          ],
          edges: [
            edge('b-g1', 'source', 'compiler'),
            edge('b-g2', 'source', 'enrich'),
            edge('b-g3', 'compiler', 'candidate'),
            edge('b-g4', 'enrich', 'candidate'),
            edge('b-g5', 'candidate', 'review'),
            edge('b-g6', 'review', 'published'),
            edge('b-g7', 'published', 'context')
          ],
          trace: ['source', 'compiler', 'enrich', 'candidate', 'review', 'published', 'context']
        },
        {
          id: 'access',
          label: 'Access path',
          summary: 'Identity and policy filter the retrieval set before any context reaches a model or downstream application.',
          nodes: [
            node('principal', 'Principal or service', 'experience', 60, 150, 'A user or application requests context.', 'Target architecture; current shared-token identity is a scaffold limit.'),
            node('identity', 'Identity claims', 'control', 270, 80, 'Tenant, roles, groups, domain, and clearance should come from verified identity.', 'Production target; not complete on main.'),
            node('policy', 'Policy decision', 'control', 270, 220, 'Applies sensitivity, source ACL, role, ownership, and explicit-deny rules.', 'Access-policy abstraction.'),
            node('published', 'Published knowledge', 'data', 510, 70, 'Only approved objects can enter the retrieval path.', 'Current object store.'),
            node('evidence', 'Allowed evidence', 'data', 510, 230, 'Evidence is filtered independently so a permitted object cannot leak restricted support material.', 'Context-pack filtering behavior.'),
            node('retrieve', 'Permission-aware retrieval', 'control', 740, 150, 'Search runs over the allowed set instead of retrieving everything and relying on a prompt.', 'Implemented keyword scaffold; hybrid retrieval is roadmap work.'),
            node('pack', 'Context pack', 'evidence', 960, 150, 'Returns permitted context, caveats, and withheld-count signals without exposing restricted names.', 'Reusable consumer contract.')
          ],
          edges: [
            edge('b-a1', 'principal', 'identity'),
            edge('b-a2', 'principal', 'policy'),
            edge('b-a3', 'identity', 'policy'),
            edge('b-a4', 'policy', 'published'),
            edge('b-a5', 'policy', 'evidence'),
            edge('b-a6', 'published', 'retrieve'),
            edge('b-a7', 'evidence', 'retrieve'),
            edge('b-a8', 'retrieve', 'pack')
          ],
          trace: ['principal', 'identity', 'policy', 'published', 'evidence', 'retrieve', 'pack']
        },
        {
          id: 'adapters',
          label: 'Shared core and adapters',
          summary: 'REST is the platform backend. MCP, SDK, and CLI are adapters over the same compiler, governance, retrieval, and context services.',
          nodes: [
            node('rest', 'REST API', 'experience', 70, 50, 'Application and administration interface for ingestion, review, objects, context packs, and audit.', 'FastAPI routes.'),
            node('mcp', 'MCP adapter', 'experience', 70, 130, 'AI-facing adapter for governed submission, review, search, and context retrieval.', 'Current MCP server.'),
            node('sdk', 'Python SDK', 'experience', 70, 210, 'Notebook and service integration path.', 'Starter adapter.'),
            node('cli', 'CLI', 'experience', 70, 290, 'Local and CI-oriented operations.', 'Starter adapter.'),
            node('compiler', 'Compiler service', 'control', 350, 50, 'Builds structured candidate objects from source evidence.', 'Shared core.'),
            node('governance', 'Governance service', 'control', 350, 130, 'Owns review decisions and publication state.', 'Shared core.'),
            node('retrieval', 'Retrieval service', 'control', 350, 210, 'Finds approved, permitted objects.', 'Keyword scaffold today.'),
            node('context', 'Context-pack service', 'control', 350, 290, 'Composes reusable context, caveats, evidence, and withheld signals.', 'Shared core.'),
            node('store', 'Brain store', 'data', 660, 130, 'Current in-memory store holds evidence, candidates, objects, and audit events.', 'Must become PostgreSQL and object storage before durable use.'),
            node('providers', 'Model providers', 'provider', 660, 250, 'Deterministic fallback, local Ollama, and explicitly enabled hosted providers.', 'AI remains optional.'),
            node('consumers', 'Apps, agents, BI, notebooks', 'external', 930, 190, 'Downstream consumers use context packs rather than rebuilding governance logic.', 'Target consumption layer.')
          ],
          edges: [
            edge('b-d1', 'rest', 'compiler'), edge('b-d2', 'mcp', 'governance'), edge('b-d3', 'sdk', 'retrieval'), edge('b-d4', 'cli', 'context'),
            edge('b-d5', 'compiler', 'store'), edge('b-d6', 'governance', 'store'), edge('b-d7', 'retrieval', 'store'), edge('b-d8', 'context', 'store'),
            edge('b-d9', 'providers', 'compiler'), edge('b-d10', 'providers', 'context'), edge('b-d11', 'context', 'consumers')
          ],
          trace: ['rest', 'compiler', 'store', 'governance', 'retrieval', 'context', 'consumers']
        }
      ]
    },

    'dq-check-platform.html': {
      id: 'dq-check',
      engine: 'echarts',
      title: 'Explore the analysis-readiness model',
      intro: 'Move between quality coverage, the seven-step investigation path, and the browser-demo operating limits. These views describe structure and supported boundaries rather than business performance.',
      disclosure: 'Categorical values show whether a check can be supported from the uploaded file or needs governed external context. They are not model scores, causal claims, or production benchmarks.',
      views: [
        { id: 'coverage', label: 'Quality coverage', summary: 'The browser can profile several characteristics directly. Accuracy, drift, lineage, and timeliness require reference data, historical profiles, or governed rules.', chart: 'coverage' },
        { id: 'investigation', label: 'Investigation path', summary: 'Every drill creates a new cohort and reruns the eligible dimensions instead of preserving a stale first-pass ranking.', chart: 'dq-flow' },
        { id: 'limits', label: 'Public demo boundary', summary: 'The live browser prototype has documented upload and execution boundaries and is not represented as a warehouse-scale production system.', chart: 'dq-limits' }
      ]
    },

    'mlops-solution-accelerator.html': {
      id: 'mlops',
      engine: 'echarts',
      title: 'Explore the model-tournament evidence',
      intro: 'Inspect the tournament funnel, compare documented platform counts, and trace the lineage path from dataset and configuration to a registered model.',
      disclosure: 'The charts use documented implementation counts and structural relationships from the case study. They do not invent model accuracy, latency, adoption, or hours-saved results.',
      views: [
        { id: 'tournament', label: 'Tournament funnel', summary: 'Fast baselines, data-profiled recipe search, Optuna refinement, holdout evaluation, and registration form one controlled selection path.', chart: 'mlops-sankey' },
        { id: 'inventory', label: 'Implementation inventory', summary: 'Counts remain project evidence, not profile-level metrics or claims of business impact.', chart: 'mlops-counts' },
        { id: 'lineage', label: 'Lineage path', summary: 'A registered model remains connected to its source dataset, YAML configuration, candidate run, tuning study, and holdout evidence.', chart: 'mlops-lineage' }
      ]
    }
  };

  function currentTheme() { return document.documentElement.getAttribute('data-theme') === 'dark' ? 'dark' : 'light'; }
  function cssVar(name, fallback) { var value = getComputedStyle(document.documentElement).getPropertyValue(name).trim(); return value || fallback; }

  function loadScript(url, globalName) {
    if (window[globalName]) return Promise.resolve(window[globalName]);
    if (loaders[url]) return loaders[url];
    loaders[url] = new Promise(function (resolve, reject) {
      var existing = document.querySelector('script[data-advanced-viz-src="' + url + '"]');
      if (existing) {
        existing.addEventListener('load', function () { resolve(window[globalName]); }, { once: true });
        existing.addEventListener('error', reject, { once: true });
        return;
      }
      var script = document.createElement('script');
      script.src = url;
      script.async = true;
      script.crossOrigin = 'anonymous';
      script.setAttribute('data-advanced-viz-src', url);
      script.addEventListener('load', function () { if (window[globalName]) resolve(window[globalName]); else reject(new Error(globalName + ' did not initialize')); }, { once: true });
      script.addEventListener('error', function () { reject(new Error('Could not load ' + url)); }, { once: true });
      document.head.appendChild(script);
    });
    return loaders[url];
  }

  function element(tag, className, text) { var item = document.createElement(tag); if (className) item.className = className; if (typeof text === 'string') item.textContent = text; return item; }

  function injectStyles() {
    if (document.querySelector('link[data-advanced-exploration]')) return;
    var link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = '../css/advanced-exploration.css';
    link.setAttribute('data-advanced-exploration', 'true');
    document.head.appendChild(link);
  }

  function buildFallback(config, view) {
    var fallback = element('div', 'advanced-explorer-fallback');
    fallback.setAttribute('data-explorer-fallback', 'true');
    fallback.appendChild(element('p', 'mono-label', 'Text alternative'));
    fallback.appendChild(element('p', '', view.summary));
    if (config.engine === 'g6') {
      var list = element('ol', 'advanced-explorer-fallback-list');
      view.trace.forEach(function (id) {
        var itemData = view.nodes.find(function (candidate) { return candidate.id === id; });
        if (!itemData) return;
        var li = element('li');
        li.appendChild(element('strong', '', itemData.label));
        li.appendChild(element('span', '', itemData.description));
        list.appendChild(li);
      });
      fallback.appendChild(list);
    } else fallback.appendChild(element('p', '', config.disclosure));
    return fallback;
  }

  function buildSection(config) {
    var section = element('section', 'advanced-explorer reveal');
    section.id = 'advanced-explorer-' + config.id;
    section.setAttribute('data-advanced-explorer', config.engine);
    section.setAttribute('data-project-explorer', config.id);
    var header = element('header', 'advanced-explorer-header');
    var copy = element('div');
    copy.appendChild(element('p', 'flow-kicker', 'Advanced exploration'));
    copy.appendChild(element('h2', 'advanced-explorer-title', config.title));
    copy.appendChild(element('p', 'advanced-explorer-intro', config.intro));
    header.appendChild(copy);
    var engine = element('div', 'advanced-explorer-engine');
    engine.appendChild(element('span', '', config.engine === 'g6' ? 'AntV G6 5.1.1' : 'Apache ECharts 6.1.0'));
    engine.appendChild(element('small', '', 'Loaded only when this section is used'));
    header.appendChild(engine);
    section.appendChild(header);
    section.appendChild(element('p', 'advanced-explorer-disclosure', config.disclosure));

    var controls = element('div', 'advanced-explorer-controls');
    controls.setAttribute('aria-label', 'Visualization controls');
    var tabs = element('div', 'advanced-explorer-tabs');
    tabs.setAttribute('role', 'tablist');
    config.views.forEach(function (view, index) {
      var button = element('button', 'advanced-explorer-tab', view.label);
      button.type = 'button';
      button.setAttribute('role', 'tab');
      button.setAttribute('aria-selected', index === 0 ? 'true' : 'false');
      button.setAttribute('data-explorer-view', view.id);
      tabs.appendChild(button);
    });
    controls.appendChild(tabs);
    var actions = element('div', 'advanced-explorer-actions');
    if (config.engine === 'g6') {
      var searchLabel = element('label', 'advanced-explorer-search');
      searchLabel.appendChild(element('span', 'sr-only', 'Focus a component'));
      var select = element('select');
      select.setAttribute('data-explorer-search', 'true');
      select.innerHTML = '<option value="">Focus a component…</option>';
      searchLabel.appendChild(select);
      actions.appendChild(searchLabel);
      var replay = element('button', 'advanced-explorer-action', 'Replay trace');
      replay.type = 'button'; replay.setAttribute('data-explorer-replay', 'true'); actions.appendChild(replay);
    }
    var reset = element('button', 'advanced-explorer-action', 'Reset view'); reset.type = 'button'; reset.setAttribute('data-explorer-reset', 'true'); actions.appendChild(reset);
    var fullscreen = element('button', 'advanced-explorer-action', 'Fullscreen'); fullscreen.type = 'button'; fullscreen.setAttribute('data-explorer-fullscreen', 'true'); actions.appendChild(fullscreen);
    controls.appendChild(actions); section.appendChild(controls);

    var body = element('div', 'advanced-explorer-body');
    var stage = element('div', 'advanced-explorer-stage'); stage.setAttribute('data-explorer-stage', 'true'); stage.setAttribute('role', 'img'); stage.setAttribute('aria-label', config.title);
    var canvas = element('div', 'advanced-explorer-canvas'); canvas.setAttribute('data-explorer-canvas', 'true'); stage.appendChild(canvas);
    var loading = element('div', 'advanced-explorer-loading'); loading.setAttribute('data-explorer-loading', 'true'); loading.innerHTML = '<strong>Preparing interactive view</strong><span>Loading the pinned visualization runtime…</span>'; stage.appendChild(loading);
    body.appendChild(stage);
    var detail = element('aside', 'advanced-explorer-detail'); detail.setAttribute('data-explorer-detail', 'true'); detail.innerHTML = '<p class="mono-label">Selection</p><h3>' + config.views[0].label + '</h3><p>' + config.views[0].summary + '</p><dl><div><dt>Interaction</dt><dd>' + (config.engine === 'g6' ? 'Select a node to inspect its role and evidence boundary.' : 'Use the tabs and chart tooltips to inspect the structural evidence.') + '</dd></div></dl>'; body.appendChild(detail);
    section.appendChild(body);
    var fallbackWrap = element('div', 'advanced-explorer-fallback-wrap'); fallbackWrap.appendChild(buildFallback(config, config.views[0])); section.appendChild(fallbackWrap);
    var status = element('p', 'advanced-explorer-status'); status.setAttribute('role', 'status'); status.setAttribute('aria-live', 'polite'); status.setAttribute('data-explorer-status', 'true'); status.textContent = 'Interactive view will load when it enters the viewport.'; section.appendChild(status);
    return section;
  }

  function graphColors(layer) { var mode = currentTheme(); var entry = palette[layer] || palette.external; return { fill: entry[mode], stroke: entry.stroke }; }
  function graphNodeData(item) { var colors = graphColors(item.layer); return { id: item.id, data: { label: item.label, layer: item.layer, description: item.description, evidence: item.evidence }, style: { x: item.x, y: item.y, size: [172, 58], radius: 12, fill: colors.fill, stroke: colors.stroke, lineWidth: 1.5, labelText: item.label, labelFill: cssVar('--text', '#141518'), labelFontSize: 12, labelFontWeight: 700, labelWordWrap: true, labelMaxWidth: 148, cursor: 'pointer' } }; }
  function graphEdgeData(item) { return { id: item.id, source: item.source, target: item.target, data: { label: item.label, kind: item.kind }, style: { stroke: cssVar('--line-strong', '#aeb2aa'), lineWidth: 1.6, opacity: 0.85, endArrow: true, labelText: item.label, labelFill: cssVar('--text-muted', '#696d74'), labelFontSize: 10, labelBackground: true, labelBackgroundFill: cssVar('--surface', '#ffffff'), labelPadding: [2, 5], radius: 10 } }; }

  function renderGraph(section, config, view, state) {
    var canvas = section.querySelector('[data-explorer-canvas]'); var detail = section.querySelector('[data-explorer-detail]'); var status = section.querySelector('[data-explorer-status]'); var search = section.querySelector('[data-explorer-search]'); var loading = section.querySelector('[data-explorer-loading]');
    if (state.graph && typeof state.graph.destroy === 'function') state.graph.destroy(); state.graph = null; if (state.timer) window.clearInterval(state.timer); state.timer = null; canvas.innerHTML = ''; loading.hidden = false; status.textContent = 'Loading AntV G6 5.1.1…';
    return loadScript(G6_URL, 'G6').then(function (G6) {
      var nodeMap = {}; view.nodes.forEach(function (item) { nodeMap[item.id] = item; });
      var graph = new G6.Graph({ container: canvas, width: Math.max(320, canvas.clientWidth || 900), height: Math.max(460, canvas.clientHeight || 560), autoFit: 'view', padding: 30, data: { nodes: view.nodes.map(graphNodeData), edges: view.edges.map(graphEdgeData) }, node: { type: 'rect', state: { selected: { lineWidth: 3, shadowBlur: 18, shadowColor: cssVar('--accent', '#6657f2') }, highlight: { lineWidth: 2.5, stroke: cssVar('--mint', '#0f9f8f') }, inactive: { opacity: 0.28 }, trace: { lineWidth: 4, stroke: cssVar('--accent', '#6657f2'), shadowBlur: 22, shadowColor: cssVar('--accent', '#6657f2') } } }, edge: { type: 'polyline', state: { selected: { stroke: cssVar('--accent', '#6657f2'), lineWidth: 3 }, highlight: { stroke: cssVar('--mint', '#0f9f8f'), lineWidth: 2.5 }, inactive: { opacity: 0.18 }, trace: { stroke: cssVar('--accent', '#6657f2'), lineWidth: 4, opacity: 1 } } }, behaviors: ['drag-canvas', 'zoom-canvas', 'drag-element', { type: 'focus-element', animation: reducedMotion ? false : { duration: 420, easing: 'ease-out' } }, { type: 'click-select', degree: 1, state: 'selected', neighborState: 'highlight', unselectedState: 'inactive', animation: !reducedMotion, onClick: function (event) { var id = event && event.target && event.target.id; var item = nodeMap[id]; if (!item) return; detail.innerHTML = '<p class="mono-label">' + item.layer + ' layer</p><h3>' + item.label + '</h3><p>' + item.description + '</p><dl><div><dt>Evidence boundary</dt><dd>' + (item.evidence || 'Documented architecture role.') + '</dd></div></dl>'; status.textContent = 'Selected ' + item.label + '.'; } }], animation: !reducedMotion });
      state.graph = graph;
      return Promise.resolve(graph.render()).then(function () {
        loading.hidden = true; section.setAttribute('data-explorer-rendered', 'true'); status.textContent = 'Interactive graph ready. Drag, zoom, select, search, or replay the trace.'; detail.innerHTML = '<p class="mono-label">' + view.label + '</p><h3>' + view.label + '</h3><p>' + view.summary + '</p><dl><div><dt>Interaction</dt><dd>Select any component to inspect its role and evidence boundary.</dd></div></dl>';
        search.innerHTML = '<option value="">Focus a component…</option>' + view.nodes.map(function (item) { return '<option value="' + item.id + '">' + item.label + '</option>'; }).join('');
        search.onchange = function () { if (!search.value || !state.graph) return; var item = nodeMap[search.value]; if (typeof state.graph.focusElement === 'function') state.graph.focusElement(search.value, reducedMotion ? false : { duration: 420 }); if (typeof state.graph.setElementState === 'function') state.graph.setElementState(search.value, ['selected']); if (item) detail.innerHTML = '<p class="mono-label">' + item.layer + ' layer</p><h3>' + item.label + '</h3><p>' + item.description + '</p><dl><div><dt>Evidence boundary</dt><dd>' + (item.evidence || 'Documented architecture role.') + '</dd></div></dl>'; status.textContent = 'Focused ' + (item ? item.label : search.value) + '.'; };
        if (state.resizeObserver) state.resizeObserver.disconnect(); if ('ResizeObserver' in window) { state.resizeObserver = new ResizeObserver(function () { if (state.graph) state.graph.resize(Math.max(320, canvas.clientWidth), Math.max(460, canvas.clientHeight)); }); state.resizeObserver.observe(canvas); }
      });
    }).catch(function (error) { loading.hidden = true; section.setAttribute('data-explorer-rendered', 'fallback'); status.textContent = 'The graph library could not load. The complete text alternative remains available.'; detail.innerHTML = '<p class="mono-label">Fallback active</p><h3>' + view.label + '</h3><p>' + view.summary + '</p><p class="advanced-explorer-error">' + String(error.message || error) + '</p>'; });
  }

  function categorySupportOption() {
    var categories = ['Completeness', 'Uniqueness', 'Validity', 'Conformity', 'Consistency', 'Distribution', 'Privacy', 'Accuracy', 'Reference integrity', 'Lineage', 'Drift', 'Timeliness'];
    var browser = [1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0]; var external = browser.map(function (value) { return value ? 0 : 1; });
    return { animationDuration: reducedMotion ? 0 : 700, tooltip: { trigger: 'axis', confine: true, renderMode: 'richText' }, legend: { top: 0, textStyle: { color: cssVar('--text', '#141518') } }, grid: { left: 150, right: 24, top: 54, bottom: 30 }, xAxis: { type: 'value', min: 0, max: 1, interval: 1, axisLabel: { formatter: function (v) { return v === 1 ? 'Required' : ''; }, color: cssVar('--text-muted', '#696d74') }, splitLine: { show: false } }, yAxis: { type: 'category', inverse: true, data: categories, axisLabel: { color: cssVar('--text', '#141518') }, axisLine: { show: false }, axisTick: { show: false } }, series: [{ name: 'Browser file profile', type: 'bar', stack: 'support', data: browser, itemStyle: { color: cssVar('--mint', '#0f9f8f'), borderRadius: 5 }, label: { show: true, formatter: function (p) { return p.value ? 'Browser' : ''; }, color: cssVar('--text', '#141518') } }, { name: 'External governed context', type: 'bar', stack: 'support', data: external, itemStyle: { color: cssVar('--amber', '#a85b00'), borderRadius: 5 }, label: { show: true, formatter: function (p) { return p.value ? 'External' : ''; }, color: cssVar('--text', '#141518') } }] };
  }
  function dqFlowOption() { var names = ['Quality gate', 'Valid rows', 'Residual', 'Dimension scan', 'Contribution', 'Interactions', 'New cohort']; return { animationDuration: reducedMotion ? 0 : 900, tooltip: { trigger: 'item', confine: true, renderMode: 'richText' }, series: [{ type: 'sankey', data: names.map(function (name) { return { name: name }; }), links: names.slice(0, -1).map(function (name, index) { return { source: name, target: names[index + 1], value: 1 }; }).concat([{ source: 'New cohort', target: 'Dimension scan', value: 1 }]), left: 24, right: 24, top: 28, bottom: 24, nodeWidth: 22, nodeGap: 18, draggable: true, emphasis: { focus: 'adjacency' }, lineStyle: { color: 'gradient', curveness: 0.45, opacity: 0.55 }, label: { color: cssVar('--text', '#141518'), fontSize: 12 }, itemStyle: { borderWidth: 1, borderColor: cssVar('--line-strong', '#aeb2aa') } }] }; }
  function dqLimitsOption() { return { animationDuration: reducedMotion ? 0 : 650, tooltip: { trigger: 'item', confine: true, renderMode: 'richText' }, grid: { left: 150, right: 60, top: 28, bottom: 32 }, xAxis: [{ type: 'value', name: 'MB', max: 30, axisLabel: { color: cssVar('--text-muted', '#696d74') }, splitLine: { lineStyle: { color: cssVar('--line', '#d4d6cf') } } }, { type: 'value', name: 'Rows', max: 120000, position: 'top', axisLabel: { color: cssVar('--text-muted', '#696d74'), formatter: function (v) { return (v / 1000) + 'k'; } }, splitLine: { show: false } }], yAxis: { type: 'category', data: ['Upload size', 'Row count'], axisLabel: { color: cssVar('--text', '#141518') }, axisLine: { show: false }, axisTick: { show: false } }, series: [{ name: 'Upload size', type: 'bar', xAxisIndex: 0, data: [25, null], barWidth: 32, itemStyle: { color: cssVar('--accent', '#6657f2'), borderRadius: 7 }, label: { show: true, position: 'right', formatter: '25 MB', color: cssVar('--text', '#141518') } }, { name: 'Row count', type: 'bar', xAxisIndex: 1, data: [null, 100000], barWidth: 32, itemStyle: { color: cssVar('--mint', '#0f9f8f'), borderRadius: 7 }, label: { show: true, position: 'right', formatter: '100,000 rows', color: cssVar('--text', '#141518') } }] }; }
  function mlopsSankeyOption() { var names = ['Dataset + YAML', 'Validation', 'PyCaret baseline', 'FLAML baseline', 'Phase A champion', '457-recipe search', 'Optuna HPO', 'Holdout', 'Model registry']; var links = [['Dataset + YAML', 'Validation'], ['Validation', 'PyCaret baseline'], ['Validation', 'FLAML baseline'], ['PyCaret baseline', 'Phase A champion'], ['FLAML baseline', 'Phase A champion'], ['Phase A champion', '457-recipe search'], ['457-recipe search', 'Optuna HPO'], ['Optuna HPO', 'Holdout'], ['Holdout', 'Model registry']].map(function (pair) { return { source: pair[0], target: pair[1], value: 1 }; }); return { animationDuration: reducedMotion ? 0 : 900, tooltip: { trigger: 'item', confine: true, renderMode: 'richText' }, series: [{ type: 'sankey', data: names.map(function (name) { return { name: name }; }), links: links, left: 18, right: 18, top: 24, bottom: 20, nodeWidth: 20, nodeGap: 14, draggable: true, emphasis: { focus: 'adjacency' }, lineStyle: { color: 'gradient', curveness: 0.45, opacity: 0.58 }, label: { color: cssVar('--text', '#141518'), fontSize: 11 }, itemStyle: { borderWidth: 1, borderColor: cssVar('--line-strong', '#aeb2aa') } }] }; }
  function mlopsCountsOption() { var categories = ['Candidate recipes', 'Reusable components', 'Pipeline stages', 'Task families', 'Optuna trials']; var values = [457, 18, 5, 3, 50]; return { animationDuration: reducedMotion ? 0 : 700, tooltip: { trigger: 'axis', confine: true, renderMode: 'richText', axisPointer: { type: 'shadow' } }, grid: { left: 150, right: 40, top: 28, bottom: 32 }, xAxis: { type: 'log', min: 1, axisLabel: { color: cssVar('--text-muted', '#696d74') }, splitLine: { lineStyle: { color: cssVar('--line', '#d4d6cf') } } }, yAxis: { type: 'category', inverse: true, data: categories, axisLabel: { color: cssVar('--text', '#141518') }, axisLine: { show: false }, axisTick: { show: false } }, series: [{ type: 'bar', data: values, barWidth: 30, itemStyle: { color: function (p) { return [cssVar('--accent', '#6657f2'), cssVar('--mint', '#0f9f8f'), cssVar('--amber', '#a85b00'), cssVar('--rose', '#b93856'), '#4678c8'][p.dataIndex]; }, borderRadius: 7 }, label: { show: true, position: 'right', color: cssVar('--text', '#141518'), fontWeight: 700 } }] }; }
  function mlopsLineageOption() { var data = [{ name: 'Dataset asset', category: 0, x: 70, y: 150 }, { name: 'YAML config', category: 0, x: 70, y: 270 }, { name: 'Pipeline run', category: 1, x: 300, y: 210 }, { name: 'Candidate run', category: 2, x: 520, y: 100 }, { name: 'Optuna study', category: 2, x: 520, y: 210 }, { name: 'Holdout evidence', category: 3, x: 520, y: 320 }, { name: 'Registered model', category: 4, x: 780, y: 210 }]; var links = [['Dataset asset', 'Pipeline run'], ['YAML config', 'Pipeline run'], ['Pipeline run', 'Candidate run'], ['Candidate run', 'Optuna study'], ['Optuna study', 'Holdout evidence'], ['Holdout evidence', 'Registered model'], ['Candidate run', 'Registered model']].map(function (pair) { return { source: pair[0], target: pair[1] }; }); return { animationDuration: reducedMotion ? 0 : 850, tooltip: { trigger: 'item', confine: true, renderMode: 'richText' }, legend: [{ data: ['Inputs', 'Orchestration', 'Search', 'Evaluation', 'Registry'], top: 0, textStyle: { color: cssVar('--text', '#141518') } }], series: [{ type: 'graph', layout: 'none', roam: true, data: data.map(function (item) { return Object.assign({}, item, { symbolSize: 74 }); }), links: links, categories: ['Inputs', 'Orchestration', 'Search', 'Evaluation', 'Registry'].map(function (name) { return { name: name }; }), left: 20, right: 20, top: 50, bottom: 20, label: { show: true, position: 'inside', color: '#fff', fontSize: 10, overflow: 'break', width: 65 }, edgeSymbol: ['none', 'arrow'], edgeSymbolSize: 8, lineStyle: { color: cssVar('--line-strong', '#aeb2aa'), width: 2, curveness: 0.08 }, emphasis: { focus: 'adjacency', lineStyle: { width: 4 } }, itemStyle: { borderWidth: 2, borderColor: cssVar('--surface', '#fff') } }] }; }
  function chartOption(kind) { if (kind === 'coverage') return categorySupportOption(); if (kind === 'dq-flow') return dqFlowOption(); if (kind === 'dq-limits') return dqLimitsOption(); if (kind === 'mlops-sankey') return mlopsSankeyOption(); if (kind === 'mlops-counts') return mlopsCountsOption(); return mlopsLineageOption(); }

  function renderChart(section, config, view, state) {
    var canvas = section.querySelector('[data-explorer-canvas]'); var detail = section.querySelector('[data-explorer-detail]'); var status = section.querySelector('[data-explorer-status]'); var loading = section.querySelector('[data-explorer-loading]');
    if (state.chart && typeof state.chart.dispose === 'function') state.chart.dispose(); state.chart = null; canvas.innerHTML = ''; loading.hidden = false; status.textContent = 'Loading Apache ECharts 6.1.0…';
    return loadScript(ECHARTS_URL, 'echarts').then(function (echarts) { var chart = echarts.init(canvas, currentTheme() === 'dark' ? 'dark' : null, { renderer: 'canvas' }); state.chart = chart; chart.setOption(chartOption(view.chart), true); loading.hidden = true; section.setAttribute('data-explorer-rendered', 'true'); status.textContent = 'Interactive analytical view ready. Use the tabs, tooltips, drag, and zoom where available.'; detail.innerHTML = '<p class="mono-label">' + view.label + '</p><h3>' + view.label + '</h3><p>' + view.summary + '</p><dl><div><dt>Evidence boundary</dt><dd>' + config.disclosure + '</dd></div></dl>'; if (state.resizeObserver) state.resizeObserver.disconnect(); if ('ResizeObserver' in window) { state.resizeObserver = new ResizeObserver(function () { if (state.chart) state.chart.resize(); }); state.resizeObserver.observe(canvas); } }).catch(function (error) { loading.hidden = true; section.setAttribute('data-explorer-rendered', 'fallback'); status.textContent = 'The chart library could not load. The complete text alternative remains available.'; detail.innerHTML = '<p class="mono-label">Fallback active</p><h3>' + view.label + '</h3><p>' + view.summary + '</p><p class="advanced-explorer-error">' + String(error.message || error) + '</p>'; });
  }

  function initSection(section, config) {
    var state = { activeView: config.views[0], graph: null, chart: null, timer: null, resizeObserver: null, started: false }; var status = section.querySelector('[data-explorer-status]'); var fallbackWrap = section.querySelector('.advanced-explorer-fallback-wrap');
    function render(view) { state.activeView = view; fallbackWrap.innerHTML = ''; fallbackWrap.appendChild(buildFallback(config, view)); section.querySelectorAll('[data-explorer-view]').forEach(function (button) { button.setAttribute('aria-selected', button.getAttribute('data-explorer-view') === view.id ? 'true' : 'false'); }); if (config.engine === 'g6') renderGraph(section, config, view, state); else renderChart(section, config, view, state); }
    function start() { if (state.started) return; state.started = true; render(state.activeView); }
    section.querySelectorAll('[data-explorer-view]').forEach(function (button) { button.addEventListener('click', function () { var view = config.views.find(function (candidate) { return candidate.id === button.getAttribute('data-explorer-view'); }); if (!view) return; state.started = true; render(view); }); });
    var replay = section.querySelector('[data-explorer-replay]'); if (replay) replay.addEventListener('click', function () { if (!state.graph || !state.activeView.trace || reducedMotion) { status.textContent = reducedMotion ? 'Trace animation is disabled by the reduced-motion preference.' : 'The interactive graph is still loading.'; return; } if (state.timer) window.clearInterval(state.timer); var index = -1; var previous = null; var edges = state.activeView.edges; function advance() { if (!state.graph) return; if (previous && typeof state.graph.setElementState === 'function') state.graph.setElementState(previous, []); index = (index + 1) % state.activeView.trace.length; var current = state.activeView.trace[index]; state.graph.setElementState(current, ['trace']); var prior = index > 0 ? state.activeView.trace[index - 1] : null; edges.forEach(function (item) { var active = prior && item.source === prior && item.target === current; state.graph.setElementState(item.id, active ? ['trace'] : []); }); previous = current; status.textContent = 'Trace step ' + (index + 1) + ' of ' + state.activeView.trace.length + ': ' + (state.activeView.nodes.find(function (item) { return item.id === current; }) || {}).label + '.'; } advance(); state.timer = window.setInterval(advance, 1150); });
    section.querySelector('[data-explorer-reset]').addEventListener('click', function () { if (state.timer) window.clearInterval(state.timer); state.timer = null; if (state.graph) { state.activeView.nodes.forEach(function (item) { state.graph.setElementState(item.id, []); }); state.activeView.edges.forEach(function (item) { state.graph.setElementState(item.id, []); }); if (typeof state.graph.fitView === 'function') state.graph.fitView({ when: 'always', direction: 'both' }, reducedMotion ? false : { duration: 420 }); } if (state.chart) state.chart.setOption(chartOption(state.activeView.chart), true); status.textContent = 'View reset.'; });
    section.querySelector('[data-explorer-fullscreen]').addEventListener('click', function () { if (!document.fullscreenElement && section.requestFullscreen) section.requestFullscreen(); else if (document.exitFullscreen) document.exitFullscreen(); });
    if ('MutationObserver' in window) { var themeObserver = new MutationObserver(function (records) { var changed = records.some(function (record) { return record.attributeName === 'data-theme'; }); if (changed && state.started) render(state.activeView); }); themeObserver.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] }); }
    if ('IntersectionObserver' in window) { var observer = new IntersectionObserver(function (entries) { entries.forEach(function (entry) { if (!entry.isIntersecting) return; start(); observer.disconnect(); }); }, { threshold: 0.05, rootMargin: '180px 0px' }); observer.observe(section); } else start();
    document.addEventListener('fullscreenchange', function () { window.setTimeout(function () { if (state.graph) state.graph.resize(); if (state.chart) state.chart.resize(); }, 120); });
  }

  function placeSection(section) {
    var main = document.querySelector('main.case-study-wrap'); if (!main) return false; var flow = main.querySelector('.flow-showcase'); if (flow) { flow.insertAdjacentElement('afterend', section); return true; } var actions = main.querySelector('.case-links-top, .case-links'); if (actions) { actions.insertAdjacentElement('afterend', section); return true; } var metadata = main.querySelector('.case-hero-meta, .stats-line, .case-callout'); if (metadata) { metadata.insertAdjacentElement('afterend', section); return true; } var firstHeading = main.querySelector(':scope > h2'); if (firstHeading) firstHeading.insertAdjacentElement('beforebegin', section); else main.appendChild(section); return true;
  }

  function init() {
    var slug = window.location.pathname.split('/').pop() || ''; var config = configs[slug]; if (!config || document.querySelector('[data-project-explorer="' + config.id + '"]')) return; injectStyles(); var section = buildSection(config); var attempts = 0;
    function place() { attempts += 1; if (placeSection(section)) { initSection(section, config); section.classList.add('in'); return; } if (attempts < 20) window.setTimeout(place, 50); }
    window.setTimeout(place, slug === 'governed-ai-brain.html' ? 180 : 40);
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init, { once: true }); else init();
})();
