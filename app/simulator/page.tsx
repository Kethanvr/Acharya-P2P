'use client';

import { useMemo, useState } from "react";

import Button from "@/components/ui/button";
import Card from "@/components/ui/card";
import Input from "@/components/ui/input";
import { formatNumber } from "@/lib/utils";
import { co2Avoided } from "@/utils/calculateCarbon";
import { calculateROI } from "@/utils/calculateROI";
import { getCarbonFactors, getDistrictMetrics } from "@/utils/data";
import type { DeploymentPlanItem } from "@/types";

const SUN_HOURS_PER_DAY = 4.5;
const PERFORMANCE_RATIO = 0.74;
const CAPEX_PER_KW = 52000; // INR estimate per kW for rooftop solar

const DISTRICTS = getDistrictMetrics();
const CARBON = getCarbonFactors();

export default function SimulatorPage() {
  const [district, setDistrict] = useState(DISTRICTS[0]?.district ?? "");
  const [capacityKw, setCapacityKw] = useState(5);
  const [subsidyPct, setSubsidyPct] = useState(0);
  const [deploymentPlan, setDeploymentPlan] = useState<DeploymentPlanItem[]>([]);

  const annualEnergyKwh = useMemo(() => {
    if (capacityKw <= 0) return 0;
    return capacityKw * SUN_HOURS_PER_DAY * 365 * PERFORMANCE_RATIO;
  }, [capacityKw]);

  const capex = useMemo(() => Math.max(0, capacityKw * CAPEX_PER_KW), [capacityKw]);

  const roi = useMemo(
    () =>
      calculateROI({
        capex,
        subsidy_pct: subsidyPct,
        annual_energy_kwh: annualEnergyKwh,
        tariff: 0.07,
        opex_pct: 0.02,
      }),
    [capex, subsidyPct, annualEnergyKwh],
  );

  const annualCo2Kg = useMemo(
    () => co2Avoided(annualEnergyKwh, CARBON.india_avg_grid_factor),
    [annualEnergyKwh],
  );

  const handleAddToPlan = () => {
    if (!district || capacityKw <= 0) {
      return;
    }

    const entry: DeploymentPlanItem = {
      id: `plan-${Date.now()}`,
      district,
      capacity_kw: Number(capacityKw.toFixed(1)),
      subsidy_pct: Number(subsidyPct.toFixed(0)),
      annual_energy_kwh: Number(annualEnergyKwh.toFixed(0)),
      co2_avoided_kg: Number(annualCo2Kg.toFixed(1)),
      payback_years: roi.payback_years,
    };

    setDeploymentPlan((prev) => [entry, ...prev]);
  };

  return (
    <div className="space-y-8">
      <div className="space-y-2">
        <h1 className="text-3xl font-semibold text-slate-900">Project simulator</h1>
        <p className="text-sm text-slate-500">
          Model a quick deployment, estimate carbon savings, and build a plan for district rollout.
        </p>
      </div>

      <Card className="space-y-6">
        <div>
          <h2 className="text-lg font-semibold text-slate-900">Inputs</h2>
          <p className="text-xs text-slate-500">
            Adjust capacity and subsidies. We assume {SUN_HOURS_PER_DAY} peak sun hours and{" "}
            {Math.round(PERFORMANCE_RATIO * 100)}% performance ratio.
          </p>
        </div>

        <div className="grid gap-5 md:grid-cols-2">
          <label className="space-y-2 text-sm font-medium text-slate-600">
            District
            <select
              value={district}
              onChange={(event) => setDistrict(event.target.value)}
              className="block w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm shadow-sm focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/40"
            >
              {DISTRICTS.map((item) => (
                <option key={item.district} value={item.district}>
                  {item.district}
                </option>
              ))}
            </select>
          </label>

          <label className="space-y-2 text-sm font-medium text-slate-600">
            Capacity (kW)
            <Input
              type="number"
              min={1}
              step="0.5"
              value={capacityKw}
              onChange={(event) => setCapacityKw(Number(event.target.value) || 0)}
            />
          </label>

          <label className="space-y-2 text-sm font-medium text-slate-600">
            Subsidy (%)
            <Input
              type="number"
              min={0}
              max={100}
              value={subsidyPct}
              onChange={(event) => {
                const value = Math.min(100, Math.max(0, Number(event.target.value) || 0));
                setSubsidyPct(value);
              }}
            />
          </label>

          <label className="space-y-2 text-sm font-medium text-slate-600">
            Tariff (USD / kWh)
            <Input value="0.07" readOnly disabled />
          </label>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="space-y-1 text-sm">
            <div className="font-medium text-slate-700">
              Estimated CAPEX: ₹{formatNumber(capex, { maximumFractionDigits: 0 })}
            </div>
            <div className="text-xs text-slate-500">
              Subsidy applied: {formatNumber(subsidyPct, { maximumFractionDigits: 0 })}%
            </div>
          </div>
          <Button onClick={handleAddToPlan}>Add to deployment plan</Button>
        </div>
      </Card>

      <section className="grid gap-4 md:grid-cols-3">
        <Card>
          <div className="text-sm text-slate-500">Annual generation</div>
          <div className="mt-2 text-2xl font-semibold text-slate-900">
            {formatNumber(annualEnergyKwh, { maximumFractionDigits: 0 })} kWh
          </div>
          <div className="mt-1 text-xs text-slate-400">Based on capacity and irradiance</div>
        </Card>
        <Card>
          <div className="text-sm text-slate-500">CO₂ avoided (annual)</div>
          <div className="mt-2 text-2xl font-semibold text-emerald-600">
            {formatNumber(annualCo2Kg, { maximumFractionDigits: 1 })} kg
          </div>
          <div className="mt-1 text-xs text-slate-400">
            Factor {CARBON.india_avg_grid_factor.toFixed(2)} kg/kWh
          </div>
        </Card>
        <Card>
          <div className="text-sm text-slate-500">Payback period</div>
          <div className="mt-2 text-2xl font-semibold text-slate-900">
            {Number.isFinite(roi.payback_years) ? `${roi.payback_years} years` : "—"}
          </div>
          <div className="mt-1 text-xs text-slate-400">
            Net benefit ₹{formatNumber(roi.net_annual_benefit, { maximumFractionDigits: 0 })}
            /yr
          </div>
        </Card>
      </section>

      <Card className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold text-slate-900">Deployment plan</h2>
            <p className="text-xs text-slate-500">Capture promising scenarios for the stage demo.</p>
          </div>
        </div>

        {deploymentPlan.length === 0 ? (
          <div className="rounded-xl border border-dashed border-slate-200 bg-slate-50 px-4 py-10 text-center text-sm text-slate-500">
            No scenarios yet. Fill in the form and click &ldquo;Add to deployment plan&rdquo; to see
            your plan here.
          </div>
        ) : (
          <div className="space-y-3">
            {deploymentPlan.map((item) => (
              <div
                key={item.id}
                className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-slate-200 bg-white/80 p-4 shadow-sm"
              >
                <div>
                  <div className="text-sm font-semibold text-slate-900">
                    {item.district} · {item.capacity_kw} kW
                  </div>
                  <div className="text-xs text-slate-500">
                    Subsidy {item.subsidy_pct}% · Payback{" "}
                    {Number.isFinite(item.payback_years) ? `${item.payback_years} yrs` : "n/a"}
                  </div>
                </div>
                <div className="text-right text-xs text-slate-500">
                  <div className="font-medium text-slate-700">
                    {formatNumber(item.annual_energy_kwh, { maximumFractionDigits: 0 })} kWh/yr
                  </div>
                  <div className="text-emerald-600">
                    {formatNumber(item.co2_avoided_kg, { maximumFractionDigits: 1 })} kg CO₂
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>
    </div>
  );
}

