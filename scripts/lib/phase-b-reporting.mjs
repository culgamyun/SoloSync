const WEEK_PATTERN = /^\d{4}-\d{2}-\d{2}$/;

export function parseReportArgs(argv = [], env = process.env) {
  const args = {
    json: false,
    week: null
  };

  for (let index = 0; index < argv.length; index += 1) {
    const token = argv[index];

    if (token === '--json') {
      args.json = true;
      continue;
    }

    if (token === '--week') {
      const nextToken = argv[index + 1];
      if (!nextToken) {
        throw new Error('Expected a YYYY-MM-DD value after --week.');
      }
      args.week = nextToken;
      index += 1;
      continue;
    }

    if (token.startsWith('--week=')) {
      args.week = token.slice('--week='.length);
      continue;
    }

    throw new Error(`Unknown argument: ${token}`);
  }

  if (args.week && !WEEK_PATTERN.test(args.week)) {
    throw new Error(`Invalid --week value "${args.week}". Use YYYY-MM-DD.`);
  }

  if (!args.week && env.npm_config_week) {
    if (!WEEK_PATTERN.test(env.npm_config_week)) {
      throw new Error(`Invalid --week value "${env.npm_config_week}". Use YYYY-MM-DD.`);
    }
    args.week = env.npm_config_week;
  }

  return args;
}

export function getReportEnv(env = process.env) {
  const missing = ['NEXT_PUBLIC_SUPABASE_URL', 'SUPABASE_SERVICE_ROLE_KEY'].filter((key) => !env[key]);

  if (missing.length > 0) {
    throw new Error(
      `Missing required env var(s): ${missing.join(', ')}. Add them to .env.local or your shell before running the report.`
    );
  }

  return {
    supabaseUrl: env.NEXT_PUBLIC_SUPABASE_URL,
    serviceRoleKey: env.SUPABASE_SERVICE_ROLE_KEY
  };
}

export function filterRowsByWeek(rows, week) {
  if (!week) {
    return rows;
  }

  return rows.filter((row) => {
    const rawWeek = row.week_start_date ?? row.failed_week_start_date ?? '';
    return String(rawWeek).startsWith(week);
  });
}

export function formatWeek(value) {
  return String(value).slice(0, 10);
}

export function formatRate(value) {
  if (typeof value !== 'number' || Number.isNaN(value)) {
    return '-';
  }

  return `${(value * 100).toFixed(1)}%`;
}

function pad(value, width) {
  return String(value).padEnd(width, ' ');
}

export function renderTable(headers, rows) {
  const stringRows = rows.map((row) => row.map((value) => String(value)));
  const widths = headers.map((header, index) =>
    Math.max(header.length, ...stringRows.map((row) => row[index]?.length ?? 0))
  );

  const headerLine = `| ${headers.map((header, index) => pad(header, widths[index])).join(' | ')} |`;
  const separatorLine = `| ${widths.map((width) => '-'.repeat(width)).join(' | ')} |`;

  if (stringRows.length === 0) {
    return [headerLine, separatorLine, `| ${pad('(no data)', widths[0])}${widths.length > 1 ? ` | ${widths.slice(1).map((width) => pad('', width)).join(' | ')}` : ''} |`].join('\n');
  }

  const bodyLines = stringRows.map(
    (row) => `| ${row.map((value, index) => pad(value, widths[index])).join(' | ')} |`
  );

  return [headerLine, separatorLine, ...bodyLines].join('\n');
}

export function renderMicroMissionReturnReport(payload, options = {}) {
  const scopeLine = options.week ? `Week filter: ${options.week}` : 'Week filter: all';
  const rows = payload.microMissionReturn.map((row) => [
    formatWeek(row.failed_week_start_date),
    row.failed_or_skipped_users,
    row.returned_next_week_users,
    formatRate(row.next_week_return_rate)
  ]);

  return [
    'Phase B Micro-Mission Return Report',
    `Generated at: ${payload.generatedAt}`,
    scopeLine,
    '',
    'Return Summary',
    renderTable(
      ['Week', 'Failed/Skipped Users', 'Returned Next Week', 'Return Rate'],
      rows
    )
  ].join('\n');
}

export function renderPhaseBAnalyticsReport(payload, options = {}) {
  const scopeLine = options.week ? `Week filter: ${options.week}` : 'Week filter: all';
  const usageRows = payload.phaseBUsage.map((row) => [
    formatWeek(row.week_start_date),
    row.micro_mission_users,
    row.adjusted_users,
    formatRate(row.adjustment_rate),
    row.users_with_profile_preferences,
    formatRate(row.profile_preference_completion_rate)
  ]);
  const adjustmentRows = payload.phaseBUsage.map((row) => [
    formatWeek(row.week_start_date),
    row.smaller_requests,
    row.different_space_requests,
    row.safer_line_requests
  ]);
  const deltaRows = payload.phaseBReturnDelta.map((row) => [
    formatWeek(row.week_start_date),
    row.adjusted_users,
    row.adjusted_returned_next_week_users,
    formatRate(row.adjusted_next_week_return_rate),
    row.non_adjusted_users,
    row.non_adjusted_returned_next_week_users,
    formatRate(row.non_adjusted_next_week_return_rate)
  ]);

  return [
    'Phase B Analytics Report',
    `Generated at: ${payload.generatedAt}`,
    scopeLine,
    '',
    'Usage Summary',
    renderTable(
      ['Week', 'Micro Users', 'Adjusted Users', 'Adjustment Rate', 'Users With Preferences', 'Preference Rate'],
      usageRows
    ),
    '',
    'Adjustment Mix',
    renderTable(['Week', 'Smaller', 'Different Space', 'Safer Line'], adjustmentRows),
    '',
    'Return Delta',
    renderTable(
      [
        'Week',
        'Adjusted Users',
        'Adjusted Returned',
        'Adjusted Rate',
        'Non-Adjusted Users',
        'Non-Adjusted Returned',
        'Non-Adjusted Rate'
      ],
      deltaRows
    ),
    '',
    'Baseline Failed/Skipped Return',
    renderTable(
      ['Week', 'Failed/Skipped Users', 'Returned Next Week', 'Return Rate'],
      payload.microMissionReturn.map((row) => [
        formatWeek(row.failed_week_start_date),
        row.failed_or_skipped_users,
        row.returned_next_week_users,
        formatRate(row.next_week_return_rate)
      ])
    )
  ].join('\n');
}
