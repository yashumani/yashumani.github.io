(function () {
  var root = document.documentElement;
  var toggle = document.querySelector('.theme-toggle');
  var stored = localStorage.getItem('theme');

  if (stored) root.setAttribute('data-theme', stored);

  function currentTheme() {
    return root.getAttribute('data-theme') || 'light';
  }

  function syncToggleLabel() {
    if (!toggle) return;
    toggle.setAttribute(
      'aria-label',
      currentTheme() === 'dark' ? 'Use light mode' : 'Use dark mode'
    );
  }

  syncToggleLabel();

  if (toggle) {
    toggle.addEventListener('click', function () {
      var next = currentTheme() === 'dark' ? 'light' : 'dark';
      root.setAttribute('data-theme', next);
      localStorage.setItem('theme', next);
      syncToggleLabel();
    });
  }
})();

(function () {
  var header = document.querySelector('.site-header');
  if (!header) return;

  var ticking = false;

  function update() {
    header.classList.toggle('scrolled', window.scrollY > 4);
    ticking = false;
  }

  update();
  window.addEventListener('scroll', function () {
    if (ticking) return;
    requestAnimationFrame(update);
    ticking = true;
  }, { passive: true });
})();

/* Content is visible without JavaScript; this class remains for older markup. */
document.querySelectorAll('.reveal').forEach(function (element) {
  element.classList.add('in');
});
