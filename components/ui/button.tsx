import { forwardRef, type ButtonHTMLAttributes } from "react";

import { cn } from "@/lib/utils";

const baseStyles =
  "inline-flex items-center justify-center rounded-xl font-medium transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 disabled:cursor-not-allowed disabled:opacity-60";

const variants: Record<string, string> = {
  default:
    "bg-brand text-white hover:bg-brand-light focus-visible:outline-brand shadow-sm px-4 py-2",
  outline:
    "border border-slate-200 bg-white text-slate-900 hover:bg-slate-50 focus-visible:outline-brand px-4 py-2",
  subtle:
    "bg-slate-100 text-slate-800 hover:bg-slate-200 focus-visible:outline-brand px-3 py-2",
};

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: keyof typeof variants;
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "default", ...props }, ref) => (
    <button ref={ref} className={cn(baseStyles, variants[variant], className)} {...props} />
  ),
);

Button.displayName = "Button";

export default Button;

