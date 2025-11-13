'use client';

import Card from "@/components/ui/card";

const buildHighlights = [
  {
    title: "Ideation to scaffold",
    items: [
      "Mapped demo narrative in Instruction.md to align UI, telemetry, and reporting needs.",
      "Used Cursor + GPT-5 Codex to generate the Next.js App Router scaffold with Tailwind and shadcn-inspired components.",
      "Pre-loaded mock JSON datasets (sites, telemetry, districts) to keep the experience fully offline.",
    ],
  },
  {
    title: "Experience design",
    items: [
      "Applied the Poppins font, layered gradients, and shadcn-style cards for a modern control-centre aesthetic.",
      "Optimised responsive layouts across dashboard, simulator, insights, and site detail pages.",
      "Introduced polished micro-interactions (hover lifts, badges, gradients) for demo-friendly storytelling.",
    ],
  },
  {
    title: "Telemetry & analytics",
    items: [
      "Simulated live data with a lightweight Socket.IO broadcaster plus local telemetry extrapolation logic.",
      "Rendered site trends with Chart.js time-series and dynamically generated carbon ledgers.",
      "Packaged insights into exportable PDF/CSV reports to support investor-ready handouts.",
    ],
  },
  {
    title: "Intelligence layer",
    items: [
      "Secured a server-side assistant route that calls Google’s generative models via the official REST endpoint.",
      "Surfaced the guidance through an in-app assistant panel without exposing provider branding or API keys.",
      "Ensured graceful fallbacks when keys are absent so the demo remains functional in offline mode.",
    ],
  },
];

export default function HowWeBuiltPage() {
  return (
    <div className="space-y-8">
      <Card className="border-none bg-gradient-to-br from-brand/10 via-white to-white">
        <div className="space-y-3">
          <p className="text-xs uppercase tracking-[0.25em] text-brand-dark/70">Behind the build</p>
          <h1 className="text-3xl font-semibold text-slate-900">How we built Renewalytics</h1>
          <p className="text-sm text-slate-600">
            A rapid hackathon sprint powered by Cursor, GPT-5 Codex, and a focused renewable energy
            brief. Everything you see is mock-data driven, designed for live storytelling, and
            production-ready for future integrations.
          </p>
        </div>
      </Card>

      <div className="grid gap-5 md:grid-cols-2">
        {buildHighlights.map((section) => (
          <Card key={section.title} className="space-y-4 border-slate-100 bg-white/90">
            <h2 className="text-lg font-semibold text-slate-900">{section.title}</h2>
            <ul className="space-y-2 text-sm text-slate-600">
              {section.items.map((item) => (
                <li key={item} className="flex gap-3">
                  <span className="mt-1 h-[6px] w-[6px] flex-none rounded-full bg-brand-light" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </Card>
        ))}
      </div>

      <Card className="border-slate-100 bg-white/90">
        <h2 className="text-lg font-semibold text-slate-900">Tools & practices</h2>
        <div className="mt-4 grid gap-4 md:grid-cols-2">
          <div className="space-y-2 text-sm text-slate-600">
            <p className="font-medium text-slate-800">Core toolkit</p>
            <ul className="space-y-1">
              <li>• Next.js 14 App Router + TypeScript</li>
              <li>• Tailwind CSS with shadcn-inspired primitives</li>
              <li>• Chart.js & React Chart.js 2 for telemetry visualisations</li>
              <li>• Google Generative AI API (server-side routed)</li>
            </ul>
          </div>
          <div className="space-y-2 text-sm text-slate-600">
            <p className="font-medium text-slate-800">Delivery approach</p>
            <ul className="space-y-1">
              <li>• Cursor + GPT-5 Codex pair-programming for rapid component iteration</li>
              <li>• Mock-first development with local JSON fixtures</li>
              <li>• Frequent lint/build checks to keep the repo deploy-ready</li>
              <li>• Story-driven UI decisions optimised for a 3-minute stage demo</li>
            </ul>
          </div>
        </div>
      </Card>
    </div>
  );
}

