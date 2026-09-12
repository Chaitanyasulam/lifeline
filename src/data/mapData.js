/** Simulated city map layout — NOT real geography */

export const MAP_WIDTH = 900;
export const MAP_HEIGHT = 550;

export const ZONES = [
  { id: 'Z1', label: 'Zone 1', x: 50, y: 320, w: 200, h: 200 },
  { id: 'Z2', label: 'Zone 2', x: 350, y: 30, w: 200, h: 180 },
  { id: 'Z3', label: 'Zone 3', x: 350, y: 320, w: 200, h: 200 },
  { id: 'Z4', label: 'Zone 4', x: 600, y: 180, w: 120, h: 120 },
  { id: 'Z5', label: 'Zone 5', x: 650, y: 320, w: 200, h: 200 },
  { id: 'Z6', label: 'Zone 6', x: 750, y: 470, w: 120, h: 60 },
];

/** Major road segments used for routing and block-route demo */
export const ROADS = [
  {
    id: 'R1',
    name: 'Central Ave',
    from: { x: 80, y: 400 },
    to: { x: 820, y: 400 },
    major: true,
  },
  {
    id: 'R2',
    name: 'North-South Main',
    from: { x: 450, y: 60 },
    to: { x: 450, y: 520 },
    major: true,
  },
  {
    id: 'R3',
    name: 'West Connector',
    from: { x: 150, y: 400 },
    to: { x: 150, y: 500 },
    major: false,
  },
  {
    id: 'R4',
    name: 'East Connector',
    from: { x: 750, y: 400 },
    to: { x: 800, y: 500 },
    major: false,
  },
];

/** Preset locations for move-resource demo */
export const MOVE_TARGETS = {
  A01: { x: 450, y: 450, zone: 'Zone 3' },
  A02: { x: 450, y: 200, zone: 'Zone 2' },
  A03: { x: 700, y: 350, zone: 'Zone 5' },
};

/** New emergency spawn locations for demo */
export const EMERGENCY_SPAWN_POINTS = [
  { x: 380, y: 250, zone: 'Zone 2' },
  { x: 550, y: 480, zone: 'Zone 3' },
  { x: 620, y: 200, zone: 'Zone 4' },
];
