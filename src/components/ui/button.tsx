import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-xl text-body-medium font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-border-focus-ring disabled:pointer-events-none disabled:opacity-50 select-none cursor-pointer",
  {
    variants: {
      variant: {
        default:
          "bg-accent-600 text-white shadow-2xs hover:bg-accent-700 active:bg-accent-800",
        destructive:
          "bg-red-600 text-white shadow-2xs hover:bg-red-700 active:bg-red-800",
        outline:
          "border border-border-button-default bg-background-primary-default text-text-primary hover:bg-background-secondary-hover shadow-2xs",
        secondary:
          "bg-background-secondary-default text-text-primary border border-border-button-default hover:bg-background-secondary-hover active:bg-background-secondary-hover",
        ghost:
          "text-text-secondary hover:bg-background-secondary-hover hover:text-text-primary",
        link: "text-accent-600 underline-offset-4 hover:underline",
      },
      size: {
        default: "h-9 px-4 py-2 text-sm",
        sm: "h-8 rounded-lg px-3 text-xs",
        lg: "h-11 rounded-xl px-6 text-base font-semibold",
        icon: "h-9 w-9 rounded-xl",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  isLoading?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, isLoading = false, children, disabled, ...props }, ref) => {
    return (
      <button
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        disabled={disabled || isLoading}
        {...props}
      >
        {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin text-current" />}
        {children}
      </button>
    );
  }
);
Button.displayName = "Button";

export { Button, buttonVariants };
