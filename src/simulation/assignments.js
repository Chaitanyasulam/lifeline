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
 * Uses resource.currentAssignment as source of truth so locked units never
 * appear reassigned in the UI when severity changes.
 * @param {SimulationState} state
 */
export function getCommittedAssignments(state) {
  const routingContext = createRoutingContext({ blockedRoads: state.blockedRoads ?? [] });
  /** @type {AssignmentPair[]} */
  const committed = [];

  for (const resource of state.resources) {
    if (resource.status !== 'assigned' || !resource.currentAssignment) continue;

    const emergency = state.emergencies.find((e) => e.id === resource.currentAssignment);
    if (!emergency || emergency.status === 'resolved') continue;

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
 * Build assignment maps for UI: locked pairs from state, plus pending
 * optimizer suggestions that do not conflict with committed resources.
 * @param {SimulationState} state
 * @param {string} strategy
 */
export function buildDisplayAssignments(state, strategy) {
  const committed = getCommittedAssignments(state);
  const committedResourceIds = new Set(committed.map((a) => a.resourceId));
  const committedEmergencyIds = new Set(committed.map((a) => a.emergencyId));

  const result = optimize(state, strategy);
  const pending = result.assignments.filter(
    (a) =>
      !committedResourceIds.has(a.resourceId) && !committedEmergencyIds.has(a.emergencyId),
  );

  const allAssignments = [...committed, ...pending];

  return {
    committedAssignments: committed,
    pendingAssignments: pending,
    allAssignments,
    assignmentMap: new Map(allAssignments.map((a) => [a.resourceId, a])),
    emergencyAssignmentMap: new Map(allAssignments.map((a) => [a.emergencyId, a])),
    committedEmergencyMap: new Map(committed.map((a) => [a.emergencyId, a])),
  };
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
