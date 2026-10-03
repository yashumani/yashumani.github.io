(function () {
  'use strict';

  /* Redraws every .flow-showcase as inline, stepped mechanism SVGs.
     The rendered showcase DOM stays the source of truth (it is what the
     renderers and flow-content-sync write to); it is kept as visually hidden
     text for assistive technology while the SVGs carry the visuals. */

  var NS = 'http://www.w3.org/2000/svg';
  var W = 960;
  var KIND_LABELS = [['client', 'Experience'], ['service', 'Service'], ['data', 'Data'], ['external', 'External / operational']];
  var LANE_LABELS = { logic: 'Logic', code: 'Code', data: 'Data' };
  var uid = 0;

  function svgEl(tag, attrs, parent) {
    var node = document.createElementNS(NS, tag);
    Object.keys(attrs || {}).forEach(function (key) { node.setAttribute(key, attrs[key]); });
    if (parent) parent.appendChild(node);
    return node;
  }

  function lines(parent, x, y, rows, cls, lineHeight) {
    var text = svgEl('text', { x: x, y: y, class: cls }, parent);
    rows.forEach(function (row, i) {
      var span = svgEl('tspan', { x: x, dy: i ? lineHeight : 0 }, text);
      span.textContent = row;
    });
    return text;
  }

  function clean(node) {
    return node ? node.textContent.replace(/\s+/g, ' ').trim() : '';
  }

  function wrap(str, maxChars, maxLines) {
    var words = str.split(' ');
    var out = [];
    var line = '';
    words.forEach(function (word) {
      var next = line ? line + ' ' + word : word;
      if (next.length > maxChars && line) { out.push(line); line = word; }
      else line = next;
    });
    if (line) out.push(line);
    if (out.length > maxLines) {
      out = out.slice(0, maxLines);
      out[maxLines - 1] = out[maxLines - 1].replace(/\s*\S*$/, '') + '…';
    }
    return out;
  }

  function readArchitecture(section) {
    return Array.prototype.map.call(section.querySelectorAll('.architecture-stage'), function (stage) {
      return {
        badge: clean(stage.querySelector('.architecture-stage-badge')),
        title: clean(stage.querySelector('h3')),
        note: clean(stage.querySelector('.architecture-stage-note')),
        nodes: Array.prototype.map.call(stage.querySelectorAll('.architecture-node'), function (node) {
          var kind = Array.prototype.filter.call(node.classList, function (c) { return c.indexOf('architecture-node--') === 0; })[0] || 'architecture-node--service';
          return { label: clean(node.querySelector('strong') || node), kind: kind.split('--')[1] };
        })
      };
    });
  }

  function readLanes(section) {
    return Array.prototype.map.call(section.querySelectorAll('.flow-lane'), function (lane) {
      return {
        kind: lane.getAttribute('data-flow-kind') || 'logic',
        title: clean(lane.querySelector('.flow-lane-head h3') || lane.querySelector('h3')),
        steps: Array.prototype.map.call(lane.querySelectorAll('.flow-step'), function (step) {
          return { title: clean(step.querySelector('h4')), detail: clean(step.querySelector('p')), mini: clean(step.querySelector('.flow-mini')) };
        })
      };
    });
  }

  function marker(defs, id) {
    var m = svgEl('marker', { id: id, viewBox: '0 0 10 10', refX: 9, refY: 5, markerWidth: 7, markerHeight: 7, orient: 'auto-start-reverse' }, defs);
    svgEl('path', { d: 'M0,0 L10,5 L0,10 z', class: 'mk-accent' }, m);
  }

  function edge(parent, step, x1, y1, x2, y2, markerId, extraClass) {
    var g = svgEl('g', { class: 'm-edge' + (extraClass ? ' ' + extraClass : ''), 'data-step': step }, parent);
    svgEl('line', { x1: x1, y1: y1, x2: x2, y2: y2, 'marker-end': 'url(#' + markerId + ')' }, g);
    var dot = svgEl('circle', { class: 'm-dot', r: 3 }, g);
    svgEl('animateMotion', { dur: '1.4s', repeatCount: 'indefinite', path: 'M' + x1 + ',' + y1 + ' L' + x2 + ',' + y2 }, dot);
    return g;
  }

  function figure(svg, caption) {
    var fig = document.createElement('figure');
    fig.className = 'mechanism-figure flow-mechanism';
    var scroller = document.createElement('div');
    scroller.className = 'mechanism-scroller';
    scroller.appendChild(svg);
    fig.appendChild(scroller);
    var cap = document.createElement('figcaption');
    cap.textContent = caption;
    fig.appendChild(cap);
    return fig;
  }

  function buildArchitecture(stages, markerId) {
    var n = stages.length;
    var gap = 40;
    var colW = (W - 36 - gap * (n - 1)) / n;
    var titleChars = Math.floor(colW / 6.9);
    var nodeChars = Math.floor((colW - 30) / 6);
    var svg = svgEl('svg', { class: 'mechanism-svg', role: 'presentation', 'aria-hidden': 'true', focusable: 'false' });
    marker(svgEl('defs', {}, svg), markerId);

    var titleRows = stages.map(function (stage) { return wrap(stage.title, titleChars, 3); });
    var headH = 52 + Math.max.apply(null, titleRows.map(function (r) { return r.length; })) * 15;
    var nodeRows = stages.map(function (stage) {
      return stage.nodes.map(function (node) { return wrap(node.label, nodeChars, 2); });
    });
    var columnBodies = nodeRows.map(function (rows) {
      return rows.reduce(function (sum, r) { return sum + (r.length > 1 ? 42 : 32) + 8; }, 0);
    });
    var frameTop = 8;
    var frameBottom = frameTop + headH + Math.max.apply(null, columnBodies) + 6;
    var midY = Math.round((frameTop + frameBottom) / 2);

    stages.forEach(function (stage, i) {
      var x = 18 + i * (colW + gap);
      var g = svgEl('g', { class: 'm-node mf-stage', 'data-step': i + 1, 'data-stage': (stage.badge ? stage.badge + ' — ' : '') + (stage.note || stage.title) }, svg);
      svgEl('rect', { class: 'mf-frame', x: x, y: frameTop, width: colW, height: frameBottom - frameTop, rx: 10 }, g);
      lines(g, x + 14, frameTop + 24, [String(i + 1).padStart(2, '0') + ' · ' + (stage.badge || '').toUpperCase()], 'm-band mf-left', 0);
      lines(g, x + 14, frameTop + 46, titleRows[i], 'm-hd mf-left', 15);
      var y = frameTop + headH;
      stage.nodes.forEach(function (node, j) {
        var rows = nodeRows[i][j];
        var h = rows.length > 1 ? 42 : 32;
        var chip = svgEl('g', { class: 'mf-chip k-' + node.kind }, g);
        svgEl('rect', { class: 'mf-chip-box', x: x + 10, y: y, width: colW - 20, height: h, rx: 6 }, chip);
        svgEl('rect', { class: 'mf-stripe', x: x + 10, y: y, width: 4, height: h, rx: 2 }, chip);
        lines(chip, x + 22, y + (rows.length > 1 ? 17 : 20), rows, 'mf-chip-text', 13);
        y += h + 8;
      });
      if (i < n - 1) edge(svg, i + 2, x + colW + 2, midY, x + colW + gap - 4, midY, markerId);
    });

    var ly = frameBottom + 26;
    var lx = 18;
    var legend = svgEl('g', { class: 'mf-legend' }, svg);
    KIND_LABELS.forEach(function (entry) {
      svgEl('rect', { class: 'mf-stripe k-' + entry[0], x: lx, y: ly - 9, width: 10, height: 10, rx: 2 }, legend);
      lines(legend, lx + 16, ly, [entry[1]], 'm-tag mf-left', 0);
      lx += 30 + entry[1].length * 6.2;
    });
    svg.setAttribute('viewBox', '0 0 ' + W + ' ' + (ly + 12));
    return svg;
  }

  function buildExecution(lanes, markerId) {
    var cols = Math.max.apply(null, lanes.map(function (l) { return l.steps.length; }));
    var labelW = 104;
    var gap = 22;
    var cellW = (W - 36 - labelW - gap * (cols - 1)) / cols;
    var chars = Math.floor((cellW - 16) / 6.3);
    var svg = svgEl('svg', { class: 'mechanism-svg', role: 'presentation', 'aria-hidden': 'true', focusable: 'false' });
    marker(svgEl('defs', {}, svg), markerId);

    var titleRows = lanes.map(function (lane) { return lane.steps.map(function (s) { return wrap(s.title, chars, 3); }); });
    var maxLines = Math.max.apply(null, titleRows.map(function (r) { return Math.max.apply(null, r.map(function (x) { return x.length; }).concat([1])); }));
    var hasMini = lanes.some(function (l) { return l.steps.some(function (s) { return s.mini; }); });
    var cellH = 24 + maxLines * 13 + (hasMini ? 18 : 0);
    var miniChars = Math.floor((cellW - 16) / 5.2);
    var rowGap = 30;

    lanes.forEach(function (lane, r) {
      var y = 12 + r * (cellH + rowGap);
      var row = svgEl('g', { class: 'mf-row lane-' + lane.kind, 'data-flow-kind': lane.kind }, svg);
      svgEl('rect', { class: 'mf-stripe', x: 18, y: y, width: 4, height: cellH, rx: 2 }, row);
      lines(row, 30, y + cellH / 2 - 2, [lane.title || (LANE_LABELS[lane.kind] + ' flow')], 'm-hd mf-left', 0);
      lines(row, 30, y + cellH / 2 + 13, [lane.steps.length + ' steps'], 'm-tag mf-left', 0);
      lane.steps.forEach(function (step, c) {
        var x = 18 + labelW + c * (cellW + gap);
        var g = svgEl('g', { class: 'm-node mf-cell', 'data-step': c + 1 }, row);
        svgEl('rect', { x: x, y: y, width: cellW, height: cellH, rx: 7 }, g);
        lines(g, x + 8, y + 12, [String(c + 1).padStart(2, '0')], 'm-new mf-left', 0);
        lines(g, x + 8, y + 28, titleRows[r][c], 'mf-cell-title', 13);
        if (step.mini) lines(g, x + 8, y + cellH - 10, wrap(step.mini, miniChars, 1), 'm-tag mf-left', 0);
        if (c < lane.steps.length - 1) edge(row, c + 2, x + cellW + 1, y + cellH / 2, x + cellW + gap - 3, y + cellH / 2, markerId, 'lane-' + lane.kind);
      });
    });

    var captions = [];
    for (var c = 0; c < cols; c += 1) {
      captions.push(lanes.filter(function (l) { return l.steps[c]; }).map(function (l) {
        return (LANE_LABELS[l.kind] || l.kind) + ': ' + l.steps[c].title;
      }).join(' · '));
    }
    svg.querySelectorAll('.mf-cell').forEach(function (cell) {
      var step = Number(cell.getAttribute('data-step'));
      if (!svg.querySelector('[data-stage][data-step="' + step + '"]')) cell.setAttribute('data-stage', captions[step - 1]);
    });
    svg.setAttribute('viewBox', '0 0 ' + W + ' ' + (12 + lanes.length * (cellH + rowGap) - rowGap + 12));
    return svg;
  }

  function hideVisually(node) {
    if (node) node.classList.add('mf-source');
  }

  function convert(section) {
    if (section.getAttribute('data-flow-mechanism') === 'ready') return;
    section.setAttribute('data-flow-mechanism', 'ready');
    uid += 1;

    var stages = readArchitecture(section);
    var lanes = readLanes(section);
    var handDrawn = Array.prototype.some.call(document.querySelectorAll('.mechanism-figure'), function (fig) {
      return !section.contains(fig);
    });
    var figures = [];

    var overview = section.querySelector('.architecture-overview');
    var track = section.querySelector('.architecture-track');
    if (stages.length && track) {
      if (handDrawn) {
        hideVisually(overview);
      } else {
        var arch = figure(buildArchitecture(stages, 'mfa-' + uid),
          'Each stage lights in turn and the dots trace the hand-off to the next. Colour marks experience, service, data, and external or operational boundaries.');
        track.parentNode.insertBefore(arch, track);
        hideVisually(track);
        hideVisually(section.querySelector('.architecture-legend'));
        figures.push(arch);
      }
    }

    var grid = section.querySelector('.flow-grid');
    if (lanes.length && grid) {
      var exec = figure(buildExecution(lanes, 'mfe-' + uid),
        'Steps advance together across the logic, code, and data lanes. The filters above dim the lanes you are not reading.');
      grid.parentNode.insertBefore(exec, grid);
      hideVisually(grid);
      figures.push(exec);

      section.addEventListener('click', function (event) {
        var button = event.target.closest && event.target.closest('[data-flow-filter]');
        if (!button) return;
        var filter = button.getAttribute('data-flow-filter') || 'all';
        exec.querySelectorAll('.mf-row').forEach(function (row) {
          row.classList.toggle('mf-row-off', filter !== 'all' && row.getAttribute('data-flow-kind') !== filter);
        });
      });
    }

    var oldPlay = section.querySelector('.flow-play-toggle');
    if (oldPlay && figures.length) {
      if (oldPlay.getAttribute('aria-pressed') === 'false') oldPlay.click();
      oldPlay.hidden = true;
    }

    figures.forEach(function (fig) { window.MechanismDiagram.init(fig); });
  }

  function ensureAssets(done) {
    var script = document.querySelector('script[src$="js/flow-mechanism.js"]');
    var root = script ? script.src.replace(/js\/flow-mechanism\.js(?:\?.*)?$/, '') : '../';
    if (!document.querySelector('link[href$="css/mechanism.css"]')) {
      var link = document.createElement('link');
      link.rel = 'stylesheet';
      link.href = root + 'css/mechanism.css';
      document.head.appendChild(link);
    }
    if (window.MechanismDiagram) { done(); return; }
    var existing = document.querySelector('script[src$="js/mechanism-diagram.js"]');
    if (existing) { existing.addEventListener('load', done, { once: true }); return; }
    var runner = document.createElement('script');
    runner.src = root + 'js/mechanism-diagram.js';
    runner.addEventListener('load', done, { once: true });
    document.body.appendChild(runner);
  }

  function whenSettled(section, callback) {
    var timer = null;
    var observer = new MutationObserver(function () { schedule(); });
    function schedule() {
      if (timer) window.clearTimeout(timer);
      timer = window.setTimeout(function () { observer.disconnect(); callback(section); }, 450);
    }
    observer.observe(section, { childList: true, subtree: true, characterData: true, attributes: true, attributeFilter: ['data-content-reviewed'] });
    schedule();
  }

  function start() {
    var waited = 0;
    (function poll() {
      var sections = document.querySelectorAll('.flow-showcase:not([data-flow-mechanism])');
      if (sections.length) {
        ensureAssets(function () { Array.prototype.forEach.call(sections, function (s) { whenSettled(s, convert); }); });
        return;
      }
      waited += 150;
      if (waited < 15000) window.setTimeout(poll, 150);
    })();
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', start);
  else start();
})();
