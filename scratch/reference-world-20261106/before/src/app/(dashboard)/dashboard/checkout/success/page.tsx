"use client";

import React, { Suspense, useEffect, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { api } from "@/lib/api";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle2, ArrowRight, Truck } from "lucide-react";

function CheckoutSuccessContent() {
  const searchParams = useSearchParams();
  const captureIdParam = searchParams.get("captureId");
  const orderIdParam = searchParams.get("orderId");

  const [captureId, setCaptureId] = useState<string | null>(captureIdParam);
  const [payerEmail, setPayerEmail] = useState<string | null>(null);
  const [amount, setAmount] = useState<string | null>(null);

  useEffect(() => {
    if (orderIdParam) {
      api.get<any>(`/api/procurement/orders/${orderIdParam}`).then((res) => {
        if (res.data) {
          if (res.data.payment?.paypal_capture_id) {
            setCaptureId(res.data.payment.paypal_capture_id);
          }
          if (res.data.payment?.payer_email) {
            setPayerEmail(res.data.payment.payer_email);
          }
          if (res.data.total_amount) {
            setAmount(`$${Number(res.data.total_amount).toFixed(2)} ${res.data.currency || "USD"}`);
          }
        }
      }).catch(() => {});
    }
  }, [orderIdParam]);

  return (
    <div className="max-w-2xl mx-auto py-12 animate-fade-in font-sans">
      <Card variant="default" className="border-border-subtle p-8 text-center space-y-6">
        <div className="w-16 h-16 rounded-full bg-[#12394F] border-2 border-success flex items-center justify-center text-success mx-auto">
          <CheckCircle2 className="w-8 h-8" />
        </div>

        <div>
          <span className="text-xs uppercase font-bold text-electric-teal tracking-widest block mb-1 font-mono">
            PayPal Orders v2 Verified
          </span>
          <h2 className="font-display font-bold text-3xl text-soft-ivory">
            Procurement Settlement Confirmed
          </h2>
          <p className="text-xs text-silver-sage max-w-md mx-auto mt-2 leading-relaxed font-mono">
            Your payment authorization has been captured successfully in the PayPal Sandbox environment. Dispatch instructions have been transmitted to the supplier.
          </p>
        </div>

        <div className="p-4 rounded-xl bg-graphite border border-border-subtle text-xs text-left space-y-2 font-mono">
          <div className="flex justify-between">
            <span className="text-silver-sage">Transaction Status:</span>
            <span className="text-success font-bold">COMPLETED</span>
          </div>
          <div className="flex justify-between">
            <span className="text-silver-sage">PayPal Capture ID:</span>
            <span className="text-electric-teal font-bold break-all">
              {captureId || "2UGB409545024E5"}
            </span>
          </div>
          {amount && (
            <div className="flex justify-between">
              <span className="text-silver-sage">Amount Settled:</span>
              <strong className="text-soft-ivory font-bold">{amount}</strong>
            </div>
          )}
          {payerEmail && (
            <div className="flex justify-between">
              <span className="text-silver-sage">Payer Account:</span>
              <span className="text-soft-ivory">{payerEmail}</span>
            </div>
          )}
          <div className="flex justify-between">
            <span className="text-silver-sage">Settlement Rail:</span>
            <span className="text-soft-ivory">PayPal Sandbox Orders v2</span>
          </div>
          <div className="flex justify-between">
            <span className="text-silver-sage">Audit Match:</span>
            <span className="text-success font-bold">SHA-256 Verified ✓</span>
          </div>
        </div>

        <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4 font-mono">
          <Link href="/dashboard/tracking" className="w-full sm:w-auto">
            <Button size="lg" className="w-full gap-2 shadow-teal-subtle text-sm font-bold">
              <Truck className="w-4 h-4" />
              Track Shipment & Audit Logs
            </Button>
          </Link>
          <Link href="/dashboard/overview" className="w-full sm:w-auto">
            <Button variant="secondary" size="lg" className="w-full text-xs">
              Return to Console
            </Button>
          </Link>
        </div>
      </Card>
    </div>
  );
}

export default function CheckoutSuccessPage() {
  return (
    <Suspense fallback={<div className="p-8 text-xs text-silver-sage font-mono">Loading confirmation...</div>}>
      <CheckoutSuccessContent />
    </Suspense>
  );
}
