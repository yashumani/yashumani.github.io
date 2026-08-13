(function () {
  'use strict';

  var root = document.documentElement;
  var header = document.querySelector('.site-header');
  var progressBar = document.querySelector('.scroll-progress span');
  var mainScriptUrl = document.currentScript && document.currentScript.src;
  var prefersReducedMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function normalizeLegacyPageShell() {
    var main = document.querySelector('main');
    if (main && !main.id) main.id = 'main-content';
    if (main && !document.querySelector('.skip-link')) {
      var skip = document.createElement('a');
      skip.className = 'skip-link';
      skip.href = '#main-content';
      skip.textContent = 'Skip to content';
      document.body.insertBefore(skip, document.body.firstChild);
    }

    document.querySelectorAll('.site-nav a').forEach(function (link) {
      var href = link.getAttribute('href') || '';
      if (href.indexOf('#systems') !== -1) link.setAttribute('href', href.replace('#systems', '#work'));
      if (href.indexOf('#impact') !== -1) link.setAttribute('href', href.replace('#impact', '#capabilities'));
      if ((link.textContent || '').trim() === 'Blogs') link.textContent = 'Writing';
    });

    var back = document.querySelector('.back-link');
    if (back) {
      var backHref = back.getAttribute('href') || '';
      if (backHref.indexOf('#systems') !== -1) back.setAttribute('href', backHref.replace('#systems', '#work'));
      if ((back.textContent || '').indexOf('All systems') !== -1) back.lastChild.textContent = ' Featured work';
    }
  }

  normalizeLegacyPageShell();

  var toggle = document.querySelector('.theme-toggle');
  function currentTheme() { return root.getAttribute('data-theme') || 'light'; }
  function syncThemeLabel() {
    if (!toggle) return;
    toggle.setAttribute('aria-label', currentTheme() === 'dark' ? 'Use light mode' : 'Use dark mode');
  }
  syncThemeLabel();
  if (toggle) toggle.addEventListener('click', function () {
    var next = currentTheme() === 'dark' ? 'light' : 'dark';
    root.setAttribute('data-theme', next);
    localStorage.setItem('theme', next);
    syncThemeLabel();
  });

  var frameRequested = false;
  function updateScrollState() {
    if (header) header.classList.toggle('scrolled', window.scrollY > 4);
    if (progressBar) {
      var scrollable = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
      progressBar.style.transform = 'scaleX(' + Math.min(1, Math.max(0, window.scrollY / scrollable)).toFixed(4) + ')';
    }
    frameRequested = false;
  }
  updateScrollState();
  window.addEventListener('scroll', function () {
    if (frameRequested) return;
    window.requestAnimationFrame(updateScrollState);
    frameRequested = true;
  }, { passive: true });

  var legacyRoutes = { evidence: 'work', impact: 'capabilities', roadmap: 'about', systems: 'work' };
  function resolveLegacyHash() {
    var targetId = legacyRoutes[window.location.hash.slice(1)];
    if (!targetId) return;
    var target = document.getElementById(targetId);
    if (!target) return;
    var previous = root.style.scrollBehavior;
    root.style.scrollBehavior = 'auto';
    target.scrollIntoView({ block: 'start' });
    root.style.scrollBehavior = previous;
  }
  resolveLegacyHash();
  window.addEventListener('load', resolveLegacyHash, { once: true });
  window.addEventListener('hashchange', resolveLegacyHash);

  document.querySelectorAll('[data-current-year]').forEach(function (node) {
    node.textContent = String(new Date().getFullYear());
  });

  function slugify(value) {
    return value.toLowerCase().replace(/&/g, ' and ').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '').slice(0, 72) || 'section';
  }

  function initCaseStudyStructure() {
    var main = document.querySelector('main.case-study-wrap');
    if (!main) return;
    var headings = Array.prototype.slice.call(main.children).filter(function (node) { return node.tagName === 'H2'; });
    if (!headings.length) return;
    var used = {};

    headings.forEach(function (heading, index) {
      var number = heading.querySelector('.paper-section-number, .case-section-number');
      var numberText = number ? (number.textContent || '').trim() : String(index + 1).padStart(2, '0');
      var title = (heading.textContent || '').replace(number ? (number.textContent || '') : '', '').trim();
      heading.textContent = '';
      heading.classList.add('case-section-heading');

      var numberNode = document.createElement('span');
      numberNode.className = 'case-section-number';
      numberNode.setAttribute('aria-hidden', 'true');
      numberNode.textContent = numberText;
      var titleNode = document.createElement('span');
      titleNode.className = 'case-section-title';
      titleNode.textContent = title;
      heading.appendChild(numberNode);
      heading.appendChild(titleNode);

      var base = heading.id || slugify(title);
      var id = base;
      var suffix = 2;
      while (used[id] || (document.getElementById(id) && document.getElementById(id) !== heading)) id = base + '-' + suffix++;
      used[id] = true;
      heading.id = id;
    });

    if (headings.length >= 3 && !main.querySelector('.case-toc')) {
      var nav = document.createElement('nav');
      nav.className = 'case-toc';
      nav.setAttribute('aria-label', 'On this page');
      var label = document.createElement('span');
      label.textContent = 'On this page';
      nav.appendChild(label);
      var list = document.createElement('ol');
      headings.forEach(function (heading) {
        var item = document.createElement('li');
        var link = document.createElement('a');
        link.href = '#' + heading.id;
        var number = document.createElement('span');
        number.textContent = heading.querySelector('.case-section-number').textContent;
        var title = document.createElement('span');
        title.textContent = heading.querySelector('.case-section-title').textContent;
        link.appendChild(number);
        link.appendChild(title);
        item.appendChild(link);
        list.appendChild(item);
      });
      nav.appendChild(list);
      headings[0].parentNode.insertBefore(nav, headings[0]);
    }

    if (window.location.pathname.indexOf('/projects/') !== -1 && !main.querySelector('.case-review-stamp')) {
      var stamp = document.createElement('p');
      stamp.className = 'case-review-stamp';
      stamp.textContent = 'Content snapshot reviewed August 12, 2026 · Project metrics and maturity claims apply to this case study, not the profile as a whole.';
      var anchor = main.querySelector('.case-hero-meta, .stats-line, .case-metrics');
      if (anchor && anchor.parentNode) anchor.parentNode.insertBefore(stamp, anchor.nextSibling);
    }
  }

  initCaseStudyStructure();

  function loadPaperContentSync() {
    var slugs = {
      'ai-powered-vs-ai-generated.html': true,
      'neurodivergent-ai-architect.html': true
    };
    var slug = window.location.pathname.split('/').pop() || '';
    if (!slugs[slug]) return;
    var assetRoot = mainScriptUrl ? mainScriptUrl.replace(/js\/(?:main|main-core)\.js(?:\?.*)?$/, '') : '../';
    var script = document.createElement('script');
    script.src = assetRoot + 'js/paper-content-sync.js';
    script.async = true;
    script.setAttribute('data-paper-content-sync', 'true');
    document.body.appendChild(script);
  }

  loadPaperContentSync();

  function initReveals() {
    var reveals = Array.prototype.slice.call(document.querySelectorAll('.reveal'));
    if (!reveals.length || prefersReducedMotion || !('IntersectionObserver' in window)) {
      reveals.forEach(function (node) { node.classList.add('in'); });
      return;
    }
    reveals.forEach(function (node, index) {
      if (node.getBoundingClientRect().top < window.innerHeight * 0.94) node.classList.add('in');
      else {
        node.classList.add('reveal-pending');
        node.style.setProperty('--reveal-delay', String((index % 4) * 55) + 'ms');
      }
    });
    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        entry.target.classList.remove('reveal-pending');
        entry.target.classList.add('in');
        observer.unobserve(entry.target);
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -8% 0px' });
    reveals.forEach(function (node) { if (node.classList.contains('reveal-pending')) observer.observe(node); });
  }
  initReveals();

  function initSectionNavigation() {
    if (!('IntersectionObserver' in window)) return;
    var links = Array.prototype.slice.call(document.querySelectorAll('.site-nav a[href^="#"]'));
    var sections = links.map(function (link) { return document.querySelector(link.getAttribute('href')); }).filter(Boolean);
    if (!sections.length) return;
    var observer = new IntersectionObserver(function (entries) {
      var visible = entries.filter(function (entry) { return entry.isIntersecting; }).sort(function (a, b) { return b.intersectionRatio - a.intersectionRatio; });
      if (!visible.length) return;
      var id = visible[0].target.id;
      links.forEach(function (link) {
        var active = link.getAttribute('href') === '#' + id;
        link.classList.toggle('is-active', active);
        if (active) link.setAttribute('aria-current', 'location');
        else link.removeAttribute('aria-current');
      });
    }, { threshold: [0.18, 0.35, 0.6], rootMargin: '-20% 0px -55% 0px' });
    sections.forEach(function (section) { observer.observe(section); });
  }
  initSectionNavigation();

  function loadProjectFlowDiagrams() {
    var slugs = {
      'mangrok-recipe-vault.html': true,
      'where-it-happened.html': true,
      'my-seventh-meal.html': true,
      'mlops-solution-accelerator.html': true,
      'agentic-knowledge-runtime.html': true
    };
    var slug = window.location.pathname.split('/').pop() || '';
    if (!slugs[slug]) return;
    var assetRoot = mainScriptUrl ? mainScriptUrl.replace(/js\/(?:main|main-core)\.js(?:\?.*)?$/, '') : '../';
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
      script.addEventListener('load', function () {
        var sync = document.createElement('script');
        sync.src = assetRoot + 'js/flow-content-sync.js';
        sync.async = true;
        sync.setAttribute('data-project-flow-sync', 'true');
        document.body.appendChild(sync);
      });
      document.body.appendChild(script);
    }
  }

  loadProjectFlowDiagrams();
})();

