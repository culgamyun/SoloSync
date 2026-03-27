'use client';

import { Area, AreaChart, ResponsiveContainer, Tooltip, XAxis } from 'recharts';

export function ProgressChart({ data }: { data: { label: string; score: number }[] }) {
  return (
    <div className='h-64 w-full'>
      <ResponsiveContainer width='100%' height='100%'>
        <AreaChart data={data} margin={{ top: 12, right: 6, left: -18, bottom: 0 }}>
          <defs>
            <linearGradient id='score-area' x1='0' y1='0' x2='0' y2='1'>
              <stop offset='0%' stopColor='#FEABA7' stopOpacity={0.45} />
              <stop offset='100%' stopColor='#FEABA7' stopOpacity={0.02} />
            </linearGradient>
          </defs>
          <XAxis
            dataKey='label'
            tickLine={false}
            axisLine={false}
            tickMargin={12}
            tick={{ fill: 'rgba(92,96,94,0.92)', fontSize: 12, fontWeight: 600 }}
          />
          <Tooltip
            cursor={{ stroke: 'rgba(141, 76, 74, 0.16)', strokeWidth: 1 }}
            contentStyle={{
              borderRadius: 20,
              border: '1px solid rgba(175, 179, 176, 0.16)',
              backgroundColor: 'rgba(255,255,255,0.94)',
              boxShadow: '0 18px 36px rgba(47,51,50,0.08)'
            }}
          />
          <Area type='monotone' dataKey='score' stroke='#8D4C4A' strokeWidth={3} fill='url(#score-area)' />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
