import { Truck, Ban, CheckCircle } from 'lucide-react';

const STATUS_CLASS = {
  available: 'status-available',
  assigned: 'status-assigned',
  unavailable: 'status-unavailable',
};

export function ResourcePanel({
  resources,
  assignmentMap,
  selected,
  onSelect,
  onToggleAvailability,
  disabled,
}) {
  return (
    <section className="panel resource-panel">
      <div className="panel-title">
        <Truck size={14} />
        <h2>Resources</h2>
        <span className="count">{resources.length}</span>
      </div>

      <ul className="entity-list entity-grid">
        {resources.map((r) => {
          const assignment = assignmentMap.get(r.id);
          const isUnavailable = r.status === 'unavailable';
          const displayStatus = isUnavailable
            ? 'unavailable'
            : assignment
              ? 'assigned'
              : 'available';
          const isSelected = selected?.type === 'resource' && selected.id === r.id;

          return (
            <li
              key={r.id}
              className={`entity-item selectable ${STATUS_CLASS[displayStatus]} ${isSelected ? 'selected' : ''}`}
              onClick={() => onSelect('resource', r.id)}
              onKeyDown={(ev) => ev.key === 'Enter' && onSelect('resource', r.id)}
              role="button"
              tabIndex={0}
            >
              <div className="entity-row">
                <span className="entity-id">{r.id}</span>
                <span className="resource-type-tag">{r.type}</span>
                <span className={`status-tag ${STATUS_CLASS[displayStatus]}`}>
                  {displayStatus}
                </span>
              </div>
              <div className="entity-meta">
                <span><strong>{r.location.zone}</strong> · Capacity {r.capacity}</span>
                <span className="entity-needs">{r.capabilities.join(', ')}</span>
              </div>
              {assignment && !isUnavailable && (
                <div className="entity-status">
                  Assigned → {assignment.emergencyId} ({assignment.travelTime} min)
                </div>
              )}

              <div className="entity-actions" onClick={(ev) => ev.stopPropagation()}>
                <button
                  type="button"
                  className={`action-btn ${isUnavailable ? 'resolve' : 'unavailable'}`}
                  disabled={disabled}
                  onClick={() => onToggleAvailability(r.id)}
                >
                  {isUnavailable ? (
                    <>
                      <CheckCircle size={12} />
                      Mark Available
                    </>
                  ) : (
                    <>
                      <Ban size={12} />
                      Mark Unavailable
                    </>
                  )}
                </button>
              </div>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
