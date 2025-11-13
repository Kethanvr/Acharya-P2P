import type { HTMLAttributes } from "react";

import { cn } from "@/lib/utils";

export interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: "success" | "warning" | "muted";
}

type BadgeVariant = NonNullable<BadgeProps["variant"]>;

const variantStyles: Record<BadgeVariant, string> = {
  success: "bg-emerald-100 text-emerald-700",
  warning: "bg-amber-100 text-amber-700",
  muted: "bg-slate-100 text-slate-700",
};

export default function Badge({
  className,
  variant = "muted",
  ...props
}: BadgeProps) {
  const resolvedVariant: BadgeVariant = variant;

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-semibold",
        variantStyles[resolvedVariant],
        className,
      )}
      {...props}
    />
  );
}

