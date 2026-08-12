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

const projectRoutes = [
  '/projects/mangrok-recipe-vault.html',
  '/projects/where-it-happened.html',
  '/projects/my-seventh-meal.html',
  '/projects/mlops-solution-accelerator.html',
  '/projects/agentic-knowledge-runtime.html'
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

for (const route of projectRoutes) {
  test(`${route} exposes system architecture and animated logic, code, and data flows`, async ({ page }) => {
    await page.goto(route, { waitUntil: 'domcontentloaded' });

    const diagram = page.locator('.flow-showcase');
    await expect(diagram).toBeVisible({ timeout: 8_000 });
    await diagram.scrollIntoViewIfNeeded();

    await expect(diagram.locator('.architecture-overview')).toBeVisible();
    await expect(diagram.locator('.architecture-stage')).toHaveCount(4);
    await expect(diagram.locator('.architecture-node')).toHaveCount(16);
    await expect(diagram.locator('.flow-lane:not([hidden])')).toHaveCount(3);
    await expect(diagram.getByRole('button', { name: 'Pause animation' })).toHaveAttribute('aria-pressed', 'false');

    const firstFlowStep = await diagram.locator('.flow-step.is-current h4').first().textContent();
    const firstArchitectureStage = await diagram.locator('.architecture-stage.is-current h3').first().textContent();
    await page.waitForTimeout(1_550);
    const nextFlowStep = await diagram.locator('.flow-step.is-current h4').first().textContent();
    const nextArchitectureStage = await diagram.locator('.architecture-stage.is-current h3').first().textContent();
    expect(nextFlowStep).not.toBe(firstFlowStep);
    expect(nextArchitectureStage).not.toBe(firstArchitectureStage);

    await diagram.getByRole('button', { name: 'Code flow' }).click();
    await expect(diagram.locator('.flow-lane[data-flow-kind="code"]')).toBeVisible();
    await expect(diagram.locator('.flow-lane:not([hidden])')).toHaveCount(1);
    await expect(diagram.locator('.architecture-stage')).toHaveCount(4);

    await diagram.getByRole('button', { name: 'Pause animation' }).click();
    await expect(diagram.getByRole('button', { name: 'Play animation' })).toHaveAttribute('aria-pressed', 'true');

    const horizontalOverflow = await page.evaluate(() =>
      Math.max(0, document.documentElement.scrollWidth - document.documentElement.clientWidth)
    );
    expect(horizontalOverflow, `${route} architecture diagram causes horizontal overflow`).toBeLessThanOrEqual(2);
  });
}

test('homepage uses profile-level metrics and keeps project titles primary', async ({ page }) => {
  await page.goto('/');

  await expect(page.getByRole('heading', { level: 1 })).toContainText('data, AI, and trust');
  await expect(page.locator('.profile-metrics article')).toHaveCount(4);
  await expect(page.getByText('showcased systems', { exact: true })).toBeVisible();
  await expect(page.getByText('technologies represented', { exact: true })).toBeVisible();
  await expect(page.getByText('core disciplines', { exact: true })).toBeVisible();
  await expect(page.getByText('published working papers', { exact: true })).toBeVisible();

  await expect(page.locator('.work-entry')).toHaveCount(5);
  for (const title of [
    'Mangrok Recipe Vault',
    'Where It Happened',
    'My Seventh Meal',
    'Automated ML Pipeline Platform',
    'Agentic Knowledge & Research Runtime'
  ]) {
    await expect(page.getByRole('heading', { name: title, exact: true })).toBeVisible();
  }

  await expect(page.getByText('457', { exact: true })).toHaveCount(0);
  await expect(page.getByText('200+', { exact: true })).toHaveCount(0);
  await expect(page.locator('.filter-bar')).toHaveCount(0);
});

test('homepage exposes organized skill groups without hiding content', async ({ page }) => {
  await page.goto('/');
  await expect(page.locator('.skill-group')).toHaveCount(4);
  await expect(page.locator('.work-entry[hidden]')).toHaveCount(0);
  await expect(page.getByText('Product & experience', { exact: true })).toBeVisible();
  await expect(page.getByText('Data & backend', { exact: true })).toBeVisible();
  await expect(page.getByText('Applied AI & ML', { exact: true })).toBeVisible();
  await expect(page.getByText('Trust, quality & orchestration', { exact: true })).toBeVisible();
});

test('scroll reveal enhancement resolves content as it enters the viewport', async ({ page }) => {
  await page.goto('/');
  const writing = page.locator('#writing');
  await writing.scrollIntoViewIfNeeded();
  await expect(writing.locator('.writing-entry').first()).toBeVisible();
  await expect(writing.locator('.writing-entry').first()).toHaveClass(/in/);
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
    buttons.filter((button) => {
      const label = button.getAttribute('aria-label') || button.textContent || '';
      return !label.trim();
    }).length
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

test('attach Mangrok architecture and animated flow screenshot for review', async ({ page }, testInfo) => {
  await page.goto('/projects/mangrok-recipe-vault.html', { waitUntil: 'domcontentloaded' });
  const diagram = page.locator('.flow-showcase');
  await expect(diagram).toBeVisible({ timeout: 8_000 });
  await diagram.scrollIntoViewIfNeeded();
  await diagram.getByRole('button', { name: 'Pause animation' }).click();

  const screenshotPath = testInfo.outputPath('mangrok-architecture-flow.png');
  await diagram.screenshot({ path: screenshotPath, animations: 'disabled' });
  await testInfo.attach(`mangrok-architecture-flow-${testInfo.project.name}`, {
    path: screenshotPath,
    contentType: 'image/png'
  });
});
