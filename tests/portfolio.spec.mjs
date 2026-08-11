import { test, expect } from '@playwright/test';

const publicRoutes = [
  '/',
  '/projects/mangrok-recipe-vault.html',
  '/projects/where-it-happened.html',
  '/projects/my-seventh-meal.html',
  '/projects/mlops-solution-accelerator.html',
  '/projects/agentic-knowledge-runtime.html',
  '/blogs/',
  '/blogs/ai-powered-vs-ai-generated.html',
  '/blogs/neurodivergent-ai-architect.html'
];

for (const route of publicRoutes) {
  test(`${route} loads with a stable document structure`, async ({ page }) => {
    const pageErrors = [];
    page.on('pageerror', (error) => pageErrors.push(error.message));

    const response = await page.goto(route, { waitUntil: 'domcontentloaded' });

    expect(response, `No navigation response for ${route}`).not.toBeNull();
    expect(response.ok(), `${route} returned ${response.status()}`).toBeTruthy();
    await expect(page.locator('main')).toBeVisible();
    await expect(page.locator('h1')).toHaveCount(1);
    await expect(page).toHaveTitle(/\S+/);
    expect(pageErrors).toEqual([]);

    const horizontalOverflow = await page.evaluate(() =>
      Math.max(0, document.documentElement.scrollWidth - document.documentElement.clientWidth)
    );
    expect(horizontalOverflow, `${route} has document-level horizontal overflow`).toBeLessThanOrEqual(2);
  });
}

test('homepage communicates implementation state without conflating maturity', async ({ page }) => {
  await page.goto('/');

  await expect(page.getByRole('heading', { level: 1 })).toContainText('data, AI, and trust');
  await expect(page.getByText('Source complete', { exact: true })).toBeVisible();
  await expect(page.getByText('Live storefront', { exact: true })).toBeVisible();
  await expect(page.getByText('Architecture & validation', { exact: true })).toBeVisible();
  await expect(page.locator('[data-category]:not([hidden])')).toHaveCount(5);
});

test('project filters expose the intended project groups', async ({ page }) => {
  await page.goto('/');

  await page.getByRole('button', { name: 'AI & ML platforms' }).click();
  await expect(page.locator('[data-category~="platform"]:not([hidden])')).toHaveCount(2);
  await expect(page.locator('[data-category~="product"]:not([hidden])')).toHaveCount(0);

  await page.getByRole('button', { name: 'Product apps' }).click();
  await expect(page.locator('[data-category~="product"]:not([hidden])')).toHaveCount(3);
  await expect(page.locator('[data-category~="platform"]:not([hidden])')).toHaveCount(0);

  await page.getByRole('button', { name: 'All work' }).click();
  await expect(page.locator('[data-category]:not([hidden])')).toHaveCount(5);
});

test('theme choice persists across reloads', async ({ page }) => {
  await page.goto('/');

  const root = page.locator('html');
  const initialTheme = await root.getAttribute('data-theme');
  expect(['light', 'dark']).toContain(initialTheme);

  await page.getByRole('button', { name: /Use (?:light|dark) mode/ }).click();
  const toggledTheme = await root.getAttribute('data-theme');
  expect(toggledTheme).toBe(initialTheme === 'dark' ? 'light' : 'dark');

  await page.reload();
  await expect(root).toHaveAttribute('data-theme', toggledTheme);
});

test('legacy homepage hashes route visitors to the replacement sections', async ({ page }) => {
  await page.goto('/#impact');
  await page.waitForTimeout(100);

  const top = await page.locator('#capabilities').evaluate((element) =>
    Math.abs(element.getBoundingClientRect().top)
  );
  expect(top).toBeLessThan(180);
});

test('homepage provides keyboard and landmark fundamentals', async ({ page }) => {
  await page.goto('/');

  await expect(page.locator('.skip-link')).toHaveAttribute('href', '#main-content');
  await expect(page.locator('#main-content')).toHaveCount(1);
  await expect(page.getByRole('navigation', { name: 'Primary navigation' })).toBeVisible();

  const unnamedButtons = await page.locator('button').evaluateAll((buttons) =>
    buttons
      .filter((button) => {
        const label = button.getAttribute('aria-label') || button.textContent || '';
        return !label.trim();
      })
      .length
  );
  expect(unnamedButtons).toBe(0);
});

test('attach full-page homepage screenshots for review', async ({ page }, testInfo) => {
  await page.goto('/', { waitUntil: 'domcontentloaded' });
  const screenshotPath = testInfo.outputPath('homepage-full.png');

  await page.screenshot({
    path: screenshotPath,
    fullPage: true,
    animations: 'disabled'
  });
  await testInfo.attach(`homepage-${testInfo.project.name}`, {
    path: screenshotPath,
    contentType: 'image/png'
  });
});
