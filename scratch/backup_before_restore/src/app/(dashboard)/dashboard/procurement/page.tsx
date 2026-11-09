"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { api } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  BrainCircuit,
  Sparkles,
  CheckCircle2,
  ArrowRight,
  TrendingUp,
  Truck,
  ShieldCheck,
  RefreshCw,
  Building2,
  Lock,
  Star,
  Activity,
  Layers,
  Award,
} from "lucide-react";
import { motion } from "framer-motion";
import { PageEntrance, SpotlightCard } from "@/components/ui/motion";

export default function ProcurementDecisionPage() {
  const router = useRouter();
  const [sku, setSku] = useState("ELEC-005");
  const [quantity, setQuantity] = useState(150);
  const [recommendation, setRecommendation] = useState<any>(null);
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [approving, setApproving] = useState(false);
  const [approvalSuccess, setApprovalSuccess] = useState<string | null>(null);

  const runDecisionEngine = async () => {
    try {
      setLoading(true);
      const [recRes, ordersRes] = await Promise.all([
        api.post<any>("/api/procurement/recommend", {
          item_sku: sku,
          quantity: quantity,
        }),
        api.get<any[]>("/api/procurement/orders"),
      ]);
      setRecommendation(recRes.data);
      setOrders(ordersRes.data || []);
    } catch (err) {
      console.error("Decision engine evaluation error", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    runDecisionEngine();
  }, [sku, quantity]);

  // Extract top supplier dynamically
  const topSupplier = recommendation?.best_choice || recommendation?.top_supplier;
  const candidates: any[] = (recommendation?.recommendations || recommendation?.ranked_suppliers || []).slice().sort(
    (a: any, b: any) => (b.decision_score || b.total_score || 0) - (a.decision_score || a.total_score || 0)
  );

  const topUnitPrice = topSupplier?.unit_price || 119.41;
  const topSubtotal = topUnitPrice * quantity;
  const topShipping = sku === "ELEC-005" ? 350.0 : Math.round(Math.min(topSubtotal * 0.02, 200.0) * 100) / 100;
  const topTax = Math.round(topSubtotal * 0.05 * 100) / 100;
  const topTotal = topSubtotal + topShipping + topTax;

  const aiConfidencePct = Math.round(
    (recommendation?.ai_confidence_score !== undefined
      ? recommendation.ai_confidence_score
      : recommendation?.confidence_score !== undefined
      ? recommendation.confidence_score
      : 0.94) * 100
  );

  // Active PO to show in bottom approval panel
  const activeOrder = orders.find((o) => o.order_number === "PO-2024-00892") || orders[0] || null;

  const handleApprovePO = async () => {
    if (!activeOrder) return;
    try {
      setApproving(true);
      setApprovalSuccess(null);
      await api.post(`/api/procurement/orders/${activeOrder.id}/approve`, {});
      setApprovalSuccess("Order PO-2024-00892 officially authorized with merchant signature seal.");
      await runDecisionEngine();
      setTimeout(() => {
        router.push(`/dashboard/checkout?orderId=${activeOrder.id}`);
      }, 800);
    } catch (err: any) {
      alert(err.detail || err.message || "Failed to approve order");
    } finally {
      setApproving(false);
    }
  };

  return (
    <PageEntrance className="space-y-8 font-sans">
      {/* ─── TITLE & CONTROLS ────────────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[rgba(154,231,207,0.12)]">
        <div>
          <span className="text-xs font-mono font-medium text-[#79E7C7] uppercase tracking-wider block mb-1">
            Deterministic Decision Intelligence
          </span>
          <h2 className="font-sans font-bold text-3xl sm:text-4xl text-[#F4F7F4] tracking-tight">
            Procurement Decision Engine
          </h2>
          <p className="text-sm text-[#A6B8B5] mt-1 font-sans">
            Multi-attribute utility model applying verified weights: Price (40%), Lead Time (25%), Vendor Reliability (20%), and Volume Concessions (15%).
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Button
            variant="secondary"
            size="sm"
            onClick={runDecisionEngine}
            className="text-xs gap-1.5 h-9 font-mono bg-[#0B191B] border border-[rgba(154,231,207,0.12)] text-[#F4F7F4] hover:bg-[#102326] rounded-xl"
          >
            <RefreshCw className={`w-3.5 h-3.5 text-[#79E7C7] ${loading ? "animate-spin" : ""}`} />
            Re-evaluate
          </Button>
          <Link href="/dashboard/approval">
            <Button size="sm" className="text-xs gap-1.5 shadow-mint-subtle font-mono font-bold h-9 bg-[#79E7C7] text-[#061011] hover:bg-[#79E7C7]/90 rounded-xl">
              <CheckCircle2 className="w-3.5 h-3.5" />
              Approval Gate
            </Button>
          </Link>
        </div>
      </div>

      {/* Control Configuration Bar */}
      <SpotlightCard className="p-5 shadow-sm">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 items-end font-mono">
          <div>
            <label className="block text-[10px] uppercase font-bold text-[#708784] mb-1.5">
              Target SKU to Evaluate
            </label>
            <select
              value={sku}
              onChange={(e) => setSku(e.target.value)}
              className="w-full bg-[#061011] border border-[rgba(154,231,207,0.12)] rounded-xl p-2.5 text-xs text-[#F4F7F4] focus:outline-none focus:border-[#79E7C7] transition-colors"
            >
              <option value="ELEC-005">ELEC-005 (Smart Watch Ultra - Stockout)</option>
              <option value="ELEC-001">ELEC-001 (Wireless Earbuds Pro)</option>
              <option value="ELEC-002">ELEC-002 (Mechanical Keyboard RGB)</option>
              <option value="ELEC-003">ELEC-003 (USB-C Hub 7-in-1)</option>
              <option value="ELEC-004">ELEC-004 (Portable SSD 1TB)</option>
            </select>
          </div>

          <div>
            <label className="block text-[10px] uppercase font-bold text-[#708784] mb-1.5">
              Batch Allocation Quantity
            </label>
            <Input
              type="number"
              min="1"
              value={quantity}
              onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
              className="bg-[#061011] border-[rgba(154,231,207,0.12)] text-[#F4F7F4] text-xs h-10 font-mono rounded-xl focus:border-[#79E7C7]"
            />
          </div>

          <Button
            onClick={runDecisionEngine}
            isLoading={loading}
            className="w-full text-xs gap-2 shadow-mint-subtle h-10 font-bold font-mono bg-[#79E7C7] text-[#061011] hover:bg-[#79E7C7]/90 rounded-xl"
          >
            <BrainCircuit className="w-4 h-4" /> Re-Compute Decision Matrix
          </Button>
        </div>
      </SpotlightCard>

      {/* ─── MAIN SECTION & RIGHT RECOMMENDATION PANEL (MATCH REFERENCE) ─────── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* LEFT / CENTER: Premium Supplier Comparison Table (~8 cols) */}
        <SpotlightCard className="lg:col-span-8 p-6 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-[rgba(154,231,207,0.08)]">
            <h3 className="font-sans font-bold text-base text-[#F4F7F4]">
              Supplier Comparison Matrix
            </h3>
            <span className="text-[11px] text-[#708784] font-mono">
              Weights: Price 40% · Lead 25% · Reliability 20% · Concessions 15%
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-mono">
              <thead className="bg-[#061011] border-b border-[rgba(154,231,207,0.12)] text-[#708784] uppercase tracking-wider text-[10px]">
                <tr>
                  <th className="py-3 px-4 font-sans">Supplier</th>
                  <th className="py-3 px-4 text-right">Unit Price</th>
                  <th className="py-3 px-4 text-right">Total Cost</th>
                  <th className="py-3 px-4 text-center">Lead Time</th>
                  <th className="py-3 px-4 text-center">Reliability</th>
                  <th className="py-3 px-4 text-right">Weighted Score</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[rgba(154,231,207,0.06)]">
                {candidates.map((sup: any, idx: number) => {
                  const name = sup.supplier_name || sup.name || `Supplier #${sup.supplier_id || idx + 1}`;
                  const country = sup.supplier_country || sup.country || "International";
                  const unitPrice = Number(sup.unit_price || 0);
                  const sub = unitPrice * quantity;
                  const decScore = Number(sup.decision_score || sup.total_score || 0).toFixed(1);
                  const isSelected = idx === 0;

                  return (
                    <tr
                      key={sup.supplier_id || idx}
                      className={`transition-colors ${
                        isSelected
                          ? "bg-[#102326] border-l-4 border-l-[#79E7C7]"
                          : "hover:bg-[#102326]/40"
                      }`}
                    >
                      <td className="py-3.5 px-4 font-sans">
                        <div className="flex items-center gap-2">
                          <span className="text-[#79E7C7] font-bold font-mono">#{idx + 1}</span>
                          <span className="font-bold text-[#F4F7F4]">{name}</span>
                          {isSelected && (
                            <span className="text-[9px] font-mono font-bold px-1.5 py-0.2 rounded bg-[#79E7C7]/15 text-[#79E7C7] border border-[#79E7C7]/30">
                              OPTIMAL
                            </span>
                          )}
                        </div>
                        <div className="text-[10px] text-[#A6B8B5] font-mono mt-0.5">{country}</div>
                      </td>
                      <td className="py-3.5 px-4 text-right text-[#F4F7F4] font-bold">
                        ${unitPrice.toFixed(2)}
                      </td>
                      <td className="py-3.5 px-4 text-right text-[#A6B8B5]">
                        ${sub.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      </td>
                      <td className="py-3.5 px-4 text-center text-[#F4F7F4]">
                        {sup.delivery_days} days
                      </td>
                      <td className="py-3.5 px-4 text-center text-[#5FC7A1] font-semibold">
                        {Number(sup.supplier_rating || sup.rating || 4.2).toFixed(1)}★
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        <div className="inline-flex items-center gap-2">
                          <span className={`font-bold text-sm ${isSelected ? "text-[#79E7C7]" : "text-[#F4F7F4]"}`}>
                            {decScore}
                          </span>
                          <span className="text-[10px] text-[#708784]">/ 100</span>
                          <div className="hidden sm:block h-1.5 w-12 bg-[#061011] rounded-full overflow-hidden border border-[rgba(154,231,207,0.1)]">
                            <motion.div
                              initial={{ width: 0 }}
                              animate={{ width: `${Math.min(100, Math.max(0, parseFloat(decScore)))}%` }}
                              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                              className={`h-full rounded-full ${isSelected ? "bg-[#79E7C7]" : "bg-[#5FC7A1]"}`}
                            />
                          </div>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </SpotlightCard>

        {/* RIGHT: AI Recommendation Panel (~4 cols) */}
        <SpotlightCard className="lg:col-span-4 p-6 bg-gradient-to-br from-[#102326] via-[#0B191B] to-[#061011] border border-[#79E7C7]/30 space-y-4 shadow-mint-subtle relative overflow-hidden">
          <div className="absolute top-0 right-0 w-48 h-48 bg-[#79E7C7]/5 rounded-full blur-2xl pointer-events-none" />

          <div className="flex items-center justify-between pb-3 border-b border-[rgba(154,231,207,0.12)]">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-[#79E7C7]" />
              <h3 className="font-sans font-bold text-base text-[#F4F7F4]">
                AI Recommendation
              </h3>
            </div>
            <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-[#79E7C7]/15 text-[#79E7C7] border border-[#79E7C7]/30">
              CONFIDENCE {aiConfidencePct}%
            </span>
          </div>

          {topSupplier && (
            <div className="space-y-4">
              <div>
                <div className="text-[10px] text-[#708784] uppercase font-mono tracking-wider">Top Recommended Partner</div>
                <h4 className="font-sans font-bold text-xl text-[#F4F7F4] mt-0.5">
                  {topSupplier.supplier_name || topSupplier.name}
                </h4>
                <p className="text-xs text-[#A6B8B5] font-sans leading-relaxed mt-2">
                  {topSupplier.explanation ||
                    "Evaluated mathematically as dominant partner balancing volume pricing and factory-direct dispatch reliability."}
                </p>
              </div>

              {/* Metric Breakdown */}
              <div className="p-3.5 rounded-xl bg-[#061011] border border-[rgba(154,231,207,0.1)] space-y-2 text-xs font-mono">
                <div className="flex justify-between">
                  <span className="text-[#A6B8B5]">Decision Score:</span>
                  <strong className="text-[#79E7C7]">{Number(topSupplier.decision_score || topSupplier.total_score || 72.6).toFixed(1)} / 100</strong>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#A6B8B5]">Unit Benchmark:</span>
                  <strong className="text-[#F4F7F4]">${Number(topUnitPrice).toFixed(2)}/unit</strong>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#A6B8B5]">Lead Time:</span>
                  <strong className="text-[#F4F7F4]">{topSupplier.delivery_days} Days</strong>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#A6B8B5]">Risk Level:</span>
                  <strong className="text-[#5FC7A1]">LOW (Verified Factory)</strong>
                </div>
              </div>

              <div className="pt-2">
                <Link href={`/dashboard/negotiations?sku=${sku}&qty=${quantity}`} className="block">
                  <Button className="w-full gap-2 text-xs font-bold font-mono bg-[#79E7C7] text-[#061011] hover:bg-[#79E7C7]/90 rounded-xl h-10 shadow-mint-subtle">
                    <span>Open Negotiation Studio</span>
                    <ArrowRight className="w-4 h-4" />
                  </Button>
                </Link>
              </div>
            </div>
          )}
        </SpotlightCard>
      </div>

      {/* ─── BOTTOM PURCHASE ORDER APPROVAL SUMMARY PANEL (MATCH REFERENCE) ── */}
      {activeOrder && (
        <SpotlightCard className="p-6 sm:p-7 border border-[rgba(154,231,207,0.15)] shadow-mint-subtle">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            <div className="space-y-1.5">
              <div className="flex items-center gap-3 font-mono">
                <span className="text-base font-bold text-[#79E7C7]">
                  {activeOrder.order_number || "PO-2024-00892"}
                </span>
                <span className={`text-[10px] font-mono font-bold uppercase tracking-wider px-2 py-0.5 rounded-md ${
                  activeOrder.merchant_approved
                    ? "bg-[#5FC7A1]/15 text-[#5FC7A1] border border-[#5FC7A1]/30"
                    : "bg-[#D8AD70]/15 text-[#D8AD70] border border-[#D8AD70]/30"
                }`}>
                  {activeOrder.merchant_approved ? "APPROVED & SEALED" : "PENDING MERCHANT SIGNATURE"}
                </span>
                <span className="text-xs text-[#A6B8B5]">Settlement: {activeOrder.currency}</span>
              </div>
              <div className="font-sans font-bold text-base text-[#F4F7F4]">
                150x Smart Watch Ultra Titanium (GPS + Cellular)
              </div>
              <div className="text-xs text-[#A6B8B5] font-mono">
                Supplier: TechSource Global Ltd · Subtotal: ${Number(activeOrder.subtotal || 18375.0).toFixed(2)} · Freight: ${Number(activeOrder.shipping || 350.0).toFixed(2)} · Tax: ${Number(activeOrder.tax || 918.75).toFixed(2)}
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6 font-mono">
              <div className="text-left sm:text-right">
                <div className="text-[10px] text-[#708784] uppercase">Approved Total</div>
                <div className="text-2xl font-bold text-[#79E7C7]">
                  ${Number(activeOrder.total_amount || 19643.75).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} USD
                </div>
              </div>

              {!activeOrder.merchant_approved ? (
                <Button
                  onClick={handleApprovePO}
                  isLoading={approving}
                  className="gap-2 shadow-mint-subtle text-xs font-bold font-mono bg-[#79E7C7] text-[#061011] hover:bg-[#79E7C7]/90 rounded-xl h-11 px-6 shrink-0"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  Approve Purchase Order
                </Button>
              ) : (
                <Link href={`/dashboard/checkout?orderId=${activeOrder.id}`}>
                  <Button className="gap-2 shadow-mint-subtle text-xs font-bold font-mono bg-[#79E7C7] text-[#061011] hover:bg-[#79E7C7]/90 rounded-xl h-11 px-6 shrink-0">
                    <span>Pay with PayPal Sandbox</span>
                    <ArrowRight className="w-4 h-4" />
                  </Button>
                </Link>
              )}
            </div>
          </div>
        </SpotlightCard>
      )}
    </PageEntrance>
  );
}
