import { createEmergency } from '../models/Emergency.js';
import { createResource } from '../models/Resource.js';
import { ROADS, EMERGENCY_SPAWN_POINTS, RESOURCE_SPAWN_POINTS, MOVE_TARGETS } from '../data/mapData.js';

/**
 * @typedef {import('../engine/optimizer.js').SimulationState} SimulationState
 * @typedef {import('../models/Resource.js').Location} Location
 * @typedef {import('../engine/scoring.js').AssignmentPair} AssignmentPair
 */

const SEVERITY_ORDER = ['LOW', 'MEDIUM', 'HIGH', 'CRITICAL'];
const SEVERITY_OPTIONS = ['LOW', 'MEDIUM', 'HIGH', 'CRITICAL'];

let emergencyCounter = 9;

export function resetEmergencyCounter() {
  emergencyCounter = 9;
}

/**
 * @param {SimulationState} state
 * @param {Partial<import('../models/Emergency.js').Emergency>} [overrides]
 */
/**
 * @param {SimulationState} state
 */
function pickResourceTemplate(state) {
  const pool = state.resources.filter((r) => r.status === 'available');
  const candidates = pool.length > 0 ? pool : state.resources;
  return candidates[Math.floor(Math.random() * candidates.length)];
}

/**
 * @param {SimulationState} state
 * @param {{ id: string }} template
 */
function nextResourceId(state, template) {
  const match = template.id.match(/^([A-Z]+)(\d+)$/);
  const prefix = match ? match[1] : 'R';
  const padLen = match ? match[2].length : 2;

  let maxNum = 0;
  for (const resource of state.resources) {
    const idMatch = resource.id.match(new RegExp(`^${prefix}(\\d+)$`));
    if (idMatch) {
      maxNum = Math.max(maxNum, parseInt(idMatch[1], 10));
    }
  }

  return `${prefix}${String(maxNum + 1).padStart(padLen, '0')}`;
}

/**
 * @param {SimulationState} state
 * @param {Partial<import('../models/Resource.js').Resource>} [overrides]
 */
export function addResource(state, overrides = {}) {
  const template = overrides.type
    ? state.resources.find((r) => r.type === overrides.type) ?? state.resources[0]
    : pickResourceTemplate(state);

  if (!template) return state;

  const spawn =
    RESOURCE_SPAWN_POINTS[state.resources.length % RESOURCE_SPAWN_POINTS.length];
  const id = overrides.id ?? nextResourceId(state, template);

  return {
    ...state,
    resources: [
      ...state.resources,
      createResource({
        id,
        type: overrides.type ?? template.type,
        location: overrides.location ?? spawn,
        capacity: overrides.capacity ?? template.capacity,
        capabilities: overrides.capabilities ?? template.capabilities,
        status: 'available',
      }),
    ],
  };
}

export function addEmergency(state, overrides = {}) {
  const spawn =
    EMERGENCY_SPAWN_POINTS[(state.emergencies.length - 1) % EMERGENCY_SPAWN_POINTS.length];
  const id = `E${String(emergencyCounter++).padStart(2, '0')}`;

  return {
    ...state,
    emergencies: [
      ...state.emergencies,
      createEmergency({
        id,
        type: overrides.type ?? 'medical',
        location: overrides.location ?? spawn,
        severity: overrides.severity ?? 'HIGH',
        requiredCapabilities: overrides.requiredCapabilities ?? ['medical'],
        peopleAffected: overrides.peopleAffected ?? 1,
        status: 'active',
      }),
    ],
  };
}

/**
 * @param {SimulationState} state
 * @param {string} emergencyId
 */
export function escalateEmergency(state, emergencyId) {
  return {
    ...state,
    emergencies: state.emergencies.map((e) => {
      if (e.id !== emergencyId || e.status === 'resolved') return e;
      const idx = SEVERITY_ORDER.indexOf(e.severity);
      if (idx >= SEVERITY_ORDER.length - 1) return e;
      return { ...e, severity: SEVERITY_ORDER[idx + 1] };
    }),
  };
}

/**
 * @param {SimulationState} state
 * @param {string} emergencyId
 */
