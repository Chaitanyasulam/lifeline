import { Header } from './Header.jsx';
import { ScenarioBar } from './ScenarioBar.jsx';
import { SystemNotification } from './SystemNotification.jsx';
import { SelectionBar } from './SelectionBar.jsx';
import { EmergencyPanel } from './EmergencyPanel.jsx';
import { ResourcePanel } from './ResourcePanel.jsx';
import { FacilityPanel } from './FacilityPanel.jsx';
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
    scenarioId,
    scenarioProfile,
    switchScenario,
    strategy,
    setStrategy,
    emergencyTypeFilter,
    setEmergencyTypeFilter,
    activeEmergencyTypes,
    result,
    comparison,
    notification,
    assignmentMap,
    emergencyAssignmentMap,
    selected,
    selectEntity,
    clearSelection,
    runEvent,
    reoptimize,
    resetScenario,
    handleEscalate,
    handleDeescalate,
    handleResolve,
    handleToggleResource,
    resolvedCount,
  } = useSimulation();

  const isBusy = notification && notification.phase !== 'complete' && notification.phase !== undefined;

  return (
    <div className="dashboard">
      <Header strategy={strategy} onStrategyChange={setStrategy} resolvedCount={resolvedCount} />
      <ScenarioBar
        scenarioId={scenarioId}
        scenarioProfile={scenarioProfile}
        onScenarioChange={switchScenario}
        emergencyTypeFilter={emergencyTypeFilter}
        onTypeFilterChange={setEmergencyTypeFilter}
        activeEmergencyTypes={activeEmergencyTypes}
      />
      <SystemNotification notification={notification} />
      <SelectionBar
        selected={selected}
        state={state}
        assignmentMap={assignmentMap}
        emergencyAssignmentMap={emergencyAssignmentMap}
        onClear={clearSelection}
        onEscalate={handleEscalate}
        onDeescalate={handleDeescalate}
        onResolve={handleResolve}
        onToggleResource={handleToggleResource}
        disabled={!!isBusy}
      />

      <div className="dashboard-body">
        <aside className="sidebar left">
          <EmergencyPanel
            emergencies={state.emergencies}
            emergencyAssignmentMap={emergencyAssignmentMap}
            selected={selected}
            onSelect={selectEntity}
            onEscalate={handleEscalate}
            onDeescalate={handleDeescalate}
            onResolve={handleResolve}
            disabled={!!isBusy}
            typeFilter={emergencyTypeFilter}
          />
          <FacilityPanel
            facilities={state.facilities}
            selected={selected}
            onSelect={selectEntity}
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
            selected={selected}
            onSelect={selectEntity}
            emergencyTypeFilter={emergencyTypeFilter}
          />
        </main>

        <aside className="sidebar right">
          <ResourcePanel
            resources={state.resources}
            assignmentMap={assignmentMap}
            selected={selected}
            onSelect={selectEntity}
            onToggleAvailability={handleToggleResource}
            disabled={!!isBusy}
          />
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
