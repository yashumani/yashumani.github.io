import { test, expect } from '@playwright/test';

test('DQ investigation Sankey is converted to an acyclic rescan path', async ({ page }) => {
  await page.addInitScript(() => {
    window.echarts = {
      init(container) {
        return {
          setOption(option) {
            const series = (option.series || [])[0] || {};
            const adjacency = new Map();
            for (const link of series.links || []) {
              const source = String(link.source || '');
              const target = String(link.target || '');
              if (!adjacency.has(source)) adjacency.set(source, []);
              adjacency.get(source).push(target);
            }
            const done = new Set();
            function visit(node, active) {
              if (active.has(node)) return true;
              if (done.has(node)) return false;
              active.add(node);
              for (const next of adjacency.get(node) || []) {
                if (visit(next, active)) return true;
              }
              active.delete(node);
              done.add(node);
              return false;
            }
            let cycle = false;
            for (const node of adjacency.keys()) {
              if (visit(node, new Set())) { cycle = true; break; }
            }
            container.dataset.mockEcharts = 'true';
            container.dataset.hasCycle = String(cycle);
            container.dataset.nodeNames = (series.data || []).map(item => item.name).join('|');
          },
          resize() {},
          dispose() {}
        };
      }
    };
  });

  await page.goto('/projects/dq-check-platform.html', { waitUntil: 'domcontentloaded' });
  const section = page.locator('[data-project-explorer="dq-check"]');
  await expect(section).toBeVisible({ timeout: 8_000 });
  await section.scrollIntoViewIfNeeded();
  await expect(section).toHaveAttribute('data-explorer-rendered', 'true', { timeout: 8_000 });
  await section.locator('[data-explorer-view="investigation"]').click();

  const canvas = section.locator('[data-explorer-canvas]');
  await expect(canvas).toHaveAttribute('data-has-cycle', 'false');
  await expect(canvas).toHaveAttribute('data-node-names', /Dimension scan \(rescan\)/);
});

test('safety helper leaves an already acyclic Sankey unchanged', async ({ page }) => {
  await page.goto('/projects/dq-check-platform.html', { waitUntil: 'domcontentloaded' });
  const result = await page.evaluate(() => {
    const option = {
      series: [{
        type: 'sankey',
        data: [{ name: 'A' }, { name: 'B' }, { name: 'C' }],
        links: [{ source: 'A', target: 'B', value: 1 }, { source: 'B', target: 'C', value: 1 }]
      }]
    };
    const safe = window.PORTFOLIO_ECHARTS_SAFETY.sanitizeOption(option);
    return {
      names: safe.series[0].data.map(item => item.name),
      links: safe.series[0].links.map(link => [link.source, link.target])
    };
  });

  expect(result.names).toEqual(['A', 'B', 'C']);
  expect(result.links).toEqual([['A', 'B'], ['B', 'C']]);
});
