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
      // Sort suppliers by ID 1, 2, 3
      const sortedSups = (supRes.data || []).sort((a: any, b: any) => a.id - b.id);
      // Sort quotes in logical order: Supplier #1, #2, #3
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
    <div className="space-y-8 animate-fade-in font-sans">
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-mono font-semibold text-electric-teal uppercase tracking-widest block mb-1">
            Global Sourcing Network
          </span>
          <h2 className="font-display font-bold text-3xl text-soft-ivory">
            Supplier Quotations & Comparison
          </h2>
          <p className="text-xs text-silver-sage mt-1 font-mono">
            Multi-vendor quotation matrix ordered by verified suppliers across China, United States, and Germany.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Button
            variant="secondary"
            size="sm"
            onClick={fetchSuppliersAndQuotes}
            className="text-xs gap-1.5 h-9 font-mono"
          >
            <RefreshCw className="w-3.5 h-3.5 text-electric-teal" />
            Refresh Matrix
          </Button>
          <Link href="/dashboard/negotiations">
            <Button size="sm" className="text-xs gap-1.5 shadow-teal-subtle font-mono font-bold h-9">
              <Bot className="w-3.5 h-3.5" />
              AI Negotiation Studio
            </Button>
          </Link>
        </div>
      </div>

      {/* ─── 3 ACCREDITED SUPPLIER TILES (Supplier #1, #2, #3) ─────────────── */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {suppliers.map((s, idx) => (
          <Card
            key={s.id}
            variant="default"
            className="border-border-subtle p-6 flex flex-col justify-between hover:border-electric-teal/40 transition-all bg-charcoal"
          >
            <div>
              <div className="flex items-start justify-between mb-4">
                <div className="w-10 h-10 rounded-xl bg-surface border border-electric-teal/30 flex items-center justify-center text-electric-teal">
                  <Building2 className="w-5 h-5" />
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="text-[10px] font-mono">
                    Supplier #{s.id}
                  </Badge>
                  <div className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-graphite border border-border-subtle text-xs font-bold font-mono text-electric-teal">
                    <Star className="w-3.5 h-3.5 fill-electric-teal" />
                    <span>{typeof s.rating === "number" ? s.rating.toFixed(1) : (s.rating ?? "4.5")}</span>
                  </div>
                </div>
              </div>

              <h3 className="font-display font-bold text-lg text-soft-ivory mb-1">
                {s.name}
              </h3>
              <div className="text-xs text-silver-sage flex items-center gap-1.5 mb-4 font-mono">
                <Globe2 className="w-3.5 h-3.5" />
                <span>{s.country} · Code: {s.code}</span>
              </div>

              <div className="space-y-2 text-xs text-silver-sage pt-3 border-t border-border-subtle font-mono">
                <div className="flex justify-between">
                  <span>Reliability Score:</span>
                  <strong className="text-soft-ivory">
                    {typeof s.reliability_score === "number"
                      ? `${(s.reliability_score * 100).toFixed(0)}%`
                      : "95%"}
                  </strong>
                </div>
                <div className="flex justify-between">
                  <span>Factory Lead Time:</span>
                  <strong className="text-soft-ivory">{s.lead_time_days ?? "14"} Days</strong>
                </div>
                <div className="flex justify-between">
                  <span>Settlement Terms:</span>
                  <strong className="text-electric-teal text-[11px]">{s.payment_terms ?? "Net 30"}</strong>
                </div>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-border-subtle text-xs text-silver-sage font-mono flex items-center justify-between">
              <span className="text-electric-teal font-semibold">Active Catalog:</span>
              <span className="text-soft-ivory">20 electronics SKUs</span>
            </div>
          </Card>
        ))}
      </div>

      {/* ─── LIVE COMPARATIVE MATRIX ───────────────────────────────────────── */}
      <Card variant="default" className="border-border-subtle p-6 sm:p-8 bg-charcoal">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-border-subtle mb-6">
          <div>
            <h3 className="font-display font-bold text-xl text-soft-ivory">
              Multi-Supplier Quotation Matrix
            </h3>
            <p className="text-xs text-silver-sage mt-1 font-mono">
              Displayed in logical order (Supplier #1, #2, #3). Exact mathematical totals: subtotal = quantity × unit price.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 font-mono">
            <div>
              <label className="block text-[10px] uppercase font-bold text-silver-sage mb-1 font-sans">
                Target SKU
              </label>
              <select
                value={selectedSku}
                onChange={(e) => setSelectedSku(e.target.value)}
                className="bg-graphite border border-border-subtle rounded-lg px-3 py-1.5 text-xs text-soft-ivory focus:outline-none focus:border-electric-teal font-sans"
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
              <label className="block text-[10px] uppercase font-bold text-silver-sage mb-1 font-sans">
                Approved Quantity
              </label>
              <Input
                type="number"
                min="1"
                value={quantity}
                onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                className="w-28 h-8 text-xs bg-graphite border-border-subtle text-soft-ivory font-mono"
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

            // Mathematical precision
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
                className={`p-6 rounded-2xl border flex flex-col justify-between transition-all min-h-[500px] relative font-mono ${
                  isSupplier1
                    ? "border-electric-teal bg-surface/70 shadow-teal-subtle"
                    : "border-border-subtle bg-graphite/90"
                }`}
              >
                {isSupplier1 && (
                  <div className="absolute -top-3 right-4 px-2.5 py-0.5 rounded-full bg-electric-teal text-graphite text-[10px] font-bold uppercase tracking-wider font-mono">
                    Preferred Partner
                  </div>
                )}

                <div>
                  {/* Card Header with Supplier # and Name */}
                  <div className="mb-4">
                    <div className="flex items-center gap-2 mb-1">
                      <Badge variant="outline" className="text-[10px] font-bold font-mono">
                        Supplier #{supplierId}
                      </Badge>
                      <span className="text-xs text-silver-sage">{country}</span>
                    </div>
                    <h4 className="font-display font-bold text-lg text-soft-ivory font-sans">
                      {supplierName}
                    </h4>
                  </div>

                  {/* Pricing Details */}
                  <div className="mb-3">
                    <div className="text-xs text-silver-sage font-sans mb-1">
                      Listed Quotation: <span className="line-through text-soft-ivory/70">${typeof q.unit_price === "number" ? q.unit_price.toFixed(2) : "0.00"}</span>
                    </div>
                    <div className="text-3xl font-bold font-mono text-electric-teal">
                      ${typeof effectiveUnitPrice === "number" ? effectiveUnitPrice.toFixed(2) : "0.00"}
                      <span className="text-xs text-silver-sage font-normal ml-1">/ unit</span>
                    </div>
                  </div>

                  {hasBulk ? (
                    <div className="text-xs text-success font-semibold mb-4 font-sans bg-success/10 border border-success/30 rounded-lg p-2">
                      ✓ {q.bulk_discount_pct}% Bulk Concession Applied ({q.bulk_threshold}+ units)
                    </div>
                  ) : (
                    <div className="text-xs text-silver-sage mb-4 font-sans bg-surface/50 border border-border-subtle rounded-lg p-2">
                      Base quote rate. Bulk tier unlocks at {q.bulk_threshold} units (-{q.bulk_discount_pct}%).
                    </div>
                  )}

                  {/* Breakdown Specifications */}
                  <div className="space-y-2 text-xs text-silver-sage pt-3 border-t border-border-subtle">
                    <div className="flex justify-between">
                      <span>Delivery SLA:</span>
                      <strong className="text-soft-ivory">{q.delivery_days} Days</strong>
                    </div>
                    <div className="flex justify-between">
                      <span>MOQ Requirement:</span>
                      <strong className="text-soft-ivory">{q.min_order_quantity} Units</strong>
                    </div>
                    <div className="flex justify-between">
                      <span>Warranty Period:</span>
                      <strong className="text-soft-ivory">{q.warranty_months} Months</strong>
                    </div>

                    {/* Financial Line Items */}
                    <div className="pt-3 border-t border-border-subtle space-y-1.5 text-[11px]">
                      <div className="flex justify-between">
                        <span>Batch Subtotal ({quantity} × ${effectiveUnitPrice.toFixed(2)}):</span>
                        <strong className="text-soft-ivory">${subtotal.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</strong>
                      </div>
                      <div className="flex justify-between">
                        <span>Estimated Shipping:</span>
                        <span className="text-soft-ivory">${shippingEst.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Estimated Tax (5%):</span>
                        <span className="text-soft-ivory">${taxEst.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between pt-2 border-t border-border-subtle text-sm">
                        <span className="text-soft-ivory font-sans font-bold">Estimated Landed:</span>
                        <strong className="text-electric-teal font-bold font-mono">
                          ${totalLanded.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                        </strong>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Bottom Action Button (Never Clipped) */}
                <div className="mt-6 pt-4 border-t border-border-subtle font-sans">
                  <Link
                    href={`/dashboard/negotiations?quotationId=${quoteId}&sku=${selectedSku}&qty=${quantity}`}
                    className="block"
                  >
                    <Button
                      size="sm"
                      variant={isSupplier1 ? "default" : "outline"}
                      className="w-full gap-2 text-xs font-mono font-bold h-10 shadow-teal-subtle"
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
      </Card>
    </div>
  );
}
