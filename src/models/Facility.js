import { getFacilityCapabilities } from './types.js';

/**
 * @typedef {import('./constants.js').FacilityStatus} FacilityStatus
 * @typedef {import('./Resource.js').Location} Location
 * @typedef {import('./types.js').FacilityType} FacilityType
 */

/**
 * @typedef {Object} Facility
 * @property {string} id
 * @property {FacilityType} type
 * @property {Location} location
 * @property {string[]} capabilities
 * @property {FacilityStatus} status
 */

/**
 * @param {Partial<Facility> & Pick<Facility, 'id' | 'type' | 'location'>} props
 * @returns {Facility}
 */
export function createFacility(props) {
  return {
    id: props.id,
    type: props.type,
    location: props.location,
    capabilities: props.capabilities ?? getFacilityCapabilities(props.type),
    status: props.status ?? 'open',
  };
}

/**
 * @param {Facility} facility
 */
export function isFacilityOpen(facility) {
  return facility.status === 'open';
}
