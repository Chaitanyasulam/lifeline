import { createResource } from '../../models/Resource.js';
import { createEmergency } from '../../models/Emergency.js';
import { createFacility } from '../../models/Facility.js';
import { ZONE_CENTERS } from '../mapData.js';

const Z = ZONE_CENTERS;

/**
 * Multi-type disaster response — heterogeneous resources and emergencies.
 * @returns {import('../../engine/optimizer.js').SimulationState}
 */
export function createDisasterScenario() {
  return {
    resources: [
      createResource({ id: 'A01', type: 'Ambulance', location: { ...Z['Zone SW'] }, capabilities: ['medical'] }),
      createResource({ id: 'F01', type: 'Fire Truck', location: { ...Z['Zone NE'] }, capabilities: ['fire', 'rescue'] }),
      createResource({ id: 'RT01', type: 'Rescue Team', location: { ...Z['Zone Central'] }, capabilities: ['rescue', 'medical'], capacity: 2 }),
      createResource({ id: 'MT01', type: 'Medical Team', location: { ...Z['Zone W'] }, capabilities: ['medical', 'trauma'], capacity: 2 }),
      createResource({ id: 'EV01', type: 'Evacuation Vehicle', location: { ...Z['Zone E'] }, capabilities: ['evacuation'], capacity: 3 }),
      createResource({ id: 'S01', type: 'Emergency Supplies', location: { ...Z['Zone Far E'] }, capabilities: ['supplies', 'medical'] }),
    ],
    emergencies: [
      createEmergency({ id: 'E01', type: 'disaster', location: { ...Z['Zone NW'] }, severity: 'CRITICAL', peopleAffected: 30 }),
      createEmergency({ id: 'E02', type: 'medical', location: { ...Z['Zone W'] }, severity: 'CRITICAL', peopleAffected: 5 }),
      createEmergency({ id: 'E03', type: 'fire', location: { ...Z['Zone N'] }, severity: 'HIGH', peopleAffected: 8 }),
      createEmergency({ id: 'E04', type: 'rescue', location: { ...Z['Zone SE'] }, severity: 'CRITICAL', peopleAffected: 6 }),
      createEmergency({ id: 'E05', type: 'evacuation', location: { ...Z['Zone S'] }, severity: 'HIGH', peopleAffected: 40 }),
      createEmergency({ id: 'E06', type: 'disaster', location: { ...Z['Zone Central'], y: Z['Zone Central'].y + 20 }, severity: 'HIGH', peopleAffected: 15 }),
      createEmergency({ id: 'E07', type: 'evacuation', location: { ...Z['Zone Far S'] }, severity: 'MEDIUM', peopleAffected: 25 }),
      createEmergency({ id: 'E08', type: 'medical', location: { ...Z['Zone Far E'] }, severity: 'HIGH', peopleAffected: 3 }),
    ],
    facilities: [
      createFacility({ id: 'EOC01', type: 'Emergency Operations Center', location: { x: 450, y: 300, zone: 'Zone Central' }, capabilities: ['medical', 'rescue'] }),
      createFacility({ id: 'H01', type: 'Hospital', location: { x: 120, y: 620, zone: 'Zone SW' }, capabilities: ['medical', 'trauma'] }),
      createFacility({ id: 'FS01', type: 'Fire Station', location: { x: 730, y: 120, zone: 'Zone NE' }, capabilities: ['fire', 'rescue'] }),
      createFacility({ id: 'SH01', type: 'Shelter', location: { x: 450, y: 620, zone: 'Zone Far S' }, capabilities: ['evacuation', 'supplies'] }),
      createFacility({ id: 'RC01', type: 'Relief Center', location: { x: 1080, y: 620, zone: 'Zone Far S' }, capabilities: ['supplies', 'medical'] }),
    ],
    blockedRoads: [],
  };
}
