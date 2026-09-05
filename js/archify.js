(function () {
  'use strict';
  var host = document.querySelector('[data-archify-project]');
  var search = document.querySelector('[data-atlas-search]');
  if (search) search.addEventListener('input', function () {
    var term = search.value.toLowerCase().trim(), count = 0;
    document.querySelectorAll('[data-atlas-card]').forEach(function (card) {
      card.hidden = card.textContent.toLowerCase().indexOf(term) < 0;
      if (!card.hidden) count++;
    });
    document.querySelector('[data-atlas-count]').textContent = count + ' of 9 systems';
  });
  if (!host) return;
  document.body.classList.add('archify-ready');
  var id = host.getAttribute('data-archify-project');
  var tabs = Array.prototype.slice.call(host.querySelectorAll('[data-archify-view]'));
  var panel = host.querySelector('[role="tabpanel"]');
  var preview = host.querySelector('[data-archify-preview]');
  var load = host.querySelector('[data-archify-load]');
  var current = 'architecture', frame = null;
  function theme() { return document.documentElement.getAttribute('data-theme') === 'dark' ? 'dark' : 'light'; }
  function address() { return '../architecture/maps/' + id + '-' + current + '.html'; }
  function loadPreview() {
    if (!frame) {
      frame = document.createElement('iframe');
      frame.loading = 'lazy';
      frame.referrerPolicy = 'no-referrer';
      frame.setAttribute('title', 'Archify ' + current + ' diagram preview');
      preview.appendChild(frame);
    }
    frame.title = 'Archify ' + current + ' diagram preview';
    frame.src = address() + '?embed=1&theme=' + theme();
    load.hidden = true;
    preview.classList.add('is-loaded');
  }
  function select(button, focus) {
    current = button.getAttribute('data-archify-view');
    tabs.forEach(function (tab) {
      var selected = tab === button;
      tab.setAttribute('aria-selected', String(selected));
      tab.tabIndex = selected ? 0 : -1;
    });
    panel.setAttribute('aria-labelledby', button.id);
    host.querySelector('[data-archify-open]').href = address();
    host.querySelector('[data-archify-source]').href = '../architecture/specs/' + id + '-' + current + '.json';
    host.querySelectorAll('.archify-text').forEach(function (detail, i) {
      detail.open = window.innerWidth < 760 && i === tabs.indexOf(button);
    });
    if (frame) loadPreview();
    if (focus) button.focus();
  }
  tabs.forEach(function (button, index) {
    button.addEventListener('click', function () { select(button, false); });
    button.addEventListener('keydown', function (event) {
      var next;
      if (event.key === 'ArrowRight') next = (index + 1) % tabs.length;
      else if (event.key === 'ArrowLeft') next = (index + tabs.length - 1) % tabs.length;
      else if (event.key === 'Home') next = 0;
      else if (event.key === 'End') next = tabs.length - 1;
      else return;
      event.preventDefault(); select(tabs[next], true);
    });
  });
  load.addEventListener('click', loadPreview);
  select(tabs[0], false);
  if (window.innerWidth >= 760 && 'IntersectionObserver' in window) {
    var observer = new IntersectionObserver(function (entries) {
      if (entries.some(function (e) { return e.isIntersecting; })) { loadPreview(); observer.disconnect(); }
    }, { rootMargin: '120px' });
    observer.observe(host);
  }
  new MutationObserver(function () {
    if (frame && frame.contentDocument && frame.contentDocument.documentElement) {
      frame.contentDocument.documentElement.setAttribute('data-theme', theme());
    }
  }).observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });
})();
