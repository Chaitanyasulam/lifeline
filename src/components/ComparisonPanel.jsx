import { Scale } from 'lucide-react';

function fmtTime(v) {
  return v === Infinity ? '∞ min' : `${v} min`;
}

function fmtTotalTime(v) {
  return `${v} min`;
}

export function ComparisonPanel({ comparison }) {
  const { nearestFirst, lifeline } = comparison;

  const rows = [
    ['Avg response time', nearestFirst.metrics.avgResponseTime, lifeline.metrics.avgResponseTime, fmtTime],
    ['Critical wait time', nearestFirst.metrics.criticalWaitTime, lifeline.metrics.criticalWaitTime, fmtTime],
    ['Total travel time', nearestFirst.metrics.totalTravelTime, lifeline.metrics.totalTravelTime, fmtTotalTime],
    ['System cost', nearestFirst.totalCost, lifeline.totalCost, (v) => v.toFixed(0)],
  ];

  return (
    <section className="panel comparison-panel">
      <div className="panel-title">
        <Scale size={14} />
        <h2>Baseline vs LIFELINE</h2>
        <span className="sim-note">Simulated scenario</span>
      </div>

      <table className="comparison-table">
        <thead>
          <tr>
            <th>Metric</th>
            <th>Nearest-First</th>
            <th>LIFELINE</th>
          </tr>
        </thead>
        <tbody>
          {rows.map(([label, nf, ll, fmt]) => {
            const lifelineBetter = typeof ll === 'number' && typeof nf === 'number' && ll < nf;
            return (
              <tr key={label}>
                <td>{label}</td>
                <td>{fmt(nf)}</td>
                <td className={lifelineBetter ? 'better' : ''}>{fmt(ll)}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </section>
  );
}
