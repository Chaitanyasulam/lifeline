import { getTravelDistance } from './travelTime.js';

/**
 * @typedef {import('../models/Emergency.js').Emergency} Emergency
 * @typedef {import('../models/Resource.js').Resource} Resource
 * @typedef {import('./scoring.js').AssignmentPair} AssignmentPair
 * @typedef {import('./travelTime.js').BlockedRoad} BlockedRoad
 */

/**
 * @typedef {Object} AllocationMetrics
 * @property {number} avgResponseTime
 * @property {number} criticalWaitTime
 * @property {number} resourcesUtilized
 * @property {number} unassignedEmergencies
 * @property {number} totalTravelDistance
 * @property {boolean} simulated
 */

/**
 * @param {AssignmentPair[]} assignments
 * @param {Emergency[]} emergencies
 * @param {Resource[]} resources
 * @param {Object} [options]
 * @param {BlockedRoad[]} [options.blockedRoads]
 */
export function calculateMetrics(assignments, emergencies, resources, options = {}) {
  const assignedIds = new Set(assignments.map((a) => a.emergencyId));
  const unassigned = emergencies.filter((e) => e.status === 'active' && !assignedIds.has(e.id));

  const responseTimes = assignments.map((a) => a.travelTime);
  const avgResponseTime =
    responseTimes.length > 0
      ? responseTimes.reduce((s, t) => s + t, 0) / responseTimes.length
      : 0;

  const criticalEmergencies = emergencies.filter((e) => e.severity === 'CRITICAL');
  const criticalAssigned = assignments.filter((a) => {
    const e = emergencies.find((em) => em.id === a.emergencyId);
    return e?.severity === 'CRITICAL';
  });
  const criticalUnassigned = criticalEmergencies.filter((e) => !assignedIds.has(e.id));

  let criticalWaitTime = 0;
  if (criticalAssigned.length > 0) {
    criticalWaitTime =
      criticalAssigned.reduce((s, a) => s + a.travelTime, 0) / criticalAssigned.length;
  } else if (criticalUnassigned.length > 0) {
    criticalWaitTime = Infinity;
  }

  const totalTravelDistance = assignments.reduce((sum, a) => {
    const resource = resources.find((r) => r.id === a.resourceId);
    const emergency = emergencies.find((e) => e.id === a.emergencyId);
    if (!resource || !emergency) return sum;
    const dist = getTravelDistance(resource.location, emergency.location, options);
    return sum + (dist === Infinity ? 0 : dist);
  }, 0);

  return {
    avgResponseTime: round(avgResponseTime),
    criticalWaitTime: criticalWaitTime === Infinity ? Infinity : round(criticalWaitTime),
    resourcesUtilized: assignments.length,
    unassignedEmergencies: unassigned.length,
    totalTravelDistance: round(totalTravelDistance),
    simulated: true,
  };
}

function round(n) {
  return Math.round(n * 10) / 10;
}
