import { createMedicalScenario } from './medical.js';
import { createFireScenario } from './fire.js';
import { createFloodScenario } from './flood.js';
import { createDisasterScenario } from './disaster.js';

/**
 * @typedef {Object} ScenarioProfile
 * @property {string} id
 * @property {string} label
 * @property {string} description
 * @property {string} domain
 * @property {() => import('../../engine/optimizer.js').SimulationState} create
 */

/** @type {ScenarioProfile[]} */
export const SCENARIO_PROFILES = [
  {
    id: 'medical',
    label: 'Medical Emergency',
    description: 'Ambulances responding to medical calls across the city',
    domain: 'Medical / EMS',
    create: createMedicalScenario,
  },
  {
    id: 'fire',
    label: 'Fire Emergency',
    description: 'Fire trucks and rescue units responding to structure fires',
    domain: 'Fire Response',
    create: createFireScenario,
  },
  {
    id: 'flood',
    label: 'Flood Rescue',
    description: 'Rescue teams and supplies responding to flood zones',
    domain: 'Flood / Water Rescue',
    create: createFloodScenario,
  },
  {
    id: 'disaster',
    label: 'Disaster Response',
    description: 'Multi-type disaster with mixed resources and demands',
    domain: 'Multi-Agency Disaster',
    create: createDisasterScenario,
  },
];

export const DEFAULT_SCENARIO_ID = 'medical';

/**
 * @param {string} [scenarioId]
 */
export function createScenario(scenarioId = DEFAULT_SCENARIO_ID) {
  const profile = SCENARIO_PROFILES.find((p) => p.id === scenarioId);
  return (profile ?? SCENARIO_PROFILES[0]).create();
}

/**
 * @param {string} scenarioId
 */
export function getScenarioProfile(scenarioId) {
  return SCENARIO_PROFILES.find((p) => p.id === scenarioId) ?? SCENARIO_PROFILES[0];
}
