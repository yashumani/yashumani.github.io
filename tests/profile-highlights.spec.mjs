import { test, expect } from '@playwright/test';

const journeyUrl = 'https://ai-enterprise-journey-2026.yashumani.chatgpt.site';

for (const viewport of [
  { name: 'desktop', width: 1440, height: 1000 },
  { name: 'mobile', width: 390, height: 844 }
]) {
  test(`profile highlights preserve order and boundaries on ${viewport.name}`, async ({ page }) => {
    await page.setViewportSize({ width: viewport.width, height: viewport.height });
    await page.goto('/', { waitUntil: 'domcontentloaded' });

    const section = page.locator('#profile-highlights');
    await expect(section).toBeVisible({ timeout: 8_000 });
    const highlights = section.locator('[data-profile-highlight]');
    await expect(highlights).toHaveCount(2);
    await expect(highlights.nth(0)).toHaveAttribute('data-profile-highlight', 'dq-check');
    await expect(highlights.nth(1)).toHaveAttribute('data-profile-highlight', 'ai-enterprise-journey');

    await expect(highlights.nth(0).getByRole('heading', { name: 'DQ Check Platform' })).toBeVisible();
    await expect(highlights.nth(1).getByRole('heading', { name: 'AI Enterprise Journey 2026' })).toBeVisible();
    await expect(highlights.nth(1).getByRole('link', { name: 'Open interactive journey' })).toHaveAttribute('href', journeyUrl);
    await expect(highlights.nth(1)).toContainText('No additional employer or project claims are imported');
    await expect(highlights.nth(1)).toContainText('External hosting and availability are managed separately');

    const profileText = await page.locator('main').innerText();
    expect(profileText).not.toMatch(/\bgita\b/i);

    const overflow = await page.evaluate(() => Math.max(0, document.documentElement.scrollWidth - document.documentElement.clientWidth));
    expect(overflow).toBeLessThanOrEqual(2);
  });
}
