(function () {
  'use strict';

  var root = document.documentElement;
  var toggle = document.querySelector('.theme-toggle');
  var header = document.querySelector('.site-header');
  var filterButtons = Array.prototype.slice.call(document.querySelectorAll('[data-filter]'));
  var projectCards = Array.prototype.slice.call(document.querySelectorAll('[data-category]'));

  function currentTheme() {
    return root.getAttribute('data-theme') || 'light';
  }

  function syncThemeLabel() {
    if (!toggle) return;
    toggle.setAttribute('aria-label', currentTheme() === 'dark' ? 'Use light mode' : 'Use dark mode');
  }

  syncThemeLabel();

  if (toggle) {
    toggle.addEventListener('click', function () {
      var next = currentTheme() === 'dark' ? 'light' : 'dark';
      root.setAttribute('data-theme', next);
      localStorage.setItem('theme', next);
      syncThemeLabel();
    });
  }

  if (header) {
    var ticking = false;
    var updateHeader = function () {
      header.classList.toggle('scrolled', window.scrollY > 4);
      ticking = false;
    };

    updateHeader();
    window.addEventListener('scroll', function () {
      if (ticking) return;
      window.requestAnimationFrame(updateHeader);
      ticking = true;
    }, { passive: true });
  }

  if (filterButtons.length && projectCards.length) {
    filterButtons.forEach(function (button) {
      button.addEventListener('click', function () {
        var filter = button.getAttribute('data-filter') || 'all';

        filterButtons.forEach(function (candidate) {
          var active = candidate === button;
          candidate.classList.toggle('active', active);
          candidate.setAttribute('aria-pressed', active ? 'true' : 'false');
        });

        projectCards.forEach(function (card) {
          var categories = (card.getAttribute('data-category') || '').split(/\s+/);
          card.hidden = filter !== 'all' && categories.indexOf(filter) === -1;
        });
      });
    });
  }

  var legacyRoutes = {
    evidence: 'work',
    impact: 'capabilities',
    roadmap: 'about'
  };

  function resolveLegacyHash() {
    var hash = window.location.hash.slice(1);
    var targetId = legacyRoutes[hash];
    if (!targetId || document.getElementById(hash)) return;

    var target = document.getElementById(targetId);
    if (target) target.scrollIntoView({ block: 'start' });
  }

  resolveLegacyHash();
  window.addEventListener('hashchange', resolveLegacyHash);

  var currentYear = String(new Date().getFullYear());
  document.querySelectorAll('[data-current-year]').forEach(function (node) {
    node.textContent = currentYear;
  });

  document.querySelectorAll('.reveal').forEach(function (node) {
    node.classList.add('in');
  });
})();
