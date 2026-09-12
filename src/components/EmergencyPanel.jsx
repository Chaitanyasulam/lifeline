import { AlertCircle, ArrowUp, ArrowDown, CheckCircle, Lock, MapPin } from 'lucide-react';
import { EMERGENCY_TYPE_LABELS } from '../models/types.js';
import {
  getNearestCompatibleTravelTime,
  getNearestCompatibleResource,
} from '../engine/scoring.js';
import { createRoutingContext } from '../engine/routing.js';

const SEVERITY_CLASS = {
  CRITICAL: 'severity-critical',
  HIGH: 'severity-high',
  MEDIUM: 'severity-medium',
  LOW: 'severity-low',
};

const SEVERITY_ORDER = { CRITICAL: 4, HIGH: 3, MEDIUM: 2, LOW: 1 };

function isEmergencyAssigned(emergency, resources) {
  return (
    emergency.status === 'assigned' ||
    resources.some(
      (r) => r.status === 'assigned' && r.currentAssignment === emergency.id,
    )
  );
}

function sortByPriority(emergencies, resources, routingContext) {
  return [...emergencies].sort((a, b) => {
    const severityDiff = SEVERITY_ORDER[b.severity] - SEVERITY_ORDER[a.severity];
    if (severityDiff !== 0) return severityDiff;

    const distA = getNearestCompatibleTravelTime(a, resources, routingContext) ?? Infinity;
    const distB = getNearestCompatibleTravelTime(b, resources, routingContext) ?? Infinity;
    return distA - distB;
  });
}

function getEmergencyDistanceInfo(emergency, assignment, resources, routingContext) {
  if (assignment) {
    const resource = resources.find((r) => r.id === assignment.resourceId);
    return {
      time: assignment.travelTime,
      location: resource?.location?.zone ?? null,
      resourceId: assignment.resourceId,
      label: 'En route',
    };
  }

  const nearest = getNearestCompatibleResource(emergency, resources, routingContext);
  const time = getNearestCompatibleTravelTime(emergency, resources, routingContext);

  return {
    time,
    location: nearest?.location?.zone ?? null,
    resourceId: nearest?.id ?? null,
    label: 'Nearest',
  };
}

function EmergencyCard({
  emergency: e,
  assignment,
  isEnRoute,
  resources,
  routingContext,
  selected,
  onSelect,
  onEscalate,
  onDeescalate,
  onResolve,
  disabled,
}) {
  const isSelected = selected?.type === 'emergency' && selected.id === e.id;
  const atMaxSeverity = e.severity === 'CRITICAL';
  const atMinSeverity = e.severity === 'LOW';
  const distInfo = getEmergencyDistanceInfo(e, assignment, resources, routingContext);

  return (
    <li
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
        <span><strong>{e.location.zone}</strong> · {e.peopleAffected} affected</span>
        <span className="entity-needs">Needs: {e.requiredCapabilities.join(', ')}</span>
      </div>

              <div className="distance-row">
                <MapPin size={13} />
                <span className="distance-label">{distInfo.label}:</span>
                <span className="distance-value">
                  {distInfo.time != null ? `${distInfo.time} min` : '—'}
                  {distInfo.location && (
                    <span className="distance-location"> · {distInfo.location}</span>
                  )}
                  {distInfo.resourceId && (
                    <span className="distance-units"> ({distInfo.resourceId})</span>
                  )}
                </span>
              </div>

      <div className="entity-status">
        {isEnRoute ? (
          <>
            <Lock size={13} />
            <span>Assigned → {assignment?.resourceId ?? '—'}</span>
          </>
        ) : (
          'Waiting for unit'
        )}
      </div>

      <div className="entity-actions" onClick={(ev) => ev.stopPropagation()}>
        {isEnRoute ? (
          <button
            type="button"
            className="action-btn resolve"
            disabled={disabled}
            onClick={() => onResolve(e.id)}
          >
            <CheckCircle size={12} />
            Mark Finished
          </button>
        ) : (
          <>
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
          </>
        )}
      </div>
    </li>
  );
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

  const activeUnresolved = filtered.filter((e) => e.status !== 'resolved');
  const assigned = sortByPriority(
    activeUnresolved.filter((e) => isEmergencyAssigned(e, resources)),
    resources,
    routingContext,
  );
  const upNext = sortByPriority(
    activeUnresolved.filter((e) => !isEmergencyAssigned(e, resources)),
    resources,
    routingContext,
  );

  const resolved = filtered.filter((e) => e.status === 'resolved');

  const renderCard = (e) => {
    const assignment = emergencyAssignmentMap.get(e.id);
    const isEnRoute = isEmergencyAssigned(e, resources);

    return (
      <EmergencyCard
        key={e.id}
        emergency={e}
        assignment={assignment}
        isEnRoute={isEnRoute}
        resources={resources}
        routingContext={routingContext}
        selected={selected}
        onSelect={onSelect}
        onEscalate={onEscalate}
        onDeescalate={onDeescalate}
        onResolve={onResolve}
        disabled={disabled}
      />
    );
  };

  return (
    <section className="panel emergency-panel">
      <div className="panel-title">
        <AlertCircle size={14} />
        <h2>Active Emergencies</h2>
        <span className="count">{assigned.length + upNext.length}</span>
        {typeFilter !== 'all' && (
          <span className="filter-tag">{EMERGENCY_TYPE_LABELS[typeFilter]}</span>
        )}
      </div>

      {assigned.length > 0 && (
        <ul
          className="entity-list entity-grid emergency-assigned-row"
          style={{ '--assigned-count': assigned.length }}
        >
          {assigned.map(renderCard)}
        </ul>
      )}

      {upNext.length > 0 && (
        <>
          <div className="panel-subtitle">Up Next ({upNext.length})</div>
          <ul className="entity-list entity-grid emergency-upnext-row">
            {upNext.map(renderCard)}
          </ul>
        </>
      )}

      {resolved.length > 0 && (
        <>
          <div className="panel-subtitle">Resolved ({resolved.length})</div>
          <ul className="entity-list entity-grid resolved-list">
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
