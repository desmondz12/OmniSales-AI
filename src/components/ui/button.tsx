import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-xl text-xs font-semibold transition-all duration-120 ease-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0071E3] focus-visible:ring-offset-2 focus-visible:ring-offset-white disabled:pointer-events-none disabled:opacity-50 select-none cursor-pointer active:scale-[0.97] active:opacity-95",
  {
    variants: {
      variant: {
        default:
          "bg-[#0071E3] text-white shadow-xs hover:bg-[#0077ED] active:bg-[#0062C4] shadow-[0_1px_2px_rgba(0,113,227,0.25)]",
        destructive:
          "bg-[#FF3B30] text-white shadow-xs hover:bg-[#FF453A] active:bg-[#D70015]",
        outline:
          "border border-slate-200/90 bg-white/80 backdrop-blur-md text-slate-800 hover:bg-slate-50/90 hover:border-slate-300 shadow-2xs",
        secondary:
          "bg-slate-100/90 backdrop-blur-md text-slate-800 border border-slate-200/60 hover:bg-slate-200/80 active:bg-slate-200",
        ghost:
          "text-slate-600 hover:bg-slate-100/80 hover:text-slate-900",
        link: "text-[#0071E3] underline-offset-4 hover:underline",
        glass:
          "bg-white/70 backdrop-blur-xl border border-white/60 text-slate-900 shadow-xs hover:bg-white/90 hover:shadow-sm",
      },
      size: {
        default: "h-9 px-4 py-2",
        sm: "h-7.5 rounded-lg px-3 text-[11px]",
        lg: "h-11 rounded-2xl px-6 text-sm font-semibold tracking-tight",
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
        {isLoading && <Loader2 className="mr-2 h-3.5 w-3.5 animate-spin text-current" />}
        {children}
      </button>
    );
  }
);
Button.displayName = "Button";

export { Button, buttonVariants };
