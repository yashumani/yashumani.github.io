(function () {
  'use strict';

  var patched = typeof WeakSet === 'function' ? new WeakSet() : null;

  function copy(value) {
    if (!value || typeof value !== 'object') return value;
    if (Array.isArray(value)) return value.map(copy);
    var result = {};
    Object.keys(value).forEach(function (key) { result[key] = copy(value[key]); });
    return result;
  }

  function reaches(adjacency, start, target, visited) {
    if (start === target) return true;
    if (visited[start]) return false;
    visited[start] = true;
    return (adjacency[start] || []).some(function (next) {
      return reaches(adjacency, next, target, visited);
    });
  }

  function makeAcyclic(series) {
    if (!series || series.type !== 'sankey' || !Array.isArray(series.links)) return series;

    var safe = copy(series);
    var adjacency = {};
    var names = new Set((safe.data || []).map(function (item) { return item && item.name; }).filter(Boolean));
    var duplicateCount = {};

    safe.links = safe.links.map(function (link) {
      var next = copy(link);
      var source = String(next.source || '');
      var target = String(next.target || '');
      if (!source || !target) return next;

      if (reaches(adjacency, target, source, {})) {
        duplicateCount[target] = (duplicateCount[target] || 0) + 1;
        var suffix = duplicateCount[target] === 1 ? ' (rescan)' : ' (rescan ' + duplicateCount[target] + ')';
        var duplicate = target + suffix;
        while (names.has(duplicate)) {
          duplicateCount[target] += 1;
          duplicate = target + ' (rescan ' + duplicateCount[target] + ')';
        }
        names.add(duplicate);
        safe.data = safe.data || [];
        safe.data.push({ name: duplicate });
        next.target = duplicate;
        target = duplicate;
      }

      adjacency[source] = adjacency[source] || [];
      adjacency[source].push(target);
      return next;
    });

    return safe;
  }

  function sanitizeOption(option) {
    if (!option || typeof option !== 'object' || !Array.isArray(option.series)) return option;
    var safe = Object.assign({}, option);
    safe.series = option.series.map(makeAcyclic);
    return safe;
  }

  function patchECharts(library) {
    if (!library || typeof library.init !== 'function') return library;
    if (patched && patched.has(library)) return library;
    if (library.__portfolioSankeySafety) return library;

    var originalInit = library.init;
    library.init = function () {
      var chart = originalInit.apply(this, arguments);
      if (!chart || typeof chart.setOption !== 'function' || chart.__portfolioSankeySafety) return chart;
      var originalSetOption = chart.setOption;
      chart.setOption = function (option) {
        var args = Array.prototype.slice.call(arguments);
        args[0] = sanitizeOption(option);
        return originalSetOption.apply(this, args);
      };
      try { Object.defineProperty(chart, '__portfolioSankeySafety', { value: true }); }
      catch (error) { chart.__portfolioSankeySafety = true; }
      return chart;
    };

    try { Object.defineProperty(library, '__portfolioSankeySafety', { value: true }); }
    catch (error) { library.__portfolioSankeySafety = true; }
    if (patched) patched.add(library);
    return library;
  }

  var existing = window.echarts;
  if (existing) patchECharts(existing);

  var stored = existing;
  try {
    Object.defineProperty(window, 'echarts', {
      configurable: true,
      enumerable: true,
      get: function () { return stored; },
      set: function (value) { stored = patchECharts(value); }
    });
  } catch (error) {
    window.setInterval(function () { if (window.echarts) patchECharts(window.echarts); }, 250);
  }

  window.PORTFOLIO_ECHARTS_SAFETY = {
    sanitizeOption: sanitizeOption,
    patchECharts: patchECharts
  };
})();
