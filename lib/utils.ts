export function cn(...inputs: Array<string | false | null | undefined>) {
  return inputs.filter(Boolean).join(" ");
}

export function formatNumber(value: number, options?: Intl.NumberFormatOptions) {
  return new Intl.NumberFormat("en-IN", options).format(value);
}

export function formatPercentage(value: number, fractionDigits = 0) {
  return `${value.toFixed(fractionDigits)}%`;
}

export function formatDate(date: string | Date) {
  const d = typeof date === "string" ? new Date(date) : date;
  return d.toLocaleDateString("en-IN", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

