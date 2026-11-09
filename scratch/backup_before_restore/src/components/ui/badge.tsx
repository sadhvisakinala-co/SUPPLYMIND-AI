import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold font-mono transition-colors focus:outline-none focus:ring-1 focus:ring-ring",
  {
    variants: {
      variant: {
        default:
          "border-[#4BC5B1]/30 bg-[#4BC5B1]/10 text-[#4BC5B1]",
        secondary:
          "border-[rgba(237,236,230,0.08)] bg-[#1C292C] text-[#EDECE6]",
        outline:
          "border-[rgba(237,236,230,0.08)] text-[#9AA9A8]",
        success:
          "border-[#5FC7A1]/30 bg-[#5FC7A1]/10 text-[#5FC7A1]",
        warning:
          "border-[#D8AD70]/30 bg-[#D8AD70]/10 text-[#D8AD70]",
        danger:
          "border-[#D77979]/30 bg-[#D77979]/10 text-[#D77979]",
        stockout:
          "border-[#D77979]/60 bg-[#D77979]/15 text-[#D77979] font-bold",
        gold:
          "border-[#4BC5B1]/40 bg-[#4BC5B1]/15 text-[#4BC5B1] font-bold",
        obsidian:
          "border-[rgba(237,236,230,0.08)] bg-[#0C1113] text-[#EDECE6]",
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
