import { test, expect } from '@playwright/test';

const diagrams = [
  { route: '/projects/prefrontal-context-layer.html', stages: 10 },
  { route: '/projects/agentic-knowledge-runtime.html', stages: 7 },
  { route: '/projects/mlops-solution-accelerator.html', stages: 9 }
];

for (const { route, stages } of diagrams) {
  test(`${route} steps its inline mechanism diagram`, async ({ page }) => {
    await page.goto(route, { waitUntil: 'domcontentloaded' });
    const figure = page.locator('.mechanism-figure:not(.flow-mechanism)');
    await expect(figure).toHaveCount(1);
    await expect(figure.locator('svg.mechanism-svg title')).toHaveCount(1);
    await expect(figure.locator('img')).toHaveCount(0);
    await figure.scrollIntoViewIfNeeded();
    const controls = figure.locator('.mechanism-controls');
    await expect(controls).toBeVisible();
    await expect(figure.locator('.mechanism-progress span')).toHaveCount(stages);
    await controls.getByRole('button', { name: 'Next', exact: true }).click();
    await expect(figure).toHaveClass(/is-animated/);
    await expect(figure.locator('.mechanism-stage')).toContainText(`/${stages} · `);
    await expect(figure.locator('.is-current').first()).toBeVisible();
  });

  test(`${route} mechanism diagram is fully legible without JavaScript`, async ({ browser }) => {
    const context = await browser.newContext({ javaScriptEnabled: false });
    const page = await context.newPage();
    await page.goto(route);
    const figure = page.locator('.mechanism-figure:not(.flow-mechanism)');
    await expect(figure.locator('.mechanism-controls')).toBeHidden();
    const dimmed = await figure.locator('.m-node, .m-edge').evaluateAll(nodes =>
      nodes.filter(node => Number(getComputedStyle(node).opacity) < 1).length);
    expect(dimmed).toBe(0);
    await context.close();
  });
}

for (const route of ['/projects/prefrontal-context-layer.html', '/projects/governed-ai-brain.html', '/professional-profile.html']) {
  test(`${route} theme toggle flips the theme exactly once`, async ({ page }) => {
    await page.goto(route, { waitUntil: 'domcontentloaded' });
    await expect(page.locator('.theme-toggle')).toHaveCount(1);
    const before = await page.evaluate(() => document.documentElement.getAttribute('data-theme'));
    await page.locator('.theme-toggle').click();
    await expect.poll(() => page.evaluate(() => document.documentElement.getAttribute('data-theme'))).not.toBe(before);
  });
}

const showcaseRoutes = [
  ['agentic-harness-builder', true], ['forkwise-open-source-reviewer', true], ['governed-ai-brain', true],
  ['mangrok-recipe-vault', true], ['where-it-happened', true], ['my-seventh-meal', true],
  ['prefrontal-context-layer', false], ['agentic-knowledge-runtime', false], ['mlops-solution-accelerator', false]
];

for (const [slug, hasArchitectureFigure] of showcaseRoutes) {
  test(`/projects/${slug}.html redraws its flow showcase as stepped mechanism diagrams`, async ({ page }) => {
    await page.goto(`/projects/${slug}.html`, { waitUntil: 'domcontentloaded' });
    const showcase = page.locator('.flow-showcase');
    await expect(showcase).toHaveAttribute('data-flow-mechanism', 'ready', { timeout: 10_000 });
    const generated = showcase.locator('.mechanism-figure.flow-mechanism');
    await expect(generated).toHaveCount(hasArchitectureFigure ? 2 : 1);
    const execution = generated.last();
    await expect(execution.locator('.mf-row')).toHaveCount(3);
    await execution.scrollIntoViewIfNeeded();
    await execution.getByRole('button', { name: 'Next', exact: true }).click();
    await expect(execution).toHaveClass(/is-animated/);
    await expect(execution.locator('.mechanism-stage')).toContainText('Logic:');
    await showcase.locator('[data-flow-filter="code"]').click();
    await expect(execution.locator('.mf-row-off')).toHaveCount(2);
  });
}
