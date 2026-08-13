import { test, expect } from '@playwright/test';

const renderedCopy = [
  ['/blogs/technical-interviews-in-the-ai-assisted-era.html', 'The real decision is what the company wants to measure'],
  ['/blogs/metric-contracts-for-decision-grade-analytics.html', 'The definition has to exist before the chart'],
  ['/blogs/from-variance-to-decision.html', 'The analysis should end with a supported next question'],
  ['/blogs/ai-proposes-deterministic-systems-decide.html', 'The model can reduce ambiguity'],
  ['/blogs/ai-powered-vs-ai-generated.html', 'A polished output can be useful without proving that the surrounding workflow or system is reliable'],
  ['/blogs/neurodivergent-ai-architect.html', 'This is a personal operating note'],
  ['/projects/mangrok-recipe-vault.html', 'I built Mangrok around a simple problem'],
  ['/projects/where-it-happened.html', 'I built this to test how far a static site could go as a real product'],
  ['/projects/my-seventh-meal.html', 'A photo can suggest what is on a plate'],
  ['/projects/governed-ai-brain.html', 'I started this because connecting a model to a folder of documents does not create a trustworthy organizational memory'],
  ['/projects/mlops-solution-accelerator.html', 'I built one reusable pipeline instead of repeating the same training setup for every dataset'],
  ['/projects/agentic-knowledge-runtime.html', 'I built this because a useful research answer needs more than a strong prompt']
];

for (const [route, expectedCopy] of renderedCopy) {
  test(`${route} renders the direct editorial voice`, async ({ page }) => {
    await page.goto(route, { waitUntil: 'domcontentloaded' });
    await expect(page.locator('.site-header')).toBeVisible({ timeout: 8_000 });
    await expect(page.getByRole('navigation', { name: 'Primary navigation' })).toBeVisible();
    await expect(page.locator('main')).toContainText(expectedCopy, { timeout: 8_000 });
  });
}

test('rendered public copy avoids the highest-signal template phrases', async ({ page }) => {
  const blocked = [
    'this paper proposes',
    'this paper presents',
    'the more useful question',
    'it is important to note',
    'serves as a testament',
    'stands as',
    'in today’s rapidly evolving'
  ];

  for (const [route] of renderedCopy) {
    await page.goto(route, { waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(250);
    const text = (await page.locator('main').innerText()).toLowerCase();
    for (const phrase of blocked) expect(text, `${route} contains ${phrase}`).not.toContain(phrase);
  }
});
