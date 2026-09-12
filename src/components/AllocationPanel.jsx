import { GitBranch, Lock } from 'lucide-react';

export function AllocationPanel({ assignments, strategy }) {
  const label =
    strategy === 'NEAREST_FIRST' ? 'Nearest-First Allocation' : 'LIFELINE Allocation';

  return (
    <section className="panel allocation-panel">
      <div className="panel-title">
        <GitBranch size={14} />
        <h2>{label}</h2>
      </div>

      {assignments.length === 0 ? (
        <p className="empty-state">No assignments possible with current resources</p>
      ) : (
        <ul className="allocation-list">
          {assignments.map((a) => (
            <li key={`${a.resourceId}-${a.emergencyId}`} className={a.locked ? 'locked-assignment' : ''}>
              <span className="alloc-pair">
                {a.locked && <Lock size={10} />}
                {a.resourceId} → {a.emergencyId}
              </span>
              <span className="alloc-time">{a.travelTime} min</span>
              <span className="alloc-dist">{a.distance?.toFixed?.(0) ?? '—'} u</span>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
