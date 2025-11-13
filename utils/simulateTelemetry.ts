import dayjs from "dayjs";

import type { Site, TelemetryDataset, TelemetryPoint } from "@/types";

const UPDATE_INTERVAL_MINUTES = 5;

function randomBetween(min: number, max: number): number {
  return Math.random() * (max - min) + min;
}

function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}

function nextTelemetryPoint(site: Site, prev: TelemetryPoint): TelemetryPoint {
  const variance = site.capacity_kw * 0.2;
  const nextPower = clamp(
    prev.power_kw + randomBetween(-variance, variance),
    0.2,
    site.capacity_kw,
  );

  const batteryDrift = randomBetween(-1.5, 1);
  const nextBattery = clamp(prev.battery_pct + batteryDrift, 20, 100);

  return {
    timestamp: dayjs(prev.timestamp)
      .add(UPDATE_INTERVAL_MINUTES, "minute")
      .toISOString(),
    power_kw: Number(nextPower.toFixed(2)),
    battery_pct: Math.round(nextBattery),
  };
}

export function simulateTelemetryTick(
  sites: Site[],
  dataset: TelemetryDataset,
): TelemetryDataset {
  const now = dayjs();
  const result: TelemetryDataset = {};

  sites.forEach((site) => {
    const series = dataset[site.id] ?? [];
    const lastPoint =
      series.length > 0
        ? series[series.length - 1]
        : {
            timestamp: now.subtract(UPDATE_INTERVAL_MINUTES, "minute").toISOString(),
            power_kw: clamp(randomBetween(0.3, site.capacity_kw), 0.2, site.capacity_kw),
            battery_pct: Math.round(randomBetween(40, 90)),
          };

    const nextPoint = nextTelemetryPoint(site, lastPoint);
    result[site.id] = [...series.slice(-48), nextPoint];
  });

  return result;
}

