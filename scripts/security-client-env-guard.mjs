import { readdirSync, readFileSync, statSync } from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const scannedRoot = path.join(root, 'src');
const secretToken = 'SUPABASE_SERVICE_ROLE_KEY';
const allowedFiles = new Set([
  path.normalize('src/lib/env.ts'),
  path.normalize('src/lib/ai/client.ts')
]);
const extensions = new Set(['.ts', '.tsx', '.js', '.jsx', '.mjs']);

function walk(dir) {
  return readdirSync(dir).flatMap((entry) => {
    const filePath = path.join(dir, entry);
    const stats = statSync(filePath);

    if (stats.isDirectory()) {
      return walk(filePath);
    }

    return extensions.has(path.extname(filePath)) ? [filePath] : [];
  });
}

const findings = [];

for (const filePath of walk(scannedRoot)) {
  const relativePath = path.relative(root, filePath);
  const normalizedPath = path.normalize(relativePath);
  const text = readFileSync(filePath, 'utf8');

  if (!text.includes(secretToken)) {
    continue;
  }

  if (!allowedFiles.has(normalizedPath)) {
    findings.push(`${relativePath}: service role key reference is not allowed in client-reachable source`);
    continue;
  }

  if (normalizedPath !== path.normalize('src/lib/env.ts') && !text.includes("import 'server-only'")) {
    findings.push(`${relativePath}: allowed service role usage must import 'server-only'`);
  }
}

if (findings.length > 0) {
  console.error('Service role client leakage guard failed:');
  for (const finding of findings) {
    console.error(`- ${finding}`);
  }
  process.exit(1);
}

console.log('Service role client leakage guard passed.');
