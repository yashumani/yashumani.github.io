import { test, expect } from '@playwright/test';

const paperRoutes = [
  '/blogs/metric-contracts-for-decision-grade-analytics.html',
  '/blogs/from-variance-to-decision.html',
  '/blogs/ai-proposes-deterministic-systems-decide.html',
  '/blogs/ai-powered-vs-ai-generated.html',
  '/blogs/neurodivergent-ai-architect.html'
];

const projectRoutes = [
  '/projects/mangrok-recipe-vault.html',
  '/projects/where-it-happened.html',
  '/projects/my-seventh-meal.html',
  '/projects/mlops-solution-accelerator.html',
  '/projects/agentic-knowledge-runtime.html'
];

const publicRoutes = ['/', '/blogs/', ...projectRoutes, ...paperRoutes];

for (const route of publicRoutes) {
  test(`${route} loads with stable structure`, async ({ page }) => {
    const errors = [];
    page.on('pageerror', error => errors.push(error.message));
    const response = await page.goto(route, { waitUntil: 'domcontentloaded' });
    expect(response).not.toBeNull();
    expect(response.ok(), `${route} returned ${response.status()}`).toBeTruthy();
    await expect(page.locator('main')).toBeVisible();
    await expect(page.locator('h1')).toHaveCount(1);
    expect(errors).toEqual([]);
    const overflow = await page.evaluate(() => Math.max(0, document.documentElement.scrollWidth - document.documentElement.clientWidth));
    expect(overflow, `${route} has horizontal overflow`).toBeLessThanOrEqual(2);
  });
}

for (const route of projectRoutes) {
  test(`${route} has numbered sections and system architecture`, async ({ page }) => {
    await page.goto(route, { waitUntil: 'domcontentloaded' });
    const firstHeading = page.locator('main.case-study-wrap > h2.case-section-heading').first();
    await expect(firstHeading).toBeVisible();
    await expect(firstHeading.locator('.case-section-number')).toHaveText(/\d{2}/);
    const gap = await firstHeading.evaluate(node => parseFloat(getComputedStyle(node).columnGap));
    expect(gap).toBeGreaterThan(0);
    await expect(page.locator('.case-toc')).toBeVisible();
    await expect(page.locator('.case-review-stamp')).toContainText('August 12, 2026');

    const diagram = page.locator('.flow-showcase');
    await expect(diagram).toBeVisible({ timeout: 8_000 });
    await expect(diagram.locator('.architecture-stage')).toHaveCount(4);
    await expect(diagram.locator('.architecture-node')).toHaveCount(16);
    await expect(diagram.locator('.flow-lane:not([hidden])')).toHaveCount(3);
  });
}

for (const route of paperRoutes) {
  test(`${route} has readable numbered headings and revision metadata`, async ({ page }) => {
    await page.goto(route, { waitUntil: 'domcontentloaded' });
    await expect(page.locator('main[data-paper-status="published"]')).toBeVisible();
    await expect(page.locator('.paper-byline')).toContainText('Last reviewed');
    const heading = page.locator('main > h2.case-section-heading').first();
    await expect(heading.locator('.case-section-number')).toHaveText('01');
    const gap = await heading.evaluate(node => parseFloat(getComputedStyle(node).columnGap));
    expect(gap).toBeGreaterThan(0);
    await expect(page.locator('.case-toc')).toBeVisible();
    await expect(page.locator('.paper-references')).toBeVisible();
  });
}

test('homepage uses profile metrics and five-paper inventory', async ({ page }) => {
  await page.goto('/');
  await expect(page.locator('.profile-metrics article')).toHaveCount(4);
  await expect(page.getByText('published working papers', { exact: true })).toBeVisible();
  const paperMetric = page.locator('.profile-metrics article').filter({ hasText: 'published working papers' }).locator('strong');
  await expect(paperMetric).toHaveText('5');
  await expect(page.locator('.work-entry')).toHaveCount(5);
  await expect(page.locator('.writing-entry')).toHaveCount(3);
  await expect(page.getByRole('link', { name: 'View all five working papers' })).toBeVisible();
  await expect(page.getByText('457', { exact: true })).toHaveCount(0);
  await expect(page.getByText('200+', { exact: true })).toHaveCount(0);
});

test('writing index lists five papers and a separate roadmap', async ({ page }) => {
  await page.goto('/blogs/');
  await expect(page.locator('.blog-card')).toHaveCount(5);
  await expect(page.locator('.paper-roadmap-item')).toHaveCount(4);
  await expect(page.getByRole('heading', { name: 'Metric Contracts for Decision-Grade Analytics' })).toBeVisible();
  await expect(page.getByRole('heading', { name: 'From Variance to Decision' })).toBeVisible();
  await expect(page.getByRole('heading', { name: 'AI Proposes, Deterministic Systems Decide' })).toBeVisible();
});

test('Mangrok case study reflects the current Alchemy scope', async ({ page }) => {
  await page.goto('/projects/mangrok-recipe-vault.html', { waitUntil: 'domcontentloaded' });
  await expect(page.locator('.architecture-flow .architecture-node strong', { hasText: 'Explainable Alchemy Lab' })).toBeVisible();
  await expect(page.locator('.case-hero-meta', { hasText: 'three Edge Functions' })).toBeVisible();
  const diagram = page.locator('#flow-mangrok');
  await expect(diagram).toHaveAttribute('data-content-reviewed', '2026-08-12', { timeout: 8_000 });
  await expect(diagram.getByText('Alchemy Lab interface', { exact: true })).toBeVisible();
});

test('scroll reveal, theme persistence, legacy hashes, and landmarks remain intact', async ({ page }) => {
  await page.goto('/');
  const writing = page.locator('#writing');
  await writing.scrollIntoViewIfNeeded();
  await expect(writing.locator('.writing-entry').first()).toHaveClass(/in/);

  const root = page.locator('html');
  const initial = await root.getAttribute('data-theme');
  await page.getByRole('button', { name: /Use (?:light|dark) mode/ }).click();
  const toggled = await root.getAttribute('data-theme');
  expect(toggled).not.toBe(initial);
  await page.reload();
  await expect(root).toHaveAttribute('data-theme', toggled);

  await page.goto('/#impact');
  await page.waitForTimeout(100);
  const top = await page.locator('#capabilities').evaluate(node => Math.abs(node.getBoundingClientRect().top));
  expect(top).toBeLessThan(180);
  await expect(page.locator('.skip-link')).toHaveAttribute('href', '#main-content');
  await expect(page.getByRole('navigation', { name: 'Primary navigation' })).toBeVisible();
});

test('attach homepage, paper index, and Mangrok screenshots', async ({ page }, testInfo) => {
  for (const [route, name, locator] of [
    ['/', 'homepage-full', null],
    ['/blogs/', 'working-papers-full', null],
    ['/projects/mangrok-recipe-vault.html', 'mangrok-current', '.flow-showcase']
  ]) {
    await page.goto(route, { waitUntil: 'domcontentloaded' });
    const path = testInfo.outputPath(`${name}.png`);
    if (locator) {
      const target = page.locator(locator);
      await expect(target).toBeVisible({ timeout: 8_000 });
      await target.scrollIntoViewIfNeeded();
      const pause = target.getByRole('button', { name: 'Pause animation' });
      if (await pause.count()) await pause.click();
      await target.screenshot({ path, animations: 'disabled' });
    } else {
      await page.screenshot({ path, fullPage: true, animations: 'disabled' });
    }
    await testInfo.attach(`${name}-${testInfo.project.name}`, { path, contentType: 'image/png' });
  }
});
