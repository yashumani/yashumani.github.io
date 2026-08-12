(function () {
  'use strict';

  var root = document.documentElement;
  var toggle = document.querySelector('.theme-toggle');
  var header = document.querySelector('.site-header');
  var progressBar = document.querySelector('.scroll-progress span');
  var mainScriptUrl = document.currentScript && document.currentScript.src;
  var prefersReducedMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

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

  var frameRequested = false;

  function updateScrollState() {
    if (header) header.classList.toggle('scrolled', window.scrollY > 4);

    if (progressBar) {
      var scrollable = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
      var progress = Math.min(1, Math.max(0, window.scrollY / scrollable));
      progressBar.style.transform = 'scaleX(' + progress.toFixed(4) + ')';
    }

    frameRequested = false;
  }

  updateScrollState();
  window.addEventListener('scroll', function () {
    if (frameRequested) return;
    window.requestAnimationFrame(updateScrollState);
    frameRequested = true;
  }, { passive: true });

  var legacyRoutes = {
    evidence: 'work',
    impact: 'capabilities',
    roadmap: 'about'
  };

  function resolveLegacyHash() {
    var hash = window.location.hash.slice(1);
    var targetId = legacyRoutes[hash];
    if (!targetId) return;

    var target = document.getElementById(targetId);
    if (!target) return;

    var previousScrollBehavior = root.style.scrollBehavior;
    root.style.scrollBehavior = 'auto';
    target.scrollIntoView({ block: 'start' });
    root.style.scrollBehavior = previousScrollBehavior;
  }

  resolveLegacyHash();
  window.addEventListener('load', resolveLegacyHash, { once: true });
  window.addEventListener('hashchange', resolveLegacyHash);

  document.querySelectorAll('[data-current-year]').forEach(function (node) {
    node.textContent = String(new Date().getFullYear());
  });

  function initReveals() {
    var reveals = Array.prototype.slice.call(document.querySelectorAll('.reveal'));
    if (!reveals.length || prefersReducedMotion || !('IntersectionObserver' in window)) {
      reveals.forEach(function (node) { node.classList.add('in'); });
      return;
    }

    reveals.forEach(function (node, index) {
      var rect = node.getBoundingClientRect();
      if (rect.top < window.innerHeight * 0.94) {
        node.classList.add('in');
        return;
      }
      node.classList.add('reveal-pending');
      node.style.setProperty('--reveal-delay', String((index % 4) * 55) + 'ms');
    });

    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        entry.target.classList.remove('reveal-pending');
        entry.target.classList.add('in');
        observer.unobserve(entry.target);
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -8% 0px' });

    reveals.forEach(function (node) {
      if (node.classList.contains('reveal-pending')) observer.observe(node);
    });
  }

  initReveals();

  function initSectionNavigation() {
    if (!('IntersectionObserver' in window)) return;

    var links = Array.prototype.slice.call(document.querySelectorAll('.site-nav a[href^="#"]'));
    if (!links.length) return;

    var sections = links.map(function (link) {
      return document.querySelector(link.getAttribute('href'));
    }).filter(Boolean);

    if (!sections.length) return;

    var sectionObserver = new IntersectionObserver(function (entries) {
      var visible = entries
        .filter(function (entry) { return entry.isIntersecting; })
        .sort(function (a, b) { return b.intersectionRatio - a.intersectionRatio; });

      if (!visible.length) return;
      var id = visible[0].target.id;
      links.forEach(function (link) {
        var active = link.getAttribute('href') === '#' + id;
        link.classList.toggle('is-active', active);
        if (active) link.setAttribute('aria-current', 'location');
        else link.removeAttribute('aria-current');
      });
    }, {
      threshold: [0.18, 0.35, 0.6],
      rootMargin: '-20% 0px -55% 0px'
    });

    sections.forEach(function (section) { sectionObserver.observe(section); });
  }

  initSectionNavigation();

  function loadProjectFlowDiagrams() {
    var projectSlugs = {
      'mangrok-recipe-vault.html': true,
      'where-it-happened.html': true,
      'my-seventh-meal.html': true,
      'mlops-solution-accelerator.html': true,
      'agentic-knowledge-runtime.html': true
    };
    var slug = window.location.pathname.split('/').pop() || '';
    if (!projectSlugs[slug]) return;

    var assetRoot = mainScriptUrl
      ? mainScriptUrl.replace(/js\/main\.js(?:\?.*)?$/, '')
      : (window.location.pathname.indexOf('/projects/') !== -1 ? '../' : '');

    if (!document.querySelector('link[data-project-flows]')) {
      var stylesheet = document.createElement('link');
      stylesheet.rel = 'stylesheet';
      stylesheet.href = assetRoot + 'css/flow-diagrams.css';
      stylesheet.setAttribute('data-project-flows', 'true');
      document.head.appendChild(stylesheet);
    }

    if (!document.querySelector('script[data-project-flows]')) {
      var script = document.createElement('script');
      script.src = assetRoot + 'js/flow-diagrams.js';
      script.async = true;
      script.setAttribute('data-project-flows', 'true');
      document.body.appendChild(script);
    }
  }

  loadProjectFlowDiagrams();
})();
