(function () {
  'use strict';

  var reduced = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var INTERVAL = 3200;

  function stagesFor(figure, groups) {
    var max = 0;
    var captions = {};
    groups.forEach(function (group) {
      var step = Number(group.getAttribute('data-step'));
      if (step > max) max = step;
      var caption = group.getAttribute('data-stage');
      if (caption && !captions[step]) captions[step] = caption;
    });
    var stages = [];
    for (var i = 1; i <= max; i += 1) stages.push(captions[i] || '');
    return stages;
  }

  function controlsFor(figure, count) {
    var controls = figure.querySelector('.mechanism-controls');
    if (!controls) {
      controls = document.createElement('div');
      controls.className = 'mechanism-controls';
      controls.innerHTML =
        '<button type="button" data-mechanism="prev">Back</button>' +
        '<button type="button" data-mechanism="play">Play</button>' +
        '<button type="button" data-mechanism="next">Next</button>' +
        '<p class="mechanism-stage" role="status" aria-live="polite"></p>';
      var caption = figure.querySelector('figcaption');
      figure.insertBefore(controls, caption || null);
    }
    controls.hidden = false;
    if (!controls.querySelector('.mechanism-progress')) {
      var progress = document.createElement('div');
      progress.className = 'mechanism-progress';
      progress.setAttribute('aria-hidden', 'true');
      for (var i = 0; i < count; i += 1) progress.appendChild(document.createElement('span'));
      controls.appendChild(progress);
    }
    return controls;
  }

  function init(figure) {
    if (figure.getAttribute('data-mechanism-ready')) return;
    var groups = Array.prototype.slice.call(figure.querySelectorAll('[data-step]'));
    if (!groups.length) return;
    figure.setAttribute('data-mechanism-ready', 'true');
    var stages = stagesFor(figure, groups);
    var count = stages.length;
    var controls = controlsFor(figure, count);
    var status = controls.querySelector('.mechanism-stage');
    var playButton = controls.querySelector('[data-mechanism="play"]');
    var bars = Array.prototype.slice.call(controls.querySelectorAll('.mechanism-progress span'));
    var index = 0;
    var timer = null;
    var visible = false;
    var userPaused = false;

    function paint() {
      var step = index + 1;
      groups.forEach(function (group) {
        group.classList.toggle('is-current', Number(group.getAttribute('data-step')) === step);
      });
      bars.forEach(function (bar, i) {
        bar.classList.toggle('is-current', i === index);
        bar.classList.toggle('is-done', i < index);
      });
      if (status) status.textContent = step + '/' + count + (stages[index] ? ' · ' + stages[index] : '');
    }

    function show(next) {
      figure.classList.add('is-animated');
      index = (next + count) % count;
      paint();
    }

    function stop() {
      if (timer) window.clearInterval(timer);
      timer = null;
      if (playButton) {
        playButton.textContent = 'Play';
        playButton.setAttribute('aria-pressed', 'false');
      }
    }

    function start() {
      stop();
      figure.classList.add('is-animated');
      paint();
      timer = window.setInterval(function () { show(index + 1); }, INTERVAL);
      if (playButton) {
        playButton.textContent = 'Pause';
        playButton.setAttribute('aria-pressed', 'true');
      }
    }

    controls.addEventListener('click', function (event) {
      var target = event.target.closest ? event.target.closest('[data-mechanism]') : null;
      if (!target) return;
      var action = target.getAttribute('data-mechanism');
      if (action === 'play') {
        if (timer) { userPaused = true; stop(); }
        else { userPaused = false; start(); }
        return;
      }
      userPaused = true;
      stop();
      show(action === 'next' ? index + 1 : index - 1);
    });

    if (status) status.textContent = count + ' stages · press Play or Next to step through';
    stop();

    if (reduced) return;

    if ('IntersectionObserver' in window) {
      new window.IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          visible = entry.isIntersecting;
          if (visible && !userPaused) start();
          else stop();
        });
      }, { threshold: 0.25 }).observe(figure);
    } else {
      start();
    }

    document.addEventListener('visibilitychange', function () {
      if (document.hidden) stop();
      else if (visible && !userPaused) start();
    });
  }

  window.MechanismDiagram = { init: init };

  function boot() {
    Array.prototype.forEach.call(document.querySelectorAll('.mechanism-figure'), init);
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot);
  else boot();
})();
