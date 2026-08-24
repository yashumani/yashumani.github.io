import { test, expect } from '@playwright/test';

const cases = [
  { route: '/projects/agentic-harness-builder.html', id: 'harnesslab', engine: 'g6', source: 'AntV G6 5.1.1' },
  { route: '/projects/governed-ai-brain.html', id: 'ai-brain', engine: 'g6', source: 'AntV G6 5.1.1' },
  { route: '/projects/dq-check-platform.html', id: 'dq-check', engine: 'echarts', source: 'Apache ECharts 6.1.0' },
  { route: '/projects/mlops-solution-accelerator.html', id: 'mlops', engine: 'echarts', source: 'Apache ECharts 6.1.0' }
];

async function installVisualizationMock(page, engine) {
  await page.addInitScript(({ engineName }) => {
    if (engineName === 'g6') {
      window.G6 = {
        Graph: class MockGraph {
          constructor(options) {
            this.options = options;
            this.container = options.container;
            this.marker = null;
          }
          render() {
            this.marker = document.createElement('div');
            this.marker.dataset.mockG6 = 'true';
            this.marker.textContent = `${this.options.data.nodes.length} graph nodes / ${this.options.data.edges.length} graph edges`;
            this.container.appendChild(this.marker);
            return Promise.resolve();
          }
          destroy() { if (this.marker) this.marker.remove(); }
          resize() {}
          fitView() { return Promise.resolve(); }
          focusElement() { return Promise.resolve(); }
          setElementState() { return Promise.resolve(); }
        }
      };
    } else {
      window.echarts = {
        init(container) {
          const marker = document.createElement('div');
          marker.dataset.mockEcharts = 'true';
          container.appendChild(marker);
          return {
            setOption(option) {
              marker.dataset.seriesCount = String((option.series || []).length);
              marker.textContent = `${(option.series || []).length} chart series`;
            },
            resize() {},
            dispose() { marker.remove(); }
          };
        }
      };
    }
  }, { engineName: engine });
}

for (const item of cases) {
  test(`${item.route} provides a resilient advanced ${item.engine} explorer`, async ({ page }) => {
    await installVisualizationMock(page, item.engine);
    await page.goto(item.route, { waitUntil: 'domcontentloaded' });

    const section = page.locator(`[data-project-explorer="${item.id}"]`);
    await expect(section).toBeVisible({ timeout: 8_000 });
    await section.scrollIntoViewIfNeeded();
    await expect(section).toHaveAttribute('data-advanced-explorer', item.engine);
    await expect(section.locator('[data-explorer-view]')).toHaveCount(3);
    await expect(section.locator('[data-explorer-fallback]')).toBeVisible();
    await expect(section.locator('.advanced-explorer-engine')).toContainText(item.source);
    await expect(section).toHaveAttribute('data-explorer-rendered', 'true', { timeout: 8_000 });

    if (item.engine === 'g6') {
      await expect(section.locator('[data-mock-g6]')).toBeVisible();
      expect(await section.locator('[data-explorer-search] option').count()).toBeGreaterThan(1);
      await section.locator('[data-explorer-view]').nth(1).click();
      await expect(section.locator('[data-mock-g6]')).toBeVisible();
      await expect(section.locator('[data-explorer-detail] h3')).toHaveText(await section.locator('[data-explorer-view]').nth(1).innerText());
      await section.locator('[data-explorer-replay]').click();
      await expect(section.locator('[data-explorer-status]')).toContainText('Trace step');
    } else {
      await expect(section.locator('[data-mock-echarts]')).toBeVisible();
      await expect(section.locator('[data-mock-echarts]')).toHaveAttribute('data-series-count', /[1-9]/);
      await section.locator('[data-explorer-view]').nth(1).click();
      await expect(section.locator('[data-mock-echarts]')).toBeVisible();
      await expect(section.locator('[data-explorer-detail] h3')).toHaveText(await section.locator('[data-explorer-view]').nth(1).innerText());
    }

    const overflow = await page.evaluate(() => Math.max(0, document.documentElement.scrollWidth - document.documentElement.clientWidth));
    expect(overflow).toBeLessThanOrEqual(2);
    await expect(page.locator('.source-attribution-section')).toContainText(item.source, { timeout: 8_000 });
  });
}

test('advanced explorers pin supported runtime versions and retain a no-library fallback', async ({ page }) => {
  await page.route('https://cdn.jsdelivr.net/**', route => route.abort());
  await page.goto('/projects/agentic-harness-builder.html', { waitUntil: 'domcontentloaded' });
  const section = page.locator('[data-project-explorer="harnesslab"]');
  await expect(section).toBeVisible({ timeout: 8_000 });
  await section.scrollIntoViewIfNeeded();
  await expect(section).toHaveAttribute('data-explorer-rendered', 'fallback', { timeout: 8_000 });
  await expect(section.locator('[data-explorer-fallback]')).toBeVisible();
  await expect(section.locator('[data-explorer-status]')).toContainText('complete text alternative remains available');
});
