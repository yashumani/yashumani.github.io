import { test, expect } from '@playwright/test';

const paperRoutes = [
  '/blogs/technical-interviews-in-the-ai-assisted-era.html',
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
  '/projects/governed-ai-brain.html',
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

test('homepage uses six-system and six-paper inventory', async ({ page }) => {
  await page.goto('/');
  await expect(page.locator('.profile-metrics article')).toHaveCount(4);
  await expect(page.getByText('showcased systems', { exact: true })).toBeVisible();
  const systemMetric = page.locator('.profile-metrics article').filter({ hasText: 'showcased systems' }).locator('strong');
  await expect(systemMetric).toHaveText('6');
  await expect(page.getByText('published working papers', { exact: true })).toBeVisible();
  const paperMetric = page.locator('.profile-metrics article').filter({ hasText: 'published working papers' }).locator('strong');
  await expect(paperMetric).toHaveText('6');
  await expect(page.locator('.work-entry')).toHaveCount(6);
  await expect(page.locator('.writing-entry')).toHaveCount(3);
  await expect(page.getByRole('heading', { name: 'Unified Knowledge Base — AI Brain', exact: true })).toBeVisible();
  await expect(page.getByRole('heading', { name: 'What Are We Actually Testing? Technical Interviews in the AI-Assisted Era', exact: true })).toBeVisible();
  await expect(page.getByRole('link', { name: 'View all six working papers' })).toBeVisible();
  await expect(page.getByText('457', { exact: true })).toHaveCount(0);
  await expect(page.getByText('200+', { exact: true })).toHaveCount(0);
});

test('writing index lists six papers and a separate roadmap', async ({ page }) => {
  await page.goto('/blogs/');
  await expect(page.locator('.blog-card')).toHaveCount(6);
  await expect(page.locator('.paper-roadmap-item')).toHaveCount(4);
  await expect(page.getByRole('heading', { name: 'What Are We Actually Testing? Technical Interviews in the AI-Assisted Era' })).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Metric Contracts for Decision-Grade Analytics' })).toBeVisible();
  await expect(page.getByRole('heading', { name: 'From Variance to Decision' })).toBeVisible();
  await expect(page.getByRole('heading', { name: 'AI Proposes, Deterministic Systems Decide' })).toBeVisible();
});

test('AI-era interview paper preserves the measurement-design thesis', async ({ page }) => {
  await page.goto('/blogs/technical-interviews-in-the-ai-assisted-era.html', { waitUntil: 'domcontentloaded' });
  const main = page.locator('main.blog-article');
  await expect(main).toContainText('AI policy is measurement design');
  await expect(main).toContainText('Four interview modes');
  await expect(main).toContainText('A staged interview design');
  await expect(main).toContainText('The company’s data posture belongs in the interview');
  await expect(main).toContainText('what to build, why it matters, how to evaluate it');
  await expect(page.locator('table.paper-framework')).toHaveCount(2);
  await expect(page.locator('.paper-references li')).toHaveCount(6);
  await expect(page.locator('.paper-byline')).toContainText('August 13, 2026');
});

test('AI Brain case study preserves the active-scaffold boundary', async ({ page }) => {
  await page.goto('/projects/governed-ai-brain.html', { waitUntil: 'domcontentloaded' });
  const main = page.locator('main.case-study-wrap');
  await expect(main).toContainText('Active scaffold');
  await expect(main).toContainText('The REST API is the product and platform backend');
  await expect(main).toContainText('The MCP server is a thin adapter');
  await expect(main).toContainText('in-memory store');
  await expect(main).toContainText('Obsidian-style relationship graph');

  const diagram = page.locator('#flow-ai-brain');
  await expect(diagram).toHaveAttribute('data-content-reviewed', '2026-08-12');
  await expect(diagram.getByText('Context-pack builder', { exact: true })).toBeVisible();
  await expect(diagram.getByRole('button', { name: 'Pause animation' })).toHaveAttribute('aria-pressed', 'false');
});

test('Mangrok case study reflects the current Alchemy scope', async ({ page }) => {
  await page.goto('/projects/mangrok-recipe-vault.html', { waitUntil: 'domcontentloaded' });
  await expect(page.locator('main.case-study-wrap')).toContainText('Explainable Alchemy Lab');
  await expect(page.locator('main.case-study-wrap')).toContainText('three Edge Functions');
  const diagram = page.locator('#flow-mangrok');
  await expect(diagram).toHaveAttribute('data-content-reviewed', '2026-08-12', { timeout: 8_000 });
  await expect(diagram.getByText('Alchemy Lab interface', { exact: true })).toBeVisible();
});

test('below-fold content remains readable before scrolling', async ({ page }) => {
  await page.goto('/', { waitUntil: 'domcontentloaded' });
  const entry = page.locator('#writing .writing-entry').first();
  await expect(entry).toHaveCount(1);
  const opacity = await entry.evaluate(node => Number.parseFloat(getComputedStyle(node).opacity));
  expect(opacity).toBe(1);
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

test('attach homepage, paper index, AI-era paper, Mangrok, and AI Brain screenshots', async ({ page }, testInfo) => {
  for (const [route, name, locator] of [
    ['/', 'homepage-full', null],
    ['/blogs/', 'working-papers-full', null],
    ['/blogs/technical-interviews-in-the-ai-assisted-era.html', 'ai-era-interview-paper', null],
    ['/projects/mangrok-recipe-vault.html', 'mangrok-current', '.flow-showcase'],
    ['/projects/governed-ai-brain.html', 'governed-ai-brain', '.flow-showcase']
  ]) {
    await page.goto(route, { waitUntil: 'domcontentloaded' });
    const path = testInfo.outputPath(`${name}.png`);
    if (locator) {
      const target = page.locator(locator);
      await expect(target).toBeVisible({ timeout: 8_000 });
      await target.scrollIntoViewIfNeeded();
      const pause = target.getByRole('button', { name: 'Pause animation' });
      if (await pause.count()) await pause.click();
      const stickyHeader = page.locator('.site-header');
      if (await stickyHeader.count()) await stickyHeader.evaluate(node => { node.style.display = 'none'; });
      await target.screenshot({ path, animations: 'disabled' });
    } else {
      await page.screenshot({ path, fullPage: true, animations: 'disabled' });
    }
    await testInfo.attach(`${name}-${testInfo.project.name}`, { path, contentType: 'image/png' });
  }
});
