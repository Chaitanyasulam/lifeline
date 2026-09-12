import { Activity } from 'lucide-react';
import { STRATEGIES } from '../engine/optimizer.js';

export function Header({ strategy, onStrategyChange, resolvedCount = 0 }) {
  return (
    <header className="dashboard-header">
      <div className="header-brand">
        <Activity className="brand-icon" size={22} />
        <div>
          <h1>LIFELINE</h1>
          <p>Multi-Agency Emergency Resource Optimization</p>
        </div>
      </div>

      <div className="header-status">
        <div className="status-pill optimized">
          <span className="status-dot" />
          System Status: OPTIMIZED
        </div>
        <div className="simulated-badge">Simulated scenario</div>
        {resolvedCount > 0 && (
          <div className="resolved-badge">{resolvedCount} resolved</div>
        )}
      </div>

      <div className="strategy-toggle">
        <label htmlFor="strategy">Strategy</label>
        <select
          id="strategy"
          value={strategy}
          onChange={(e) => onStrategyChange(e.target.value)}
        >
          <option value={STRATEGIES.NEAREST_FIRST}>Nearest-First</option>
          <option value={STRATEGIES.LIFELINE_OPTIMIZED}>LIFELINE Optimized</option>
        </select>
      </div>
    </header>
  );
}
