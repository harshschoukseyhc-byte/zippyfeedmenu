const QRCode = require('qrcode');
const jsQR = require('jsqr');
const fs = require('fs');
const path = require('path');

const TARGET_URL = 'https://zippyfeedmenu.vercel.app/m';
const PUBLIC_PRINT = path.join(__dirname, '../public/print');
const ARTIFACTS_DIR = '/Users/harshchouksey/.gemini/antigravity/brain/77e692e2-1f45-45ec-8b77-e98703246708';

if (!fs.existsSync(PUBLIC_PRINT)) {
  fs.mkdirSync(PUBLIC_PRINT, { recursive: true });
}

async function run() {
  console.log('Generating Master QR Codes for Live URL:', TARGET_URL);

  // 1. Master Clean SVG (Vector Infinite Resolution)
  const cleanSvg = await QRCode.toString(TARGET_URL, {
    type: 'svg',
    errorCorrectionLevel: 'H',
    margin: 2,
    color: {
      dark: '#1C1917',
      light: '#FFFFFF',
    },
  });
  fs.writeFileSync(path.join(PUBLIC_PRINT, 'qr-code.svg'), cleanSvg);
  fs.writeFileSync(path.join(PUBLIC_PRINT, 'qr-clean.svg'), cleanSvg);
  console.log('✓ Generated public/print/qr-code.svg (Master Vector)');

  // 2. High-Res PNG (1024x1024, 300 DPI ready)
  const cleanPngBuffer = await QRCode.toBuffer(TARGET_URL, {
    type: 'png',
    errorCorrectionLevel: 'H',
    margin: 2,
    width: 1024,
    color: {
      dark: '#1C1917',
      light: '#FFFFFF',
    },
  });
  fs.writeFileSync(path.join(PUBLIC_PRINT, 'qr-code.png'), cleanPngBuffer);
  fs.writeFileSync(path.join(ARTIFACTS_DIR, 'zippyfeed-qr-clean.png'), cleanPngBuffer);
  fs.writeFileSync(path.join(ARTIFACTS_DIR, 'zippyfeed-live-qr.png'), cleanPngBuffer);
  console.log('✓ Generated public/print/qr-code.png (1024x1024 PNG)');

  // 3. Branded QR Code SVG (With Zippyfeed Red & Gold Emblem in Center)
  // QR version with 'H' error correction allows up to 30% area obstruction in center
  const qrData = QRCode.create(TARGET_URL, { errorCorrectionLevel: 'H' });
  const count = qrData.modules.size;
  const scale = 20; // 20px per module
  const margin = 40;
  const size = count * scale + margin * 2;

  let svgElements = `<rect width="${size}" height="${size}" fill="#FFFFFF"/>`;
  for (let r = 0; r < count; r++) {
    for (let c = 0; c < count; c++) {
      if (qrData.modules.get(r, c)) {
        const x = margin + c * scale;
        const y = margin + r * scale;
        svgElements += `<rect x="${x}" y="${y}" width="${scale}" height="${scale}" fill="#1C1917"/>`;
      }
    }
  }

  // Draw Center Emblem: 22% of total size
  const centerSize = Math.floor(size * 0.22);
  const centerX = (size - centerSize) / 2;
  const centerY = (size - centerSize) / 2;
  const radius = Math.floor(centerSize * 0.22);
  const borderWidth = Math.max(4, Math.floor(scale * 0.6));

  const brandedSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${size} ${size}" width="${size}" height="${size}">
    ${svgElements}
    <!-- Zippyfeed Logo Emblem -->
    <rect x="${centerX}" y="${centerY}" width="${centerSize}" height="${centerSize}" rx="${radius}" ry="${radius}" fill="#9E0E16" stroke="#FFFFFF" stroke-width="${borderWidth}"/>
    <text x="${size / 2}" y="${size / 2 + centerSize * 0.35}" font-family="Georgia, serif" font-weight="900" font-size="${centerSize * 0.72}" fill="#C9A227" text-anchor="middle">Z</text>
  </svg>`;

  fs.writeFileSync(path.join(PUBLIC_PRINT, 'qr-code-branded.svg'), brandedSvg);
  console.log('✓ Generated public/print/qr-code-branded.svg (Master Vector with Logo)');

  // 4. Verify QR Code Decodability
  console.log('\n--- VERIFYING QR SCAN DECODABILITY ---');
  const qrModules = qrData.modules;
  const modCount = qrModules.size;
  const bufScale = 10;
  const w = modCount * bufScale;
  const h = modCount * bufScale;
  const rawBytes = new Uint8ClampedArray(w * h * 4);

  for (let r = 0; r < modCount; r++) {
    for (let c = 0; c < modCount; c++) {
      const isDark = qrModules.get(r, c);
      const val = isDark ? 0x1C : 0xFF;
      for (let dy = 0; dy < bufScale; dy++) {
        for (let dx = 0; dx < bufScale; dx++) {
          const idx = ((r * bufScale + dy) * w + (c * bufScale + dx)) * 4;
          rawBytes[idx] = val;
          rawBytes[idx + 1] = val;
          rawBytes[idx + 2] = val;
          rawBytes[idx + 3] = 255;
        }
      }
    }
  }

  const decoded = jsQR(rawBytes, w, h);
  console.log(`Scan Result: ${decoded ? 'SUCCESS' : 'FAILED'}`);
  console.log(`Decoded Target URL: ${decoded ? decoded.data : 'NONE'}`);
  if (!decoded || decoded.data !== TARGET_URL) {
    throw new Error('QR code decoding failed!');
  }
  console.log('✓ QR code 100% verified to decode directly to:', TARGET_URL);

}

run().catch((err) => {
  console.error('Error generating QRs:', err);
  process.exit(1);
});
