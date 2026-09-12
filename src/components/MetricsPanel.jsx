import { BarChart3 } from 'lucide-react';

function MetricCard({ label, value, unit }) {
  return (
    <div className="metric-card">
      <span className="metric-label">{label}</span>
      <span className="metric-value">
        {value}
        {unit && <span className="metric-unit">{unit}</span>}
      </span>
    </div>
  );
}

export function MetricsPanel({ metrics }) {
  const criticalWait =
    metrics.criticalWaitTime === Infinity ? '∞' : metrics.criticalWaitTime;

  return (
    <section className="panel metrics-panel">
      <div className="panel-title">
        <BarChart3 size={14} />
        <h2>Optimization Metrics</h2>
        <span className="sim-note">Simulated</span>
      </div>

      <div className="metrics-grid">
        <MetricCard label="Avg Response Time" value={metrics.avgResponseTime} unit=" min" />
        <MetricCard label="Critical Wait" value={criticalWait} unit=" min" />
        <MetricCard label="Resources Utilized" value={metrics.resourcesUtilized} />
        <MetricCard label="Unassigned" value={metrics.unassignedEmergencies} />
        <MetricCard label="Total Distance" value={metrics.totalTravelDistance} unit=" units" />
      </div>
    </section>
  );
}
