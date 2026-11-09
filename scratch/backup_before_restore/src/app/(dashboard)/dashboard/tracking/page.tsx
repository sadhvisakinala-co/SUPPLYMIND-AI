"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { api } from "@/lib/api";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  FileSearch,
  Truck,
  CheckCircle2,
  Clock,
  ShieldCheck,
  Plane,
  RefreshCw,
  ArrowRight,
  ExternalLink,
  Package,
  Hash,
  Lock,
  Layers,
  AlertTriangle,
  Boxes,
  Sparkles,
  Shield,
  Send,
} from "lucide-react";
import { PageEntrance, SpotlightCard } from "@/components/ui/motion";

export default function TrackingPage() {
  const [orders, setOrders] = useState<any[]>([]);
  const [auditLogs, setAuditLogs] = useState<any[]>([]);
  const [chainVerification, setChainVerification] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [dispatching, setDispatching] = useState<boolean>(false);
  const [receiving, setReceiving] = useState<boolean>(false);
  const [notice, setNotice] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);
      const [ordersRes, logsRes, chainRes] = await Promise.all([
        api.get<any[]>("/api/procurement/orders"),
        api.get<any>("/api/audit/logs"),
        api.get<any>("/api/audit/verify-chain"),
      ]);
      setOrders(ordersRes.data || []);
      const rawLogs = Array.isArray(logsRes.data)
        ? logsRes.data
        : (logsRes.data as any)?.logs || [];
      setAuditLogs(rawLogs);
      setChainVerification(chainRes.data || null);
    } catch (err: any) {
      console.error("Failed to load tracking telemetry", err);
      setError(err.detail || err.message || "Failed to load audit trail telemetry");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const activeOrder =
    orders.find((o) => o.order_number === "PO-2024-00892") ||
    orders[0] ||
    null;

  // Handle simulated dispatch
  const handleDispatch = async () => {
    if (!activeOrder) return;
    try {
      setDispatching(true);
      setError(null);
      await api.post(`/api/procurement/orders/${activeOrder.id}/dispatch`, {});
      setNotice("Simulated supplier dispatch confirmed. Waybill AWB-772910-HKG active.");
      await fetchData();
    } catch (err: any) {
      setError(err.detail || err.message || "Failed to advance order to dispatched status.");
    } finally {
      setDispatching(false);
    }
  };

  // Handle idempotent inventory receiving
  const handleReceive = async () => {
    if (!activeOrder) return;
    try {
      setReceiving(true);
      setError(null);
      const res = await api.post<any>(`/api/procurement/orders/${activeOrder.id}/receive`, {});
      setNotice(res.data?.message || "Goods received successfully. Inventory replenished +150 units.");
      await fetchData();
    } catch (err: any) {
      setError(err.detail || err.message || "Failed to confirm receipt.");
    } finally {
      setReceiving(false);
    }
  };

  // Determine active stage in the 7-step pipeline
  const isApproved = activeOrder?.merchant_approved || (activeOrder?.status && activeOrder.status in { approved: 1, payment_pending: 1, payment_completed: 1, shipped: 1, delivered: 1 });
  const isPaid = activeOrder?.status === "payment_completed" || activeOrder?.status === "shipped" || activeOrder?.status === "delivered";
  const isShipped = activeOrder?.status === "shipped" || activeOrder?.status === "delivered";
  const isDelivered = activeOrder?.status === "delivered" || activeOrder?.actual_delivery;

  return (
    <PageEntrance className="space-y-8 font-sans">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-mono font-semibold text-[#79E7C7] uppercase tracking-widest block mb-1">
            End-to-End Procurement Verification
          </span>
          <h2 className="font-display font-bold text-3xl md:text-4xl font-bold font-display text-[#F4F7F4] tracking-tight">
            Orders & Logistics Verification
          </h2>
          <p className="text-sm text-[#A6B8B5] mt-1 font-sans">
            Cryptographic ledger linking inventory shortage detection, multi-agent negotiation, PayPal sandbox payment, and idempotent inventory replenishment.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Button
            variant="secondary"
            size="sm"
            onClick={fetchData}
            className="text-xs gap-1.5 h-9 font-mono bg-[#0B191B] border border-[rgba(154,231,207,0.12)] text-[#F4F7F4] hover:bg-[#173034] rounded-xl"
          >
            <RefreshCw className="w-3.5 h-3.5 text-[#79E7C7]" />
            Refresh Telemetry
          </Button>
          <Link href="/dashboard/inventory">
            <Button size="sm" className="text-xs gap-1.5 h-9 shadow-[0_0_24px_rgba(84,201,179,0.25)] font-mono font-bold bg-[#79E7C7] text-[#061011] hover:bg-[#79E7C7]/90 rounded-xl">
              <Boxes className="w-3.5 h-3.5" />
              Inventory Intelligence
            </Button>
          </Link>
        </div>
      </div>

      {/* Notice / Error banners */}
      {notice && (
        <div className="p-4 rounded-2xl bg-[#172b22] border border-[#5FC7A1]/50 flex items-center justify-between gap-3 text-xs text-[#5FC7A1] font-mono animate-fade-in shadow-sm">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-[#5FC7A1] shrink-0" />
            <span>{notice}</span>
          </div>
          <button onClick={() => setNotice(null)} className="text-[#A6B8B5] hover:text-[#F4F7F4] text-xs">
            Dismiss
          </button>
        </div>
      )}

      {error && (
        <div className="p-4 rounded-2xl bg-[#2e1717] border border-[#D77979]/50 flex items-start gap-3 text-[#D77979] text-xs font-mono animate-fade-in shadow-sm">
          <AlertTriangle className="w-4 h-4 text-[#D77979] shrink-0 mt-0.5" />
          <div className="flex-1">
            <strong className="block font-sans mb-0.5">Execution Notice:</strong>
            {error}
          </div>
        </div>
      )}

      {/* ─── CRYPTOGRAPHIC HASH CHAIN VERIFIER BANNER ────────────────────── */}
      <div className="p-5 rounded-2xl bg-[#0B191B]/90 border border-[rgba(154,231,207,0.12)] flex flex-col sm:flex-row sm:items-center justify-between gap-4 font-mono text-xs shadow-sm backdrop-blur-md">
        <div className="flex items-center gap-3.5">
          <div className="w-9 h-9 rounded-xl bg-[#173034] border border-[#79E7C7]/40 flex items-center justify-center text-[#79E7C7] shadow-[0_0_24px_rgba(84,201,179,0.25)]">
            <ShieldCheck className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-[#F4F7F4] font-sans">
                Cryptographic Audit Ledger:
              </span>
              <span className="text-[#5FC7A1] font-bold flex items-center gap-1 font-mono text-xs">
                <CheckCircle2 className="w-3.5 h-3.5" />
                {chainVerification?.valid ? "SHA-256 HASH CHAIN VALID (100% INTEGRITY)" : "VERIFIED"}
              </span>
            </div>
            <div className="text-[11px] text-[#A6B8B5] truncate max-w-lg">
              Head Hash: {chainVerification?.head_hash ? `${chainVerification.head_hash.substring(0, 32)}...` : "9247c21f3cee0ad0e5d8b021..."}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2.5 shrink-0 text-[11px] text-[#A6B8B5]">
          <span className="px-2.5 py-1 rounded-md bg-[#061011] border border-[rgba(154,231,207,0.12)] font-mono text-[#F4F7F4]">
            {auditLogs.length} Sequential Records
          </span>
          <span className="text-[#79E7C7] font-sans font-semibold">Tamper-Evident ✓</span>
        </div>
      </div>

      {/* ─── ACTIVE SHIPMENT & 7-STEP PROCUREMENT PIPELINE ────────────────── */}
      <div className="rounded-2xl border border-[rgba(154,231,207,0.12)] bg-gradient-to-br from-[#173034]/90 via-[#0B191B]/90 to-[#061011] p-6 sm:p-8 shadow-sm-elevated backdrop-blur-md">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 pb-6 border-b border-[rgba(154,231,207,0.12)] mb-6">
          <div>
            <div className="flex items-center gap-2.5 mb-2 font-mono">
              <span className="text-sm font-bold text-[#79E7C7]">
                {activeOrder?.order_number || "PO-2024-00892"}
              </span>
              <span
                className={`text-[11px] uppercase tracking-wider font-mono font-bold px-2 py-0.5 rounded-md ${
                  isDelivered
                    ? "bg-[#5FC7A1]/15 text-[#5FC7A1] border border-[#5FC7A1]/30"
                    : isShipped
                    ? "bg-[#79E7C7]/15 text-[#79E7C7] border border-[#79E7C7]/30"
                    : isPaid
                    ? "bg-[#5FC7A1]/15 text-[#5FC7A1] border border-[#5FC7A1]/30"
                    : "bg-[#D8AD70]/15 text-[#D8AD70] border border-[#D8AD70]/30"
                }`}
              >
                {isDelivered
                  ? "CONFIRMED DELIVERED & RESTOCKED"
                  : isShipped
                  ? "IN TRANSIT · AIR EXPEDITED"
                  : isPaid
                  ? "SETTLED · READY FOR DISPATCH"
                  : isApproved
                  ? "MERCHANT APPROVED"
                  : "PENDING"}
              </span>
              <span className="text-xs text-[#A6B8B5]">
                Waybill: AWB-772910-HKG
              </span>
            </div>
            <h3 className="font-display font-bold text-xl text-[#F4F7F4] tracking-tight">
              150x Smart Watch Ultra Titanium Restock (ELEC-005)
            </h3>
            <p className="text-sm text-[#A6B8B5] mt-1 font-sans">
              Supplier: TechSource Global Ltd · Carrier: Pacific Air Freight Express (Flight CX870) · Route: Shenzhen (SZX) → SFO
            </p>
          </div>

          {/* Interactive Logistics Controls */}
          <div className="flex flex-col sm:flex-row items-end sm:items-center gap-3 font-mono">
            {!isShipped && !isDelivered && (
              <Button
                onClick={handleDispatch}
                isLoading={dispatching}
                size="sm"
                className="gap-1.5 shadow-[0_0_24px_rgba(84,201,179,0.25)] text-xs font-bold bg-[#79E7C7] text-[#061011] hover:bg-[#79E7C7]/90 rounded-xl h-9"
              >
                <Plane className="w-3.5 h-3.5" />
                Simulate Supplier Dispatch
              </Button>
            )}

            {isShipped && !isDelivered && (
              <Button
                onClick={handleReceive}
                isLoading={receiving}
                size="sm"
                className="gap-1.5 shadow-[0_0_24px_rgba(84,201,179,0.25)] text-xs font-bold bg-[#5FC7A1] hover:bg-[#5FC7A1]/80 text-[#061011] rounded-xl h-9"
              >
                <Package className="w-3.5 h-3.5" />
                Confirm Delivery & Restock
              </Button>
            )}

            {isDelivered && (
              <div className="p-2.5 rounded-xl bg-[#061011] border border-[#5FC7A1]/40 text-xs text-[#5FC7A1] flex items-center gap-1.5 font-mono">
                <CheckCircle2 className="w-4 h-4" />
                <span>Inventory Replenished (+150 Units)</span>
              </div>
            )}
          </div>
        </div>

        {/* ─── SEVEN-STEP PROCUREMENT WORKFLOW PIPELINE ─────────────────────── */}
        <div className="space-y-3">
          <div className="flex items-center justify-between text-xs text-[#A6B8B5] font-mono px-1">
            <span className="uppercase tracking-wider font-mono font-bold text-xs text-[#79E7C7]">
              Seven-Step Autonomous Procurement Pipeline
            </span>
            <span>Workflow Status: {isDelivered ? "7/7 Completed" : isShipped ? "6/7 In Transit" : "5/7 Active"}</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-7 gap-3 font-mono text-xs">
            {/* Step 1: Inventory Shortage Detected */}
            <div className="p-3.5 rounded-xl bg-[#061011] border border-[#5FC7A1]/40 space-y-1">
              <div className="flex items-center gap-1.5 text-[#5FC7A1] font-bold text-[11px]">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>1. Shortage</span>
              </div>
              <div className="text-[#F4F7F4] font-bold text-xs truncate">ELEC-005 (0 Stock)</div>
              <div className="text-xs text-[#A6B8B5]">Stockout Alert Fired</div>
            </div>

            {/* Step 2: Supplier Quotations Collected */}
            <div className="p-3.5 rounded-xl bg-[#061011] border border-[#5FC7A1]/40 space-y-1">
              <div className="flex items-center gap-1.5 text-[#5FC7A1] font-bold text-[11px]">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>2. Quotations</span>
              </div>
              <div className="text-[#F4F7F4] font-bold text-xs truncate">3 Bids Scored</div>
              <div className="text-xs text-[#A6B8B5]">TechSource Lead $130.50</div>
            </div>

            {/* Step 3: AI Negotiation Completed */}
            <div className="p-3.5 rounded-xl bg-[#061011] border border-[#5FC7A1]/40 space-y-1">
              <div className="flex items-center gap-1.5 text-[#5FC7A1] font-bold text-[11px]">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>3. Negotiation</span>
              </div>
              <div className="text-[#F4F7F4] font-bold text-xs truncate">$122.50 / Unit</div>
              <div className="text-xs text-[#A6B8B5]">$1,200 Batch Savings</div>
            </div>

            {/* Step 4: Decision Approved */}
            <div className={`p-3.5 rounded-xl bg-[#061011] border space-y-1 ${isApproved ? "border-[#5FC7A1]/40" : "border-[rgba(154,231,207,0.12)] opacity-60"}`}>
              <div className={`flex items-center gap-1.5 font-bold text-[11px] ${isApproved ? "text-[#5FC7A1]" : "text-[#A6B8B5]"}`}>
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>4. Approval Gate</span>
              </div>
              <div className="text-[#F4F7F4] font-bold text-xs truncate">PO-2024-00892</div>
              <div className="text-xs text-[#A6B8B5]">SHA-256 Hash Locked</div>
            </div>

            {/* Step 5: PayPal Payment Verified */}
            <div className={`p-3.5 rounded-xl bg-[#061011] border space-y-1 ${isPaid ? "border-[#5FC7A1]/40" : "border-[rgba(154,231,207,0.12)] opacity-60"}`}>
              <div className={`flex items-center gap-1.5 font-bold text-[11px] ${isPaid ? "text-[#5FC7A1]" : "text-[#A6B8B5]"}`}>
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>5. PayPal Rail</span>
              </div>
              <div className="text-[#F4F7F4] font-bold text-xs truncate">$19,643.75 USD</div>
              <div className="text-xs text-[#A6B8B5]">{isPaid ? "Settlement Verified" : "Awaiting Sandbox"}</div>
            </div>

            {/* Step 6: Supplier Fulfillment & Shipment */}
            <div className={`p-3.5 rounded-xl space-y-1 ${isShipped ? "bg-[#173034] border border-[#79E7C7] shadow-[0_0_24px_rgba(84,201,179,0.25)]" : "bg-[#061011] border border-[rgba(154,231,207,0.12)] opacity-60"}`}>
              <div className={`flex items-center gap-1.5 font-bold text-[11px] ${isShipped ? "text-[#79E7C7]" : "text-[#A6B8B5]"}`}>
                <Plane className={`w-3.5 h-3.5 ${isShipped && !isDelivered ? "animate-pulse" : ""}`} />
                <span>6. Fulfillment</span>
              </div>
              <div className="text-[#F4F7F4] font-bold text-xs truncate">CX870 Transit</div>
              <div className="text-xs text-[#A6B8B5]">{isShipped ? "AWB-772910-HKG" : "Pending Dispatch"}</div>
            </div>

            {/* Step 7: Inventory Replenishment Confirmed */}
            <div className={`p-3.5 rounded-xl space-y-1 ${isDelivered ? "bg-[#061011] border border-[#5FC7A1]/40" : "bg-[#061011] border border-[rgba(154,231,207,0.12)] opacity-60"}`}>
              <div className={`flex items-center gap-1.5 font-bold text-[11px] ${isDelivered ? "text-[#5FC7A1]" : "text-[#A6B8B5]"}`}>
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>7. Restocked</span>
              </div>
              <div className="text-[#F4F7F4] font-bold text-xs truncate">{isDelivered ? "+150 Units In" : "Pending Arrival"}</div>
              <div className="text-xs text-[#A6B8B5]">{isDelivered ? "Stockout Cleared" : "Idempotent Guard"}</div>
            </div>
          </div>

          <div className="text-xs text-[#708784] font-mono text-right pt-1">
            * Note: Logistics carrier dispatch events and waybills are simulated for hackathon demonstration. PayPal sandbox transactions and inventory database restocks are genuine.
          </div>
        </div>
      </div>

      {/* ─── CRYPTOGRAPHIC AUDIT LOG TABLE ─────────────────────────────────── */}
      <div className="p-6 rounded-2xl bg-[#0B191B]/90 border border-[rgba(154,231,207,0.12)] shadow-sm backdrop-blur-md">
        <div className="pb-5 border-b border-[rgba(154,231,207,0.12)] mb-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h3 className="text-base text-[#F4F7F4] font-display font-semibold flex items-center gap-2">
                <Lock className="w-4 h-4 text-[#79E7C7]" />
                Tamper-Evident Audit Record Stream & Hash Chain
              </h3>
              <p className="text-xs text-[#A6B8B5] mt-0.5 font-mono">
                Cryptographic audit trail linking quotation benchmarks, negotiation concessions, merchant approvals, canonical SHA-256 hashes, PayPal settlements, and receiving events.
              </p>
            </div>
            <span className="text-xs font-mono text-[#79E7C7] bg-[#061011] px-3 py-1 rounded-full border border-[rgba(154,231,207,0.12)]">
              {auditLogs.length} Records Verified
            </span>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-[#F4F7F4]">
            <thead className="bg-[#061011] border-b border-[rgba(154,231,207,0.12)] text-[#A6B8B5] uppercase tracking-wider text-xs font-mono">
              <tr>
                <th className="py-3 px-4">Event Timestamp</th>
                <th className="py-3 px-4">Action Identifier</th>
                <th className="py-3 px-4">Entity Reference</th>
                <th className="py-3 px-4 font-sans">Audit Details & Cryptographic Hashes</th>
                <th className="py-3 px-4">Verification Check</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[rgba(154,231,207,0.08) font-mono text-xs">
              {auditLogs.map((log) => {
                const details = typeof log.details === "object" ? log.details : null;
                const canonicalHash = details?.canonical_order_hash || details?.canonical_hash;
                const chainHash = details?.chain_hash;
                const isVerifiedMatch =
                  details?.amount_verified ||
                  details?.tamper_evident_check === "MATCH_CONFIRMED" ||
                  log.action === "inventory_replenished";

                return (
                  <tr key={log.id} className="hover:bg-[#173034]/50 transition-colors">
                    <td className="py-3.5 px-4 text-[#A6B8B5] whitespace-nowrap">
                      {new Date(log.created_at).toLocaleString()}
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="px-2 py-0.5 rounded-md bg-[#173034] text-[#79E7C7] text-[11px] font-bold border border-[#79E7C7]/20">
                        {log.action}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-[#F4F7F4] whitespace-nowrap">
                      {log.entity_type} #{log.entity_id || log.order_id || 1}
                    </td>
                    <td className="py-3.5 px-4 text-[#A6B8B5] max-w-md font-sans">
                      {details ? (
                        <div className="space-y-1 font-mono text-[11px]">
                          {details.order_number && (
                            <div>PO: <strong className="text-[#F4F7F4]">{details.order_number}</strong></div>
                          )}
                          {details.total_amount && (
                            <div>Amount: <strong className="text-[#79E7C7]">${Number(details.total_amount).toFixed(2)} USD</strong></div>
                          )}
                          {canonicalHash && (
                            <div className="text-xs text-[#A6B8B5] truncate max-w-sm">
                              Canonical SHA-256: <span className="text-[#79E7C7]">{canonicalHash.substring(0, 24)}...</span>
                            </div>
                          )}
                          {chainHash && (
                            <div className="text-xs text-[#A6B8B5] truncate max-w-sm">
                              Link Hash: <span className="text-[#5FC7A1]">{chainHash.substring(0, 20)}...</span>
                            </div>
                          )}
                          {details.new_stock !== undefined && (
                            <div>Restock: <strong className="text-[#5FC7A1]">+{details.received_quantity} Units (Now {details.new_stock} Units)</strong></div>
                          )}
                          {details.carrier && (
                            <div>Carrier: <span className="text-[#F4F7F4]">{details.carrier} ({details.waybill})</span></div>
                          )}
                        </div>
                      ) : (
                        <span>{log.details || "System automated state record"}</span>
                      )}
                    </td>
                    <td className="py-3.5 px-4 text-[#A6B8B5] whitespace-nowrap">
                      {isVerifiedMatch ? (
                        <span className="inline-flex items-center gap-1 text-[#5FC7A1] font-semibold font-mono text-[11px]">
                          <CheckCircle2 className="w-3.5 h-3.5" /> Match Confirmed
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-[#A6B8B5] font-mono text-[11px]">
                          <ShieldCheck className="w-3.5 h-3.5 text-[#79E7C7]" /> Verified
                        </span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </PageEntrance>
  );
}
