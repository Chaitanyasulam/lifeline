import { MAP_WIDTH, MAP_HEIGHT, ZONES, ROADS } from '../data/mapData.js';

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

function MapMarker({ x, y, color, label, sublabel, pulse }) {
  return (
    <g className={`map-marker ${pulse ? 'pulse' : ''}`} transform={`translate(${x}, ${y})`}>
      <circle r={14} fill={color} fillOpacity={0.2} stroke={color} strokeWidth={2} />
      <circle r={5} fill={color} />
      <text y={26} textAnchor="middle" className="marker-label">
        {label}
      </text>
      {sublabel && (
        <text y={38} textAnchor="middle" className="marker-sublabel">
          {sublabel}
        </text>
      )}
    </g>
  );
}

export function MapView({
  resources,
  emergencies,
  facilities,
  blockedRoads,
  assignments,
  assignmentMap,
}) {
  const assignedEmergencyIds = new Set(assignments.map((a) => a.emergencyId));

  return (
    <section className="panel map-panel">
      <div className="panel-title map-title">
        <span>Simulated City Map</span>
        <div className="map-legend">
          <span><i className="dot critical" /> Critical</span>
          <span><i className="dot high" /> High</span>
          <span><i className="dot medium" /> Medium</span>
          <span><i className="dot low" /> Low</span>
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
                {blocked && (
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
            return (
              <line
                key={`route-${a.resourceId}-${a.emergencyId}`}
                x1={resource.location.x}
                y1={resource.location.y}
                x2={emergency.location.x}
                y2={emergency.location.y}
                className="assignment-route"
                filter="url(#glow)"
              />
            );
          })}

          {facilities.map((f) => (
            <g
              key={f.id}
              transform={`translate(${f.location.x}, ${f.location.y})`}
              className={f.status === 'closed' ? 'facility-closed' : 'facility-open'}
            >
              <rect x={-12} y={-12} width={24} height={24} rx={4} className="facility-icon-bg" />
              <text y={4} textAnchor="middle" className="facility-icon">
                {f.status === 'closed' ? '✕' : '+'}
              </text>
              <text y={22} textAnchor="middle" className="marker-label">
                {f.id}
              </text>
              {f.status === 'closed' && (
                <text y={34} textAnchor="middle" className="marker-sublabel closed-tag">
                  CLOSED
                </text>
              )}
            </g>
          ))}

          {emergencies
            .filter((e) => e.status !== 'resolved')
            .map((e) => (
              <MapMarker
                key={e.id}
                x={e.location.x}
                y={e.location.y}
                color={SEVERITY_COLOR[e.severity]}
                label={e.id}
                sublabel={e.severity}
                pulse={!assignedEmergencyIds.has(e.id) && e.severity === 'CRITICAL'}
              />
            ))}

          {resources.map((r) => {
            const assigned = assignmentMap.has(r.id);
            const unavailable = r.status === 'unavailable';
            return (
              <g
                key={r.id}
                transform={`translate(${r.location.x}, ${r.location.y})`}
                className={`resource-marker ${unavailable ? 'unavailable' : assigned ? 'assigned' : 'available'}`}
              >
                <rect
                  x={-13}
                  y={-13}
                  width={26}
                  height={26}
                  rx={5}
                  className="resource-box"
                />
                <text y={4} textAnchor="middle" className="resource-symbol">
                  {unavailable ? '✕' : '⬤'}
                </text>
                <text y={24} textAnchor="middle" className="marker-label">
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
