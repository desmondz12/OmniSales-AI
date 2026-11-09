import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { AlertCircle, CheckCircle2, Info } from "lucide-react";
import { cn } from "@/lib/utils";

const alertVariants = cva(
  "relative w-full rounded-2xl border p-4 text-xs [&>svg~*]:pl-7 [&>svg+div]:translate-y-[-2px] [&>svg]:absolute [&>svg]:left-4 [&>svg]:top-4",
  {
    variants: {
      variant: {
        default:
          "border-border-button-default bg-background-secondary-default text-text-primary [&>svg]:text-text-secondary",
        destructive:
          "border-rose-200/80 bg-rose-50/60 text-rose-900 [&>svg]:text-rose-600 dark:border-rose-900/40 dark:bg-rose-950/40 dark:text-rose-200",
        success:
          "border-emerald-200/80 bg-emerald-50/60 text-emerald-900 [&>svg]:text-emerald-600 dark:border-emerald-900/40 dark:bg-emerald-950/40 dark:text-emerald-200",
        warning:
          "border-amber-200/80 bg-amber-50/60 text-amber-900 [&>svg]:text-amber-600 dark:border-amber-900/40 dark:bg-amber-950/40 dark:text-amber-200",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

interface AlertProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof alertVariants> {}

const Alert = React.forwardRef<HTMLDivElement, AlertProps>(
  ({ className, variant, children, ...props }, ref) => {
    const Icon =
      variant === "destructive"
        ? AlertCircle
        : variant === "success"
        ? CheckCircle2
        : Info;

    return (
      <div
        ref={ref}
        role="alert"
        className={cn(alertVariants({ variant }), className)}
        {...props}
      >
        <Icon className="h-4 w-4" />
        <div>{children}</div>
      </div>
    );
  }
);
Alert.displayName = "Alert";

const AlertTitle = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => (
  <h5
    ref={ref}
    className={cn("mb-1 font-semibold leading-none tracking-tight", className)}
    {...props}
  />
));
AlertTitle.displayName = "AlertTitle";

const AlertDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("text-xs leading-relaxed opacity-90", className)}
    {...props}
  />
));
AlertDescription.displayName = "AlertDescription";

export { Alert, AlertTitle, AlertDescription };
