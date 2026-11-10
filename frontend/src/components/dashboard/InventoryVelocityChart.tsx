"use client";

import React from "react";
import { Info } from "lucide-react";

export default function InventoryVelocityChart() {
  return (
    <div className="w-full h-full flex flex-col justify-between select-none">
      {/* Header with Title and Legend */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
        <div className="flex items-center gap-1.5">
          <h3 className="text-xs sm:text-sm font-bold text-[#F2F0E9] font-display">
            Inventory Trend &amp; Forecast
          </h3>
          <Info className="w-3.5 h-3.5 text-[#829DA8] hover:text-[#F2F0E9] cursor-pointer" />
        </div>

        {/* Legend matching reference */}
        <div className="flex items-center gap-3 text-[11px] font-mono shrink-0">
          <div className="flex items-center gap-1 text-[#AFC4CC]">
            <span className="w-2 h-2 rounded-full bg-[#B9F12F]" />
            <span>On Hand</span>
          </div>
          <div className="flex items-center gap-1 text-[#AFC4CC]">
            <span className="w-3 border-b-2 border-dashed border-[#38BDF8]" />
            <span>Forecast Demand</span>
          </div>
          <div className="flex items-center gap-1 text-[#AFC4CC]">
            <span className="w-3 border-b-2 border-dashed border-red-400" />
            <span>Reorder Point</span>
          </div>
        </div>
      </div>

      {/* Direct SVG Crisp Rendering */}
      <div className="relative w-full h-[160px] flex items-center justify-center">
        <svg viewBox="0 0 620 160" fill="none" className="w-full h-full">
          <defs>
            {/* Green Area Gradient */}
            <linearGradient id="chartGreenGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#B9F12F" stopOpacity="0.45" />
              <stop offset="60%" stopColor="#B9F12F" stopOpacity="0.12" />
              <stop offset="100%" stopColor="#B9F12F" stopOpacity="0" />
            </linearGradient>

            <filter id="dotGlow" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur stdDeviation="3" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          {/* Vertical Y-axis Label */}
          <text
            transform="rotate(-90 14 75)"
            x="14"
            y="75"
            fill="#829DA8"
            fontSize="8"
            fontFamily="sans-serif"
            textAnchor="middle"
            letterSpacing="0.04em"
          >
            Inventory (Units)
          </text>

          {/* Grid lines and Y labels */}
          {/* Y=250 */}
          <line x1="50" y1="12" x2="600" y2="12" stroke="rgba(242,240,233,0.06)" strokeDasharray="3 3" />
          <text x="32" y="16" fill="#829DA8" fontSize="9" fontFamily="monospace" textAnchor="middle">250</text>

          {/* Y=200 */}
          <line x1="50" y1="38" x2="600" y2="38" stroke="rgba(242,240,233,0.06)" strokeDasharray="3 3" />
          <text x="32" y="42" fill="#829DA8" fontSize="9" fontFamily="monospace" textAnchor="middle">200</text>

          {/* Y=150 */}
          <line x1="50" y1="64" x2="600" y2="64" stroke="rgba(242,240,233,0.06)" strokeDasharray="3 3" />
          <text x="32" y="68" fill="#829DA8" fontSize="9" fontFamily="monospace" textAnchor="middle">150</text>

          {/* Y=100 */}
          <line x1="50" y1="90" x2="600" y2="90" stroke="rgba(242,240,233,0.06)" strokeDasharray="3 3" />
          <text x="32" y="94" fill="#829DA8" fontSize="9" fontFamily="monospace" textAnchor="middle">100</text>

          {/* Y=50 */}
          <line x1="50" y1="116" x2="600" y2="116" stroke="rgba(242,240,233,0.06)" strokeDasharray="3 3" />
          <text x="32" y="120" fill="#829DA8" fontSize="9" fontFamily="monospace" textAnchor="middle">50</text>

          {/* Y=0 (Base axis) */}
          <line x1="50" y1="140" x2="600" y2="140" stroke="rgba(242,240,233,0.12)" />
          <text x="32" y="144" fill="#829DA8" fontSize="9" fontFamily="monospace" textAnchor="middle">0</text>

          {/* X Dates */}
          <text x="56" y="154" fill="#829DA8" fontSize="9" fontFamily="monospace">Jan 20</text>
          <text x="132" y="154" fill="#829DA8" fontSize="9" fontFamily="monospace">Jan 21</text>
          <text x="208" y="154" fill="#829DA8" fontSize="9" fontFamily="monospace">Jan 22</text>
          <text x="284" y="154" fill="#829DA8" fontSize="9" fontFamily="monospace">Jan 23</text>
          <text x="362" y="154" fill="#829DA8" fontSize="9" fontFamily="monospace">Jan 24</text>
          <text x="440" y="154" fill="#829DA8" fontSize="9" fontFamily="monospace">Jan 25</text>
          <text x="518" y="154" fill="#829DA8" fontSize="9" fontFamily="monospace">Jan 26</text>
          <text x="580" y="154" fill="#829DA8" fontSize="9" fontFamily="monospace">Jan 27</text>

          {/* Reorder Point Red Dashed Line across chart (y=116 -> 50 units) */}
          <line
            x1="50"
            y1="116"
            x2="600"
            y2="116"
            stroke="#EF4444"
            strokeWidth="1.8"
            strokeDasharray="4 4"
            opacity="0.85"
          />

          {/* On Hand Solid Area Fill */}
          <path
            d="M 72 38 C 146 45, 206 68, 284 102 C 324 122, 350 140, 380 140 L 72 140 Z"
            fill="url(#chartGreenGrad)"
          />

          {/* On Hand Line Curve */}
          <path
            d="M 72 38 C 146 45, 206 68, 284 102 C 324 122, 350 140, 380 140"
            stroke="#B9F12F"
            strokeWidth="2.5"
            strokeLinecap="round"
            fill="none"
          />

          {/* Forecast Demand Blue Dashed Curve (from Jan 24 to Jan 27) */}
          <path
            d="M 380 140 C 440 120, 510 98, 595 90"
            stroke="#38BDF8"
            strokeWidth="2.2"
            strokeDasharray="5 5"
            strokeLinecap="round"
            fill="none"
          />

          {/* Prominent Glowing Stockout Dot on Jan 24 (x=380, y=140) */}
          <circle
            cx="380"
            cy="140"
            r="6"
            fill="#FEF08A"
            stroke="#B9F12F"
            strokeWidth="3"
            filter="url(#dotGlow)"
          />
        </svg>
      </div>
    </div>
  );
}
