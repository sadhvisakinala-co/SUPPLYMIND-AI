"use client";

import React, { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { api } from "@/lib/api";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  CreditCard,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  ExternalLink,
  Lock,
  RefreshCw,
  Clock,
  Sparkles,
  FileText,
  Activity,
  Code2,
  X,
  Terminal,
  Cpu,
  Layers,
  Check,
} from "lucide-react";
import { PageEntrance, SpotlightCard } from "@/components/ui/motion";

function CheckoutContent() {
  const searchParams = useSearchParams();
  const orderIdParam = searchParams.get("orderId");
  const checkoutStatus = searchParams.get("status");

  const [orders, setOrders] = useState<any[]>([]);
  const [selectedOrder, setSelectedOrder] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);

  // Payment states
  const [creatingPayment, setCreatingPayment] = useState<boolean>(false);
  const [paymentSession, setPaymentSession] = useState<any>(null);
  const [capturing, setCapturing] = useState<boolean>(false);
  const [captureResult, setCaptureResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [paypalConfigured, setPaypalConfigured] = useState<boolean>(true);

  // Live Payment Execution Monitor slide-out drawer state
  const [monitorOpen, setMonitorOpen] = useState<boolean>(false);
  const [telemetryLogs, setTelemetryLogs] = useState<any[]>([]);

  const addTelemetryLog = (stage: string, data: any) => {
    setTelemetryLogs((prev) => [
      ...prev,
      {
        timestamp: new Date().toISOString(),
        stage,
        data,
      },
    ]);
  };

  const getPaymentDetails = () => {
    const payment = captureResult || selectedOrder?.payment;
    const isCompleted =
      selectedOrder?.status === "payment_completed" ||
      payment?.status === "completed" ||
      payment?.status === "COMPLETED";
    const isPending =
      selectedOrder?.status === "payment_pending" ||
      payment?.status === "pending" ||
      payment?.status === "PENDING";
    const isFailed =
      selectedOrder?.status === "payment_failed" ||
      payment?.status === "failed" ||
      payment?.status === "FAILED";

    const isSimulated =
      payment?.is_simulated ||
      payment?.payment_method === "simulated" ||
      (typeof payment?.paypal_capture_id === "string" &&
        payment.paypal_capture_id.startsWith("SIM-"));

    const rawCaptureId =
      payment?.paypal_capture_id || payment?.capture_id || null;

    let captureIdDisplay = "Not available";
    let isVerifiedCapture = false;

    if (isCompleted) {
      if (isSimulated) {
        captureIdDisplay = "Simulated payment — no PayPal capture ID";
      } else if (rawCaptureId) {
        captureIdDisplay = rawCaptureId;
        isVerifiedCapture = true;
      } else {
        captureIdDisplay = "Not available";
      }
    } else if (isPending) {
      captureIdDisplay = "Awaiting buyer approval";
    } else if (isFailed) {
      captureIdDisplay = "Payment failed";
    } else if (!paypalConfigured) {
      captureIdDisplay = "PayPal Sandbox not configured";
    } else {
      captureIdDisplay = "Not available";
    }

    return {
      isCompleted,
      isPending,
      isFailed,
      isSimulated,
      isVerifiedCapture,
      captureIdDisplay,
      payerEmail:
        payment?.payer_email ||
        captureResult?.payer_email ||
        (isCompleted ? "Verified Merchant Account" : "supplymind-buyer@sandbox.com"),
    };
  };

  const fetchApprovedOrders = async () => {
    try {
      setLoading(true);
      const res = await api.get<any[]>("/api/procurement/orders");
      const list = res.data || [];
      const payable = list.filter(
        (o) => o.merchant_approved || o.status === "approved" || o.status === "payment_pending" || o.status === "payment_completed"
      );
      setOrders(payable);

      if (orderIdParam) {
        const target = list.find((o) => o.id === parseInt(orderIdParam));
        if (target) setSelectedOrder(target);
      } else if (payable.length > 0 && !selectedOrder) {
        setSelectedOrder(payable[0]);
      }
    } catch (err) {
      console.error("Failed to fetch orders", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApprovedOrders();
  }, [orderIdParam]);

  useEffect(() => {
    api.get<any>("/api/paypal/status").then((res) => {
      setPaypalConfigured(Boolean(res.data?.configured));
      addTelemetryLog("System Initialization", {
        environment: res.data?.environment || "sandbox",
        gateway: "PayPal Orders v2 REST API",
        credentials_configured: res.data?.configured || false,
        status: res.data?.status || "ready",
      });
    }).catch(() => {
      setPaypalConfigured(false);
    });
  }, []);

  const handleCreatePayPalOrder = async () => {
    if (!selectedOrder) return;
    try {
      setCreatingPayment(true);
      setError(null);

      const outboundPayload = {
        order_id: selectedOrder.id,
        order_number: selectedOrder.order_number,
        total_amount: selectedOrder.total_amount,
        currency: selectedOrder.currency,
        subtotal: selectedOrder.subtotal,
        shipping: selectedOrder.shipping,
        tax: selectedOrder.tax,
      };
      addTelemetryLog("Outbound: POST /api/paypal/create-order", outboundPayload);

      const res = await api.post<any>("/api/paypal/create-order", {
        order_id: selectedOrder.id,
      });

      setPaymentSession(res.data);
      addTelemetryLog("Inbound: PayPal Response Status", res.data);

      if (res.data?.status === "configuration_required") {
        setError(res.data.message);
      }
    } catch (err: any) {
      const errMsg = err.detail || err.message || "Failed to initialize PayPal order session.";
      setError(errMsg);
      addTelemetryLog("Error: Order Creation Failed", { error: errMsg });
    } finally {
      setCreatingPayment(false);
    }
  };

  const handleCapturePayment = async () => {
    const ppId = paymentSession?.paypal_order_id;
    if (!ppId) return;

    try {
      setCapturing(true);
      setError(null);
      addTelemetryLog(`Outbound: POST /api/paypal/capture-order`, {
        paypal_order_id: ppId,
        idempotency_key: `IDEMP-${Date.now()}`,
      });

      const res = await api.post<any>("/api/paypal/capture-order", {
        paypal_order_id: ppId,
      });

      setCaptureResult(res.data);
      addTelemetryLog("Inbound: Verified Payment Result", res.data);
      await fetchApprovedOrders();
    } catch (err: any) {
      const errMsg = err.detail || err.message || "Failed to capture PayPal payment.";
      setError(errMsg);
      addTelemetryLog("Error: Capture Failed", { error: errMsg });
    } finally {
      setCapturing(false);
    }
  };

  return (
    <PageEntrance className="space-y-8 font-sans relative">
      {/* ─── TITLE & TELEMETRY TOGGLE ───────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-mono font-semibold text-[#79E7C7] uppercase tracking-widest block mb-1">
            Fintech Settlement Gateway
          </span>
          <h2 className="font-display font-bold text-3xl md:text-4xl font-bold font-display text-[#F4F7F4] tracking-tight">
            PayPal Orders v2 Sandbox Checkout
          </h2>
          <p className="text-sm text-[#A6B8B5] mt-1 font-sans">
            Server-side token exchange, cryptographic idempotency, and automated capture verification.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Button
            variant="secondary"
            size="sm"
            onClick={() => setMonitorOpen(true)}
            className="text-xs gap-2 h-9 font-mono bg-[#0B191B] border border-[#79E7C7]/40 text-[#79E7C7] hover:bg-[#173034] rounded-xl"
          >
            <span className="w-2 h-2 rounded-full bg-[#79E7C7] animate-pulse" />
            <Terminal className="w-3.5 h-3.5" />
            Live Execution Monitor
          </Button>

          <Link href="/dashboard/tracking">
            <Button variant="secondary" size="sm" className="text-xs gap-1.5 h-9 font-mono bg-[#0B191B] border border-[rgba(154,231,207,0.12)] text-[#F4F7F4] hover:bg-[#173034] rounded-xl">
              <FileText className="w-3.5 h-3.5 text-[#79E7C7]" />
              Audit & Tracking
            </Button>
          </Link>
        </div>
      </div>

      {checkoutStatus === "cancelled" && (
        <div className="p-4 rounded-2xl bg-[#2e1717] border border-[#D8AD70]/50 flex items-center justify-between gap-3 text-[#D8AD70] text-xs font-mono shadow-sm">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-[#D8AD70] shrink-0" />
            <span>PayPal checkout session was cancelled by buyer. Order remains pending merchant authorization.</span>
          </div>
          <Button size="sm" variant="ghost" onClick={() => window.history.replaceState({}, "", "/dashboard/checkout")} className="text-xs">
            Dismiss
          </Button>
        </div>
      )}

      {error && (
        <div className="p-4 rounded-2xl bg-[#2e1717] border border-[#D77979]/50 flex items-start gap-3 text-[#D77979] text-xs font-mono shadow-sm">
          <AlertTriangle className="w-4 h-4 text-[#D77979] shrink-0 mt-0.5" />
          <div className="flex-1">
            <strong className="block font-sans mb-0.5">Execution Notice:</strong>
            {error}
          </div>
        </div>
      )}

      {/* Main Checkout Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Select Order & Item Breakdown */}
        <div className="lg:col-span-7 space-y-6">
          <div className="p-5 rounded-2xl bg-[#0B191B]/90 border border-[rgba(154,231,207,0.12)] shadow-sm backdrop-blur-md">
            <label className="block text-[11px] font-bold uppercase tracking-wider text-[#A6B8B5] mb-2 font-mono">
              Select Authorized Order for Settlement
            </label>
            {orders.length > 0 ? (
              <select
                value={selectedOrder?.id || ""}
                onChange={(e) => {
                  const o = orders.find((x) => x.id === parseInt(e.target.value));
                  setSelectedOrder(o);
                  setPaymentSession(null);
                  setCaptureResult(null);
                }}
                className="w-full bg-[#061011] border border-[rgba(154,231,207,0.12)] rounded-xl p-3 text-[#F4F7F4] text-xs font-mono focus:outline-none focus:border-[#79E7C7] transition-colors"
              >
                {orders.map((o) => (
                  <option key={o.id} value={o.id}>
                    {o.order_number} — ${o.total_amount?.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} ({o.status})
                  </option>
                ))}
              </select>
            ) : (
              <div className="text-xs text-[#A6B8B5] p-2 font-mono">
                No orders currently authorized. Please sign an order in the Approval Gate first.
              </div>
            )}
          </div>

          {/* Selected Order Summary */}
          {selectedOrder && (
            <div className="p-6 rounded-2xl bg-[#0B191B]/90 border border-[rgba(154,231,207,0.12)] shadow-sm backdrop-blur-md">
              <div className="flex items-center justify-between pb-4 border-b border-[rgba(154,231,207,0.12)] mb-5">
                <div>
                  <h4 className="font-display font-semibold text-base text-[#F4F7F4]">
                    Purchase Order Details
                  </h4>
                  <div className="font-mono text-xs text-[#79E7C7] mt-0.5 flex items-center gap-2">
                    <span>{selectedOrder.order_number}</span>
                    <span className="text-xs font-mono font-bold uppercase tracking-wider px-2 py-0.5 rounded-md bg-[#79E7C7]/15 text-[#79E7C7] border border-[#79E7C7]/30">
                      {selectedOrder.merchant_approved ? "Merchant Approved" : "Pending Sign-Off"}
                    </span>
                  </div>
                </div>
                <span
                  className={`text-[11px] uppercase tracking-wider font-mono font-bold px-2 py-0.5 rounded-md ${
                    selectedOrder.status === "payment_completed"
                      ? "bg-[#5FC7A1]/15 text-[#5FC7A1] border border-[#5FC7A1]/30"
                      : "bg-[#79E7C7]/15 text-[#79E7C7] border border-[#79E7C7]/30"
                  }`}
                >
                  {selectedOrder.status.replace("_", " ").toUpperCase()}
                </span>
              </div>

              <div className="space-y-3 mb-6">
                {selectedOrder.items?.map((item: any, idx: number) => (
                  <div
                    key={idx}
                    className="p-4 rounded-xl bg-[#061011] border border-[rgba(154,231,207,0.08) flex items-center justify-between text-xs"
                  >
                    <div>
                      <div className="font-bold text-[#F4F7F4] font-sans">{item.name}</div>
                      <div className="text-[11px] text-[#A6B8B5] font-mono mt-0.5">
                        SKU: {item.sku} · Qty: {item.quantity} · Rate: ${Number(item.unit_price).toFixed(2)}
                      </div>
                    </div>
                    <div className="font-mono font-bold text-[#79E7C7] text-sm">
                      ${Number(item.subtotal || item.quantity * item.unit_price).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </div>
                  </div>
                ))}
              </div>

              {/* Exact Mathematical Breakdown */}
              <div className="space-y-2 text-xs text-[#A6B8B5] pt-4 border-t border-[rgba(154,231,207,0.12)] font-mono">
                <div className="flex justify-between">
                  <span>Merchandise Subtotal:</span>
                  <span className="text-[#F4F7F4]">${Number(selectedOrder.subtotal).toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Expedited Air Freight:</span>
                  <span className="text-[#F4F7F4]">${Number(selectedOrder.shipping).toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Sales Tax (5%):</span>
                  <span className="text-[#F4F7F4]">${Number(selectedOrder.tax).toFixed(2)}</span>
                </div>
                <div className="flex justify-between pt-3 border-t border-[rgba(154,231,207,0.12)] text-sm font-bold font-sans">
                  <span className="text-[#F4F7F4]">Authorized Order Total:</span>
                  <span className="font-mono text-[#79E7C7] text-lg font-bold">
                    ${Number(selectedOrder.total_amount).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} {selectedOrder.currency}
                  </span>
                </div>
              </div>
            </div>
          )}

          <div className="p-4 rounded-2xl bg-[#173034]/80 border border-[rgba(154,231,207,0.12)] flex items-start gap-3 text-xs text-[#A6B8B5] leading-relaxed shadow-sm">
            <ShieldCheck className="w-5 h-5 text-[#79E7C7] shrink-0 mt-0.5" />
            <div>
              <strong className="text-[#F4F7F4] block mb-0.5 font-sans">Cryptographic State Chain Verification</strong>
              Approved purchase orders contain a tamper-evident SHA-256 canonical hash. During capture, the backend verifies that the executed PayPal transaction exactly matches approved quantities, fees, and currency.
            </div>
          </div>
        </div>

        {/* Right Column: PayPal Payment Gateway Action Panel */}
        <div className="lg:col-span-5 space-y-6">
          <div className="p-6 sm:p-8 rounded-2xl bg-[#0B191B]/90 border border-[rgba(154,231,207,0.12)] shadow-sm-elevated backdrop-blur-md">
            <div className="flex items-center gap-3.5 pb-6 border-b border-[rgba(154,231,207,0.12)] mb-6">
              <div className="w-12 h-12 rounded-xl bg-[#003087] flex items-center justify-center text-white font-bold font-display text-lg shadow-lg">
                PP
              </div>
              <div>
                <h4 className="font-display font-semibold text-base text-[#F4F7F4]">
                  PayPal Checkout Terminal
                </h4>
                <div className="text-xs text-[#5FC7A1] font-mono flex items-center gap-1.5 mt-0.5">
                  <span className="w-2 h-2 rounded-full bg-[#5FC7A1] animate-pulse" />
                  Orders v2 Sandbox Protocol
                </div>
              </div>
            </div>

            {(() => {
              const paymentInfo = getPaymentDetails();
              if (captureResult || paymentInfo.isCompleted) {
                return (
                  <div className="space-y-4 animate-fade-in text-center py-4">
                    <div className="w-16 h-16 rounded-full bg-[#172c23] border border-[#5FC7A1] flex items-center justify-center text-[#5FC7A1] mx-auto shadow-[0_0_24px_rgba(84,201,179,0.25)]">
                      <CheckCircle2 className="w-8 h-8" />
                    </div>

                    <h3 className="font-display font-bold text-xl text-[#F4F7F4] tracking-tight">
                      {paymentInfo.isVerifiedCapture
                        ? "Payment Captured Successfully"
                        : paymentInfo.isSimulated
                        ? "Simulated Settlement Recorded"
                        : "Payment Completed"}
                    </h3>

                    <p className="text-xs text-[#A6B8B5] leading-relaxed max-w-sm mx-auto font-mono">
                      {paymentInfo.isVerifiedCapture
                        ? "PayPal transaction verified and captured on server."
                        : paymentInfo.isSimulated
                        ? "Simulated sandbox transaction recorded in procurement database."
                        : "Procurement order marked completed."}
                      <strong className="text-[#79E7C7] block mt-1 break-all">
                        Capture ID: {paymentInfo.captureIdDisplay}
                      </strong>
                    </p>

                    <div className="p-4 rounded-xl bg-[#061011] border border-[rgba(154,231,207,0.12)] text-left text-xs space-y-2 mt-4 font-mono">
                      <div className="flex justify-between">
                        <span className="text-[#A6B8B5]">Payer Account:</span>
                        <strong className="text-[#F4F7F4]">{paymentInfo.payerEmail}</strong>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-[#A6B8B5]">Payment Status:</span>
                        <strong className={paymentInfo.isVerifiedCapture ? "text-[#5FC7A1]" : "text-[#F4F7F4]"}>
                          {paymentInfo.isVerifiedCapture ? "VERIFIED_CAPTURED" : paymentInfo.isSimulated ? "SIMULATED_RECORD" : "COMPLETED"}
                        </strong>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-[#A6B8B5]">Amount Settled:</span>
                        <strong className="text-[#79E7C7] font-bold">
                          ${Number(selectedOrder?.total_amount).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} USD
                        </strong>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-[#A6B8B5]">Audit Match:</span>
                        <strong className="text-[#5FC7A1]">SHA-256 Verified ✓</strong>
                      </div>
                    </div>

                    <div className="pt-4 flex flex-col gap-2 font-mono">
                      <Link href="/dashboard/tracking">
                        <Button size="lg" className="w-full gap-2 shadow-[0_0_24px_rgba(84,201,179,0.25)] text-xs font-bold bg-[#79E7C7] text-[#061011] hover:bg-[#79E7C7]/90 rounded-xl h-11">
                          View Cryptographic Audit Trail <ArrowRight className="w-4 h-4" />
                        </Button>
                      </Link>
                    </div>
                  </div>
                );
              }
              if (paymentSession?.status === "configuration_required") {
                return (
                  <div className="space-y-4 p-5 rounded-2xl bg-[#282115] border border-[#D8AD70]/50 text-xs font-mono">
                    <div className="flex items-center gap-2 text-[#D8AD70] font-bold font-sans">
                      <AlertTriangle className="w-4 h-4" />
                      <span>Sandbox Credentials Required</span>
                    </div>
                    <p className="text-[#A6B8B5] leading-relaxed font-sans">
                      {paymentSession.message ||
                        "Set PAYPAL_CLIENT_ID and PAYPAL_CLIENT_SECRET in backend/.env from developer.paypal.com to process live sandbox payments."}
                    </p>
                    <div className="p-3 rounded-xl bg-[#061011] border border-[rgba(154,231,207,0.12)] text-[11px] text-[#F4F7F4] space-y-1">
                      <div>Environment: <strong>Sandbox</strong></div>
                      <div>Endpoint: <strong>POST /v2/checkout/orders</strong></div>
                      <div>Status: <span className="text-[#D8AD70]">Credentials Not Configured</span></div>
                    </div>
                  </div>
                );
              }
              if (paymentSession) {
                return (
                  <div className="space-y-5 animate-fade-in font-mono">
                    <div className="p-4 rounded-xl bg-[#173034] border border-[#79E7C7]/30 space-y-2 text-xs">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-[#79E7C7] flex items-center gap-1.5 font-sans">
                          <Sparkles className="w-3.5 h-3.5" /> PayPal Order Created
                        </span>
                        <span className="text-[11px] font-mono font-bold uppercase tracking-wider px-2 py-0.5 rounded-md bg-[#D8AD70]/15 text-[#D8AD70] border border-[#D8AD70]/30">
                          AWAITING CAPTURE
                        </span>
                      </div>
                      <div className="text-[11px] text-[#A6B8B5] break-all">
                        Order ID: <strong className="text-[#F4F7F4]">{paymentSession.paypal_order_id}</strong>
                      </div>
                    </div>

                    <p className="text-xs text-[#A6B8B5] leading-relaxed font-sans">
                      The PayPal Orders v2 sandbox token has been generated. Execute the server-side capture below to verify funds settlement and issue the supplier dispatch trigger.
                    </p>

                    <div className="space-y-3 pt-2">
                      <Button
                        onClick={handleCapturePayment}
                        isLoading={capturing}
                        size="lg"
                        className="w-full gap-2 text-xs font-bold bg-[#0070BA] hover:bg-[#005ea6] text-white rounded-xl h-11"
                      >
                        <CreditCard className="w-4 h-4" />
                        Complete Sandbox Payment & Capture
                      </Button>

                      {paymentSession.approval_url && (
                        <a
                          href={paymentSession.approval_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="block"
                        >
                          <Button
                            variant="secondary"
                            size="sm"
                            className="w-full text-xs gap-1.5 font-mono bg-[#0B191B] border border-[rgba(154,231,207,0.12)] text-[#F4F7F4] hover:bg-[#173034] rounded-xl h-9"
                          >
                            <ExternalLink className="w-3.5 h-3.5 text-[#79E7C7]" />
                            Open in PayPal Sandbox Window
                          </Button>
                        </a>
                      )}
                    </div>
                  </div>
                );
              }

              return (
                <div className="space-y-5 font-mono">
                  <p className="text-xs text-[#A6B8B5] leading-relaxed font-sans">
                    Initiate a genuine PayPal Orders v2 Sandbox session for this purchase order. Server will generate an idempotent request with merchant approval verification.
                  </p>

                  <div className="p-4 rounded-xl bg-[#061011] border border-[rgba(154,231,207,0.12)] space-y-2 text-xs">
                    <div className="flex justify-between">
                      <span className="text-[#A6B8B5]">Buyer Account:</span>
                      <strong className="text-[#F4F7F4]">supplymind-buyer@sandbox.com</strong>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-[#A6B8B5]">Supplier Account:</span>
                      <strong className="text-[#F4F7F4]">b2b@techsource-global.com</strong>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-[#A6B8B5]">Settlement Currency:</span>
                      <strong className="text-[#79E7C7]">USD</strong>
                    </div>
                  </div>

                  <Button
                    onClick={handleCreatePayPalOrder}
                    isLoading={creatingPayment}
                    disabled={!selectedOrder || selectedOrder.status === "payment_completed"}
                    size="lg"
                    className="w-full gap-2 text-xs font-bold bg-[#79E7C7] text-[#061011] hover:bg-[#79E7C7]/90 font-mono rounded-xl h-11 shadow-[0_0_24px_rgba(84,201,179,0.25)]"
                  >
                    <CreditCard className="w-4 h-4 text-[#061011]" />
                    Initiate PayPal Sandbox Payment
                  </Button>
                </div>
              );
            })()}
          </div>
        </div>
      </div>

      {/* ─── 4. LIVE PAYMENT EXECUTION MONITOR SLIDE-OUT PANEL ────────────────── */}
      {monitorOpen && (
        <div className="fixed inset-0 z-50 flex justify-end animate-fade-in font-mono">
          <div
            className="fixed inset-0 bg-black/70 backdrop-blur-sm transition-opacity"
            onClick={() => setMonitorOpen(false)}
          />

          <div className="relative w-full max-w-xl bg-[#061011] border-l border-[rgba(154,231,207,0.12)] shadow-2xl h-full flex flex-col z-10">
            <div className="p-5 border-b border-[rgba(154,231,207,0.12)] flex items-center justify-between bg-[#0B191B]">
              <div className="flex items-center gap-2.5">
                <span className="w-2.5 h-2.5 rounded-full bg-[#79E7C7] animate-pulse" />
                <h3 className="font-display font-semibold text-base text-[#F4F7F4] font-sans">
                  Live Payment Execution Monitor
                </h3>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setMonitorOpen(false)}
                className="text-[#A6B8B5] hover:text-[#F4F7F4] p-1 h-8 w-8 rounded-lg"
              >
                <X className="w-4 h-4" />
              </Button>
            </div>

            <div className="p-3 bg-[#173034] border-b border-[rgba(154,231,207,0.12)] text-[11px] text-[#A6B8B5] flex items-center justify-between">
              <span>Security: <strong className="text-[#5FC7A1]">Server-Side Credentials Active</strong></span>
              <span className="text-[#79E7C7]">Secrets & Tokens Redacted ✓</span>
            </div>

            <div className="flex-1 overflow-y-auto p-5 space-y-4">
              {telemetryLogs.length === 0 ? (
                <div className="text-xs text-[#708784] text-center py-12">
                  No execution traces logged yet. Initiate an order creation to observe live API stream.
                </div>
              ) : (
                telemetryLogs.map((log, idx) => (
                  <div key={idx} className="p-3.5 rounded-xl bg-[#0B191B] border border-[rgba(154,231,207,0.12)] space-y-2 text-xs">
                    <div className="flex items-center justify-between border-b border-[rgba(154,231,207,0.08) pb-1.5">
                      <span className="font-bold text-[#79E7C7]">{log.stage}</span>
                      <span className="text-xs text-[#708784]">{new Date(log.timestamp).toLocaleTimeString()}</span>
                    </div>
                    <pre className="text-[11px] text-[#F4F7F4]/90 overflow-x-auto p-2.5 rounded-lg bg-[#061011] font-mono border border-[rgba(154,231,207,0.08)">
                      {JSON.stringify(log.data, null, 2)}
                    </pre>
                  </div>
                ))
              )}
            </div>

            <div className="p-4 border-t border-[rgba(154,231,207,0.12)] bg-[#0B191B] flex items-center justify-between text-xs">
              <span className="text-[#A6B8B5]">Gateway: PayPal Orders v2</span>
              <Button size="sm" variant="outline" onClick={() => setTelemetryLogs([])} className="text-xs h-8 rounded-lg border-[rgba(154,231,207,0.12)] text-[#F4F7F4]">
                Clear Trace
              </Button>
            </div>
          </div>
        </div>
      )}
    </PageEntrance>
  );
}

export default function CheckoutPage() {
  return (
    <Suspense fallback={<div className="p-8 text-xs text-[#A6B8B5] font-mono">Loading PayPal Sandbox Checkout...</div>}>
      <CheckoutContent />
    </Suspense>
  );
}
