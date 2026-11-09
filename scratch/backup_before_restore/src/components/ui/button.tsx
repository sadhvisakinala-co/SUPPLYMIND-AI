import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-lg text-sm font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#4BC5B1] focus-visible:ring-offset-1 focus-visible:ring-offset-[#0C1113] disabled:pointer-events-none disabled:opacity-50 select-none active:scale-[0.99]",
  {
    variants: {
      variant: {
        default:
          "bg-[#4BC5B1] text-[#0C1113] font-semibold hover:bg-[#42b5a2] shadow-sm hover:shadow-jade-subtle",
        secondary:
          "bg-[#172024] text-[#EDECE6] hover:bg-[#1C292C] border border-[rgba(237,236,230,0.08)] hover:border-[rgba(237,236,230,0.16)]",
        outline:
          "border border-[#4BC5B1]/40 text-[#4BC5B1] hover:bg-[#4BC5B1]/10 hover:border-[#4BC5B1]",
        ghost:
          "text-[#9AA9A8] hover:bg-[#172024] hover:text-[#EDECE6]",
        link:
          "text-[#4BC5B1] underline-offset-4 hover:underline p-0 h-auto",
        destructive:
          "bg-[#3d1d1d] text-[#D77979] hover:bg-[#4a2222] border border-[#D77979]/30",
        obsidian:
          "bg-[#0C1113] text-[#EDECE6] border border-[rgba(237,236,230,0.08)] hover:bg-[#172024] hover:border-[#4BC5B1]/30",
      },
      size: {
        default: "h-10 px-5 py-2",
        sm: "h-8 rounded-md px-3 text-xs",
        lg: "h-12 rounded-lg px-7 text-sm font-semibold tracking-wide",
        xl: "h-14 rounded-xl px-9 text-base font-semibold",
        icon: "h-10 w-10 p-0",
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
  ({ className, variant, size, isLoading, children, disabled, ...props }, ref) => {
    return (
      <button
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        disabled={disabled || isLoading}
        {...props}
      >
        {isLoading ? (
          <span className="flex items-center gap-2">
            <svg
              className="animate-spin -ml-1 mr-2 h-4 w-4"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              />
            </svg>
            Processing...
          </span>
        ) : (
          children
        )}
      </button>
    );
  }
);
Button.displayName = "Button";

export { Button, buttonVariants };
