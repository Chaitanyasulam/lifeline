import { Building2 } from 'lucide-react';

const FACILITY_CLASS = {
  Hospital: 'facility-hospital',
  'Fire Station': 'facility-fire',
  Shelter: 'facility-shelter',
  'Emergency Operations Center': 'facility-eoc',
  'Relief Center': 'facility-relief',
};

export function FacilityPanel({ facilities, selected, onSelect }) {
  return (
    <section className="panel facility-panel">
      <div className="panel-title">
        <Building2 size={14} />
        <h2>Facilities & Destinations</h2>
        <span className="count">{facilities.length}</span>
      </div>

      <ul className="entity-list">
        {facilities.map((f) => {
          const isSelected = selected?.type === 'facility' && selected.id === f.id;
          return (
            <li
              key={f.id}
              className={`entity-item selectable ${FACILITY_CLASS[f.type] ?? ''} ${f.status === 'closed' ? 'facility-closed-item' : ''} ${isSelected ? 'selected' : ''}`}
              onClick={() => onSelect('facility', f.id)}
              onKeyDown={(ev) => ev.key === 'Enter' && onSelect('facility', f.id)}
              role="button"
              tabIndex={0}
            >
              <div className="entity-row">
                <span className="entity-id">{f.id}</span>
                <span className={`type-tag ${FACILITY_CLASS[f.type] ?? ''}`}>{f.type}</span>
              </div>
              <div className="entity-meta">
                <span>{f.location.zone}</span>
                <span className={f.status === 'closed' ? 'status-closed' : 'status-open'}>
                  {f.status}
                </span>
              </div>
              <div className="entity-capabilities">{f.capabilities.join(', ')}</div>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
