import Card from "@/components/ui/card";

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
    <Card className="overflow-hidden bg-gradient-to-br from-brand-dark via-brand to-brand-light text-white shadow-lg">
      <div className="space-y-4">
        <div>
          <p className="text-xs uppercase tracking-[0.2em]/relaxed text-white/70">Live generation</p>
          <p className="mt-2 text-4xl font-semibold tracking-tight">{powerKw.toFixed(2)} kW</p>
        </div>

        <div className="grid grid-cols-2 gap-6 text-sm font-medium">
          <div>
            <p className="text-white/70">Battery reserve</p>
            <p className="mt-1 text-lg font-semibold text-white">{batteryPct}%</p>
          </div>
          <div>
            <p className="text-white/70">CO₂ avoided today</p>
            <p className="mt-1 text-lg font-semibold text-emerald-100">
              {co2TodayKg.toFixed(2)} kg
            </p>
          </div>
        </div>

        {lastUpdated ? (
          <p className="text-xs text-white/60">Updated {lastUpdated}</p>
        ) : (
          <p className="text-xs text-white/60">Awaiting telemetry signal</p>
        )}
      </div>
    </Card>
  );
}

