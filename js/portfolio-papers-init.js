(function () {
  'use strict';

  var api = window.PORTFOLIO_FACTCHECK;
  if (!api) return;

  function addPaperAttribution() {
    if (window.location.pathname.indexOf('/blogs/') === -1 || api.slug() === 'index.html') return;
    var main = document.querySelector('main.blog-article');
    if (!main || main.getAttribute('data-attribution-ready') === 'true') return;
    var references = main.querySelector('.paper-references');
    if (!references) return;

    var boundary = document.createElement('p');
    boundary.className = 'paper-source-boundary';
    boundary.textContent = 'Attribution boundary: External references establish published guidance, standards, product behavior, or prior art. The interpretations, examples, and proposed operating choices are the author’s unless a source is named directly.';
    references.parentNode.insertBefore(boundary, references);
    api.addReferences(references, (window.PORTFOLIO_PAPER_SOURCES || {})[api.slug()] || []);
    main.setAttribute('data-attribution-ready', 'true');
  }

  api.ready(function () {
    if (document.documentElement.getAttribute('data-portfolio-attribution') === 'ready') return;
    document.documentElement.setAttribute('data-portfolio-attribution', 'ready');
    api.updateHomeInventory();
    api.addProjectAttribution();
    addPaperAttribution();
  });
})();
