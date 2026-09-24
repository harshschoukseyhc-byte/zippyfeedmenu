const puppeteer = require('puppeteer-core');
const QRCode = require('qrcode');
const path = require('path');
const fs = require('fs');

const CHROME_PATH = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
const PUBLIC_PRINT_DIR = path.join(__dirname, '../public/print');
const ARTIFACTS_DIR = '/Users/harshchouksey/.gemini/antigravity/brain/77e692e2-1f45-45ec-8b77-e98703246708';
const TARGET_URL = 'https://zippyfeed.in/m';

if (!fs.existsSync(PUBLIC_PRINT_DIR)) {
  fs.mkdirSync(PUBLIC_PRINT_DIR, { recursive: true });
}

async function generatePrintAssets() {
  console.log('Generating 300 DPI Print-Ready Assets & High-Resolution Previews...\n');

  // Generate high-res base64 QR code data URLs
  const qrCleanDataUrl = await QRCode.toDataURL(TARGET_URL, {
    errorCorrectionLevel: 'H',
    margin: 1,
    width: 1200,
    color: { dark: '#1C1917', light: '#FFFFFF' },
  });

  const browser = await puppeteer.launch({
    executablePath: CHROME_PATH,
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  });

  // -------------------------------------------------------------
  // ASSET 1: A5 Table Tent (Both Sides)
  // Dimensions: 148mm x 210mm
  // -------------------------------------------------------------
  console.log('1. Generating A5 Table Tent (Front & Back)...');
  const tableTentHtml = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <style>
          @page {
            size: 148mm 210mm;
            margin: 0;
          }
          * { box-sizing: border-box; }
          body {
            margin: 0;
            padding: 0;
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
            background: #FBF6EC;
            color: #1C1917;
            -webkit-print-color-adjust: exact;
            print-color-adjust: exact;
          }
          .page {
            width: 148mm;
            height: 210mm;
            page-break-after: always;
            position: relative;
            padding: 10mm 10mm 8mm 10mm;
            display: flex;
            flex-direction: column;
            justify-content: space-between;
            overflow: hidden;
            background: #FBF6EC;
            border: 4mm solid #9E0E16;
          }
          .header {
            text-align: center;
          }
          .brand-logo {
            display: inline-flex;
            align-items: center;
            justify-content: center;
            width: 16mm;
            height: 16mm;
            background: #9E0E16;
            color: #C9A227;
            font-family: serif;
            font-weight: 900;
            font-size: 11mm;
            border-radius: 4mm;
            border: 0.8mm solid #C9A227;
            margin-bottom: 2mm;
          }
          .brand-title {
            font-family: Georgia, serif;
            font-size: 7mm;
            font-weight: 800;
            color: #9E0E16;
            line-height: 1.1;
            letter-spacing: -0.2mm;
            margin: 0;
          }
          .brand-sub {
            font-size: 3.2mm;
            font-weight: 700;
            color: #C9A227;
            text-transform: uppercase;
            letter-spacing: 0.8mm;
            margin-top: 1mm;
          }
          .brand-outlet {
            font-size: 3mm;
            font-weight: 600;
            color: #57534E;
            margin-top: 0.8mm;
          }

          /* QR Card */
          .qr-box {
            background: #FFFFFF;
            border: 1mm solid #C9A227;
            border-radius: 6mm;
            padding: 4mm;
            text-align: center;
            box-shadow: 0 4mm 10mm rgba(0,0,0,0.06);
            margin: 2mm 0;
            display: flex;
            flex-direction: column;
            align-items: center;
          }
          .qr-img {
            width: 58mm;
            height: 58mm;
            display: block;
          }
          .qr-cta-en {
            font-size: 4.8mm;
            font-weight: 800;
            color: #9E0E16;
            letter-spacing: 0.2mm;
            margin-top: 2mm;
            text-transform: uppercase;
          }
          .qr-cta-hi {
            font-size: 4.2mm;
            font-weight: 700;
            color: #1C1917;
            margin-top: 0.6mm;
          }

          /* Highlights Pill Grid */
          .highlights {
            display: flex;
            flex-direction: column;
            gap: 1.8mm;
            margin: 1mm 0;
          }
          .hl-pill {
            background: #FFFFFF;
            border: 0.3mm solid #E7E5E4;
            padding: 2mm 3mm;
            border-radius: 3mm;
            display: flex;
            align-items: center;
            justify-content: space-between;
          }
          .hl-pill-left {
            font-size: 3.2mm;
            font-weight: 700;
            color: #1C1917;
          }
          .hl-pill-badge {
            font-size: 2.8mm;
            font-weight: 800;
            background: #E1251B;
            color: #FFFFFF;
            padding: 0.6mm 2mm;
            border-radius: 2mm;
          }

          /* Footer Bar */
          .footer-bar {
            text-align: center;
            border-top: 0.4mm solid rgba(201, 162, 39, 0.4);
            padding-top: 2.5mm;
          }
          .footer-text {
            font-size: 2.8mm;
            font-weight: 600;
            color: #78716C;
          }
          .footer-insta {
            font-size: 3.2mm;
            font-weight: 700;
            color: #9E0E16;
            margin-top: 0.8mm;
          }

          /* BACK SIDE STYLING */
          .back-card {
            background: #FFFFFF;
            border: 0.4mm solid #E7E5E4;
            border-radius: 4mm;
            padding: 3.5mm;
            margin-bottom: 2.5mm;
          }
          .back-card-title {
            font-size: 3.6mm;
            font-weight: 800;
            color: #9E0E16;
            display: flex;
            align-items: center;
            gap: 1.5mm;
            margin-bottom: 1mm;
          }
          .back-card-desc {
            font-size: 2.9mm;
            color: #57534E;
            line-height: 1.4;
          }
        </style>
      </head>
      <body>
        <!-- SIDE 1: FRONT -->
        <div class="page">
          <div class="header">
            <div class="brand-logo">Z</div>
            <h1 class="brand-title">Zippyfeed</h1>
            <div class="brand-sub">Cafe & Fine Dine</div>
            <div class="brand-outlet">Outlet #120 · Opposite Aashima Mall, Bhopal</div>
          </div>

          <div class="qr-box">
            <img src="${qrCleanDataUrl}" class="qr-img" alt="QR Code" />
            <div class="qr-cta-en">Scan for Menu</div>
            <div class="qr-cta-hi">मेन्यू के लिए स्कैन करें</div>
          </div>

          <div class="highlights">
            <div class="hl-pill">
              <span class="hl-pill-left">🍱 Pocket Friendly Combos</span>
              <span class="hl-pill-badge">₹299 SE SHURU</span>
            </div>
            <div class="hl-pill">
              <span class="hl-pill-left">🇰🇷 Korean Cuisine (Rare in Bhopal)</span>
              <span class="hl-pill-badge" style="background:#0F766E;">BHOPAL EXCLUSIVE</span>
            </div>
            <div class="hl-pill">
              <span class="hl-pill-left">🍕 Neapolitan Wood-Fired Pizza</span>
              <span class="hl-pill-badge" style="background:#C9A227; color:#1C1917;">10" & 12"</span>
            </div>
          </div>

          <div class="footer-bar">
            <div class="footer-text">Pure Veg & Non-Veg Kitchens · Free Guest Wi-Fi</div>
            <div class="footer-insta">Instagram: @zippyfeed.bhopal_120</div>
          </div>
        </div>

        <!-- SIDE 2: BACK (Amenities & Trust) -->
        <div class="page">
          <div class="header">
            <div class="brand-sub" style="font-size:3.5mm; color:#9E0E16; letter-spacing:0.4mm;">About Zippyfeed Bhopal</div>
            <h2 class="brand-title" style="font-size:6mm; margin-top:1mm;">Pure Hospitality</h2>
            <div class="brand-outlet">Two Floors · Family Seating · Lift · Dedicated Parking</div>
          </div>

          <div style="margin: 3mm 0;">
            <div class="back-card">
              <div class="back-card-title">
                <span>🥗</span>
                <span>Separate Veg & Non-Veg Kitchens</span>
              </div>
              <div class="back-card-desc">
                Dedicated preparation areas, separate cookware, and separate utensils. Use the "Veg only" toggle in our digital menu to browse 212 100% vegetarian dishes with zero non-veg leakage.
              </div>
            </div>

            <div class="back-card">
              <div class="back-card-title">
                <span>🏢</span>
                <span>Two Spacious Floors with Elevator</span>
              </div>
              <div class="back-card-desc">
                Comfortable family seating across both ground and first floors with full lift access for elders and young children.
              </div>
            </div>

            <div class="back-card">
              <div class="back-card-title">
                <span>🎉</span>
                <span>Host Parties & Celebrations</span>
              </div>
              <div class="back-card-desc">
                Book our first-floor banquet space for birthdays, kitty parties, and corporate get-togethers. Inquire with staff or WhatsApp us.
              </div>
            </div>
          </div>

          <!-- Secondary QR for Convenience -->
          <div style="display:flex; align-items:center; justify-content:center; gap:4mm; background:#FFFFFF; padding:2.5mm 4mm; border-radius:4mm; border:0.3mm solid #C9A227;">
            <img src="${qrCleanDataUrl}" style="width:20mm; height:20mm;" />
            <div style="text-align:left;">
              <div style="font-size:3.6mm; font-weight:800; color:#9E0E16;">Scan for Menu</div>
              <div style="font-size:3.2mm; font-weight:700; color:#1C1917;">मेन्यू के लिए स्कैन करें</div>
              <div style="font-size:2.6mm; color:#78716C; margin-top:0.6mm;">Open 11:00 AM – 11:00 PM Daily</div>
            </div>
          </div>

          <div class="footer-bar">
            <div class="footer-text">Opposite Aashima Mall, Narmadapuram Road, Bhopal</div>
            <div class="footer-insta">Instagram: @zippyfeed.bhopal_120</div>
          </div>
        </div>
      </body>
    </html>
  `;

  const tentPage = await browser.newPage();
  await tentPage.setContent(tableTentHtml, { waitUntil: 'networkidle0' });

  // Generate 300 DPI vector PDF
  await tentPage.pdf({
    path: path.join(PUBLIC_PRINT_DIR, 'table-tent-a5.pdf'),
    format: 'A5',
    printBackground: true,
    margin: { top: 0, right: 0, bottom: 0, left: 0 },
  });
  console.log('✓ Generated public/print/table-tent-a5.pdf (2 pages)');

  // High-res preview screenshots
  await tentPage.setViewport({ width: 1748, height: 2480, deviceScaleFactor: 1 });
  const pages = await tentPage.$$('.page');
  if (pages[0]) {
    await pages[0].screenshot({ path: path.join(ARTIFACTS_DIR, 'phase7-table-tent-front.png') });
    console.log('✓ Saved phase7-table-tent-front.png');
  }
  if (pages[1]) {
    await pages[1].screenshot({ path: path.join(ARTIFACTS_DIR, 'phase7-table-tent-back.png') });
    console.log('✓ Saved phase7-table-tent-back.png');
  }

  // -------------------------------------------------------------
  // ASSET 2: 3x3 Inch Bill/Receipt Sticker
  // Dimensions: 76.2mm x 76.2mm (3" x 3")
  // -------------------------------------------------------------
  console.log('\n2. Generating 3x3 Inch Bill/Receipt Sticker...');
  const stickerHtml = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <style>
          @page {
            size: 3in 3in;
            margin: 0;
          }
          * { box-sizing: border-box; }
          body {
            margin: 0;
            padding: 3mm;
            width: 3in;
            height: 3in;
            background: #FFFFFF;
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
            color: #1C1917;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: space-between;
            border: 2mm solid #9E0E16;
            border-radius: 4mm;
            -webkit-print-color-adjust: exact;
            print-color-adjust: exact;
          }
          .title {
            font-family: Georgia, serif;
            font-weight: 800;
            font-size: 3.8mm;
            color: #9E0E16;
            text-align: center;
            line-height: 1.1;
          }
          .sub {
            font-size: 2.2mm;
            font-weight: 700;
            color: #C9A227;
            text-transform: uppercase;
            letter-spacing: 0.4mm;
            margin-top: 0.5mm;
          }
          .qr-img {
            width: 36mm;
            height: 36mm;
            display: block;
            margin: 1mm 0;
          }
          .cta-en {
            font-size: 3.2mm;
            font-weight: 800;
            color: #9E0E16;
            text-transform: uppercase;
            letter-spacing: 0.2mm;
          }
          .cta-hi {
            font-size: 2.8mm;
            font-weight: 700;
            color: #1C1917;
            margin-top: 0.3mm;
          }
          .footer {
            font-size: 2mm;
            font-weight: 600;
            color: #78716C;
            text-align: center;
            border-top: 0.2mm solid #E7E5E4;
            width: 100%;
            padding-top: 0.8mm;
          }
        </style>
      </head>
      <body>
        <div style="text-align:center;">
          <div class="title">Zippyfeed Cafe & Fine Dine</div>
          <div class="sub">Outlet #120 · Opp. Aashima Mall</div>
        </div>

        <img src="${qrCleanDataUrl}" class="qr-img" alt="QR Code" />

        <div style="text-align:center;">
          <div class="cta-en">Scan for Menu</div>
          <div class="cta-hi">मेन्यू के लिए स्कैन करें</div>
        </div>

        <div class="footer">
          Review us on Google · Instagram: @zippyfeed.bhopal_120
        </div>
      </body>
    </html>
  `;

  const stickerPage = await browser.newPage();
  await stickerPage.setContent(stickerHtml, { waitUntil: 'networkidle0' });

  await stickerPage.pdf({
    path: path.join(PUBLIC_PRINT_DIR, 'bill-sticker-3x3.pdf'),
    width: '3in',
    height: '3in',
    printBackground: true,
    margin: { top: 0, right: 0, bottom: 0, left: 0 },
  });
  console.log('✓ Generated public/print/bill-sticker-3x3.pdf');

  await stickerPage.setViewport({ width: 900, height: 900, deviceScaleFactor: 1 });
  await stickerPage.screenshot({ path: path.join(ARTIFACTS_DIR, 'phase7-bill-sticker.png') });
  console.log('✓ Saved phase7-bill-sticker.png');

  // -------------------------------------------------------------
  // ASSET 3: A4 Entrance / Counter Poster
  // Dimensions: 210mm x 297mm
  // -------------------------------------------------------------
  console.log('\n3. Generating A4 Entrance/Counter Poster...');
  const posterHtml = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <style>
          @page {
            size: A4 portrait;
            margin: 0;
          }
          * { box-sizing: border-box; }
          body {
            margin: 0;
            padding: 12mm;
            width: 210mm;
            height: 297mm;
            background: #FBF6EC;
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
            color: #1C1917;
            display: flex;
            flex-direction: column;
            justify-content: space-between;
            border: 6mm solid #9E0E16;
            -webkit-print-color-adjust: exact;
            print-color-adjust: exact;
          }
          .poster-header {
            text-align: center;
          }
          .p-logo {
            display: inline-flex;
            align-items: center;
            justify-content: center;
            width: 22mm;
            height: 22mm;
            background: #9E0E16;
            color: #C9A227;
            font-family: serif;
            font-weight: 900;
            font-size: 15mm;
            border-radius: 5mm;
            border: 1mm solid #C9A227;
            margin-bottom: 3mm;
          }
          .p-title {
            font-family: Georgia, serif;
            font-size: 11mm;
            font-weight: 800;
            color: #9E0E16;
            line-height: 1.1;
            margin: 0;
          }
          .p-sub {
            font-size: 4.8mm;
            font-weight: 700;
            color: #C9A227;
            text-transform: uppercase;
            letter-spacing: 1.2mm;
            margin-top: 1.5mm;
          }
          .p-loc {
            font-size: 4.2mm;
            font-weight: 600;
            color: #57534E;
            margin-top: 1.2mm;
          }

          /* Giant QR Container */
          .qr-banner {
            background: #FFFFFF;
            border: 1.5mm solid #C9A227;
            border-radius: 8mm;
            padding: 7mm;
            text-align: center;
            display: flex;
            flex-direction: column;
            align-items: center;
            box-shadow: 0 5mm 15mm rgba(0,0,0,0.08);
            margin: 3mm 0;
          }
          .qr-large-img {
            width: 82mm;
            height: 82mm;
            display: block;
          }
          .p-cta-en {
            font-size: 8mm;
            font-weight: 900;
            color: #9E0E16;
            letter-spacing: 0.4mm;
            text-transform: uppercase;
            margin-top: 3.5mm;
          }
          .p-cta-hi {
            font-size: 7mm;
            font-weight: 700;
            color: #1C1917;
            margin-top: 1mm;
          }
          .p-cta-sub {
            font-size: 3.8mm;
            color: #78716C;
            margin-top: 1.5mm;
            font-weight: 600;
          }

          /* Feature Grid */
          .feature-grid {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 3mm;
          }
          .f-card {
            background: #FFFFFF;
            border: 0.4mm solid #E7E5E4;
            padding: 3mm 4mm;
            border-radius: 4mm;
            display: flex;
            align-items: center;
            gap: 3mm;
          }
          .f-icon {
            font-size: 7mm;
          }
          .f-name {
            font-size: 3.8mm;
            font-weight: 700;
            color: #1C1917;
          }
          .f-note {
            font-size: 2.8mm;
            color: #78716C;
          }

          /* Footer */
          .p-footer {
            text-align: center;
            border-top: 0.5mm solid rgba(201, 162, 39, 0.4);
            padding-top: 3.5mm;
          }
          .p-footer-info {
            font-size: 3.6mm;
            font-weight: 600;
            color: #57534E;
          }
          .p-footer-insta {
            font-size: 4.2mm;
            font-weight: 800;
            color: #9E0E16;
            margin-top: 1mm;
          }
        </style>
      </head>
      <body>
        <div class="poster-header">
          <div class="p-logo">Z</div>
          <h1 class="p-title">Zippyfeed Cafe & Fine Dine</h1>
          <div class="p-sub">Outlet #120 · Multi-Cuisine Dining</div>
          <div class="p-loc">📍 Opposite Aashima Mall, Narmadapuram Road, Bhopal</div>
        </div>

        <div class="qr-banner">
          <img src="${qrCleanDataUrl}" class="qr-large-img" alt="Digital Menu QR" />
          <div class="p-cta-en">Scan for Digital Menu</div>
          <div class="p-cta-hi">मेन्यू के लिए स्कैन करें</div>
          <div class="p-cta-sub">Point your phone camera · No app download required · Instant load</div>
        </div>

        <div class="feature-grid">
          <div class="f-card">
            <span class="f-icon">🥗</span>
            <div>
              <div class="f-name">Pure Veg Kitchen</div>
              <div class="f-note">100% separate kitchen & utensils</div>
            </div>
          </div>
          <div class="f-card">
            <span class="f-icon">🍱</span>
            <div>
              <div class="f-name">Combos from ₹299</div>
              <div class="f-note">Pocket-friendly meal deals</div>
            </div>
          </div>
          <div class="f-card">
            <span class="f-icon">🇰🇷</span>
            <div>
              <div class="f-name">Korean Street Food</div>
              <div class="f-note">Yangnyeom chicken, Katsu, Tteokbokki</div>
            </div>
          </div>
          <div class="f-card">
            <span class="f-icon">🏢</span>
            <div>
              <div class="f-name">Two Floors & Lift</div>
              <div class="f-note">Family seating & ample parking</div>
            </div>
          </div>
        </div>

        <div class="p-footer">
          <div class="p-footer-info">⏰ Open Daily: 11:00 AM – 11:00 PM · Call: +91 91834 85102</div>
          <div class="p-footer-insta">Instagram: @zippyfeed.bhopal_120</div>
        </div>
      </body>
    </html>
  `;

  const posterPage = await browser.newPage();
  await posterPage.setContent(posterHtml, { waitUntil: 'networkidle0' });

  await posterPage.pdf({
    path: path.join(PUBLIC_PRINT_DIR, 'entrance-poster-a4.pdf'),
    format: 'A4',
    printBackground: true,
    margin: { top: 0, right: 0, bottom: 0, left: 0 },
  });
  console.log('✓ Generated public/print/entrance-poster-a4.pdf');

  await posterPage.setViewport({ width: 2480, height: 3508, deviceScaleFactor: 1 });
  await posterPage.screenshot({ path: path.join(ARTIFACTS_DIR, 'phase7-entrance-poster.png') });
  console.log('✓ Saved phase7-entrance-poster.png');

  await browser.close();

  console.log('\nAll print-ready 300 DPI PDFs and preview images generated successfully!');
}

generatePrintAssets().catch((err) => {
  console.error('Failed to generate print assets:', err);
  process.exit(1);
});
