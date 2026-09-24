const puppeteer = require('puppeteer-core');
const path = require('path');

const chromePath = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
const brainDir = '/Users/harshchouksey/.gemini/antigravity/brain/77e692e2-1f45-45ec-8b77-e98703246708';

async function main() {
  console.log('=== PHASE 3.2: COMBOS FIRST VERIFICATION ===');
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

  // 1. Check Section Order in DOM
  const sectionCheck = await page.evaluate(() => {
    const firstSection = document.querySelector('main section[data-section-id]');
    const sectionTitle = firstSection?.querySelector('h2')?.innerText;
    const badgeText = firstSection?.querySelector('span.uppercase')?.innerText;
    const isCombosFirst = firstSection?.id === 'combos';
    const groups = Array.from(firstSection?.querySelectorAll('h3') || []).map((h) => h.innerText);
    const totalItems = firstSection?.querySelectorAll('[role="article"]').length || 0;
    const nonVegCount = firstSection?.querySelectorAll('[aria-label="Non-Vegetarian"]').length || 0;
    const vegCount = firstSection?.querySelectorAll('[aria-label="Vegetarian"]').length || 0;

    return {
      isCombosFirst,
      firstSectionId: firstSection?.id,
      sectionTitle,
      badgeText,
      groups,
      totalItems,
      vegCount,
      nonVegCount,
    };
  });

  console.log('--- CHECK 1: COMBOS FIRST ORDER & BADGE ---');
  console.log(`First section in menu:           ${sectionCheck.firstSectionId} (${sectionCheck.sectionTitle})`);
  console.log(`Rendered above everything:       ${sectionCheck.isCombosFirst ? 'YES (PASSED)' : 'NO (FAIL)'}`);
  console.log(`Prominent badge text:            "${sectionCheck.badgeText}"`);
  console.log(`Groups inside Combos:            ${sectionCheck.groups.join(', ')}`);
  console.log(`Total items (Veg OFF):           ${sectionCheck.totalItems} (${sectionCheck.vegCount} veg, ${sectionCheck.nonVegCount} non-veg)`);

  // Dismiss mood picker so combos section is front and center
  const dismissBtn = await page.$('button[aria-label="Dismiss mood suggestions"]');
  if (dismissBtn) {
    await dismissBtn.click();
    await new Promise((r) => setTimeout(r, 200));
  }

  // 2. Capture Screenshot: Combos First (Veg OFF)
  console.log('2. Capturing Screenshot: Combos First Highlighted (Veg OFF)...');
  await page.screenshot({
    path: path.join(brainDir, 'phase3-2-combos-first-390px.png'),
    fullPage: false,
  });

  // 3. Turn Veg Switch ON
  console.log('\n--- CHECK 2: COMBOS WITH VEG SWITCH ON ---');
  const vegSwitch = await page.$('button[role="switch"]');
  await vegSwitch.click();
  await new Promise((r) => setTimeout(r, 300));

  const vegOnCheck = await page.evaluate(() => {
    const firstSection = document.querySelector('main section[data-section-id]');
    const totalItems = firstSection?.querySelectorAll('[role="article"]').length || 0;
    const nonVegCount = firstSection?.querySelectorAll('[aria-label="Non-Vegetarian"]').length || 0;
    const vegCount = firstSection?.querySelectorAll('[aria-label="Vegetarian"]').length || 0;
    return { totalItems, vegCount, nonVegCount };
  });

  console.log(`Total items in Combos (Veg ON):  ${vegOnCheck.totalItems} (${vegOnCheck.vegCount} veg, ${vegOnCheck.nonVegCount} non-veg)`);
  console.log(`Non-veg items in Combos (Veg ON): ${vegOnCheck.nonVegCount} (MUST BE 0)`);

  // 4. Capture Screenshot: Combos (Veg ON)
  console.log('4. Capturing Screenshot: Combos First (Veg ON)...');
  await page.screenshot({
    path: path.join(brainDir, 'phase3-2-combos-veg-on-390px.png'),
    fullPage: false,
  });

  await browser.close();
  console.log('\n=== ALL PHASE 3.2 CHECKS COMPLETED ===');
}

main().catch((err) => {
  console.error('Test run failed:', err);
  process.exit(1);
});
