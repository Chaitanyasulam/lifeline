import { MAP_WIDTH, MAP_HEIGHT, ZONES, ROADS } from '../data/mapData.js';
import {
  EMERGENCY_TYPE_COLORS,
  EMERGENCY_TYPE_LABELS,
  RESOURCE_TYPE_SYMBOLS,
} from '../models/types.js';

const SEVERITY_COLOR = {
  CRITICAL: '#ef4444',
  HIGH: '#f97316',
  MEDIUM: '#eab308',
  LOW: '#22c55e',
};

function isRoadBlocked(road, blockedRoads) {
  return blockedRoads.some(
    (b) =>
      b.blocked &&
      b.from.x === road.from.x &&
      b.from.y === road.from.y &&
      b.to.x === road.to.x &&
      b.to.y === road.to.y,
  );
}

function MapMarker({ x, y, typeColor, severityColor, label, sublabel, pulse, selected, onClick }) {
  return (
    <g
      className={`map-marker ${pulse ? 'pulse' : ''} ${selected ? 'selected' : ''} clickable`}
      transform={`translate(${x}, ${y})`}
      onClick={onClick}
      style={{ cursor: 'pointer' }}
    >
      {selected && (
        <circle r={26} fill="none" stroke="#60a5fa" strokeWidth={2.5} strokeDasharray="4 3" />
      )}
      <circle r={20} fill={typeColor} fillOpacity={0.15} stroke={typeColor} strokeWidth={2.5} />
      <circle r={8} fill={severityColor} stroke={typeColor} strokeWidth={2} />
      <text y={32} textAnchor="middle" className="marker-label">
        {label}
      </text>
      {sublabel && (
        <text y={46} textAnchor="middle" className="marker-sublabel">
          {sublabel}
        </text>
      )}
    </g>
  );
}

const FACILITY_SYMBOLS = {
  Hospital: 'H',
  'Fire Station': 'FS',
  Shelter: 'SH',
  'Emergency Operations Center': 'EOC',
  'Relief Center': 'RC',
};

