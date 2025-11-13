import { notFound } from "next/navigation";

import SiteDetailClient from "./SiteDetailClient";

import { getCarbonFactors, getSiteById, getSites, getTelemetryBySite } from "@/utils/data";
import type { TelemetrySeries } from "@/types";

interface SitePageProps {
  params: {
    id: string;
  };
}

export function generateStaticParams() {
  return getSites().map((site) => ({ id: site.id }));
}

export default function SiteDetailPage({ params }: SitePageProps) {
  const site = getSiteById(params.id);

  if (!site) {
    notFound();
  }

  const initialSeries = getTelemetryBySite(site.id) as TelemetrySeries;
  const carbon = getCarbonFactors();
  const emissionFactor =
    carbon[`${site.type}_factor` as keyof typeof carbon] ?? carbon.india_avg_grid_factor;

  return (
    <SiteDetailClient site={site} initialSeries={initialSeries} emissionFactor={emissionFactor} />
  );
}

