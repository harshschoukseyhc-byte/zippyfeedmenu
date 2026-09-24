const { spawn } = require('child_process');

console.log('Running test build...');
const child = spawn('/opt/homebrew/bin/node', ['./node_modules/next/dist/bin/next', 'build'], {
  stdio: 'inherit',
  env: {
    ...process.env,
    PATH: `/opt/homebrew/bin:/usr/bin:/bin:${process.env.PATH}`,
    NEXT_TELEMETRY_DISABLED: '1',
  },
});

child.on('exit', (code, signal) => {
  console.log(`Build process exited with code ${code}, signal ${signal}`);
  process.exit(code || 0);
});
