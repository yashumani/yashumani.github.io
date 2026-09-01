(function () {
  'use strict';

  var api = window.PORTFOLIO_FACTCHECK;
  if (!api) return;

  var slug = 'forkwise-open-source-reviewer.html';
  var sources = window.PORTFOLIO_PROJECT_SOURCES = window.PORTFOLIO_PROJECT_SOURCES || {};
  sources[slug] = [
    {
      label: 'ForkWise — Open Source Reviewer repository',
      url: 'https://github.com/yashumani/open-source-reviewer-app',
      note: 'Primary implementation, tests, policies, issue history, and current-state evidence for this case study.'
    },
    {
      label: 'ForkWise analyzer rules',
      url: 'https://github.com/yashumani/open-source-reviewer-app/blob/main/docs/ANALYZER_RULES.md',
      note: 'Project documentation for the evidence families, README claim states, five adoption dimensions, decision precedence, confidence rules, and explicit non-claims.'
    },
    {
      label: 'ForkWise Community Preview release evidence',
      url: 'https://github.com/yashumani/open-source-reviewer-app/blob/main/docs/COMMUNITY_READINESS_EVIDENCE.md',
      note: 'Dated release record for version 0.9.0, validation results, Pages deployment, contributor workflow, and remaining hosted and production work.'
    },
    {
      label: 'GitHub REST API documentation',
      url: 'https://docs.github.com/en/rest',
      note: 'Published API documentation for the repository metadata and content interfaces used by the read-only acquisition layer. ForkWise does not claim ownership of GitHub data or APIs.'
    }
  ];

  function makeHomeEntry() {
    var article = document.createElement('article');
    article.className = 'work-entry reveal in';
    article.setAttribute('data-project', 'forkwise-open-source-reviewer');
    article.innerHTML = '<p class="work-index">06</p>' +
      '<div class="work-entry-main"><div class="work-entry-meta">' +
      '<span class="status-badge status-live">Community preview</span>' +
      '<span>Open source · Static analysis · Adoption due diligence</span></div>' +
      '<h3><a href="projects/forkwise-open-source-reviewer.html">ForkWise — Open Source Reviewer</a></h3>' +
      '<p>A GitHub-native reviewer that pins a public repository to an exact commit, compares README claims with bounded implementation evidence, and returns an auditable adoption recommendation.</p></div>' +
      '<div class="work-entry-stack" aria-label="ForkWise core skills">' +
      '<span>JavaScript</span><span>GitHub REST</span><span>JSON Schema</span><span>PostgreSQL</span><span>GitHub Actions</span></div>' +
      '<a class="work-entry-action" href="projects/forkwise-open-source-reviewer.html" aria-label="Open ForkWise Open Source Reviewer case study">Case study <span aria-hidden="true">↗</span></a>';
    return article;
  }

  function updateHome() {
    var work = document.getElementById('work');
    if (!work) return;
    var professional = work.querySelector('[data-work-group="professional"]');
    var list = professional && professional.querySelector('.work-list');
    if (!list) return;

    if (!work.querySelector('[data-project="forkwise-open-source-reviewer"]')) {
      list.appendChild(makeHomeEntry());
    }

    var groupCopy = professional.querySelector('.work-group-heading p:not(.mono-label)');
    if (groupCopy) groupCopy.textContent = 'Role-aligned systems for analytical readiness, governed context, model search, evidence, orchestration, bounded agency, and open-source adoption due diligence.';

    Array.prototype.forEach.call(work.querySelectorAll('.work-entry'), function (entry, index) {
      var number = entry.querySelector('.work-index');
      if (number) number.textContent = String(index + 1).padStart(2, '0');
    });
  }

  function updateHomeResumeCard() {
    document.querySelectorAll('.resume-home-card h3').forEach(function (heading) {
      if ((heading.textContent || '').indexOf('Eight systems') !== -1) {
        heading.textContent = 'Nine systems with explicit maturity labels';
      }
    });
  }

  function updateResumePage() {
    var grid = document.querySelector('.resume-project-grid');
    if (!grid) return;

    if (!grid.querySelector('a[href="projects/forkwise-open-source-reviewer.html"]')) {
      var link = document.createElement('a');
      link.className = 'resume-project reveal in';
      link.href = 'projects/forkwise-open-source-reviewer.html';
      link.innerHTML = '<span>Community preview</span><h3>ForkWise — Open Source Reviewer</h3>' +
        '<p>Commit-pinned repository evidence, README claim checking, adoption decisions, safe static analysis, runner contracts, and open-source community governance.</p>';
      grid.appendChild(link);
    }

    var heading = document.querySelector('.resume-projects .section-heading h2');
    if (heading) heading.textContent = 'Nine systems used as technical evidence';
  }

  function updatePresentation() {
    var presentation = document.querySelector('[data-presentation]');
    if (!presentation) return;

    document.querySelectorAll('.slide-tags span').forEach(function (tag) {
      if ((tag.textContent || '').trim() === 'Eight portfolio systems') tag.textContent = 'Nine portfolio systems';
    });

    var slide = presentation.querySelector('[data-title="Independent portfolio"]');
    if (slide) {
      var heading = slide.querySelector('.slide-heading h2');
      if (heading) heading.textContent = 'Nine independent systems used as technical evidence';
      var grid = slide.querySelector('.project-chip-grid');
      if (grid && !grid.querySelector('a[href="projects/forkwise-open-source-reviewer.html"]')) {
        var link = document.createElement('a');
        link.href = 'projects/forkwise-open-source-reviewer.html';
        link.innerHTML = '<strong>ForkWise</strong><span>Open-source adoption due diligence</span>';
        grid.appendChild(link);
      }
    }

    var description = document.querySelector('meta[name="description"]');
    if (description) description.setAttribute('content', description.getAttribute('content').replace('eight evidence-backed systems', 'nine evidence-backed systems'));
    var openGraph = document.querySelector('meta[property="og:description"]');
    if (openGraph) openGraph.setAttribute('content', openGraph.getAttribute('content').replace('eight evidence-backed systems', 'nine evidence-backed systems'));
  }

  function fixReviewStamp() {
    if (api.slug() !== slug) return;
    var stamp = document.querySelector('.case-review-stamp');
    if (stamp) {
      stamp.textContent = 'Content and source snapshot reviewed August 31, 2026 · Project metrics and maturity claims apply to this case study, not the profile as a whole.';
    }
  }

  var originalUpdateHomeInventory = api.updateHomeInventory;
  api.updateHomeInventory = function () {
    if (typeof originalUpdateHomeInventory === 'function') originalUpdateHomeInventory();
    updateHome();
  };

  api.ready(function () {
    updateHomeResumeCard();
    updateResumePage();
    updatePresentation();
    fixReviewStamp();
    window.setTimeout(fixReviewStamp, 100);
    window.setTimeout(fixReviewStamp, 500);
  });
  window.addEventListener('load', fixReviewStamp, { once: true });
})();
