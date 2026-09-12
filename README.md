# LIFELINE

**Real-time optimization for emergency response.**

LIFELINE is a hackathon prototype for emergency resource allocation. It helps decision-makers assign limited resources (ambulances, fire trucks, rescue teams, etc.) across multiple competing emergencies using global optimization — not just nearest-first assignment.

> All data, coordinates, travel times, and severity weights are **simulated demonstration values**, not real EMS protocols.

## Features

- Generic resource / emergency / facility data models
- **Nearest-First** baseline strategy
- **LIFELINE Optimized** global allocation strategy
- Command-center dashboard with simulated city map
- Live metrics and baseline comparison
- Dynamic simulation controls (block route, disable resource, escalate emergency, etc.)

## Run locally

```bash
npm install
npm run dev
```

## Build

```bash
npm run build
npm run preview
```

## Tech stack

- React + Vite
- JavaScript
- lucide-react
