import { optimize, applyAssignments } from '../engine/optimizer.js';
import { getTravelTime, getTravelDistance } from '../engine/travelTime.js';
import { createRoutingContext } from '../engine/routing.js';
import { resetAssignments } from './state.js';

/**
 * @typedef {import('../engine/optimizer.js').SimulationState} SimulationState
 * @typedef {import('../engine/scoring.js').AssignmentPair} AssignmentPair
 */

/**
 * Extract in-progress assignments from persisted state (units en route).
 * @param {SimulationState} state
 */
export function getCommittedAssignments(state) {
  const routingContext = createRoutingContext({ blockedRoads: state.blockedRoads ?? [] });
  /** @type {AssignmentPair[]} */
  const committed = [];

  for (const resource of state.resources) {
    if (resource.status !== 'assigned' || !resource.currentAssignment) continue;

    const emergency = state.emergencies.find((e) => e.id === resource.currentAssignment);
    if (!emergency || emergency.status !== 'assigned') continue;

    committed.push({
      resourceId: resource.id,
      emergencyId: emergency.id,
      travelTime: round(getTravelTime(resource.location, emergency.location, routingContext)),
      distance: round(getTravelDistance(resource.location, emergency.location, routingContext)),
      locked: true,
    });
  }

  return committed;
}

/**
 * Apply optimizer results only for currently available resources / active emergencies.
 * @param {SimulationState} state
 * @param {AssignmentPair[]} newAssignments
 */
export function applyNewAssignments(state, newAssignments) {
  const resourceMap = new Map(newAssignments.map((a) => [a.resourceId, a.emergencyId]));
  const emergencyMap = new Map(newAssignments.map((a) => [a.emergencyId, a.resourceId]));

  return {
    ...state,
    resources: state.resources.map((r) => {
      if (r.status !== 'available') return r;
      const emergencyId = resourceMap.get(r.id);
      if (!emergencyId) return r;
      return { ...r, status: 'assigned', currentAssignment: emergencyId };
    }),
    emergencies: state.emergencies.map((e) => {
      if (e.status !== 'active') return e;
      const resourceId = emergencyMap.get(e.id);
      if (!resourceId) return e;
      return { ...e, status: 'assigned' };
    }),
  };
}

/**
 * Run optimizer and apply only pending (non-committed) assignments.
 * @param {SimulationState} state
 * @param {string} strategy
 */
export function reoptimizePending(state, strategy) {
  const result = optimize(state, strategy);
  const pending = result.assignments.filter((a) => {
    const resource = state.resources.find((r) => r.id === a.resourceId);
    return resource?.status === 'available';
  });
  return applyNewAssignments(state, pending);
}

/**
 * Fresh scenario: optimize everything and lock all initial assignments.
 * @param {SimulationState} state
 * @param {string} strategy
 */
export function initializeScenario(state, strategy) {
  const fresh = resetAssignments(state);
  const result = optimize(fresh, strategy);
  return applyAssignments(fresh, result.assignments);
}

function round(n) {
  return Math.round(n * 10) / 10;
}
