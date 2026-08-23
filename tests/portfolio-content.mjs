import { test, expect } from '@playwright/test';
import { projectRoutes } from './portfolio-routes.mjs';

const animatedRoutes = projectRoutes.filter(route => !route.endsWith('/dq-check-platform.html'));

for (const route of animatedRoutes) {
  test(`${route} retains the interactive architecture`, async ({ page }) => {
    await page.goto(route, { waitUntil: 'domcontentloaded' });
    const diagram = page.locator('.flow-showcase');
    await expect(diagram).toBeVisible({ timeout: 8_000 });
    await expect(diagram.locator('.architecture-stage')).toHaveCount(4);
    await expect(diagram.locator('.architecture-node')).toHaveCount(16);
    await expect(diagram.locator('.flow-lane:not([hidden])')).toHaveCount(3);
  });
}

test('homepage lists eight systems and keeps profile-level metrics', async ({ page }) => {
  await page.goto('/', { waitUntil: 'domcontentloaded' });
  await expect(page.locator('.work-entry')).toHaveCount(8, { timeout: 8_000 });
  const systemMetric = page.locator('.profile-metrics article').filter({ hasText: 'showcased systems' }).locator('strong');
  await expect(systemMetric).toHaveText('8');
  await expect(page.getByRole('heading', { name: 'DQ Check Platform', exact: true })).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Unified Knowledge Base — AI Brain', exact: true })).toBeVisible();
  await expect(page.getByRole('heading', { name: 'HarnessLab — Agentic Harness Builder', exact: true })).toBeVisible();
  await expect(page.getByText('457', { exact: true })).toHaveCount(0);
  await expect(page.getByText('200+', { exact: true })).toHaveCount(0);
});

test('homepage adds a source-labeled resume section and navigation', async ({ page }) => {
  await page.goto('/', { waitUntil: 'domcontentloaded' });
  await expect(page.getByRole('link', { name: 'Resume', exact: true })).toHaveAttribute('href', 'resume.html');
  const section = page.locator('#resume');
  await expect(section).toBeVisible({ timeout: 8_000 });
  await expect(section).toContainText('Senior Manager · Business Intelligence · Data Analytics');
  await expect(section).toContainText('Resume history through March 2023');
  await expect(section).toContainText('Eight independent systems');
  await expect(section.getByRole('link', { name: 'View resume and professional direction' })).toHaveAttribute('href', 'resume.html');
  await expect(section.getByRole('link', { name: 'Open professional presentation' })).toHaveAttribute('href', 'professional-profile.html');
  await expect(page.locator('#writing .section-index')).toHaveText('04 / Working papers');
});

test('resume page separates career history, current title, and portfolio evidence', async ({ page }) => {
  await page.goto('/resume.html', { waitUntil: 'domcontentloaded' });
  const main = page.locator('main');
  await expect(main).toContainText('Drawn from the resume file last modified March 4, 2023.');
  await expect(main).toContainText('Senior Manager, Business Intelligence and Data Analytics');
  await expect(main).toContainText('kept separate from employment history');
  await expect(main).toContainText('Business Data Analyst I');
  await expect(main).toContainText('Technical Support Associate, Tier 1');
  await expect(main).toContainText('Data Analytics and Business Statistics');
  await expect(page.locator('.resume-project')).toHaveCount(8);
  await expect(page.getByRole('link', { name: 'Open professional presentation' })).toHaveAttribute('href', 'professional-profile.html');
  await expect(page.getByRole('link', { name: 'Open presentation' })).toHaveAttribute('href', 'professional-profile.html');
  await expect(page.locator('body')).not.toContainText('+1 (929) 413-5472');
  await expect(page.locator('body')).not.toContainText('929-413-5472');
});

test('resume page remains readable on mobile and keeps the presentation visible', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/resume.html', { waitUntil: 'domcontentloaded' });
  await expect(page.locator('.resume-source-card')).toBeVisible();
  await expect(page.locator('.resume-role').first()).toBeVisible();
  await expect(page.getByRole('link', { name: 'Open professional presentation' })).toBeVisible();
  const overflow = await page.evaluate(() => Math.max(0, document.documentElement.scrollWidth - document.documentElement.clientWidth));
  expect(overflow).toBeLessThanOrEqual(2);
});

