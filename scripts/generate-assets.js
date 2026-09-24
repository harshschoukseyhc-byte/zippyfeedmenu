const puppeteer = require('puppeteer-core');
const path = require('path');
const fs = require('fs');

const CHROME_PATH = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
const PUBLIC_DIR = path.join(__dirname, '../public');

async function generate() {
  console.log('Generating PWA Icons & Open Graph Social Image...');

  const browser = await puppeteer.launch({
    executablePath: CHROME_PATH,
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  });

  const page = await browser.newPage();

  // 1. Generate 512x512 Icon
  await page.setViewport({ width: 512, height: 512, deviceScaleFactor: 1 });
  const icon512Html = `
    <!DOCTYPE html>
    <html>
      <head>
        <style>
          body {
            margin: 0;
            padding: 0;
            width: 512px;
            height: 512px;
            background: #9E0E16;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
            color: #FFFFFF;
            box-sizing: border-box;
            border: 12px solid #C9A227;
            border-radius: 96px;
            overflow: hidden;
          }
          .logo-mark {
            font-size: 160px;
            font-weight: 900;
            font-family: serif;
            color: #C9A227;
            line-height: 1;
            margin-bottom: 8px;
            text-shadow: 0 4px 12px rgba(0,0,0,0.3);
          }
          .brand-name {
            font-size: 42px;
            font-weight: 800;
            letter-spacing: -1px;
            color: #FFFFFF;
            text-transform: uppercase;
          }
          .sub {
            font-size: 20px;
            font-weight: 600;
            color: #FBF6EC;
            opacity: 0.9;
            letter-spacing: 4px;
            margin-top: 6px;
            text-transform: uppercase;
          }
          .outlet {
            margin-top: 14px;
            background: #E1251B;
            padding: 6px 20px;
            border-radius: 999px;
            font-size: 16px;
            font-weight: 700;
            letter-spacing: 2px;
            color: #FFFFFF;
            border: 1px solid #C9A227;
          }
        </style>
      </head>
      <body>
        <div class="logo-mark">Z</div>
        <div class="brand-name">Zippyfeed</div>
        <div class="sub">Cafe & Fine Dine</div>
        <div class="outlet">Bhopal #120</div>
      </body>
    </html>
  `;
  await page.setContent(icon512Html);
  await page.screenshot({ path: path.join(PUBLIC_DIR, 'icon-512.png') });
  console.log('Generated public/icon-512.png');

  // 2. Generate 192x192 Icon
  await page.setViewport({ width: 192, height: 192, deviceScaleFactor: 1 });
  const icon192Html = `
    <!DOCTYPE html>
    <html>
      <head>
        <style>
          body {
            margin: 0;
            padding: 0;
            width: 192px;
            height: 192px;
            background: #9E0E16;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
            color: #FFFFFF;
            box-sizing: border-box;
            border: 5px solid #C9A227;
            border-radius: 40px;
            overflow: hidden;
          }
          .logo-mark {
            font-size: 72px;
            font-weight: 900;
            font-family: serif;
            color: #C9A227;
            line-height: 1;
            margin-bottom: 2px;
          }
          .brand-name {
            font-size: 18px;
            font-weight: 800;
            color: #FFFFFF;
            letter-spacing: 0.5px;
          }
          .outlet {
            margin-top: 6px;
            background: #E1251B;
            padding: 2px 10px;
            border-radius: 999px;
            font-size: 10px;
            font-weight: 700;
            color: #FFFFFF;
          }
        </style>
      </head>
      <body>
        <div class="logo-mark">Z</div>
        <div class="brand-name">Zippyfeed</div>
        <div class="outlet">Outlet #120</div>
      </body>
    </html>
  `;
  await page.setContent(icon192Html);
  await page.screenshot({ path: path.join(PUBLIC_DIR, 'icon-192.png') });
  console.log('Generated public/icon-192.png');

  // 3. Generate 1200x630 Open Graph Image (WhatsApp & Social Preview)
  await page.setViewport({ width: 1200, height: 630, deviceScaleFactor: 1 });
  const ogHtml = `
    <!DOCTYPE html>
    <html>
      <head>
        <style>
          body {
            margin: 0;
            padding: 50px 70px;
            width: 1200px;
            height: 630px;
            background: #9E0E16;
            box-sizing: border-box;
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
            color: #FBF6EC;
            display: flex;
            flex-direction: column;
            justify-content: space-between;
            border: 8px solid #C9A227;
            position: relative;
            overflow: hidden;
          }
          .decor {
            position: absolute;
            right: -60px;
            bottom: -60px;
            font-size: 320px;
            opacity: 0.08;
            font-family: serif;
            font-weight: 900;
            color: #FFFFFF;
            pointer-events: none;
          }
          .top-row {
            display: flex;
            align-items: center;
            justify-content: space-between;
          }
          .badge-row {
            display: flex;
            gap: 12px;
            align-items: center;
          }
          .tag {
            background: rgba(255, 255, 255, 0.15);
            border: 1px solid rgba(201, 162, 39, 0.6);
            padding: 6px 18px;
            border-radius: 999px;
            font-size: 15px;
            font-weight: 700;
            letter-spacing: 1.5px;
            text-transform: uppercase;
            color: #FBF6EC;
          }
          .tag-highlight {
            background: #E1251B;
            border-color: #C9A227;
          }
          .center {
            margin-top: 15px;
          }
          h1 {
            margin: 0;
            font-family: Georgia, serif;
            font-size: 64px;
            font-weight: 800;
            color: #FFFFFF;
            letter-spacing: -1px;
            line-height: 1.1;
          }
          .loc {
            font-size: 24px;
            color: #C9A227;
            font-weight: 600;
            margin-top: 8px;
          }
          .desc {
            font-size: 22px;
            color: rgba(251, 246, 236, 0.9);
            line-height: 1.5;
            margin-top: 12px;
            max-width: 900px;
          }
          .bottom-bar {
            display: flex;
            align-items: center;
            justify-content: space-between;
            padding-top: 24px;
            border-top: 2px solid rgba(201, 162, 39, 0.4);
          }
          .amenities {
            display: flex;
            gap: 20px;
            font-size: 16px;
            font-weight: 600;
            color: rgba(255, 255, 255, 0.85);
          }
          .cta-pill {
            background: #25D366;
            color: #FFFFFF;
            padding: 10px 24px;
            border-radius: 12px;
            font-size: 18px;
            font-weight: 700;
            display: flex;
            align-items: center;
            gap: 8px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.25);
          }
        </style>
      </head>
      <body>
        <div class="decor">Z</div>

        <div class="top-row">
          <div class="badge-row">
            <span class="tag tag-highlight">Outlet #120</span>
            <span class="tag">Opposite Aashima Mall</span>
            <span class="tag">Bhopal</span>
          </div>
          <div style="font-size: 18px; font-weight: 600; color: #C9A227;">
            ⏰ 11:00 AM – 11:00 PM Daily
          </div>
        </div>

        <div class="center">
          <h1>Zippyfeed Cafe & Fine Dine</h1>
          <div class="loc">📍 Narmadapuram Road, Bhopal</div>
          <div class="desc">
            Explore 329 dishes across 11 cuisines: Korean Street Food, Pocket Friendly Combos from ₹299, Neapolitan Pizza, North Indian, Momo Platters & Refreshing Mocktails.
          </div>
        </div>

        <div class="bottom-bar">
          <div class="amenities">
            <span>🥗 Pure Veg & Non-Veg Kitchens</span>
            <span>•</span>
            <span>🏢 Two Floors & Lift</span>
            <span>•</span>
            <span>🅿️ Parking Available</span>
          </div>
          <div class="cta-pill">
            📱 Scan QR · Digital Menu
          </div>
        </div>
      </body>
    </html>
  `;
  await page.setContent(ogHtml);
  await page.screenshot({ path: path.join(PUBLIC_DIR, 'og-image.png') });
  console.log('Generated public/og-image.png (1200x630)');

  await browser.close();
  console.log('All visual assets generated successfully.');
}

generate().catch(err => {
  console.error('Failed to generate assets:', err);
  process.exit(1);
});
