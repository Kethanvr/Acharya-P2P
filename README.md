# Renewalytics

Renewalytics is a hackathon project exploring how a dashboard can help planners compare renewable-energy sites and deployment scenarios.

The application is built with Next.js and includes dashboard, site, simulation, insight, and report areas. A small telemetry simulator supplies the demo with sample readings; those readings should not be treated as live infrastructure data.

## Run locally

Requirements: Node.js and Bun (the repository includes `bun.lock`).

```bash
bun install
bun run dev
```

Open `http://localhost:3000`. The project may require environment configuration for services used by the application; use the repository's example configuration and keep real credentials out of Git.

## Repository notes

- `app/` contains the Next.js routes.
- `components/` and `lib/` contain shared interface and utility code.
- `scripts/telemetry-sim.js` provides demo telemetry.
- `docs/` contains supporting project material.

Renewable outputs and financial comparisons are simulations for a prototype, not engineering or investment advice.
