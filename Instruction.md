# Renewalytics — Instruction.md

> **Purpose:** This file contains step-by-step developer instructions to build the Renewalytics mock-data prototype using **Next.js (App Router)**, **Tailwind CSS v3**, **shadcn/ui**, and other modern libs. It's written to be fed into an AI agent or used directly by developers. It includes UI guidelines, detailed features, full mock data, local telemetry simulation, and optional Gemini integration (placeholder).

---

## Table of contents

1. Project overview
2. Prerequisites
3. Project scaffold & file structure
4. Install & setup (commands)
5. Environment variables
6. Mock data (complete files & content)
7. Key modules and components (detailed)
8. Telemetry simulator (Node script)
9. Gemini API usage (optional)
10. Running the app (dev & production)
11. Demo steps (exact actions during hackathon)
12. Exporting reports (PDF/CSV)
13. Notes on security & next steps

---

## 1. Project overview

`Renewalytics` is a mock-data, demo-first platform that simulates renewable energy sites, realtime-looking telemetry, carbon calculations, a deployment simulator, district analytics, and auto-generated PDF reports. The stack chosen is optimized for speed-of-development and presentation fidelity.

Goals for this repo:

* Fast to build with Next.js + Tailwind + shadcn.
* All data is locally mocked (JSON + in-memory) so no external DB required.
* Telemetry simulator pushes fake data to the app via WebSocket or polling.
* Simple Gemini API usage is optional (for AI recommendations); system works without it.

---

## 2. Prerequisites

* Node 18+ (recommended) / npm or pnpm
* Git
* (Optional) An OpenAI / Google Gemini API key if you want AI recommendations
* (Optional) `pnpm` installed globally: `npm i -g pnpm`

---

## 3. Project scaffold & file structure

Create the project using the structure below. Use the App Router (`app/`).

```
renewalytics/
├─ app/
│  ├─ layout.jsx
│  ├─ page.jsx
│  ├─ dashboard/page.jsx
│  ├─ sites/[id]/page.jsx
│  ├─ simulator/page.jsx
│  ├─ insights/page.jsx
│  └─ reports/page.jsx
├─ components/
│  ├─ Map.jsx
│  ├─ SiteCard.jsx
│  ├─ LiveStats.jsx
│  ├─ CarbonBadge.jsx
│  ├─ Charts/LineChart.jsx
│  └─ UI/* (shadcn wrapper components)
├─ data/
│  ├─ sites.json
│  ├─ telemetry.json
│  ├─ districts.json
│  └─ carbon_factors.json
├─ scripts/
│  └─ telemetry-sim.js
├─ utils/
│  ├─ calculateCarbon.js
│  ├─ simulateTelemetry.js
│  └─ calculateROI.js
├─ public/
│  └─ images/
├─ styles/
│  └─ globals.css
├─ package.json
├─ tailwind.config.js
├─ next.config.js
└─ README.md
```

---

## 4. Install & setup (commands)

Run these commands to scaffold and install dependencies.

1. Create Next.js app:

```bash
pnpm create next-app@latest renewalytics -- --experimental-app
cd renewalytics
```

2. Install dependencies (recommended libs):

```bash
pnpm add react react-dom next
pnpm add -D tailwindcss@latest postcss autoprefixer
pnpm add @radix-ui/react-icons @headlessui/react
pnpm add shadcn-ui @tailwindcss/forms @tailwindcss/typography
pnpm add leaflet react-leaflet chart.js react-chartjs-2 socket.io socket.io-client
pnpm add html2canvas jspdf react-pdf
pnpm add axios dayjs
```

> Note: replace `pnpm` with `npm` if you prefer `npm install`.

3. Initialize Tailwind:

```bash
npx tailwindcss init -p
```

This creates `tailwind.config.js` and `postcss.config.js`.

4. Install shadcn UI (if you want their components) — follow the shadcn setup docs. Minimal example:

```bash
pnpm add @ui/shadcn
# or run the shadcn setup script if using their generator
```

---

## 5. Environment variables

Create a `.env.local` file in the repo root. Add the following placeholders:

```
# .env.local
NEXT_PUBLIC_SITE_TITLE="Renewalytics"
NEXT_PUBLIC_TELEMETRY_WS_URL="ws://localhost:4000"  # used by telemetry-sim if using WebSocket
GEMINI_API_KEY="YOUR_GEMINI_API_KEY_OR_OPENAI_KEY"   # optional - only for AI recommendations
NODE_ENV=development
```

