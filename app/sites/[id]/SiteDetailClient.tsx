'use client';

import { useCallback, useEffect, useMemo, useState } from "react";
import dayjs from "dayjs";

import CarbonBadge from "@/components/CarbonBadge";
import LiveStats from "@/components/LiveStats";
import LineChart from "@/components/Charts/LineChart";
import Button from "@/components/ui/button";
import Card from "@/components/ui/card";
import { formatDate, formatNumber } from "@/lib/utils";
import { co2Avoided, kwToKwh } from "@/utils/calculateCarbon";
import { simulateTelemetryTick } from "@/utils/simulateTelemetry";
import { exportElementToPDF } from "@/utils/exportElementToPDF";
import type { Site, TelemetryPoint, TelemetrySeries } from "@/types";

const SAMPLE_INTERVAL_MINUTES = 5;
const REFRESH_INTERVAL_MS = 4000;

interface SiteDetailClientProps {
  site: Site;
  initialSeries: TelemetrySeries;
  emissionFactor: number;
}

function todaysPoints(series: TelemetrySeries) {
  const startOfDay = dayjs().startOf("day");
  return series.filter((point) => !dayjs(point.timestamp).isBefore(startOfDay));
}

export default function SiteDetailClient({
  site,
  initialSeries,
  emissionFactor,
}: SiteDetailClientProps) {
  const [series, setSeries] = useState<TelemetrySeries>(initialSeries);

  useEffect(() => {
    const intervalId = setInterval(() => {
      setSeries((prev) => {
        const nextDataset = simulateTelemetryTick([site], { [site.id]: prev });
        const nextSeries = nextDataset[site.id] ?? prev;
        return [...nextSeries];
      });
    }, REFRESH_INTERVAL_MS);

    return () => clearInterval(intervalId);
  }, [site]);

  const latest = series[series.length - 1];

  const todaysSeries = useMemo(() => todaysPoints(series), [series]);

  const energyTodayKwh = useMemo(
    () =>
      todaysSeries.reduce(
        (total, point) => total + kwToKwh(point.power_kw, SAMPLE_INTERVAL_MINUTES),
        0,
      ),
    [todaysSeries],
  );

  const co2TodayKg = useMemo(
    () => co2Avoided(energyTodayKwh, emissionFactor),
    [energyTodayKwh, emissionFactor],
  );

  const lineLabels = useMemo(() => series.map((point) => point.timestamp), [series]);
  const lineValues = useMemo(() => series.map((point) => point.power_kw), [series]);

  const ledgerEntries = useMemo(() => {
    return [...series]
      .slice(-8)
      .reverse()
      .map((point, index) => {
        const energy = kwToKwh(point.power_kw, SAMPLE_INTERVAL_MINUTES);
        return {
          id: `${point.timestamp}-${index}`,
          timestamp: dayjs(point.timestamp).format("HH:mm"),
          powerKw: point.power_kw,
          energyKwh: energy,
          co2Kg: co2Avoided(energy, emissionFactor),
        };
      });
  }, [series, emissionFactor]);

  const lastUpdated = latest ? dayjs(latest.timestamp).format("HH:mm:ss") : undefined;

  const handleExport = useCallback(async () => {
    await exportElementToPDF("site-report", `${site.name.replace(/\s+/g, "-")}-report.pdf`);
  }, [site]);

  return (
    <div className="space-y-8">
      <Card className="border-none bg-gradient-to-r from-brand/10 via-white to-white">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="space-y-2">
            <p className="text-xs uppercase tracking-[0.35em] text-brand-dark/70">Site spotlight</p>
            <h1 className="text-3xl font-semibold text-slate-900">{site.name}</h1>
            <p className="text-sm text-slate-600">
              {site.district} · {site.type.toUpperCase()} · Installed {formatDate(site.installation_date)}
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <CarbonBadge co2Kg={co2TodayKg} emissionFactor={emissionFactor} />
            <Button variant="outline" onClick={handleExport}>
              Export PDF
            </Button>
          </div>
        </div>
      </Card>

      <div id="site-report" className="space-y-6">
        <div className="grid gap-6 lg:grid-cols-[1.6fr,1fr]">
          <Card className="border-slate-100 bg-white/90">
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h2 className="text-lg font-semibold text-slate-900">Generation trend</h2>
                <p className="text-xs text-slate-500">5-minute resolution, auto-refreshed</p>
              </div>
              <span className="text-xs text-slate-400">
                Updated {lastUpdated ?? "—"}
              </span>
            </div>
            <div className="mt-6 h-[320px]">
              <LineChart labels={lineLabels} values={lineValues} />
            </div>
          </Card>

          <div className="space-y-6">
            <LiveStats
              powerKw={latest?.power_kw ?? 0}
              batteryPct={latest?.battery_pct ?? 0}
              co2TodayKg={co2TodayKg}
              lastUpdated={lastUpdated}
            />
            <Card className="space-y-3 border-slate-100 bg-white/90">
              <h3 className="text-sm font-semibold text-slate-700">Site snapshot</h3>
              <dl className="grid gap-3 text-sm text-slate-600">
                <div className="flex items-center justify-between">
                  <dt>Owner</dt>
                  <dd className="font-medium text-slate-900">{site.owner}</dd>
                </div>
                <div className="flex items-center justify-between">
                  <dt>Capacity</dt>
                  <dd className="font-medium text-slate-900">{site.capacity_kw} kW</dd>
                </div>
                <div className="flex items-center justify-between">
                  <dt>Emission factor</dt>
                  <dd className="font-medium text-slate-900">
                    {emissionFactor.toFixed(2)} kg CO₂ / kWh
                  </dd>
                </div>
                <div className="flex items-center justify-between">
                  <dt>Series points</dt>
                  <dd className="font-medium text-slate-900">{series.length}</dd>
                </div>
              </dl>
            </Card>
          </div>
        </div>

        <Card className="border-slate-100 bg-white/90">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-lg font-semibold text-slate-900">Carbon ledger</h2>
              <p className="text-xs text-slate-500">
                Visible carbon math: CO₂ = energy (kWh) × emission factor
              </p>
            </div>
            <span className="rounded-full bg-brand/10 px-3 py-1 text-xs font-medium text-brand">
              {ledgerEntries.length} recent readings
            </span>
          </div>
          <div className="mt-5 overflow-x-auto">
            <table className="min-w-full table-fixed border-spacing-y-2 text-sm">
              <thead>
                <tr className="text-left text-xs uppercase tracking-wide text-slate-400">
                  <th className="pb-2 pr-6">Timestamp</th>
                  <th className="pb-2 pr-6">Power (kW)</th>
                  <th className="pb-2 pr-6">Energy (kWh)</th>
                  <th className="pb-2">CO₂ avoided (kg)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {ledgerEntries.map((entry) => (
                  <tr key={entry.id} className="text-slate-700">
                    <td className="py-2 pr-6 font-medium text-slate-900">{entry.timestamp}</td>
                    <td className="py-2 pr-6">{entry.powerKw.toFixed(2)}</td>
                    <td className="py-2 pr-6">{entry.energyKwh.toFixed(2)}</td>
                    <td className="py-2 text-emerald-600">{entry.co2Kg.toFixed(3)}</td>
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

