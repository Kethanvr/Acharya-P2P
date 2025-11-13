'use client';

import { useEffect, useMemo, useState } from "react";
import dynamic from "next/dynamic";
import { useRouter } from "next/navigation";
import dayjs from "dayjs";

import LiveStats from "@/components/LiveStats";
import SiteCard from "@/components/SiteCard";
import Card from "@/components/ui/card";
import { formatNumber } from "@/lib/utils";
import { co2Avoided, kwToKwh } from "@/utils/calculateCarbon";
import { getCarbonFactors, getSites, getTelemetry } from "@/utils/data";
import { simulateTelemetryTick } from "@/utils/simulateTelemetry";
import type { TelemetryDataset, TelemetryPoint } from "@/types";

const Map = dynamic(() => import("@/components/Map"), { ssr: false });

const REFRESH_INTERVAL_MS = 4000;
const SAMPLE_INTERVAL_MINUTES = 5;

const SITES = getSites();
const BASE_TELEMETRY = getTelemetry();
const CARBON = getCarbonFactors();
const TOTAL_INSTALLED_CAPACITY_KW = SITES.reduce(
  (total, site) => total + site.capacity_kw,
  0,
);

function cloneTelemetry(dataset: TelemetryDataset): TelemetryDataset {
  return Object.entries(dataset).reduce<TelemetryDataset>((acc, [siteId, series]) => {
    acc[siteId] = [...series];
    return acc;
  }, {});
}

function todaysPoints(series: TelemetryPoint[]) {
  const startOfDay = dayjs().startOf("day");
  return series.filter((point) => !dayjs(point.timestamp).isBefore(startOfDay));
}

function computeEnergyKwh(series: TelemetryPoint[]) {
  return todaysPoints(series).reduce(
    (total, point) => total + kwToKwh(point.power_kw, SAMPLE_INTERVAL_MINUTES),
    0,
  );
}

