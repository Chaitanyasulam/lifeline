import { getResourceCapabilities } from './types.js';

/**
 * @typedef {Object} Location
 * @property {number} x
 * @property {number} y
 * @property {string} [zone]
 */

/**
 * @typedef {import('./types.js').ResourceType} ResourceType
 * @typedef {import('./constants.js').ResourceStatus} ResourceStatus
 */

/**
 * @typedef {Object} Resource
 * @property {string} id
 * @property {ResourceType | string} type
 * @property {Location} location
 * @property {ResourceStatus} status
 * @property {number} capacity
 * @property {string[]} capabilities
 * @property {string | null} currentAssignment
 */

/**
 * @param {Partial<Resource> & Pick<Resource, 'id' | 'type' | 'location'>} props
 * @returns {Resource}
 */
export function createResource(props) {
  const type = /** @type {ResourceType} */ (props.type);
  return {
    id: props.id,
    type: props.type,
    location: props.location,
    status: props.status ?? 'available',
    capacity: props.capacity ?? 1,
    capabilities: props.capabilities ?? getResourceCapabilities(type),
    currentAssignment: props.currentAssignment ?? null,
  };
}

/**
 * @param {Resource} resource
 * @param {string[]} requiredCapabilities
 */
export function resourceHasCapabilities(resource, requiredCapabilities) {
  return requiredCapabilities.every((cap) => resource.capabilities.includes(cap));
}

/**
 * @param {Resource} resource
 */
export function isResourceAvailable(resource) {
  return resource.status === 'available';
}
