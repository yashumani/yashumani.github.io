import {test,expect} from '@playwright/test';

test.describe('Gita Sadhana complete publication',()=>{
  test.setTimeout(180_000);

  test('renders the full published listening site',async({page})=>{
    const errors=[];const failed=[];
    page.on('pageerror',error=>errors.push(error.message));
    page.on('response',response=>{if(response.status()>=400)failed.push(`${response.status()} ${response.url()}`)});
    await page.goto('/gita-sadhana/',{waitUntil:'domcontentloaded'});
    await expect(page.locator('#top-progress-label')).toHaveText('701 / 701');
    await expect(page.locator('#next-verse')).toHaveText('Complete');
    await expect(page.locator('#progress-message')).toContainText('published');
    await expect(page.locator('#lesson-status')).toHaveText('701 of 701 published lessons shown',{timeout:120_000});
    await expect(page.locator('article.lesson-card')).toHaveCount(701);
    await expect(page.locator('#bg-18-078')).toHaveCount(1);
    await expect(page.locator('#chapter-progress-summary')).toHaveText('All eighteen chapters are complete.');
    await page.locator('#chapter-filter').selectOption('13');
    await expect(page.locator('article.lesson-card')).toHaveCount(35);
    await page.locator('#lesson-search').fill('13.35');
    await expect(page.locator('article.lesson-card')).toHaveCount(1);
    expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);
    expect(errors).toEqual([]);expect(failed).toEqual([]);
  });

  test('offers a searchable published archive and final verse',async({page})=>{
    const errors=[];const failed=[];
    page.on('pageerror',error=>errors.push(error.message));
    page.on('response',response=>{if(response.status()>=400)failed.push(`${response.status()} ${response.url()}`)});
    await page.goto('/gita-sadhana/complete.html',{waitUntil:'domcontentloaded'});
    await expect(page.locator('#status')).toHaveText('701/701 published lessons.',{timeout:120_000});
    await page.locator('#chapter').selectOption('18');
    await expect(page.locator('#lessons article')).toHaveCount(78);
    await page.locator('#search').fill('18.78');
    await expect(page.locator('#lessons article')).toHaveCount(1);
    await expect(page.locator('#lessons article h2')).toContainText('Bhagavad Gita 18.78');
    expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);
    expect(errors).toEqual([]);expect(failed).toEqual([]);
  });
});
