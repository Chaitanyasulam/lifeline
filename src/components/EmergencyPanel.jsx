import { AlertCircle } from 'lucide-react';

const SEVERITY_CLASS = {
  CRITICAL: 'severity-critical',
  HIGH: 'severity-high',
  MEDIUM: 'severity-medium',
  LOW: 'severity-low',
};

export function EmergencyPanel({ emergencies, emergencyAssignmentMap }) {
  const active = emergencies.filter((e) => e.status !== 'resolved');

  return (
    <section className="panel emergency-panel">
      <div className="panel-title">
        <AlertCircle size={14} />
        <h2>Active Emergencies</h2>
        <span className="count">{active.length}</span>
      </div>

      <ul className="entity-list">
        {active.map((e) => {
          const assignment = emergencyAssignmentMap.get(e.id);
          return (
            <li key={e.id} className={`entity-item ${SEVERITY_CLASS[e.severity]}`}>
              <div className="entity-row">
                <span className="entity-id">{e.id}</span>
                <span className={`severity-tag ${SEVERITY_CLASS[e.severity]}`}>
                  {e.severity}
                </span>
              </div>
              <div className="entity-meta">
                <span>{e.type}</span>
                <span>{e.location.zone}</span>
                <span>{e.peopleAffected} affected</span>
              </div>
              <div className="entity-status">
                {assignment
                  ? `Assigned → ${assignment.resourceId} (${assignment.travelTime} min)`
                  : 'Waiting for resource'}
              </div>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
