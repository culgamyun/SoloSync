'use client';

import { Area, AreaChart, ResponsiveContainer, Tooltip, XAxis } from 'recharts';

export function ProgressChart({ data }: { data: { label: string; score: number }[] }) {
  return (
    <div className='h-64 w-full'>
      <ResponsiveContainer width='100%' height='100%'>
        <AreaChart data={data} margin={{ top: 12, right: 6, left: -18, bottom: 0 }}>
          <defs>
            <linearGradient id='score-area' x1='0' y1='0' x2='0' y2='1'>
              <stop offset='0%' stopColor='#73A8EE' stopOpacity={0.28} />
              <stop offset='100%' stopColor='#73A8EE' stopOpacity={0.02} />
            </linearGradient>
          </defs>
          <XAxis
            dataKey='label'
            tickLine={false}
            axisLine={false}
            tickMargin={12}
            tick={{ fill: '#66736B', fontSize: 12, fontWeight: 700, fontFamily: 'Geist Mono, monospace' }}
          />
          <Tooltip
            cursor={{ stroke: 'rgba(18, 107, 90, 0.18)', strokeWidth: 1 }}
            contentStyle={{
              borderRadius: 8,
              border: '1px solid #D8E1DA',
              backgroundColor: '#FFFFFF',
              boxShadow: '0 10px 28px rgba(32,38,34,0.07)'
            }}
          />
          <Area type='monotone' dataKey='score' stroke='#126B5A' strokeWidth={3} fill='url(#score-area)' />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
