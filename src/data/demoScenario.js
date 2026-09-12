import { createResource } from '../models/Resource.js';
import { createEmergency } from '../models/Emergency.js';
import { createFacility } from '../models/Facility.js';

/**
 * Predefined demo scenario: 3 ambulances, 6 emergencies, 2 hospitals.
 * Coordinates are simulated map units — NOT real geography.
 *
 * Designed so LIFELINE global optimization can outperform nearest-first
 * when a nearby medium-priority call would steal a unit from a critical one.
 *
 * @returns {import('../engine/optimizer.js').SimulationState}
 */
export function createDemoScenario() {
  const resources = [
    createResource({
      id: 'A01',
      type: 'Ambulance',
      location: { x: 150, y: 400, zone: 'Zone 1' },
      status: 'available',
      capacity: 1,
      capabilities: ['medical'],
    }),
    createResource({
      id: 'A02',
      type: 'Ambulance',
      location: { x: 750, y: 400, zone: 'Zone 5' },
      status: 'available',
      capacity: 1,
      capabilities: ['medical'],
    }),
    createResource({
      id: 'A03',
      type: 'Ambulance',
      location: { x: 450, y: 150, zone: 'Zone 3' },
      status: 'available',
      capacity: 1,
      capabilities: ['medical'],
    }),
  ];

  const emergencies = [
    createEmergency({
      id: 'E01',
      type: 'medical',
      location: { x: 200, y: 420, zone: 'Zone 1' },
      severity: 'CRITICAL',
      requiredCapabilities: ['medical'],
      peopleAffected: 1,
    }),
    createEmergency({
      id: 'E02',
      type: 'medical',
      location: { x: 220, y: 380, zone: 'Zone 1' },
      severity: 'MEDIUM',
      requiredCapabilities: ['medical'],
      peopleAffected: 2,
    }),
    createEmergency({
      id: 'E03',
      type: 'medical',
      location: { x: 700, y: 420, zone: 'Zone 5' },
      severity: 'CRITICAL',
      requiredCapabilities: ['medical'],
      peopleAffected: 1,
    }),
    createEmergency({
      id: 'E04',
      type: 'medical',
      location: { x: 720, y: 370, zone: 'Zone 5' },
      severity: 'HIGH',
      requiredCapabilities: ['medical'],
      peopleAffected: 3,
    }),
    createEmergency({
      id: 'E05',
      type: 'medical',
      location: { x: 450, y: 450, zone: 'Zone 3' },
      severity: 'LOW',
      requiredCapabilities: ['medical'],
      peopleAffected: 1,
    }),
    createEmergency({
      id: 'E06',
      type: 'medical',
      location: { x: 460, y: 80, zone: 'Zone 2' },
      severity: 'HIGH',
      requiredCapabilities: ['medical'],
      peopleAffected: 2,
    }),
  ];

  const facilities = [
    createFacility({
      id: 'H01',
      type: 'Hospital',
      location: { x: 100, y: 500, zone: 'Zone 1' },
      capabilities: ['medical', 'trauma'],
      status: 'open',
    }),
    createFacility({
      id: 'H02',
      type: 'Hospital',
      location: { x: 800, y: 500, zone: 'Zone 6' },
      capabilities: ['medical', 'trauma'],
      status: 'open',
    }),
  ];

  return {
    resources,
    emergencies,
    facilities,
    blockedRoads: [],
  };
}
