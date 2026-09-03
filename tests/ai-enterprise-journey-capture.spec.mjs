import { test, expect } from '@playwright/test';
import { mkdir, writeFile } from 'node:fs/promises';

const sourceUrl = 'https://ai-enterprise-journey-2026.yashumani.chatgpt.site';

test('capture the public AI Enterprise Journey page for source review', async ({ page }) => {
  const response = await page.goto(sourceUrl, { waitUntil: 'networkidle', timeout: 90_000 });
  expect(response).not.toBeNull();
  expect(response.ok(), `source returned ${response.status()}`).toBeTruthy();

  await mkdir('test-results', { recursive: true });
  const snapshot = await page.evaluate(() => ({
    title: document.title,
    description: document.querySelector('meta[name="description"]')?.getAttribute('content') || '',
    headings: Array.from(document.querySelectorAll('h1, h2, h3')).map(node => node.textContent?.trim()).filter(Boolean),
    text: document.body.innerText,
    links: Array.from(document.querySelectorAll('a[href]')).map(link => ({
      text: link.textContent?.trim() || '',
      href: link.href
    }))
  }));

  await writeFile('test-results/ai-enterprise-journey.json', JSON.stringify(snapshot, null, 2));
  await page.screenshot({ path: 'test-results/ai-enterprise-journey.png', fullPage: true });
  expect(snapshot.text.length).toBeGreaterThan(200);
});
