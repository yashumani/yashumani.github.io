(function () {
  'use strict';

  var api = window.PORTFOLIO_FACTCHECK = window.PORTFOLIO_FACTCHECK || {};

  api.ready = function (callback) {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', callback, { once: true });
    } else {
      callback();
    }
  };

  api.slug = function () {
    return window.location.pathname.split('/').pop() || 'index.html';
  };

  api.externalLink = function (url, label, note) {
    var item = document.createElement('li');
    var link = document.createElement('a');
    link.href = url;
    link.target = '_blank';
    link.rel = 'noopener';
    link.textContent = label;
    var detail = document.createElement('span');
    detail.textContent = note;
    item.appendChild(link);
    item.appendChild(detail);
    return item;
  };

  api.addReferences = function (list, sources) {
    if (!list || !sources) return;
    sources.forEach(function (source) {
      var exists = Array.prototype.some.call(list.querySelectorAll('a[href]'), function (link) {
        return link.href === source.url || link.getAttribute('href') === source.url;
      });
      if (!exists) list.appendChild(api.externalLink(source.url, source.label, source.note));
    });
  };

  api.buildSourceSection = function (sources) {
    var section = document.createElement('section');
    section.className = 'source-attribution-section';
    section.setAttribute('aria-labelledby', 'sources-and-attribution');

    var heading = document.createElement('h2');
    heading.id = 'sources-and-attribution';
    heading.textContent = 'Sources and attribution';

    var boundary = document.createElement('p');
    boundary.className = 'project-origin-note';
    boundary.textContent = 'These references credit the standards, methods, products, and prior art that informed the work. The authorship claim on this page is limited to this project’s product decisions, implementation, integration, and documented synthesis—not invention of the underlying concepts or third-party tools.';

    var list = document.createElement('ol');
    list.className = 'paper-references project-references';
    api.addReferences(list, sources);

    section.appendChild(heading);
    section.appendChild(boundary);
    section.appendChild(list);
    return section;
  };
})();
