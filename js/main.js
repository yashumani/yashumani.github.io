(function () {
  'use strict';
  var current = document.currentScript && document.currentScript.src;
  var root = current ? current.replace(/main\.js(?:\?.*)?$/, '') : '';
  function load(src, done) {
    var script = document.createElement('script');
    script.src = root + src;
    script.async = false;
    if (done) script.addEventListener('load', done, { once: true });
    document.body.appendChild(script);
  }
  load('main-core.js', function () {
    load('portfolio-sources.js', function () {
      load('portfolio-attribution-helpers.js', function () {
        load('portfolio-projects.js', function () { load('portfolio-papers-init.js'); });
      });
    });
  });
})();