test('professional presentation has fifteen source-labeled slides and working controls', async ({ page }) => {
  await page.goto('/professional-profile.html', { waitUntil: 'domcontentloaded' });
  await expect(page.locator('[data-slide]')).toHaveCount(15);
  await expect(page.locator('[data-slide]:not([hidden])')).toHaveCount(1);
  await expect(page.locator('[data-presentation-status]')).toHaveText('Slide 1 of 15');
  await expect(page.locator('.presentation-source-note')).toContainText('March 4, 2023 resume snapshot');
  await expect(page.locator('body')).toContainText('Eight independent systems used as technical evidence');
  await expect(page.locator('body')).toContainText('The goal is not to add AI everywhere. The goal is to make useful work easier.');
  await expect(page.locator('body')).not.toContainText('+1 (929) 413-5472');

  await page.getByRole('button', { name: 'Next' }).click();
  await expect(page.locator('[data-presentation-status]')).toHaveText('Slide 2 of 15');
  await expect(page).toHaveURL(/#slide-2$/);
  await page.keyboard.press('End');
  await expect(page.locator('[data-presentation-status]')).toHaveText('Slide 15 of 15');
  await expect(page.getByRole('heading', { name: 'What I am working toward' })).toBeVisible();
});

test('professional presentation is usable at a phone viewport', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/professional-profile.html#slide-10', { waitUntil: 'domcontentloaded' });
  await expect(page.locator('[data-presentation-status]')).toHaveText('Slide 10 of 15');
  await expect(page.locator('[data-slide]:not([hidden])')).toBeVisible();
  await expect(page.getByRole('button', { name: 'Previous' })).toBeVisible();
  await expect(page.getByRole('button', { name: 'Next' })).toBeVisible();
  const overflow = await page.evaluate(() => Math.max(0, document.documentElement.scrollWidth - document.documentElement.clientWidth));
  expect(overflow).toBeLessThanOrEqual(2);
});

test('DQ Check states its analytical, privacy, scale, and production boundaries', async ({ page }) => {
  await page.goto('/projects/dq-check-platform.html', { waitUntil: 'domcontentloaded' });
  const main = page.locator('main.case-study-wrap');
  await expect(main).toContainText('association and attribution, not proof of causation');
  await expect(main).toContainText('current browser session');
  await expect(main).toContainText('25 MB and 100,000 rows');
  await expect(main).toContainText('Accuracy and referential integrity require trusted reference data');
  await expect(page.locator('.architecture-flow .architecture-node')).toHaveCount(6);
  await expect(page.locator('.case-links-top a')).toHaveCount(3, { timeout: 8_000 });
  await expect(page.getByRole('link', { name: 'Open live prototype' })).toBeVisible();
  await expect(page.getByRole('link', { name: 'View repository' })).toBeVisible();
});

test('HarnessLab states its executed worker and roadmap boundaries', async ({ page }) => {
  await page.goto('/projects/agentic-harness-builder.html', { waitUntil: 'domcontentloaded' });
  const main = page.locator('main.case-study-wrap');
  await expect(main).toContainText('One worker. One provider call. No tools. No child agents. No external actions.');
  await expect(main).toContainText('does not execute MCP tools, A2A peers, arbitrary code');
  await expect(main).toContainText('not encrypted cloud storage or cross-device synchronization');
  await expect(main).toContainText('Roadmap, not current-state claims');
  await expect(page.locator('.flow-showcase .architecture-stage')).toHaveCount(4);
  await expect(page.locator('.flow-showcase .architecture-node')).toHaveCount(16);
  await expect(page.locator('.flow-showcase .flow-lane:not([hidden])')).toHaveCount(3);
  await expect(page.locator('.case-links-top a')).toHaveCount(3, { timeout: 8_000 });
  await expect(page.getByRole('link', { name: 'Open live application' })).toBeVisible();
  await expect(page.getByRole('link', { name: 'View repository' })).toBeVisible();
});

test('project actions are promoted above the first case-study section', async ({ page }) => {
  await page.goto('/projects/where-it-happened.html', { waitUntil: 'domcontentloaded' });
  const actions = page.locator('.case-links-top');
  await expect(actions).toBeVisible({ timeout: 8_000 });
  await expect(page.getByRole('link', { name: 'Resume', exact: true })).toHaveAttribute('href', '../resume.html');
  const order = await page.evaluate(() => {
    const main = document.querySelector('main.case-study-wrap');
    const action = main?.querySelector('.case-links-top');
    const section = main?.querySelector(':scope > h2');
    if (!main || !action || !section) return null;
    return [Array.from(main.children).indexOf(action), Array.from(main.children).indexOf(section)];
  });
  expect(order).not.toBeNull();
  expect(order[0]).toBeLessThan(order[1]);
});

test('theme persistence and legacy homepage hashes remain intact', async ({ page }) => {
  await page.goto('/');
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
});
