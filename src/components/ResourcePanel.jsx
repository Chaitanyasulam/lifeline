import { Truck } from 'lucide-react';

const STATUS_CLASS = {
  available: 'status-available',
  assigned: 'status-assigned',
  unavailable: 'status-unavailable',
};

export function ResourcePanel({ resources, assignmentMap }) {
  return (
    <section className="panel resource-panel">
      <div className="panel-title">
        <Truck size={14} />
        <h2>Resources</h2>
        <span className="count">{resources.length}</span>
      </div>

      <ul className="entity-list">
        {resources.map((r) => {
          const assignment = assignmentMap.get(r.id);
          const displayStatus =
            r.status === 'unavailable'
              ? 'unavailable'
              : assignment
                ? 'assigned'
                : 'available';

          return (
            <li key={r.id} className={`entity-item ${STATUS_CLASS[displayStatus]}`}>
              <div className="entity-row">
                <span className="entity-id">{r.id}</span>
                <span className={`status-tag ${STATUS_CLASS[displayStatus]}`}>
                  {displayStatus}
                </span>
              </div>
              <div className="entity-meta">
                <span>{r.type}</span>
                <span>{r.location.zone}</span>
                <span>Cap: {r.capacity}</span>
              </div>
              <div className="entity-capabilities">
                {r.capabilities.join(', ')}
              </div>
              {assignment && (
                <div className="entity-status">
                  → {assignment.emergencyId} ({assignment.travelTime} min)
                </div>
              )}
            </li>
          );
        })}
      </ul>
    </section>
  );
}
