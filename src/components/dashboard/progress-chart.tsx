'use client';

export function ProgressChart({ data }: { data: { label: string; score: number }[] }) {
  const safeData = data.length > 0 ? data : [{ label: 'Now', score: 0 }];
  const chartWidth = 320;
  const chartHeight = 150;
  const left = 18;
  const right = 18;
  const top = 20;
  const plotHeight = 82;
  const baseline = top + plotHeight;
  const usableWidth = chartWidth - left - right;
  const points = safeData.map((item, index) => {
    const x = safeData.length === 1 ? chartWidth / 2 : left + (index / (safeData.length - 1)) * usableWidth;
    const y = top + ((100 - Math.max(0, Math.min(100, item.score))) / 100) * plotHeight;

    return { ...item, x, y };
  });
  const linePath = points.map((point, index) => `${index === 0 ? 'M' : 'L'}${point.x.toFixed(1)},${point.y.toFixed(1)}`).join(' ');
  const areaPath = `${linePath} L${points[points.length - 1].x.toFixed(1)},${baseline} L${points[0].x.toFixed(1)},${baseline} Z`;

  return (
    <div className='mt-2 h-40 w-full'>
      <svg viewBox={`0 0 ${chartWidth} ${chartHeight}`} className='h-full w-full overflow-visible' role='img' aria-label='Score trend'>
        <defs>
          <linearGradient id='score-mini-area' x1='0' y1='0' x2='0' y2='1'>
            <stop offset='0%' stopColor='#DA8066' stopOpacity='0.2' />
            <stop offset='100%' stopColor='#DA8066' stopOpacity='0.02' />
          </linearGradient>
        </defs>
        {[0, 1, 2, 3].map((line) => {
          const y = top + (line / 3) * plotHeight;

          return (
            <line
              key={line}
              x1={left}
              x2={chartWidth - right}
              y1={y}
              y2={y}
              stroke='#e8ded2'
              strokeDasharray='3 8'
              strokeWidth='1'
            />
          );
        })}
        <path d={areaPath} fill='url(#score-mini-area)' />
        <path d={linePath} fill='none' stroke='#DA8066' strokeLinecap='round' strokeLinejoin='round' strokeWidth='3.5' />
        {points.map((point) => (
          <g key={`${point.label}-${point.score}`}>
            <circle cx={point.x} cy={point.y} r='5.5' fill='#FFFAF2' stroke='#DA8066' strokeWidth='3' />
            <text x={point.x} y={chartHeight - 16} textAnchor='middle' fill='#66736B' fontFamily='Geist Mono, monospace' fontSize='12' fontWeight='700'>
              {point.label}
            </text>
          </g>
        ))}
      </svg>
    </div>
  );
}
