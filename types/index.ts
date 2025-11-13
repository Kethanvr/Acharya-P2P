export interface Site {
  id: string;
  name: string;
  lat: number;
  lon: number;
  type: "solar" | "wind" | "hybrid" | string;
  capacity_kw: number;
  owner: string;
  district: string;
  installation_date: string;
}

export interface TelemetryPoint {
  timestamp: string;
  power_kw: number;
  battery_pct: number;
}

export type TelemetrySeries = TelemetryPoint[];

export type TelemetryDataset = Record<string, TelemetrySeries>;

export interface DistrictMetrics {
  district: string;
  installed_capacity_mw: number;
  co2_reduced_tons: number;
  policy_score: number;
  renewable_index: number;
}

export interface CarbonFactors {
  india_avg_grid_factor: number;
  solar_factor: number;
  wind_factor: number;
}

export interface DeploymentPlanItem {
  id: string;
  district: string;
  capacity_kw: number;
  subsidy_pct: number;
  annual_energy_kwh: number;
  co2_avoided_kg: number;
  payback_years: number;
}

