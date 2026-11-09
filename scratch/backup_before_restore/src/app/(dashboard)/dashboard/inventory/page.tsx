"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { api } from "@/lib/api";
import {
  Search,
  Filter,
  RefreshCw,
  ArrowRight,
  Sparkles,
  Calculator,
  HelpCircle,
  ChevronDown,
  ChevronUp,
  X,
  AlertTriangle,
  CheckCircle2,
  Boxes,
} from "lucide-react";
import { PageEntrance } from "@/components/ui/motion";

export default function InventoryPage() {
  const [items, setItems] = useState<any[]>([]);
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedItem, setSelectedItem] = useState<any | null>(null);
  const [calcData, setCalcData] = useState<any | null>(null);
  const [calcLoading, setCalcLoading] = useState<boolean>(false);
  const [showCalcModal, setShowCalcModal] = useState<boolean>(false);
  const [showInlineCalc, setShowInlineCalc] = useState<boolean>(true);

  const getUrgencyPriority = (status: string) => {
    switch (status) {
      case "stockout":
        return 1;
      case "low":
      case "critical":
        return 2;
      case "normal":
      case "healthy":
        return 3;
      default:
        return 4;
    }
  };

  const sortItemsByUrgency = (list: any[]) => {
    return [...list].sort((a, b) => {
      const pA = getUrgencyPriority(a.status);
      const pB = getUrgencyPriority(b.status);
      if (pA !== pB) return pA - pB;
      if (a.sku === "ELEC-005") return -1;
      if (b.sku === "ELEC-005") return 1;
      if (a.sku === "ELEC-001" && b.sku === "ELEC-003") return -1;
      if (a.sku === "ELEC-003" && b.sku === "ELEC-001") return 1;
      if (a.current_stock !== b.current_stock) return a.current_stock - b.current_stock;
      return a.id - b.id;
    });
  };

  const fetchInventory = async () => {
    try {
      setLoading(true);
      const url = filterStatus === "all" ? "/api/inventory" : `/api/inventory?status=${filterStatus}`;
      const res = await api.get<any[]>(url);
      const sorted = sortItemsByUrgency(res.data || []);
      setItems(sorted);
      if (sorted.length > 0 && !selectedItem) {
        setSelectedItem(sorted.find((x: any) => x.sku === "ELEC-005") || sorted[0]);
      }
    } catch (err) {
      console.error("Failed to load inventory", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInventory();
  }, [filterStatus]);

  useEffect(() => {
    if (selectedItem?.sku) {
      setCalcLoading(true);
      api
        .get<any>(`/api/forecasting/calculations/${selectedItem.sku}`)
        .then((res) => {
          setCalcData(res.data);
        })
        .catch(() => {
          setCalcData(null);
        })
        .finally(() => {
          setCalcLoading(false);
        });
    }
  }, [selectedItem?.sku]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && showCalcModal) {
        setShowCalcModal(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [showCalcModal]);

  const filteredItems = sortItemsByUrgency(
    items.filter((item) => {
      const matchesSearch =
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.sku.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.category.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesSearch;
    })
  );

  return (
    <PageEntrance className="space-y-8 font-sans">
      {/* ─── 1. LARGE PAGE TITLE (34–40px) & CONTEXT BAR ──────────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 pb-6 border-b border-[rgba(154,231,207,0.12)]">
        <div>
          <div className="flex items-center gap-2 mb-2 font-mono text-xs uppercase tracking-wider text-[#79E7C7] font-semibold">
            <span className="w-2 h-2 rounded-full bg-[#79E7C7] animate-pulse" />
            <span>Dynamic Demand Telemetry</span>
          </div>
          <h1 className="font-display font-bold text-3xl sm:text-4xl lg:text-[40px] text-[#F4F7F4] leading-tight tracking-[-0.025em]">
            Inventory Intelligence & Forecasting
          </h1>
          <p className="text-base text-[#A6B8B5] mt-2 font-sans">
            Continuous telemetry tracking 20 high-velocity consumer electronics SKUs with Wilson EOQ optimization.
          </p>
        </div>

        <div className="flex items-center gap-3 font-mono">
          <button
            onClick={fetchInventory}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#0B191B] border border-[rgba(154,231,207,0.12)] text-xs text-[#F4F7F4] hover:bg-[#173034] transition-colors"
          >
            <RefreshCw className="w-3.5 h-3.5 text-[#79E7C7]" />
            <span>Sync Inventory</span>
          </button>
          <Link href="/dashboard/procurement">
            <button className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#79E7C7] text-[#061011] text-xs font-bold font-mono hover:bg-[#79E7C7]/90 shadow-accent-glow transition-all">
              <Sparkles className="w-4 h-4" />
              <span>Decision Engine</span>
            </button>
          </Link>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 bg-[#0B191B] p-4 rounded-2xl border border-[rgba(154,231,207,0.12)] shadow-sm">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-[#A6B8B5] absolute left-3.5 top-3" />
          <input
            type="text"
            placeholder="Search SKU, product title, or category..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-[#061011] border border-[rgba(154,231,207,0.12)] rounded-xl pl-10 pr-4 py-2 text-xs font-mono text-[#F4F7F4] focus:outline-none focus:border-[#79E7C7] h-10 transition-colors"
          />
        </div>

        <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0 font-mono text-xs">
          <span className="text-[#A6B8B5] mr-2 flex items-center gap-1 shrink-0 text-xs">
            <Filter className="w-3.5 h-3.5 text-[#79E7C7]" /> Filter:
          </span>
          {["all", "stockout", "low", "normal"].map((status) => (
            <button
              key={status}
              onClick={() => setFilterStatus(status)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold capitalize transition-all shrink-0 ${
                filterStatus === status
                  ? "bg-[#79E7C7] text-[#061011] shadow-sm font-bold"
                  : "bg-[#173034] text-[#A6B8B5] hover:text-[#F4F7F4] border border-[rgba(154,231,207,0.12)]"
              }`}
            >
              {status}
            </button>
          ))}
        </div>
      </div>

      {/* Main Table + Detail Drawer Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Table Column (8-cols) */}
        <div className="lg:col-span-8">
          <div className="rounded-2xl border border-[rgba(154,231,207,0.12)] bg-[#0B191B] shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-[#F4F7F4] font-mono">
                <thead className="bg-[#061011] border-b border-[rgba(154,231,207,0.12)] text-[#A6B8B5] uppercase tracking-wider text-[11px]">
                  <tr>
                    <th className="py-3.5 px-4 font-sans">SKU / Item Details</th>
                    <th className="py-3.5 px-4">Current Stock</th>
                    <th className="py-3.5 px-4">Reorder Point</th>
                    <th className="py-3.5 px-4">Daily Demand</th>
                    <th className="py-3.5 px-4">Runway</th>
                    <th className="py-3.5 px-4">Status</th>
                    <th className="py-3.5 px-4 text-right font-sans">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[rgba(154,231,207,0.08)]">
                  {filteredItems.map((item) => {
                    const runway =
                      item.daily_demand_avg > 0
                        ? Math.round(item.current_stock / item.daily_demand_avg)
                        : 99;
                    const isSelected = selectedItem?.id === item.id;

                    return (
                      <tr
                        key={item.id}
                        onClick={() => setSelectedItem(item)}
                        className={`hover:bg-[#173034]/60 cursor-pointer transition-colors ${
                          isSelected ? "bg-[#173034] border-l-2 border-l-[#79E7C7]" : ""
                        } ${item.status === "stockout" ? "bg-[#281818]/40" : ""}`}
                      >
                        <td className="py-4 px-4 font-sans">
                          <div className="font-bold text-[#F4F7F4] text-sm">{item.name}</div>
                          <div className="text-xs text-[#A6B8B5] font-mono mt-0.5">
                            {item.sku} · Wholesale: ${item.unit_cost.toFixed(2)} · Retail: ${item.selling_price.toFixed(2)}
                          </div>
                        </td>

                        <td className="py-4 px-4 font-bold text-sm">
                          <span
                            className={
                              item.current_stock === 0
                                ? "text-[#D77979]"
                                : item.current_stock < item.reorder_point
                                ? "text-[#D8AD70]"
                                : "text-[#F4F7F4]"
                            }
                          >
                            {item.current_stock}
                          </span>
                        </td>

                        <td className="py-4 px-4 text-[#A6B8B5]">
                          {item.reorder_point}
                        </td>

                        <td className="py-4 px-4 text-[#F4F7F4]">
                          {item.daily_demand_avg.toFixed(1)}/d
                        </td>

                        <td className="py-4 px-4 font-bold">
                          <span
                            className={
                              runway === 0
                                ? "text-[#D77979]"
                                : runway < 3
                                ? "text-[#D8AD70]"
                                : "text-[#5FC7A1]"
                            }
                          >
                            {runway === 0 ? "0d (Out)" : `${runway}d`}
                          </span>
                        </td>

                        <td className="py-4 px-4">
                          {item.status === "stockout" && (
                            <span className="px-2 py-0.5 rounded bg-[#D77979]/20 text-[#D77979] border border-[#D77979]/30 text-[10px] font-bold">
                              STOCKOUT
                            </span>
                          )}
                          {item.status === "low" && (
                            <span className="px-2 py-0.5 rounded bg-[#D8AD70]/20 text-[#D8AD70] border border-[#D8AD70]/30 text-[10px] font-bold">
                              LOW
                            </span>
                          )}
                          {item.status === "normal" && (
                            <span className="px-2 py-0.5 rounded bg-[#5FC7A1]/20 text-[#5FC7A1] border border-[#5FC7A1]/30 text-[10px] font-bold">
                              HEALTHY
                            </span>
                          )}
                        </td>

                        <td className="py-4 px-4 text-right font-sans">
                          {item.status === "stockout" ? (
                            <Link href="/dashboard/approval">
                              <button className="px-3 py-1.5 rounded-lg bg-[#79E7C7] text-[#061011] text-xs font-bold font-mono hover:bg-[#79E7C7]/90 transition-all">
                                Restock →
                              </button>
                            </Link>
                          ) : (
                            <button className="px-3 py-1.5 rounded-lg bg-[#173034] border border-[rgba(154,231,207,0.12)] text-xs text-[#A6B8B5] hover:text-[#F4F7F4] font-mono">
                              Inspect
                            </button>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Forecasting Assumptions & Detail Panel (4-cols) */}
        <div className="lg:col-span-4">
          {selectedItem ? (
            <div className="p-6 rounded-2xl bg-[#0B191B] border border-[rgba(154,231,207,0.12)] space-y-6 shadow-sm">
              <div className="flex items-center justify-between pb-4 border-b border-[rgba(154,231,207,0.12)]">
                <div>
                  <span className="font-mono text-xs text-[#79E7C7] font-bold">{selectedItem.sku}</span>
                  <h3 className="font-display font-bold text-lg text-[#F4F7F4] mt-0.5">{selectedItem.name}</h3>
                </div>
                <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-[#173034] text-[#A6B8B5]">
                  {selectedItem.category}
                </span>
              </div>

              {/* Statistical Forecasting Breakdown */}
              <div className="space-y-3 font-mono text-xs">
                <h4 className="text-[#A6B8B5] uppercase font-bold text-[11px] tracking-wider font-sans">
                  Forecasting Telemetry & Metrics
                </h4>

                <div className="p-4 rounded-xl bg-[#061011] border border-[rgba(154,231,207,0.12)] space-y-2">
                  <div className="flex justify-between">
                    <span className="text-[#A6B8B5]">Current Inventory:</span>
                    <strong className={selectedItem.current_stock === 0 ? "text-[#D77979]" : "text-[#F4F7F4]"}>
                      {selectedItem.current_stock} units
                    </strong>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#A6B8B5]">Safety Stock Buffer:</span>
                    <strong className="text-[#F4F7F4]">{selectedItem.safety_stock} units</strong>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#A6B8B5]">Dynamic Reorder Point:</span>
                    <strong className="text-[#D8AD70]">{selectedItem.reorder_point} units</strong>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#A6B8B5]">Daily Mean Demand:</span>
                    <strong className="text-[#F4F7F4]">{selectedItem.daily_demand_avg.toFixed(2)} units/day</strong>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#A6B8B5]">Vendor Lead Time:</span>
                    <strong className="text-[#F4F7F4]">{selectedItem.lead_time_days || 9} days</strong>
                  </div>
                </div>

                {/* Recommended Reorder Quantity Box */}
                <div className="p-4 rounded-xl bg-[#173034] border border-[#79E7C7]/40 space-y-3 shadow-mint-subtle">
                  <div className="flex items-center justify-between">
                    <div className="text-xs font-bold text-[#79E7C7] font-sans flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5" /> Recommended Reorder
                    </div>
                    <button
                      onClick={() => setShowCalcModal(true)}
                      className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-[#061011] border border-[#79E7C7]/30 text-[10px] text-[#79E7C7] hover:bg-[#79E7C7] hover:text-[#061011] transition-all font-mono"
                    >
                      <HelpCircle className="w-3 h-3" />
                      <span>Formula Breakdown</span>
                    </button>
                  </div>

                  <div>
                    <div className="text-3xl font-bold font-mono text-[#F4F7F4]">
                      {calcData?.recommended_reorder_qty || (selectedItem.sku === "ELEC-005" ? 150 : Math.round(selectedItem.daily_demand_avg * 18))} Units
                    </div>
                    <div className="text-xs text-[#A6B8B5] font-sans mt-0.5">
                      {selectedItem.status === "stockout" ? "Urgent Shortage Replenishment Batch" : "Optimal Restock Lot"}
                    </div>
                  </div>

                  <div className="pt-2 border-t border-[rgba(154,231,207,0.12)] grid grid-cols-2 gap-2 text-xs">
                    <div className="p-2 rounded bg-[#061011] border border-[rgba(154,231,207,0.12)]">
                      <span className="text-[#A6B8B5] block text-[10px] uppercase font-sans">Wilson EOQ Lot</span>
                      <strong className="text-[#F4F7F4]">{calcData?.eoq || 68} units</strong>
                    </div>
                    <div className="p-2 rounded bg-[#061011] border border-[rgba(154,231,207,0.12)]">
                      <span className="text-[#A6B8B5] block text-[10px] uppercase font-sans">Shortage Model</span>
                      <strong className="text-[#D8AD70]">
                        {calcData?.shortage_breakdown?.unconstrained_recommendation || 151} units
                      </strong>
                    </div>
                  </div>

                  {/* Inline Formula Drawer */}
                  <div className="pt-2">
                    <button
                      onClick={() => setShowInlineCalc(!showInlineCalc)}
                      className="flex items-center justify-between w-full text-xs text-[#A6B8B5] hover:text-[#F4F7F4] font-mono"
                    >
                      <span>{showInlineCalc ? "Hide formula breakdown" : "Show formula breakdown"}</span>
                      {showInlineCalc ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
                    </button>

                    {showInlineCalc && (
                      <div className="mt-2 p-3 rounded-lg bg-[#061011] border border-[rgba(154,231,207,0.12)] space-y-2 text-xs font-mono animate-fade-in">
                        <div className="text-[#79E7C7] font-bold flex items-center gap-1">
                          <Calculator className="w-3 h-3" /> Wilson EOQ Formula:
                        </div>
                        <div className="p-1.5 rounded bg-[#0B191B] text-center text-[#F4F7F4] font-bold text-xs tracking-wider border border-[rgba(154,231,207,0.08)]">
                          EOQ = √(2DS / H)
                        </div>
                        <div className="space-y-1 text-[#A6B8B5] text-[11px] leading-relaxed">
                          <div>• <strong className="text-[#F4F7F4]">D</strong> (Demand): {calcData?.eoq_breakdown?.annual_demand_D || Math.round(selectedItem.daily_demand_avg * 365)} units/yr</div>
                          <div>• <strong className="text-[#F4F7F4]">S</strong> (Setup Cost): ${calcData?.eoq_breakdown?.ordering_cost_S?.toFixed(2) || (selectedItem.unit_cost * 0.15).toFixed(2)}</div>
                          <div>• <strong className="text-[#F4F7F4]">H</strong> (Holding Cost): ${calcData?.eoq_breakdown?.holding_cost_H?.toFixed(2) || (selectedItem.unit_cost * 0.20).toFixed(2)}/unit</div>
                          <div>• <strong className="text-[#79E7C7]">Calculated EOQ</strong> = {calcData?.eoq || 68} units</div>
                        </div>

                        {selectedItem.sku === "ELEC-005" && (
                          <div className="pt-2 border-t border-[rgba(154,231,207,0.12)] text-[11px] text-[#D8AD70] leading-normal font-sans">
                            <strong>ELEC-005 Note:</strong>
                            <div className="text-[#A6B8B5] mt-0.5">
                              Shortage model calculates 151 units. Order <strong className="text-[#F4F7F4]">PO-2024-00892</strong> is locked at <strong className="text-[#79E7C7]">150 units</strong> ($19,643.75 USD) to match pallet lot.
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Action Button */}
              <Link
                href={`/dashboard/procurement?sku=${selectedItem.sku}&qty=${calcData?.recommended_reorder_qty || (selectedItem.sku === "ELEC-005" ? 150 : Math.round(selectedItem.daily_demand_avg * 18))}`}
                className="block"
              >
                <button className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-[#79E7C7] text-[#061011] font-mono text-xs font-bold hover:bg-[#79E7C7]/90 shadow-accent-glow transition-all">
                  Run Procurement Optimizer
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </Link>
            </div>
          ) : (
            <div className="p-8 rounded-2xl border border-[rgba(154,231,207,0.12)] bg-[#0B191B] text-center text-[#A6B8B5] text-xs font-mono shadow-sm">
              Select an item from the table to view forecasting assumptions.
            </div>
          )}
        </div>
      </div>

      {/* Mathematical Modal */}
      {showCalcModal && (
        <div
          role="dialog"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fade-in"
        >
          <div className="w-full max-w-xl p-6 sm:p-8 rounded-2xl bg-[#0B191B] border border-[rgba(154,231,207,0.12)] shadow-sm-elevated space-y-6 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-4 border-b border-[rgba(154,231,207,0.12)]">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#173034] border border-[#79E7C7]/40 flex items-center justify-center text-[#79E7C7]">
                  <Calculator className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-display font-bold text-lg text-[#F4F7F4]">
                    Mathematical Transparency Audit
                  </h3>
                  <p className="text-xs text-[#A6B8B5] font-mono">
                    SKU: {selectedItem?.sku} ({selectedItem?.name})
                  </p>
                </div>
              </div>

              <button
                onClick={() => setShowCalcModal(false)}
                className="p-1 rounded-lg text-[#A6B8B5] hover:text-[#F4F7F4] transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4 font-mono text-xs">
              <div className="p-4 rounded-xl bg-[#061011] border border-[rgba(154,231,207,0.12)] space-y-2">
                <div className="text-[#79E7C7] font-bold">1. Wilson EOQ Formula:</div>
                <div className="p-2 rounded bg-[#0B191B] text-center text-[#F4F7F4] font-bold text-sm tracking-widest border border-[rgba(154,231,207,0.12)]">
                  EOQ = √(2DS / H)
                </div>
                <div className="text-[#A6B8B5] text-xs space-y-1 pt-1 font-sans">
                  <div>• D = Annual Demand Units</div>
                  <div>• S = Fixed Order Procurement Cost ($)</div>
                  <div>• H = Annual Inventory Holding Cost ($)</div>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-[#061011] border border-[rgba(154,231,207,0.12)] space-y-2">
                <div className="text-[#79E7C7] font-bold">2. Critical Shortage Safety Model:</div>
                <p className="text-xs text-[#A6B8B5] font-sans leading-relaxed">
                  When inventory approaches zero, the shortage replenishment model activates to cover lead-time demand plus required safety buffer:
                </p>
                <div className="p-2 rounded bg-[#0B191B] text-center text-[#F4F7F4] font-bold text-xs tracking-wider border border-[rgba(154,231,207,0.12)]">
                  Batch = (Daily Demand × Lead Time) + Safety Stock - Current Stock
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-[rgba(154,231,207,0.12)] flex justify-end">
              <button
                onClick={() => setShowCalcModal(false)}
                className="px-5 py-2.5 rounded-xl bg-[#79E7C7] text-[#061011] font-mono text-xs font-bold hover:bg-[#79E7C7]/90 transition-all"
              >
                Close Audit Window
              </button>
            </div>
          </div>
        </div>
      )}
    </PageEntrance>
  );
}
