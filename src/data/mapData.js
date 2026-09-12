/** Simulated city map layout — NOT real geography */

export const MAP_WIDTH = 1200;
export const MAP_HEIGHT = 800;

/** 3×3 zone grid with road corridors between cells */
export const ZONES = [
  { id: 'Z1', label: 'Zone NW', x: 60, y: 60, w: 220, h: 120 },
  { id: 'Z2', label: 'Zone N', x: 340, y: 60, w: 220, h: 120 },
  { id: 'Z3', label: 'Zone NE', x: 620, y: 60, w: 220, h: 120 },
  { id: 'Z4', label: 'Zone W', x: 60, y: 240, w: 220, h: 120 },
  { id: 'Z5', label: 'Zone Central', x: 340, y: 240, w: 220, h: 120 },
  { id: 'Z6', label: 'Zone E', x: 620, y: 240, w: 220, h: 120 },
  { id: 'Z7', label: 'Zone SW', x: 60, y: 420, w: 220, h: 120 },
  { id: 'Z8', label: 'Zone S', x: 340, y: 420, w: 220, h: 120 },
  { id: 'Z9', label: 'Zone SE', x: 620, y: 420, w: 220, h: 120 },
  { id: 'Z10', label: 'Zone Far E', x: 900, y: 180, w: 240, h: 200 },
  { id: 'Z11', label: 'Zone Far S', x: 340, y: 600, w: 500, h: 160 },
];

/**
 * Connected road network — horizontal arteries, vertical arteries,
 * zone connectors, and perimeter ring.
 */
