"use client";

import React from "react";

interface CategoryData {
  name: string;
  pct: string;
  amount: string;
  color: string;
}

const CATEGORIES: CategoryData[] = [
  { name: "Wearables", pct: "42%", amount: "$52.3K", color: "#B9F12F" },
  { name: "Audio", pct: "24%", amount: "$29.9K", color: "#38BDF8" },
  { name: "Accessories", pct: "18%", amount: "$22.4K", color: "#818CF8" },
  { name: "Components", pct: "10%", amount: "$12.5K", color: "#3B82F6" },
  { name: "Other", pct: "6%", amount: "$7.5K", color: "#64748B" },
];

export default function SpendCategoryDonut() {
  // SVG Donut implementation using stroke-dasharray on circle
  // Circle circumference = 2 * PI * r
  // Radius r = 54, circumference = 2 * 3.14159 * 54 = 339.29
  const radius = 54;
  const c = 339.29;

  // Offsets for each slice (Wearables: 42%, Audio: 24%, Accessories: 18%, Components: 10%, Other: 6%)
  const wLen = c * 0.42; // 142.5
  const aLen = c * 0.24; // 81.4
  const accLen = c * 0.18; // 61.0
  const compLen = c * 0.10; // 33.9
  const otherLen = c * 0.06; // 20.35

  const wOffset = 0;
  const aOffset = -wLen;
  const accOffset = -(wLen + aLen);
  const compOffset = -(wLen + aLen + accLen);
  const otherOffset = -(wLen + aLen + accLen + compLen);

  return (
    <div className="w-full h-full flex flex-col justify-between select-none">
      {/* Title */}
      <div className="mb-2">
        <h3 className="text-xs sm:text-sm font-bold text-[#F2F0E9] font-display">
          Spend by Category
        </h3>
      </div>

      {/* Main Container: Donut on Left, 3-column Legend on Right */}
      <div className="grid grid-cols-12 items-center gap-3 py-1 flex-1">
        {/* Left: Donut Chart with Center Text (5 cols) */}
        <div className="col-span-5 relative h-[160px] flex items-center justify-center">
          <svg viewBox="0 0 160 160" className="w-full h-full -rotate-90">
            {/* Background ring track */}
            <circle
              cx="80"
              cy="80"
              r={radius}
              stroke="#071F30"
              strokeWidth="20"
              fill="none"
            />

            {/* Wearables (42%) */}
            <circle
              cx="80"
              cy="80"
              r={radius}
              stroke="#B9F12F"
              strokeWidth="20"
              fill="none"
              strokeDasharray={`${wLen - 2} ${c - (wLen - 2)}`}
              strokeDashoffset={wOffset}
            />

            {/* Audio (24%) */}
            <circle
              cx="80"
              cy="80"
              r={radius}
              stroke="#38BDF8"
              strokeWidth="20"
              fill="none"
              strokeDasharray={`${aLen - 2} ${c - (aLen - 2)}`}
              strokeDashoffset={aOffset}
            />

            {/* Accessories (18%) */}
            <circle
              cx="80"
              cy="80"
              r={radius}
              stroke="#818CF8"
              strokeWidth="20"
              fill="none"
              strokeDasharray={`${accLen - 2} ${c - (accLen - 2)}`}
              strokeDashoffset={accOffset}
            />

            {/* Components (10%) */}
            <circle
              cx="80"
              cy="80"
              r={radius}
              stroke="#3B82F6"
              strokeWidth="20"
              fill="none"
              strokeDasharray={`${compLen - 2} ${c - (compLen - 2)}`}
              strokeDashoffset={compOffset}
            />

            {/* Other (6%) */}
            <circle
              cx="80"
              cy="80"
              r={radius}
              stroke="#64748B"
              strokeWidth="20"
              fill="none"
              strokeDasharray={`${otherLen - 2} ${c - (otherLen - 2)}`}
              strokeDashoffset={otherOffset}
            />
          </svg>

          {/* Donut Center Hole Text */}
          <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
            <span className="text-base sm:text-lg font-extrabold font-mono text-[#F2F0E9] tracking-tight leading-none">
              $124.6K
            </span>
            <span className="text-[9px] text-[#829DA8] font-sans mt-0.5">
              Total Spend
            </span>
          </div>
        </div>

        {/* Right: 3-Column Legend Breakdown (7 cols: Name, Pct, Amount) */}
        <div className="col-span-7 space-y-2 font-mono text-xs pl-2">
          {CATEGORIES.map((cat) => (
            <div key={cat.name} className="grid grid-cols-12 items-center text-[11px]">
              {/* Category Name with Colored Indicator Dot */}
              <div className="col-span-6 flex items-center gap-2">
                <span
                  className="w-2 h-2 rounded-full shrink-0"
                  style={{ backgroundColor: cat.color }}
                />
                <span className="text-[#AFC4CC] font-sans truncate">{cat.name}</span>
              </div>

              {/* Percentage */}
              <div className="col-span-3 text-right text-[#F2F0E9] font-medium font-mono">
                {cat.pct}
              </div>

              {/* Dollar Amount */}
              <div className="col-span-3 text-right text-[#AFC4CC] font-mono">
                {cat.amount}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
