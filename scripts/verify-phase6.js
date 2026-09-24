const puppeteer = require('puppeteer-core');
const path = require('path');
const fs = require('fs');
const http = require('http');

const CHROME_PATH = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
const ARTIFACTS_DIR = '/Users/harshchouksey/.gemini/antigravity/brain/77e692e2-1f45-45ec-8b77-e98703246708';
const BASE_URL = 'http://localhost:3000';

async function verify() {
  console.log('--- STARTING PHASE 6 VERIFICATION: ANALYTICS & INSIGHTS ---');

  // 1. Test /api/track endpoint with HTTP POST
  console.log('\n1. Testing /api/track with live events...');
  const testEvents = [
    { event: 'dish_tap', data: { itemId: 'cmb-1', itemName: 'Aloo Tikki Burger (Double Patty) + Virgin Mojito', price: 299, veg: true } },
    { event: 'search_query', data: { query: 'dimsum', resultCount: 0, vegOnly: false } },
    { event: 'veg_toggle', data: { vegOnly: true } },
    { event: 'mood_choice', data: { moodId: 'bhook', moodLabel: 'Bhook zyada hai' } },
    { event: 'outbound_tap', data: { type: 'whatsapp', context: 'tray_list' } },
  ];

  for (const ev of testEvents) {
    const postData = JSON.stringify({
      ...ev,
      timestamp: Date.now(),
      sessionId: 'test_session_phase6',
    });

    await new Promise((resolve, reject) => {
      const req = http.request(
        'http://127.0.0.1:3000/api/track',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Content-Length': Buffer.byteLength(postData),
          },
        },
        (res) => {
          if (res.statusCode === 200) resolve();
          else reject(new Error(`Failed with status ${res.statusCode}`));
        }
      );
      req.on('error', reject);
      req.write(postData);
      req.end();
    });
  }
  console.log('✓ Successfully sent 5 live tracking events to /api/track');

  // 2. Test /api/insights API
  console.log('\n2. Testing /api/insights?days=30 API...');
  const insightsResponse = await new Promise((resolve, reject) => {
    http.get('http://127.0.0.1:3000/api/insights?days=30', (res) => {
      let raw = '';
      res.on('data', (chunk) => (raw += chunk));
      res.on('end', () => {
        try {
          resolve(JSON.parse(raw));
        } catch (e) {
          reject(e);
        }
      });
    }).on('error', reject);
  });

  console.log(`✓ Total Events: ${insightsResponse.totalEvents}`);
  console.log(`✓ Unique Sessions: ${insightsResponse.uniqueSessions}`);
  console.log(`✓ Veg Switch Usage Rate: ${insightsResponse.vegSwitchRate}%`);
  console.log(`✓ Top Dishes Count: ${insightsResponse.topDishes.length} (Expected: 20)`);
  console.log(`✓ Top 1 Dish: ${insightsResponse.topDishes[0]?.itemName} (${insightsResponse.topDishes[0]?.views} views)`);
  console.log(`✓ Top 1 Reel Idea: "${insightsResponse.topDishes[0]?.reelIdea}"`);
  console.log(`✓ Top Searches Count: ${insightsResponse.topSearches.length}`);
  const unmetSearches = insightsResponse.topSearches.filter((s) => s.isUnmetDemand);
  console.log(`✓ Unmet Demand Searches (0 Results): ${unmetSearches.map((s) => s.query).join(', ')}`);

  if (insightsResponse.topDishes.length !== 20) {
    throw new Error(`Expected exactly 20 top dishes, got ${insightsResponse.topDishes.length}`);
  }

  // 3. Launch Puppeteer to verify /insights UI and capture screenshots
  console.log('\n3. Testing /insights UI in headless Chrome...');
  const browser = await puppeteer.launch({
    executablePath: CHROME_PATH,
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  });

  // A) Mobile Viewport (390px) — Test PIN Lock screen
  const mobilePage = await browser.newPage();
  await mobilePage.setViewport({ width: 390, height: 844, deviceScaleFactor: 2, isMobile: true });
  await mobilePage.goto(`${BASE_URL}/insights`, { waitUntil: 'networkidle2' });

  await mobilePage.screenshot({
    path: path.join(ARTIFACTS_DIR, 'phase6-insights-lock-390px.png'),
  });
  console.log('Saved phase6-insights-lock-390px.png (PIN lock screen)');

  // Submit PIN 1200
  console.log('Entering PIN 1200 to unlock insights...');
  await mobilePage.type('#pin-input', '1200');
  await mobilePage.click('button[type="submit"]');
  await mobilePage.waitForSelector('h2', { timeout: 5000 });

  // Mobile Screenshots of Unlocked Dashboard
  await mobilePage.screenshot({
    path: path.join(ARTIFACTS_DIR, 'phase6-insights-mobile-top-390px.png'),
  });
  console.log('Saved phase6-insights-mobile-top-390px.png (Dashboard top & stats)');

  // Scroll to Instagram Reels section
  await mobilePage.evaluate(() => {
    window.scrollBy(0, 500);
  });
  await mobilePage.screenshot({
    path: path.join(ARTIFACTS_DIR, 'phase6-insights-reels-390px.png'),
  });
  console.log('Saved phase6-insights-reels-390px.png (Top 20 Reels candidates)');

  // Scroll to Search Trends & Unmet Demand
  await mobilePage.evaluate(() => {
    window.scrollBy(0, 800);
  });
  await mobilePage.screenshot({
    path: path.join(ARTIFACTS_DIR, 'phase6-insights-search-demand-390px.png'),
  });
  console.log('Saved phase6-insights-search-demand-390px.png (Search Trends & Unmet Demand)');

  // B) Desktop Viewport (1024px) for Complete Overview
  const desktopPage = await browser.newPage();
  await desktopPage.setViewport({ width: 1024, height: 900, deviceScaleFactor: 1.5 });
  await desktopPage.goto(`${BASE_URL}/insights?pin=1200`, { waitUntil: 'networkidle2' });
  await desktopPage.waitForSelector('h2', { timeout: 5000 });

  await desktopPage.screenshot({
    path: path.join(ARTIFACTS_DIR, 'phase6-insights-desktop.png'),
  });
  console.log('Saved phase6-insights-desktop.png (Full desktop manager view)');

  await browser.close();

  // Write verification report
  fs.writeFileSync(
    path.join(ARTIFACTS_DIR, 'phase6-verification-result.json'),
    JSON.stringify(
      {
        totalEvents: insightsResponse.totalEvents,
        uniqueSessions: insightsResponse.uniqueSessions,
        vegSwitchRate: insightsResponse.vegSwitchRate,
        topDishesCount: insightsResponse.topDishes.length,
        top5Dishes: insightsResponse.topDishes.slice(0, 5),
        topSearchesCount: insightsResponse.topSearches.length,
        unmetSearches,
        moodBreakdown: insightsResponse.moodBreakdown,
        trayStats: insightsResponse.trayStats,
        conversions: insightsResponse.conversions,
      },
      null,
      2
    )
  );

  console.log('\n--- PHASE 6 VERIFICATION COMPLETED SUCCESSFULLY ---');
}

verify().catch((err) => {
  console.error('Phase 6 Verification Failed:', err);
  process.exit(1);
});
