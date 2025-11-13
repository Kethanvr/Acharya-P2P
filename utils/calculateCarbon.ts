export function co2Avoided(energyKwh: number, factor = 0.82): number {
  if (!Number.isFinite(energyKwh)) {
    return 0;
  }
  return Number((energyKwh * factor).toFixed(3));
}

export function kwToKwh(powerKw: number, minutes = 60): number {
  if (!Number.isFinite(powerKw) || !Number.isFinite(minutes)) {
    return 0;
  }
  return powerKw * (minutes / 60);
}

