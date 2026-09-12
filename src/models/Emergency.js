/**
 * @typedef {import('./constants.js').SeverityLevel} SeverityLevel
 * @typedef {import('./constants.js').EmergencyStatus} EmergencyStatus
 * @typedef {import('./Resource.js').Location} Location
 */

/**
 * @typedef {Object} Emergency
 * @property {string} id
 * @property {string} type
 * @property {Location} location
 * @property {SeverityLevel} severity
 * @property {string[]} requiredCapabilities
 * @property {number} peopleAffected
 * @property {EmergencyStatus} status
 */

/**
 * @param {Partial<Emergency> & Pick<Emergency, 'id' | 'type' | 'location' | 'severity'>} props
 * @returns {Emergency}
 */
export function createEmergency(props) {
  return {
    id: props.id,
    type: props.type,
    location: props.location,
    severity: props.severity,
    requiredCapabilities: props.requiredCapabilities ?? [],
    peopleAffected: props.peopleAffected ?? 1,
    status: props.status ?? 'active',
  };
}

/**
 * @param {Emergency} emergency
 */
export function isEmergencyActive(emergency) {
  return emergency.status === 'active';
}

/**
 * @param {Emergency} emergency
 */
export function isEmergencyUnassigned(emergency) {
  return emergency.status === 'active';
}
