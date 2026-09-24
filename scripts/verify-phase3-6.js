const puppeteer = require('puppeteer-core');
const path = require('path');

const ARTIFACT_DIR = '/Users/harshchouksey/.gemini/antigravity/brain/77e692e2-1f45-45ec-8b77-e98703246708';
const CHROME_PATH = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';

async function run() {
  console.log('=== PHASE 3.6: DAYPARTING (12 PM - 4 PM) VERIFICATION ===');
  const browser = await puppeteer.launch({
    executablePath: CHROME_PATH,
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 390, height: 844, deviceScaleFactor: 2, isMobile: true });

  // 1. Check Off-Peak state (?lunch=false)
  console.log('\n--- CHECK 1: OFF-PEAK / STANDARD ORDERING (?lunch=false) ---');
  await page.goto('http://localhost:3000?lunch=false', { waitUntil: 'networkidle0' });
  await page.evaluate(() => {
    localStorage.clear();
    localStorage.setItem('zippy_mood_dismissed', 'true');
  });
  await page.reload({ waitUntil: 'networkidle0' });

  const offPeakDetails = await page.evaluate(() => {
    const banner = document.querySelector('[role="status"][aria-live="polite"]');
    const combosSection = document.getElementById('combos');
    const groupTitles = Array.from(combosSection?.querySelectorAll('h3') || []).map(h => h.innerText.trim());
    return {
      hasLunchBanner: Boolean(banner),
      combosGroupOrder: groupTitles,
    };
  });
  console.log('Off-Peak combos group order:', offPeakDetails);

  const offPeakScreenshot = path.join(ARTIFACT_DIR, 'phase3-6-dayparting-offpeak-390px.png');
  await page.screenshot({ path: offPeakScreenshot });
  console.log('1. Captured Screenshot: Off-Peak State ->', offPeakScreenshot);

  // 2. Check Lunch Time state (?lunch=true)
  console.log('\n--- CHECK 2: LUNCH TIME ACTIVE (12 PM - 4 PM) (?lunch=true) ---');
  await page.goto('http://localhost:3000?lunch=true', { waitUntil: 'networkidle0' });
  await new Promise(r => setTimeout(r, 400));

  const lunchActiveDetails = await page.evaluate(() => {
    const banner = document.querySelector('[role="status"][aria-live="polite"]');
    const combosSection = document.getElementById('combos');
    const groupElements = Array.from(combosSection?.querySelectorAll('h3') || []).map(h => h.innerText.trim());
    const mealsGroup = Array.from(combosSection?.querySelectorAll('.px-4') || []).find(el => el.querySelector('h3')?.innerText.includes('POCKET FRIENDLY MEALS'));
    const badge = mealsGroup?.innerText.includes('Lunch time');
    const badgeText = mealsGroup?.querySelector('span.bg-amber-100')?.innerText.trim();

    const indianSection = document.getElementById('indian');
    const indianGroups = Array.from(indianSection?.querySelectorAll('h3') || []).map(h => h.innerText.trim());

    return {
      hasLunchBanner: Boolean(banner),
      bannerText: banner?.innerText.replace(/\n/g, ' '),
      combosFirstGroup: groupElements[0],
      combosSecondGroup: groupElements[1],
      mealsHasLunchBadge: badge,
      badgeText,
      indianGroupsOrder: indianGroups,
    };
  });
  console.log('Lunch Active Details:', lunchActiveDetails);

  const lunchScreenshot = path.join(ARTIFACT_DIR, 'phase3-6-dayparting-lunch-active-390px.png');
  await page.screenshot({ path: lunchScreenshot });
  console.log('2. Captured Screenshot: Lunch Time Active ->', lunchScreenshot);

  // 3. Check Lunch Time with Veg Only ON
  console.log('\n--- CHECK 3: LUNCH TIME WITH VEG ONLY ON ---');
  await page.evaluate(() => {
    const toggle = document.querySelector('[role="switch"]');
    if (toggle && toggle.getAttribute('aria-checked') === 'false') {
      toggle.click();
    }
  });
  await new Promise(r => setTimeout(r, 400));

  const vegOnDetails = await page.evaluate(() => {
    const combosSection = document.getElementById('combos');
    const mealsGroup = Array.from(combosSection?.querySelectorAll('.px-4') || []).find(el => el.querySelector('h3')?.innerText.includes('POCKET FRIENDLY MEALS'));
    const nonVegCount = mealsGroup?.querySelectorAll('[role="img"][aria-label="Non-Vegetarian"]').length || 0;
    const vegCount = mealsGroup?.querySelectorAll('[role="img"][aria-label="Vegetarian"]').length || 0;
    const articles = Array.from(mealsGroup?.querySelectorAll('[role="article"]') || []).map(a => a.querySelector('h4')?.innerText);
    return {
      vegCount,
      nonVegCount,
      articles,
    };
  });
  console.log('Pocket Friendly Meals (Veg ON):', vegOnDetails);

  const vegOnScreenshot = path.join(ARTIFACT_DIR, 'phase3-6-dayparting-veg-on-390px.png');
  await page.screenshot({ path: vegOnScreenshot });
  console.log('3. Captured Screenshot: Lunch Time (Veg ON) ->', vegOnScreenshot);

  console.log('\n=== ALL PHASE 3.6 CHECKS COMPLETED ===');
  await browser.close();
}

run().catch((err) => {
  console.error('Phase 3.6 verification error:', err);
  process.exit(1);
});
