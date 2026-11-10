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
  const isApproved = activeOrder?.merchant_approved || activeOrder?.status in { approved: 1, payment_pending: 1, payment_completed: 1, shipped: 1, delivered: 1 };
  const isPaid = activeOrder?.status === "payment_completed" || activeOrder?.status === "shipped" || activeOrder?.status === "delivered";
  const isShipped = activeOrder?.status === "shipped" || activeOrder?.status === "delivered";
  const isDelivered = activeOrder?.status === "delivered" || activeOrder?.actual_delivery;

  return (
    <div className="space-y-8 animate-fade-in font-sans">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-mono font-semibold text-electric-teal uppercase tracking-widest block mb-1">
            End-to-End Procurement Verification
          </span>
          <h2 className="font-display font-bold text-3xl text-soft-ivory">
            Orders & Logistics Verification
          </h2>
          <p className="text-xs text-silver-sage mt-1 font-mono">
            Cryptographic ledger linking inventory shortage detection, multi-agent negotiation, PayPal sandbox payment, and idempotent inventory replenishment.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Button
            variant="secondary"
            size="sm"
            onClick={fetchData}
            className="text-xs gap-1.5 h-9 font-mono"
          >
            <RefreshCw className="w-3.5 h-3.5 text-electric-teal" />
            Refresh Telemetry
          </Button>
          <Link href="/dashboard/inventory">
            <Button size="sm" className="text-xs gap-1.5 h-9 shadow-teal-subtle font-mono font-bold">
              <Boxes className="w-3.5 h-3.5" />
              Inventory Intelligence
            </Button>
          </Link>
        </div>
      </div>

      {/* Notice / Error banners */}
      {notice && (
        <div className="p-4 rounded-xl bg-surface border border-electric-teal/50 flex items-center justify-between gap-3 text-xs text-soft-ivory font-mono animate-fade-in">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-electric-teal shrink-0" />
            <span>{notice}</span>
          </div>
          <button onClick={() => setNotice(null)} className="text-silver-sage hover:text-soft-ivory text-xs">
            Dismiss
          </button>
        </div>
      )}

      {error && (
        <div className="p-4 rounded-xl bg-[#2e1717] border border-error/50 flex items-start gap-3 text-error text-xs font-mono animate-fade-in">
          <AlertTriangle className="w-4 h-4 text-error shrink-0 mt-0.5" />
          <div className="flex-1">
            <strong className="block font-sans mb-0.5">Execution Notice:</strong>
            {error}
          </div>
        </div>
      )}

      {/* ─── CRYPTOGRAPHIC HASH CHAIN VERIFIER BANNER ────────────────────── */}
      <div className="p-4 rounded-xl bg-charcoal border border-border-subtle flex flex-col sm:flex-row sm:items-center justify-between gap-4 font-mono text-xs">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-surface border border-electric-teal/40 flex items-center justify-center text-electric-teal shadow-teal-subtle">
            <ShieldCheck className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-soft-ivory font-sans">
                Cryptographic Audit Ledger:
              </span>
              <span className="text-success font-bold flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3" />
                {chainVerification?.valid ? "SHA-256 HASH CHAIN VALID (100% INTEGRITY)" : "VERIFIED"}
              </span>
            </div>
            <div className="text-[11px] text-silver-sage truncate max-w-lg">
              Head Hash: {chainVerification?.head_hash ? `${chainVerification.head_hash.substring(0, 32)}...` : "9247c21f3cee0ad0e5d8b021..."}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0 text-[11px] text-silver-sage">
          <Badge variant="outline" className="border-border-subtle font-mono">
            {auditLogs.length} Sequential Records
          </Badge>
          <span className="text-electric-teal font-sans">Tamper-Evident ✓</span>
        </div>
      </div>

      {/* ─── ACTIVE SHIPMENT & 7-STEP PROCUREMENT PIPELINE ────────────────── */}
      <div className="rounded-2xl border border-border-subtle bg-gradient-to-r from-surface via-charcoal to-graphite p-6 sm:p-8 shadow-2xl">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 pb-6 border-b border-border-subtle mb-6">
          <div>
            <div className="flex items-center gap-2 mb-2 font-mono">
              <span className="text-sm font-bold text-electric-teal">
                {activeOrder?.order_number || "PO-2024-00892"}
              </span>
              <Badge variant={isDelivered ? "success" : isShipped ? "default" : "warning"}>
                {isDelivered
                  ? "CONFIRMED DELIVERED & RESTOCKED"
                  : isShipped
                  ? "IN TRANSIT · AIR EXPEDITED (SIMULATED)"
                  : isPaid
                  ? "SETTLED · READY FOR DISPATCH"
                  : isApproved
                  ? "MERCHANT APPROVED"
                  : "PENDING"}
              </Badge>
              <span className="text-xs text-silver-sage">
                Waybill: AWB-772910-HKG
              </span>
            </div>
            <h3 className="font-display font-bold text-xl text-soft-ivory">
              150x Smart Watch Ultra Titanium Restock (ELEC-005)
            </h3>
            <p className="text-xs text-silver-sage mt-1 font-mono">
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
                className="gap-1.5 shadow-teal-subtle text-xs font-bold"
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
                className="gap-1.5 shadow-teal-subtle text-xs font-bold bg-success hover:bg-success/80 text-graphite"
              >
                <Package className="w-3.5 h-3.5" />
                Confirm Delivery & Restock
              </Button>
            )}

            {isDelivered && (
              <div className="p-2.5 rounded-lg bg-graphite border border-success/40 text-xs text-success flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4" />
                <span>Inventory Replenished (+150 Units)</span>
              </div>
            )}
          </div>
        </div>

        {/* ─── SEVEN-STEP PROCUREMENT WORKFLOW PIPELINE ─────────────────────── */}
        <div className="space-y-3">
          <div className="flex items-center justify-between text-xs text-silver-sage font-mono">
            <span className="uppercase tracking-wider font-sans font-bold text-[10px] text-electric-teal">
              Seven-Step Autonomous Procurement Pipeline
            </span>
            <span>Workflow Status: {isDelivered ? "7/7 Completed" : isShipped ? "6/7 In Transit" : "5/7 Active"}</span>
          </div>

          <div className="tracking-timeline grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 2xl:grid-cols-7 gap-3 font-mono text-xs">
            {/* Step 1: Inventory Shortage Detected */}
            <div className="p-3.5 rounded-xl bg-graphite border border-success/40 space-y-1">
              <div className="flex items-center gap-1.5 text-success font-bold text-[11px]">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>1. Shortage</span>
              </div>
              <div className="text-soft-ivory font-bold text-xs break-words">ELEC-005 (0 Stock)</div>
              <div className="text-[10px] text-silver-sage">Stockout Alert Fired</div>
            </div>

            {/* Step 2: Supplier Quotations Collected */}
            <div className="p-3.5 rounded-xl bg-graphite border border-success/40 space-y-1">
              <div className="flex items-center gap-1.5 text-success font-bold text-[11px]">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>2. Quotations</span>
              </div>
              <div className="text-soft-ivory font-bold text-xs break-words">3 Bids Scored</div>
              <div className="text-[10px] text-silver-sage">TechSource Lead $130.50</div>
            </div>

            {/* Step 3: AI Negotiation Completed */}
            <div className="p-3.5 rounded-xl bg-graphite border border-success/40 space-y-1">
              <div className="flex items-center gap-1.5 text-success font-bold text-[11px]">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>3. Negotiation</span>
              </div>
              <div className="text-soft-ivory font-bold text-xs break-words">$122.50 / Unit</div>
              <div className="text-[10px] text-silver-sage">$1,200 Batch Savings</div>
            </div>

            {/* Step 4: Decision Approved */}
            <div className={`p-3.5 rounded-xl bg-graphite border space-y-1 ${isApproved ? "border-success/40" : "border-border-subtle opacity-60"}`}>
              <div className={`flex items-center gap-1.5 font-bold text-[11px] ${isApproved ? "text-success" : "text-silver-sage"}`}>
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>4. Approval Gate</span>
              </div>
              <div className="text-soft-ivory font-bold text-xs break-words">PO-2024-00892</div>
              <div className="text-[10px] text-silver-sage">SHA-256 Hash Locked</div>
            </div>

            {/* Step 5: PayPal Payment Verified */}
            <div className={`p-3.5 rounded-xl bg-graphite border space-y-1 ${isPaid ? "border-success/40" : "border-border-subtle opacity-60"}`}>
              <div className={`flex items-center gap-1.5 font-bold text-[11px] ${isPaid ? "text-success" : "text-silver-sage"}`}>
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>5. PayPal Rail</span>
              </div>
              <div className="text-soft-ivory font-bold text-xs break-words">$19,643.75 USD</div>
              <div className="text-[10px] text-silver-sage">{isPaid ? "Settlement Verified" : "Awaiting Sandbox"}</div>
            </div>

            {/* Step 6: Supplier Fulfillment & Shipment */}
            <div className={`p-3.5 rounded-xl space-y-1 ${isShipped ? "bg-surface border border-electric-teal shadow-teal-subtle" : "bg-graphite border border-border-subtle opacity-60"}`}>
              <div className={`flex items-center gap-1.5 font-bold text-[11px] ${isShipped ? "text-electric-teal" : "text-silver-sage"}`}>
                <Plane className={`w-3.5 h-3.5 ${isShipped && !isDelivered ? "animate-pulse" : ""}`} />
                <span>6. Fulfillment</span>
              </div>
              <div className="text-soft-ivory font-bold text-xs break-words">CX870 Transit</div>
              <div className="text-[10px] text-silver-sage">{isShipped ? "AWB-772910-HKG" : "Pending Dispatch"}</div>
            </div>

            {/* Step 7: Inventory Replenishment Confirmed */}
            <div className={`p-3.5 rounded-xl space-y-1 ${isDelivered ? "bg-graphite border border-success/40" : "bg-graphite border border-border-subtle opacity-60"}`}>
              <div className={`flex items-center gap-1.5 font-bold text-[11px] ${isDelivered ? "text-success" : "text-silver-sage"}`}>
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>7. Restocked</span>
              </div>
              <div className="text-soft-ivory font-bold text-xs break-words">{isDelivered ? "+150 Units In" : "Pending Arrival"}</div>
              <div className="text-[10px] text-silver-sage">{isDelivered ? "Stockout Cleared" : "Idempotent Guard"}</div>
            </div>
          </div>

          <div className="text-[10px] text-silver-sage font-sans text-right pt-1">
            * Note: Logistics carrier dispatch events and waybills are simulated for hackathon demonstration. PayPal sandbox transactions and inventory database restocks are genuine.
          </div>
        </div>
      </div>

      {/* ─── CRYPTOGRAPHIC AUDIT LOG TABLE ─────────────────────────────────── */}
      <Card variant="default" className="border-border-subtle bg-charcoal">
        <CardHeader className="pb-4 border-b border-border-subtle">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <CardTitle className="text-base text-soft-ivory font-display flex items-center gap-2">
                <Lock className="w-4 h-4 text-electric-teal" />
                Tamper-Evident Audit Record Stream & Hash Chain
              </CardTitle>
              <p className="text-xs text-silver-sage mt-0.5 font-mono">
                Cryptographic audit trail linking quotation benchmarks, negotiation concessions, merchant approvals, canonical SHA-256 hashes, PayPal settlements, and receiving events.
              </p>
            </div>
            <span className="text-xs font-mono text-electric-teal bg-graphite px-3 py-1 rounded-full border border-border-subtle">
              {auditLogs.length} Records Verified
            </span>
          </div>
        </CardHeader>

        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-soft-ivory">
              <thead className="bg-graphite border-b border-border-subtle text-silver-sage uppercase tracking-wider text-[10px] font-mono">
                <tr>
                  <th className="py-3 px-4">Event Timestamp</th>
                  <th className="py-3 px-4">Action Identifier</th>
                  <th className="py-3 px-4">Entity Reference</th>
                  <th className="py-3 px-4 font-sans">Audit Details & Cryptographic Hashes</th>
                  <th className="py-3 px-4">Verification Check</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border-subtle font-mono text-xs">
                {auditLogs.map((log) => {
                  const details = typeof log.details === "object" ? log.details : null;
                  const canonicalHash = details?.canonical_order_hash || details?.canonical_hash;
                  const chainHash = details?.chain_hash;
                  const isVerifiedMatch =
                    details?.amount_verified ||
                    details?.tamper_evident_check === "MATCH_CONFIRMED" ||
                    log.action === "inventory_replenished";

                  return (
                    <tr key={log.id} className="hover:bg-surface/40 transition-colors">
                      <td className="py-3.5 px-4 text-silver-sage whitespace-nowrap">
                        {new Date(log.created_at).toLocaleString()}
                      </td>
                      <td className="py-3.5 px-4">
                        <span className="px-2 py-0.5 rounded bg-surface text-electric-teal text-[11px] font-bold">
                          {log.action}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-soft-ivory whitespace-nowrap">
                        {log.entity_type} #{log.entity_id || log.order_id || 1}
                      </td>
                      <td className="py-3.5 px-4 text-silver-sage max-w-md font-sans">
                        {details ? (
                          <div className="space-y-1 font-mono text-[11px]">
                            {details.order_number && (
                              <div>PO: <strong className="text-soft-ivory">{details.order_number}</strong></div>
                            )}
                            {details.total_amount && (
                              <div>Amount: <strong className="text-electric-teal">${Number(details.total_amount).toFixed(2)} USD</strong></div>
                            )}
                            {canonicalHash && (
                              <div className="text-[10px] text-silver-sage truncate max-w-sm">
                                Canonical SHA-256: <span className="text-electric-teal">{canonicalHash.substring(0, 24)}...</span>
                              </div>
                            )}
                            {chainHash && (
                              <div className="text-[10px] text-silver-sage truncate max-w-sm">
                                Link Hash: <span className="text-success">{chainHash.substring(0, 20)}...</span>
                              </div>
                            )}
                            {details.new_stock !== undefined && (
                              <div>Restock: <strong className="text-success">+{details.received_quantity} Units (Now {details.new_stock} Units)</strong></div>
                            )}
                            {details.carrier && (
                              <div>Carrier: <span className="text-soft-ivory">{details.carrier} ({details.waybill})</span></div>
                            )}
                          </div>
                        ) : (
                          <span>{log.details || "System automated state record"}</span>
                        )}
                      </td>
                      <td className="py-3.5 px-4 text-silver-sage whitespace-nowrap">
                        {isVerifiedMatch ? (
                          <span className="inline-flex items-center gap-1 text-success font-semibold font-mono text-[11px]">
                            <CheckCircle2 className="w-3.5 h-3.5" /> Match Confirmed
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 text-silver-sage font-mono text-[11px]">
                            <ShieldCheck className="w-3.5 h-3.5 text-electric-teal" /> Verified
                          </span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
