import { isResourceAvailable, resourceHasCapabilities } from '../models/Resource.js';
import { isEmergencyActive } from '../models/Emergency.js';
import { getTravelTime, getTravelDistance } from './travelTime.js';

/**
 * @typedef {import('../models/Resource.js').Resource} Resource
 * @typedef {import('../models/Emergency.js').Emergency} Emergency
 * @typedef {import('./scoring.js').AssignmentPair} AssignmentPair
 * @typedef {import('./routing.js').RoutingContext} RoutingContext
 */

/**
 * Nearest-first baseline: assign each emergency (in list order) to the
 * closest available compatible resource. Does NOT optimize globally.
 *
 * @param {Resource[]} resources
 * @param {Emergency[]} emergencies
 * @param {RoutingContext} routingContext
 * @returns {AssignmentPair[]}
 */
export function nearestFirstAssign(resources, emergencies, routingContext) {
  const available = resources.filter(isResourceAvailable);
  const active = emergencies.filter(isEmergencyActive);
  const usedResourceIds = new Set();
  /** @type {AssignmentPair[]} */
  const assignments = [];

  for (const emergency of active) {
    let bestResource = null;
    let bestTime = Infinity;
    let bestDistance = Infinity;

    for (const resource of available) {
      if (usedResourceIds.has(resource.id)) continue;
      if (!resourceHasCapabilities(resource, emergency.requiredCapabilities)) continue;

      const travelTime = getTravelTime(resource.location, emergency.location, routingContext);
      if (travelTime === Infinity || travelTime >= bestTime) continue;

      bestTime = travelTime;
      bestDistance = getTravelDistance(resource.location, emergency.location, routingContext);
      bestResource = resource;
    }

    if (bestResource) {
      usedResourceIds.add(bestResource.id);
      assignments.push({
        resourceId: bestResource.id,
        emergencyId: emergency.id,
        travelTime: round(bestTime),
        distance: round(bestDistance),
      });
    }
  }

  return assignments;
}

function round(n) {
  return Math.round(n * 10) / 10;
}
