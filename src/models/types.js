/** @typedef {'medical' | 'fire' | 'flood' | 'rescue' | 'disaster' | 'evacuation'} EmergencyType */

/** @typedef {'Ambulance' | 'Fire Truck' | 'Rescue Vehicle' | 'Rescue Team' | 'Medical Team' | 'Emergency Supplies' | 'Evacuation Vehicle'} ResourceType */

/** @typedef {'Hospital' | 'Fire Station' | 'Shelter' | 'Emergency Operations Center' | 'Relief Center'} FacilityType */

export const EMERGENCY_TYPES = /** @type {EmergencyType[]} */ ([
  'medical',
  'fire',
  'flood',
  'rescue',
  'disaster',
  'evacuation',
]);

export const RESOURCE_TYPES = /** @type {ResourceType[]} */ ([
  'Ambulance',
  'Fire Truck',
  'Rescue Vehicle',
  'Rescue Team',
  'Medical Team',
  'Emergency Supplies',
  'Evacuation Vehicle',
]);

export const FACILITY_TYPES = /** @type {FacilityType[]} */ ([
  'Hospital',
  'Fire Station',
  'Shelter',
  'Emergency Operations Center',
  'Relief Center',
]);

/** Capability tags used for matching resources to emergencies */
export const CAPABILITIES = {
  MEDICAL: 'medical',
  FIRE: 'fire',
  RESCUE: 'rescue',
  FLOOD: 'flood',
  EVACUATION: 'evacuation',
  SUPPLIES: 'supplies',
  TRAUMA: 'trauma',
};

/**
 * Required capabilities per emergency type (simulated demo values).
 * @type {Record<EmergencyType, string[]>}
 */
export const EMERGENCY_TYPE_CAPABILITIES = {
  medical: [CAPABILITIES.MEDICAL],
  fire: [CAPABILITIES.FIRE],
  flood: [CAPABILITIES.FLOOD, CAPABILITIES.RESCUE],
  rescue: [CAPABILITIES.RESCUE],
  disaster: [CAPABILITIES.RESCUE, CAPABILITIES.MEDICAL],
  evacuation: [CAPABILITIES.EVACUATION],
};

/**
 * Default capabilities per resource type.
 * @type {Record<ResourceType, string[]>}
 */
export const RESOURCE_TYPE_CAPABILITIES = {
  Ambulance: [CAPABILITIES.MEDICAL],
  'Fire Truck': [CAPABILITIES.FIRE, CAPABILITIES.RESCUE],
  'Rescue Vehicle': [CAPABILITIES.RESCUE, CAPABILITIES.FLOOD],
  'Rescue Team': [CAPABILITIES.RESCUE, CAPABILITIES.MEDICAL],
  'Medical Team': [CAPABILITIES.MEDICAL, CAPABILITIES.TRAUMA],
  'Emergency Supplies': [CAPABILITIES.SUPPLIES, CAPABILITIES.MEDICAL],
  'Evacuation Vehicle': [CAPABILITIES.EVACUATION],
};

/**
 * Default capabilities per facility type.
 * @type {Record<FacilityType, string[]>}
 */
export const FACILITY_TYPE_CAPABILITIES = {
  Hospital: [CAPABILITIES.MEDICAL, CAPABILITIES.TRAUMA],
  'Fire Station': [CAPABILITIES.FIRE, CAPABILITIES.RESCUE],
  Shelter: [CAPABILITIES.EVACUATION, CAPABILITIES.SUPPLIES],
  'Emergency Operations Center': [CAPABILITIES.MEDICAL, CAPABILITIES.RESCUE],
  'Relief Center': [CAPABILITIES.SUPPLIES, CAPABILITIES.MEDICAL],
};

/** Display labels */
export const EMERGENCY_TYPE_LABELS = {
  medical: 'Medical',
  fire: 'Fire',
  flood: 'Flood',
  rescue: 'Rescue',
  disaster: 'Disaster',
  evacuation: 'Evacuation',
};

/** Accent colors per emergency type (map + UI) */
export const EMERGENCY_TYPE_COLORS = {
  medical: '#ef4444',
  fire: '#f97316',
  flood: '#06b6d4',
  rescue: '#a855f7',
  disaster: '#ec4899',
  evacuation: '#eab308',
};

/** Short map symbol per resource type */
export const RESOURCE_TYPE_SYMBOLS = {
  Ambulance: 'A',
  'Fire Truck': 'F',
  'Rescue Vehicle': 'R',
  'Rescue Team': 'T',
  'Medical Team': 'M',
  'Emergency Supplies': 'S',
  'Evacuation Vehicle': 'E',
};

/** @param {EmergencyType} type */
export function getEmergencyCapabilities(type) {
  return EMERGENCY_TYPE_CAPABILITIES[type] ?? [CAPABILITIES.RESCUE];
}

/** @param {ResourceType} type */
export function getResourceCapabilities(type) {
  return RESOURCE_TYPE_CAPABILITIES[type] ?? [];
}

/** @param {FacilityType} type */
export function getFacilityCapabilities(type) {
  return FACILITY_TYPE_CAPABILITIES[type] ?? [];
}

/** @param {EmergencyType} type */
export function getEmergencyTypeLabel(type) {
  return EMERGENCY_TYPE_LABELS[type] ?? type;
}
