(function () {
  'use strict';

  var sourceUrl = 'https://ai-enterprise-journey-2026.yashumani.chatgpt.site';

  function createHighlights() {
    var section = document.createElement('section');
    section.className = 'wrap profile-highlights reveal in';
    section.id = 'profile-highlights';
    section.setAttribute('aria-labelledby', 'profile-highlights-title');
    section.innerHTML =
      '<div class="profile-highlights-head">' +
        '<div><p class="mono-label">Profile highlights</p><h2 id="profile-highlights-title" class="sr-only">Profile highlights</h2></div>' +
        '<p>Two ways to see how I work: a live analytics system and a field report that turns captured evidence into research and practical BI decisions.</p>' +
      '</div>' +
      '<div class="profile-highlight-grid">' +
        '<article class="profile-highlight-card" data-profile-highlight="dq-check">' +
          '<div class="profile-highlight-meta"><strong>01 / Technical proof</strong><span>Decision intelligence</span></div>' +
          '<h2>DQ Check Platform</h2>' +
          '<p>Start with the case study that connects data quality, analytical readiness, variance investigation, shared interaction state, and explicit evidence boundaries.</p>' +
          '<div class="profile-highlight-actions">' +
            '<a class="profile-highlight-link profile-highlight-link--primary" href="projects/dq-check-platform.html">Open case study</a>' +
            '<a class="profile-highlight-link" href="https://yashumani.github.io/drill-down-anamoly/" target="_blank" rel="noopener">Open live prototype</a>' +
          '</div>' +
        '</article>' +
        '<article class="profile-highlight-card profile-highlight-card--journey" data-profile-highlight="ai-enterprise-journey">' +
          '<div class="profile-highlight-meta"><strong>02 / Conference learning</strong><span>Enterprise AI · New York City · 2026</span></div>' +
          '<h2>AI Enterprise Conference — Field Report</h2>' +
          '<p>I turned a busy conference day—sessions, booth conversations, photographs, and handwritten notes—into a structured field report. I then researched the questions I brought home and the missed “How AI Pays for AI” session, connecting the learning to governed BI and analytics.</p>' +
          '<ul class="profile-highlight-evidence" aria-label="Conference field report contents">' +
            '<li><strong>20</strong><span>Visual reconstructions</span></li>' +
            '<li><strong>4</strong><span>Field-note pages</span></li>' +
            '<li><strong>10</strong><span>Questions researched</span></li>' +
          '</ul>' +
          '<div class="profile-highlight-actions">' +
            '<a class="profile-highlight-link profile-highlight-link--primary" href="' + sourceUrl + '" target="_blank" rel="noopener">Open field report</a>' +
            '<a class="profile-highlight-link" href="' + sourceUrl + '#learning" target="_blank" rel="noopener">Read key learnings</a>' +
            '<a class="profile-highlight-link" href="' + sourceUrl + '#evidence" target="_blank" rel="noopener">Explore notes &amp; diagrams</a>' +
            '<p class="profile-highlight-boundary">Independent learning project; visuals are original reconstructions based on my notes and conference photographs—not official conference materials or employer work.</p>' +
          '</div>' +
        '</article>' +
      '</div>' +
      '<figure class="profile-highlight-moment">' +
        '<a class="profile-highlight-moment__link" href="' + sourceUrl + '" target="_blank" rel="noopener" aria-label="Open the AI Enterprise Conference field report">' +
          '<img src="assets/images/ai-enterprise-conference-panel.webp" alt="Panel discussion onstage at The AI Enterprise Conference in New York City, with enterprise AI themes displayed behind the speakers." width="1280" height="720" loading="lazy" decoding="async">' +
        '</a>' +
        '<figcaption>' +
          '<span>Conference field note</span>' +
          '<p>Panel session at The AI Enterprise Conference, New York City—photographed during my attendance. The field report uses original diagram reconstructions for clarity.</p>' +
        '</figcaption>' +
      '</figure>';
    return section;
  }

  function init() {
    if (window.location.pathname !== '/' && !/\/index\.html$/.test(window.location.pathname)) return;
    if (document.getElementById('profile-highlights')) return;
    var hero = document.querySelector('.profile-page .hero');
    var proof = hero && hero.querySelector('.career-proof');
    if (!hero || !proof) return;
    proof.insertAdjacentElement('afterend', createHighlights());
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init, { once: true });
  } else {
    init();
  }
})();
