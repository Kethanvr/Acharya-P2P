'use client';

import { useMemo, useState } from "react";

import Button from "@/components/ui/button";
import Card from "@/components/ui/card";
import { formatNumber, formatPercentage } from "@/lib/utils";
import { getDistrictMetrics, getSites } from "@/utils/data";

const DISTRICTS = getDistrictMetrics();
const SITES = getSites();

export default function InsightsPage() {
  const [prompt, setPrompt] = useState(
    "Recommend installation steps for Basavanagudi Government School",
  );
  const [aiOutput, setAiOutput] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const totalCapacityMw = useMemo(
    () => DISTRICTS.reduce((total, item) => total + item.installed_capacity_mw, 0),
    [],
  );

  const totalCo2Tons = useMemo(
    () => DISTRICTS.reduce((total, item) => total + item.co2_reduced_tons, 0),
    [],
  );

  const averagePolicyScore = useMemo(() => {
    if (DISTRICTS.length === 0) return 0;
    const sum = DISTRICTS.reduce((total, item) => total + item.policy_score, 0);
    return sum / DISTRICTS.length;
  }, []);

  const leadingDistrict = useMemo(() => {
    return [...DISTRICTS].sort((a, b) => b.renewable_index - a.renewable_index)[0];
  }, []);

  const handleAsk = async () => {
    if (!prompt.trim()) {
      setError("Enter a prompt to get guidance.");
      return;
    }
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch("/api/assistant", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt }),
      });
      const data = await response.json();
      if (!response.ok) {
        setError(data.error ?? "Unable to fetch guidance right now.");
        setAiOutput("");
      } else {
        setAiOutput(data.text || "No guidance returned for this query.");
      }
    } catch (err) {
      console.error(err);
      setError("Network issue prevented the assistant from responding.");
      setAiOutput("");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      <Card className="border-none bg-gradient-to-br from-white via-brand/5 to-white">
        <div className="grid gap-4 md:grid-cols-[1.4fr,1fr] md:items-center">
          <div className="space-y-3">
            <p className="text-xs uppercase tracking-[0.25em] text-brand-dark/70">
              Karnataka intelligence
            </p>
            <h1 className="text-3xl font-semibold text-slate-900">District insights</h1>
            <p className="text-sm text-slate-600">
              Benchmark policy momentum, carbon outcomes, and project hotspots to align the next
              tranche of investments.
            </p>
          </div>
          <div className="rounded-2xl border border-brand/15 bg-white/80 p-5 shadow-sm">
            <p className="text-sm font-medium text-brand-dark">Latest spotlight</p>
            <p className="mt-2 text-sm text-slate-600">
              {leadingDistrict?.district} leads the renewable index at{" "}
              {leadingDistrict?.renewable_index ?? "—"} with the strongest policy push in the state.
            </p>
          </div>
        </div>
      </Card>

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <Card className="border-slate-100 bg-white/90">
          <div className="text-sm text-slate-500">Leading district</div>
          <div className="mt-2 text-2xl font-semibold text-slate-900">
            {leadingDistrict?.district ?? "—"}
          </div>
          <div className="mt-1 text-xs text-slate-400">
            Renewable index {leadingDistrict?.renewable_index ?? "—"}
          </div>
        </Card>
        <Card className="border-slate-100 bg-white/90">
          <div className="text-sm text-slate-500">Installed capacity</div>
          <div className="mt-2 text-2xl font-semibold text-slate-900">
            {formatNumber(totalCapacityMw, { maximumFractionDigits: 0 })} MW
          </div>
          <div className="mt-1 text-xs text-slate-400">{SITES.length} demo sites in tracker</div>
        </Card>
        <Card className="border-slate-100 bg-white/90">
          <div className="text-sm text-slate-500">CO₂ reduced (annualised)</div>
          <div className="mt-2 text-2xl font-semibold text-emerald-600">
            {formatNumber(totalCo2Tons, { maximumFractionDigits: 0 })} tons
          </div>
          <div className="mt-1 text-xs text-slate-400">Based on current district mix</div>
        </Card>
        <Card className="border-slate-100 bg-white/90">
          <div className="text-sm text-slate-500">Policy strength</div>
          <div className="mt-2 text-2xl font-semibold text-slate-900">
            {averagePolicyScore.toFixed(0)}/100
          </div>
          <div className="mt-1 text-xs text-slate-400">Average across demo districts</div>
        </Card>
      </section>

      <Card className="border-slate-100 bg-white/90">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold text-slate-900">District renewable index</h2>
            <p className="text-xs text-slate-500">
              Higher scores signal supportive policy, grid readiness, and deployment maturity.
            </p>
          </div>
        </div>
        <div className="mt-6 overflow-x-auto">
          <table className="min-w-full table-fixed border-spacing-y-3 text-sm">
            <thead>
              <tr className="text-left text-xs uppercase tracking-wide text-slate-400">
                <th className="pb-3 pr-6">District</th>
                <th className="pb-3 pr-6">Installed capacity (MW)</th>
                <th className="pb-3 pr-6">CO₂ reduced (tons)</th>
                <th className="pb-3 pr-6">Policy score</th>
                <th className="pb-3">Renewable index</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {DISTRICTS.map((districtItem) => (
                <tr key={districtItem.district} className="text-slate-700">
                  <td className="py-3 pr-6 font-semibold text-slate-900">
                    {districtItem.district}
                  </td>
                  <td className="py-3 pr-6">
                    {formatNumber(districtItem.installed_capacity_mw, { maximumFractionDigits: 0 })}
                  </td>
                  <td className="py-3 pr-6">
                    {formatNumber(districtItem.co2_reduced_tons, { maximumFractionDigits: 0 })}
                  </td>
                  <td className="py-3 pr-6">{formatPercentage(districtItem.policy_score)}</td>
                  <td className="py-3">{formatPercentage(districtItem.renewable_index)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      <Card className="space-y-5 border-slate-100 bg-white/90">
        <div>
          <h2 className="text-lg font-semibold text-slate-900">AI assistant</h2>
          <p className="text-xs text-slate-500">
            Provide a deployment question or scenario and receive concise field guidance powered by
            our generative energy assistant.
          </p>
        </div>
        <div className="space-y-3">
          <label className="text-xs font-semibold uppercase tracking-wide text-slate-500">
            Prompt
          </label>
          <textarea
            value={prompt}
            onChange={(event) => setPrompt(event.target.value)}
            rows={3}
            className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm shadow-sm focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/40"
          />
          <div className="flex flex-wrap items-center justify-between gap-3 text-xs text-slate-500">
            <span className="max-w-md">
              Try scenarios with district names like Basavanagudi or Davangere for tailored
              guidance.
            </span>
            <Button variant="outline" onClick={handleAsk} disabled={isLoading}>
              {isLoading ? "Analyzing…" : "Ask assistant"}
            </Button>
          </div>
        </div>
        <div className="space-y-3 rounded-2xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-700">
          {error ? (
            <p className="text-sm font-medium text-amber-700">{error}</p>
          ) : null}
          {aiOutput ? (
            <div className="whitespace-pre-line">{aiOutput}</div>
          ) : (
            <span className="text-slate-500">
              Your recommendation will appear here. Add the secure API key to enable personalised
              guidance.
            </span>
          )}
        </div>
      </Card>
    </div>
  );
}

