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
    if (document.querySelector('.site-header')) return;

    var script = document.querySelector('script[src$="js/theme-init.js"]');
    var src = script ? script.src : '';
    var root = src ? src.replace(/js\/theme-init\.js(?:\?.*)?$/, '') : '/';

    var header = document.createElement('header');
    header.className = 'site-header';

    var shell = document.createElement('div');
    shell.className = 'wrap nav-shell';

    var brand = makeLink('Yashu Sharma', root + 'index.html');
    brand.className = 'brand';
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
    toggle.textContent = 'Theme';
    toggle.setAttribute('aria-label', document.documentElement.getAttribute('data-theme') === 'dark' ? 'Use light mode' : 'Use dark mode');
    nav.appendChild(toggle);

    shell.appendChild(nav);
    header.appendChild(shell);
    document.body.insertBefore(header, document.body.firstChild);
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', addShell);
  else addShell();
})();