export function MapView({
  resources,
  emergencies,
  facilities,
  blockedRoads,
  assignments,
  assignmentMap,
  selected,
  onSelect,
  emergencyTypeFilter = 'all',
}) {
  const visibleEmergencies = emergencies.filter((e) => {
    if (e.status === 'resolved') return false;
    if (emergencyTypeFilter === 'all') return true;
    return e.type === emergencyTypeFilter;
  });

  const assignedEmergencyIds = new Set(assignments.map((a) => a.emergencyId));

  return (
    <section className="panel map-panel">
      <div className="panel-title map-title">
        <span>Simulated City Map</span>
        <div className="map-legend">
          <span className="legend-group">Types:</span>
          {Object.entries(EMERGENCY_TYPE_LABELS).slice(0, 4).map(([key, label]) => (
            <span key={key}>
              <i className="dot" style={{ background: EMERGENCY_TYPE_COLORS[key] }} /> {label}
            </span>
          ))}
          <span className="map-hint">Click markers to select</span>
        </div>
      </div>

      <div className="map-container">
        <svg
          viewBox={`0 0 ${MAP_WIDTH} ${MAP_HEIGHT}`}
          className="city-map"
          preserveAspectRatio="xMidYMid meet"
        >
          <defs>
            <pattern id="grid" width="50" height="50" patternUnits="userSpaceOnUse">
              <path d="M 50 0 L 0 0 0 50" fill="none" stroke="#1e293b" strokeWidth="0.5" />
            </pattern>
            <filter id="glow">
              <feGaussianBlur stdDeviation="2" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          <rect width={MAP_WIDTH} height={MAP_HEIGHT} fill="#0c1222" />
          <rect width={MAP_WIDTH} height={MAP_HEIGHT} fill="url(#grid)" opacity="0.6" />

          {ZONES.map((z) => (
            <g key={z.id}>
              <rect
                x={z.x}
                y={z.y}
                width={z.w}
                height={z.h}
                fill="#1e293b"
                fillOpacity={0.35}
                stroke="#334155"
                strokeWidth={1}
                rx={4}
              />
              <text x={z.x + 8} y={z.y + 16} className="zone-label">
                {z.label}
              </text>
            </g>
          ))}

          {ROADS.map((road) => {
            const blocked = isRoadBlocked(road, blockedRoads);
            return (
              <g key={road.id}>
                <line
                  x1={road.from.x}
                  y1={road.from.y}
                  x2={road.to.x}
                  y2={road.to.y}
                  className={`road ${road.major ? 'major' : ''} ${blocked ? 'blocked' : ''}`}
                />
                {blocked && road.major && (
                  <text
                    x={(road.from.x + road.to.x) / 2}
                    y={(road.from.y + road.to.y) / 2 - 8}
                    textAnchor="middle"
                    className="blocked-label"
                  >
                    🚧 BLOCKED
                  </text>
                )}
              </g>
            );
          })}

          {assignments.map((a) => {
            const resource = resources.find((r) => r.id === a.resourceId);
            const emergency = emergencies.find((e) => e.id === a.emergencyId);
            if (!resource || !emergency) return null;
            if (emergencyTypeFilter !== 'all' && emergency.type !== emergencyTypeFilter) return null;

            const isHighlighted =
              (selected?.type === 'resource' && selected.id === a.resourceId) ||
              (selected?.type === 'emergency' && selected.id === a.emergencyId);

            return (
              <line
                key={`route-${a.resourceId}-${a.emergencyId}`}
                x1={resource.location.x}
                y1={resource.location.y}
                x2={emergency.location.x}
                y2={emergency.location.y}
                className={`assignment-route ${isHighlighted ? 'highlighted' : ''}`}
                filter="url(#glow)"
              />
            );
          })}

          {facilities.map((f) => {
            const isSelected = selected?.type === 'facility' && selected.id === f.id;
            const symbol = FACILITY_SYMBOLS[f.type] ?? 'F';
            return (
              <g
                key={f.id}
                transform={`translate(${f.location.x}, ${f.location.y})`}
                className={`facility-marker clickable ${f.status === 'closed' ? 'facility-closed' : 'facility-open'} ${isSelected ? 'selected' : ''}`}
                onClick={() => onSelect('facility', f.id)}
                style={{ cursor: 'pointer' }}
              >
                {isSelected && (
                  <rect x={-22} y={-22} width={44} height={44} rx={5} fill="none" stroke="#60a5fa" strokeWidth={2.5} strokeDasharray="4 3" />
                )}
                <rect x={-18} y={-18} width={36} height={36} rx={5} className="facility-icon-bg" />
                <text y={4} textAnchor="middle" className="facility-symbol">
                  {f.status === 'closed' ? '✕' : symbol}
                </text>
                <text y={24} textAnchor="middle" className="marker-label">
                  {f.id}
                </text>
              </g>
            );
          })}

          {visibleEmergencies.map((e) => (
            <MapMarker
              key={e.id}
              x={e.location.x}
              y={e.location.y}
              typeColor={EMERGENCY_TYPE_COLORS[e.type] ?? '#94a3b8'}
              severityColor={SEVERITY_COLOR[e.severity]}
              label={e.id}
              sublabel={`${EMERGENCY_TYPE_LABELS[e.type]?.slice(0, 3) ?? e.type} · ${e.severity.slice(0, 1)}`}
              pulse={!assignedEmergencyIds.has(e.id) && e.severity === 'CRITICAL'}
              selected={selected?.type === 'emergency' && selected.id === e.id}
              onClick={() => onSelect('emergency', e.id)}
            />
          ))}

          {resources.map((r) => {
            const assigned = assignmentMap.has(r.id);
            const unavailable = r.status === 'unavailable';
            const isSelected = selected?.type === 'resource' && selected.id === r.id;
            const symbol = RESOURCE_TYPE_SYMBOLS[r.type] ?? 'R';

            return (
              <g
                key={r.id}
                transform={`translate(${r.location.x}, ${r.location.y})`}
                className={`resource-marker clickable ${unavailable ? 'unavailable' : assigned ? 'assigned' : 'available'} ${isSelected ? 'selected' : ''}`}
                onClick={() => onSelect('resource', r.id)}
                style={{ cursor: 'pointer' }}
              >
                {isSelected && (
                  <rect x={-22} y={-22} width={44} height={44} rx={6} fill="none" stroke="#60a5fa" strokeWidth={2.5} strokeDasharray="4 3" />
                )}
                <rect x={-18} y={-18} width={36} height={36} rx={6} className="resource-box" />
                <text y={4} textAnchor="middle" className="resource-symbol">
                  {unavailable ? '✕' : symbol}
                </text>
                <text y={26} textAnchor="middle" className="marker-label">
                  {r.id}
                </text>
              </g>
            );
          })}
        </svg>
      </div>
    </section>
  );
}
