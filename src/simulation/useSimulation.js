import { useState, useMemo, useCallback, useRef, useEffect } from 'react';
import {
  createScenario,
  getScenarioProfile,
  DEFAULT_SCENARIO_ID,
} from '../data/scenarios/index.js';
import { optimize, compareStrategies, STRATEGIES } from '../engine/optimizer.js';
import { initializeScenario, reoptimizePending, buildDisplayAssignments } from './assignments.js';
import {
  escalateEmergency,
  deescalateEmergency,
  resolveEmergency,
  toggleResourceAvailability,
  resetEmergencyCounter,
} from './events.js';

/**
 * @typedef {'idle' | 'detected' | 'calculating' | 'complete' | 'info'} NotificationPhase
 * @typedef {{ phase: NotificationPhase, message?: string }} SystemNotification
 * @typedef {{ type: 'emergency' | 'resource' | 'facility', id: string } | null} SelectedEntity
 */

export function useSimulation() {
  const [scenarioId, setScenarioId] = useState(DEFAULT_SCENARIO_ID);
  const [state, setState] = useState(() =>
    initializeScenario(createScenario(DEFAULT_SCENARIO_ID), STRATEGIES.LIFELINE_OPTIMIZED),
  );
  const [strategy, setStrategy] = useState(STRATEGIES.LIFELINE_OPTIMIZED);
  const [emergencyTypeFilter, setEmergencyTypeFilter] = useState('all');
  const [notification, setNotification] = useState(/** @type {SystemNotification | null} */ (null));
  const [selected, setSelected] = useState(/** @type {SelectedEntity} */ (null));
  const timerRef = useRef([]);
  const strategyRef = useRef(strategy);

  useEffect(() => {
    strategyRef.current = strategy;
  }, [strategy]);

  const scenarioProfile = useMemo(() => getScenarioProfile(scenarioId), [scenarioId]);

  const clearTimers = useCallback(() => {
    timerRef.current.forEach(clearTimeout);
    timerRef.current = [];
  }, []);

  const showInfo = useCallback((message) => {
    clearTimers();
    setNotification({ phase: 'info', message });
    const t = setTimeout(() => setNotification(null), 2500);
    timerRef.current = [t];
  }, [clearTimers]);

  const runReoptimize = useCallback(
    (eventFn, message = 'System change detected') => {
      clearTimers();
      setNotification({ phase: 'detected', message });

      const t1 = setTimeout(() => {
        setNotification({ phase: 'calculating', message: 'Recalculating optimal allocation…' });
      }, 600);

      const t2 = setTimeout(() => {
        setState((prev) => {
          const next = eventFn(prev);
          return reoptimizePending(next, strategyRef.current);
        });
        setNotification({ phase: 'complete', message: 'New allocation found' });
      }, 1400);

      const t3 = setTimeout(() => setNotification(null), 3800);
      timerRef.current = [t1, t2, t3];
    },
    [clearTimers],
  );

  const runEvent = useCallback(
    (eventFn, message = 'System change detected', options = {}) => {
      const { reoptimize = true } = options;
      if (!reoptimize) {
        setState((prev) => eventFn(prev));
        showInfo(message);
        return;
      }
      runReoptimize(eventFn, message);
    },
    [runReoptimize, showInfo],
  );

  const switchScenario = useCallback(
    (newScenarioId) => {
      clearTimers();
      setNotification(null);
      setSelected(null);
      setEmergencyTypeFilter('all');
      resetEmergencyCounter();
      setScenarioId(newScenarioId);
      setState(
        initializeScenario(createScenario(newScenarioId), strategyRef.current),
      );
    },
    [clearTimers],
  );

  const handleStrategyChange = useCallback(
    (newStrategy) => {
      setStrategy(newStrategy);
      setState((prev) => reoptimizePending(prev, newStrategy));
      showInfo('Strategy updated — in-progress assignments unchanged');
    },
    [showInfo],
  );

  const reoptimize = useCallback(() => {
    runReoptimize((s) => s, 'Manual reoptimization requested');
  }, [runReoptimize]);

  const resetScenario = useCallback(() => {
    clearTimers();
    setNotification(null);
    setSelected(null);
    setEmergencyTypeFilter('all');
    resetEmergencyCounter();
    setState(initializeScenario(createScenario(scenarioId), strategyRef.current));
  }, [clearTimers, scenarioId]);

  const selectEntity = useCallback((type, id) => {
    setSelected((prev) => (prev?.type === type && prev?.id === id ? null : { type, id }));
  }, []);

  const clearSelection = useCallback(() => setSelected(null), []);

  const result = useMemo(() => optimize(state, strategy), [state, strategy]);
  const comparison = useMemo(() => compareStrategies(state), [state]);

  const displayAssignments = useMemo(
    () => buildDisplayAssignments(state, strategy),
    [state, strategy],
  );

  const assignmentMap = displayAssignments.assignmentMap;
  const emergencyAssignmentMap = displayAssignments.committedEmergencyMap;
  const mapAssignments = displayAssignments.allAssignments;

  const activeEmergencyTypes = useMemo(() => {
    const types = new Set(
      state.emergencies.filter((e) => e.status !== 'resolved').map((e) => e.type),
    );
    return ['all', ...types];
  }, [state.emergencies]);

  const handleEscalate = useCallback(
    (emergencyId) => {
      setState((s) => escalateEmergency(s, emergencyId));
      showInfo(`${emergencyId} escalated — units stay on current assignments until finished`);
    },
    [showInfo],
  );

  const handleDeescalate = useCallback(
    (emergencyId) => {
      setState((s) => deescalateEmergency(s, emergencyId));
      showInfo(`${emergencyId} severity reduced — current assignments unchanged`);
    },
    [showInfo],
  );

  const handleToggleResource = useCallback(
    (resourceId) => {
      const resource = state.resources.find((r) => r.id === resourceId);
      const becomingUnavailable = resource?.status !== 'unavailable';

      runReoptimize(
        (s) => toggleResourceAvailability(s, resourceId),
        becomingUnavailable
          ? `${resourceId} unavailable — reallocating remaining units`
          : `${resourceId} back online — recalculating allocation`,
      );
    },
    [runReoptimize, state.resources],
  );

  const handleResolve = useCallback(
    (emergencyId) => {
      const resource = state.resources.find((r) => r.currentAssignment === emergencyId);
      const resourceLabel = resource?.id ?? 'Unit';

      runReoptimize(
        (s) => resolveEmergency(s, emergencyId),
        `${emergencyId} finished — ${resourceLabel} dispatched to next highest-severity nearest call`,
      );

      setSelected((prev) =>
        prev?.type === 'emergency' && prev.id === emergencyId ? null : prev,
      );
    },
    [runReoptimize, state.resources],
  );

  const resolvedCount = state.emergencies.filter((e) => e.status === 'resolved').length;

  return {
    state,
    scenarioId,
    scenarioProfile,
    switchScenario,
    strategy,
    setStrategy: handleStrategyChange,
    emergencyTypeFilter,
    setEmergencyTypeFilter,
    activeEmergencyTypes,
    result,
    comparison,
    notification,
    assignmentMap,
    emergencyAssignmentMap,
    mapAssignments,
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
