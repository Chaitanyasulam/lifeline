import { createResource } from '../../models/Resource.js';
import { createEmergency } from '../../models/Emergency.js';
import { createFacility } from '../../models/Facility.js';
import { ZONE_CENTERS } from '../mapData.js';

const Z = ZONE_CENTERS;

/** @returns {import('../../engine/optimizer.js').SimulationState} */
export function createFloodScenario() {
  return {
    resources: [
      createResource({ id: 'RV01', type: 'Rescue Vehicle', location: { ...Z['Zone SW'] }, capabilities: ['rescue', 'flood'] }),
      createResource({ id: 'RV02', type: 'Rescue Vehicle', location: { ...Z['Zone NE'] }, capabilities: ['rescue', 'flood'] }),
      createResource({ id: 'RT01', type: 'Rescue Team', location: { ...Z['Zone Central'] }, capabilities: ['rescue', 'medical'], capacity: 2 }),
      createResource({ id: 'RT02', type: 'Rescue Team', location: { ...Z['Zone E'] }, capabilities: ['rescue', 'medical'], capacity: 2 }),
      createResource({ id: 'S01', type: 'Emergency Supplies', location: { ...Z['Zone Far E'] }, capabilities: ['supplies', 'medical'] }),
    ],
    emergencies: [
      createEmergency({ id: 'E01', type: 'flood', location: { ...Z['Zone W'] }, severity: 'CRITICAL', peopleAffected: 15 }),
      createEmergency({ id: 'E02', type: 'flood', location: { ...Z['Zone S'] }, severity: 'CRITICAL', peopleAffected: 22 }),
      createEmergency({ id: 'E03', type: 'flood', location: { ...Z['Zone SE'] }, severity: 'HIGH', peopleAffected: 8 }),
      createEmergency({ id: 'E04', type: 'rescue', location: { ...Z['Zone NW'] }, severity: 'HIGH', peopleAffected: 4 }),
      createEmergency({ id: 'E05', type: 'rescue', location: { ...Z['Zone N'] }, severity: 'MEDIUM', peopleAffected: 3 }),
      createEmergency({ id: 'E06', type: 'flood', location: { ...Z['Zone Far S'] }, severity: 'HIGH', peopleAffected: 10 }),
      createEmergency({ id: 'E07', type: 'rescue', location: { ...Z['Zone Central'], y: Z['Zone Central'].y + 30 }, severity: 'LOW', peopleAffected: 2 }),
    ],
    facilities: [
      createFacility({ id: 'SH01', type: 'Shelter', location: { x: 450, y: 120, zone: 'Zone N' }, capabilities: ['evacuation', 'supplies'] }),
      createFacility({ id: 'RC01', type: 'Relief Center', location: { x: 450, y: 620, zone: 'Zone Far S' }, capabilities: ['supplies', 'medical'] }),
      createFacility({ id: 'SH02', type: 'Shelter', location: { x: 1020, y: 620, zone: 'Zone Far S' }, capabilities: ['evacuation', 'supplies'] }),
    ],
    blockedRoads: [],
  };
}
