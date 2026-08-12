(function () {
  'use strict';

  if (!/governed-ai-brain\.html$/.test(window.location.pathname)) return;
  if (document.querySelector('.flow-showcase')) return;

  var config = {
    id: 'ai-brain',
    title: 'Unified Knowledge Base — governed AI Brain architecture',
    copy: 'The platform separates source evidence, compilation and review, governed knowledge, and consumption adapters. The execution lanes show how logic, code, and data move through the same policy boundary.',
    architecture: [
      {
        badge: 'Source and evidence',
        title: 'Capture what was actually provided',
        note: 'Source metadata and original evidence remain traceable before any model or parser transforms the content.',
        nodes: [
          ['Files and Markdown vaults', 'client'],
          ['Git, SQL, and BI exports', 'external'],
          ['Source metadata and hashes', 'data'],
          ['Evidence objects', 'data']
        ]
      },
      {
        badge: 'Compiler and governance',
        title: 'Create candidates and require review',
        note: 'Deterministic rules, plugins, or optional AI can prepare candidates but cannot publish official knowledge.',
        nodes: [
          ['Brain compiler', 'service'],
          ['Ontology manager', 'service'],
          ['Plugin and AI providers', 'service'],
          ['Human review queue', 'client']
        ]
      },
      {
        badge: 'Governed brain',
        title: 'Publish reusable context',
        note: 'Approved objects retain state, evidence, ownership, policy, freshness, caveats, and relationships.',
        nodes: [
          ['Brain object store', 'data'],
          ['Relationship graph', 'data'],
          ['Retrieval service', 'service'],
          ['Context-pack builder', 'service']
        ]
      },
      {
        badge: 'Consumption adapters',
        title: 'Serve many AI experiences',
        note: 'Every adapter calls the same core services and authorization checks.',
        nodes: [
          ['REST API', 'service'],
          ['MCP adapter', 'service'],
          ['Python SDK and CLI', 'client'],
          ['BI copilots and agents', 'external']
        ]
      }
    ],
    lanes: [
      {
        kind: 'logic',
        title: 'Logic flow',
        badge: 'Governed lifecycle',
        steps: [
          ['Submit source context', 'A user, connector, or job submits source material with ownership, sensitivity, access, and version metadata.', 'Source + policy metadata'],
          ['Compile candidate objects', 'Parsers, plugins, rules, or optional AI classify evidence and map it to the ontology.', 'Evidence → candidates'],
          ['Review and decide', 'A human approves, rejects, or requests changes while preserving warnings and provenance.', 'Candidate ≠ published'],
          ['Publish governed knowledge', 'Approved objects become reusable brain records with explicit state and freshness.', 'Review gate'],
          ['Compose context pack', 'The runtime selects allowed definitions, rules, caveats, relationships, and evidence for the task.', 'Policy-aware context'],
          ['Serve the consumer', 'Applications, agents, notebooks, and pipelines receive the same governed context through the appropriate adapter.', 'REST / MCP / SDK / CLI']
        ]
      },
      {
        kind: 'code',
        title: 'Code flow',
        badge: 'Shared runtime',
        steps: [
          ['FastAPI receives the request', 'API routes validate Pydantic contracts and delegate to shared services.', 'Thin routes'],
          ['Compiler and plugin registry run', 'The compiler invokes enabled connectors, parsers, extractors, validators, and AI providers.', 'Config-driven pipeline'],
          ['Governance service creates review state', 'Review items and audit events are written without allowing direct publication.', 'State machine'],
          ['Retrieval and policy checks execute', 'Identity and access rules filter the candidate set before context is assembled.', 'Filter before model'],
          ['ContextPackService builds output', 'A versioned context payload is returned with objects, evidence, caveats, freshness, and confidence.', 'Inspectable payload'],
          ['Adapters expose the result', 'REST, MCP, SDK, and CLI wrap the same core behavior instead of duplicating it.', 'One source of truth']
        ]
      },
      {
        kind: 'data',
        title: 'Data flow',
        badge: 'Evidence to context',
        steps: [
          ['Raw source and metadata', 'Documents, SQL, dashboard exports, Markdown, and structured submissions arrive with source identity and policy data.'],
          ['Evidence layer', 'Original artifacts and normalized evidence chunks preserve what was actually provided.'],
          ['Candidate knowledge', 'Metrics, datasets, owners, rules, decisions, templates, and relationships remain explicitly unapproved.'],
          ['Published brain objects', 'Approved records carry state, lineage, source references, sensitivity, owner, reviewer, and freshness.'],
          ['Permission-aware context pack', 'Only allowed and relevant knowledge reaches the application or model consuming the brain.']
        ]
      }
    ],
    summary: [
      ['Product boundary', 'Context is the durable asset; answers are generated outputs'],
      ['Governance boundary', 'Plugins and AI create candidates; humans publish knowledge'],
      ['Security boundary', 'Identity and policy filter retrieval before context reaches a model']
    ]
  };

  function element(tag, className, text) {
    var node = document.createElement(tag);
    if (className) node.className = className;
    if (text !== undefined) node.textContent = text;
    return node;
  }

  function buildNode(item) {
    var node = element('li', 'architecture-node architecture-node--' + item[1]);
    node.appendChild(element('span', 'architecture-node-dot'));
    node.appendChild(element('strong', '', item[0]));
    return node;
  }

  function buildStage(stage, index) {
    var article = element('article', 'architecture-stage');
    var head = element('div', 'architecture-stage-head');
    head.appendChild(element('span', 'architecture-stage-index', String(index + 1).padStart(2, '0')));
    var titleWrap = element('div');
    titleWrap.appendChild(element('p', 'architecture-stage-badge', stage.badge));
    titleWrap.appendChild(element('h3', '', stage.title));
    head.appendChild(titleWrap);
    article.appendChild(head);

    var list = element('ul', 'architecture-node-list');
    stage.nodes.forEach(function (node) { list.appendChild(buildNode(node)); });
    article.appendChild(list);
    article.appendChild(element('p', 'architecture-stage-note', stage.note));
    return article;
  }

  function buildArchitecture(stages) {
    var section = element('section', 'architecture-overview');
    var heading = element('div', 'architecture-heading');
    var copy = element('div');
    copy.appendChild(element('p', 'flow-kicker', 'System architecture'));
    copy.appendChild(element('h3', '', 'Evidence to governed context'));
    heading.appendChild(copy);

    var legend = element('div', 'architecture-legend');
    [
      ['Client', 'client'],
      ['Service', 'service'],
      ['Data', 'data'],
      ['External', 'external']
    ].forEach(function (item) {
      legend.appendChild(element('span', 'architecture-legend-item architecture-legend-item--' + item[1], item[0]));
    });
    heading.appendChild(legend);
    section.appendChild(heading);

    var track = element('div', 'architecture-track');
    stages.forEach(function (stage, index) {
      track.appendChild(buildStage(stage, index));
      if (index < stages.length - 1) {
        var connector = element('div', 'architecture-connector');
        connector.setAttribute('aria-hidden', 'true');
        connector.appendChild(element('span', 'architecture-connector-line'));
        connector.appendChild(element('span', 'architecture-packet'));
        track.appendChild(connector);
      }
    });
    section.appendChild(track);
    return section;
  }

  function buildStep(step, index) {
    var item = element('li', 'flow-step');
    var number = element('span', 'flow-step-index', String(index + 1).padStart(2, '0'));
    number.setAttribute('aria-hidden', 'true');
    item.appendChild(number);
    item.appendChild(element('h4', '', step[0]));
    item.appendChild(element('p', '', step[1]));
    if (step[2]) item.appendChild(element('span', 'flow-mini', step[2]));
    return item;
  }

  function buildLane(lane) {
    var article = element('article', 'flow-lane');
    article.setAttribute('data-flow-kind', lane.kind);

    var head = element('div', 'flow-lane-head');
    head.appendChild(element('h3', '', lane.title));
    head.appendChild(element('span', 'flow-badge', lane.badge));
    article.appendChild(head);

    var list = element('ol', 'flow-track');
    lane.steps.forEach(function (step, index) { list.appendChild(buildStep(step, index)); });
    article.appendChild(list);
    return article;
  }

  function visibleSteps(section) {
    return Array.prototype.slice.call(section.querySelectorAll('.flow-lane:not([hidden]) .flow-step'));
  }

  function createRunner(section) {
    var timer = null;
    var index = -1;
    var reduced = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    function stop() {
      if (timer) window.clearInterval(timer);
      timer = null;
      section.classList.remove('is-running');
    }

    function advance() {
      var steps = visibleSteps(section);
      var stages = Array.prototype.slice.call(section.querySelectorAll('.architecture-stage'));
      if (!steps.length) return;
      steps.forEach(function (step) { step.classList.remove('is-current'); });
      stages.forEach(function (stage) { stage.classList.remove('is-current'); });
      index = (index + 1) % steps.length;
      steps[index].classList.add('is-current');
      if (stages.length) stages[index % stages.length].classList.add('is-current');
    }

    function start() {
      stop();
      advance();
      if (reduced) return;
      section.classList.add('is-running');
      timer = window.setInterval(advance, 1350);
    }

    return {
      start: start,
      stop: stop,
      isRunning: function () { return Boolean(timer); }
    };
  }

  function buildSection() {
    var section = element('section', 'flow-showcase');
    section.id = 'flow-' + config.id;
    section.setAttribute('aria-labelledby', section.id + '-title');
    section.setAttribute('data-content-reviewed', '2026-08-12');

    var header = element('header');
    header.appendChild(element('p', 'flow-kicker', 'Interactive system view'));
    var title = element('h2', '', config.title);
    title.id = section.id + '-title';
    header.appendChild(title);
    header.appendChild(element('p', 'flow-copy', config.copy));
    header.appendChild(element('span', 'flow-live-status', 'Architecture and flow playback'));
    section.appendChild(header);

    section.appendChild(buildArchitecture(config.architecture));

    var executionHeading = element('div', 'flow-execution-heading');
    var executionCopy = element('div');
    executionCopy.appendChild(element('p', 'flow-kicker', 'Live execution traces'));
    executionCopy.appendChild(element('h3', '', 'How logic, code, and data move'));
    executionHeading.appendChild(executionCopy);
    executionHeading.appendChild(element('p', '', 'All three lanes remain visible by default. Filters are optional reading aids, not required navigation.'));
    section.appendChild(executionHeading);

    var toolbar = element('div', 'flow-toolbar');
    toolbar.setAttribute('role', 'group');
    toolbar.setAttribute('aria-label', 'Filter animated execution flow');

    ['all', 'logic', 'code', 'data'].forEach(function (filter, index) {
      var labels = { all: 'All flows', logic: 'Logic flow', code: 'Code flow', data: 'Data flow' };
      var button = element('button', 'flow-filter', labels[filter]);
      button.type = 'button';
      button.setAttribute('data-flow-filter', filter);
      button.setAttribute('aria-pressed', index === 0 ? 'true' : 'false');
      toolbar.appendChild(button);
    });

    var play = element('button', 'flow-play-toggle', 'Pause animation');
    play.type = 'button';
    play.setAttribute('aria-pressed', 'false');
    toolbar.appendChild(play);
    section.appendChild(toolbar);

    var grid = element('div', 'flow-grid');
    config.lanes.forEach(function (lane) { grid.appendChild(buildLane(lane)); });
    section.appendChild(grid);

    section.appendChild(element('p', 'flow-summary-heading', 'Architecture rules'));
    var summary = element('div', 'flow-summary');
    summary.setAttribute('aria-label', 'Architecture rules');
    config.summary.forEach(function (entry) {
      var card = element('article');
      card.appendChild(element('span', '', entry[0]));
      card.appendChild(element('strong', '', entry[1]));
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
        }, { threshold: 0.12 })
      : null;

    if (observer) observer.observe(section);
    else runner.start();

    return section;
  }

  var main = document.querySelector('main.case-study-wrap') || document.querySelector('main');
  if (!main) return;

  var section = buildSection();
  var anchor = main.querySelector('.case-review-stamp') || main.querySelector('.stats-line') || main.querySelector('.case-metrics');
  if (anchor && anchor.parentNode) anchor.parentNode.insertBefore(section, anchor.nextSibling);
  else {
    var firstHeading = main.querySelector('h2');
    if (firstHeading && firstHeading.parentNode) firstHeading.parentNode.insertBefore(section, firstHeading);
    else main.appendChild(section);
  }
})();
