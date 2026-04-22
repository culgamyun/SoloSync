import { spawn } from 'node:child_process';

import { parsePreviewQaArgs } from './lib/preview-qa.mjs';

function run() {
  const options = parsePreviewQaArgs(process.argv.slice(2));
  const playwrightArgs = ['playwright', 'test', 'tests/e2e/smoke.spec.ts'];

  if (options.project !== 'all') {
    playwrightArgs.push('--project', options.project);
  }

  if (options.headed) {
    playwrightArgs.push('--headed');
  }

  console.log(`[preview-qa] target: ${options.url}`);
  console.log(`[preview-qa] project: ${options.project}`);
  console.log(`[preview-qa] qa bypass: ${options.bypass ? 'enabled' : 'disabled'}`);

  const child = spawn('npx', playwrightArgs, {
    stdio: 'inherit',
    shell: true,
    env: {
      ...process.env,
      PLAYWRIGHT_BASE_URL: options.url,
      PLAYWRIGHT_QA_BYPASS: options.bypass ? 'true' : 'false'
    }
  });

  child.on('exit', (code) => {
    process.exit(code ?? 1);
  });
}

try {
  run();
} catch (error) {
  console.error(`[preview-qa] ${error instanceof Error ? error.message : String(error)}`);
  process.exit(1);
}
