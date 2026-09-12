import {
  Plus,
  AlertTriangle,
  Ban,
  Move,
  Construction,
  Building2,
  RefreshCw,
  RotateCcw,
} from 'lucide-react';
import { DEMO_EVENTS } from '../simulation/events.js';

const CONTROLS = [
  {
    id: 'addEmergency',
    label: 'New Emergency',
    icon: Plus,
    event: DEMO_EVENTS.addEmergency,
    message: 'New emergency reported',
  },
  {
    id: 'blockRoute',
    label: 'Block Route',
    icon: Construction,
    event: DEMO_EVENTS.blockRoute,
    message: 'Major route blocked on Central Ave',
  },
  {
    id: 'disableResource',
    label: 'Disable Resource',
    icon: Ban,
    event: DEMO_EVENTS.disableAmbulance,
    message: 'Resource A03 disabled',
  },
  {
    id: 'escalate',
    label: 'Escalate Emergency',
    icon: AlertTriangle,
    event: DEMO_EVENTS.escalateEmergency,
    message: 'Emergency E05 severity escalated',
  },
  {
    id: 'moveResource',
    label: 'Move Resource',
    icon: Move,
    event: DEMO_EVENTS.moveResource,
    message: 'Resource A03 relocated to Zone 5',
  },
  {
    id: 'closeFacility',
    label: 'Close Facility',
    icon: Building2,
    event: DEMO_EVENTS.closeFacility,
    message: 'Hospital H02 closed',
  },
];

export function SimulationControls({ onEvent, onReoptimize, onReset, disabled }) {
  return (
    <section className="panel controls-panel">
      <div className="panel-title">
        <h2>Simulation Controls</h2>
      </div>

      <div className="controls-grid">
        {CONTROLS.map(({ id, label, icon: Icon, event, message }) => (
          <button
            key={id}
            type="button"
            className="control-btn"
            disabled={disabled}
            onClick={() => onEvent(event, message)}
          >
            <Icon size={16} />
            {label}
          </button>
        ))}

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
