import { test, expect } from '@playwright/test';

const journeyUrl = 'https://ai-enterprise-journey-2026.yashumani.chatgpt.site';

for (const viewport of [
  { name: 'desktop', width: 1440, height: 1000 },
  { name: 'mobile', width: 390, height: 844 }
]) {
  test(`profile highlights preserve order, evidence, and boundaries on ${viewport.name}`, async ({ page }) => {
    await page.setViewportSize({ width: viewport.width, height: viewport.height });
    await page.goto('/', { waitUntil: 'domcontentloaded' });

    const section = page.locator('#profile-highlights');
    await expect(section).toBeVisible({ timeout: 8_000 });
    const highlights = section.locator('[data-profile-highlight]');
    await expect(highlights).toHaveCount(2);
    await expect(highlights.nth(0)).toHaveAttribute('data-profile-highlight', 'dq-check');
    await expect(highlights.nth(1)).toHaveAttribute('data-profile-highlight', 'ai-enterprise-journey');

    const journey = highlights.nth(1);
    await expect(highlights.nth(0).getByRole('heading', { name: 'DQ Check Platform' })).toBeVisible();
    await expect(journey.getByRole('heading', { name: 'AI Enterprise Conference — Field Report' })).toBeVisible();
    await expect(journey.getByRole('link', { name: 'Open field report' })).toHaveAttribute('href', journeyUrl);
    await expect(journey.getByRole('link', { name: 'Read key learnings' })).toHaveAttribute('href', journeyUrl + '#learning');
    await expect(journey.getByRole('link', { name: 'Explore notes & diagrams' })).toHaveAttribute('href', journeyUrl + '#evidence');

    const evidence = journey.getByRole('list', { name: 'Conference field report contents' });
    await expect(evidence).toContainText('20');
    await expect(evidence).toContainText('Visual reconstructions');
    await expect(evidence).toContainText('4');
    await expect(evidence).toContainText('Field-note pages');
    await expect(evidence).toContainText('10');
    await expect(evidence).toContainText('Questions researched');

    await expect(journey).toContainText('booth conversations');
    await expect(journey).toContainText('How AI Pays for AI');
    await expect(journey).toContainText('governed BI and analytics');
    await expect(journey).toContainText('Independent learning project');
    await expect(journey).toContainText('not official conference materials or employer work');

    const profileText = await page.locator('main').innerText();
    expect(profileText).not.toMatch(/\bgita\b/i);

    const overflow = await page.evaluate(() => Math.max(0, document.documentElement.scrollWidth - document.documentElement.clientWidth));
    expect(overflow).toBeLessThanOrEqual(2);
  });
}
