(function () {
  'use strict';

  function isNestedPage() {
    return window.location.pathname.indexOf('/projects/') !== -1 || window.location.pathname.indexOf('/blogs/') !== -1;
  }

  function relativeResumeHref() {
    return isNestedPage() ? '../resume.html' : 'resume.html';
  }

  function relativePresentationHref() {
    return isNestedPage() ? '../professional-profile.html' : 'professional-profile.html';
  }

  function addResumeNavigation() {
    document.querySelectorAll('.site-nav').forEach(function (nav) {
      if (nav.querySelector('a[href$="resume.html"]')) return;
      var link = document.createElement('a');
      link.href = relativeResumeHref();
      link.textContent = 'Resume';

      var capabilities = Array.prototype.find.call(nav.querySelectorAll('a'), function (candidate) {
        var text = (candidate.textContent || '').trim();
        return text === 'Capabilities' || (candidate.getAttribute('href') || '').indexOf('#capabilities') !== -1;
      });
      nav.insertBefore(link, capabilities || nav.querySelector('.theme-toggle'));
    });
  }

  function createResumeSection() {
    var section = document.createElement('section');
    section.className = 'section section-resume';
    section.id = 'resume';
    section.innerHTML = '<div class="wrap">' +
      '<div class="section-heading reveal"><div><p class="section-index">02 / Professional profile</p>' +
      '<h2>Career history, current positioning, and technical evidence—kept in the right lanes.</h2></div>' +
      '<p>The public profile combines the available career record, the current title supplied by the profile owner, and independent systems. It does not invent current-employer, team-scope, or business-impact details.</p></div>' +
      '<div class="resume-home-grid">' +
      '<article class="resume-home-card reveal"><p class="mono-label">Current positioning</p><h3>Senior Manager · Business Intelligence · Data Analytics</h3>' +
      '<p>Focused on decision intelligence, analytics products, data quality, and accountable AI-enabled workflows.</p></article>' +
      '<article class="resume-home-card reveal"><p class="mono-label">Career foundation</p><h3>Analytics, BI, data workflows, and technical support</h3>' +
      '<p>The verified resume record covers SQL, dashboards, ETL, automation, user support, education, and earlier technical roles through March 2023.</p></article>' +
      '<article class="resume-home-card reveal"><p class="mono-label">Independent evidence</p><h3>Eight systems with explicit maturity labels</h3>' +
      '<p>Case studies show architecture, implementation, tests, source attribution, live boundaries, and unfinished work separately from employment history.</p></article>' +
      '</div>' +
      '<div class="section-action reveal"><a class="button button-primary" href="' + relativeResumeHref() + '">View resume and career evidence</a>' +
      '<a class="button button-secondary" href="' + relativePresentationHref() + '">Open professional presentation</a></div>' +
      '</div>';
    return section;
  }

  function addHomeResumeSection() {
    if (window.location.pathname !== '/' && !/\/index\.html$/.test(window.location.pathname)) return;
    if (document.getElementById('resume')) return;
    var work = document.getElementById('work');
    if (!work) return;
    work.insertAdjacentElement('afterend', createResumeSection());

    var indexes = [
      ['#capabilities .section-index', '03 / How I create value'],
      ['#writing .section-index', '04 / Field notes'],
      ['#about .section-index', '05 / About'],
      ['#contact .section-index', '06 / Contact']
    ];
    indexes.forEach(function (entry) {
      var node = document.querySelector(entry[0]);
      if (node) node.textContent = entry[1];
    });
  }

  function injectStyles() {
    if (document.querySelector('style[data-resume-home-styles]')) return;
    var style = document.createElement('style');
    style.setAttribute('data-resume-home-styles', 'true');
    style.textContent = '.resume-home-grid{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:16px}.resume-home-card{padding:24px;background:var(--surface);border:1px solid var(--line);border-radius:14px}.resume-home-card h3{margin:12px 0 10px;font-size:1.35rem}.resume-home-card p:last-child{margin:0;color:var(--text-muted)}.section-resume .section-action{display:flex;flex-wrap:wrap;gap:10px;margin-top:24px}@media(max-width:860px){.resume-home-grid{grid-template-columns:1fr}}';
    document.head.appendChild(style);
  }

  function init() {
    addResumeNavigation();
    injectStyles();
    addHomeResumeSection();
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init, { once: true });
  else init();
})();
