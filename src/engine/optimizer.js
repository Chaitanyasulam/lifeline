import { STRATEGIES } from '../models/constants.js';
import { createRoutingContext } from './routing.js';
import { nearestFirstAssign } from './nearestFirst.js';
import { lifelineOptimizedAssign } from './lifelineOptimized.js';
import { calculateMetrics } from './metrics.js';
import { scoreAllocation } from './scoring.js';

/**
 * @typedef {import('../models/Resource.js').Resource} Resource
 * @typedef {import('../models/Emergency.js').Emergency} Emergency
 * @typedef {import('../models/Facility.js').Facility} Facility
 * @typedef {import('./scoring.js').AssignmentPair} AssignmentPair
 * @typedef {import('./metrics.js').AllocationMetrics} AllocationMetrics
 * @typedef {import('./travelTime.js').BlockedRoad} BlockedRoad
 */

/**
 * @typedef {Object} SimulationState
 * @property {Resource[]} resources
 * @property {Emergency[]} emergencies
 * @property {Facility[]} facilities
 * @property {BlockedRoad[]} blockedRoads
 */

/**
 * @typedef {Object} OptimizationResult
 * @property {string} strategy
 * @property {AssignmentPair[]} assignments
 * @property {AllocationMetrics} metrics
 * @property {number} totalCost
 * @property {boolean} simulated
 */

/**
 * Run the allocation optimizer for the given strategy.
 *
 * @param {SimulationState} state
 * @param {keyof typeof STRATEGIES | string} strategy
 * @returns {OptimizationResult}
 */
export function optimize(state, strategy = STRATEGIES.LIFELINE_OPTIMIZED) {
  const routingContext = createRoutingContext({
    blockedRoads: state.blockedRoads ?? [],
  });

  const activeEmergencies = state.emergencies.filter((e) => e.status === 'active');

  let assignments;
  if (strategy === STRATEGIES.NEAREST_FIRST) {
    assignments = nearestFirstAssign(state.resources, activeEmergencies, routingContext);
  } else {
    assignments = lifelineOptimizedAssign(state.resources, activeEmergencies, routingContext);
  }

  const metrics = calculateMetrics(
    assignments,
    activeEmergencies,
    state.resources,
    { blockedRoads: state.blockedRoads ?? [] },
  );

  const { totalCost } = scoreAllocation(assignments, activeEmergencies);

  return {
    strategy,
    assignments,
    metrics,
    totalCost: round(totalCost),
    simulated: true,
  };
}

/**
 * Compare both strategies on the same scenario.
 * @param {SimulationState} state
 */
export function compareStrategies(state) {
  const nearestFirst = optimize(state, STRATEGIES.NEAREST_FIRST);
  const lifeline = optimize(state, STRATEGIES.LIFELINE_OPTIMIZED);

  return {
    nearestFirst,
    lifeline,
    simulated: true,
  };
}

/**
 * Apply assignments to a copy of simulation state (updates resource/emergency status).
 * @param {SimulationState} state
 * @param {AssignmentPair[]} assignments
 * @returns {SimulationState}
 */
export function applyAssignments(state, assignments) {
  const assignmentMap = new Map(assignments.map((a) => [a.resourceId, a.emergencyId]));
  const emergencyAssignmentMap = new Map(assignments.map((a) => [a.emergencyId, a.resourceId]));

  return {
    ...state,
    resources: state.resources.map((resource) => {
      const emergencyId = assignmentMap.get(resource.id);
      if (emergencyId && resource.status === 'available') {
        return {
          ...resource,
          status: 'assigned',
          currentAssignment: emergencyId,
        };
      }
      return { ...resource };
    }),
    emergencies: state.emergencies.map((emergency) => {
      const resourceId = emergencyAssignmentMap.get(emergency.id);
      if (resourceId && emergency.status === 'active') {
        return { ...emergency, status: 'assigned' };
      }
      return { ...emergency };
    }),
  };
}

function round(n) {
  return Math.round(n * 10) / 10;
}

export { STRATEGIES };
