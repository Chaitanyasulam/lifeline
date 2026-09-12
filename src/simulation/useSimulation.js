import { useState, useMemo, useCallback, useRef } from 'react';
import { createDemoScenario } from '../data/demoScenario.js';
import { optimize, compareStrategies, STRATEGIES } from '../engine/optimizer.js';
import { resetAssignments } from './state.js';

/**
 * @typedef {'idle' | 'detected' | 'calculating' | 'complete'} NotificationPhase
 * @typedef {{ phase: NotificationPhase, message?: string }} SystemNotification
 */

export function useSimulation() {
  const [state, setState] = useState(() => createDemoScenario());
  const [strategy, setStrategy] = useState(STRATEGIES.LIFELINE_OPTIMIZED);
  const [notification, setNotification] = useState(/** @type {SystemNotification | null} */ (null));
  const timerRef = useRef([]);

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

  const reoptimize = useCallback(() => {
    runEvent((s) => s, 'Manual reoptimization requested');
  }, [runEvent]);

  const resetScenario = useCallback(() => {
    clearTimers();
    setNotification(null);
    setState(createDemoScenario());
  }, [clearTimers]);

  const result = useMemo(() => optimize(state, strategy), [state, strategy]);
  const comparison = useMemo(() => compareStrategies(state), [state]);

  const assignmentMap = useMemo(
    () => new Map(result.assignments.map((a) => [a.resourceId, a])),
    [result.assignments],
  );

  const emergencyAssignmentMap = useMemo(
    () => new Map(result.assignments.map((a) => [a.emergencyId, a])),
    [result.assignments],
  );

  return {
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
  };
}

export { STRATEGIES };
