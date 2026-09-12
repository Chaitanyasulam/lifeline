import { useState, useMemo, useCallback, useRef, useEffect } from 'react';
import {
  createScenario,
  getScenarioProfile,
  DEFAULT_SCENARIO_ID,
} from '../data/scenarios/index.js';
import { optimize, compareStrategies, STRATEGIES } from '../engine/optimizer.js';
import { resetAssignments } from './state.js';
import {
  escalateEmergency,
  deescalateEmergency,
  resolveEmergency,
  toggleResourceAvailability,
  resetEmergencyCounter,
} from './events.js';

/**
 * @typedef {'idle' | 'detected' | 'calculating' | 'complete'} NotificationPhase
 * @typedef {{ phase: NotificationPhase, message?: string }} SystemNotification
 * @typedef {{ type: 'emergency' | 'resource' | 'facility', id: string } | null} SelectedEntity
 */

export function useSimulation() {
  const [scenarioId, setScenarioId] = useState(DEFAULT_SCENARIO_ID);
  const [state, setState] = useState(() => createScenario(DEFAULT_SCENARIO_ID));
  const [strategy, setStrategy] = useState(STRATEGIES.LIFELINE_OPTIMIZED);
  const [emergencyTypeFilter, setEmergencyTypeFilter] = useState('all');
  const [notification, setNotification] = useState(/** @type {SystemNotification | null} */ (null));
  const [selected, setSelected] = useState(/** @type {SelectedEntity} */ (null));
  const timerRef = useRef([]);
  const assignmentsRef = useRef([]);

  const scenarioProfile = useMemo(() => getScenarioProfile(scenarioId), [scenarioId]);

  const clearTimers = useCallback(() => {
    timerRef.current.forEach(clearTimeout);
    timerRef.current = [];
  }, []);

  const runEvent = useCallback(
    (eventFn, message = 'System change detected') => {
      clearTimers();
      setNotification({ phase: 'detected', message });

      const t1 = setTimeout(() => {
        setNotification({ phase: 'calculating', message: 'Recalculating optimal allocation…' });
      }, 600);

      const t2 = setTimeout(() => {
        setState((prev) => resetAssignments(eventFn(prev)));
        setNotification({ phase: 'complete', message: 'New allocation found' });
      }, 1400);

      const t3 = setTimeout(() => {
        setNotification(null);
      }, 3800);

      timerRef.current = [t1, t2, t3];
    },
    [clearTimers],
  );

  const applyChange = useCallback(
    (eventFn, message = 'System change detected', animate = true) => {
      if (animate) {
        runEvent(eventFn, message);
        return;
      }
      setState((prev) => resetAssignments(eventFn(prev)));
    },
    [runEvent],
  );

  const switchScenario = useCallback(
    (newScenarioId) => {
      clearTimers();
      setNotification(null);
      setSelected(null);
      setEmergencyTypeFilter('all');
      resetEmergencyCounter();
      setScenarioId(newScenarioId);
      setState(createScenario(newScenarioId));
    },
    [clearTimers],
  );

  const reoptimize = useCallback(() => {
    runEvent((s) => s, 'Manual reoptimization requested');
  }, [runEvent]);

  const resetScenario = useCallback(() => {
    clearTimers();
    setNotification(null);
    setSelected(null);
    setEmergencyTypeFilter('all');
    resetEmergencyCounter();
    setState(createScenario(scenarioId));
  }, [clearTimers, scenarioId]);

  const selectEntity = useCallback((type, id) => {
    setSelected((prev) => (prev?.type === type && prev?.id === id ? null : { type, id }));
  }, []);

  const clearSelection = useCallback(() => setSelected(null), []);

  const result = useMemo(() => optimize(state, strategy), [state, strategy]);
  const comparison = useMemo(() => compareStrategies(state), [state]);

  useEffect(() => {
    assignmentsRef.current = result.assignments;
  }, [result.assignments]);

  const assignmentMap = useMemo(
    () => new Map(result.assignments.map((a) => [a.resourceId, a])),
    [result.assignments],
  );

  const emergencyAssignmentMap = useMemo(
    () => new Map(result.assignments.map((a) => [a.emergencyId, a])),
    [result.assignments],
  );

  const activeEmergencyTypes = useMemo(() => {
    const types = new Set(
      state.emergencies.filter((e) => e.status !== 'resolved').map((e) => e.type),
    );
    return ['all', ...types];
  }, [state.emergencies]);

  const handleEscalate = useCallback(
    (emergencyId) => {
      applyChange(
        (s) => escalateEmergency(s, emergencyId),
        `Emergency ${emergencyId} escalated to higher severity`,
      );
    },
    [applyChange],
  );

  const handleDeescalate = useCallback(
    (emergencyId) => {
      applyChange(
        (s) => deescalateEmergency(s, emergencyId),
        `Emergency ${emergencyId} severity reduced`,
      );
    },
    [applyChange],
  );

  const handleToggleResource = useCallback(
    (resourceId) => {
      const resource = state.resources.find((r) => r.id === resourceId);
      const becomingUnavailable = resource?.status !== 'unavailable';

      applyChange(
        (s) => toggleResourceAvailability(s, resourceId),
        becomingUnavailable
          ? `${resourceId} marked unavailable — reallocating remaining units`
          : `${resourceId} back online — recalculating allocation`,
      );
    },
    [applyChange, state.resources],
  );

  const handleResolve = useCallback(
    (emergencyId) => {
      const assignment = assignmentsRef.current.find((a) => a.emergencyId === emergencyId);
      const resourceLabel = assignment ? assignment.resourceId : 'Resource';

      applyChange(
        (s) => resolveEmergency(s, emergencyId, assignmentsRef.current),
        `${emergencyId} resolved — ${resourceLabel} available for next emergency`,
      );

      setSelected((prev) =>
        prev?.type === 'emergency' && prev.id === emergencyId ? null : prev,
      );
    },
    [applyChange],
  );

  const resolvedCount = state.emergencies.filter((e) => e.status === 'resolved').length;

  return {
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
  };
}

export { STRATEGIES };
