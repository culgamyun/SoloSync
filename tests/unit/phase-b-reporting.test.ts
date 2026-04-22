import { describe, expect, it } from 'vitest';

async function loadReportingHelpers() {
  const modulePath = '../../scripts/lib/phase-b-reporting.mjs';
  return import(modulePath);
}

describe('phase-b reporting helpers', () => {
  it('parses json and week arguments', async () => {
    const { parseReportArgs } = await loadReportingHelpers();

    expect(parseReportArgs(['--json', '--week', '2026-04-20'])).toEqual({
      json: true,
      week: '2026-04-20'
    });
    expect(parseReportArgs(['--week=2026-04-13'])).toEqual({
      json: false,
      week: '2026-04-13'
    });
    expect(parseReportArgs([], { npm_config_week: '2026-04-06' })).toEqual({
      json: false,
      week: '2026-04-06'
    });
  });

  it('rejects invalid week values and unknown flags', async () => {
    const { parseReportArgs } = await loadReportingHelpers();

    expect(() => parseReportArgs(['--week', '2026/04/20'])).toThrow('Invalid --week value');
    expect(() => parseReportArgs(['--mystery'])).toThrow('Unknown argument');
  });

  it('requires the Supabase URL and service role key', async () => {
    const { getReportEnv } = await loadReportingHelpers();

    expect(() => getReportEnv({})).toThrow('Missing required env var(s)');
    expect(
      getReportEnv({
        NEXT_PUBLIC_SUPABASE_URL: 'https://example.supabase.co',
        SUPABASE_SERVICE_ROLE_KEY: 'service-role-key'
      })
    ).toEqual({
      supabaseUrl: 'https://example.supabase.co',
      serviceRoleKey: 'service-role-key'
    });
  });

  it('filters rows by the requested week using either week field', async () => {
    const { filterRowsByWeek } = await loadReportingHelpers();

    expect(
      filterRowsByWeek(
        [
          { week_start_date: '2026-04-20T00:00:00.000Z', count: 1 },
          { week_start_date: '2026-04-13T00:00:00.000Z', count: 2 }
        ],
        '2026-04-20'
      )
    ).toEqual([{ week_start_date: '2026-04-20T00:00:00.000Z', count: 1 }]);

    expect(
      filterRowsByWeek(
        [
          { failed_week_start_date: '2026-04-20T00:00:00.000Z', count: 1 },
          { failed_week_start_date: '2026-04-13T00:00:00.000Z', count: 2 }
        ],
        '2026-04-13'
      )
    ).toEqual([{ failed_week_start_date: '2026-04-13T00:00:00.000Z', count: 2 }]);
  });

  it('formats rates as percentages', async () => {
    const { formatRate } = await loadReportingHelpers();

    expect(formatRate(0.6667)).toBe('66.7%');
    expect(formatRate(0)).toBe('0.0%');
  });

  it('renders the combined Phase B analytics report', async () => {
    const { renderPhaseBAnalyticsReport } = await loadReportingHelpers();
    const output = renderPhaseBAnalyticsReport({
      generatedAt: '2026-04-22T10:00:00.000Z',
      week: '2026-04-20',
      microMissionReturn: [
        {
          failed_week_start_date: '2026-04-20T00:00:00.000Z',
          failed_or_skipped_users: 3,
          returned_next_week_users: 2,
          next_week_return_rate: 0.6667
        }
      ],
      phaseBUsage: [
        {
          week_start_date: '2026-04-20T00:00:00.000Z',
          micro_mission_users: 10,
          adjusted_users: 4,
          adjustment_rate: 0.4,
          smaller_requests: 2,
          different_space_requests: 1,
          safer_line_requests: 3,
          users_with_profile_preferences: 6,
          profile_preference_completion_rate: 0.6
        }
      ],
      phaseBReturnDelta: [
        {
          week_start_date: '2026-04-20T00:00:00.000Z',
          adjusted_users: 4,
          adjusted_returned_next_week_users: 3,
          adjusted_next_week_return_rate: 0.75,
          non_adjusted_users: 6,
          non_adjusted_returned_next_week_users: 2,
          non_adjusted_next_week_return_rate: 0.3333
        }
      ]
    });

    expect(output).toContain('Phase B Analytics Report');
    expect(output).toContain('Usage Summary');
    expect(output).toContain('Adjustment Mix');
    expect(output).toContain('Return Delta');
    expect(output).toContain('2026-04-20');
    expect(output).toContain('40.0%');
    expect(output).toContain('75.0%');
  });

  it('renders the legacy micro-mission return report', async () => {
    const { renderMicroMissionReturnReport } = await loadReportingHelpers();
    const output = renderMicroMissionReturnReport(
      {
        generatedAt: '2026-04-22T10:00:00.000Z',
        week: null,
        microMissionReturn: [
          {
            failed_week_start_date: '2026-04-20T00:00:00.000Z',
            failed_or_skipped_users: 3,
            returned_next_week_users: 2,
            next_week_return_rate: 0.6667
          }
        ]
      },
      {}
    );

    expect(output).toContain('Phase B Micro-Mission Return Report');
    expect(output).toContain('Return Summary');
    expect(output).toContain('66.7%');
  });
});
