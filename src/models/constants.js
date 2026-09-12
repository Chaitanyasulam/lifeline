/** @typedef {'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW'} SeverityLevel */

/** @typedef {'available' | 'assigned' | 'unavailable'} ResourceStatus */

/** @typedef {'active' | 'assigned' | 'resolved'} EmergencyStatus */

/** @typedef {'open' | 'closed'} FacilityStatus */

/**
 * Demonstration severity weights — NOT real EMS protocols.
 * @type {Record<SeverityLevel, number>}
 */
export const SEVERITY_WEIGHTS = {
  CRITICAL: 100,
  HIGH: 60,
  MEDIUM: 30,
  LOW: 10,
};

/** Simulated travel speed: map-units per minute */
export const DEFAULT_SPEED_UNITS_PER_MIN = 120;

/** Base penalty multiplier for unassigned emergencies (simulated) */
export const UNASSIGNED_PENALTY_MINUTES = 15;

/** Extra penalty per minute beyond threshold for critical emergencies */
export const CRITICAL_DELAY_THRESHOLD_MIN = 5;
export const CRITICAL_DELAY_PENALTY = 50;

export const STRATEGIES = {
  NEAREST_FIRST: 'NEAREST_FIRST',
  LIFELINE_OPTIMIZED: 'LIFELINE_OPTIMIZED',
};
