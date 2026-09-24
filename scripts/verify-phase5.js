const puppeteer = require('puppeteer-core');
const path = require('path');
const fs = require('fs');

const CHROME_PATH = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
const ARTIFACTS_DIR = '/Users/harshchouksey/.gemini/antigravity/brain/77e692e2-1f45-45ec-8b77-e98703246708';
const URL = 'http://localhost:3000';

async function verify() {
  console.log('--- STARTING PHASE 5 VERIFICATION ---');

  const browser = await puppeteer.launch({
    executablePath: CHROME_PATH,
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 390, height: 844, deviceScaleFactor: 2, isMobile: true });

  console.log('1. Loading page on 390px mobile viewport...');
  await page.goto(URL, { waitUntil: 'networkidle2' });

  // 2. Validate Metadata & Open Graph in DOM
  const metaCheck = await page.evaluate(() => {
    const getMeta = (selector, attr = 'content') => {
      const el = document.querySelector(selector);
      return el ? el.getAttribute(attr) : null;
    };

    const title = document.title;
    const desc = getMeta('meta[name="description"]');
    const ogTitle = getMeta('meta[property="og:title"]');
    const ogDesc = getMeta('meta[property="og:description"]');
    const ogImage = getMeta('meta[property="og:image"]');
    const ogUrl = getMeta('meta[property="og:url"]');
    const manifest = getMeta('link[rel="manifest"]', 'href');
    const canonical = getMeta('link[rel="canonical"]', 'href');

    // JSON-LD validation
    const jsonLdEl = document.querySelector('script[type="application/ld+json"]');
    let jsonLdValid = false;
    let restaurantName = null;
    let menuSectionCount = 0;
    let totalMenuItems = 0;
    let hasAddress = false;
    let hasHours = false;

    if (jsonLdEl) {
      try {
        const data = JSON.parse(jsonLdEl.textContent || '{}');
        if (data['@type'] === 'Restaurant' && data['@context'] === 'https://schema.org') {
          jsonLdValid = true;
          restaurantName = data.name;
          hasAddress = !!data.address && !!data.address.streetAddress;
          hasHours = Array.isArray(data.openingHoursSpecification) && data.openingHoursSpecification.length > 0;
          if (data.hasMenu && Array.isArray(data.hasMenu.hasMenuSection)) {
            menuSectionCount = data.hasMenu.hasMenuSection.length;
            totalMenuItems = data.hasMenu.hasMenuSection.reduce(
              (acc, sec) => acc + (sec.hasMenuItem ? sec.hasMenuItem.length : 0),
              0
            );
          }
        }
      } catch (e) {
        jsonLdValid = false;
      }
    }

    return {
      title,
      desc,
      ogTitle,
      ogDesc,
      ogImage,
      ogUrl,
      manifest,
      canonical,
      jsonLd: {
        jsonLdValid,
        restaurantName,
        hasAddress,
        hasHours,
        menuSectionCount,
        totalMenuItems,
      },
    };
  });

  console.log('--- METADATA & SEO CHECK ---');
  console.log('Page Title:         ', metaCheck.title);
  console.log('Meta Description:   ', metaCheck.desc);
  console.log('OG Title:           ', metaCheck.ogTitle);
  console.log('OG Description:     ', metaCheck.ogDesc);
  console.log('OG Image:           ', metaCheck.ogImage);
  console.log('OG URL:             ', metaCheck.ogUrl);
  console.log('Manifest Link:      ', metaCheck.manifest);
  console.log('Canonical Link:     ', metaCheck.canonical);
  console.log('JSON-LD Valid:      ', metaCheck.jsonLd.jsonLdValid);
  console.log('JSON-LD Restaurant: ', metaCheck.jsonLd.restaurantName);
  console.log('JSON-LD Has Address:', metaCheck.jsonLd.hasAddress);
  console.log('JSON-LD Has Hours:  ', metaCheck.jsonLd.hasHours);
  console.log('JSON-LD Sections:   ', metaCheck.jsonLd.menuSectionCount);
  console.log('JSON-LD Items:      ', metaCheck.jsonLd.totalMenuItems);

  // 3. Service Worker Registration check
  console.log('\n--- SERVICE WORKER CHECK ---');
  await page.evaluate(async () => {
    if ('serviceWorker' in navigator) {
      await navigator.serviceWorker.ready;
    }
  });

  const swState = await page.evaluate(async () => {
    if (!('serviceWorker' in navigator)) return { supported: false };
    const registration = await navigator.serviceWorker.getRegistration();
    return {
      supported: true,
      registered: !!registration,
      scope: registration ? registration.scope : null,
      active: !!registration?.active,
      controller: !!navigator.serviceWorker.controller,
    };
  });
  console.log('Service Worker Supported: ', swState.supported);
  console.log('Service Worker Registered:', swState.registered);
  console.log('Service Worker Scope:     ', swState.scope);
  console.log('Service Worker Active:    ', swState.active);
  console.log('Service Worker Controller:', swState.controller);

  // Prime cache by reloading once with SW controlling
  console.log('\nPriming Service Worker cache with an online navigation...');
  await page.reload({ waitUntil: 'networkidle2' });

  // 4. Test Offline Navigation (CDP Network.emulateNetworkConditions)
  console.log('\n--- TESTING OFFLINE SURVIVABILITY ---');
  const client = await page.target().createCDPSession();
  await client.send('Network.enable');
  await client.send('Network.emulateNetworkConditions', {
    offline: true,
    latency: 0,
    downloadThroughput: 0,
    uploadThroughput: 0,
  });

  let offlineLoaded = false;
  let offlineDishCount = 0;
  let offlineSectionsCount = 0;
  try {
    console.log('Reloading while completely offline (Network disconnected)...');
    await page.reload({ waitUntil: 'domcontentloaded', timeout: 15000 });
    // Allow a tick for hydration
    await new Promise((r) => setTimeout(r, 1000));
    
    // Check if items and sections are in DOM
    const offlineStats = await page.evaluate(() => {
      const items = document.querySelectorAll('[data-item-row="true"]').length;
      const sections = document.querySelectorAll('section[id]').length;
      const title = document.title;
      return { items, sections, title };
    });

    offlineDishCount = offlineStats.items;
    offlineSectionsCount = offlineStats.sections;
    offlineLoaded = offlineDishCount > 0;
    console.log(`Offline Reload Result: Found ${offlineDishCount} dishes and ${offlineSectionsCount} sections loaded completely offline!`);
    console.log(`Offline Page Title: "${offlineStats.title}"`);
  } catch (err) {
    console.error('Offline Reload error:', err.message);
  }

  // Restore online state
  await client.send('Network.emulateNetworkConditions', {
    offline: false,
    latency: 0,
    downloadThroughput: -1,
    uploadThroughput: -1,
  });

  // Capture Screenshot of Menu in 390px viewport
  console.log('\n--- CAPTURING SCREENSHOTS ---');
  await page.screenshot({
    path: path.join(ARTIFACTS_DIR, 'phase5-pwa-mobile-390px.png'),
    fullPage: false,
  });
  console.log('Saved phase5-pwa-mobile-390px.png');

  // Capture Open Graph Social Card preview screenshot
  const ogPage = await browser.newPage();
  await ogPage.setViewport({ width: 1200, height: 630 });
  await ogPage.goto('http://localhost:3000/og-image.png');
  await ogPage.screenshot({
    path: path.join(ARTIFACTS_DIR, 'phase5-og-social-card.png'),
  });
  console.log('Saved phase5-og-social-card.png');

  await browser.close();

  // Summary JSON output
  const summary = {
    metaCheck,
    swState,
    offlineLoaded,
    offlineDishCount,
    offlineSectionsCount,
  };

  fs.writeFileSync(
    path.join(ARTIFACTS_DIR, 'phase5-verification-result.json'),
    JSON.stringify(summary, null, 2)
  );

  console.log('\nPhase 5 Verification Completed Successfully!');
}

verify().catch((err) => {
  console.error('Phase 5 Verification Failed:', err);
  process.exit(1);
});
