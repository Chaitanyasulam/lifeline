import { AlertCircle, ArrowUp, ArrowDown, CheckCircle } from 'lucide-react';
import { EMERGENCY_TYPE_LABELS } from '../models/types.js';

const SEVERITY_CLASS = {
  CRITICAL: 'severity-critical',
  HIGH: 'severity-high',
  MEDIUM: 'severity-medium',
  LOW: 'severity-low',
};

export function EmergencyPanel({
  emergencies,
  emergencyAssignmentMap,
  selected,
  onSelect,
  onEscalate,
  onDeescalate,
  onResolve,
  disabled,
  typeFilter = 'all',
}) {
  const filtered = typeFilter === 'all'
    ? emergencies
    : emergencies.filter((e) => e.type === typeFilter);
  const active = filtered.filter((e) => e.status !== 'resolved');
  const resolved = filtered.filter((e) => e.status === 'resolved');

  return (
    <section className="panel emergency-panel">
      <div className="panel-title">
        <AlertCircle size={14} />
        <h2>Active Emergencies</h2>
        <span className="count">{active.length}</span>
        {typeFilter !== 'all' && (
          <span className="filter-tag">{EMERGENCY_TYPE_LABELS[typeFilter]}</span>
        )}
      </div>

      <ul className="entity-list">
        {active.map((e) => {
          const assignment = emergencyAssignmentMap.get(e.id);
          const isSelected = selected?.type === 'emergency' && selected.id === e.id;
          const atMaxSeverity = e.severity === 'CRITICAL';
          const atMinSeverity = e.severity === 'LOW';

          return (
            <li
              key={e.id}
              className={`entity-item selectable ${SEVERITY_CLASS[e.severity]} ${isSelected ? 'selected' : ''}`}
              onClick={() => onSelect('emergency', e.id)}
              onKeyDown={(ev) => ev.key === 'Enter' && onSelect('emergency', e.id)}
              role="button"
              tabIndex={0}
            >
              <div className="entity-row">
                <span className="entity-id">{e.id}</span>
                <span className={`type-tag type-${e.type}`}>
                  {EMERGENCY_TYPE_LABELS[e.type]}
                </span>
                <span className={`severity-tag ${SEVERITY_CLASS[e.severity]}`}>
                  {e.severity}
                </span>
              </div>
              <div className="entity-meta">
                <span>Needs: {e.requiredCapabilities.join(', ')}</span>
                <span>{e.location.zone}</span>
                <span>{e.peopleAffected} affected</span>
              </div>
              <div className="entity-status">
                {assignment
                  ? `Assigned → ${assignment.resourceId} (${assignment.travelTime} min)`
                  : 'Waiting for compatible resource'}
              </div>

              <div className="entity-actions" onClick={(ev) => ev.stopPropagation()}>
                <button
                  type="button"
                  className="action-btn deescalate"
                  disabled={disabled || atMinSeverity}
                  onClick={() => onDeescalate(e.id)}
                >
                  <ArrowDown size={12} />
                  Reduce
                </button>
                <button
                  type="button"
                  className="action-btn escalate"
                  disabled={disabled || atMaxSeverity}
                  onClick={() => onEscalate(e.id)}
                >
                  <ArrowUp size={12} />
                  Escalate
                </button>
                <button
                  type="button"
                  className="action-btn resolve"
                  disabled={disabled}
                  onClick={() => onResolve(e.id)}
                >
                  <CheckCircle size={12} />
                  Mark Finished
                </button>
              </div>
            </li>
          );
        })}
      </ul>

      {resolved.length > 0 && (
        <>
          <div className="panel-subtitle">Resolved ({resolved.length})</div>
          <ul className="entity-list resolved-list">
            {resolved.map((e) => (
              <li key={e.id} className="entity-item resolved">
                <div className="entity-row">
                  <span className="entity-id">{e.id}</span>
                  <span className={`type-tag type-${e.type}`}>{EMERGENCY_TYPE_LABELS[e.type]}</span>
                  <span className="status-tag status-resolved">FINISHED</span>
                </div>
              </li>
            ))}
          </ul>
        </>
      )}
    </section>
  );
}