export const ROADS = [
  // Perimeter ring
  { id: 'P1', name: 'North Ring', from: { x: 80, y: 50 }, to: { x: 1120, y: 50 }, major: true },
  { id: 'P2', name: 'South Ring', from: { x: 80, y: 750 }, to: { x: 1120, y: 750 }, major: true },
  { id: 'P3', name: 'West Ring', from: { x: 50, y: 80 }, to: { x: 50, y: 720 }, major: true },
  { id: 'P4', name: 'East Ring', from: { x: 1150, y: 80 }, to: { x: 1150, y: 720 }, major: true },

  // Horizontal arteries
  { id: 'H1', name: 'Northern Ave', from: { x: 50, y: 200 }, to: { x: 1150, y: 200 }, major: true },
  { id: 'H2', name: 'Central Ave', from: { x: 50, y: 400 }, to: { x: 1150, y: 400 }, major: true },
  { id: 'H3', name: 'Southern Blvd', from: { x: 50, y: 580 }, to: { x: 1150, y: 580 }, major: true },

  // Vertical arteries
  { id: 'V1', name: 'West Main', from: { x: 200, y: 50 }, to: { x: 200, y: 750 }, major: true },
  { id: 'V2', name: 'Center Main', from: { x: 450, y: 50 }, to: { x: 450, y: 750 }, major: true },
  { id: 'V3', name: 'East Main', from: { x: 700, y: 50 }, to: { x: 700, y: 750 }, major: true },
  { id: 'V4', name: 'Far East Main', from: { x: 950, y: 50 }, to: { x: 950, y: 750 }, major: true },

  // Zone connectors (link grid interior)
  { id: 'C1', name: 'NW Connector', from: { x: 170, y: 180 }, to: { x: 170, y: 240 }, major: false },
  { id: 'C2', name: 'N Connector', from: { x: 450, y: 180 }, to: { x: 450, y: 240 }, major: false },
  { id: 'C3', name: 'NE Connector', from: { x: 730, y: 180 }, to: { x: 730, y: 240 }, major: false },
  { id: 'C4', name: 'W Mid Connector', from: { x: 170, y: 360 }, to: { x: 170, y: 420 }, major: false },
  { id: 'C5', name: 'Center Mid Connector', from: { x: 450, y: 360 }, to: { x: 450, y: 420 }, major: false },
  { id: 'C6', name: 'E Mid Connector', from: { x: 730, y: 360 }, to: { x: 730, y: 420 }, major: false },
  { id: 'C7', name: 'SW Connector', from: { x: 170, y: 540 }, to: { x: 170, y: 600 }, major: false },
  { id: 'C8', name: 'S Connector', from: { x: 450, y: 540 }, to: { x: 450, y: 600 }, major: false },
  { id: 'C9', name: 'SE Connector', from: { x: 730, y: 540 }, to: { x: 730, y: 600 }, major: false },

  // Cross-town diagonals (alternate routes)
  { id: 'D1', name: 'NW-SE Diagonal', from: { x: 200, y: 200 }, to: { x: 700, y: 580 }, major: false },
  { id: 'D2', name: 'NE-SW Diagonal', from: { x: 700, y: 200 }, to: { x: 200, y: 580 }, major: false },
  { id: 'D3', name: 'Central Diagonal', from: { x: 325, y: 290 }, to: { x: 575, y: 490 }, major: false },
  { id: 'D4', name: 'West-East Diagonal', from: { x: 200, y: 490 }, to: { x: 950, y: 290 }, major: false },

  // Far-east spur
  { id: 'S1', name: 'East Spur', from: { x: 950, y: 400 }, to: { x: 1050, y: 280 }, major: false },
  { id: 'S2', name: 'South Spur', from: { x: 450, y: 580 }, to: { x: 600, y: 680 }, major: false },

  // Additional major arteries (denser grid)
  { id: 'H4', name: 'Midtown Blvd', from: { x: 50, y: 290 }, to: { x: 1150, y: 290 }, major: true },
  { id: 'H5', name: 'Valley Rd', from: { x: 50, y: 490 }, to: { x: 1150, y: 490 }, major: true },
  { id: 'V5', name: 'Gateway Main', from: { x: 325, y: 50 }, to: { x: 325, y: 750 }, major: true },
  { id: 'V6', name: 'Union Main', from: { x: 575, y: 50 }, to: { x: 575, y: 750 }, major: true },

  // Far east & far south network
  { id: 'FE1', name: 'Far East Blvd', from: { x: 950, y: 180 }, to: { x: 1150, y: 180 }, major: true },
  { id: 'FE2', name: 'Far East South Link', from: { x: 1050, y: 180 }, to: { x: 1050, y: 580 }, major: false },
  { id: 'FE3', name: 'Harbor Connector', from: { x: 950, y: 580 }, to: { x: 1150, y: 580 }, major: false },
  { id: 'FS1', name: 'Far South Express', from: { x: 200, y: 680 }, to: { x: 950, y: 680 }, major: true },
  { id: 'FS2', name: 'South Bay Link', from: { x: 600, y: 580 }, to: { x: 600, y: 750 }, major: false },
  { id: 'FS3', name: 'Coastal Route', from: { x: 340, y: 680 }, to: { x: 840, y: 680 }, major: false },

  // Inner zone cross-links (north band)
  { id: 'C10', name: 'NW Cross', from: { x: 170, y: 120 }, to: { x: 325, y: 120 }, major: false },
  { id: 'C11', name: 'N Cross W', from: { x: 325, y: 120 }, to: { x: 450, y: 120 }, major: false },
  { id: 'C12', name: 'N Cross E', from: { x: 575, y: 120 }, to: { x: 730, y: 120 }, major: false },
  { id: 'C13', name: 'NE Cross', from: { x: 730, y: 120 }, to: { x: 950, y: 180 }, major: false },

  // Inner zone cross-links (central band)
  { id: 'C14', name: 'W Central Link', from: { x: 170, y: 300 }, to: { x: 325, y: 300 }, major: false },
  { id: 'C15', name: 'Central Plaza Link', from: { x: 325, y: 300 }, to: { x: 575, y: 300 }, major: false },
  { id: 'C16', name: 'E Central Link', from: { x: 575, y: 300 }, to: { x: 730, y: 300 }, major: false },
  { id: 'C17', name: 'Central-Far E Link', from: { x: 730, y: 300 }, to: { x: 950, y: 280 }, major: false },

  // Inner zone cross-links (south band)
  { id: 'C18', name: 'SW Cross', from: { x: 170, y: 480 }, to: { x: 325, y: 480 }, major: false },
  { id: 'C19', name: 'S Cross W', from: { x: 325, y: 480 }, to: { x: 450, y: 480 }, major: false },
  { id: 'C20', name: 'S Cross E', from: { x: 575, y: 480 }, to: { x: 730, y: 480 }, major: false },
  { id: 'C21', name: 'SE Cross', from: { x: 730, y: 480 }, to: { x: 950, y: 400 }, major: false },

  // Vertical mesh between arteries
  { id: 'C22', name: 'NW Vertical Mesh', from: { x: 325, y: 200 }, to: { x: 325, y: 290 }, major: false },
  { id: 'C23', name: 'NW-Mid Vertical', from: { x: 325, y: 290 }, to: { x: 325, y: 400 }, major: false },
  { id: 'C24', name: 'Union North Mesh', from: { x: 575, y: 200 }, to: { x: 575, y: 290 }, major: false },
  { id: 'C25', name: 'Union Mid Mesh', from: { x: 575, y: 400 }, to: { x: 575, y: 490 }, major: false },
  { id: 'C26', name: 'Union South Mesh', from: { x: 575, y: 490 }, to: { x: 575, y: 580 }, major: false },
  { id: 'C27', name: 'West Main Mesh', from: { x: 200, y: 290 }, to: { x: 200, y: 400 }, major: false },
  { id: 'C28', name: 'East Main Mesh', from: { x: 700, y: 290 }, to: { x: 700, y: 490 }, major: false },
  { id: 'C29', name: 'Far East Mesh', from: { x: 950, y: 290 }, to: { x: 950, y: 490 }, major: false },

  // Perimeter connectors
  { id: 'C30', name: 'North Gateway Ramp', from: { x: 325, y: 50 }, to: { x: 325, y: 120 }, major: false },
  { id: 'C31', name: 'South Gateway Ramp', from: { x: 575, y: 680 }, to: { x: 575, y: 750 }, major: false },
  { id: 'C32', name: 'West Industrial Loop', from: { x: 50, y: 400 }, to: { x: 170, y: 400 }, major: false },
  { id: 'C33', name: 'East Industrial Loop', from: { x: 950, y: 400 }, to: { x: 1150, y: 400 }, major: false },
];

