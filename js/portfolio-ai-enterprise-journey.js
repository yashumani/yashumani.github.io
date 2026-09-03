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
        '<p>Two fast entry points: one role-aligned technical case and one separately hosted interactive professional journey.</p>' +
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
          '<div class="profile-highlight-meta"><strong>02 / Interactive journey</strong><span>External profile experience</span></div>' +
          '<h2>AI Enterprise Journey 2026</h2>' +
          '<p>An owner-provided interactive profile experience that complements the resume, technical case studies, and professional presentation on this site. No additional employer or project claims are imported into the portfolio through this card.</p>' +
          '<div class="profile-highlight-actions">' +
            '<a class="profile-highlight-link profile-highlight-link--primary" href="' + sourceUrl + '" target="_blank" rel="noopener">Open interactive journey</a>' +
            '<a class="profile-highlight-link" href="professional-profile.html">Open portfolio presentation</a>' +
            '<p class="profile-highlight-boundary">External hosting and availability are managed separately from this portfolio.</p>' +
          '</div>' +
        '</article>' +
      '</div>';
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
