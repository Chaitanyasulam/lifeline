import { AlertCircle, ArrowUp, ArrowDown, CheckCircle, Lock, MapPin } from 'lucide-react';
import { EMERGENCY_TYPE_LABELS } from '../models/types.js';
import {
  getNearestCompatibleTravelTime,
  getNearestCompatibleDistance,
} from '../engine/scoring.js';
import { createRoutingContext } from '../engine/routing.js';

const SEVERITY_CLASS = {
  CRITICAL: 'severity-critical',
  HIGH: 'severity-high',
  MEDIUM: 'severity-medium',
  LOW: 'severity-low',
};

const SEVERITY_ORDER = { CRITICAL: 4, HIGH: 3, MEDIUM: 2, LOW: 1 };

function getEmergencyDistanceInfo(emergency, assignment, resources, routingContext) {
  if (assignment) {
    return {
      time: assignment.travelTime,
      distance: assignment.distance ?? null,
      label: 'En route',
    };
  }

  const time = getNearestCompatibleTravelTime(emergency, resources, routingContext);
  const distance = getNearestCompatibleDistance(emergency, resources, routingContext);

  return {
    time,
    distance,
    label: 'Nearest unit',
  };
}

export function EmergencyPanel({
  emergencies,
  resources,
  blockedRoads,
  emergencyAssignmentMap,
  selected,
  onSelect,
  onEscalate,
  onDeescalate,
  onResolve,
  disabled,
  typeFilter = 'all',
}) {
  const routingContext = createRoutingContext({ blockedRoads: blockedRoads ?? [] });

  const filtered = typeFilter === 'all'
    ? emergencies
    : emergencies.filter((e) => e.type === typeFilter);

  const active = filtered
    .filter((e) => e.status !== 'resolved')
    .sort((a, b) => {
      const severityDiff = SEVERITY_ORDER[b.severity] - SEVERITY_ORDER[a.severity];
      if (severityDiff !== 0) return severityDiff;

      const distA = getNearestCompatibleTravelTime(a, resources, routingContext) ?? Infinity;
      const distB = getNearestCompatibleTravelTime(b, resources, routingContext) ?? Infinity;
      return distA - distB;
    });

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

      <p className="panel-hint">
        Sorted by severity, then distance. Distance shown for all calls — en route and waiting.
      </p>

      <ul className="entity-list">
        {active.map((e) => {
          const assignment = emergencyAssignmentMap.get(e.id);
          const isEnRoute = e.status === 'assigned' && assignment;
          const isSelected = selected?.type === 'emergency' && selected.id === e.id;
          const atMaxSeverity = e.severity === 'CRITICAL';
          const atMinSeverity = e.severity === 'LOW';
          const distInfo = getEmergencyDistanceInfo(e, assignment, resources, routingContext);

          return (
            <li
              key={e.id}
              className={`entity-item selectable ${SEVERITY_CLASS[e.severity]} ${isSelected ? 'selected' : ''} ${isEnRoute ? 'en-route' : ''}`}
              onClick={() => onSelect('emergency', e.id)}
              onKeyDown={(ev) => ev.key === 'Enter' && onSelect('emergency', e.id)}
              role="button"
              tabIndex={0}
            >
              <div className="entity-row">
                <span className="entity-id">{e.id}</span>
                <span className={`severity-tag ${SEVERITY_CLASS[e.severity]}`}>
                  {e.severity}
                </span>
                <span className={`type-tag type-${e.type}`}>
                  {EMERGENCY_TYPE_LABELS[e.type]}
                </span>
              </div>
              <div className="entity-meta">
                <span>{e.peopleAffected} affected</span>
                <span>{e.location.zone}</span>
                <span>Needs: {e.requiredCapabilities.join(', ')}</span>
              </div>

              <div className="distance-row">
                <MapPin size={11} />
                <span className="distance-label">{distInfo.label}:</span>
                <span className="distance-value">
                  {distInfo.time != null ? `${distInfo.time} min` : '—'}
                  {distInfo.distance != null && (
                    <span className="distance-units"> · {distInfo.distance} units</span>
                  )}
                </span>
              </div>

              <div className="entity-status">
                {isEnRoute ? (
                  <>
                    <Lock size={11} />
                    <span>Assigned → {assignment.resourceId}</span>
                  </>
                ) : (
                  'Waiting for compatible resource'
                )}
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
