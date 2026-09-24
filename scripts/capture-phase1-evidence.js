const puppeteer = require('puppeteer-core');
const path = require('path');

const chromePath = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
const brainDir = '/Users/harshchouksey/.gemini/antigravity/brain/77e692e2-1f45-45ec-8b77-e98703246708';

async function run() {
  const browser = await puppeteer.launch({
    executablePath: chromePath,
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  });

  const page = await browser.newPage();
  await page.setViewport({
    width: 390,
    height: 844,
    deviceScaleFactor: 2,
    isMobile: true,
    hasTouch: true,
  });

  console.log('1. Capturing Top of page (sticky bar + section chips + first section)...');
  await page.goto('http://localhost:3000', { waitUntil: 'networkidle0' });
  await page.screenshot({
    path: path.join(brainDir, '01-top-bar-and-first-section.png'),
    fullPage: false,
  });

  console.log('2. Capturing Momo row (Steam/Fried variants)...');
  await page.evaluate(() => {
    const el = document.getElementById('momo');
    if (el) window.scrollTo({ top: el.offsetTop - 110, behavior: 'instant' });
  });
  await new Promise((r) => setTimeout(r, 400));
  await page.screenshot({
    path: path.join(brainDir, '02-momo-row-variants.png'),
    fullPage: false,
  });

  console.log('3. Capturing Pizza row (10 inch / 12 inch variants)...');
  await page.evaluate(() => {
    const el = document.getElementById('pizza');
    if (el) window.scrollTo({ top: el.offsetTop - 110, behavior: 'instant' });
  });
  await new Promise((r) => setTimeout(r, 400));
  await page.screenshot({
    path: path.join(brainDir, '03-pizza-row-variants.png'),
    fullPage: false,
  });

  console.log('4. Capturing Group with add-on pill (Burger group with Add Cheese)...');
  await page.evaluate(() => {
    const el = document.getElementById('continental');
    if (el) window.scrollTo({ top: el.offsetTop - 110, behavior: 'instant' });
  });
  await new Promise((r) => setTimeout(r, 400));
  await page.screenshot({
    path: path.join(brainDir, '04-group-addon-pill.png'),
    fullPage: false,
  });

  console.log('5. Capturing Search active with query typed...');
  await page.goto('http://localhost:3000', { waitUntil: 'networkidle0' });
  const searchInput = await page.$('input[type="text"]');
  await searchInput.type('Momo');
  await new Promise((r) => setTimeout(r, 400));
  await page.screenshot({
    path: path.join(brainDir, '05-search-active.png'),
    fullPage: false,
  });

  console.log('6. Capturing Search empty state...');
  await searchInput.click({ clickCount: 3 });
  await searchInput.type('Biryani dosa pasta xyz');
  await new Promise((r) => setTimeout(r, 400));
  await page.screenshot({
    path: path.join(brainDir, '06-search-empty-state.png'),
    fullPage: false,
  });

  console.log('7. Capturing Mixed veg + non-veg section showing both FSSAI marks side by side...');
  await page.goto('http://localhost:3000', { waitUntil: 'networkidle0' });
  await page.evaluate(() => {
    const el = document.getElementById('combos');
    if (el) window.scrollTo({ top: el.offsetTop - 110, behavior: 'instant' });
  });
  await new Promise((r) => setTimeout(r, 400));
  await page.screenshot({
    path: path.join(brainDir, '07-mixed-veg-nonveg-fssai.png'),
    fullPage: false,
  });

  console.log('All 7 screenshots captured successfully.');
  await browser.close();
}

run().catch((err) => {
  console.error('Failed to capture:', err);
  process.exit(1);
});
