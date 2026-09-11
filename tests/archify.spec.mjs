import { test, expect } from '@playwright/test';
import fs from 'node:fs';
const catalog=JSON.parse(fs.readFileSync('architecture/catalog.json','utf8'));

test('architecture atlas is searchable and excludes unrelated work',async({page},info)=>{
 await page.goto('/architecture/');
 await expect(page.locator('[data-atlas-card]')).toHaveCount(9);
 await expect(page.locator('.atlas-map-links a')).toHaveCount(36);
 await expect(page.locator('main')).not.toContainText(/\bGITA\b/i);
 await page.getByRole('searchbox',{name:'Find a system'}).fill('Harness');
 await expect(page.locator('[data-atlas-card]:not([hidden])')).toHaveCount(1);
 await page.getByRole('searchbox').fill('');
 expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);
 await page.screenshot({path:info.outputPath('atlas.png'),fullPage:true});
});
for(const p of catalog.projects){
 test(`${p.id}: four source-backed views, keyboard tabs and one preview`,async({page},info)=>{
  await page.emulateMedia({reducedMotion:'reduce'});
  await page.goto('/projects/'+p.slug);
  const host=page.locator('[data-archify-project]');
  await expect(host).toBeVisible();await host.scrollIntoViewIfNeeded();
  await expect(host.locator('[role=tab]')).toHaveCount(4);
  await expect(host.locator('.archify-scope')).toHaveText(p.scope);
  await host.locator('[role=tab]').first().focus();await page.keyboard.press('ArrowRight');
  await expect(host.locator('[role=tab]').nth(1)).toHaveAttribute('aria-selected','true');
  await expect(host.locator('[data-archify-open]')).toHaveAttribute('href',new RegExp(p.id+'-logic.html$'));
  if(await host.locator('[data-archify-load]').isVisible())await host.locator('[data-archify-load]').click();
  await expect(host.locator('iframe')).toHaveCount(1);
  await expect(host.locator('iframe')).toHaveAttribute('src',/logic.html\?embed=1&theme=/);
  await host.getByRole('tab',{name:'Architecture',exact:true}).click();
  await expect(host.locator('iframe')).toHaveCount(1);
  await expect(host.locator('iframe')).toHaveAttribute('src',/architecture.html\?embed=1&theme=/);
  await expect(host.frameLocator('iframe').locator('svg').first()).toBeVisible();
  expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+2)).toBe(true);
  await host.screenshot({path:info.outputPath(p.id+'-case.png')});
 });
}
test('all 36 standalone readers render at desktop and phone sizes',async({page},info)=>{
 test.setTimeout(180000);
 const errors=[];page.on('pageerror',e=>errors.push(e.message));
 for(const p of catalog.projects)for(const v of p.views){
  await page.goto('/architecture/'+v.map+'?theme=light',{waitUntil:'domcontentloaded'});
  await expect(page.locator('#btn-export')).toBeVisible();
  await expect(page.locator('svg').first()).toBeVisible();
  expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+2),p.id+'/'+v.key).toBe(true);
  if(info.project.name==='desktop-chromium')await page.screenshot({path:info.outputPath(p.id+'-'+v.key+'.png')});
 }
 expect(errors).toEqual([]);
});
test('reader theme, node search and actual SVG export work',async({page},info)=>{
 await page.goto('/architecture/maps/dq-check-architecture.html?theme=light');
 await page.getByRole('button',{name:'Toggle color theme',exact:true}).click();
 await expect(page.locator('html')).toHaveAttribute('data-theme','dark');
 await page.getByRole('button',{name:'Find a node',exact:true}).click();
 await page.getByRole('searchbox',{name:'Search diagram nodes'}).fill('Profile');
 await expect(page.locator('#node-finder-results')).toContainText('Profile');
 await page.keyboard.press('Escape');
 await page.getByRole('button',{name:'Export diagram',exact:true}).click();
 const download=page.waitForEvent('download');await page.locator('[data-format=svg]').click();
 const file=await download;expect(file.suggestedFilename()).toMatch(/\.svg$/);
 await file.saveAs(info.outputPath('exported-diagram.svg'));
 await page.screenshot({path:info.outputPath('reader-dark.png')});
});
test('readable alternatives and direct map links survive disabled scripts',async({browser})=>{
 const context=await browser.newContext({javaScriptEnabled:false,viewport:{width:390,height:844}});
 const page=await context.newPage();await page.goto('http://127.0.0.1:4173/projects/dq-check-platform.html');
 await expect(page.locator('.archify-text')).toHaveCount(4);
 await page.locator('.archify-text').first().locator('summary').click();
 await expect(page.locator('.archify-text').first()).toContainText('Profile contract');
 await expect(page.locator('[data-archify-open]')).toHaveAttribute('href',/dq-check-architecture.html$/);
 await context.close();
});
