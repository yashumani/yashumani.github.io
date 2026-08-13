(function () {
  'use strict';
  var stored = localStorage.getItem('theme');
  var preferred = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  document.documentElement.setAttribute('data-theme', stored || preferred);
})();
