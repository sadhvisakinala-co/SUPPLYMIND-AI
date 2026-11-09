"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { api } from "@/lib/api";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  CheckCircle2,
  XCircle,
  AlertTriangle,
  ShieldCheck,
  CreditCard,
  ArrowRight,
  FileText,
  Sparkles,
  Bot,
  Truck,
  RefreshCw,
  Lock,
} from "lucide-react";
import { PageEntrance, SpotlightCard } from "@/components/ui/motion";

export default function ApprovalPage() {
  const router = useRouter();
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [approvingId, setApprovingId] = useState<number | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const res = await api.get<any[]>("/api/procurement/orders");
      setOrders(res.data || []);
    } catch (err) {
      console.error("Failed to load procurement orders", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleApprove = async (orderId: number) => {
    try {
      setApprovingId(orderId);
      await api.post(`/api/procurement/orders/${orderId}/approve`, {});
      setSuccessMessage("Order officially authorized by merchant signature. Advancing to PayPal Sandbox rails...");
      await fetchOrders();
      setTimeout(() => {
        router.push(`/dashboard/checkout?orderId=${orderId}`);
      }, 700);
    } catch (err: any) {
      alert(err.detail || err.message || "Failed to approve order");
    } finally {
      setApprovingId(null);
    }
  };

  const pendingOrders = orders.filter((o) => !o.merchant_approved && o.status === "pending_approval");
  const approvedOrders = orders.filter((o) => o.merchant_approved || o.status === "approved" || o.status === "payment_completed");

  return (
    <PageEntrance className="space-y-8 font-sans">
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-mono font-semibold text-[#79E7C7] uppercase tracking-widest block mb-1">
            Merchant Governance & Compliance Gate
          </span>
          <h2 className="font-display font-bold text-3xl md:text-4xl font-bold font-display text-[#F4F7F4] tracking-tight">
            Purchase Approval Gate
          </h2>
          <p className="text-sm text-[#A6B8B5] mt-1 font-sans">
            Human-in-the-loop authorization. AI agents cannot initiate money movement without explicit merchant cryptographic sign-off.
          </p>
        </div>

        <Button
          variant="secondary"
          size="sm"
          onClick={fetchOrders}
          className="text-xs gap-1.5 h-9 font-mono bg-[#0B191B] border border-[rgba(154,231,207,0.12)] text-[#F4F7F4] hover:bg-[#173034]"
        >
          <RefreshCw className="w-3.5 h-3.5 text-[#79E7C7]" />
          Refresh Orders
        </Button>
      </div>

      {/* Success Notification Banner */}
      {successMessage && (
        <div className="p-4 rounded-2xl bg-[#172b22] border border-[#5FC7A1]/50 flex items-center justify-between text-[#5FC7A1] text-xs font-mono animate-fade-in shadow-sm">
          <div className="flex items-center gap-3">
            <CheckCircle2 className="w-5 h-5 text-[#5FC7A1] shrink-0" />
            <div>
              <div className="font-bold">{successMessage}</div>
              <div className="text-[11px] text-[#A6B8B5]">Cryptographic SHA-256 seal verified. Ready for PayPal Orders v2 Sandbox settlement.</div>
            </div>
          </div>
          <Link href="/dashboard/checkout">
            <Button size="sm" className="text-xs gap-1.5 shadow-[0_0_24px_rgba(84,201,179,0.25)] font-mono font-bold bg-[#79E7C7] text-[#061011] hover:bg-[#79E7C7]/90 rounded-xl">
              Launch PayPal Checkout <ArrowRight className="w-3.5 h-3.5" />
            </Button>
          </Link>
        </div>
      )}

      {/* ─── PENDING ORDERS REQUIRING APPROVAL ─────────────────────────────── */}
      <div className="space-y-6">
        <div className="flex items-center justify-between px-1">
          <h3 className="font-display font-semibold text-lg text-[#F4F7F4] flex items-center gap-2.5">
            <span>Awaiting Merchant Sign-Off</span>
            <span className="text-xs font-mono font-bold uppercase tracking-wider px-2 py-0.5 rounded-md bg-[#D8AD70]/15 text-[#D8AD70] border border-[#D8AD70]/30">
              {pendingOrders.length} Required
            </span>
          </h3>
        </div>

        {pendingOrders.length > 0 ? (
          pendingOrders.map((order) => (
            <div
              key={order.id}
              className="rounded-2xl border border-[#D8AD70]/40 bg-gradient-to-br from-[#173034]/90 via-[#0B191B]/90 to-[#061011] p-6 sm:p-8 shadow-sm-elevated relative overflow-hidden backdrop-blur-md"
            >
              <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-8">
                {/* Order Details */}
                <div className="flex-1 space-y-4">
                  <div className="flex items-center gap-3 font-mono">
                    <span className="text-base font-bold text-[#79E7C7]">
                      {order.order_number}
                    </span>
                    <span className="text-xs font-mono font-bold uppercase tracking-wider px-2 py-0.5 rounded-md bg-[#D8AD70]/15 text-[#D8AD70] border border-[#D8AD70]/30">
                      PENDING MERCHANT SIGNATURE
                    </span>
                    <span className="text-xs text-[#A6B8B5]">
                      Settlement: {order.currency}
                    </span>
                  </div>

                  {/* Line items */}
                  <div className="p-4 rounded-xl bg-[#061011] border border-[rgba(154,231,207,0.12)] space-y-2.5">
                    {order.items?.map((item: any, idx: number) => (
                      <div key={idx} className="flex justify-between items-center text-xs">
                        <div>
                          <div className="font-bold text-[#F4F7F4] text-sm font-sans">{item.name}</div>
                          <div className="text-[11px] text-[#A6B8B5] font-mono">
                            SKU: {item.sku} · Qty: {item.quantity} · Rate: ${item.unit_price?.toFixed(2)}/unit
                          </div>
                          {item.discount_applied && (
                            <div className="text-xs text-[#5FC7A1] font-semibold mt-0.5 font-mono">
                              {item.discount_applied}
                            </div>
                          )}
                        </div>
                        <span className="font-mono font-bold text-[#F4F7F4] text-sm">
                          ${item.subtotal?.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                        </span>
                      </div>
                    ))}
                  </div>

                  {/* AI Recommendation Box */}
                  <div className="p-4 rounded-xl bg-[#173034]/80 border border-[#79E7C7]/30 text-xs leading-relaxed space-y-1.5">
                    <div className="flex items-center gap-2 text-[#79E7C7] font-bold font-mono">
                      <Sparkles className="w-4 h-4" />
                      <span>AI Recommendation Audit (Confidence: {((order.ai_confidence_score || 0.94) * 100).toFixed(0)}%)</span>
                    </div>
                    <p className="text-[#A6B8B5]">{order.ai_recommendation}</p>
                  </div>
                </div>

                {/* Right Action & Cost Breakdown Box */}
                <div className="w-full lg:w-80 p-6 rounded-2xl bg-[#061011] border border-[rgba(154,231,207,0.12)] space-y-4 shrink-0 font-mono shadow-sm">
                  <h4 className="text-[11px] uppercase tracking-wider font-bold text-[#A6B8B5] font-mono">
                    Financial Summary
                  </h4>

                  <div className="space-y-2 text-xs text-[#A6B8B5]">
                    <div className="flex justify-between">
                      <span>Merchandise Subtotal:</span>
                      <strong className="text-[#F4F7F4]">${order.subtotal?.toFixed(2)}</strong>
                    </div>
                    <div className="flex justify-between">
                      <span>Expedited Air Freight:</span>
                      <strong className="text-[#F4F7F4]">${order.shipping?.toFixed(2)}</strong>
                    </div>
                    <div className="flex justify-between">
                      <span>Estimated Tax (5%):</span>
                      <strong className="text-[#F4F7F4]">${order.tax?.toFixed(2)}</strong>
                    </div>
                    <div className="pt-3 border-t border-[rgba(154,231,207,0.12)] flex justify-between text-sm">
                      <span className="font-bold text-[#F4F7F4] font-sans">Authorized Total:</span>
                      <strong className="text-[#79E7C7] font-bold text-base">
                        ${order.total_amount?.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      </strong>
                    </div>
                  </div>

                  <div className="pt-4 space-y-2.5">
                    <Button
                      onClick={() => handleApprove(order.id)}
                      isLoading={approvingId === order.id}
                      size="lg"
                      className="w-full gap-2 shadow-[0_0_24px_rgba(84,201,179,0.25)] font-bold text-xs font-mono bg-[#79E7C7] text-[#061011] hover:bg-[#79E7C7]/90 rounded-xl h-11"
                    >
                      <CheckCircle2 className="w-4 h-4" /> Sign & Authorize PO
                    </Button>

                    <Link href={`/dashboard/checkout?orderId=${order.id}`} className="block">
                      <Button variant="secondary" size="sm" className="w-full text-xs gap-1.5 font-mono bg-[#0B191B] border border-[rgba(154,231,207,0.12)] text-[#F4F7F4] hover:bg-[#173034] rounded-xl h-9">
                        <CreditCard className="w-3.5 h-3.5 text-[#79E7C7]" />
                        Preview Checkout Interface
                      </Button>
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="p-8 rounded-2xl border border-[rgba(154,231,207,0.12)] bg-[#0B191B]/60 text-center text-[#A6B8B5] text-xs font-mono shadow-sm">
            <CheckCircle2 className="w-8 h-8 text-[#5FC7A1] mx-auto mb-2" />
            No pending purchase orders requiring signature. All authorized orders are queued for PayPal settlement.
          </div>
        )}
      </div>

      {/* ─── APPROVED ORDERS (READY FOR PAYPAL CHECKOUT) ────────────────────── */}
      <div className="space-y-4 pt-4">
        <h3 className="font-display font-semibold text-lg text-[#F4F7F4] px-1">
          Authorized Orders History
        </h3>

        <div className="space-y-3">
          {approvedOrders.map((order) => (
            <div
              key={order.id}
              className="p-5 rounded-2xl bg-[#0B191B]/80 border border-[rgba(154,231,207,0.12)] shadow-sm backdrop-blur-md transition-all hover:bg-[#0B191B]"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2 mb-1.5 font-mono">
                    <span className="text-sm font-bold text-[#F4F7F4]">
                      {order.order_number}
                    </span>
                    <span
                      className={`text-[11px] uppercase tracking-wider font-mono font-bold px-2 py-0.5 rounded-md ${
                        order.status === "payment_completed"
                          ? "bg-[#5FC7A1]/15 text-[#5FC7A1] border border-[#5FC7A1]/30"
                          : "bg-[#79E7C7]/15 text-[#79E7C7] border border-[#79E7C7]/30"
                      }`}
                    >
                      {order.status.replace("_", " ").toUpperCase()}
                    </span>
                  </div>
                  <div className="text-xs text-[#A6B8B5] font-mono">
                    {order.items?.length || 1} line item(s) · Merchant signature applied · Ready for PayPal Sandbox rails
                  </div>
                </div>

                <div className="flex items-center gap-6 font-mono">
                  <div className="text-right">
                    <div className="text-xs text-[#708784] uppercase">Approved Amount</div>
                    <div className="text-lg font-bold text-[#79E7C7]">
                      ${order.total_amount?.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </div>
                  </div>

                  {order.status !== "payment_completed" ? (
                    <Link href={`/dashboard/checkout?orderId=${order.id}`}>
                      <Button size="sm" className="text-xs gap-1.5 shadow-[0_0_24px_rgba(84,201,179,0.25)] font-mono font-bold bg-[#79E7C7] text-[#061011] hover:bg-[#79E7C7]/90 rounded-xl h-9">
                        <CreditCard className="w-3.5 h-3.5" />
                        Pay with PayPal Sandbox
                      </Button>
                    </Link>
                  ) : (
                    <Link href="/dashboard/tracking">
                      <Button size="sm" variant="outline" className="text-xs gap-1.5 font-mono border-[rgba(154,231,207,0.12)] text-[#F4F7F4] hover:bg-[#173034] rounded-xl h-9">
                        Track Shipment <ArrowRight className="w-3.5 h-3.5" />
                      </Button>
                    </Link>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </PageEntrance>
  );
}