**Important:** Never commit real API keys. Use GitHub secrets or other vaults for production.

---

## 6. Mock data (full files)

Place these files under `data/`.

### `data/sites.json`

```json
[
  {
    "id": "site_001",
    "name": "Basavanagudi Government School",
    "lat": 12.9372,
    "lon": 77.5806,
    "type": "solar",
    "capacity_kw": 15,
    "owner": "Govt School",
    "district": "Bangalore Urban",
    "installation_date": "2025-01-15"
  },
  {
    "id": "site_002",
    "name": "Davangere Village Pump",
    "lat": 14.4667,
    "lon": 75.9167,
    "type": "solar",
    "capacity_kw": 5,
    "owner": "Panchayat",
    "district": "Davangere",
    "installation_date": "2024-11-01"
  },
  {
    "id": "site_003",
    "name": "Tumkur Micro Shop Microgrid",
    "lat": 13.34,
    "lon": 77.10,
    "type": "hybrid",
    "capacity_kw": 7,
    "owner": "SME",
    "district": "Tumkur",
    "installation_date": "2025-03-10"
  }
]
```

---

### `data/telemetry.json`

Small seed of time-series for the last hour for each site. Use the telemetry simulator to extend this.

```json
{
  "site_001": [
    {"timestamp":"2025-11-13T08:00:00Z","power_kw":0.8,"battery_pct":95},
    {"timestamp":"2025-11-13T08:05:00Z","power_kw":1.2,"battery_pct":94},
    {"timestamp":"2025-11-13T08:10:00Z","power_kw":2.8,"battery_pct":93}
  ],
  "site_002": [
    {"timestamp":"2025-11-13T08:00:00Z","power_kw":0.3,"battery_pct":88},
    {"timestamp":"2025-11-13T08:05:00Z","power_kw":0.5,"battery_pct":87},
    {"timestamp":"2025-11-13T08:10:00Z","power_kw":0.7,"battery_pct":86}
  ],
  "site_003": [
    {"timestamp":"2025-11-13T08:00:00Z","power_kw":0.6,"battery_pct":60},
    {"timestamp":"2025-11-13T08:05:00Z","power_kw":1.1,"battery_pct":59},
    {"timestamp":"2025-11-13T08:10:00Z","power_kw":1.5,"battery_pct":58}
  ]
}
```

---

### `data/districts.json`

```json
[
  {"district":"Bangalore Urban","installed_capacity_mw":823,"co2_reduced_tons":2500,"policy_score":92,"renewable_index":89},
  {"district":"Tumkur","installed_capacity_mw":450,"co2_reduced_tons":1800,"policy_score":81,"renewable_index":78},
  {"district":"Davangere","installed_capacity_mw":220,"co2_reduced_tons":940,"policy_score":70,"renewable_index":66}
]
```

---

### `data/carbon_factors.json`

```json
{
  "india_avg_grid_factor": 0.82,
  "solar_factor": 0.05,
  "wind_factor": 0.03
}
```

---

## 7. Key modules and components (detailed)

Below are the important UI and logic components with example code snippets and responsibilities.

### 7.1 `utils/calculateCarbon.js`

```js
// Returns kg CO2 avoided for given energy in kWh
export function co2Avoided(energy_kwh, factor = 0.82) {
  return Number((energy_kwh * factor).toFixed(3));
}

// Simple conversion util used across the app
export function kwToKwh(power_kw, minutes = 60) {
  return (power_kw * (minutes / 60));
}
```

### 7.2 `utils/calculateROI.js`

```js
export function calculateROI({capex, subsidy_pct=0, annual_energy_kwh, tariff=0.07, opex_pct=0.02}){
  const net_capex = capex * (1 - subsidy_pct/100);
  const annual_saving = annual_energy_kwh * tariff;
  const annual_opex = net_capex * opex_pct;
  const net_annual_benefit = annual_saving - annual_opex;
  const payback_years = net_capex / net_annual_benefit;
  return { net_capex, annual_saving, annual_opex, net_annual_benefit, payback_years };
}
```

### 7.3 `components/LiveStats.jsx`

Responsibilities: display current power, battery %, CO2 avoided counter, small sparkline.

```jsx
import React from 'react';

export default function LiveStats({ power_kw, battery_pct, co2_today }){
  return (
    <div className="p-4 bg-white rounded-lg shadow-sm">
      <div className="text-sm text-gray-500">Live Generation</div>
      <div className="text-2xl font-semibold">{power_kw} kW</div>
      <div className="mt-2">Battery: {battery_pct}%</div>
      <div className="mt-2 text-green-600">CO₂ avoided today: {co2_today} kg</div>
    </div>
  );
}
```

