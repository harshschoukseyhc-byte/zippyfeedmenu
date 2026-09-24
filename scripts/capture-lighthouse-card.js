const puppeteer = require('puppeteer-core');
const path = require('path');

const CHROME_PATH = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
const ARTIFACTS_DIR = '/Users/harshchouksey/.gemini/antigravity/brain/77e692e2-1f45-45ec-8b77-e98703246708';
const REPORT_HTML = `file://${ARTIFACTS_DIR}/lighthouse-report.report.html`;

async function capture() {
  const browser = await puppeteer.launch({
    executablePath: CHROME_PATH,
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 900, height: 600, deviceScaleFactor: 2 });
  await page.goto(REPORT_HTML, { waitUntil: 'networkidle2' });

  // Wait for score gauges to render
  await page.waitForSelector('.lh-scores-wrapper', { timeout: 5000 });

  // Clip the top section showing the 4 score gauges
  const clip = await page.evaluate(() => {
    const el = document.querySelector('.lh-scores-wrapper');
    if (!el) return null;
    const rect = el.getBoundingClientRect();
    return {
      x: Math.max(0, rect.x - 20),
      y: Math.max(0, rect.y - 20),
      width: rect.width + 40,
      height: rect.height + 40,
    };
  });

  if (clip) {
    await page.screenshot({
      path: path.join(ARTIFACTS_DIR, 'phase5-lighthouse-scores.png'),
      clip,
    });
    console.log('Saved phase5-lighthouse-scores.png');
  } else {
    await page.screenshot({
      path: path.join(ARTIFACTS_DIR, 'phase5-lighthouse-scores.png'),
    });
  }

  await browser.close();
}

capture().catch((err) => {
  console.error('Failed to capture lighthouse scores:', err);
  process.exit(1);
});
