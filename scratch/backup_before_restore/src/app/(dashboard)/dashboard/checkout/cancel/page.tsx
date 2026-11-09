"use client";

import React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { AlertCircle, ArrowLeft, RefreshCw } from "lucide-react";

export default function CheckoutCancelPage() {
  return (
    <div className="max-w-2xl mx-auto py-12 animate-fade-in font-sans">
      <div className="rounded-2xl border border-[#D8AD70]/40 bg-[#172024]/90 p-8 sm:p-10 text-center space-y-6 shadow-atelier-elevated backdrop-blur-md">
        <div className="w-16 h-16 rounded-full bg-[#282115] border border-[#D8AD70] flex items-center justify-center text-[#D8AD70] mx-auto">
          <AlertCircle className="w-8 h-8" />
        </div>

        <div>
          <span className="text-xs uppercase font-bold text-[#D8AD70] tracking-widest block mb-1 font-mono">
            PayPal Payment Cancelled
          </span>
          <h2 className="font-display font-bold text-3xl text-[#EDECE6] tracking-tight">
            Transaction Was Not Completed
          </h2>
          <p className="text-xs text-[#9AA9A8] max-w-md mx-auto mt-2 leading-relaxed font-sans">
            The checkout session was cancelled by the merchant or timed out. No funds were captured in the PayPal Sandbox. The purchase order remains in authorized state.
          </p>
        </div>

        <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4 font-mono">
          <Link href="/dashboard/checkout" className="w-full sm:w-auto">
            <Button size="lg" className="w-full gap-2 shadow-jade-subtle text-xs font-bold bg-[#4BC5B1] text-[#0C1113] hover:bg-[#4BC5B1]/90 rounded-xl h-11">
              <RefreshCw className="w-4 h-4" />
              Resume PayPal Checkout
            </Button>
          </Link>
          <Link href="/dashboard/approval" className="w-full sm:w-auto">
            <Button variant="secondary" size="lg" className="w-full text-xs font-mono bg-[#172024] border border-[#EDECE6]/[0.08] text-[#EDECE6] hover:bg-[#1C292C] rounded-xl h-11">
              <ArrowLeft className="w-4 h-4" />
              Back to Approval Gate
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
