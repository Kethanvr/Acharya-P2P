<div align="center">

# Renewalytics

Live renewable-energy intelligence for districts, sites, and planners — built at hackathon speed with human + AI co-creation.

</div>

---

## Brief Project Description

Renewalytics is a demo-first platform that reimagines how local governments and installers plan, simulate, and monitor renewable deployments. With mock yet realistic telemetry, carbon accounting, ROI simulations, and exportable insights, the experience shows how districts can go from plan → deploy → track → report in minutes.

---

## Why We Built It

- **Close the insight gap** between national clean-energy targets and on-the-ground execution.
- **Give non-technical decision makers** a live command centre with carbon, capacity, and battery health signals.
- **Showcase AI-assisted planning** that recommends actions for each site or district.
- **Prove that AI + human workflows** can deliver production-quality tools within hackathon timelines.

---

## Key Features

- ⚡ **Interactive dashboard** with live-looking telemetry, carbon counters, battery levels, and a Leaflet site map.
- 🛰️ **Site detail drill-downs** featuring real-time charts, carbon ledgers, and one-click PDF exports.
- 🧮 **Deployment simulator** for district-level ROI, subsidies, and carbon savings with a persistent plan builder.
- 📊 **District insights** highlighting policy scores, renewable indices, and AI-powered guidance.
- 📑 **Reports workspace** that packages telemetry and district metrics into ready-to-share PDF/CSV handouts.
- 🧠 **Generative assistant** (secured server route) delivering tailored playbooks once the API key is configured.
- 🔌 **Telemetry simulator** pumping realistic readings every few seconds for a live demo feel.

---

## ⭐ How We Built This Project Using AI — The Full Development Story

This project was created with a hybrid workflow of human creativity and AI-assisted development. AI acted as a teammate across the entire lifecycle — from idea discovery through deployment.

### 1. Idea Discovery & Problem Understanding — _AI as Research Partner_

- Broke down the broad challenge into renewable adoption barriers, carbon tracking gaps, and execution issues.
- Explored solution angles with ChatGPT, converging on a renewable simulation + carbon insights platform.

### 2. Feature Planning & User Flow Design — _AI as Product Manager_

- Brainstormed features, designed the dashboard → site → simulator → insights → reports journey, and scoped a hackathon-ready roadmap.

### 3. Technical Architecture & Stack Decisions — _AI as Tech Architect_

- Selected Next.js App Router, Tailwind, shadcn-inspired components, mock JSON datasets, Node telemetry simulator, and optional LLM integrations.
- Generated folder structure, utilities, and integration approach.

### 4. Coding & UI Development — _AI as Co-developer_

- Generated component skeletons (cards, charts, live stats, map), utilities (ROI, CO₂), mock data, polished shadcn/Tailwind layouts, and PDF export helpers.
- Accelerated implementation from days to hours.

### 5. Telemetry Simulation — _AI as Data Engineer_

- Designed a Socket.IO-based simulator producing realistic solar output and battery drift to keep the UI “live”.

### 6. AI Recommendation System — _AI Powering AI_

- Implemented a prompt-driven assistant with secure server routing to Google’s generative models, plus graceful fallbacks.

### 7. Documentation & Pitch Collateral — _AI as Writer & Designer_

- Authored Instruction.md, carbon formulas, architecture notes, pitch outline, and presentation copy with AI assistance.

### 8. Deployment & Testing — _AI as DevOps Assistant_

- Received guidance on environment variables, build troubleshooting, Vercel deployment, and SSR optimisations.

**End Result:** We delivered a complete, professional-grade MVP within hackathon constraints. AI served as researcher, architect, developer, designer, QA, and documentation writer — enabling the human team to focus on vision and decision-making.

---

## Tech Stack at a Glance

- **Frontend & Routing:** Next.js App Router, TypeScript
- **Styling:** Tailwind CSS v3, shadcn-inspired UI primitives, Google Poppins font
- **Visualisations:** Chart.js + React Chart.js 2, Leaflet map
- **Data:** Local JSON fixtures, deterministic telemetry simulator
- **AI Layer:** Google Generative Language API (server-side)
- **Reporting:** html2canvas + jsPDF for PDFs, CSV builders for exports




## What’s Next

- Hook the telemetry simulator to real IoT feeds.
- Add authentication and role-based dashboards for district officials vs. installers.
- Extend the AI assistant with deployment playbooks, BOM estimations, and policy alerts.
- Integrate persistent storage (e.g., Supabase/Postgres) for reports and simulated plans.

---

**Renewalytics** proves that with AI copilots, small teams can build ambitious climate-tech tools faster than ever. Let’s keep amplifying human impact with responsible AI.