### 7.4 `components/Map.jsx`

Use `react-leaflet` to show site pins and let users click to open site detail.

Key props: `sites[]`, `onSiteClick(id)`.

### 7.5 `components/Charts/LineChart.jsx`

Use `react-chartjs-2` to render timeseries of power_kW / energy.

### 7.6 `pages` / `app` pages (high-level)

* `app/dashboard/page.jsx` - loads `data/sites.json` and `data/telemetry.json` then renders Map, LiveCards, and DRI.
* `app/sites/[id]/page.jsx` - renders Site detail, LiveStats, LineChart, Carbon ledger, Export PDF button.
* `app/simulator/page.jsx` - UI to choose district, capacity, inputs; calls `calculateROI` and `co2Avoided` to show results.
* `app/insights/page.jsx` - loads districts.json and shows comparisons, plus an AI Assistant box.
* `app/reports/page.jsx` - list of PDFs you can generate and download.

### 7.7 UI (shadcn + Tailwind)

* Use shadcn for standard Card, Button, Input components. Wrap their components inside `components/UI/*` to maintain consistency.
* Keep spacing consistent and accessible (p-4, rounded-2xl, shadow-sm) and prefer a 2-column grid for dashboard.

---

## 8. Telemetry simulator (Node script)

Place under `scripts/telemetry-sim.js`. This script will simulate telemetry pushes via WebSocket or simple HTTP polling.

**WebSocket example** (quick & demo-friendly):

```js
// scripts/telemetry-sim.js
const io = require('socket.io-client');
const fs = require('fs');
const path = require('path');

const WS_URL = process.env.NEXT_PUBLIC_TELEMETRY_WS_URL || 'ws://localhost:4000';
const socket = io(WS_URL);

const sites = require('../data/sites.json');

function rand(min, max){ return Math.random() * (max-min) + min; }

socket.on('connect', () => {
  console.log('Telemetry sim connected');
  setInterval(() => {
    sites.forEach(site => {
      const payload = {
        siteId: site.id,
        timestamp: new Date().toISOString(),
        power_kw: Number((rand(0.2, site.capacity_kw)).toFixed(3)),
        battery_pct: Math.min(100, Math.max(0, Math.round(rand(30,100))))
      };
      socket.emit('telemetry', payload);
      console.log('sent', payload);
    });
  }, 3000);
});

socket.on('disconnect', ()=> console.log('sim disconnected'));
```

**Server note:** If you don't want to run a WebSocket server, create a lightweight Express server inside `server/sim-server.js` that accepts telemetry POSTs and forwards to in-memory store.

Run simulator:

```bash
node scripts/telemetry-sim.js
```

---

## 9. Gemini API usage (optional)

This section is optional — your app functions without it. Use this only for the AI Recommendation assistant.

**Note:** `GEMINI_API_KEY` may be a Google or OpenAI-style key depending on provider. Use provider SDK or `fetch` to their REST endpoint.

**Simple example (pseudo code):**

```js
// utils/aiRecommend.js
export async function aiRecommend(prompt){
  const key = process.env.GEMINI_API_KEY;
  if(!key) return { text: 'No API key configured. Use mock suggestions.' };

  const res = await fetch('https://api.gemini.example/v1/generate', {
    method: 'POST',
    headers: { 'Authorization': `Bearer ${key}`, 'Content-Type':'application/json' },
    body: JSON.stringify({ prompt, max_tokens: 250 })
  });
  const data = await res.json();
  return data;
}
```

**Suggested prompts:**

* "Recommend a 15 kW rooftop solar configuration for Basavanagudi Government School considering local irradiation and 15% subsidies."
* "Short installer action plan (5 bullets) for a 5 kW village pump solar install."

If no key is provided, return a deterministic mock response from a local `mocks/ai_responses.json`.

---

## 10. Running the app (dev & production)

**Dev:**

```bash
# dev server
pnpm dev
# run telemetry sim (optional)
node scripts/telemetry-sim.js
```

Open `http://localhost:3000`.

**Production build:**

```bash
pnpm build
pnpm start
```

---

## 11. Demo steps (exact actions during hackathon)

Use this exact sequence on stage. Time yourself.

**Before the demo**: Start the Next.js dev server and the telemetry simulator. Open Chrome and load `http://localhost:3000`.

