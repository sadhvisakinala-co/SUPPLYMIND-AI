import * as React from "react";
import { cn } from "@/lib/utils";

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  error?: string;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, error, ...props }, ref) => {
    return (
      <div className="w-full">
        <input
          type={type}
          className={cn(
            "flex h-11 w-full rounded-lg border border-border-subtle bg-charcoal px-4 py-2 text-sm text-soft-ivory shadow-sm transition-all duration-200 file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-silver-sage/50 focus-visible:outline-none focus-visible:border-electric-teal focus-visible:ring-2 focus-visible:ring-electric-teal/20 disabled:cursor-not-allowed disabled:opacity-50",
            error && "border-error focus-visible:ring-error/20",
            className
          )}
          ref={ref}
          {...props}
        />
        {error && <p className="mt-1 text-xs text-error">{error}</p>}
      </div>
    );
  }
);
Input.displayName = "Input";

export { Input };
