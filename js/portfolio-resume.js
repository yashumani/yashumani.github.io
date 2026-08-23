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
      var writing = Array.prototype.find.call(nav.querySelectorAll('a'), function (candidate) {
        return (candidate.textContent || '').trim() === 'Writing';
      });
      nav.insertBefore(link, writing || nav.querySelector('.theme-toggle'));
    });
  }

  function createResumeSection() {
    var section = document.createElement('section');
    section.className = 'section section-resume';
    section.id = 'resume';
    section.innerHTML = '<div class="wrap">' +
      '<div class="section-heading reveal"><div><p class="section-index">03 / Resume</p>' +
      '<h2>Career history, current positioning, and independent technical evidence.</h2></div>' +
      '<p>The resume page separates employment history from portfolio work and labels the source boundary for each claim.</p></div>' +
      '<div class="resume-home-grid">' +
      '<article class="resume-home-card reveal"><p class="mono-label">Current title</p><h3>Senior Manager · Business Intelligence · Data Analytics</h3>' +
      '<p>Title supplied directly by the profile owner. Employer-specific current-role details remain unpublished until the current resume is reconciled.</p></article>' +
      '<article class="resume-home-card reveal"><p class="mono-label">Career source</p><h3>Resume history through March 2023</h3>' +
      '<p>Technical support, education, internships, and the Business Data Analyst I record are drawn from the available resume snapshot.</p></article>' +
      '<article class="resume-home-card reveal"><p class="mono-label">Technical evidence</p><h3>Eight independent systems</h3>' +
      '<p>Case studies demonstrate data quality, governed context, MLOps, agent harnesses, privacy, product state, and deterministic AI boundaries.</p></article>' +
      '</div>' +
      '<div class="section-action reveal"><a class="button button-primary" href="resume.html">View resume and professional direction</a>' +
      '<a class="button button-secondary" href="' + relativePresentationHref() + '">Open professional presentation</a></div>' +
      '</div>';
    return section;
  }

  function addHomeResumeSection() {
    if (window.location.pathname !== '/' && !/\/index\.html$/.test(window.location.pathname)) return;
    if (document.getElementById('resume')) return;
    var writing = document.getElementById('writing');
    if (!writing) return;
    writing.insertAdjacentElement('beforebegin', createResumeSection());

    var indexes = [
      ['#writing .section-index', '04 / Working papers'],
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
