(function () {
  'use strict';

  if (!/prefrontal-context-layer\.html$/.test(window.location.pathname)) return;

  var figure = document.querySelector('.mechanism-figure');
  if (!figure) return;

  var STAGES = [
    'An asset arrives: a table, a report, or a question nobody can answer yet.',
    'The agent reads what already exists — catalog, query logs, dbt manifest, BI.',
    'It spawns one builder per domain. The domain is the unit that has owners.',
    'Each builder drafts the five layers, references pointing downward only.',
    'Everything it writes is a draft, untrusted. Nothing is servable yet.',
    'The existing pipeline checks it, and the owners certify. No agent here.',
    'A release is cut: immutable, hashed, scoped to a channel.',
    'A query arrives and is routed by namespace to one agent per domain.',
    'Seven gates produce one verdict the caller follows.',
    'Ratings and refusals become classified work. The agent proposes; owners certify.'
  ];

  var groups = Array.prototype.slice.call(figure.querySelectorAll('[data-step]'));
  var status = figure.querySelector('.mechanism-stage');
  var playButton = figure.querySelector('[data-mechanism="play"]');
  var reduced = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var index = 0;
  var timer = null;

  function paint() {
    var step = index + 1;
    groups.forEach(function (group) {
      group.classList.toggle('is-current', Number(group.getAttribute('data-step')) === step);
    });
    if (status) status.textContent = step + '/' + STAGES.length + ' · ' + STAGES[index];
  }

  function show(next) {
    index = (next + STAGES.length) % STAGES.length;
    paint();
  }

  function stop() {
    if (timer) window.clearInterval(timer);
    timer = null;
    if (playButton) playButton.textContent = 'Play';
  }

  function start() {
    stop();
    timer = window.setInterval(function () { show(index + 1); }, 3200);
    if (playButton) playButton.textContent = 'Pause';
  }

  figure.addEventListener('click', function (event) {
    var action = event.target && event.target.getAttribute && event.target.getAttribute('data-mechanism');
    if (!action) return;
    if (action === 'play') {
      if (timer) stop();
      else start();
      return;
    }
    stop();
    show(action === 'next' ? index + 1 : index - 1);
  });

  paint();

  if (reduced) {
    if (playButton) playButton.textContent = 'Play';
    return;
  }

  var observer = 'IntersectionObserver' in window
    ? new window.IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) start();
          else stop();
        });
      }, { threshold: 0.25 })
    : null;

  if (observer) observer.observe(figure);
  else start();
})();
