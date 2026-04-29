import { readFileSync, readdirSync } from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const migrationsDir = path.join(root, 'supabase', 'migrations');
const userOwnedTables = [
  'users',
  'user_profiles',
  'challenges',
  'challenge_reflections',
  'social_health_scores',
  'coaching_sessions',
  'coaching_messages',
  'streaks',
  'push_subscriptions',
  'weekly_check_ins',
  'challenge_mission_adjustments'
];

const sql = readdirSync(migrationsDir)
  .filter((file) => file.endsWith('.sql'))
  .sort()
  .map((file) => readFileSync(path.join(migrationsDir, file), 'utf8'))
  .join('\n')
  .toLowerCase();

const missing = [];

for (const table of userOwnedTables) {
  const escapedTable = table.replaceAll('_', '[_\\s]');
  const rlsPattern = new RegExp(`alter\\s+table\\s+public\\.${escapedTable}\\s+enable\\s+row\\s+level\\s+security`, 'i');
  const policyPattern = new RegExp(`create\\s+policy\\s+["\\w\\s]+\\s+on\\s+public\\.${escapedTable}`, 'i');

  if (!rlsPattern.test(sql)) {
    missing.push(`${table}: missing "enable row level security"`);
  }

  if (!policyPattern.test(sql)) {
    missing.push(`${table}: missing policy`);
  }
}

if (missing.length > 0) {
  console.error('RLS coverage check failed:');
  for (const item of missing) {
    console.error(`- ${item}`);
  }
  process.exit(1);
}

console.log(`RLS coverage check passed for ${userOwnedTables.length} user-owned tables.`);
