const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const ARTIFACTS_DIR = '/Users/harshchouksey/.gemini/antigravity/brain/77e692e2-1f45-45ec-8b77-e98703246708';
const REPORT_PATH = path.join(ARTIFACTS_DIR, 'lighthouse-report');

console.log('Running Lighthouse mobile audit against http://localhost:3000...');

try {
  const lighthouseBin = path.join(__dirname, '../node_modules/.bin/lighthouse');
  const cmd = `"${lighthouseBin}" http://localhost:3000 --output=json,html --output-path="${REPORT_PATH}" --form-factor=mobile --screenEmulation.mobile=true --only-categories=performance,accessibility,best-practices,seo --chrome-flags="--headless=new --no-sandbox --disable-gpu --disable-dev-shm-usage" --quiet`;
  
  execSync(cmd, {
    stdio: 'inherit',
    env: {
      ...process.env,
      PATH: `/opt/homebrew/bin:/usr/bin:/bin:${process.env.PATH}`,
      CHROME_PATH: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
    },
  });

  const jsonReport = JSON.parse(fs.readFileSync(`${REPORT_PATH}.report.json`, 'utf8'));
  const categories = jsonReport.categories;

  const scores = {
    performance: Math.round(categories.performance.score * 100),
    accessibility: Math.round(categories.accessibility.score * 100),
    bestPractices: Math.round(categories['best-practices'].score * 100),
    seo: Math.round(categories.seo.score * 100),
  };

  const audits = jsonReport.audits;
  const metrics = {
    fcp: audits['first-contentful-paint'].displayValue,
    lcp: audits['largest-contentful-paint'].displayValue,
    tbt: audits['total-blocking-time'].displayValue,
    cls: audits['cumulative-layout-shift'].displayValue,
    speedIndex: audits['speed-index'].displayValue,
  };

  console.log('\n========================================');
  console.log('       LIGHTHOUSE MOBILE AUDIT RESULTS   ');
  console.log('========================================');
  console.log(`Performance:    ${scores.performance}/100`);
  console.log(`Accessibility:  ${scores.accessibility}/100`);
  console.log(`Best Practices: ${scores.bestPractices}/100`);
  console.log(`SEO:            ${scores.seo}/100`);
  console.log('----------------------------------------');
  console.log(`First Contentful Paint (FCP):  ${metrics.fcp}`);
  console.log(`Largest Contentful Paint (LCP): ${metrics.lcp}`);
  console.log(`Total Blocking Time (TBT):     ${metrics.tbt}`);
  console.log(`Cumulative Layout Shift (CLS): ${metrics.cls}`);
  console.log(`Speed Index:                   ${metrics.speedIndex}`);
  console.log('========================================\n');

  fs.writeFileSync(
    path.join(ARTIFACTS_DIR, 'lighthouse-summary.json'),
    JSON.stringify({ scores, metrics }, null, 2)
  );

  console.log(`Reports saved to:\n  - ${REPORT_PATH}.report.html\n  - ${REPORT_PATH}.report.json`);
} catch (err) {
  console.error('Lighthouse execution failed:', err);
  process.exit(1);
}