export function deescalateEmergency(state, emergencyId) {
  return {
    ...state,
    emergencies: state.emergencies.map((e) => {
      if (e.id !== emergencyId || e.status === 'resolved') return e;
      const idx = SEVERITY_ORDER.indexOf(e.severity);
      if (idx <= 0) return e;
      return { ...e, severity: SEVERITY_ORDER[idx - 1] };
    }),
  };
}

/**
 * Mark an emergency as resolved. If a resource was assigned, move it to the
 * emergency location so it can be reallocated to the next call.
 *
 * @param {SimulationState} state
 * @param {string} emergencyId
 * @param {AssignmentPair[]} [currentAssignments]
 */
export function resolveEmergency(state, emergencyId) {
  const emergency = state.emergencies.find((e) => e.id === emergencyId);
  if (!emergency || emergency.status === 'resolved') return state;

  const assignedResource = state.resources.find((r) => r.currentAssignment === emergencyId);
  const assignedResourceId = assignedResource?.id ?? null;

  return {
    ...state,
    emergencies: state.emergencies.map((e) =>
      e.id === emergencyId ? { ...e, status: 'resolved' } : e,
    ),
    resources: state.resources.map((r) => {
      if (r.status === 'unavailable') return r;
      if (assignedResourceId && r.id === assignedResourceId) {
        return {
          ...r,
          status: 'available',
          currentAssignment: null,
          location: { ...emergency.location },
        };
      }
      return r;
    }),
  };
}

/**
 * @param {SimulationState} state
 * @param {string} resourceId
 */
export function disableResource(state, resourceId) {
  const resource = state.resources.find((r) => r.id === resourceId);
  const emergencyId = resource?.currentAssignment ?? null;

  return {
    ...state,
    resources: state.resources.map((r) =>
      r.id === resourceId
        ? { ...r, status: 'unavailable', currentAssignment: null }
        : r,
    ),
    emergencies: state.emergencies.map((e) =>
      e.id === emergencyId ? { ...e, status: 'active' } : e,
    ),
  };
}

/**
 * @param {SimulationState} state
 * @param {string} resourceId
 */
export function enableResource(state, resourceId) {
  return {
    ...state,
    resources: state.resources.map((r) =>
      r.id === resourceId
        ? { ...r, status: 'available', currentAssignment: null }
        : r,
    ),
  };
}

/**
 * Toggle a resource between available and unavailable.
 * @param {SimulationState} state
 * @param {string} resourceId
 */
export function toggleResourceAvailability(state, resourceId) {
  const resource = state.resources.find((r) => r.id === resourceId);
  if (!resource) return state;
  return resource.status === 'unavailable'
    ? enableResource(state, resourceId)
    : disableResource(state, resourceId);
}

/**
 * @param {SimulationState} state
 * @param {string} resourceId
 * @param {Location} location
 */
export function moveResource(state, resourceId, location) {
  return {
    ...state,
    resources: state.resources.map((r) =>
      r.id === resourceId
        ? { ...r, location: { ...r.location, ...location } }
        : r,
    ),
  };
}

/**
 * @param {SimulationState} state
 * @param {string} [roadId]
 */
export function blockRoute(state, roadId = 'H2') {
  const road = ROADS.find((r) => r.id === roadId);
  if (!road) return state;

  const alreadyBlocked = state.blockedRoads.some(
    (b) => b.from.x === road.from.x && b.to.x === road.to.x,
  );
  if (alreadyBlocked) return state;

  return {
    ...state,
    blockedRoads: [
      ...state.blockedRoads,
      { from: road.from, to: road.to, blocked: true, name: road.name },
    ],
  };
}

/**
 * @param {SimulationState} state
 * @param {string} facilityId
 */
export function closeFacility(state, facilityId) {
  return {
    ...state,
    facilities: state.facilities.map((f) =>
      f.id === facilityId ? { ...f, status: 'closed' } : f,
    ),
  };
}

/** Demo event presets for presenter */
export const DEMO_EVENTS = {
  addEmergency: (state) =>
    addEmergency(state, {
      severity: SEVERITY_OPTIONS[Math.floor(Math.random() * SEVERITY_OPTIONS.length)],
    }),
  addResource: (state) => addResource(state),
  closeFacility: (state) => closeFacility(state, 'H02'),
};
