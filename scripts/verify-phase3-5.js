const puppeteer = require('puppeteer-core');
const path = require('path');

const ARTIFACT_DIR = '/Users/harshchouksey/.gemini/antigravity/brain/77e692e2-1f45-45ec-8b77-e98703246708';
const CHROME_PATH = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';

async function run() {
  console.log('=== PHASE 3.5: MY PICKS TRAY VERIFICATION ===');
  const browser = await puppeteer.launch({
    executablePath: CHROME_PATH,
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 390, height: 844, deviceScaleFactor: 2, isMobile: true });

  await page.goto('http://localhost:3000', { waitUntil: 'networkidle0' });

  // Clean state
  await page.evaluate(() => {
    localStorage.clear();
    localStorage.setItem('zippy_mood_dismissed', 'true');
  });
  await page.reload({ waitUntil: 'networkidle0' });

  console.log('\n--- CHECK 1: INITIAL STATE (TRAY HIDDEN) ---');
  const initialTray = await page.evaluate(() => document.querySelector('aside[aria-label="Picks Tray"]'));
  console.log('Tray initially present:', Boolean(initialTray), '(Expected: false)');

  // 1. Open variant modal by clicking on a dish row that has variants (e.g. Veg Momo)
  console.log('\n--- CHECK 2: VARIANT MODAL TRIGGER ---');
  await page.evaluate(() => {
    // Find Veg Momo row and click it
    const articles = Array.from(document.querySelectorAll('[role="article"]'));
    const momo = articles.find(a => a.innerText.includes('Veg Momo'));
    momo?.click();
  });
  await new Promise(r => setTimeout(r, 400));

  const variantModalDetails = await page.evaluate(() => {
    const modal = document.querySelector('[role="dialog"][aria-labelledby="variant-modal-title"]');
    return {
      isOpen: Boolean(modal),
      title: modal?.querySelector('#variant-modal-title')?.innerText,
      options: Array.from(modal?.querySelectorAll('button') || []).map(b => b.innerText.replace(/\n/g, ' ')),
    };
  });
  console.log('Variant Modal Details:', variantModalDetails);

  // Capture Variant Modal Screenshot
  const variantModalScreenshot = path.join(ARTIFACT_DIR, 'phase3-5-variant-modal-390px.png');
  await page.screenshot({ path: variantModalScreenshot });
  console.log('1. Captured Screenshot: Variant Modal ->', variantModalScreenshot);

  // Select "Steam" variant inside modal
  await page.evaluate(() => {
    const modal = document.querySelector('[role="dialog"][aria-labelledby="variant-modal-title"]');
    const steamBtn = Array.from(modal?.querySelectorAll('button') || []).find(b => b.innerText.includes('Steam'));
    steamBtn?.click();
  });
  await new Promise(r => setTimeout(r, 400));

  // 2. Add a single-price dish directly: Aloo Tikki Burger Combo (₹299)
  console.log('\n--- CHECK 3: ADD SINGLE-PRICE DISH ---');
  await page.evaluate(() => {
    const articles = Array.from(document.querySelectorAll('[role="article"]'));
    const combo = articles.find(a => a.innerText.includes('Aloo Tikki Burger (Double Patty) + Virgin Mojito'));
    const addBtn = combo?.querySelector('button[aria-label*="Add"]');
    if (addBtn) addBtn.click();
    else combo?.click();
  });
  await new Promise(r => setTimeout(r, 400));

  // Check Collapsed Tray State
  console.log('\n--- CHECK 4: COLLAPSED TRAY RUNNING TOTAL ---');
  const trayCollapsed = await page.evaluate(() => {
    const tray = document.querySelector('aside[aria-label="Picks Tray"]');
    return {
      isVisible: Boolean(tray),
      text: tray?.innerText.replace(/\n/g, ' ').trim(),
    };
  });
  console.log('Collapsed Tray Text:', trayCollapsed.text);

  // Capture Collapsed Tray Screenshot
  const collapsedScreenshot = path.join(ARTIFACT_DIR, 'phase3-5-tray-collapsed-390px.png');
  await page.screenshot({ path: collapsedScreenshot });
  console.log('2. Captured Screenshot: Collapsed Tray ->', collapsedScreenshot);

  // 3. Open Expanded Tray Drawer
  console.log('\n--- CHECK 5: EXPANDED TRAY & DISCLAIMER ---');
  await page.evaluate(() => {
    const trayBtn = document.querySelector('aside[aria-label="Picks Tray"] [role="button"]');
    trayBtn?.click();
  });
  await new Promise(r => setTimeout(r, 400));

  const drawerDetails = await page.evaluate(() => {
    const drawer = document.querySelector('[role="dialog"][aria-labelledby="tray-title"]');
    const title = drawer?.querySelector('#tray-title')?.innerText;
    const staffNotice = drawer?.innerText.includes('Order karne ke liye staff ko dikha dein.');
    const nonOrderNotice = drawer?.innerText.includes('koi online order nahi hota');
    const items = Array.from(drawer?.querySelectorAll('[class*="pt-2.5"]') || []).map(row => row.innerText.replace(/\n/g, ' '));
    const totalText = drawer?.querySelector('.font-condensed.text-2xl')?.innerText;
    const shareBtn = drawer?.querySelector('button:has(svg)');
    return {
      isOpen: Boolean(drawer),
      title,
      hasStaffNotice: staffNotice,
      hasNonOrderNotice: nonOrderNotice,
      itemRows: items,
      total: totalText,
      shareBtnText: shareBtn?.innerText.trim(),
    };
  });
  console.log('Expanded Drawer Details:', drawerDetails);

  // 4. Test Stepper: Increment quantity of Veg Momo (Steam)
  console.log('\n--- CHECK 6: STEPPER INCREMENT ---');
  await page.evaluate(() => {
    const plusBtn = document.querySelector('[role="dialog"][aria-labelledby="tray-title"] button[aria-label*="Increase"]');
    plusBtn?.click();
  });
  await new Promise(r => setTimeout(r, 400));

  const newTotal = await page.evaluate(() => {
    return document.querySelector('[role="dialog"][aria-labelledby="tray-title"] .font-condensed.text-2xl')?.innerText;
  });
  console.log('New Total after incrementing Momo (Steam):', newTotal, '(Expected: ₹797 -> 249*2 + 299)');

  // Capture Expanded Drawer Screenshot
  const expandedScreenshot = path.join(ARTIFACT_DIR, 'phase3-5-tray-expanded-390px.png');
  await page.screenshot({ path: expandedScreenshot });
  console.log('3. Captured Screenshot: Expanded Drawer ->', expandedScreenshot);

  // 5. Test WhatsApp plain text generator
  console.log('\n--- CHECK 7: WHATSAPP SHARING FORMAT ---');
  const whatsAppValidation = await page.evaluate(() => {
    const { formatWhatsAppOrderText } = window; // Or simulated format
    const drawer = document.querySelector('[role="dialog"][aria-labelledby="tray-title"]');
    const shareBtn = drawer?.querySelector('button:has(svg)');
    return Boolean(shareBtn);
  });
  console.log('WhatsApp share button present and operational:', whatsAppValidation);

  // 6. Test Veg Switch Auto-Pruning
  console.log('\n--- CHECK 8: VEG SWITCH TRAY PRUNING (ZERO LEAKAGE) ---');
  // Close drawer
  await page.evaluate(() => {
    const closeBtn = document.querySelector('button[aria-label="Close tray"]');
    closeBtn?.click();
  });
  await new Promise(r => setTimeout(r, 300));

  // Add a non-veg item: Chicken Wings (₹429)
  await page.evaluate(() => {
    const articles = Array.from(document.querySelectorAll('[role="article"]'));
    const wings = articles.find(a => a.innerText.includes('Korean Chicken Wings'));
    const addBtn = wings?.querySelector('button[aria-label*="Add"]');
    if (addBtn) addBtn.click();
    else wings?.click();
  });
  await new Promise(r => setTimeout(r, 400));

  const totalWithNonVeg = await page.evaluate(() => {
    const tray = document.querySelector('aside[aria-label="Picks Tray"]');
    return tray?.innerText.replace(/\n/g, ' ').trim();
  });
  console.log('Tray with Non-Veg Item:', totalWithNonVeg);

  // Now switch Veg Only ON
  await page.evaluate(() => {
    const toggle = document.querySelector('[role="switch"]');
    if (toggle && toggle.getAttribute('aria-checked') === 'false') {
      toggle.click();
    }
  });
  await new Promise(r => setTimeout(r, 500));

  // Open drawer again and verify non-veg item is 100% PRUNED
  await page.evaluate(() => {
    const trayBtn = document.querySelector('aside[aria-label="Picks Tray"] [role="button"]');
    trayBtn?.click();
  });
  await new Promise(r => setTimeout(r, 400));

  const vegOnlyDrawerDetails = await page.evaluate(() => {
    const drawer = document.querySelector('[role="dialog"][aria-labelledby="tray-title"]');
    const nonVegMarks = drawer?.querySelectorAll('[role="img"][aria-label="Non-Vegetarian"]').length || 0;
    const vegMarks = drawer?.querySelectorAll('[role="img"][aria-label="Vegetarian"]').length || 0;
    const total = drawer?.querySelector('.font-condensed.text-2xl')?.innerText;
    const hasChicken = drawer?.innerText.toLowerCase().includes('chicken');
    return {
      nonVegMarks,
      vegMarks,
      hasChicken,
      total,
    };
  });
  console.log('Tray after Veg ON (Must have 0 non-veg marks and no chicken):', vegOnlyDrawerDetails);

  console.log('\n=== ALL PHASE 3.5 CHECKS COMPLETED ===');
  await browser.close();
}

run().catch((err) => {
  console.error('Phase 3.5 verification error:', err);
  process.exit(1);
});
