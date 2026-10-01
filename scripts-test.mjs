import { chromium } from 'playwright';

const browser = await chromium.launch({ headless: true, channel: 'chrome', args: ['--use-angle=default', '--enable-unsafe-swiftshader'] });
const errors = [];

// --- desktop: case overlay flow ---
const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
const page = await ctx.newPage();
page.on('pageerror', e => errors.push('[desktop] ' + e.message));
await page.goto('http://localhost:5173/', { waitUntil: 'networkidle' });
await page.waitForTimeout(4200);

// DOM path: click the first work row
await page.evaluate(() => document.getElementById('work-0') ?? document.querySelector('#work li button')?.scrollIntoView({ block: 'center' }));
await page.waitForTimeout(1200);
await page.click('#work li button');
await page.waitForTimeout(1200);
await page.screenshot({ path: 'shots/04-case-overlay.png' });
const overlayVisible = await page.evaluate(() => {
  const el = document.querySelector('[role="dialog"]');
  return el ? getComputedStyle(el).opacity : 'none';
});
await page.keyboard.press('Escape');
await page.waitForTimeout(600);

// nav jump
await page.click('[data-nav="contact"]');
await page.waitForTimeout(2200);
await page.screenshot({ path: 'shots/04-nav-contact.png' });
await ctx.close();

// --- mobile: 390x844 touch ---
const mctx = await browser.newContext({ viewport: { width: 390, height: 844 }, hasTouch: true, isMobile: true, deviceScaleFactor: 2 });
const mpage = await mctx.newPage();
mpage.on('pageerror', e => errors.push('[mobile] ' + e.message));
await mpage.goto('http://localhost:5173/', { waitUntil: 'networkidle' });
await mpage.waitForTimeout(4200);
await mpage.screenshot({ path: 'shots/05-mobile-hero.png' });
const mtarget = await mpage.evaluate(() => { const el = document.getElementById('work'); const r = el.getBoundingClientRect(); return r.top + scrollY + r.height/2 - innerHeight/2; });
await mpage.evaluate((y) => window.scrollTo(0, y), mtarget);
await mpage.waitForTimeout(1500);
await mpage.screenshot({ path: 'shots/05-mobile-work.png' });
console.log(JSON.stringify({ errors, overlayVisible }, null, 2));
await browser.close();