**0:00–0:10** (Speaker 1) — Title + Problem (spoken, no navigation)

**0:10–0:40** (Speaker 2) — Dashboard view:

* Open Dashboard (already loaded) so map & live cards are visible.
* Point to the big `CO₂ avoided` counter.
* Click a site pin or site card (open `Basavanagudi Government School`).

**0:40–1:20** (Speaker 2 continues) — Site detail:

* Show Live Stats (power_kW, battery_pct, CO₂ today). Highlight that numbers update every 2–3s.
* Open the Carbon Ledger table (show last 5 entries). Click "Export PDF" and show the generated PDF preview (or saved file).

**1:20–2:00** (Speaker 3) — Simulator + ROI:

* Open Simulator page.
* Select district "Davangere", capacity 5 kW, apply 20% subsidy.
* Show predicted annual generation, CO₂ avoided, and payback years (values from `calculateROI`).
* Click "Add to Deployment Plan" — show plan contains the new site.

**2:00–2:40** (Speaker 3) — Insights & AI:

* Open Insights page, show District Renewable Index.
* Ask AI Assistant: "Recommend installation steps for Basavanagudi school" — show AI response (mock if no key).

**2:40–3:00** (All) — Closing:

* Quick recap: plan → deploy → track → report.
* Show Github repo and contact.

---

## 12. Exporting reports (PDF/CSV)

**PDF**: Use `html2canvas` + `jspdf` for quick client-side export, or `react-pdf` for server-side accurate PDFs.

Example client function:

```js
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

export async function exportElementToPDF(id, filename='report.pdf'){
  const el = document.getElementById(id);
  const canvas = await html2canvas(el);
  const imgData = canvas.toDataURL('image/png');
  const pdf = new jsPDF('p','mm','a4');
  const imgProps=pdf.getImageProperties(imgData);
  const pdfWidth=210; // a4 width
  const pdfHeight=(imgProps.height*pdfWidth)/imgProps.width;
  pdf.addImage(imgData,'PNG',0,0,pdfWidth,pdfHeight);
  pdf.save(filename);
}
```

**CSV**: Create csv strings from ledger arrays and trigger a download with a blob.

---

## 13. Notes on security & next steps

* **Never** commit keys. Use `.gitignore` for `.env.local`.
* Mock-data mode is for demo/proof-of-concept only. For production, move to a real DB (Supabase/Postgres). Add authentication & RBAC.
* If integrating real IoT: use MQTT broker + TLS + device auth.
* For carbon accounting compliance, support configurable emission factors per state & add verifiable signatures for ledger entries.
* Consider adding a lightweight API server (Express or Supabase Edge Functions) for ingestion & authentication.

---

## Appendix — Quick paste-ready snippets

**Tailwind config (tailwind.config.js)**

```js
module.exports = {
  content: ["./app/**/*.{js,jsx,ts,tsx}", "./components/**/*.{js,jsx,ts,tsx}"],
  theme: { extend: {} },
  plugins: [require('@tailwindcss/forms'), require('@tailwindcss/typography')],
}
```

**globals.css**

```css
@tailwind base;
@tailwind components;
@tailwind utilities;

html,body,#root{ height:100%; }
body{ background-color: #f7fafc; }
```

**Next.js app router example (app/layout.jsx)**

```jsx
import './styles/globals.css'
export default function RootLayout({ children }){
  return (
    <html>
      <head />
      <body>
        <div className="min-h-screen bg-gray-50">
          <header className="p-4 bg-white shadow-sm">Renewalytics</header>
          <main className="p-6">{children}</main>
        </div>
      </body>
    </html>
  )
}
```

---

## Final words to the AI agent that will use this file

* Use the mock JSON files in `/data` for all reads. Do not call external APIs unless explicitly configured (Gemini key provided).
* Make telemetry data update in the UI at least every 2–5 seconds (simulate with setInterval + socket or polling) so the demo feels "live".
* Keep UI minimal and high-contrast: large CO₂ counter, clear green/red indicators, and easy-to-read charts.
* Keep the carbon formula visible in the UI/Report: `CO2_kg = energy_kwh * emission_factor_kgCO2_per_kWh` and expose the emission factor for transparency.

---

If you want, I can now:

* Generate the exact `telemetry-sim.js` server & client code with a tiny websocket server.
* Produce full Next.js page code for `dashboard`, `sites/[id]`, and `simulator`.
* Create the Canva-ready images and icons suggestions.

Tell me which code file you want next and I'll drop the full content.
