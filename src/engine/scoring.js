import {
  SEVERITY_WEIGHTS,
  UNASSIGNED_PENALTY_MINUTES,
  CRITICAL_DELAY_THRESHOLD_MIN,
  CRITICAL_DELAY_PENALTY,
} from '../models/constants.js';

/**
 * @typedef {import('../models/Emergency.js').Emergency} Emergency
 */

/**
 * @typedef {Object} AssignmentPair
 * @property {string} resourceId
 * @property {string} emergencyId
 * @property {number} travelTime
 * @property {number} [distance]
 */

/**
 * Cost of a single resource-to-emergency assignment (lower is better).
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
 * Cost of leaving an emergency unassigned (lower priority emergencies cost less to skip).
 * @param {Emergency} emergency
 */
export function getUnassignedCost(emergency) {
  return UNASSIGNED_PENALTY_MINUTES * SEVERITY_WEIGHTS[emergency.severity];
}

/**
 * Total system cost for a complete allocation plan.
 * @param {AssignmentPair[]} assignments
 * @param {Emergency[]} allEmergencies
 */
export function scoreAllocation(assignments, allEmergencies) {
  const assignedIds = new Set(assignments.map((a) => a.emergencyId));
  const unassigned = allEmergencies.filter((e) => !assignedIds.has(e.id));

  const assignmentCost = assignments.reduce((sum, a) => {
    const emergency = allEmergencies.find((e) => e.id === a.emergencyId);
    return sum + (emergency ? getAssignmentCost(a.travelTime, emergency) : 0);
  }, 0);

  const unassignedCost = unassigned.reduce(
    (sum, e) => sum + getUnassignedCost(e),
    0,
  );

  return {
    totalCost: assignmentCost + unassignedCost,
    assignmentCost,
    unassignedCost,
  };
}
