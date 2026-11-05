import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2",
  {
    variants: {
      variant: {
        default:
          "border-transparent bg-blue-600 text-white shadow hover:bg-blue-500",
        secondary:
          "border-transparent bg-slate-800 text-slate-100 hover:bg-slate-700",
        destructive:
          "border-transparent bg-red-900/50 text-red-200 border border-red-800",
        outline: "text-slate-300 border border-slate-700",
        lead: "bg-blue-950/80 text-blue-300 border border-blue-800/60",
        prospect: "bg-amber-950/80 text-amber-300 border border-amber-800/60",
        customer: "bg-emerald-950/80 text-emerald-300 border border-emerald-800/60",
        churned: "bg-slate-800/80 text-slate-400 border border-slate-700",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  );
}

export { Badge, badgeVariants };
