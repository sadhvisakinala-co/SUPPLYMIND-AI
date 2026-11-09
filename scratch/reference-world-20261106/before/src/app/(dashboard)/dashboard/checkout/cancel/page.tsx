"use client";

import React from "react";
import Link from "next/link";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AlertCircle, ArrowLeft, RefreshCw } from "lucide-react";

export default function CheckoutCancelPage() {
  return (
    <div className="max-w-2xl mx-auto py-12 animate-fade-in font-sans">
      <Card variant="default" className="border-warning/40 p-8 text-center space-y-6">
        <div className="w-16 h-16 rounded-full bg-[#2a2217] border-2 border-warning flex items-center justify-center text-warning mx-auto">
          <AlertCircle className="w-8 h-8" />
        </div>

        <div>
          <span className="text-xs uppercase font-bold text-warning tracking-widest block mb-1 font-mono">
            PayPal Payment Cancelled
          </span>
          <h2 className="font-display font-bold text-3xl text-soft-ivory">
            Transaction Was Not Completed
          </h2>
          <p className="text-xs text-silver-sage max-w-md mx-auto mt-2 leading-relaxed">
            The checkout session was cancelled by the merchant or timed out. No funds were captured in the PayPal Sandbox. The purchase order remains in approved state.
          </p>
        </div>

        <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4 font-mono">
          <Link href="/dashboard/checkout" className="w-full sm:w-auto">
            <Button size="lg" className="w-full gap-2 shadow-teal-subtle text-sm font-bold">
              <RefreshCw className="w-4 h-4" />
              Resume PayPal Checkout
            </Button>
          </Link>
          <Link href="/dashboard/approval" className="w-full sm:w-auto">
            <Button variant="secondary" size="lg" className="w-full text-xs">
              <ArrowLeft className="w-4 h-4" />
              Back to Approval Gate
            </Button>
          </Link>
        </div>
      </Card>
    </div>
  );
}