/** Preset locations for move-resource demo */
export const MOVE_TARGETS = {
  A01: { x: 450, y: 300, zone: 'Zone Central' },
  A02: { x: 1020, y: 250, zone: 'Zone Far E' },
  A03: { x: 730, y: 500, zone: 'Zone SE' },
  A04: { x: 170, y: 500, zone: 'Zone SW' },
};

/** New emergency spawn locations for demo */
export const EMERGENCY_SPAWN_POINTS = [
  { x: 380, y: 120, zone: 'Zone N' },
  { x: 550, y: 300, zone: 'Zone Central' },
  { x: 820, y: 320, zone: 'Zone E' },
  { x: 480, y: 650, zone: 'Zone Far S' },
  { x: 1050, y: 400, zone: 'Zone Far E' },
];

/** Spawn locations when adding resources during simulation */
export const RESOURCE_SPAWN_POINTS = [
  { x: 200, y: 480, zone: 'Zone SW' },
  { x: 450, y: 120, zone: 'Zone N' },
  { x: 730, y: 300, zone: 'Zone E' },
  { x: 590, y: 680, zone: 'Zone Far S' },
  { x: 1020, y: 280, zone: 'Zone Far E' },
  { x: 170, y: 300, zone: 'Zone W' },
];

/** Zone center points for placing entities */
export const ZONE_CENTERS = {
  'Zone NW': { x: 170, y: 120, zone: 'Zone NW' },
  'Zone N': { x: 450, y: 120, zone: 'Zone N' },
  'Zone NE': { x: 730, y: 120, zone: 'Zone NE' },
  'Zone W': { x: 170, y: 300, zone: 'Zone W' },
  'Zone Central': { x: 450, y: 300, zone: 'Zone Central' },
  'Zone E': { x: 730, y: 300, zone: 'Zone E' },
  'Zone SW': { x: 170, y: 480, zone: 'Zone SW' },
  'Zone S': { x: 450, y: 480, zone: 'Zone S' },
  'Zone SE': { x: 730, y: 480, zone: 'Zone SE' },
  'Zone Far E': { x: 1020, y: 280, zone: 'Zone Far E' },
  'Zone Far S': { x: 590, y: 680, zone: 'Zone Far S' },
};
