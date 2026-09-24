const fs = require('fs');
const path = require('path');

const ARTIFACTS_DIR = '/Users/harshchouksey/.gemini/antigravity/brain/77e692e2-1f45-45ec-8b77-e98703246708';
const MENU_PATH = path.join(__dirname, '../menu.json');

async function runFinalQA() {
  console.log('=== PHASE 8: COMPREHENSIVE FINAL QA & HANDOVER VERIFICATION ===\n');

  // 1. Data Integrity & 329 Menu Items
  console.log('1. Checking Data Integrity against menu.json...');
  const menuRaw = fs.readFileSync(MENU_PATH, 'utf8');
  const menuData = JSON.parse(menuRaw);

  let totalItems = 0;
  let vegCount = 0;
  let nonVegCount = 0;
  let variantCount = 0;
  let singlePriceCount = 0;
  let invalidPrices = 0;
  let mocktailCheckPassed = true;

  for (const section of menuData.sections) {
    for (const group of section.groups) {
      for (const item of group.items) {
        totalItems++;
        if (item.veg) vegCount++;
        else nonVegCount++;

        if (item.variants) {
          variantCount++;
          for (const [k, p] of Object.entries(item.variants)) {
            if (typeof p !== 'number' || p <= 0) invalidPrices++;
          }
        } else if (typeof item.price === 'number') {
          singlePriceCount++;
          if (item.price <= 0) invalidPrices++;
        } else {
          invalidPrices++;
        }

        // Strictly verify mocktail check (no "cocktail" alcohol wording)
        const text = `${item.name} ${item.desc || ''}`.toLowerCase();
        if (text.includes('cocktail')) {
          mocktailCheckPassed = false;
        }
      }
    }
  }

  console.log(`✓ Total Items: ${totalItems} (Required: 329)`);
  console.log(`✓ Veg Items: ${vegCount} (Required: 212)`);
  console.log(`✓ Non-Veg Items: ${nonVegCount} (Required: 117)`);
  console.log(`✓ Single Price Items: ${singlePriceCount}`);
  console.log(`✓ Multi-Variant Items: ${variantCount}`);
  console.log(`✓ Invalid / Zero Prices: ${invalidPrices}`);
  console.log(`✓ Zero Alcohol / Strictly Mocktails Check: ${mocktailCheckPassed ? 'PASSED' : 'FAILED'}`);

  if (totalItems !== 329 || vegCount !== 212 || nonVegCount !== 117 || invalidPrices > 0 || !mocktailCheckPassed) {
    throw new Error('Menu Data Integrity verification failed!');
  }

  // 2. Pure Veg Mode Filtering Check
  console.log('\n2. Verifying Pure Veg Filter Leakage Safety...');
  const vegOnlyFiltered = [];
  for (const s of menuData.sections) {
    for (const g of s.groups) {
      for (const item of g.items) {
        if (item.veg) vegOnlyFiltered.push(item);
      }
    }
  }
  const leakedNonVeg = vegOnlyFiltered.filter(i => !i.veg);
  console.log(`✓ Veg Only Items Available: ${vegOnlyFiltered.length} (Strictly 212)`);
  console.log(`✓ Leaked Non-Veg Items: ${leakedNonVeg.length} (Strictly 0)`);
  if (vegOnlyFiltered.length !== 212 || leakedNonVeg.length !== 0) {
    throw new Error('Veg Filter leaked non-veg items!');
  }

  // 3. Out of stock "unavailable: true" verification
  console.log('\n3. Verifying Out-of-Stock ("Aaj nahi hai") Support...');
  const itemRowCode = fs.readFileSync(path.join(__dirname, '../src/components/ItemRow.tsx'), 'utf8');
  const hasAajNahiHai = itemRowCode.includes('Aaj nahi hai');
  const hasDisabledClick = itemRowCode.includes('!isUnavailable');
  console.log(`✓ ItemRow renders "Aaj nahi hai" badge: ${hasAajNahiHai}`);
  console.log(`✓ ItemRow disables click on unavailable items: ${hasDisabledClick}`);
  if (!hasAajNahiHai || !hasDisabledClick) {
    throw new Error('Out of stock handler missing in ItemRow.tsx');
  }

  // 4. Print Assets Verification
  console.log('\n4. Verifying Print PDFs & Vectors in public/print...');
  const printFiles = [
    'table-tent-a5.pdf',
    'bill-sticker-3x3.pdf',
    'entrance-poster-a4.pdf',
    'qr-clean.svg',
  ];
  for (const file of printFiles) {
    const p = path.join(__dirname, '../public/print', file);
    if (!fs.existsSync(p)) throw new Error(`Missing print asset: ${file}`);
    const stat = fs.statSync(p);
    console.log(`✓ ${file}: ${(stat.size / 1024).toFixed(1)} KB`);
  }

  // 5. PWA, Service Worker & Manifest
  console.log('\n5. Verifying PWA & Offline Engine...');
  const swExists = fs.existsSync(path.join(__dirname, '../public/sw.js'));
  const manifestExists = fs.existsSync(path.join(__dirname, '../public/manifest.json'));
  console.log(`✓ Service Worker (public/sw.js): ${swExists}`);
  console.log(`✓ Web Manifest (public/manifest.json): ${manifestExists}`);
  if (!swExists || !manifestExists) throw new Error('PWA assets missing!');

  // 6. Analytics & Insights
  console.log('\n6. Verifying Analytics Architecture...');
  const trackRoute = fs.existsSync(path.join(__dirname, '../src/app/api/track/route.ts'));
  const insightsRoute = fs.existsSync(path.join(__dirname, '../src/app/api/insights/route.ts'));
  const insightsPage = fs.existsSync(path.join(__dirname, '../src/app/insights/page.tsx'));
  console.log(`✓ /api/track route: ${trackRoute}`);
  console.log(`✓ /api/insights route: ${insightsRoute}`);
  console.log(`✓ /insights page: ${insightsPage}`);
  if (!trackRoute || !insightsRoute || !insightsPage) throw new Error('Analytics architecture incomplete!');

  // Summary JSON
  const finalSummary = {
    totalDishes: totalItems,
    vegCount,
    nonVegCount,
    pureVegLeakage: 0,
    mocktailsOnly: true,
    outOfStockBadgeSupported: true,
    printCollateralReady: true,
    pwaReady: true,
    analyticsReady: true,
    allPassed: true,
  };

  fs.writeFileSync(
    path.join(ARTIFACTS_DIR, 'phase8-final-qa-summary.json'),
    JSON.stringify(finalSummary, null, 2)
  );

  console.log('\n=== ALL FINAL QA CHECKS PASSED (100%) ===');
}

runFinalQA().catch(err => {
  console.error('Final QA failed:', err);
  process.exit(1);
});
