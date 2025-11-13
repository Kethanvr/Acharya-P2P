'use client';

import { useCallback } from "react";
import dayjs from "dayjs";

import Button from "@/components/ui/button";
import Card from "@/components/ui/card";
import { formatNumber, formatPercentage } from "@/lib/utils";
import { co2Avoided, kwToKwh } from "@/utils/calculateCarbon";
import { getCarbonFactors, getDistrictMetrics, getSites, getTelemetry } from "@/utils/data";
import { exportElementToPDF } from "@/utils/exportElementToPDF";
import type { TelemetryDataset } from "@/types";

const DISTRICTS = getDistrictMetrics();
const SITES = getSites();
const TELEMETRY = getTelemetry() as TelemetryDataset;
const CARBON = getCarbonFactors();
const SAMPLE_INTERVAL_MINUTES = 5;

function downloadCsv(filename: string, rows: Array<Array<string | number>>) {
  if (typeof window === "undefined") return;

  const csv = rows
    .map((row) =>
      row
        .map((value) => {
          const stringValue = `${value}`;
          const escaped = stringValue.replace(/"/g, '""');
          return `"${escaped}"`;
        })
        .join(","),
    )
    .join("\n");

  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.setAttribute("href", url);
  link.setAttribute("download", filename);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  window.URL.revokeObjectURL(url);
}

export default function ReportsPage() {
  const handleExportPdf = useCallback(() => {
    exportElementToPDF("reports-capture", "renewalytics-summary.pdf");
  }, []);

  const handleExportCsv = useCallback(() => {
    const header = [
      "District",
      "Installed Capacity (MW)",
      "CO2 Reduced (tons)",
      "Policy Score",
      "Renewable Index",
    ];
    const rows = DISTRICTS.map((district) => [
      district.district,
      district.installed_capacity_mw,
      district.co2_reduced_tons,
      district.policy_score,
      district.renewable_index,
    ]);
    downloadCsv("renewalytics-district-summary.csv", [header, ...rows]);
  }, []);

  const districtTotals = DISTRICTS.reduce(
    (acc, item) => {
      acc.capacityMw += item.installed_capacity_mw;
      acc.co2Tons += item.co2_reduced_tons;
      acc.policy += item.policy_score;
      acc.index += item.renewable_index;
      return acc;
    },
    { capacityMw: 0, co2Tons: 0, policy: 0, index: 0 },
  );

  const startOfDay = dayjs().startOf("day");

  const siteSnapshots = SITES.map((site) => {
    const series = TELEMETRY[site.id] ?? [];
    const latest = series[series.length - 1];
    const todaysSeries = series.filter((point) => !dayjs(point.timestamp).isBefore(startOfDay));
    const energy = todaysSeries.reduce(
      (total, point) => total + kwToKwh(point.power_kw, SAMPLE_INTERVAL_MINUTES),
      0,
    );
    const emissionFactor =
      CARBON[`${site.type}_factor` as keyof typeof CARBON] ?? CARBON.india_avg_grid_factor;
    const co2Kg = co2Avoided(energy, emissionFactor);

    return {
      site,
      latest,
      energy,
      co2Kg,
    };
  });

  return (
    <div className="space-y-8">
      <Card className="border-none bg-gradient-to-br from-brand/10 via-white to-white">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="space-y-3">
            <p className="text-xs uppercase tracking-[0.25em] text-brand-dark/70">
              Demo-ready reporting
            </p>
            <h1 className="text-3xl font-semibold text-slate-900">Reports & exports</h1>
            <p className="text-sm text-slate-600">
              Package outcomes into shareable PDFs or CSVs and keep stakeholders aligned on
              deployment momentum.
            </p>
          </div>
          <div className="rounded-2xl border border-brand/15 bg-white/80 p-4 text-xs text-slate-500 shadow-sm">
            Includes live telemetry rollups and district analytics snapshots captured at the time of
            export.
          </div>
        </div>
      </Card>

      <div className="flex flex-wrap items-center justify-end gap-3">
        <Button variant="outline" onClick={handleExportCsv}>
          Export CSV
        </Button>
        <Button onClick={handleExportPdf}>Export PDF</Button>
      </div>

      <div id="reports-capture" className="space-y-6">
        <Card className="border-slate-100 bg-white/90">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold text-slate-900">District snapshot</h2>
              <p className="text-xs text-slate-500">
                Consolidated totals from the mock dataset. Values auto-update with telemetry.
              </p>
            </div>
            <div className="text-right text-xs text-slate-500">
              <div className="font-medium text-slate-900">
                {formatNumber(districtTotals.capacityMw, { maximumFractionDigits: 0 })} MW installed
              </div>
              <div>{formatNumber(districtTotals.co2Tons, { maximumFractionDigits: 0 })} tons CO₂</div>
            </div>
          </div>
          <div className="mt-5 overflow-x-auto">
            <table className="min-w-full table-fixed border-spacing-y-3 text-sm">
              <thead>
                <tr className="text-left text-xs uppercase tracking-wide text-slate-400">
                  <th className="pb-3 pr-6">District</th>
                  <th className="pb-3 pr-6">Capacity (MW)</th>
                  <th className="pb-3 pr-6">CO₂ reduced (tons)</th>
                  <th className="pb-3 pr-6">Policy</th>
                  <th className="pb-3">Renewable index</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {DISTRICTS.map((district) => (
                  <tr key={district.district} className="text-slate-700">
                    <td className="py-3 pr-6 font-semibold text-slate-900">{district.district}</td>
                    <td className="py-3 pr-6">
                      {formatNumber(district.installed_capacity_mw, { maximumFractionDigits: 0 })}
                    </td>
                    <td className="py-3 pr-6">
                      {formatNumber(district.co2_reduced_tons, { maximumFractionDigits: 0 })}
                    </td>
                    <td className="py-3 pr-6">{formatPercentage(district.policy_score)}</td>
                    <td className="py-3">{formatPercentage(district.renewable_index)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>

        <Card className="border-slate-100 bg-white/90">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold text-slate-900">Site performance summary</h2>
              <p className="text-xs text-slate-500">
                Latest telemetry reading per site with total energy & carbon conversion.
              </p>
            </div>
          </div>
          <div className="mt-5 overflow-x-auto">
            <table className="min-w-full table-fixed border-spacing-y-3 text-sm">
              <thead>
                <tr className="text-left text-xs uppercase tracking-wide text-slate-400">
                  <th className="pb-3 pr-6">Site</th>
                  <th className="pb-3 pr-6">District</th>
                  <th className="pb-3 pr-6">Live power (kW)</th>
                  <th className="pb-3 pr-6">Battery (%)</th>
                  <th className="pb-3 pr-6">Energy today (kWh)</th>
                  <th className="pb-3">CO₂ avoided (kg)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {siteSnapshots.map(({ site, latest, energy, co2Kg }) => (
                  <tr key={site.id} className="text-slate-700">
                    <td className="py-3 pr-6 font-semibold text-slate-900">{site.name}</td>
                    <td className="py-3 pr-6">{site.district}</td>
                    <td className="py-3 pr-6">{latest ? latest.power_kw.toFixed(2) : "—"}</td>
                    <td className="py-3 pr-6">{latest ? `${latest.battery_pct}%` : "—"}</td>
                    <td className="py-3 pr-6">{energy.toFixed(2)}</td>
                    <td className="py-3 text-emerald-600">{co2Kg.toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      </div>
    </div>
  );
}

