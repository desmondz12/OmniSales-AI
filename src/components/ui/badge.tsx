import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold transition-colors border select-none",
  {
    variants: {
      variant: {
        default:
          "border-transparent bg-accent-600 text-white shadow-2xs",
        secondary:
          "border-border-button-default bg-background-secondary-default text-text-secondary",
        outline:
          "border-border-button-default text-text-primary bg-background-primary-default",
        success:
          "border-emerald-200 bg-emerald-50 text-emerald-700 font-medium",
        warning:
          "border-amber-200 bg-amber-50 text-amber-700 font-medium",
        destructive:
          "border-red-200 bg-red-50 text-red-700 font-medium",
        ready_to_pay:
          "border-emerald-200 bg-emerald-50 text-emerald-700 font-medium",
        paid:
          "border-emerald-200 bg-emerald-50 text-emerald-700 font-medium",
        promise_due:
          "border-amber-200 bg-amber-50 text-amber-700 font-medium",
        upset:
          "border-red-200 bg-red-50 text-red-700 font-medium",
        needs_human:
          "border-purple-200 bg-purple-50 text-purple-700 font-medium",
        ai_handling:
          "border-blue-200 bg-blue-50 text-blue-700 font-medium",
        lead:
          "border-blue-200 bg-blue-50 text-blue-700 font-medium",
        prospect:
          "border-amber-200 bg-amber-50 text-amber-700 font-medium",
        customer:
          "border-emerald-200 bg-emerald-50 text-emerald-700 font-medium",
        churned:
          "border-border-button-default bg-background-secondary-default text-text-tertiary font-medium",
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
