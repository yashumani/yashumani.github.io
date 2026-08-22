import { test, expect } from '@playwright/test';

export const paperRoutes = [
  '/blogs/technical-interviews-in-the-ai-assisted-era.html',
  '/blogs/metric-contracts-for-decision-grade-analytics.html',
  '/blogs/from-variance-to-decision.html',
  '/blogs/ai-proposes-deterministic-systems-decide.html',
  '/blogs/ai-powered-vs-ai-generated.html',
  '/blogs/neurodivergent-ai-architect.html'
];

export const projectRoutes = [
  '/projects/mangrok-recipe-vault.html',
  '/projects/where-it-happened.html',
  '/projects/my-seventh-meal.html',
  '/projects/dq-check-platform.html',
  '/projects/governed-ai-brain.html',
  '/projects/agentic-harness-builder.html',
  '/projects/mlops-solution-accelerator.html',
  '/projects/agentic-knowledge-runtime.html'
];

const publicRoutes = ['/', '/blogs/', ...projectRoutes, ...paperRoutes];

for (const route of publicRoutes) {
  test(`${route} loads without page errors or document overflow`, async ({ page }) => {
    const errors = [];
    page.on('pageerror', error => errors.push(error.message));
    const response = await page.goto(route, { waitUntil: 'domcontentloaded' });
    expect(response).not.toBeNull();
    expect(response.ok(), `${route} returned ${response.status()}`).toBeTruthy();
    await expect(page.locator('main')).toBeVisible();
    await expect(page.locator('h1')).toHaveCount(1);
    await page.waitForTimeout(350);
    expect(errors).toEqual([]);
    const overflow = await page.evaluate(() => Math.max(0, document.documentElement.scrollWidth - document.documentElement.clientWidth));
    expect(overflow, `${route} has horizontal overflow`).toBeLessThanOrEqual(2);
  });
}

for (const route of projectRoutes) {
  test(`${route} has readable sections and attributed sources`, async ({ page }) => {
    await page.goto(route, { waitUntil: 'domcontentloaded' });
    const firstHeading = page.locator('main.case-study-wrap > h2.case-section-heading').first();
    await expect(firstHeading).toBeVisible({ timeout: 8_000 });
    await expect(firstHeading.locator('.case-section-number')).toHaveText(/\d{2}/);
    const gap = await firstHeading.evaluate(node => Number.parseFloat(getComputedStyle(node).columnGap));
    expect(gap).toBeGreaterThan(0);
    await expect(page.locator('.case-toc')).toBeVisible();
    const reviewDate = route.endsWith('/agentic-harness-builder.html')
      ? 'August 21, 2026'
      : 'August 13, 2026';
    await expect(page.locator('.case-review-stamp')).toContainText(reviewDate, { timeout: 8_000 });
    await expect(page.locator('.source-attribution-section')).toBeVisible({ timeout: 8_000 });
    await expect(page.locator('.project-origin-note')).toContainText('not invention of the underlying concepts');
    expect(await page.locator('.project-references a').count()).toBeGreaterThanOrEqual(2);
  });
}

for (const route of paperRoutes) {
  test(`${route} has revision metadata and an attribution boundary`, async ({ page }) => {
    await page.goto(route, { waitUntil: 'domcontentloaded' });
    await expect(page.locator('main[data-paper-status="published"]')).toBeVisible();
    await expect(page.locator('.paper-byline')).toContainText('Last reviewed');
    const heading = page.locator('main > h2.case-section-heading').first();
    await expect(heading.locator('.case-section-number')).toHaveText('01');
    await expect(page.locator('.case-toc')).toBeVisible();
    await expect(page.locator('.paper-references')).toBeVisible();
    await expect(page.locator('.paper-source-boundary')).toContainText('External references establish', { timeout: 8_000 });
  });
}
