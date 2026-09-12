import { createResource } from '../../models/Resource.js';
import { createEmergency } from '../../models/Emergency.js';
import { createFacility } from '../../models/Facility.js';
import { ZONE_CENTERS } from '../mapData.js';

const Z = ZONE_CENTERS;

/** @returns {import('../../engine/optimizer.js').SimulationState} */
export function createMedicalScenario() {
  return {
    resources: [
      createResource({
        id: 'A01',
        type: 'Ambulance',
        location: { ...Z['Zone SW'], x: Z['Zone SW'].x - 20 },
        capabilities: ['medical'],
      }),
      createResource({
        id: 'A02',
        type: 'Ambulance',
        location: { ...Z['Zone NE'], x: Z['Zone NE'].x + 15 },
        capabilities: ['medical'],
      }),
      createResource({
        id: 'A03',
        type: 'Ambulance',
        location: { ...Z['Zone Central'] },
        capabilities: ['medical'],
      }),
      createResource({
        id: 'A04',
        type: 'Ambulance',
        location: { ...Z['Zone Far E'] },
        capabilities: ['medical'],
      }),
    ],
    emergencies: [
      createEmergency({ id: 'E01', type: 'medical', location: { ...Z['Zone NW'], x: Z['Zone NW'].x + 30 }, severity: 'CRITICAL', peopleAffected: 1 }),
      createEmergency({ id: 'E02', type: 'medical', location: { ...Z['Zone W'], y: Z['Zone W'].y - 20 }, severity: 'MEDIUM', peopleAffected: 2 }),
      createEmergency({ id: 'E03', type: 'medical', location: { ...Z['Zone E'], x: Z['Zone E'].x + 20 }, severity: 'CRITICAL', peopleAffected: 1 }),
      createEmergency({ id: 'E04', type: 'medical', location: { ...Z['Zone SE'] }, severity: 'HIGH', peopleAffected: 3 }),
      createEmergency({ id: 'E05', type: 'medical', location: { ...Z['Zone S'], y: Z['Zone S'].y + 15 }, severity: 'LOW', peopleAffected: 1 }),
      createEmergency({ id: 'E06', type: 'medical', location: { ...Z['Zone N'], x: Z['Zone N'].x - 25 }, severity: 'HIGH', peopleAffected: 2 }),
      createEmergency({ id: 'E07', type: 'medical', location: { ...Z['Zone Far E'], y: Z['Zone Far E'].y + 40 }, severity: 'MEDIUM', peopleAffected: 1 }),
      createEmergency({ id: 'E08', type: 'medical', location: { ...Z['Zone Far S'] }, severity: 'HIGH', peopleAffected: 4 }),
    ],
    facilities: [
      createFacility({ id: 'H01', type: 'Hospital', location: { x: 120, y: 620, zone: 'Zone SW' }, capabilities: ['medical', 'trauma'] }),
      createFacility({ id: 'H02', type: 'Hospital', location: { x: 450, y: 620, zone: 'Zone Far S' }, capabilities: ['medical', 'trauma'] }),
      createFacility({ id: 'H03', type: 'Hospital', location: { x: 1080, y: 620, zone: 'Zone Far S' }, capabilities: ['medical', 'trauma'] }),
    ],
    blockedRoads: [],
  };
}
