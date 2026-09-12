import { Layers, Filter } from 'lucide-react';
import { SCENARIO_PROFILES } from '../data/scenarios/index.js';
import { EMERGENCY_TYPE_LABELS } from '../models/types.js';

export function ScenarioBar({
  scenarioId,
  scenarioProfile,
  onScenarioChange,
  emergencyTypeFilter,
  onTypeFilterChange,
  activeEmergencyTypes,
}) {
  return (
    <div className="scenario-bar">
      <div className="scenario-selector">
        <Layers size={14} />
        <label htmlFor="scenario">Response Scenario</label>
        <select
          id="scenario"
          value={scenarioId}
          onChange={(e) => onScenarioChange(e.target.value)}
        >
          {SCENARIO_PROFILES.map((p) => (
            <option key={p.id} value={p.id}>
              {p.label}
            </option>
          ))}
        </select>
        <span className="scenario-domain">{scenarioProfile.domain}</span>
      </div>

      <p className="scenario-description">{scenarioProfile.description}</p>

      <div className="type-filter">
        <Filter size={14} />
        <label htmlFor="etype-filter">Emergency Type</label>
        <select
          id="etype-filter"
          value={emergencyTypeFilter}
          onChange={(e) => onTypeFilterChange(e.target.value)}
        >
          {activeEmergencyTypes.map((t) => (
            <option key={t} value={t}>
              {t === 'all' ? 'All Types' : EMERGENCY_TYPE_LABELS[t] ?? t}
            </option>
          ))}
        </select>
      </div>

      <div className="multi-agency-note">
        Multi-agency resource optimization — not limited to hospitals or ambulances
      </div>
    </div>
  );
}
