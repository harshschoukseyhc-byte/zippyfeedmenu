const puppeteer = require('puppeteer-core');
const path = require('path');

const chromePath = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
const brainDir = '/Users/harshchouksey/.gemini/antigravity/brain/77e692e2-1f45-45ec-8b77-e98703246708';

async function main() {
  console.log('=== PHASE 3.3: KOREAN SPOTLIGHT VERIFICATION ===');
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

  // Start fresh
  await page.goto('http://localhost:3000', { waitUntil: 'networkidle0' });
  await page.evaluate(() => localStorage.clear());
  await page.reload({ waitUntil: 'networkidle0' });

  // Dismiss mood picker so scrolling is direct
  const dismissBtn = await page.$('button[aria-label="Dismiss mood suggestions"]');
  if (dismissBtn) {
    await dismissBtn.click();
    await new Promise((r) => setTimeout(r, 200));
  }

  // 1. Scroll to Korean section
  await page.evaluate(() => {
    const el = document.getElementById('korean');
    if (el) window.scrollTo({ top: el.offsetTop - 100, behavior: 'instant' });
  });
  await new Promise((r) => setTimeout(r, 400));

  // Verify Korean Section DOM details
  const koreanDetails = await page.evaluate(() => {
    const sec = document.getElementById('korean');
    const title = sec?.querySelector('h2')?.innerText;
    const rareBadge = sec?.innerText.toLowerCase().includes('bhopal mein rare');
    const hangul = sec?.innerText.includes('한국 요리');
    const groups = Array.from(sec?.querySelectorAll('h3') || []).map((h) => h.innerText);
    const totalItems = sec?.querySelectorAll('[role="article"]').length || 0;
    const nonVegCount = sec?.querySelectorAll('[aria-label="Non-Vegetarian"]').length || 0;
    const vegCount = sec?.querySelectorAll('[aria-label="Vegetarian"]').length || 0;

    return {
      title,
      rareBadge,
      hangul,
      groups,
      totalItems,
      vegCount,
      nonVegCount,
    };
  });

  console.log('--- CHECK 1: KOREAN SPOTLIGHT DETAILS (VEG OFF) ---');
  console.log(`Section Title:                  ${koreanDetails.title}`);
  console.log(`"Bhopal Mein Rare" badge:       ${koreanDetails.rareBadge ? 'YES (PASSED)' : 'NO (FAIL)'}`);
  console.log(`Hangul motif (한국 요리):        ${koreanDetails.hangul ? 'YES (PASSED)' : 'NO (FAIL)'}`);
  console.log(`Groups inside Korean:           ${koreanDetails.groups.join(', ')}`);
  console.log(`Total Korean items (Veg OFF):   ${koreanDetails.totalItems} (${koreanDetails.vegCount} veg, ${koreanDetails.nonVegCount} non-veg)`);

  // 2. Capture Screenshot: Korean Spotlight (Veg OFF)
  console.log('\n2. Capturing Screenshot: Korean Spotlight (Veg OFF)...');
  await page.screenshot({
    path: path.join(brainDir, 'phase3-3-korean-spotlight-390px.png'),
    fullPage: false,
  });

  // 3. Turn Veg Switch ON
  console.log('\n--- CHECK 2: KOREAN SPOTLIGHT WITH VEG SWITCH ON ---');
  const vegSwitch = await page.$('button[role="switch"]');
  await vegSwitch.click();
  await new Promise((r) => setTimeout(r, 300));

  const koreanVegOn = await page.evaluate(() => {
    const sec = document.getElementById('korean');
    const totalItems = sec?.querySelectorAll('[role="article"]').length || 0;
    const nonVegCount = sec?.querySelectorAll('[aria-label="Non-Vegetarian"]').length || 0;
    const vegCount = sec?.querySelectorAll('[aria-label="Vegetarian"]').length || 0;
    return { totalItems, vegCount, nonVegCount };
  });

  console.log(`Total Korean items (Veg ON):    ${koreanVegOn.totalItems} (${koreanVegOn.vegCount} veg, ${koreanVegOn.nonVegCount} non-veg)`);
  console.log(`Non-veg items in Korean (Veg ON): ${koreanVegOn.nonVegCount} (MUST BE 0)`);

  // 4. Capture Screenshot: Korean Spotlight (Veg ON)
  console.log('\n4. Capturing Screenshot: Korean Spotlight (Veg ON)...');
  await page.screenshot({
    path: path.join(brainDir, 'phase3-3-korean-veg-on-390px.png'),
    fullPage: false,
  });

  await browser.close();
  console.log('\n=== ALL PHASE 3.3 CHECKS COMPLETED ===');
}

main().catch((err) => {
  console.error('Test run failed:', err);
  process.exit(1);
});
