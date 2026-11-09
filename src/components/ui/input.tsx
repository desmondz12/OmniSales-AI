import * as React from "react";
import { cn } from "@/lib/utils";

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  error?: string;
  label?: string;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, error, label, id, ...props }, ref) => {
    const inputId = id || (label ? label.toLowerCase().replace(/\s+/g, "-") : undefined);

    return (
      <div className="w-full space-y-1.5">
        {label && (
          <label
            htmlFor={inputId}
            className="block text-caption-1-semibold text-text-primary"
          >
            {label}
          </label>
        )}
        <input
          id={inputId}
          type={type}
          className={cn(
            "flex h-9 w-full rounded-xl border border-border-button-default bg-background-primary-default px-3 py-2 text-sm text-text-primary placeholder:text-text-placeholder shadow-2xs transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-border-focus-ring disabled:cursor-not-allowed disabled:bg-background-secondary-default disabled:text-text-placeholder",
            error && "border-red-500 focus-visible:ring-red-500/30",
            className
          )}
          ref={ref}
          aria-invalid={Boolean(error)}
          aria-describedby={error && inputId ? `${inputId}-error` : undefined}
          {...props}
        />
        {error && (
          <p
            id={inputId ? `${inputId}-error` : undefined}
            className="text-xs text-red-600 font-medium"
          >
            {error}
          </p>
        )}
      </div>
    );
  }
);
Input.displayName = "Input";

export { Input };