export default function DashboardPage() {
  const router = useRouter();
  const [telemetry, setTelemetry] = useState<TelemetryDataset>(() => cloneTelemetry(BASE_TELEMETRY));

  useEffect(() => {
    const intervalId = setInterval(() => {
      setTelemetry((prev) => simulateTelemetryTick(SITES, prev));
    }, REFRESH_INTERVAL_MS);

    return () => clearInterval(intervalId);
  }, []);

  const latestBySite = useMemo(
    () =>
      SITES.reduce<Record<string, TelemetryPoint | undefined>>((acc, site) => {
        const series = telemetry[site.id] ?? [];
        acc[site.id] = series[series.length - 1];
        return acc;
      }, {}),
    [telemetry],
  );

  const totalLivePowerKw = useMemo(
    () =>
      SITES.reduce((total, site) => {
        const latest = latestBySite[site.id];
        return total + (latest?.power_kw ?? 0);
      }, 0),
    [latestBySite],
  );

  const totalEnergyKwh = useMemo(
    () =>
      SITES.reduce((total, site) => {
        const series = telemetry[site.id] ?? [];
        return total + computeEnergyKwh(series);
      }, 0),
    [telemetry],
  );

  const totalCo2Kg = useMemo(
    () => co2Avoided(totalEnergyKwh, CARBON.india_avg_grid_factor),
    [totalEnergyKwh],
  );

  const averageBatteryPct = useMemo(() => {
    const readings = SITES.map((site) => latestBySite[site.id]?.battery_pct ?? 0);
    const sum = readings.reduce((total, value) => total + value, 0);
    return readings.length > 0 ? sum / readings.length : 0;
  }, [latestBySite]);

  const featuredSite = useMemo(() => {
    const ranked = [...SITES].sort((a, b) => {
      const latestA = latestBySite[a.id]?.power_kw ?? 0;
      const latestB = latestBySite[b.id]?.power_kw ?? 0;
      return latestB - latestA;
    });
    return ranked[0] ?? SITES[0];
  }, [latestBySite]);

  const featuredSeries = telemetry[featuredSite.id] ?? [];
  const featuredLatest = latestBySite[featuredSite.id];
  const featuredCo2Today = co2Avoided(
    computeEnergyKwh(featuredSeries),
    CARBON[`${featuredSite.type}_factor` as keyof typeof CARBON] ??
      CARBON.india_avg_grid_factor,
  );

  const lastUpdated = featuredLatest
    ? dayjs(featuredLatest.timestamp).format("HH:mm:ss")
    : undefined;

  return (
    <div className="space-y-8">
      <div className="space-y-2">
        <h1 className="text-3xl font-semibold text-slate-900">Deployment Dashboard</h1>
        <p className="text-sm text-slate-500">
          Monitor live generation, carbon savings, and deployment readiness across Karnataka sites.
        </p>
      </div>

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <Card>
          <div className="text-sm text-slate-500">Active Sites</div>
          <div className="mt-2 text-3xl font-semibold text-slate-900">
            {formatNumber(SITES.length)}
          </div>
          <div className="mt-1 text-xs text-slate-400">Operating with live telemetry</div>
        </Card>
        <Card>
          <div className="text-sm text-slate-500">Installed Capacity</div>
          <div className="mt-2 text-3xl font-semibold text-slate-900">
            {formatNumber(TOTAL_INSTALLED_CAPACITY_KW, { maximumFractionDigits: 0 })} kW
          </div>
          <div className="mt-1 text-xs text-slate-400">Across solar and hybrid assets</div>
        </Card>
        <Card>
          <div className="text-sm text-slate-500">CO₂ Avoided Today</div>
          <div className="mt-2 text-3xl font-semibold text-emerald-600">
            {formatNumber(totalCo2Kg, { maximumFractionDigits: 1 })} kg
          </div>
          <div className="mt-1 text-xs text-slate-400">
            {formatNumber(totalEnergyKwh, { maximumFractionDigits: 1 })} kWh dispatched
          </div>
        </Card>
        <Card>
          <div className="text-sm text-slate-500">Average Battery Reserve</div>
          <div className="mt-2 text-3xl font-semibold text-slate-900">
            {formatNumber(averageBatteryPct, { maximumFractionDigits: 0 })}%
          </div>
          <div className="mt-1 text-xs text-slate-400">
            Live power {formatNumber(totalLivePowerKw, { maximumFractionDigits: 1 })} kW
          </div>
        </Card>
      </section>

      <section className="grid gap-6 lg:grid-cols-[1.7fr,1fr]">
        <Card className="p-0">
          <div className="flex items-center justify-between px-6 py-4">
            <h2 className="text-lg font-semibold text-slate-900">Karnataka Sites</h2>
            <span className="text-xs text-slate-500">
              Click a site pin or card to open detail
            </span>
          </div>
          <div className="px-6 pb-6">
            <Map
              sites={SITES}
              onSiteClick={(id) => {
                router.push(`/sites/${id}`);
              }}
            />
          </div>
        </Card>

        <div className="space-y-6">
          <LiveStats
            powerKw={featuredLatest?.power_kw ?? 0}
            batteryPct={featuredLatest?.battery_pct ?? 0}
            co2TodayKg={featuredCo2Today}
            lastUpdated={lastUpdated}
          />
          <Card>
            <h3 className="text-sm font-semibold text-slate-700">Operational focus</h3>
            <ul className="mt-3 space-y-2 text-sm text-slate-600">
              <li>
                • {featuredSite.name} is leading with{" "}
                {featuredLatest ? featuredLatest.power_kw.toFixed(1) : "0.0"} kW live
              </li>
              <li>
                • {formatNumber(totalCo2Kg, { maximumFractionDigits: 1 })} kg CO₂ abated since midnight
              </li>
              <li>
                • District average battery reserve is{" "}
                {formatNumber(averageBatteryPct, { maximumFractionDigits: 0 })}%
              </li>
            </ul>
          </Card>
        </div>
      </section>

      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-slate-900">Live Sites</h2>
          <span className="text-xs text-slate-500">
            Updated every {Math.round(REFRESH_INTERVAL_MS / 1000)} seconds
          </span>
        </div>
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {SITES.map((site) => {
            const latest = latestBySite[site.id];
            return (
              <SiteCard
                key={site.id}
                site={site}
                powerKw={latest?.power_kw}
                batteryPct={latest?.battery_pct}
                onClick={() => router.push(`/sites/${site.id}`)}
              />
            );
          })}
        </div>
      </section>
    </div>
  );
}

