import { createClient } from '@supabase/supabase-js';

import {
  filterRowsByWeek,
  getReportEnv,
  parseReportArgs,
  renderMicroMissionReturnReport
} from './lib/phase-b-reporting.mjs';

function createServiceRoleClient() {
  const { supabaseUrl, serviceRoleKey } = getReportEnv();

  return createClient(supabaseUrl, serviceRoleKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false
    }
  });
}

async function runReport() {
  const args = parseReportArgs(process.argv.slice(2));
  const supabase = createServiceRoleClient();
  const result = await supabase.rpc('micro_mission_return_report');

  if (result.error) {
    throw new Error(`micro_mission_return_report failed: ${result.error.message}`);
  }

  const payload = {
    generatedAt: new Date().toISOString(),
    week: args.week,
    microMissionReturn: filterRowsByWeek(result.data ?? [], args.week)
  };

  if (args.json) {
    console.log(JSON.stringify(payload, null, 2));
    return;
  }

  console.log(renderMicroMissionReturnReport(payload, args));
}

runReport().catch((error) => {
  console.error(error instanceof Error ? error.message : String(error));
  process.exitCode = 1;
});
