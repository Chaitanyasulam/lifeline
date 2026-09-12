import { createResource } from '../../models/Resource.js';
import { createEmergency } from '../../models/Emergency.js';
import { createFacility } from '../../models/Facility.js';
import { ZONE_CENTERS } from '../mapData.js';

const Z = ZONE_CENTERS;

/** @returns {import('../../engine/optimizer.js').SimulationState} */
export function createFireScenario() {
  return {
    resources: [
      createResource({ id: 'F01', type: 'Fire Truck', location: { ...Z['Zone SW'] }, capabilities: ['fire', 'rescue'] }),
      createResource({ id: 'F02', type: 'Fire Truck', location: { ...Z['Zone NE'] }, capabilities: ['fire', 'rescue'] }),
      createResource({ id: 'F03', type: 'Fire Truck', location: { ...Z['Zone Central'] }, capabilities: ['fire', 'rescue'] }),
      createResource({ id: 'R01', type: 'Rescue Vehicle', location: { ...Z['Zone E'] }, capabilities: ['rescue', 'flood'] }),
    ],
    emergencies: [
      createEmergency({ id: 'E01', type: 'fire', location: { ...Z['Zone NW'], x: Z['Zone NW'].x + 20 }, severity: 'CRITICAL', peopleAffected: 8 }),
      createEmergency({ id: 'E02', type: 'fire', location: { ...Z['Zone N'] }, severity: 'HIGH', peopleAffected: 4 }),
      createEmergency({ id: 'E03', type: 'fire', location: { ...Z['Zone W'] }, severity: 'CRITICAL', peopleAffected: 12 }),
      createEmergency({ id: 'E04', type: 'fire', location: { ...Z['Zone SE'] }, severity: 'HIGH', peopleAffected: 6 }),
      createEmergency({ id: 'E05', type: 'fire', location: { ...Z['Zone Far E'] }, severity: 'MEDIUM', peopleAffected: 3 }),
      createEmergency({ id: 'E06', type: 'fire', location: { ...Z['Zone S'] }, severity: 'LOW', peopleAffected: 2 }),
    ],
    facilities: [
      createFacility({ id: 'FS01', type: 'Fire Station', location: { x: 120, y: 620, zone: 'Zone SW' }, capabilities: ['fire', 'rescue'] }),
      createFacility({ id: 'FS02', type: 'Fire Station', location: { x: 730, y: 120, zone: 'Zone NE' }, capabilities: ['fire', 'rescue'] }),
      createFacility({ id: 'H01', type: 'Hospital', location: { x: 450, y: 620, zone: 'Zone Far S' }, capabilities: ['medical', 'trauma'] }),
    ],
    blockedRoads: [],
  };
}
