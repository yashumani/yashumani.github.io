(function () {
  'use strict';

  function visibleSteps(section) {
    return Array.prototype.slice.call(section.querySelectorAll('.flow-lane:not([hidden]) .flow-step'));
  }

  function init(section) {
    if (!section || section.getAttribute('data-flow-ready') === 'true') return;
    section.setAttribute('data-flow-ready', 'true');

    var toolbar = section.querySelector('.flow-toolbar');
    var play = section.querySelector('.flow-play-toggle');
    var stages = Array.prototype.slice.call(section.querySelectorAll('.architecture-stage'));
    var timer = null;
    var index = -1;
    var reduced = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    function stop() {
      if (timer) window.clearInterval(timer);
      timer = null;
      section.classList.remove('is-running');
    }

    function advance() {
      var steps = visibleSteps(section);
      if (!steps.length) return;
      steps.forEach(function (step) { step.classList.remove('is-current'); });
      stages.forEach(function (stage) { stage.classList.remove('is-current'); });
      index = (index + 1) % steps.length;
      steps[index].classList.add('is-current');
      if (stages.length) stages[index % stages.length].classList.add('is-current');
    }

    function start() {
      stop();
      advance();
      if (reduced) return;
      section.classList.add('is-running');
      timer = window.setInterval(advance, 1350);
    }

    if (toolbar) {
      toolbar.querySelectorAll('.flow-filter').forEach(function (button) {
        button.addEventListener('click', function () {
          var filter = button.getAttribute('data-flow-filter') || 'all';
          toolbar.querySelectorAll('.flow-filter').forEach(function (candidate) {
            candidate.setAttribute('aria-pressed', candidate === button ? 'true' : 'false');
          });
          section.querySelectorAll('.flow-lane').forEach(function (lane) {
            lane.hidden = filter !== 'all' && lane.getAttribute('data-flow-kind') !== filter;
          });
          index = -1;
          if (!play || play.getAttribute('aria-pressed') === 'false') start();
        });
      });
    }

    if (play) {
      play.addEventListener('click', function () {
        var paused = play.getAttribute('aria-pressed') === 'true';
        if (paused) {
          play.setAttribute('aria-pressed', 'false');
          play.textContent = 'Pause animation';
          start();
        } else {
          play.setAttribute('aria-pressed', 'true');
          play.textContent = 'Play animation';
          stop();
        }
      });
    }

    if ('IntersectionObserver' in window) {
      var observer = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting && (!play || play.getAttribute('aria-pressed') === 'false')) start();
          else if (!entry.isIntersecting) stop();
        });
      }, { threshold: 0.12 });
      observer.observe(section);
    } else {
      start();
    }
  }

  function boot() {
    init(document.getElementById('flow-forkwise'));
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot, { once: true });
  else boot();
})();
