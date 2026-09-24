const puppeteer = require('puppeteer-core');
const path = require('path');

const ARTIFACT_DIR = '/Users/harshchouksey/.gemini/antigravity/brain/77e692e2-1f45-45ec-8b77-e98703246708';
const CHROME_PATH = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';

async function run() {
  console.log('=== PHASE 4: POLISH & TRUST VERIFICATION ===');
  const browser = await puppeteer.launch({
    executablePath: CHROME_PATH,
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 390, height: 844, deviceScaleFactor: 2, isMobile: true });

  await page.goto('http://localhost:3000', { waitUntil: 'networkidle0' });

  // Clean test setup
  await page.evaluate(() => {
    localStorage.clear();
    localStorage.setItem('zippy_mood_dismissed', 'true');
  });
  await page.reload({ waitUntil: 'networkidle0' });

  console.log('\n--- CHECK 1: DEFAULT ENGLISH SECTION LABELS ---');
  const enNavChips = await page.evaluate(() => {
    const buttons = Array.from(document.querySelectorAll('nav[aria-label="Menu Sections"] button'));
    return buttons.map(b => b.querySelector('span')?.innerText.trim());
  });
  console.log('English Nav Chips:', enNavChips);

  console.log('\n--- CHECK 2: HINDI TOGGLE ACTIVATION & NAME_HI DISPLAY ---');
  // Click Hindi toggle button
  await page.evaluate(() => {
    const hiBtn = Array.from(document.querySelectorAll('header button')).find(b => b.innerText.includes('हिन्दी'));
    hiBtn?.click();
  });
  await new Promise(r => setTimeout(r, 400));

  const hiNavChips = await page.evaluate(() => {
    const buttons = Array.from(document.querySelectorAll('nav[aria-label="Menu Sections"] button'));
    return buttons.map(b => b.querySelector('span')?.innerText.trim());
  });
  console.log('Hindi Nav Chips (nameHi):', hiNavChips);

  // Capture Hindi mode screenshot (TopBar + Section Chips)
  const hiScreenshot = path.join(ARTIFACT_DIR, 'phase4-hindi-mode-390px.png');
  await page.screenshot({ path: hiScreenshot });
  console.log('1. Captured Screenshot: Hindi Mode Nav & Section Titles ->', hiScreenshot);

  // Verify Italian fallback: Italian has no nameHi, so it must display 'Italian'
  const italianChip = hiNavChips.find(name => name === 'Italian');
  console.log('Italian fallback check (nameHi undefined -> fallback to Italian):', Boolean(italianChip));

  // Verify dish names are NOT machine-translated
  const dishSample = await page.evaluate(() => {
    const articles = Array.from(document.querySelectorAll('[role="article"]')).slice(0, 5);
    return articles.map(a => a.querySelector('h4')?.innerText);
  });
  console.log('Dish names sample in Hindi mode (MUST remain untranslated):', dishSample);

  console.log('\n--- CHECK 3: CELEBRATE EVENTS CARD ---');
  // Scroll down to Celebrate Card and About block
  const celebrateDetails = await page.evaluate(() => {
    const card = document.querySelector('section[aria-label="Celebrate with us"]');
    const title = card?.querySelector('h3')?.innerText;
    const text = card?.querySelector('p')?.innerText;
    const cta = card?.querySelector('a');
    return {
      exists: Boolean(card),
      title,
      text,
      ctaText: cta?.innerText.trim(),
      whatsappHref: cta?.getAttribute('href'),
    };
  });
  console.log('Celebrate Card Details:', celebrateDetails);

  console.log('\n--- CHECK 4: ABOUT BLOCK (AMENITIES & TRUST) ---');
  const aboutDetails = await page.evaluate(() => {
    const about = document.querySelector('section[aria-label="About Zippyfeed Bhopal"]');
    const title = about?.querySelector('h2')?.innerText;
    const amenities = Array.from(about?.querySelectorAll('.p-3') || []).map(el => el.querySelector('h3')?.innerText);
    return {
      exists: Boolean(about),
      title,
      amenities,
    };
  });
  console.log('About Block Details:', aboutDetails);

  // Scroll to Celebrate + About
  await page.evaluate(() => {
    const card = document.querySelector('section[aria-label="Celebrate with us"]');
    card?.scrollIntoView({ behavior: 'instant', block: 'start' });
  });
  await new Promise(r => setTimeout(r, 400));
  const celebrateScreenshot = path.join(ARTIFACT_DIR, 'phase4-celebrate-about-390px.png');
  await page.screenshot({ path: celebrateScreenshot });
  console.log('2. Captured Screenshot: Celebrate Card & About Block ->', celebrateScreenshot);

  console.log('\n--- CHECK 5: FOOTER & GOOGLE REVIEW NUDGE ---');
  // Scroll to bottom
  await page.evaluate(() => {
    window.scrollTo(0, document.body.scrollHeight);
  });
  await new Promise(r => setTimeout(r, 400));

  const footerDetails = await page.evaluate(() => {
    const footer = document.querySelector('footer');
    const callLink = footer?.querySelector('a[href^="tel:"]')?.getAttribute('href');
    const waLink = footer?.querySelector('a[href*="wa.me"]')?.getAttribute('href');
    const mapsLink = footer?.querySelector('a[href*="maps.app"]')?.getAttribute('href');
    const instaLink = footer?.querySelector('a[href*="instagram.com"]')?.getAttribute('href');
    const reviewLink = footer?.querySelector('a[href*="review"]')?.getAttribute('href');
    const reviewText = footer?.querySelector('h4')?.innerText;
    const lastUpdated = footer?.innerText.includes('Menu updated: 2026-09-24');
    return {
      callLink,
      waLink,
      mapsLink,
      instaLink,
      reviewLink,
      reviewText,
      hasLastUpdated: lastUpdated,
    };
  });
  console.log('Footer Details:', footerDetails);

  const footerScreenshot = path.join(ARTIFACT_DIR, 'phase4-footer-review-390px.png');
  await page.screenshot({ path: footerScreenshot });
  console.log('3. Captured Screenshot: Footer Contact & Review Nudge ->', footerScreenshot);

  console.log('\n=== ALL PHASE 4 CHECKS COMPLETED ===');
  await browser.close();
}

run().catch((err) => {
  console.error('Phase 4 verification error:', err);
  process.exit(1);
});
