// Dependency-free SVG charts used by the budget tracker.

// Axis max that splits into 4 clean steps (e.g. 1000, 2000, 2500, 5000).
const niceMax = (max) => {
  if (!max || max <= 0) return 100;
  const raw = max / 4;
  const pow = Math.pow(10, Math.floor(Math.log10(raw)));
  const n = raw / pow;
  const step = (n <= 1 ? 1 : n <= 2 ? 2 : n <= 2.5 ? 2.5 : n <= 5 ? 5 : 10) * pow;
  return step * 4;
};

const compact = (n) => (n >= 1000 ? `${+(n / 1000).toFixed(1)}k` : String(n));

export function MonthlyChart({ data = [] }) {
  if (!data.length) return <p className="bt-empty">No spending recorded yet.</p>;

  const W = 640;
  const H = 270;
  const pad = { top: 16, right: 12, bottom: 34, left: 48 };
  const innerW = W - pad.left - pad.right;
  const innerH = H - pad.top - pad.bottom;
  const max = niceMax(Math.max(...data.map((d) => Number(d.amount) || 0)));
  const ticks = [0, 1, 2, 3, 4].map((i) => (max / 4) * i);
  const slot = innerW / data.length;
  const barW = Math.min(56, slot * 0.55);

  return (
    <svg className="bt-chart" viewBox={`0 0 ${W} ${H}`} role="img" aria-label="Monthly spending chart">
      {ticks.map((t) => {
        const y = pad.top + innerH - (t / max) * innerH;
        return (
          <g key={t}>
            <line x1={pad.left} x2={W - pad.right} y1={y} y2={y} className="bt-grid" />
            <text x={pad.left - 8} y={y + 4} textAnchor="end" className="bt-axis">
              {compact(t)}
            </text>
          </g>
        );
      })}
      {data.map((d, i) => {
        const value = Number(d.amount) || 0;
        const h = (value / max) * innerH;
        const x = pad.left + slot * i + (slot - barW) / 2;
        const y = pad.top + innerH - h;
        return (
          <g key={`${d.month}-${i}`}>
            <rect x={x} y={y} width={barW} height={Math.max(h, 1)} rx="6" className="bt-bar">
              <title>{`${d.month}: AED ${value.toLocaleString("en-GB")}`}</title>
            </rect>
            <text x={x + barW / 2} y={y - 6} textAnchor="middle" className="bt-bar-label">
              {compact(value)}
            </text>
            <text x={x + barW / 2} y={H - 12} textAnchor="middle" className="bt-axis">
              {d.month}
            </text>
          </g>
        );
      })}
    </svg>
  );
}

export function DonutChart({ data = [], centerLabel = "Total", centerValue = "" }) {
  const total = data.reduce((s, d) => s + d.value, 0);
  const size = 190;
  const stroke = 26;
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  let offset = 0;

  return (
    <svg className="bt-donut" viewBox={`0 0 ${size} ${size}`} role="img" aria-label="Spending by category">
      <circle cx={size / 2} cy={size / 2} r={r} fill="none" strokeWidth={stroke} className="bt-donut-track" />
      {total > 0 &&
        data.map((d) => {
          const len = (d.value / total) * c;
          const el = (
            <circle
              key={d.label}
              cx={size / 2}
              cy={size / 2}
              r={r}
              fill="none"
              stroke={d.color}
              strokeWidth={stroke}
              strokeDasharray={`${Math.max(len - 2, 0)} ${c - Math.max(len - 2, 0)}`}
              strokeDashoffset={-offset}
              transform={`rotate(-90 ${size / 2} ${size / 2})`}
            >
              <title>{`${d.label}: AED ${d.value.toLocaleString("en-GB")}`}</title>
            </circle>
          );
          offset += len;
          return el;
        })}
      <text x="50%" y="46%" textAnchor="middle" className="bt-donut-label">
        {centerLabel}
      </text>
      <text x="50%" y="58%" textAnchor="middle" className="bt-donut-value">
        {centerValue}
      </text>
    </svg>
  );
}
