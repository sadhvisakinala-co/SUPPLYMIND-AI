import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold font-mono transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
  {
    variants: {
      variant: {
        default:
          "border-electric-teal/30 bg-electric-teal/10 text-electric-teal",
        secondary:
          "border-border-subtle bg-surface text-soft-ivory",
        outline:
          "border-border-subtle text-silver-sage",
        success:
          "border-success/30 bg-success/10 text-success",
        warning:
          "border-warning/30 bg-warning/10 text-warning",
        danger:
          "border-error/30 bg-error/10 text-error",
        stockout:
          "border-error bg-error text-graphite font-bold animate-pulse",
        gold:
          "border-electric-teal/40 bg-electric-teal/20 text-electric-teal font-bold",
        obsidian:
          "border-border-subtle bg-graphite text-soft-ivory",
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
