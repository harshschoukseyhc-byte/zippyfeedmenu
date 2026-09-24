const puppeteer = require('puppeteer-core');
const path = require('path');

const ARTIFACT_DIR = '/Users/harshchouksey/.gemini/antigravity/brain/77e692e2-1f45-45ec-8b77-e98703246708';
const CHROME_PATH = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';

async function run() {
  console.log('=== PHASE 3.4: PRICE FILTER VERIFICATION ===');
  const browser = await puppeteer.launch({
    executablePath: CHROME_PATH,
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 390, height: 844, deviceScaleFactor: 2, isMobile: true });

  await page.goto('http://localhost:3000', { waitUntil: 'networkidle0' });

  // Dismiss mood picker if open to clearly focus on price filter
  await page.evaluate(() => {
    localStorage.removeItem('zippy_veg_only');
    localStorage.setItem('zippy_mood_dismissed', 'true');
  });
  await page.reload({ waitUntil: 'networkidle0' });

  console.log('\n--- CHECK 1: PRICE FILTER CHIPS (VEG OFF) ---');
  const chipInfoVegOff = await page.evaluate(() => {
    const buttons = Array.from(document.querySelectorAll('[role="toolbar"][aria-label="Price ceiling options"] button'));
    return buttons.map(b => ({
      text: b.innerText.replace(/\n/g, ' ').trim(),
      ariaPressed: b.getAttribute('aria-pressed'),
    }));
  });
  console.log('Price Filter Chips (Veg OFF):', JSON.stringify(chipInfoVegOff, null, 2));

  // 1. Capture neutral state
  const neutralScreenshot = path.join(ARTIFACT_DIR, 'phase3-4-price-filter-chips-390px.png');
  await page.screenshot({ path: neutralScreenshot });
  console.log('1. Captured Screenshot: Neutral Price Filter Chips ->', neutralScreenshot);

  // 2. Click "Under ₹200"
  console.log('\n--- CHECK 2: UNDER ₹200 (VEG OFF) ---');
  await page.evaluate(() => {
    const buttons = Array.from(document.querySelectorAll('[role="toolbar"][aria-label="Price ceiling options"] button'));
    const btn200 = buttons.find(b => b.innerText.includes('Under ₹200'));
    btn200?.click();
  });
  await new Promise(r => setTimeout(r, 400));

  const under200Details = await page.evaluate(() => {
    const articles = Array.from(document.querySelectorAll('[role="article"]'));
    const nonVeg = Array.from(document.querySelectorAll('[role="img"][aria-label="Non-Vegetarian"]')).length;
    const veg = Array.from(document.querySelectorAll('[role="img"][aria-label="Vegetarian"]')).length;
    const banner = document.querySelector('[role="region"][aria-label="Price Filter"] .animate-fadeIn')?.innerText;
    return {
      totalArticles: articles.length,
      vegMarks: veg,
      nonVegMarks: nonVeg,
      bannerText: banner?.replace(/\n/g, ' '),
    };
  });
  console.log('Under ₹200 (Veg OFF):', under200Details);

  // Capture Under ₹200 Active
  const under200Screenshot = path.join(ARTIFACT_DIR, 'phase3-4-under-200-active-390px.png');
  await page.screenshot({ path: under200Screenshot });
  console.log('2. Captured Screenshot: Under ₹200 Active ->', under200Screenshot);

  // 3. Click "Under ₹300"
  console.log('\n--- CHECK 3: UNDER ₹300 (VEG OFF) ---');
  await page.evaluate(() => {
    const buttons = Array.from(document.querySelectorAll('[role="toolbar"][aria-label="Price ceiling options"] button'));
    const btn300 = buttons.find(b => b.innerText.includes('Under ₹300'));
    btn300?.click();
  });
  await new Promise(r => setTimeout(r, 400));

  const under300Count = await page.evaluate(() => document.querySelectorAll('[role="article"]').length);
  console.log('Under ₹300 (Veg OFF) articles count:', under300Count, '(Expected: 172)');

  // 4. Click "Under ₹500"
  console.log('\n--- CHECK 4: UNDER ₹500 (VEG OFF) ---');
  await page.evaluate(() => {
    const buttons = Array.from(document.querySelectorAll('[role="toolbar"][aria-label="Price ceiling options"] button'));
    const btn500 = buttons.find(b => b.innerText.includes('Under ₹500'));
    btn500?.click();
  });
  await new Promise(r => setTimeout(r, 400));

  const under500Count = await page.evaluate(() => document.querySelectorAll('[role="article"]').length);
  console.log('Under ₹500 (Veg OFF) articles count:', under500Count, '(Expected: 284)');

  // 5. Reset price filter
  await page.evaluate(() => {
    const resetBtn = document.querySelector('button[aria-label="Clear price filter"]') ||
                     Array.from(document.querySelectorAll('button')).find(b => b.innerText.includes('Reset filter') || b.innerText.includes('Show all'));
    resetBtn?.click();
  });
  await new Promise(r => setTimeout(r, 400));
  const resetCount = await page.evaluate(() => document.querySelectorAll('[role="article"]').length);
  console.log('After Reset (Veg OFF) articles count:', resetCount, '(Expected: 329)');

  // 6. Test with VEG TOGGLE ON
  console.log('\n--- CHECK 5: PRICE FILTER WITH VEG ONLY ON ---');
  await page.evaluate(() => {
    const toggle = document.querySelector('[role="switch"]');
    if (toggle && toggle.getAttribute('aria-checked') === 'false') {
      toggle.click();
    }
  });
  await new Promise(r => setTimeout(r, 500));

  const chipInfoVegOn = await page.evaluate(() => {
    const buttons = Array.from(document.querySelectorAll('[role="toolbar"][aria-label="Price ceiling options"] button'));
    return buttons.map(b => ({
      text: b.innerText.replace(/\n/g, ' ').trim(),
    }));
  });
  console.log('Price Filter Chips (Veg ON):', JSON.stringify(chipInfoVegOn, null, 2));

  // Click "Under ₹200" with Veg ON
  await page.evaluate(() => {
    const buttons = Array.from(document.querySelectorAll('[role="toolbar"][aria-label="Price ceiling options"] button'));
    const btn200 = buttons.find(b => b.innerText.includes('Under ₹200'));
    btn200?.click();
  });
  await new Promise(r => setTimeout(r, 400));

  const under200VegOnDetails = await page.evaluate(() => {
    const articles = Array.from(document.querySelectorAll('[role="article"]'));
    const nonVeg = Array.from(document.querySelectorAll('[role="img"][aria-label="Non-Vegetarian"]')).length;
    const veg = Array.from(document.querySelectorAll('[role="img"][aria-label="Vegetarian"]')).length;
    const banner = document.querySelector('[role="region"][aria-label="Price Filter"] .animate-fadeIn')?.innerText;
    return {
      totalArticles: articles.length,
      vegMarks: veg,
      nonVegMarks: nonVeg,
      bannerText: banner?.replace(/\n/g, ' '),
    };
  });
  console.log('Under ₹200 (Veg ON):', under200VegOnDetails);

  // Capture Under ₹200 with Veg ON
  const under200VegOnScreenshot = path.join(ARTIFACT_DIR, 'phase3-4-under-200-veg-on-390px.png');
  await page.screenshot({ path: under200VegOnScreenshot });
  console.log('3. Captured Screenshot: Under ₹200 (Veg ON) ->', under200VegOnScreenshot);

  // Click Under ₹300 with Veg ON
  await page.evaluate(() => {
    const buttons = Array.from(document.querySelectorAll('[role="toolbar"][aria-label="Price ceiling options"] button'));
    const btn300 = buttons.find(b => b.innerText.includes('Under ₹300'));
    btn300?.click();
  });
  await new Promise(r => setTimeout(r, 400));
  const under300VegOn = await page.evaluate(() => ({
    count: document.querySelectorAll('[role="article"]').length,
    nonVeg: document.querySelectorAll('[role="img"][aria-label="Non-Vegetarian"]').length,
  }));
  console.log('Under ₹300 (Veg ON):', under300VegOn, '(Expected count: 145, nonVeg: 0)');

  // Click Under ₹500 with Veg ON
  await page.evaluate(() => {
    const buttons = Array.from(document.querySelectorAll('[role="toolbar"][aria-label="Price ceiling options"] button'));
    const btn500 = buttons.find(b => b.innerText.includes('Under ₹500'));
    btn500?.click();
  });
  await new Promise(r => setTimeout(r, 400));
  const under500VegOn = await page.evaluate(() => ({
    count: document.querySelectorAll('[role="article"]').length,
    nonVeg: document.querySelectorAll('[role="img"][aria-label="Non-Vegetarian"]').length,
  }));
  console.log('Under ₹500 (Veg ON):', under500VegOn, '(Expected count: 202, nonVeg: 0)');

  console.log('\n=== ALL PHASE 3.4 CHECKS COMPLETED ===');
  await browser.close();
}

run().catch((err) => {
  console.error('Phase 3.4 verification error:', err);
  process.exit(1);
});
