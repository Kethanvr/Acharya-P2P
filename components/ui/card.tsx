import { forwardRef, type HTMLAttributes } from "react";

import { cn } from "@/lib/utils";

export interface CardProps extends HTMLAttributes<HTMLDivElement> {}

const Card = forwardRef<HTMLDivElement, CardProps>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition hover:shadow-md",
      className,
    )}
    {...props}
  />
));
Card.displayName = "Card";

export default Card;

