import Badge from "@/components/ui/badge";
import { formatNumber } from "@/lib/utils";

interface CarbonBadgeProps {
  co2Kg: number;
  emissionFactor: number;
}

export default function CarbonBadge({ co2Kg, emissionFactor }: CarbonBadgeProps) {
  return (
    <Badge variant="success" className="text-sm">
      CO₂ avoided: {formatNumber(co2Kg, { maximumFractionDigits: 1 })} kg ·
      Factor {emissionFactor.toFixed(2)} kg/kWh
    </Badge>
  );
}

