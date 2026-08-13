(function () {
  'use strict';

  var api = window.PORTFOLIO_FACTCHECK;
  if (!api) return;

  function moveProjectActions(main) {
    var original = main.querySelector('.case-links:not(.case-links-top)');
    if (!original) return;

    var external = Array.prototype.filter.call(original.querySelectorAll('a[href]'), function (link) {
      return /^https?:\/\//i.test(link.getAttribute('href') || '');
    });
    if (!external.length) return;

    var actionBar = document.createElement('nav');
    actionBar.className = 'case-links case-links-top';
    actionBar.setAttribute('aria-label', 'Project links');

    var label = document.createElement('span');
    label.className = 'case-links-label';
    label.textContent = 'Project links';
    actionBar.appendChild(label);
    external.forEach(function (link) { actionBar.appendChild(link); });

    var anchor = main.querySelector('.case-hero-meta, .stats-line, .case-metrics, .case-callout');
    if (anchor) anchor.insertAdjacentElement('afterend', actionBar);
    else {
      var lede = main.querySelector('.case-lede, h1 + p');
      if (lede) lede.insertAdjacentElement('afterend', actionBar);
      else main.insertBefore(actionBar, main.firstChild);
    }
    if (!original.querySelector('a[href]')) original.remove();
  }

  api.addProjectAttribution = function () {
    if (window.location.pathname.indexOf('/projects/') === -1) return;
    var main = document.querySelector('main.case-study-wrap');
    if (!main || main.getAttribute('data-attribution-ready') === 'true') return;

    var sources = (window.PORTFOLIO_PROJECT_SOURCES || {})[api.slug()] || [];
    moveProjectActions(main);
    if (sources.length && !main.querySelector('.source-attribution-section')) {
      var tail = Array.prototype.find.call(main.children, function (node) {
        return node.tagName === 'FOOTER' || node.tagName === 'SCRIPT';
      });
      main.insertBefore(api.buildSourceSection(sources), tail || null);
    }

    var stamp = main.querySelector('.case-review-stamp');
    if (stamp) {
      stamp.textContent = 'Content and source snapshot reviewed August 13, 2026 · Project metrics and maturity claims apply to this case study, not the profile as a whole.';
    }
    main.setAttribute('data-attribution-ready', 'true');
  };

  function makeDqEntry() {
    var article = document.createElement('article');
    article.className = 'work-entry reveal in';
    article.setAttribute('data-project', 'dq-check-platform');
    article.innerHTML = '<p class="work-index">04</p>' +
      '<div class="work-entry-main"><div class="work-entry-meta">' +
      '<span class="status-badge status-live">Live research prototype</span>' +
      '<span>Data quality · Variance investigation · Conversational analytics</span></div>' +
      '<h3><a href="projects/dq-check-platform.html">DQ Check Platform</a></h3>' +
      '<p>A browser-based investigation platform that profiles analysis readiness before ranking drivers, then recalculates the full investigation whenever the user narrows the cohort.</p></div>' +
      '<div class="work-entry-stack" aria-label="DQ Check Platform core skills">' +
      '<span>TypeScript</span><span>React</span><span>ECharts</span><span>GitHub Pages</span></div>' +
      '<a class="work-entry-action" href="projects/dq-check-platform.html" aria-label="Open DQ Check Platform case study">Case study <span aria-hidden="true">↗</span></a>';
    return article;
  }

  api.updateHomeInventory = function () {
    var work = document.getElementById('work');
    if (!work || work.querySelector('[data-project="dq-check-platform"]')) return;
    var groups = work.querySelectorAll('.work-group');
    if (groups.length < 2) return;

    var platformGroup = groups[1];
    var list = platformGroup.querySelector('.work-list');
    if (!list) return;
    list.insertBefore(makeDqEntry(), list.firstChild);

    var label = platformGroup.querySelector('.work-group-heading .mono-label');
    if (label) label.textContent = 'Data, AI, and ML platforms';
    var groupCopy = platformGroup.querySelector('.work-group-heading p:not(.mono-label)');
    if (groupCopy) groupCopy.textContent = 'Reusable systems for data quality, governed context, model search, evidence, orchestration, and controlled release.';

    Array.prototype.forEach.call(work.querySelectorAll('.work-entry'), function (entry, index) {
      var number = entry.querySelector('.work-index');
      if (number) number.textContent = String(index + 1).padStart(2, '0');
    });

    var heading = work.querySelector('.section-heading h2');
    if (heading) heading.textContent = 'Seven projects. Each one has a real problem and a current state.';
    Array.prototype.forEach.call(document.querySelectorAll('.profile-metrics article'), function (metric) {
      if ((metric.textContent || '').indexOf('showcased systems') !== -1) {
        var value = metric.querySelector('strong');
        if (value) value.textContent = '7';
      }
    });
    var description = document.querySelector('meta[property="og:description"]');
    if (description) description.setAttribute('content', 'Seven product and platform case studies, with architecture, working code, current-state boundaries, sources, and working papers.');
  };
})();
