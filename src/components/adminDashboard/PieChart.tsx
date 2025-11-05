type Segment = { label: string; percent: number; color: string };

export default function PieChart({
  segments = [
    { label: 'Furniture', percent: 45, color: '#FFB347' },
    { label: 'Doors', percent: 25, color: '#5A4330' },
    { label: 'Custom', percent: 15, color: '#5A5047' },
    { label: 'Windows', percent: 15, color: '#EBDCC8' },
  ],
  title = 'Sales by Category',
}: {
  segments?: Segment[];
  title?: string;
}) {
  const cx = 100;
  const cy = 100;
  const r = 95;
  const toRad = (deg: number) => (deg * Math.PI) / 180;
  const polar = (angle: number) => ({
    x: cx + r * Math.cos(toRad(angle)),
    y: cy + r * Math.sin(toRad(angle)),
  });

  // Precompute path and label positions for each segment
  let angleAcc = -90;
  const labelR = r + 14; // place labels just outside the pie for clear spacing
  const items = segments.map((s) => {
    const sweep = (s.percent / 100) * 360;
    const start = polar(angleAcc);
    const end = polar(angleAcc + sweep);
    const largeArc = sweep > 180 ? 1 : 0;
    const d = `M ${cx} ${cy} L ${start.x} ${start.y} A ${r} ${r} 0 ${largeArc} 1 ${end.x} ${end.y} Z`;

    const mid = angleAcc + sweep / 2;
    const lx = cx + labelR * Math.cos(toRad(mid));
    const ly = cy + labelR * Math.sin(toRad(mid));
    const anchor = Math.cos(toRad(mid)) >= 0 ? 'start' : 'end';

    angleAcc += sweep;
    return { d, color: s.color, label: s.label, percent: s.percent, lx, ly, anchor };
  });

  return (
    <div className="bg-white rounded-2xl p-6 border border-gray-200">
      <p className="text-gray-800 font-medium mb-4">{title}</p>
      <div className="relative mx-auto w-[260px] h-[220px]">
        {/* Centered Pie */}
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
          <svg viewBox="0 0 200 200" className="w-40 h-40 overflow-visible">
            {items.map((it) => (
              <path key={`path-${it.label}`} d={it.d} fill={it.color} stroke="#fff" strokeWidth={3} />
            ))}
            {items.map((it) => (
              <text
                key={`label-${it.label}`}
                x={it.lx}
                y={it.ly}
                textAnchor={it.anchor as any}
                alignmentBaseline="middle"
                className="text-[12px] font-medium"
                fill={it.color}
              >
                {`${it.label} ${it.percent}%`}
              </text>
            ))}
          </svg>
        </div>

        {/* SVG labels rendered at each wedge's mid-angle; removed absolutely-positioned HTML labels */}
      </div>
    </div>
  );
}
