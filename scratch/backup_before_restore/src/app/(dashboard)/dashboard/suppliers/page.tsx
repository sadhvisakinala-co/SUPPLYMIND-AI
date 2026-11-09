"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { api } from "@/lib/api";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Truck,
  Star,
  ShieldCheck,
  Globe2,
  DollarSign,
  ArrowRight,
  Bot,
  Sparkles,
  RefreshCw,
  Clock,
  Award,
  Building2,
} from "lucide-react";
import { PageEntrance } from "@/components/ui/motion";

export default function SuppliersPage() {
  const [suppliers, setSuppliers] = useState<any[]>([]);
  const [selectedSku, setSelectedSku] = useState<string>("ELEC-005");
  const [quotes, setQuotes] = useState<any[]>([]);
  const [quantity, setQuantity] = useState<number>(150);
  const [loading, setLoading] = useState<boolean>(true);

  const fetchSuppliersAndQuotes = async () => {
    try {
      setLoading(true);
      const [supRes, quoteRes] = await Promise.all([
        api.get<any[]>("/api/suppliers"),
        api.get<any[]>(`/api/suppliers/quotations/${selectedSku}`),
      ]);
      const sortedSups = (supRes.data || []).sort((a: any, b: any) => a.id - b.id);
      const sortedQuotes = (quoteRes.data || []).sort(
        (a: any, b: any) => (a.supplier_id || 0) - (b.supplier_id || 0)
      );

      setSuppliers(sortedSups);
      setQuotes(sortedQuotes);
    } catch (err) {
      console.error("Failed to load suppliers/quotes", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSuppliersAndQuotes();
  }, [selectedSku]);

  return (
    <PageEntrance className="space-y-8 font-sans">
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-mono font-semibold text-[#79E7C7] uppercase tracking-widest block mb-1">
            Global Sourcing Network
          </span>
          <h2 className="font-display font-bold text-3xl md:text-4xl font-bold font-display text-[#F4F7F4] tracking-tight">
            Supplier Quotations & Comparison
          </h2>
          <p className="text-sm text-[#A6B8B5] mt-1 font-sans">
            Multi-vendor quotation matrix ordered by verified suppliers across China, United States, and Germany.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Button
            variant="secondary"
            size="sm"
            onClick={fetchSuppliersAndQuotes}
            className="text-xs gap-1.5 h-9 font-mono bg-[#0B191B] border border-[rgba(154,231,207,0.12)] text-[#F4F7F4] hover:bg-[#173034] rounded-xl"
          >
            <RefreshCw className="w-3.5 h-3.5 text-[#79E7C7]" />
            Refresh Matrix
          </Button>
          <Link href="/dashboard/negotiations">
            <Button size="sm" className="text-xs gap-1.5 shadow-[0_0_24px_rgba(84,201,179,0.25)] font-mono font-bold h-9 bg-[#79E7C7] text-[#061011] hover:bg-[#79E7C7]/90 rounded-xl">
              <Bot className="w-3.5 h-3.5" />
              AI Negotiation Studio
            </Button>
          </Link>
        </div>
      </div>

      {/* ─── 3 ACCREDITED SUPPLIER TILES (Supplier #1, #2, #3) ─────────────── */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {suppliers.map((s, idx) => (
          <div
            key={s.id}
            className="p-6 rounded-2xl bg-[#0B191B]/90 border border-[rgba(154,231,207,0.12)] flex flex-col justify-between hover:border-[#79E7C7]/40 transition-all duration-200 shadow-sm backdrop-blur-md"
          >
            <div>
              <div className="flex items-start justify-between mb-4">
                <div className="w-10 h-10 rounded-xl bg-[#173034] border border-[#79E7C7]/30 flex items-center justify-center text-[#79E7C7]">
                  <Building2 className="w-5 h-5" />
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono font-bold uppercase tracking-wider px-2 py-0.5 rounded-md bg-[#173034] text-[#A6B8B5] border border-[rgba(154,231,207,0.12)]">
                    Supplier #{s.id}
                  </span>
                  <div className="flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-[#061011] border border-[rgba(154,231,207,0.12)] text-xs font-bold font-mono text-[#79E7C7]">
                    <Star className="w-3.5 h-3.5 fill-[#79E7C7]" />
                    <span>{s.rating.toFixed(1)}</span>
                  </div>
                </div>
              </div>

              <h3 className="font-display font-semibold text-lg text-[#F4F7F4] mb-1 tracking-tight">
                {s.name}
              </h3>
              <div className="text-xs text-[#A6B8B5] flex items-center gap-1.5 mb-4 font-mono">
                <Globe2 className="w-3.5 h-3.5" />
                <span>{s.country} · Code: {s.code}</span>
              </div>

              <div className="space-y-2 text-xs text-[#A6B8B5] pt-3 border-t border-[rgba(154,231,207,0.12)] font-mono">
                <div className="flex justify-between">
                  <span>Reliability Score:</span>
                  <strong className="text-[#F4F7F4]">{(s.reliability_score * 100).toFixed(0)}%</strong>
                </div>
                <div className="flex justify-between">
                  <span>Factory Lead Time:</span>
                  <strong className="text-[#F4F7F4]">{s.lead_time_days} Days</strong>
                </div>
                <div className="flex justify-between">
                  <span>Settlement Terms:</span>
                  <strong className="text-[#79E7C7] text-[11px]">{s.payment_terms}</strong>
                </div>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-[rgba(154,231,207,0.12)] text-xs text-[#A6B8B5] font-mono flex items-center justify-between">
              <span className="text-[#79E7C7] font-semibold">Active Catalog:</span>
              <span className="text-[#F4F7F4]">20 electronics SKUs</span>
            </div>
          </div>
        ))}
      </div>

      {/* ─── LIVE COMPARATIVE MATRIX ───────────────────────────────────────── */}
      <div className="p-6 sm:p-8 rounded-2xl bg-[#0B191B]/90 border border-[rgba(154,231,207,0.12)] shadow-sm backdrop-blur-md">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[rgba(154,231,207,0.12)] mb-6">
          <div>
            <h3 className="font-display font-semibold text-xl text-[#F4F7F4] tracking-tight">
              Multi-Supplier Quotation Matrix
            </h3>
            <p className="text-sm text-[#A6B8B5] mt-1 font-sans">
              Displayed in logical order (Supplier #1, #2, #3). Exact mathematical totals: subtotal = quantity × unit price.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 font-mono">
            <div>
              <label className="block text-xs uppercase font-bold text-[#A6B8B5] mb-1 font-sans">
                Target SKU
              </label>
              <select
                value={selectedSku}
                onChange={(e) => setSelectedSku(e.target.value)}
                className="bg-[#061011] border border-[rgba(154,231,207,0.12)] rounded-xl px-3 py-1.5 text-xs text-[#F4F7F4] focus:outline-none focus:border-[#79E7C7] font-sans transition-colors"
              >
                <option value="ELEC-005">ELEC-005 (Smart Watch Ultra - Stockout)</option>
                <option value="ELEC-001">ELEC-001 (Wireless Earbuds Pro)</option>
                <option value="ELEC-002">ELEC-002 (Mechanical Keyboard RGB)</option>
                <option value="ELEC-003">ELEC-003 (USB-C Multi-Port Hub)</option>
                <option value="ELEC-004">ELEC-004 (Portable SSD 1TB)</option>
                <option value="ELEC-010">ELEC-010 (Gaming Monitor 27&quot;)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs uppercase font-bold text-[#A6B8B5] mb-1 font-sans">
                Approved Quantity
              </label>
              <Input
                type="number"
                min="1"
                value={quantity}
                onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                className="w-28 h-8 text-xs bg-[#061011] border-[rgba(154,231,207,0.12)] text-[#F4F7F4] font-mono rounded-xl focus:border-[#79E7C7]"
              />
            </div>
          </div>
        </div>

        {/* ─── 3 SUPPLIER COMPARISON CARDS IN ORDER #1, #2, #3 ───────────────── */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-stretch">
          {quotes.map((q) => {
            const supplierId = q.supplier_id || q.supplier?.id;
            const supplierName = q.supplier_name || q.supplier?.name || `Supplier #${supplierId}`;
            const country = q.supplier_country || q.supplier?.country || "International";
            const quoteId = q.id || q.quotation_id;

            const hasBulk = quantity >= q.bulk_threshold && q.bulk_discount_pct > 0;
            const effectiveUnitPrice = hasBulk
              ? q.unit_price * (1 - q.bulk_discount_pct / 100)
              : q.unit_price;

            const subtotal = effectiveUnitPrice * quantity;
            const originalSubtotal = q.unit_price * quantity;
            const bulkSavings = originalSubtotal - subtotal;
            const shippingEst = selectedSku === "ELEC-005" ? 350.0 : Math.round(Math.min(subtotal * 0.02, 200.0) * 100) / 100;
            const taxEst = Math.round(subtotal * 0.05 * 100) / 100;
            const totalLanded = subtotal + shippingEst + taxEst;

            const isSupplier1 = supplierId === 1;

            return (
              <div
                key={quoteId || supplierId}
                className={`p-6 rounded-2xl border flex flex-col justify-between transition-all min-h-[500px] relative font-mono shadow-sm ${
                  isSupplier1
                    ? "border-[#79E7C7]/50 bg-[#173034]/80 shadow-[0_0_24px_rgba(84,201,179,0.25)]"
                    : "border-[rgba(154,231,207,0.12)] bg-[#061011]/90"
                }`}
              >
                {isSupplier1 && (
                  <div className="absolute -top-3 right-4 px-2.5 py-0.5 rounded-full bg-[#79E7C7] text-[#061011] text-xs font-bold uppercase tracking-wider font-mono">
                    Preferred Partner
                  </div>
                )}

                <div>
                  <div className="mb-4">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs font-mono font-bold uppercase tracking-wider px-2 py-0.5 rounded-md bg-[#061011] text-[#A6B8B5] border border-[rgba(154,231,207,0.12)]">
                        Supplier #{supplierId}
                      </span>
                      <span className="text-xs text-[#A6B8B5]">{country}</span>
                    </div>
                    <h4 className="font-display font-semibold text-lg text-[#F4F7F4] font-sans">
                      {supplierName}
                    </h4>
                  </div>

                  <div className="mb-3">
                    <div className="text-xs text-[#A6B8B5] font-sans mb-1">
                      Listed Quotation: <span className="line-through text-[#708784]">${q.unit_price.toFixed(2)}</span>
                    </div>
                    <div className="text-3xl font-bold font-mono text-[#79E7C7] tracking-tight">
                      ${effectiveUnitPrice.toFixed(2)}
                      <span className="text-xs text-[#A6B8B5] font-normal ml-1">/ unit</span>
                    </div>
                  </div>

                  {hasBulk ? (
                    <div className="text-xs text-[#5FC7A1] font-semibold mb-4 font-sans bg-[#5FC7A1]/10 border border-[#5FC7A1]/30 rounded-xl p-2.5">
                      ✓ {q.bulk_discount_pct}% Bulk Concession Applied ({q.bulk_threshold}+ units)
                    </div>
                  ) : (
                    <div className="text-xs text-[#A6B8B5] mb-4 font-sans bg-[#0B191B]/60 border border-[rgba(154,231,207,0.12)] rounded-xl p-2.5">
                      Base quote rate. Bulk tier unlocks at {q.bulk_threshold} units (-{q.bulk_discount_pct}%).
                    </div>
                  )}

                  <div className="space-y-2 text-xs text-[#A6B8B5] pt-3 border-t border-[rgba(154,231,207,0.12)]">
                    <div className="flex justify-between">
                      <span>Delivery SLA:</span>
                      <strong className="text-[#F4F7F4]">{q.delivery_days} Days</strong>
                    </div>
                    <div className="flex justify-between">
                      <span>MOQ Requirement:</span>
                      <strong className="text-[#F4F7F4]">{q.min_order_quantity} Units</strong>
                    </div>
                    <div className="flex justify-between">
                      <span>Warranty Period:</span>
                      <strong className="text-[#F4F7F4]">{q.warranty_months} Months</strong>
                    </div>

                    <div className="pt-3 border-t border-[rgba(154,231,207,0.12)] space-y-1.5 text-[11px]">
                      <div className="flex justify-between">
                        <span>Batch Subtotal ({quantity} × ${effectiveUnitPrice.toFixed(2)}):</span>
                        <strong className="text-[#F4F7F4]">${subtotal.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</strong>
                      </div>
                      <div className="flex justify-between">
                        <span>Estimated Shipping:</span>
                        <span className="text-[#F4F7F4]">${shippingEst.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Estimated Tax (5%):</span>
                        <span className="text-[#F4F7F4]">${taxEst.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between pt-2 border-t border-[rgba(154,231,207,0.12)] text-sm">
                        <span className="text-[#F4F7F4] font-sans font-bold">Estimated Landed:</span>
                        <strong className="text-[#79E7C7] font-bold font-mono">
                          ${totalLanded.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                        </strong>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-6 pt-4 border-t border-[rgba(154,231,207,0.12)] font-sans">
                  <Link
                    href={`/dashboard/negotiations?quotationId=${quoteId}&sku=${selectedSku}&qty=${quantity}`}
                    className="block"
                  >
                    <Button
                      size="sm"
                      className={`w-full gap-2 text-xs font-mono font-bold h-10 rounded-xl ${
                        isSupplier1
                          ? "bg-[#79E7C7] text-[#061011] hover:bg-[#79E7C7]/90 shadow-[0_0_24px_rgba(84,201,179,0.25)]"
                          : "bg-[#0B191B] border border-[rgba(154,231,207,0.12)] text-[#F4F7F4] hover:bg-[#173034]"
                      }`}
                    >
                      <Bot className="w-3.5 h-3.5" />
                      Initiate AI Negotiation
                    </Button>
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </PageEntrance>
  );
}
