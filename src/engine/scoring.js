import {
  SEVERITY_WEIGHTS,
  UNASSIGNED_PENALTY_MINUTES,
  CRITICAL_DELAY_THRESHOLD_MIN,
  CRITICAL_DELAY_PENALTY,
} from '../models/constants.js';
import { resourceHasCapabilities } from '../models/Resource.js';
import { getTravelTime, getTravelDistance } from './travelTime.js';

/**
 * @typedef {import('../models/Emergency.js').Emergency} Emergency
 * @typedef {import('../models/Resource.js').Resource} Resource
 * @typedef {import('./routing.js').RoutingContext} RoutingContext
 */

/**
 * @typedef {Object} AssignmentPair
 * @property {string} resourceId
 * @property {string} emergencyId
 * @property {number} travelTime
 * @property {number} [distance]
 * @property {boolean} [locked]
 */

/**
 * Priority based on severity only (simulated demo values).
 * @param {Emergency} emergency
 */
export function getEmergencyPriority(emergency) {
  return SEVERITY_WEIGHTS[emergency.severity];
}

/**
 * Nearest compatible resource travel time (minutes) for an emergency.
 * @param {Emergency} emergency
 * @param {Resource[]} resources
 * @param {RoutingContext} routingContext
 * @returns {number | null}
 */
export function getNearestCompatibleTravelTime(emergency, resources, routingContext) {
  let min = Infinity;

  for (const resource of resources) {
    if (resource.status === 'unavailable') continue;
    if (!resourceHasCapabilities(resource, emergency.requiredCapabilities)) continue;

    const time = getTravelTime(resource.location, emergency.location, routingContext);
    if (time < min) min = time;
  }

  return min === Infinity ? null : round(min);
}

/**
 * Nearest compatible resource distance (map units) for an emergency.
 * @param {Emergency} emergency
 * @param {Resource[]} resources
 * @param {RoutingContext} routingContext
 * @returns {number | null}
 */
export function getNearestCompatibleDistance(emergency, resources, routingContext) {
  let min = Infinity;

  for (const resource of resources) {
    if (resource.status === 'unavailable') continue;
    if (!resourceHasCapabilities(resource, emergency.requiredCapabilities)) continue;

    const dist = getTravelDistance(resource.location, emergency.location, routingContext);
    if (dist < min) min = dist;
  }

  return min === Infinity ? null : round(min);
}

/**
 * Nearest available compatible resource for an emergency.
 * @param {Emergency} emergency
 * @param {Resource[]} resources
 * @param {RoutingContext} routingContext
 * @returns {Resource | null}
 */
export function getNearestCompatibleResource(emergency, resources, routingContext) {
  let best = null;
  let minTime = Infinity;

  for (const resource of resources) {
    if (resource.status !== 'available') continue;
    if (!resourceHasCapabilities(resource, emergency.requiredCapabilities)) continue;

    const time = getTravelTime(resource.location, emergency.location, routingContext);
    if (time < minTime) {
      minTime = time;
      best = resource;
    }
  }

  return best;
}

/**
 * Cost of a single resource-to-emergency assignment (lower is better).
 * Severity + travel time/distance weighted together.
 * @param {number} travelTimeMinutes
 * @param {Emergency} emergency
 */
export function getAssignmentCost(travelTimeMinutes, emergency) {
  const weight = SEVERITY_WEIGHTS[emergency.severity];
  let cost = travelTimeMinutes * weight;

  if (emergency.severity === 'CRITICAL' && travelTimeMinutes > CRITICAL_DELAY_THRESHOLD_MIN) {
    cost += (travelTimeMinutes - CRITICAL_DELAY_THRESHOLD_MIN) * CRITICAL_DELAY_PENALTY;
  }

  return cost;
}

/**
 * Cost of leaving an emergency unassigned — severity + distance to nearest help.
 * @param {Emergency} emergency
 * @param {number | null} [nearestTravelTimeMinutes]
 */
export function getUnassignedCost(emergency, nearestTravelTimeMinutes = null) {
  const weight = SEVERITY_WEIGHTS[emergency.severity];
  let cost = UNASSIGNED_PENALTY_MINUTES * weight;

  if (nearestTravelTimeMinutes != null && nearestTravelTimeMinutes !== Infinity) {
    cost += nearestTravelTimeMinutes * weight;
  }

  return cost;
}

/**
 * Total system cost for a complete allocation plan.
 * @param {AssignmentPair[]} assignments
 * @param {Emergency[]} allEmergencies
 * @param {Object} [options]
 * @param {Resource[]} [options.resources]
 * @param {RoutingContext} [options.routingContext]
 */
export function scoreAllocation(assignments, allEmergencies, options = {}) {
  const { resources = [], routingContext = {} } = options;
  const assignedIds = new Set(assignments.map((a) => a.emergencyId));
  const assignedResourceIds = new Set(assignments.map((a) => a.resourceId));

  const unassigned = allEmergencies.filter((e) => !assignedIds.has(e.id));

  const availableForDistance = resources.filter(
    (r) => r.status !== 'unavailable' && !assignedResourceIds.has(r.id),
  );

  const assignmentCost = assignments.reduce((sum, a) => {
    const emergency = allEmergencies.find((e) => e.id === a.emergencyId);
    return sum + (emergency ? getAssignmentCost(a.travelTime, emergency) : 0);
  }, 0);

  const unassignedCost = unassigned.reduce((sum, e) => {
    const nearest = getNearestCompatibleTravelTime(e, availableForDistance, routingContext);
    return sum + getUnassignedCost(e, nearest);
  }, 0);

  return {
    totalCost: assignmentCost + unassignedCost,
    assignmentCost,
    unassignedCost,
  };
}

function round(n) {
  return Math.round(n * 10) / 10;
}
