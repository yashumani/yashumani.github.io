(function () {
  'use strict';

  var sources = window.PORTFOLIO_PROJECT_SOURCES = window.PORTFOLIO_PROJECT_SOURCES || {};

  function append(slug, entries) {
    var existing = sources[slug] || [];
    var urls = new Set(existing.map(function (entry) { return entry.url; }));
    entries.forEach(function (entry) {
      if (!urls.has(entry.url)) existing.push(entry);
    });
    sources[slug] = existing;
  }

  var g6 = {
    label: 'AntV G6 5.1.1 — Graph visualization framework',
    url: 'https://g6.antv.antgroup.com/en/manual/getting-started/installation',
    note: 'Pinned browser visualization runtime for the optional architecture explorer. G6 supplies graph rendering, pan, zoom, selection, animation, and viewport behavior; the project-specific architecture and data model are this portfolio implementation.'
  };

  var g6Repository = {
    label: 'AntV G6 repository and MIT license',
    url: 'https://github.com/antvis/G6',
    note: 'Upstream source, release, and license reference for the graph engine used by the advanced explorer.'
  };

  var echarts = {
    label: 'Apache ECharts 6.1.0 — Browser visualization library',
    url: 'https://echarts.apache.org/handbook/en/get-started/',
    note: 'Pinned browser visualization runtime for the optional analytical explorer. ECharts supplies chart rendering and interaction; the project-specific structures, labels, and evidence boundaries are this portfolio implementation.'
  };

  var echartsRepository = {
    label: 'Apache ECharts repository and Apache-2.0 license',
    url: 'https://github.com/apache/echarts',
    note: 'Upstream source, release, and license reference for the chart engine used by the advanced explorer.'
  };

  append('agentic-harness-builder.html', [g6, g6Repository]);
  append('governed-ai-brain.html', [g6, g6Repository]);
  append('dq-check-platform.html', [echarts, echartsRepository]);
  append('mlops-solution-accelerator.html', [echarts, echartsRepository]);
})();
