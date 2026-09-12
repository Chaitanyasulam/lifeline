import { useMemo, useState } from 'react';
import {
  Plus,
  Truck,
  Construction,
  Building2,
  RefreshCw,
  RotateCcw,
} from 'lucide-react';
import { ROADS } from '../data/mapData.js';
import { DEMO_EVENTS, blockRoute } from '../simulation/events.js';

const CONTROLS = [
  {
    id: 'addEmergency',
    label: 'New Emergency',
    icon: Plus,
    event: DEMO_EVENTS.addEmergency,
    message: 'New emergency reported',
  },
  {
    id: 'addResource',
    label: 'Add Resource',
    icon: Truck,
    event: DEMO_EVENTS.addResource,
    message: 'New resource deployed to the field',
  },
  {
    id: 'closeFacility',
    label: 'Close Facility',
    icon: Building2,
    event: DEMO_EVENTS.closeFacility,
    message: 'Hospital H02 closed',
  },
];

function isRoadBlocked(road, blockedRoads) {
  return blockedRoads.some(
    (b) => b.from.x === road.from.x && b.to.x === road.to.x,
  );
}

export function SimulationControls({ onEvent, onReoptimize, onReset, blockedRoads = [], disabled }) {
  const [selectedRoadId, setSelectedRoadId] = useState('H2');

  const majorRoads = useMemo(() => ROADS.filter((r) => r.major), []);
  const minorRoads = useMemo(() => ROADS.filter((r) => !r.major), []);

  const selectedRoad = ROADS.find((r) => r.id === selectedRoadId);
  const selectedRoadBlocked = selectedRoad
    ? isRoadBlocked(selectedRoad, blockedRoads)
    : false;

  const handleBlockRoute = () => {
    if (!selectedRoad || selectedRoadBlocked) return;

    onEvent(
      (state) => blockRoute(state, selectedRoadId),
      `${selectedRoad.name} blocked — rerouting all units`,
      { reoptimize: true },
    );
  };

  return (
    <section className="panel controls-panel">
      <div className="panel-title">
        <h2>Simulation Controls</h2>
      </div>

      <div className="controls-grid">
        {CONTROLS.map(({ id, label, icon: Icon, event, message, reoptimize = true }) => (
          <button
            key={id}
            type="button"
            className="control-btn"
            disabled={disabled}
            onClick={() => onEvent(event, message, { reoptimize })}
          >
            <Icon size={16} />
            {label}
          </button>
        ))}

        <div className="road-block-control">
          <label className="road-block-label" htmlFor="block-road-select">
            Block route
          </label>
          <select
            id="block-road-select"
            className="road-block-select"
            value={selectedRoadId}
            disabled={disabled}
            onChange={(e) => setSelectedRoadId(e.target.value)}
          >
            <optgroup label="Major arteries">
              {majorRoads.map((road) => (
                <option key={road.id} value={road.id} disabled={isRoadBlocked(road, blockedRoads)}>
                  {road.name}{isRoadBlocked(road, blockedRoads) ? ' (blocked)' : ''}
                </option>
              ))}
            </optgroup>
            <optgroup label="Connectors & spurs">
              {minorRoads.map((road) => (
                <option key={road.id} value={road.id} disabled={isRoadBlocked(road, blockedRoads)}>
                  {road.name}{isRoadBlocked(road, blockedRoads) ? ' (blocked)' : ''}
                </option>
              ))}
            </optgroup>
          </select>
          <button
            type="button"
            className="control-btn"
            disabled={disabled || selectedRoadBlocked}
            onClick={handleBlockRoute}
          >
            <Construction size={16} />
            Block Selected Road
          </button>
        </div>

        <button
          type="button"
          className="control-btn accent"
          disabled={disabled}
          onClick={onReoptimize}
        >
          <RefreshCw size={16} />
          Reoptimize
        </button>

        <button
          type="button"
          className="control-btn muted"
          disabled={disabled}
          onClick={onReset}
        >
          <RotateCcw size={16} />
          Reset Scenario
        </button>
      </div>
    </section>
  );
}
