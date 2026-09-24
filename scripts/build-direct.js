const path = require('path');

process.env.NODE_ENV = 'production';
process.env.NEXT_TELEMETRY_DISABLED = '1';

async function build() {
  console.log('Starting direct Next.js build programmatically...');
  try {
    const nextBuild = require('next/dist/build').default;
    await nextBuild(path.resolve(__dirname, '..'), {
      reactStrictMode: true,
    });
    console.log('Build finished successfully!');
  } catch (err) {
    console.error('Build failed with error:', err);
    process.exit(1);
  }
}

build();
