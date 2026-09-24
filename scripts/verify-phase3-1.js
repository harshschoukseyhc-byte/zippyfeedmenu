const puppeteer = require('puppeteer-core');
const path = require('path');

const chromePath = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
const brainDir = '/Users/harshchouksey/.gemini/antigravity/brain/77e692e2-1f45-45ec-8b77-e98703246708';

const MOOD_NAMES = [
  'Bhook zyada hai',
  'Halka-phulka',
  'Sweet kuch',
  'Thanda kuch',
  'Group ke saath',
  'Kam budget',
];

async function main() {
  console.log('=== PHASE 3.1: MOOD PICKER VERIFICATION ===');
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

  // Clear localStorage before testing to start fresh
  await page.goto('http://localhost:3000', { waitUntil: 'networkidle0' });
  await page.evaluate(() => localStorage.clear());
  await page.reload({ waitUntil: 'networkidle0' });

  // 1. Capture Screenshot: Picker Visible
  console.log('1. Capturing Screenshot: Mood Picker Visible...');
  await page.screenshot({
    path: path.join(brainDir, 'phase3-1-picker-visible-390px.png'),
    fullPage: false,
  });

  // 2. Programmatic Counts Test (Veg OFF vs Veg ON)
  console.log('\n--- CHECK 1: MOOD CHIP ITEM COUNTS (PROGRAMMATIC TEST IN DOM) ---');
  async function testAllMoods(isVegActive) {
    const results = {};
    for (const moodName of MOOD_NAMES) {
      // Find and click the mood chip
      const clicked = await page.evaluate((name) => {
        const buttons = Array.from(document.querySelectorAll('section[aria-label="Mood Selector"] button'));
        const target = buttons.find((b) => b.innerText.includes(name));
        if (target) {
          target.click();
          return true;
        }
        return false;
      }, moodName);

      if (!clicked) throw new Error(`Could not click mood chip: ${moodName}`);
      await new Promise((r) => setTimeout(r, 200));

      const countInfo = await page.evaluate(() => {
        const totalRows = document.querySelectorAll('main [role="article"]').length;
        const nonVegMarks = document.querySelectorAll('main [aria-label="Non-Vegetarian"]').length;
        const vegMarks = document.querySelectorAll('main [aria-label="Vegetarian"]').length;
        return { totalRows, nonVegMarks, vegMarks };
      });

      results[moodName] = countInfo;

      // Clear mood filter
      await page.evaluate(() => {
        const clearBtn = Array.from(document.querySelectorAll('button')).find((b) =>
          b.innerText.includes('Clear filter')
        );
        if (clearBtn) clearBtn.click();
      });
      await new Promise((r) => setTimeout(r, 150));
    }
    return results;
  }

  console.log('Testing with Veg Switch: OFF (Full Menu)');
  const countsVegOff = await testAllMoods(false);
  for (const [name, info] of Object.entries(countsVegOff)) {
    console.log(`  • ${name}: ${info.totalRows} items (${info.vegMarks} veg / ${info.nonVegMarks} non-veg)`);
  }

  // Turn Veg Switch ON
  console.log('\nToggling Veg Switch: ON');
  const vegSwitch = await page.$('button[role="switch"]');
  await vegSwitch.click();
  await new Promise((r) => setTimeout(r, 300));

  console.log('Testing with Veg Switch: ON (Pure Veg)');
  const countsVegOn = await testAllMoods(true);
  for (const [name, info] of Object.entries(countsVegOn)) {
    console.log(`  • ${name}: ${info.totalRows} items (${info.vegMarks} veg / ${info.nonVegMarks} non-veg)`);
  }

  // 3. Verify Specific Non-Veg Leakage Prevention for "Bhook zyada hai" and "Group ke saath"
  console.log('\n--- CHECK 2: VEG SWITCH LEAKAGE IN HEAVY NON-VEG MOODS ---');
  console.log(`"Bhook zyada hai" non-veg items when Veg ON: ${countsVegOn['Bhook zyada hai'].nonVegMarks} (MUST BE 0)`);
  console.log(`"Group ke saath"  non-veg items when Veg ON: ${countsVegOn['Group ke saath'].nonVegMarks} (MUST BE 0)`);

  // 4. Capture Screenshot: Active Chip with Results ("Bhook zyada hai")
  console.log('\n4. Capturing Screenshot: Active Chip with Results...');
  // Activate "Bhook zyada hai"
  await page.evaluate(() => {
    const btn = Array.from(document.querySelectorAll('section[aria-label="Mood Selector"] button')).find((b) =>
      b.innerText.includes('Bhook zyada hai')
    );
    if (btn) btn.click();
  });
  await new Promise((r) => setTimeout(r, 300));
  await page.screenshot({
    path: path.join(brainDir, 'phase3-1-chip-active-390px.png'),
    fullPage: false,
  });

  // Clear mood filter
  await page.evaluate(() => {
    const clearBtn = Array.from(document.querySelectorAll('button')).find((b) =>
      b.innerText.includes('Clear filter')
    );
    if (clearBtn) clearBtn.click();
  });
  await new Promise((r) => setTimeout(r, 200));

  // 5. Test Dismissal & LocalStorage Persistence
  console.log('\n--- CHECK 3: DISMISSAL & LOCALSTORAGE PERSISTENCE ---');
  // Dismiss by clicking X
  console.log('Clicking Dismiss (X) on Mood Picker...');
  const dismissBtn = await page.$('button[aria-label="Dismiss mood suggestions"]');
  if (!dismissBtn) throw new Error('Dismiss button not found!');
  await dismissBtn.click();
  await new Promise((r) => setTimeout(r, 200));

  const dismissedBeforeReload = await page.evaluate(() => {
    const picker = document.querySelector('section[aria-label="Mood Selector"]');
    const stored = localStorage.getItem('zippy_mood_dismissed');
    return { hasPicker: Boolean(picker), storedVal: stored };
  });
  console.log(`Mood picker visible before reload: ${dismissedBeforeReload.hasPicker}`);
  console.log(`localStorage('zippy_mood_dismissed'): "${dismissedBeforeReload.storedVal}"`);

  console.log('Reloading page...');
  await page.reload({ waitUntil: 'networkidle0' });
  await new Promise((r) => setTimeout(r, 400));

  const dismissedAfterReload = await page.evaluate(() => {
    const picker = document.querySelector('section[aria-label="Mood Selector"]');
    const stored = localStorage.getItem('zippy_mood_dismissed');
    return { hasPicker: Boolean(picker), storedVal: stored };
  });
  console.log(`Mood picker visible after reload:  ${dismissedAfterReload.hasPicker} (MUST BE false)`);
  console.log(`localStorage after reload:         "${dismissedAfterReload.storedVal}" (MUST BE "true")`);

  // 6. Capture Screenshot: Dismissed State
  console.log('\n6. Capturing Screenshot: Dismissed State...');
  await page.screenshot({
    path: path.join(brainDir, 'phase3-1-dismissed-390px.png'),
    fullPage: false,
  });

  await browser.close();
  console.log('\n=== ALL PHASE 3.1 CHECKS COMPLETED ===');
}

main().catch((err) => {
  console.error('Test run failed:', err);
  process.exit(1);
});
