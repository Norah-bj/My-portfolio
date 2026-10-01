import { chromium } from 'playwright';

const browser = await chromium.launch({ headless: true, channel: 'chrome', args: ['--use-angle=default', '--enable-unsafe-swiftshader'] });
const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
const page = await ctx.newPage();

const errors = [];
page.on('console', m => { if (m.type() === 'error') errors.push('[console] ' + m.text()); });
page.on('pageerror', e => errors.push('[pageerror] ' + e.message));

await page.goto('http://localhost:5173/', { waitUntil: 'networkidle' });
await page.waitForTimeout(5000);
await page.screenshot({ path: 'shots/01-hero.png' });

const stops = ['work', 'experiments', 'skills', 'codexdesign', 'about', 'contact'];
for (const name of stops) {
  const target = await page.evaluate((id) => {
    const el = document.getElementById(id);
    const r = el.getBoundingClientRect();
    const center = r.top + scrollY + r.height / 2 - innerHeight / 2;
    return Math.max(0, Math.min(document.documentElement.scrollHeight - innerHeight, center));
  }, name);
  await page.evaluate((y) => window.scrollTo(0, y), target);
  await page.waitForTimeout(1600);
  await page.screenshot({ path: `shots/02-${name}.png` });
}
await page.screenshot({ path: 'shots/03-footer.png' });
console.log(JSON.stringify({ errors, scrollHeight: await page.evaluate(() => document.documentElement.scrollHeight) }, null, 2));
await browser.close();
