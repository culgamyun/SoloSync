import { createClient } from '@supabase/supabase-js';

import {
  filterRowsByWeek,
  getReportEnv,
  parseReportArgs,
  renderPhaseBAnalyticsReport
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

  const [microMissionResult, phaseBUsageResult, phaseBDeltaResult] = await Promise.all([
    supabase.rpc('micro_mission_return_report'),
    supabase.rpc('phase_b_usage_report'),
    supabase.rpc('phase_b_return_delta_report')
  ]);

  if (microMissionResult.error) {
    throw new Error(`micro_mission_return_report failed: ${microMissionResult.error.message}`);
  }

  if (phaseBUsageResult.error) {
    throw new Error(`phase_b_usage_report failed: ${phaseBUsageResult.error.message}`);
  }

  if (phaseBDeltaResult.error) {
    throw new Error(`phase_b_return_delta_report failed: ${phaseBDeltaResult.error.message}`);
  }

  const payload = {
    generatedAt: new Date().toISOString(),
    week: args.week,
    microMissionReturn: filterRowsByWeek(microMissionResult.data ?? [], args.week),
    phaseBUsage: filterRowsByWeek(phaseBUsageResult.data ?? [], args.week),
    phaseBReturnDelta: filterRowsByWeek(phaseBDeltaResult.data ?? [], args.week)
  };

  if (args.json) {
    console.log(JSON.stringify(payload, null, 2));
    return;
  }

  console.log(renderPhaseBAnalyticsReport(payload, args));
}

runReport().catch((error) => {
  console.error(error instanceof Error ? error.message : String(error));
  process.exitCode = 1;
});
