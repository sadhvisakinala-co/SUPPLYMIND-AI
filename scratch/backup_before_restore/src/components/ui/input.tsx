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
            "flex h-10 w-full rounded-lg border border-[rgba(237,236,230,0.08)] bg-[#172024] px-3.5 py-2 text-sm text-[#EDECE6] shadow-sm transition-all duration-200 file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-[#9AA9A8]/45 focus-visible:outline-none focus-visible:border-[#4BC5B1] focus-visible:ring-1 focus-visible:ring-[#4BC5B1]/30 disabled:cursor-not-allowed disabled:opacity-50",
            error && "border-[#D77979] focus-visible:ring-[#D77979]/20",
            className
          )}
          ref={ref}
          {...props}
        />
        {error && <p className="mt-1 text-xs text-[#D77979] font-mono">{error}</p>}
      </div>
    );
  }
);
Input.displayName = "Input";

export { Input };
