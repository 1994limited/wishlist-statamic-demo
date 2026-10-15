// Screenshots of Dog-ear Books, as used in Wishlist's docs and Marketplace
// listing. Run against a fresh demo (no saved lists) with the demo users:
//
//   cd scripts && npm install && npm run screenshots
//
// DEMO_URL     the demo's address (default http://localhost:8000)
// SCREENSHOTS  where to write them (default ./screenshots)
// CHROME       a Chrome or Chromium to drive (default: Google Chrome on macOS)
import { chromium } from 'playwright-core';
import { mkdirSync } from 'node:fs';

const base = (process.env.DEMO_URL || 'http://localhost:8000').replace(/\/$/, '');
const out = process.env.SCREENSHOTS || new URL('./screenshots', import.meta.url).pathname;
const chrome = process.env.CHROME || '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
mkdirSync(out, { recursive: true });

const id = (n) => `b00c${String(n).padStart(4, '0')}-0000-4000-8000-${String(n).padStart(12, '0')}`;

// Local demos often use a self-signed certificate (Herd, Valet).
const browser = await chromium.launch({ args: ['--ignore-certificate-errors'], executablePath: chrome });
const desktop = { viewport: { width: 1280, height: 860 }, deviceScaleFactor: 2, colorScheme: 'light' };

async function settle(page) {
    await page.evaluate(() => document.fonts.ready);
    await page.evaluate(() => window.Wishlist && window.Wishlist.ready);
    await page.waitForTimeout(700);
}

// Jo, signed in, saves some books and makes a second list.
const jo = await browser.newContext(desktop);
const page = await jo.newPage();
await page.goto(`${base}/login`);
await page.click('button[type=submit]');
await page.waitForURL('**/wishlist');
await settle(page);

await page.evaluate(async ([a, b, c, d, e, f]) => {
    await Wishlist.add(a, { data: { notes: "Sam's birthday, 3rd Nov" } });
    await Wishlist.renameList(Wishlist.list().id, 'Gift ideas');
    await Wishlist.add(b);
    await Wishlist.add(c, { data: { notes: 'For the long train to Edinburgh' } });
    await Wishlist.add(d);
    const club = (await Wishlist.createList('Book club')).list;
    await Wishlist.add(e, { list: club.id });
    await Wishlist.add(f, { list: club.id });
    Wishlist.pick(Wishlist.list().id);
}, [id(6), id(3), id(1), id(5), id(10), id(2)]);

await page.goto(base + '/');
await settle(page);
await page.screenshot({ path: `${out}/shop.png` });

await page.goto(`${base}/products/coral-arithmetic`);
await settle(page);
await page.fill('input[name=notes]', "Sam's birthday, 3rd Nov");
await page.screenshot({ path: `${out}/book.png` });

await page.goto(`${base}/wishlist`);
await settle(page);
await page.screenshot({ path: `${out}/wishlist.png`, fullPage: true });
const shareUrl = await page.evaluate(() => Wishlist.shareUrl());

const phone = await browser.newContext({ ...desktop, viewport: { width: 390, height: 844 }, deviceScaleFactor: 3, storageState: await jo.storageState() });
const phonePage = await phone.newPage();
await phonePage.goto(base + '/');
await settle(phonePage);
await phonePage.screenshot({ path: `${out}/shop-mobile.png` });

// Someone Jo sent the link to.
const friend = await browser.newContext(desktop);
const friendPage = await friend.newPage();
await friendPage.goto(shareUrl);
await settle(friendPage);
await friendPage.screenshot({ path: `${out}/shared.png` });
await friendPage.click('form[data-wishlist-form="import"] button');
await friendPage.waitForTimeout(800);

// The Control Panel.
const admin = await browser.newContext({ ...desktop, viewport: { width: 1440, height: 900 } });
const cp = await admin.newPage();
await cp.goto(`${base}/cp/auth/login`);
await cp.waitForTimeout(1500);
await cp.locator('input').nth(0).fill('admin@example.com');
await cp.locator('input').nth(1).fill('password');
await cp.keyboard.press('Enter');
await cp.waitForURL((url) => !url.pathname.includes('/auth/'));
await cp.goto(`${base}/cp/wishlists`);
await cp.waitForTimeout(1500);
const snooze = cp.getByRole('button', { name: 'Snooze' });
if (await snooze.isVisible().catch(() => false)) {
    await snooze.click();
    await cp.waitForTimeout(500);
}
await cp.screenshot({ path: `${out}/cp-wishlists.png` });

await cp.getByRole('link', { name: 'Gift ideas' }).first().click();
await cp.waitForTimeout(1500);
await cp.screenshot({ path: `${out}/cp-wishlist.png` });

await browser.close();
console.log('done', shareUrl);
