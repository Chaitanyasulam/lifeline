import { Header } from './Header.jsx';
import { SystemNotification } from './SystemNotification.jsx';
import { EmergencyPanel } from './EmergencyPanel.jsx';
import { ResourcePanel } from './ResourcePanel.jsx';
import { MapView } from './MapView.jsx';
import { AllocationPanel } from './AllocationPanel.jsx';
import { MetricsPanel } from './MetricsPanel.jsx';
import { ComparisonPanel } from './ComparisonPanel.jsx';
import { SimulationControls } from './SimulationControls.jsx';
import { useSimulation } from '../simulation/useSimulation.js';
import '../styles/dashboard.css';

export function Dashboard() {
  const {
    state,
    strategy,
    setStrategy,
    result,
    comparison,
    notification,
    assignmentMap,
    emergencyAssignmentMap,
    runEvent,
    reoptimize,
    resetScenario,
  } = useSimulation();

  const isBusy = notification && notification.phase !== 'complete';

  return (
    <div className="dashboard">
      <Header strategy={strategy} onStrategyChange={setStrategy} />
      <SystemNotification notification={notification} />

      <div className="dashboard-body">
        <aside className="sidebar left">
          <EmergencyPanel
            emergencies={state.emergencies}
            emergencyAssignmentMap={emergencyAssignmentMap}
          />
        </aside>

        <main className="center-column">
          <MapView
            resources={state.resources}
            emergencies={state.emergencies}
            facilities={state.facilities}
            blockedRoads={state.blockedRoads}
            assignments={result.assignments}
            assignmentMap={assignmentMap}
          />
        </main>

        <aside className="sidebar right">
          <ResourcePanel resources={state.resources} assignmentMap={assignmentMap} />
          <AllocationPanel assignments={result.assignments} strategy={strategy} />
        </aside>
      </div>

      <div className="dashboard-bottom">
        <MetricsPanel metrics={result.metrics} />
        <ComparisonPanel comparison={comparison} />
      </div>

      <SimulationControls
        onEvent={runEvent}
        onReoptimize={reoptimize}
        onReset={resetScenario}
        disabled={!!isBusy}
      />
    </div>
  );
}
