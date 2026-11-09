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
} from "lucide-react";

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
      setSuccessMessage("Order officially approved by merchant! Redirecting to PayPal Sandbox Checkout...");
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
    <div className="space-y-8 animate-fade-in font-sans">
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-mono font-semibold text-electric-teal uppercase tracking-widest block mb-1">
            Merchant Governance & Compliance
          </span>
          <h2 className="font-display font-bold text-3xl text-soft-ivory">
            Purchase Approval Gate
          </h2>
          <p className="text-xs text-silver-sage mt-1 font-mono">
            Human-in-the-loop authorization. AI agents cannot initiate money movement without explicit merchant approval.
          </p>
        </div>

        <Button
          variant="secondary"
          size="sm"
          onClick={fetchOrders}
          className="text-xs gap-1.5 h-9 font-mono"
        >
          <RefreshCw className="w-3.5 h-3.5 text-electric-teal" />
          Refresh Orders
        </Button>
      </div>

      {/* Success Notification Banner */}
      {successMessage && (
        <div className="p-4 rounded-xl bg-[#12394F] border border-success/50 flex items-center justify-between text-success text-xs font-mono animate-fade-in">
          <div className="flex items-center gap-3">
            <CheckCircle2 className="w-5 h-5 text-success shrink-0" />
            <div>
              <div className="font-bold">{successMessage}</div>
              <div className="text-[11px] text-silver-sage">Ready to proceed to PayPal Sandbox payment rails.</div>
            </div>
          </div>
          <Link href="/dashboard/checkout">
            <Button size="sm" variant="default" className="text-xs gap-1.5 shadow-teal-subtle font-mono">
              Launch PayPal Checkout <ArrowRight className="w-3.5 h-3.5" />
            </Button>
          </Link>
        </div>
      )}

      {/* ─── PENDING ORDERS REQUIRING APPROVAL ─────────────────────────────── */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h3 className="font-display font-bold text-lg text-soft-ivory flex items-center gap-2">
            <span>Awaiting Merchant Signature</span>
            <Badge variant="warning">{pendingOrders.length} Required</Badge>
          </h3>
        </div>

        {pendingOrders.length > 0 ? (
          pendingOrders.map((order) => (
            <div
              key={order.id}
              className="rounded-2xl border-2 border-warning/50 bg-gradient-to-r from-[#282115] via-charcoal to-graphite p-6 sm:p-8 shadow-2xl relative overflow-hidden"
            >
              <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-8">
                {/* Order Details */}
                <div className="flex-1 space-y-4">
                  <div className="flex items-center gap-3 font-mono">
                    <span className="text-base font-bold text-electric-teal">
                      {order.order_number}
                    </span>
                    <Badge variant="warning">PENDING MERCHANT SIGN-OFF</Badge>
                    <span className="text-xs text-silver-sage">
                      Currency: {order.currency}
                    </span>
                  </div>

                  {/* Line items */}
                  <div className="p-4 rounded-xl bg-graphite border border-border-subtle space-y-2">
                    {order.items?.map((item: any, idx: number) => (
                      <div key={idx} className="flex justify-between items-center text-xs">
                        <div>
                          <div className="font-bold text-soft-ivory text-sm font-sans">{item.name}</div>
                          <div className="text-[11px] text-silver-sage font-mono">
                            SKU: {item.sku} · Qty: {item.quantity} · Rate: ${item.unit_price?.toFixed(2)}/unit
                          </div>
                          {item.discount_applied && (
                            <div className="text-[10px] text-success font-semibold mt-0.5 font-mono">
                              {item.discount_applied}
                            </div>
                          )}
                        </div>
                        <span className="font-mono font-bold text-soft-ivory text-sm">
                          ${item.subtotal?.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                        </span>
                      </div>
                    ))}
                  </div>

                  {/* AI Recommendation Box */}
                  <div className="p-4 rounded-xl bg-surface border border-electric-teal/30 text-xs leading-relaxed space-y-1.5">
                    <div className="flex items-center gap-2 text-electric-teal font-bold font-mono">
                      <Sparkles className="w-4 h-4" />
                      <span>AI Procurement Recommendation (Confidence: {((order.ai_confidence_score || 0.94) * 100).toFixed(0)}%)</span>
                    </div>
                    <p className="text-silver-sage">{order.ai_recommendation}</p>
                  </div>
                </div>

                {/* Right Action & Cost Breakdown Box */}
                <div className="w-full lg:w-80 p-6 rounded-xl bg-graphite border border-border-subtle space-y-4 shrink-0 font-mono">
                  <h4 className="text-xs uppercase font-bold text-silver-sage tracking-wider font-sans">
                    Financial Summary
                  </h4>

                  <div className="space-y-2 text-xs text-silver-sage">
                    <div className="flex justify-between">
                      <span>Subtotal:</span>
                      <strong className="text-soft-ivory">${order.subtotal?.toFixed(2)}</strong>
                    </div>
                    <div className="flex justify-between">
                      <span>Expedited Freight:</span>
                      <strong className="text-soft-ivory">${order.shipping?.toFixed(2)}</strong>
                    </div>
                    <div className="flex justify-between">
                      <span>Estimated Tax (5%):</span>
                      <strong className="text-soft-ivory">${order.tax?.toFixed(2)}</strong>
                    </div>
                    <div className="pt-3 border-t border-border-subtle flex justify-between text-sm">
                      <span className="font-bold text-soft-ivory font-sans">Total Approved:</span>
                      <strong className="text-electric-teal font-bold text-base">
                        ${order.total_amount?.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      </strong>
                    </div>
                  </div>

                  <div className="pt-4 space-y-2">
                    <Button
                      onClick={() => handleApprove(order.id)}
                      isLoading={approvingId === order.id}
                      size="lg"
                      className="w-full gap-2 shadow-teal-subtle font-bold text-sm font-mono"
                    >
                      <CheckCircle2 className="w-4 h-4" /> Approve Purchase Order
                    </Button>

                    <Link href={`/dashboard/checkout?orderId=${order.id}`} className="block">
                      <Button variant="secondary" size="sm" className="w-full text-xs gap-1.5 font-mono">
                        <CreditCard className="w-3.5 h-3.5 text-electric-teal" />
                        Preview Checkout Interface
                      </Button>
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="p-8 rounded-2xl border border-border-subtle bg-charcoal text-center text-silver-sage text-xs font-mono">
            <CheckCircle2 className="w-8 h-8 text-success mx-auto mb-2" />
            No pending purchase orders requiring signature. All approved orders are ready for checkout.
          </div>
        )}
      </div>

      {/* ─── APPROVED ORDERS (READY FOR PAYPAL CHECKOUT) ────────────────────── */}
      <div className="space-y-4 pt-6">
        <h3 className="font-display font-bold text-lg text-soft-ivory">
          Approved Orders History
        </h3>

        <div className="space-y-3">
          {approvedOrders.map((order) => (
            <Card key={order.id} variant="default" className="border-border-subtle p-5">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2 mb-1 font-mono">
                    <span className="text-sm font-bold text-soft-ivory">
                      {order.order_number}
                    </span>
                    <Badge variant={order.status === "payment_completed" ? "success" : "default"}>
                      {order.status.toUpperCase()}
                    </Badge>
                  </div>
                  <div className="text-xs text-silver-sage font-mono">
                    {order.items?.length || 1} line item(s) · Approved for wholesale settlement
                  </div>
                </div>

                <div className="flex items-center gap-6 font-mono">
                  <div className="text-right">
                    <div className="text-[10px] text-silver-sage uppercase">Approved Amount</div>
                    <div className="text-lg font-bold text-electric-teal">
                      ${order.total_amount?.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </div>
                  </div>

                  {order.status !== "payment_completed" ? (
                    <Link href={`/dashboard/checkout?orderId=${order.id}`}>
                      <Button size="sm" className="text-xs gap-1.5 shadow-teal-subtle font-mono font-bold">
                        <CreditCard className="w-3.5 h-3.5" />
                        Pay with PayPal Sandbox
                      </Button>
                    </Link>
                  ) : (
                    <Link href="/dashboard/tracking">
                      <Button size="sm" variant="outline" className="text-xs gap-1.5 font-mono">
                        Track Shipment <ArrowRight className="w-3.5 h-3.5" />
                      </Button>
                    </Link>
                  )}
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
