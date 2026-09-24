const puppeteer = require('puppeteer-core');
const path = require('path');

const chromePath = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
const brainDir = '/Users/harshchouksey/.gemini/antigravity/brain/77e692e2-1f45-45ec-8b77-e98703246708';

async function capture() {
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

  // 1. Default Core Menu
  await page.goto('http://localhost:3000', { waitUntil: 'networkidle0' });
  await page.screenshot({
    path: path.join(brainDir, 'phase1-390px.png'),
    fullPage: false,
  });

  // 2. Scrolled to Continental & Western with AddOn pill
  await page.evaluate(() => {
    const el = document.getElementById('continental');
    if (el) {
      window.scrollTo({ top: el.offsetTop - 110, behavior: 'instant' });
    }
  });
  await new Promise((r) => setTimeout(r, 400));
  await page.screenshot({
    path: path.join(brainDir, 'phase1-addons-390px.png'),
    fullPage: false,
  });

  // 3. Search Results
  await page.goto('http://localhost:3000', { waitUntil: 'networkidle0' });
  const searchInput = await page.$('input[type="text"]');
  await searchInput.type('Momo');
  await new Promise((r) => setTimeout(r, 400));
  await page.screenshot({
    path: path.join(brainDir, 'phase1-search-390px.png'),
    fullPage: false,
  });

  // 4. Helpful Empty Search State
  await searchInput.click({ clickCount: 3 });
  await searchInput.type('Biryani dosa pasta xyz');
  await new Promise((r) => setTimeout(r, 400));
  await page.screenshot({
    path: path.join(brainDir, 'phase1-empty-search-390px.png'),
    fullPage: false,
  });

  console.log('All screenshots captured successfully in', brainDir);
  await browser.close();
}

capture().catch((err) => {
  console.error('Capture failed:', err);
  process.exit(1);
});
