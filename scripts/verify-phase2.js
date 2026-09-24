const puppeteer = require('puppeteer-core');
const path = require('path');

const chromePath = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
const brainDir = '/Users/harshchouksey/.gemini/antigravity/brain/77e692e2-1f45-45ec-8b77-e98703246708';

async function main() {
  console.log('=== PHASE 2: THE VEG SWITCH VERIFICATION ===');
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

  // Navigate to app
  await page.goto('http://localhost:3000', { waitUntil: 'networkidle0' });

  // 1. Capture State A: OFF (Default)
  console.log('1. Capturing State A (Veg only OFF)...');
  await page.screenshot({
    path: path.join(brainDir, 'phase2-veg-off-390px.png'),
    fullPage: false,
  });

  // 2. Click the Veg only toggle in TopBar
  console.log('2. Toggling "Veg only" ON...');
  const vegSwitch = await page.$('button[role="switch"]');
  if (!vegSwitch) throw new Error('Veg toggle button not found!');
  await vegSwitch.click();
  await new Promise((r) => setTimeout(r, 400));

  // 3. Capture State B: ON (Veg only active)
  console.log('3. Capturing State B (Veg only ON)...');
  await page.screenshot({
    path: path.join(brainDir, 'phase2-veg-on-390px.png'),
    fullPage: false,
  });

  // 4. Capture Scrolled Down State: Confirm toggle is still reachable and active
  console.log('4. Capturing Scrolled Down State (Sticky header with active toggle)...');
  await page.evaluate(() => window.scrollTo(0, 1200));
  await new Promise((r) => setTimeout(r, 400));
  await page.screenshot({
    path: path.join(brainDir, 'phase2-scrolled-toggle-reachable.png'),
    fullPage: false,
  });

  // Scroll back to top for search tests
  await page.evaluate(() => window.scrollTo(0, 0));
  await new Promise((r) => setTimeout(r, 200));

  // 5. Verification Check 1: DOM-Level Counts with Veg only ON
  console.log('\n--- CHECK 1: DOM-LEVEL COUNTS (VEG ONLY ON) ---');
  const domCounts = await page.evaluate(() => {
    const sections = Array.from(document.querySelectorAll('section[data-section-id]'));
    const sectionBreakdown = sections.map((sec) => {
      const name = sec.querySelector('h2')?.innerText || sec.id;
      const rows = sec.querySelectorAll('[role="article"]').length;
      return { id: sec.id, name, count: rows };
    });

    const totalRows = document.querySelectorAll('[role="article"]').length;
    const nonVegMarkCount = document.querySelectorAll('[aria-label="Non-Vegetarian"]').length;
    const vegMarkCount = document.querySelectorAll('[aria-label="Vegetarian"]').length;

    return {
      totalRows,
      nonVegMarkCount,
      vegMarkCount,
      sectionBreakdown,
    };
  });

  console.log(`Total rendered item rows in DOM: ${domCounts.totalRows}`);
  console.log(`Non-veg FSSAI marks in DOM:       ${domCounts.nonVegMarkCount} (MUST BE 0)`);
  console.log(`Veg FSSAI marks in DOM:           ${domCounts.vegMarkCount}`);
  console.log('Per section breakdown in DOM:');
  domCounts.sectionBreakdown.forEach((s) => {
    console.log(`  • ${s.name}: ${s.count}`);
  });

  // 6. Verification Check 2: Two specific non-veg groups completely removed
  console.log('\n--- CHECK 3: NON-VEG GROUPS REMOVAL ---');
  const groupCheck = await page.evaluate(() => {
    const allHeaders = Array.from(document.querySelectorAll('h3')).map((h) => h.innerText.toLowerCase());
    const hasPizzaNonVeg = allHeaders.some((t) => t.includes('pizza — non veg') || t.includes('pizza - non veg'));
    const hasMainNonVeg = allHeaders.some((t) => t.includes('main course — non veg') || t.includes('main course - non veg'));

    const emptyCards = Array.from(document.querySelectorAll('.rounded-2xl')).filter(
      (c) => c.querySelectorAll('[role="article"]').length === 0
    ).length;

    return {
      hasPizzaNonVeg,
      hasMainNonVeg,
      emptyCards,
    };
  });
  console.log(`Pizza Non-Veg group header present in DOM: ${groupCheck.hasPizzaNonVeg ? 'YES (FAIL)' : 'NO (PASSED - completely removed)'}`);
  console.log(`Main Course Non-Veg header present in DOM: ${groupCheck.hasMainNonVeg ? 'YES (FAIL)' : 'NO (PASSED - completely removed)'}`);
  console.log(`Empty group cards left behind:            ${groupCheck.emptyCards} (MUST BE 0)`);

  // 7. Verification Check 3: Search Leakage Test
  console.log('\n--- CHECK 2: SEARCH LEAKAGE TEST (VEG ONLY ON) ---');
  const searchTerms = ['chicken', 'mutton', 'egg', 'fish', 'pomfret', 'katsu', 'gogi'];
  const searchInput = await page.$('input[type="text"]');
  const searchResultsMap = {};

  for (const term of searchTerms) {
    await searchInput.click({ clickCount: 3 });
    await searchInput.type(term);
    await new Promise((r) => setTimeout(r, 200));

    const res = await page.evaluate(() => {
      const renderedResults = document.querySelectorAll('main [role="article"]').length;
      const emptyStateVisible = document.querySelector('h3')?.innerText.includes('Koi dish nahi mili');
      return { renderedResults, emptyStateVisible };
    });
    searchResultsMap[term] = res;
    console.log(`  • Search "${term}": ${res.renderedResults} results (Empty state shown: ${res.emptyStateVisible})`);
  }

  // Clear search
  await searchInput.click({ clickCount: 3 });
  await page.keyboard.press('Backspace');
  await new Promise((r) => setTimeout(r, 200));

  // 8. Verification Check 4: LocalStorage Persistence
  console.log('\n--- CHECK 4: LOCALSTORAGE PERSISTENCE ---');
  const storedValBefore = await page.evaluate(() => localStorage.getItem('zippy_veg_only'));
  console.log(`localStorage.getItem('zippy_veg_only') before reload: "${storedValBefore}"`);

  console.log('Reloading page...');
  await page.reload({ waitUntil: 'networkidle0' });
  await new Promise((r) => setTimeout(r, 400));

  const stateAfterReload = await page.evaluate(() => {
    const isSwitchChecked = document.querySelector('button[role="switch"]')?.getAttribute('aria-checked');
    const totalRows = document.querySelectorAll('[role="article"]').length;
    const nonVegMarks = document.querySelectorAll('[aria-label="Non-Vegetarian"]').length;
    const stripText = document.querySelector('aside')?.innerText.replace(/\s+/g, ' ').trim();
    return { isSwitchChecked, totalRows, nonVegMarks, stripText };
  });

  console.log(`Switch aria-checked after reload: ${stateAfterReload.isSwitchChecked} (MUST BE "true")`);
  console.log(`Total visible items after reload: ${stateAfterReload.totalRows} (MUST BE 212)`);
  console.log(`Non-veg marks after reload:       ${stateAfterReload.nonVegMarks} (MUST BE 0)`);
  console.log(`Confirmation strip text:         "${stateAfterReload.stripText}"`);

  await browser.close();
  console.log('\n=== ALL PHASE 2 CHECKS COMPLETED ===');
}

main().catch((err) => {
  console.error('Test run failed:', err);
  process.exit(1);
});
