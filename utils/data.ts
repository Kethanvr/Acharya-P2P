import sites from "@/data/sites.json";
import telemetry from "@/data/telemetry.json";
import districts from "@/data/districts.json";
import carbonFactors from "@/data/carbon_factors.json";

import type {
  CarbonFactors,
  DistrictMetrics,
  Site,
  TelemetryDataset,
  TelemetrySeries,
} from "@/types";

export function getSites(): Site[] {
  return sites as Site[];
}

export function getSiteById(id: string): Site | undefined {
  return getSites().find((site) => site.id === id);
}

export function getTelemetry(): TelemetryDataset {
  return telemetry as TelemetryDataset;
}

export function getTelemetryBySite(id: string): TelemetrySeries {
  const dataset = getTelemetry();
  return dataset[id] ?? [];
}

export function getDistrictMetrics(): DistrictMetrics[] {
  return districts as DistrictMetrics[];
}

export function getCarbonFactors(): CarbonFactors {
  return carbonFactors as CarbonFactors;
}

