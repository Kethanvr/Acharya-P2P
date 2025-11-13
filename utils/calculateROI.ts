interface CalculateROIArgs {
  capex: number;
  subsidy_pct?: number;
  annual_energy_kwh: number;
  tariff?: number;
  opex_pct?: number;
}

export function calculateROI({
  capex,
  subsidy_pct = 0,
  annual_energy_kwh,
  tariff = 0.07,
  opex_pct = 0.02,
}: CalculateROIArgs) {
  const net_capex = capex * (1 - subsidy_pct / 100);
  const annual_saving = annual_energy_kwh * tariff;
  const annual_opex = net_capex * opex_pct;
  const net_annual_benefit = annual_saving - annual_opex;
  const payback_years =
    net_annual_benefit > 0 ? Number((net_capex / net_annual_benefit).toFixed(2)) : Infinity;

  return {
    net_capex: Number(net_capex.toFixed(2)),
    annual_saving: Number(annual_saving.toFixed(2)),
    annual_opex: Number(annual_opex.toFixed(2)),
    net_annual_benefit: Number(net_annual_benefit.toFixed(2)),
    payback_years,
  };
}

