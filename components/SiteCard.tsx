import { ArrowRightIcon } from "@radix-ui/react-icons";

import Badge from "@/components/ui/badge";
import Card from "@/components/ui/card";
import type { Site } from "@/types";

interface SiteCardProps {
  site: Site;
  powerKw?: number;
  batteryPct?: number;
  onClick?: () => void;
}

export default function SiteCard({ site, powerKw, batteryPct, onClick }: SiteCardProps) {
  return (
    <Card
      className="cursor-pointer space-y-4 border-transparent bg-white/90 hover:border-brand/40"
      onClick={onClick}
    >
      <div className="flex items-center justify-between gap-3">
        <div>
          <h3 className="text-lg font-semibold text-slate-900">{site.name}</h3>
          <p className="text-sm text-slate-500">
            {site.district} · Installed {new Date(site.installation_date).getFullYear()}
          </p>
        </div>
        <Badge variant="muted">{site.type.toUpperCase()}</Badge>
      </div>
      <div className="grid grid-cols-2 gap-4 text-sm">
        <div>
          <div className="text-xs uppercase text-slate-400">Capacity</div>
          <div className="font-semibold text-slate-900">{site.capacity_kw} kW</div>
        </div>
        <div>
          <div className="text-xs uppercase text-slate-400">Owner</div>
          <div className="font-semibold text-slate-900">{site.owner}</div>
        </div>
        <div>
          <div className="text-xs uppercase text-slate-400">Live Power</div>
          <div className="font-semibold text-slate-900">
            {powerKw !== undefined ? `${powerKw.toFixed(2)} kW` : "Loading"}
          </div>
        </div>
        <div>
          <div className="text-xs uppercase text-slate-400">Battery</div>
          <div className="font-semibold text-slate-900">
            {batteryPct !== undefined ? `${batteryPct}%` : "—"}
          </div>
        </div>
      </div>
      <div className="flex items-center justify-end text-sm font-medium text-brand">
        View detail <ArrowRightIcon className="ml-2 h-4 w-4" />
      </div>
    </Card>
  );
}

