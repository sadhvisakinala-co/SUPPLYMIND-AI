import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Merge Tailwind CSS classes with clsx and tailwind-merge
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Format a number as currency (USD)
 */
export function formatCurrency(
  amount: number,
  currency: string = "USD",
  locale: string = "en-US"
): string {
  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(amount);
}

/**
 * Format a date string or Date object
 */
export function formatDate(
  date: string | Date,
  options?: Intl.DateTimeFormatOptions
): string {
  const d = typeof date === "string" ? new Date(date) : date;
  const defaultOptions: Intl.DateTimeFormatOptions = {
    year: "numeric",
    month: "short",
    day: "numeric",
  };
  return d.toLocaleDateString("en-US", options || defaultOptions);
}

/**
 * Format a date with time
 */
export function formatDateTime(date: string | Date): string {
  const d = typeof date === "string" ? new Date(date) : date;
  return d.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

/**
 * Format a number with abbreviation (1K, 1M, etc.)
 */
export function formatNumber(num: number): string {
  if (num >= 1_000_000_000) {
    return `${(num / 1_000_000_000).toFixed(1)}B`;
  }
  if (num >= 1_000_000) {
    return `${(num / 1_000_000).toFixed(1)}M`;
  }
  if (num >= 1_000) {
    return `${(num / 1_000).toFixed(1)}K`;
  }
  return num.toLocaleString();
}

/**
 * Format a percentage
 */
export function formatPercent(value: number, decimals: number = 1): string {
  return `${value.toFixed(decimals)}%`;
}

/**
 * Get Tailwind CSS classes for a status string
 */
export function getStatusColor(status: string): string {
  const statusMap: Record<string, string> = {
    active: "bg-emerald-500/10 text-emerald-500 border-emerald-500/20",
    completed: "bg-emerald-500/10 text-emerald-500 border-emerald-500/20",
    delivered: "bg-emerald-500/10 text-emerald-500 border-emerald-500/20",
    success: "bg-emerald-500/10 text-emerald-500 border-emerald-500/20",
    healthy: "bg-emerald-500/10 text-emerald-500 border-emerald-500/20",

    pending: "bg-amber-500/10 text-amber-500 border-amber-500/20",
    processing: "bg-amber-500/10 text-amber-500 border-amber-500/20",
    warning: "bg-amber-500/10 text-amber-500 border-amber-500/20",
    "in-transit": "bg-amber-500/10 text-amber-500 border-amber-500/20",
    "in_transit": "bg-amber-500/10 text-amber-500 border-amber-500/20",

    critical: "bg-red-500/10 text-red-500 border-red-500/20",
    failed: "bg-red-500/10 text-red-500 border-red-500/20",
    error: "bg-red-500/10 text-red-500 border-red-500/20",
    cancelled: "bg-red-500/10 text-red-500 border-red-500/20",
    overdue: "bg-red-500/10 text-red-500 border-red-500/20",
    danger: "bg-red-500/10 text-red-500 border-red-500/20",

    inactive: "bg-gray-500/10 text-gray-500 border-gray-500/20",
    draft: "bg-gray-500/10 text-gray-500 border-gray-500/20",
    archived: "bg-gray-500/10 text-gray-500 border-gray-500/20",

    info: "bg-blue-500/10 text-blue-500 border-blue-500/20",
    review: "bg-blue-500/10 text-blue-500 border-blue-500/20",
    ordered: "bg-blue-500/10 text-blue-500 border-blue-500/20",
  };

  return (
    statusMap[status.toLowerCase()] ||
    "bg-gray-500/10 text-gray-500 border-gray-500/20"
  );
}

/**
 * Get color based on risk score (0-100)
 */
export function getRiskColor(score: number): {
  text: string;
  bg: string;
  border: string;
  label: string;
} {
  if (score >= 80) {
    return {
      text: "text-red-500",
      bg: "bg-red-500/10",
      border: "border-red-500/20",
      label: "Critical",
    };
  }
  if (score >= 60) {
    return {
      text: "text-orange-500",
      bg: "bg-orange-500/10",
      border: "border-orange-500/20",
      label: "High",
    };
  }
  if (score >= 40) {
    return {
      text: "text-amber-500",
      bg: "bg-amber-500/10",
      border: "border-amber-500/20",
      label: "Medium",
    };
  }
  if (score >= 20) {
    return {
      text: "text-yellow-500",
      bg: "bg-yellow-500/10",
      border: "border-yellow-500/20",
      label: "Low",
    };
  }
  return {
    text: "text-emerald-500",
    bg: "bg-emerald-500/10",
    border: "border-emerald-500/20",
    label: "Minimal",
  };
}

/**
 * Truncate text with ellipsis
 */
export function truncate(text: string, length: number): string {
  if (text.length <= length) return text;
  return `${text.slice(0, length)}...`;
}

/**
 * Generate initials from a name
 */
export function getInitials(name: string): string {
  return name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}
