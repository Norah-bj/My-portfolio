import { chromium } from 'playwright';

const browser = await chromium.launch({ headless: true, channel: 'chrome', args: ['--use-angle=default', '--enable-unsafe-swiftshader'] });
const errors = [];

// tablet 820px and small laptop 1024px margin checks
for (const [w, h, tag] of [[820, 1180, 'tablet'], [1024, 768, 'laptop']]) {
  const ctx = await browser.newContext({ viewport: { width: w, height: h } });
  const page = await ctx.newPage();
  page.on('pageerror', e => errors.push(`[${tag}] ` + e.message));
  await page.goto('http://localhost:5173/', { waitUntil: 'networkidle' });
  await page.waitForTimeout(4200);
  await page.screenshot({ path: `shots/06-${tag}-hero.png` });
  const t = await page.evaluate(() => { const el = document.getElementById('work'); const r = el.getBoundingClientRect(); return r.top + scrollY + 300; });
  await page.evaluate((y) => window.scrollTo(0, y), t);
  await page.waitForTimeout(1500);
  await page.screenshot({ path: `shots/06-${tag}-work.png` });
  await ctx.close();
}

// phone: case overlay content fully visible + scrollable
const mctx = await browser.newContext({ viewport: { width: 390, height: 844 }, hasTouch: true, isMobile: true, deviceScaleFactor: 2 });
const mpage = await mctx.newPage();
mpage.on('pageerror', e => errors.push('[phone] ' + e.message));
await mpage.goto('http://localhost:5173/', { waitUntil: 'networkidle' });
await mpage.waitForTimeout(4200);
await mpage.evaluate(() => document.querySelector('#work li button')?.scrollIntoView({ block: 'center' }));
await mpage.waitForTimeout(1000);
await mpage.tap('#work li button');
await mpage.waitForTimeout(1400);
await mpage.screenshot({ path: 'shots/07-phone-case-top.png' });
// scroll inside the overlay to the bottom (actions row must be reachable)
await mpage.evaluate(() => { const el = document.querySelector('[role="dialog"] .overflow-y-auto'); el.scrollTop = el.scrollHeight; });
await mpage.waitForTimeout(900);
await mpage.screenshot({ path: 'shots/07-phone-case-bottom.png' });
const overlayScroll = await mpage.evaluate(() => {
  const el = document.querySelector('[role="dialog"] .overflow-y-auto');
  return { scrollH: el.scrollHeight, clientH: el.clientHeight, scrollTop: el.scrollTop };
});
await mctx.close();

console.log(JSON.stringify({ errors, overlayScroll }, null, 2));
await browser.close();
