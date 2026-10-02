(function () {
  'use strict';

  var stored = localStorage.getItem('theme');
  var preferred = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  document.documentElement.setAttribute('data-theme', stored || preferred);

  function makeLink(label, href) {
    var link = document.createElement('a');
    link.textContent = label;
    link.href = href;
    return link;
  }

  function addShell() {
    if (document.querySelector('.site-header, .presentation-header')) return;

    var script = document.querySelector('script[src$="js/theme-init.js"]');
    var src = script ? script.src : '';
    var root = src ? src.replace(/js\/theme-init\.js(?:\?.*)?$/, '') : '/';

    var header = document.createElement('header');
    header.className = 'site-header';

    var shell = document.createElement('div');
    shell.className = 'wrap nav-shell';

    var brand = document.createElement('a');
    brand.className = 'brand';
    brand.href = root + 'index.html';
    brand.innerHTML = '<span class="brand-mark" aria-hidden="true">YS</span><span>Yashu Sharma</span>';
    shell.appendChild(brand);

    var nav = document.createElement('nav');
    nav.className = 'site-nav';
    nav.setAttribute('aria-label', 'Primary navigation');
    nav.appendChild(makeLink('Work', root + 'index.html#work'));
    nav.appendChild(makeLink('Capabilities', root + 'index.html#capabilities'));
    nav.appendChild(makeLink('Writing', root + 'blogs/'));
    nav.appendChild(makeLink('About', root + 'index.html#about'));
    nav.appendChild(makeLink('Contact', root + 'index.html#contact'));

    var toggle = document.createElement('button');
    toggle.className = 'theme-toggle';
    toggle.type = 'button';
    toggle.innerHTML =
      '<svg class="icon-sun" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/></svg>' +
      '<svg class="icon-moon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M21 12.8A9 9 0 1 1 11.2 3 7 7 0 0 0 21 12.8z"/></svg>';
    toggle.setAttribute('aria-label', document.documentElement.getAttribute('data-theme') === 'dark' ? 'Use light mode' : 'Use dark mode');
    nav.appendChild(toggle);

    shell.appendChild(nav);
    header.appendChild(shell);
    document.body.insertBefore(header, document.body.firstChild);
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', addShell);
  else addShell();
})();
