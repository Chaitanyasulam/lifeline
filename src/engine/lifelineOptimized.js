import { isResourceAvailable, resourceHasCapabilities } from '../models/Resource.js';
import { isEmergencyActive } from '../models/Emergency.js';
import { getTravelTime, getTravelDistance } from './travelTime.js';
import { scoreAllocation } from './scoring.js';

/**
 * @typedef {import('../models/Resource.js').Resource} Resource
 * @typedef {import('../models/Emergency.js').Emergency} Emergency
 * @typedef {import('./scoring.js').AssignmentPair} AssignmentPair
 * @typedef {import('./routing.js').RoutingContext} RoutingContext
 */

/**
 * @typedef {Object} CompatiblePair
 * @property {Resource} resource
 * @property {Emergency} emergency
 * @property {number} travelTime
 * @property {number} distance
 */

/**
 * LIFELINE optimized strategy: evaluates all valid resource-to-emergency
 * assignments globally and selects the plan with the lowest weighted cost.
 * Heavily penalizes long response times for critical emergencies.
 *
 * @param {Resource[]} resources
 * @param {Emergency[]} emergencies
 * @param {RoutingContext} routingContext
 * @returns {AssignmentPair[]}
 */
export function lifelineOptimizedAssign(resources, emergencies, routingContext) {
  const available = resources.filter(isResourceAvailable);
  const active = emergencies.filter(isEmergencyActive);

  if (available.length === 0 || active.length === 0) {
    return [];
  }

  /** @type {CompatiblePair[]} */
  const compatiblePairs = [];

  for (const resource of available) {
    for (const emergency of active) {
      if (!resourceHasCapabilities(resource, emergency.requiredCapabilities)) continue;

      const travelTime = getTravelTime(resource.location, emergency.location, routingContext);
      if (travelTime === Infinity) continue;

      compatiblePairs.push({
        resource,
        emergency,
        travelTime: round(travelTime),
        distance: round(getTravelDistance(resource.location, emergency.location, routingContext)),
      });
    }
  }

  if (compatiblePairs.length === 0) {
    return [];
  }

  const maxAssignments = Math.min(available.length, active.length);
  let bestAssignments = /** @type {AssignmentPair[] | null} */ (null);
  let bestScore = Infinity;

  const subsets = generateAssignmentSubsets(compatiblePairs, maxAssignments);

  for (const subset of subsets) {
    const assignments = subset.map((pair) => ({
      resourceId: pair.resource.id,
      emergencyId: pair.emergency.id,
      travelTime: pair.travelTime,
      distance: pair.distance,
    }));

    const { totalCost } = scoreAllocation(assignments, active);
    if (totalCost < bestScore) {
      bestScore = totalCost;
      bestAssignments = assignments;
    }
  }

  return bestAssignments ?? [];
}

/**
 * Generate all valid assignment subsets where each resource and emergency
 * appears at most once.
 * @param {CompatiblePair[]} pairs
 * @param {number} maxSize
 * @returns {CompatiblePair[][]}
 */
function generateAssignmentSubsets(pairs, maxSize) {
  /** @type {CompatiblePair[][]} */
  const results = [[]];

  function backtrack(start, current, usedResources, usedEmergencies) {
    if (current.length > 0) {
      results.push([...current]);
    }
    if (current.length >= maxSize) return;

    for (let i = start; i < pairs.length; i++) {
      const pair = pairs[i];
      if (usedResources.has(pair.resource.id)) continue;
      if (usedEmergencies.has(pair.emergency.id)) continue;

      usedResources.add(pair.resource.id);
      usedEmergencies.add(pair.emergency.id);
      current.push(pair);

      backtrack(i + 1, current, usedResources, usedEmergencies);

      current.pop();
      usedResources.delete(pair.resource.id);
      usedEmergencies.delete(pair.emergency.id);
    }
  }

  backtrack(0, [], new Set(), new Set());

  return results.filter((subset) => subset.length > 0);
}

function round(n) {
  return Math.round(n * 10) / 10;
}
