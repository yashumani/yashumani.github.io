(function () {
  'use strict';

  var slug = window.location.pathname.split('/').pop() || '';
  var supported = {
    'mangrok-recipe-vault.html': true,
    'where-it-happened.html': true,
    'my-seventh-meal.html': true,
    'mlops-solution-accelerator.html': true,
    'agentic-knowledge-runtime.html': true
  };
  if (!supported[slug]) return;

  var attempts = 0;
  function setText(node, value) { if (node && value) node.textContent = value; }

  function caseHeadings() {
    return Array.prototype.slice.call(document.querySelectorAll('main.case-study-wrap > h2.case-section-heading'));
  }

  function setHeading(headings, index, value) {
    var heading = headings[index];
    if (!heading) return;
    var title = heading.querySelector('.case-section-title') || heading;
    setText(title, value);
  }

  function setParagraphAfter(headings, index, value) {
    var heading = headings[index];
    if (!heading) return;
    var next = heading.nextElementSibling;
    if (next && next.tagName === 'P') setText(next, value);
  }

  function patchCaseVoice() {
    var main = document.querySelector('main.case-study-wrap');
    if (!main) return;
    var lead = main.querySelector('h1 + p');
    var headings = caseHeadings();

    if (slug === 'where-it-happened.html') {
      setText(lead, 'I built this to test how far a static site could go as a real product. One browser-owned design state drives the map, poster, saved draft, shared link, and cart snapshot.');
      setHeading(headings, 0, 'What works today');
      setHeading(headings, 2, 'Why I built it');
      setParagraphAfter(headings, 2, 'A meaningful place can become a poster without making someone learn a map editor or hand the design state to several disconnected tools.');
      setHeading(headings, 5, 'Decisions that mattered');
      setParagraphAfter(headings, 5, 'The important choices were delayed map loading, one serializable design object, and a checkout path that never invents a completed transaction.');
    }

    if (slug === 'my-seventh-meal.html') {
      setText(lead, 'A photo can suggest what is on a plate. It cannot reveal every recipe choice, ingredient amount, or serving size. I designed the product around that gap instead of treating the first model answer as final.');
      setHeading(headings, 0, 'What is proposed and what is not');
      setHeading(headings, 2, 'Why I am working on it');
      setParagraphAfter(headings, 2, 'Manual meal entry can be accurate but slow. Photo-only estimates are fast but often too confident. The useful product sits between those two extremes.');
    }

    if (slug === 'mlops-solution-accelerator.html') {
      setText(lead, 'I built one reusable pipeline instead of repeating the same training setup for every dataset. Configuration defines the job, and the data, comparisons, final check, and registered result stay connected.');
      setHeading(headings, 0, 'What the implementation proves');
      setHeading(headings, 2, 'Why I built it');
      setParagraphAfter(headings, 2, 'A notebook can print a good score and still lose the settings and transformations that produced it. I wanted the path to the result to remain inspectable.');
      setHeading(headings, 5, 'Decisions that mattered');
      setParagraphAfter(headings, 5, 'The pipeline starts with configuration, runs fast baselines before a larger search, checks the selected result again, and records the run lineage.');
    }

    if (slug === 'agentic-knowledge-runtime.html') {
      setText(lead, 'I built this because a useful research answer needs more than a strong prompt. It needs source collection, retrieval, claim-level evidence, review, and a workflow that survives interruption.');
      setHeading(headings, 0, 'What the implementation proves');
      setHeading(headings, 2, 'Why I built it');
      setParagraphAfter(headings, 2, 'A one-shot answer can look finished while the supporting evidence is weak or missing. I wanted every material claim to keep a path back to its source.');
      setHeading(headings, 5, 'What keeps it inspectable');
      setParagraphAfter(headings, 5, 'Source adapters, evidence relationships, durable workflows, evaluation, and repair all stay visible after the prose is generated.');
    }
  }

  function patchMangrok(section) {
    setText(section.querySelector(':scope > header h2'), 'Mangrok: architecture and live flow');
    setText(section.querySelector(':scope > header .flow-copy'), 'This view shows where the recipe studio, private fields, analysis, cloud policies, print work, and human legacy review sit in the same product.');

    var stages = section.querySelectorAll('.architecture-stage');
    var stageData = [
      ['Create, preserve, and explore', ['Progressive web app', 'Recipe and media studio', 'Alchemy Lab interface', 'IndexedDB vault']],
      ['Protect secrets and govern analysis', ['Web Crypto', 'PBKDF2 key derivation', 'Supabase Auth and RLS', 'AI entitlement and metering']],
      ['Keep the canonical record', ['Recipe records', 'Encrypted note payloads', 'Private object storage', 'Versions and Alchemy history']],
      ['Run outside operations safely', ['Alchemy AI Edge Function', 'Print-order Edge Function', 'Export and deletion', 'Human legacy review']]
    ];
    stages.forEach(function (stage, index) {
      var data = stageData[index];
      if (!data) return;
      setText(stage.querySelector('h3'), data[0]);
      stage.querySelectorAll('.architecture-node').forEach(function (node, nodeIndex) {
        var strong = node.querySelector('strong') || node;
        if (data[1][nodeIndex]) setText(strong, data[1][nodeIndex]);
      });
    });

    var logic = section.querySelector('.flow-lane[data-flow-kind="logic"]');
    var logicTitles = ['Capture a recipe or open Alchemy', 'Protect private fields', 'Refine the culinary analysis', 'Share and version safely', 'Prepare print output', 'Send legacy requests to review'];
    if (logic) logic.querySelectorAll('.flow-step h4').forEach(function (node, i) { if (logicTitles[i]) setText(node, logicTitles[i]); });
    var code = section.querySelector('.flow-lane[data-flow-kind="code"]');
    var codeTitles = ['Boot the PWA shell', 'Run local crypto and analysis', 'Route optional model work', 'Evaluate cloud policies and entitlements', 'Run print and legacy operations'];
    if (code) code.querySelectorAll('.flow-step h4').forEach(function (node, i) { if (codeTitles[i]) setText(node, codeTitles[i]); });
    var summary = section.querySelectorAll('.flow-summary article strong');
    if (summary[1]) summary[1].textContent = 'PWA, Web Crypto, local or self-hosted models, Supabase, and Edge Functions';
    section.setAttribute('data-content-reviewed', '2026-08-12');
  }

  function patchFlow(section) {
    var title = section.querySelector(':scope > header h2');
    var copy = section.querySelector(':scope > header .flow-copy');
    var executionTitle = section.querySelector('.flow-execution-heading h3');
    var executionCopy = section.querySelector('.flow-execution-heading > p');

    if (slug === 'mangrok-recipe-vault.html') patchMangrok(section);
    if (slug === 'where-it-happened.html') {
      setText(title, 'Where It Happened: architecture and live flow');
      setText(copy, 'The architecture separates the static shell, map and design state, browser persistence, export, and the outside fulfillment boundary.');
    }
    if (slug === 'my-seventh-meal.html') {
      setText(title, 'My Seventh Meal: proposed architecture and decision flow');
      setText(copy, 'The model proposes likely meal structure. User confirmation and versioned software own the final record and calculation.');
    }
    if (slug === 'mlops-solution-accelerator.html') {
      setText(title, 'Automated ML platform: architecture and run flow');
      setText(copy, 'The diagram follows a configured dataset through preparation, baseline comparison, recipe search, refinement, final evaluation, and registration.');
    }
    if (slug === 'agentic-knowledge-runtime.html') {
      setText(title, 'Research runtime: architecture and live flow');
      setText(copy, 'The diagram follows source material through retrieval, evidence, drafting, review, repair, and controlled release.');
    }

    setText(executionTitle, 'How the work moves through the system');
    setText(executionCopy, 'All lanes stay visible. The filters are optional reading aids.');
    section.setAttribute('data-content-reviewed', '2026-08-12');
  }

  function run() {
    patchCaseVoice();
    attempts += 1;
    var section = document.querySelector('.flow-showcase');
    if (section) {
      patchFlow(section);
      return;
    }
    if (attempts <= 50) window.setTimeout(run, 100);
  }

  run();
})();
