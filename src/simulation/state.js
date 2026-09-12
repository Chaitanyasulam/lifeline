/**
 * @typedef {import('../engine/optimizer.js').SimulationState} SimulationState
 */

/**
 * Deep-clone simulation state for immutable updates.
 * @param {SimulationState} state
 * @returns {SimulationState}
 */
export function cloneState(state) {
  return structuredClone(state);
}

/**
 * Reset all resources and emergencies to unassigned/active.
 * @param {SimulationState} state
 * @returns {SimulationState}
 */
export function resetAssignments(state) {
  return {
    ...state,
    resources: state.resources.map((r) => ({
      ...r,
      status: r.status === 'unavailable' ? 'unavailable' : 'available',
      currentAssignment: null,
    })),
    emergencies: state.emergencies.map((e) => ({
      ...e,
      status: e.status === 'resolved' ? 'resolved' : 'active',
    })),
  };
}
