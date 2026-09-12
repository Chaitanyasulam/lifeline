import { X, ArrowUp, ArrowDown, CheckCircle, Ban } from 'lucide-react';
import { EMERGENCY_TYPE_LABELS } from '../models/types.js';

export function SelectionBar({
  selected,
  state,
  assignmentMap,
  emergencyAssignmentMap,
  onClear,
  onEscalate,
  onDeescalate,
  onResolve,
  onToggleResource,
  disabled,
}) {
  if (!selected) return null;

  if (selected.type === 'emergency') {
    const emergency = state.emergencies.find((e) => e.id === selected.id);
    if (!emergency) return null;

    const assignment = emergencyAssignmentMap.get(emergency.id);
    const isAssigned =
      emergency.status === 'assigned' ||
      state.resources.some(
        (r) => r.status === 'assigned' && r.currentAssignment === emergency.id,
      );
    const atMax = emergency.severity === 'CRITICAL';
    const atMin = emergency.severity === 'LOW';
    const isResolved = emergency.status === 'resolved';

    return (
      <div className="selection-bar">
        <span className="selection-label">
          Selected: <strong>{emergency.id}</strong> — {EMERGENCY_TYPE_LABELS[emergency.type]} · {emergency.severity} · {emergency.location.zone}
          · needs [{emergency.requiredCapabilities.join(', ')}]
          {assignment && ` · ${assignment.resourceId} en route (${assignment.travelTime} min)`}
        </span>
        <div className="selection-actions">
          {!isResolved && (
            <>
              {!isAssigned && (
                <>
                  <button
                    type="button"
                    className="action-btn deescalate"
                    disabled={disabled || atMin}
                    onClick={() => onDeescalate(emergency.id)}
                  >
                    <ArrowDown size={12} /> Reduce
                  </button>
                  <button
                    type="button"
                    className="action-btn escalate"
                    disabled={disabled || atMax}
                    onClick={() => onEscalate(emergency.id)}
                  >
                    <ArrowUp size={12} /> Escalate
                  </button>
                </>
              )}
              <button
                type="button"
                className="action-btn resolve"
                disabled={disabled}
                onClick={() => onResolve(emergency.id)}
              >
                <CheckCircle size={12} /> Mark Finished
              </button>
            </>
          )}
          <button type="button" className="action-btn clear" onClick={onClear}>
            <X size={12} /> Clear
          </button>
        </div>
      </div>
    );
  }

  if (selected.type === 'resource') {
    const resource = state.resources.find((r) => r.id === selected.id);
    if (!resource) return null;

    const assignment = assignmentMap.get(resource.id);
    const isUnavailable = resource.status === 'unavailable';

    return (
      <div className="selection-bar">
        <span className="selection-label">
          Selected: <strong>{resource.id}</strong> — {resource.type} · caps [{resource.capabilities.join(', ')}] · {resource.location.zone}
          {isUnavailable ? ' · UNAVAILABLE' : assignment ? ` · assigned to ${assignment.emergencyId}` : ' · available'}
        </span>
        <div className="selection-actions">
          <button
            type="button"
            className={`action-btn ${isUnavailable ? 'resolve' : 'unavailable'}`}
            disabled={disabled}
            onClick={() => onToggleResource(resource.id)}
          >
            {isUnavailable ? (
              <>
                <CheckCircle size={12} /> Mark Available
              </>
            ) : (
              <>
                <Ban size={12} /> Mark Unavailable
              </>
            )}
          </button>
          <button type="button" className="action-btn clear" onClick={onClear}>
            <X size={12} /> Clear
          </button>
        </div>
      </div>
    );
  }

  return null;
}
