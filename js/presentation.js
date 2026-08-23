(function () {
  'use strict';

  var root = document.querySelector('[data-presentation]');
  if (!root) return;
  var slides = Array.prototype.slice.call(root.querySelectorAll('[data-slide]'));
  var previous = document.querySelector('[data-presentation-prev]');
  var next = document.querySelector('[data-presentation-next]');
  var status = document.querySelector('[data-presentation-status]');
  var fullscreen = document.querySelector('[data-presentation-fullscreen]');
  var current = 0;

  function hashIndex() {
    var match = window.location.hash.match(/^#slide-(\d+)$/);
    if (!match) return 0;
    return Math.max(0, Math.min(slides.length - 1, Number(match[1]) - 1));
  }

  function show(index, updateHash) {
    current = Math.max(0, Math.min(slides.length - 1, index));
    slides.forEach(function (slide, slideIndex) {
      var active = slideIndex === current;
      slide.hidden = !active;
      slide.setAttribute('aria-hidden', active ? 'false' : 'true');
    });
    if (status) status.textContent = 'Slide ' + (current + 1) + ' of ' + slides.length;
    if (previous) previous.disabled = current === 0;
    if (next) next.disabled = current === slides.length - 1;
    document.title = slides[current].getAttribute('data-title') + ' | Yashu Sharma';
    if (updateHash) history.replaceState(null, '', '#slide-' + (current + 1));
    slides[current].focus({ preventScroll: true });
  }

  slides.forEach(function (slide) { slide.tabIndex = -1; });
  if (previous) previous.addEventListener('click', function () { show(current - 1, true); });
  if (next) next.addEventListener('click', function () { show(current + 1, true); });
  if (fullscreen) fullscreen.addEventListener('click', function () {
    if (!document.fullscreenElement) document.documentElement.requestFullscreen?.();
    else document.exitFullscreen?.();
  });

  document.addEventListener('keydown', function (event) {
    if (event.key === 'ArrowRight' || event.key === 'PageDown' || event.key === ' ') {
      event.preventDefault();
      show(current + 1, true);
    } else if (event.key === 'ArrowLeft' || event.key === 'PageUp') {
      event.preventDefault();
      show(current - 1, true);
    } else if (event.key === 'Home') {
      event.preventDefault();
      show(0, true);
    } else if (event.key === 'End') {
      event.preventDefault();
      show(slides.length - 1, true);
    }
  });

  window.addEventListener('hashchange', function () { show(hashIndex(), false); });
  show(hashIndex(), false);
})();
