(function () {
  'use strict';

  var config = {
    title: 'HarnessLab — system architecture and live flow',
    copy: 'The architecture separates the browser workspace, deterministic control plane, provider gateway, and retained review evidence. The execution lanes show how a requirement becomes a bounded harness and, when explicitly enabled, one controlled critic review.',
    architecture: [
      {
        badge: 'Experience layer',
        title: 'Frame and inspect the project',
        note: 'The live no-build React application remains useful without a model or gateway.',
        nodes: [
          ['No-build React command center', 'client'],
          ['Requirement composer', 'client'],
          ['Architecture visualizer', 'client'],
          ['Browser project workspace', 'data']
        ]
      },
      {
        badge: 'Deterministic control plane',
        title: 'Build the harness contract',
        note: 'Rules and validators remain authoritative around any model-supplied guidance.',
        nodes: [
          ['Requirement interpreter', 'service'],
          ['Architecture router', 'service'],
          ['Permission and approval matrix', 'service'],
          ['Artifact, trace, and evaluation contract', 'data']
        ]
      },
      {
        badge: 'Provider and worker boundary',
        title: 'Add one bounded review seam',
        note: 'Provider selection and credentials remain in the gateway, never in the browser request.',
        nodes: [
          ['Provider-neutral gateway', 'service'],
          ['Deterministic provider', 'service'],
          ['Ollama adapter', 'external'],
          ['OpenRouter free-only adapter', 'external']
        ]
      },
      {
        badge: 'Evidence and retention',
        title: 'Validate what survives',
        note: 'The temporary critic is advisory; deterministic acceptance decides which findings affect the reviewed result.',
        nodes: [
          ['HarnessResult validator', 'service'],
          ['48 KiB context compiler', 'service'],
          ['TemporaryAgentReview artifact', 'data'],
          ['Immutable local version and backup', 'data']
        ]
      }
    ],
    lanes: [
      {
        kind: 'logic', title: 'Logic flow', badge: 'Design decision',
        steps: [
          ['Describe the objective', 'The user supplies the goal, systems, constraints, success criteria, and known risks.', 'Requirement first'],
          ['Choose the least complex architecture', 'The planner decides whether deterministic software, an LLM feature, a workflow, a single agent, or bounded multi-agent guidance fits the requirement.', 'Agency must be justified'],
          ['Define the harness', 'The result specifies topology, protocols, permissions, approvals, artifacts, failures, trace, and evaluation.', 'Control plane before execution'],
          ['Optionally run one critic', 'A compatible gateway may execute one temporary architecture critic against the validated plan.', 'One worker · one call'],
          ['Accept findings deterministically', 'Only typed medium/high-severity findings with confidence of at least 0.70 may add bounded review evidence.', 'Advice is not authority'],
          ['Save the reviewed version', 'The original and reviewed results remain available as immutable browser-local project versions and JSON exports.', 'Retain the evidence']
        ]
      },
      {
        kind: 'code', title: 'Code flow', badge: 'Runtime path',
        steps: [
          ['React shell loads', 'GitHub Pages serves the command center and local project workspace without a build-time application server.', 'Static UI → local workspace'],
          ['Analysis path resolves', 'Browser mode runs the deterministic engine; automatic or required mode can call the configured gateway.', 'Browser or gateway'],
          ['Shared validator executes', 'Every browser, fallback, gateway, and critic result must satisfy the same structured contract before rendering or saving.', 'One HarnessResult contract'],
          ['Critic context compiles', 'The gateway validates the plan and builds a whitelist-only envelope that excludes credentials, tools, files, databases, and production data.', 'Maximum 48 KiB'],
          ['One provider call runs', 'The fixed Architecture Critic uses the deterministic provider, configured Ollama model, or a free-only OpenRouter route.', 'No tools or child agents'],
          ['Merge gate preserves controls', 'Accepted findings may add questions and review evidence but cannot weaken permissions, stages, protocols, or constraints.', 'Deterministic merge']
        ]
      },
      {
        kind: 'data', title: 'Data flow', badge: 'Artifact path',
        steps: [
          ['Requirement record', 'The full objective and constraints enter the project as the source input.'],
          ['Validated HarnessResult', 'Architecture, permissions, planned agents, artifacts, trace, evaluation, and unresolved questions form one portable object.'],
          ['Minimum critic envelope', 'Only approved result fields and the fixed worker policy cross the temporary-worker boundary.'],
          ['TemporaryAgentReview', 'Verdict, confidence, accepted findings, rejected findings, provider metadata, and failure evidence return as a typed artifact.'],
          ['Versioned workspace', 'The reviewed result, original requirement, artifacts, and trace are retained locally and can be exported as JSON.']
        ]
      }
    ],
    summary: [
      ['Agency boundary', 'Start deterministic and add temporary intelligence only when justified'],
      ['Permission boundary', 'One worker, one call, no tools, no children, no external actions'],
      ['Provider boundary', 'The browser holds no model credential or provider-selection authority']
    ]
  };

  function node(tag, className, text) {
    var value = document.createElement(tag);
    if (className) value.className = className;
    if (typeof text === 'string') value.textContent = text;
    return value;
  }

  function architectureStage(stage, index) {
    var article = node('article', 'architecture-stage');
    article.setAttribute('data-architecture-stage', String(index + 1));
    var head = node('div', 'architecture-stage-head');
    head.appendChild(node('span', 'architecture-stage-index', String(index + 1).padStart(2, '0')));
    var copy = node('div');
    copy.appendChild(node('p', 'architecture-stage-badge', stage.badge));
    copy.appendChild(node('h3', '', stage.title));
    head.appendChild(copy);
    article.appendChild(head);
    var list = node('ul', 'architecture-node-list');
    stage.nodes.forEach(function (item) {
      var entry = node('li', 'architecture-node architecture-node--' + item[1]);
      entry.appendChild(node('span', 'architecture-node-dot'));
      entry.appendChild(node('strong', '', item[0]));
      list.appendChild(entry);
    });
    article.appendChild(list);
    article.appendChild(node('p', 'architecture-stage-note', stage.note));
    return article;
  }

  function architectureMap() {
    var section = node('section', 'architecture-overview');
    section.setAttribute('aria-label', 'System architecture');
    var heading = node('div', 'architecture-heading');
    var copy = node('div');
    copy.appendChild(node('p', 'flow-kicker', 'Architecture map'));
    copy.appendChild(node('h3', '', 'How the system is divided'));
    heading.appendChild(copy);
    var legend = node('div', 'architecture-legend');
    [['client', 'Experience'], ['service', 'Service'], ['data', 'Data'], ['external', 'External / operational']].forEach(function (item) {
      legend.appendChild(node('span', 'architecture-legend-item architecture-legend-item--' + item[0], item[1]));
    });
    heading.appendChild(legend);
    section.appendChild(heading);
    var track = node('div', 'architecture-track');
    config.architecture.forEach(function (stage, index) {
      track.appendChild(architectureStage(stage, index));
      if (index < config.architecture.length - 1) {
        var connector = node('div', 'architecture-connector');
        connector.setAttribute('aria-hidden', 'true');
        connector.appendChild(node('span', 'architecture-connector-line'));
        connector.appendChild(node('span', 'architecture-packet'));
        track.appendChild(connector);
      }
    });
    section.appendChild(track);
    return section;
  }

  function flowLane(lane) {
    var article = node('article', 'flow-lane');
    article.setAttribute('data-flow-kind', lane.kind);
    var head = node('div', 'flow-lane-head');
    head.appendChild(node('h3', '', lane.title));
    head.appendChild(node('span', 'flow-badge', lane.badge));
    article.appendChild(head);
    var list = node('ol', 'flow-track');
    lane.steps.forEach(function (step, index) {
      var item = node('li', 'flow-step');
      var number = node('span', 'flow-step-index', String(index + 1).padStart(2, '0'));
      number.setAttribute('aria-hidden', 'true');
      item.appendChild(number);
      item.appendChild(node('h4', '', step[0]));
      item.appendChild(node('p', '', step[1]));
      if (step[2]) item.appendChild(node('span', 'flow-mini', step[2]));
      list.appendChild(item);
    });
    article.appendChild(list);
    return article;
  }

  function buildShowcase() {
    var section = node('section', 'flow-showcase');
    section.id = 'flow-harnesslab';
    section.setAttribute('aria-labelledby', 'flow-harnesslab-title');
    var header = node('header');
    header.appendChild(node('p', 'flow-kicker', 'Interactive system view'));
    var title = node('h2', '', config.title);
    title.id = 'flow-harnesslab-title';
    header.appendChild(title);
    header.appendChild(node('p', 'flow-copy', config.copy));
    header.appendChild(node('span', 'flow-live-status', 'Architecture and flow playback'));
    section.appendChild(header);
    section.appendChild(architectureMap());

    var execution = node('div', 'flow-execution-heading');
    var executionCopy = node('div');
    executionCopy.appendChild(node('p', 'flow-kicker', 'Live execution traces'));
    executionCopy.appendChild(node('h3', '', 'How logic, code, and data move'));
    execution.appendChild(executionCopy);
    execution.appendChild(node('p', '', 'All three lanes remain visible by default. Filters are optional reading aids, not required navigation.'));
    section.appendChild(execution);

    var toolbar = node('div', 'flow-toolbar');
    toolbar.setAttribute('role', 'group');
    toolbar.setAttribute('aria-label', 'Filter animated execution flow');
    var labels = { all: 'All flows', logic: 'Logic flow', code: 'Code flow', data: 'Data flow' };
    ['all', 'logic', 'code', 'data'].forEach(function (filter, index) {
      var button = node('button', 'flow-filter', labels[filter]);
      button.type = 'button';
      button.setAttribute('data-flow-filter', filter);
      button.setAttribute('aria-pressed', index === 0 ? 'true' : 'false');
      toolbar.appendChild(button);
    });
    var play = node('button', 'flow-play-toggle', 'Pause animation');
    play.type = 'button';
    play.setAttribute('aria-pressed', 'false');
    toolbar.appendChild(play);
    section.appendChild(toolbar);

    var grid = node('div', 'flow-grid');
    config.lanes.forEach(function (lane) { grid.appendChild(flowLane(lane)); });
    section.appendChild(grid);
    section.appendChild(node('p', 'flow-summary-heading', 'Architecture rules'));
    var summary = node('div', 'flow-summary');
    summary.setAttribute('aria-label', 'Architecture rules');
    config.summary.forEach(function (item) {
      var card = node('article');
      card.appendChild(node('span', '', item[0]));
      card.appendChild(node('strong', '', item[1]));
      summary.appendChild(card);
    });
    section.appendChild(summary);
    activate(section, toolbar, play);
    return section;
  }

  function activate(section, toolbar, play) {
    var timer = null;
    var current = -1;
    var reduced = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    function visibleSteps() {
      return Array.prototype.slice.call(section.querySelectorAll('.flow-lane:not([hidden]) .flow-step'));
    }
    function stop() {
      if (timer) window.clearInterval(timer);
      timer = null;
      section.classList.remove('is-running');
    }
    function advance() {
      var steps = visibleSteps();
      var stages = Array.prototype.slice.call(section.querySelectorAll('.architecture-stage'));
      if (!steps.length) return;
      steps.forEach(function (step) { step.classList.remove('is-current'); });
      stages.forEach(function (stage) { stage.classList.remove('is-current'); });
      current = (current + 1) % steps.length;
      steps[current].classList.add('is-current');
      if (stages.length) stages[current % stages.length].classList.add('is-current');
    }
    function start() {
      stop();
      advance();
      if (reduced) return;
      section.classList.add('is-running');
      timer = window.setInterval(advance, 1350);
    }

    toolbar.querySelectorAll('.flow-filter').forEach(function (button) {
      button.addEventListener('click', function () {
        var filter = button.getAttribute('data-flow-filter') || 'all';
        toolbar.querySelectorAll('.flow-filter').forEach(function (candidate) {
          candidate.setAttribute('aria-pressed', candidate === button ? 'true' : 'false');
        });
        section.querySelectorAll('.flow-lane').forEach(function (lane) {
          lane.hidden = filter !== 'all' && lane.getAttribute('data-flow-kind') !== filter;
        });
        current = -1;
        if (play.getAttribute('aria-pressed') === 'false') start();
      });
    });

    play.addEventListener('click', function () {
      var paused = play.getAttribute('aria-pressed') === 'true';
      if (paused) {
        play.setAttribute('aria-pressed', 'false');
        play.textContent = 'Pause animation';
        start();
      } else {
        play.setAttribute('aria-pressed', 'true');
        play.textContent = 'Play animation';
        stop();
      }
    });

    if ('IntersectionObserver' in window) {
      var observer = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting && play.getAttribute('aria-pressed') === 'false') start();
          else if (!entry.isIntersecting) stop();
        });
      }, { threshold: 0.12 });
      observer.observe(section);
    } else start();
  }

  function init() {
    if (document.querySelector('.flow-showcase')) return;
    var main = document.querySelector('main.case-study-wrap');
    if (!main) return;
    var section = buildShowcase();
    var anchor = main.querySelector('.case-hero-meta');
    if (anchor && anchor.parentNode) anchor.parentNode.insertBefore(section, anchor.nextSibling);
    else {
      var firstHeading = main.querySelector(':scope > h2');
      if (firstHeading) main.insertBefore(section, firstHeading);
      else main.appendChild(section);
    }
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init, { once: true });
  else init();
})();
