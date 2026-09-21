(function () {
  'use strict';

  var api = window.PORTFOLIO_FACTCHECK;
  if (!api) return;

  var slug = 'thread-conversational-intelligence.html';

  function updateHome() {
    var work = document.getElementById('work');
    var professional = work && work.querySelector('[data-work-group="professional"]');
    var list = professional && professional.querySelector('.work-list');
    var entry = work && work.querySelector('[data-project="thread-conversational-intelligence"]');
    if (list && entry && list.firstElementChild !== entry) list.insertBefore(entry, list.firstElementChild);

    if (work) {
      Array.prototype.forEach.call(work.querySelectorAll('.work-entry'), function (item, index) {
        var number = item.querySelector('.work-index');
        if (number) number.textContent = String(index + 1).padStart(2, '0');
      });
    }
  }

  function updateResume() {
    var grid = document.querySelector('.resume-project-grid');
    var thread = grid && grid.querySelector('a[href="projects/thread-conversational-intelligence.html"]');
    if (grid && thread && grid.firstElementChild !== thread) grid.insertBefore(thread, grid.firstElementChild);

    var heading = document.querySelector('.resume-projects .section-heading h2');
    if (heading) heading.textContent = 'Ten systems used as technical evidence';
  }

  function updatePresentation() {
    var slide = document.querySelector('[data-presentation] [data-title="Independent portfolio"]');
    if (!slide) return;
    var heading = slide.querySelector('.slide-heading h2');
    if (heading) heading.textContent = 'Ten independent systems used as technical evidence';
    var grid = slide.querySelector('.project-chip-grid');
    if (grid && !grid.querySelector('a[href="projects/thread-conversational-intelligence.html"]')) {
      var link = document.createElement('a');
      link.href = 'projects/thread-conversational-intelligence.html';
      link.innerHTML = '<strong>THREAD</strong><span>Governed conversational intelligence</span>';
      grid.insertBefore(link, grid.firstChild);
    }
  }

  function fixReviewStamp() {
    if (api.slug() !== slug) return;
    var stamp = document.querySelector('.case-review-stamp');
    if (stamp) {
      stamp.textContent = 'Content and source snapshot reviewed September 21, 2026 · Community-alpha completion applies to the released public milestone, not a production enterprise deployment.';
    }
  }

  var originalUpdateHomeInventory = api.updateHomeInventory;
  api.updateHomeInventory = function () {
    if (typeof originalUpdateHomeInventory === 'function') originalUpdateHomeInventory();
    updateHome();
  };

  api.ready(function () {
    updateHome();
    updateResume();
    updatePresentation();
    fixReviewStamp();
    window.setTimeout(fixReviewStamp, 100);
    window.setTimeout(fixReviewStamp, 500);
  });
  window.addEventListener('load', fixReviewStamp, { once: true });
})();
