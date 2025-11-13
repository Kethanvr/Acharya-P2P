interface LiveStatsProps {
  powerKw: number;
  batteryPct: number;
  co2TodayKg: number;
  lastUpdated?: string;
}

export default function LiveStats({
  powerKw,
  batteryPct,
  co2TodayKg,
  lastUpdated,
}: LiveStatsProps) {
  return (
    <div className="flex flex-col gap-3 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="text-sm font-medium text-slate-500">Live Generation</div>
      <div className="text-3xl font-semibold text-slate-900">{powerKw.toFixed(2)} kW</div>
      <div className="text-sm text-slate-600">Battery reserve: {batteryPct}%</div>
      <div className="text-sm font-semibold text-emerald-600">
        CO₂ avoided today: {co2TodayKg.toFixed(2)} kg
      </div>
      {lastUpdated ? (
        <div className="text-xs text-slate-400">Updated {lastUpdated}</div>
      ) : null}
    </div>
  );
}

