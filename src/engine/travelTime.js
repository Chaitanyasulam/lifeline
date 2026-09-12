/**
 * @typedef {import('../models/Resource.js').Location} Location
 */

/**
 * @typedef {Object} BlockedRoad
 * @property {Location} from
 * @property {Location} to
 * @property {boolean} [blocked]
 * @property {number} [multiplier]
 */

/**
 * @param {Location} a
 * @param {Location} b
 */
export function getDistance(a, b) {
  const dx = a.x - b.x;
  const dy = a.y - b.y;
  return Math.sqrt(dx * dx + dy * dy);
}

/**
 * Check if a direct route between two points crosses a blocked road segment.
 * Uses a simplified segment-intersection test on the direct path.
 * @param {Location} from
 * @param {Location} to
 * @param {BlockedRoad} road
 */
function routeCrossesBlockedSegment(from, to, road) {
  if (!road.blocked && !road.multiplier) return false;

  const midRouteX = (from.x + to.x) / 2;
  const midRouteY = (from.y + to.y) / 2;
  const midRoadX = (road.from.x + road.to.x) / 2;
  const midRoadY = (road.from.y + road.to.y) / 2;

  const routeDist = getDistance(from, to);
  const roadDist = getDistance(road.from, road.to);
  if (routeDist === 0 || roadDist === 0) return false;

  const proximity =
    getDistance({ x: midRouteX, y: midRouteY }, { x: midRoadX, y: midRoadY });
  const threshold = Math.min(routeDist, roadDist) * 0.35;

  return proximity < threshold;
}

/**
 * @param {Location} from
 * @param {Location} to
 * @param {Object} [options]
 * @param {BlockedRoad[]} [options.blockedRoads]
 * @param {number} [options.speedUnitsPerMin]
 * @returns {number} Travel time in minutes (simulated)
 */
export function getTravelTime(from, to, options = {}) {
  const { blockedRoads = [], speedUnitsPerMin = 120 } = options;
  const distance = getDistance(from, to);

  if (distance === 0) return 0;

  let multiplier = 1;

  for (const road of blockedRoads) {
    if (routeCrossesBlockedSegment(from, to, road)) {
      if (road.blocked) {
        return Infinity;
      }
      multiplier = Math.max(multiplier, road.multiplier ?? 1);
    }
  }

  return (distance / speedUnitsPerMin) * multiplier;
}

/**
 * @param {Location} from
 * @param {Location} to
 * @param {Object} [options]
 */
export function getTravelDistance(from, to, options = {}) {
  const { blockedRoads = [] } = options;
  const distance = getDistance(from, to);
  let multiplier = 1;

  for (const road of blockedRoads) {
    if (routeCrossesBlockedSegment(from, to, road)) {
      if (road.blocked) return Infinity;
      multiplier = Math.max(multiplier, road.multiplier ?? 1);
    }
  }

  return distance * multiplier;
}
