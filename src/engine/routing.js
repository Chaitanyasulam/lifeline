import { getTravelTime } from './travelTime.js';

/**
 * @typedef {import('../models/Resource.js').Location} Location
 * @typedef {import('./travelTime.js').BlockedRoad} BlockedRoad
 */

/**
 * @typedef {Object} RoutingContext
 * @property {BlockedRoad[]} blockedRoads
 * @property {number} speedUnitsPerMin
 */

/**
 * @returns {RoutingContext}
 */
export function createRoutingContext(overrides = {}) {
  return {
    blockedRoads: overrides.blockedRoads ?? [],
    speedUnitsPerMin: overrides.speedUnitsPerMin ?? 120,
  };
}

/**
 * @param {Location} from
 * @param {Location} to
 * @param {RoutingContext} context
 */
export function isRouteAvailable(from, to, context) {
  return getTravelTime(from, to, context) !== Infinity;
}
