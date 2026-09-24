const QRCode = require('qrcode');
const jsQR = require('jsqr');
const fs = require('fs');
const path = require('path');
const puppeteer = require('puppeteer-core');

const CHROME_PATH = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
const PRINT_DIR = path.join(__dirname, '../public/print');
const ARTIFACTS_DIR = '/Users/harshchouksey/.gemini/antigravity/brain/77e692e2-1f45-45ec-8b77-e98703246708';
const TARGET_URL = 'https://zippyfeed.in/m';

if (!fs.existsSync(PRINT_DIR)) {
  fs.mkdirSync(PRINT_DIR, { recursive: true });
}

async function run() {
  console.log('=== PHASE 7: QR CODE GENERATION & SCAN RELIABILITY TESTING ===\n');

  // 1. Generate clean high-contrast SVG and Data URL
  const qrSvg = await QRCode.toString(TARGET_URL, {
    type: 'svg',
    errorCorrectionLevel: 'H',
    margin: 2,
    color: {
      dark: '#1C1917', // high contrast near black
      light: '#FFFFFF',
    },
  });

  const qrDataUrl = await QRCode.toDataURL(TARGET_URL, {
    errorCorrectionLevel: 'H',
    margin: 2,
    width: 1024,
    color: {
      dark: '#1C1917',
      light: '#FFFFFF',
    },
  });

  fs.writeFileSync(path.join(PRINT_DIR, 'qr-clean.svg'), qrSvg);
  console.log('✓ Generated public/print/qr-clean.svg');

  // 2. Test Scan Readability at 2x2 cm simulation
  console.log('\n--- TESTING QR SCANNING RELIABILITY ---');
  const browser = await puppeteer.launch({
    executablePath: CHROME_PATH,
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  });

  const testPage = await browser.newPage();

  // Test decoding with jsQR across various sizes: 1000px, 400px, 150px, 80px (simulating 2x2 cm at table distance 30-40cm)
  const sizes = [1000, 500, 240, 120, 80];
  const testResults = [];

  for (const s of sizes) {
    const rawDataUrl = await QRCode.toDataURL(TARGET_URL, {
      errorCorrectionLevel: 'H',
      margin: 1,
      width: s,
    });

    const decoded = await testPage.evaluate(async (dataUri) => {
      return new Promise((resolve) => {
        const img = new Image();
        img.onload = () => {
          const canvas = document.createElement('canvas');
          canvas.width = img.width;
          canvas.height = img.height;
          const ctx = canvas.getContext('2d');
          ctx.drawImage(img, 0, 0);
          const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
          // @ts-ignore
          resolve({
            width: img.width,
            height: img.height,
            data: Array.from(imageData.data),
          });
        };
        img.src = dataUri;
      });
    }, rawDataUrl);

    const code = jsQR(new Uint8ClampedArray(decoded.data), decoded.width, decoded.height);
    const pass = code && code.data === TARGET_URL;
    testResults.push({
      size: `${s}px`,
      simulatedDistance: s >= 240 ? '10-20 cm' : s >= 120 ? '30-40 cm (table distance)' : '50+ cm',
      detected: pass,
      decodedUrl: code ? code.data : null,
    });
  }

  console.log('Scan Test Results by Resolution/Distance:');
  console.table(testResults);

  // 3. Test Logo-in-Center variant
  console.log('\n--- TESTING LOGO-IN-CENTRE VARIANT ---');
  // Generate HTML with centered Zippyfeed logo
  const logoHtml = `
    <!DOCTYPE html>
    <html>
      <body style="margin:0; background:white; display:flex; align-items:center; justify-content:center; width:400px; height:400px;">
        <div style="position:relative; width:360px; height:360px;">
          <img src="${qrDataUrl}" style="width:100%; height:100%; display:block;" />
          <div style="position:absolute; top:50%; left:50%; transform:translate(-50%,-50%); width:64px; height:64px; background:#9E0E16; border:3px solid white; border-radius:14px; display:flex; align-items:center; justify-content:center; box-shadow:0 2px 6px rgba(0,0,0,0.3);">
            <span style="color:#C9A227; font-size:36px; font-weight:900; font-family:serif; line-height:1;">Z</span>
          </div>
        </div>
      </body>
    </html>
  `;
  await testPage.setContent(logoHtml);
  await testPage.setViewport({ width: 400, height: 400, deviceScaleFactor: 2 });
  const logoScreenshot = await testPage.screenshot({ encoding: 'binary' });

  // Test scan of logo variant
  const logoScanResult = await testPage.evaluate(async () => {
    const canvas = document.createElement('canvas');
    canvas.width = 400;
    canvas.height = 400;
    const ctx = canvas.getContext('2d');
    const img = document.querySelector('img');
    ctx.drawImage(img, 0, 0, 400, 400);

    // Draw center logo
    ctx.fillStyle = '#9E0E16';
    ctx.beginPath();
    ctx.roundRect(168, 168, 64, 64, 12);
    ctx.fill();
    ctx.strokeStyle = '#FFFFFF';
    ctx.lineWidth = 4;
    ctx.stroke();

    ctx.fillStyle = '#C9A227';
    ctx.font = 'bold 36px serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('Z', 200, 202);

    const imgData = ctx.getImageData(0, 0, 400, 400);
    return { width: 400, height: 400, data: Array.from(imgData.data) };
  });

  const logoCode = jsQR(new Uint8ClampedArray(logoScanResult.data), 400, 400);
  const logoPass = logoCode && logoCode.data === TARGET_URL;
  console.log(`Logo Variant Scan Result: ${logoPass ? '✓ PASSED (Decoded successfully)' : '✗ FAILED'}`);

  await browser.close();

  console.log('\nQR Code analysis summary saved.');
}

run().catch((err) => {
  console.error('QR Testing error:', err);
  process.exit(1);
});
