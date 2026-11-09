"use client";

import React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { CheckCircle2, ArrowRight, FileText, Truck } from "lucide-react";

export default function CheckoutSuccessPage() {
  return (
    <div className="max-w-2xl mx-auto py-12 animate-fade-in font-sans">
      <div className="rounded-2xl border border-[#EDECE6]/[0.08] bg-[#172024]/90 p-8 sm:p-10 text-center space-y-6 shadow-atelier-elevated backdrop-blur-md">
        <div className="w-16 h-16 rounded-full bg-[#172c23] border border-[#5FC7A1] flex items-center justify-center text-[#5FC7A1] mx-auto shadow-jade-subtle">
          <CheckCircle2 className="w-8 h-8" />
        </div>

        <div>
          <span className="text-xs uppercase font-bold text-[#4BC5B1] tracking-widest block mb-1 font-mono">
            PayPal Orders v2 Verified
          </span>
          <h2 className="font-display font-bold text-3xl text-[#EDECE6] tracking-tight">
            Procurement Settlement Confirmed
          </h2>
          <p className="text-xs text-[#9AA9A8] max-w-md mx-auto mt-2 leading-relaxed font-sans">
            Your payment authorization has been captured successfully in the PayPal Sandbox environment. Dispatch instructions have been transmitted to the supplier.
          </p>
        </div>

        <div className="p-4 rounded-xl bg-[#0C1113] border border-[#EDECE6]/[0.08] text-xs text-left space-y-2 font-mono">
          <div className="flex justify-between">
            <span className="text-[#9AA9A8]">Transaction Status:</span>
            <span className="text-[#5FC7A1] font-bold">COMPLETED</span>
          </div>
          <div className="flex justify-between">
            <span className="text-[#9AA9A8]">Settlement Rail:</span>
            <span className="text-[#EDECE6]">PayPal Sandbox Orders v2</span>
          </div>
          <div className="flex justify-between">
            <span className="text-[#9AA9A8]">Seller Protection:</span>
            <span className="text-[#4BC5B1] font-bold">ELIGIBLE</span>
          </div>
        </div>

        <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4 font-mono">
          <Link href="/dashboard/tracking" className="w-full sm:w-auto">
            <Button size="lg" className="w-full gap-2 shadow-jade-subtle text-xs font-bold bg-[#4BC5B1] text-[#0C1113] hover:bg-[#4BC5B1]/90 rounded-xl h-11">
              <Truck className="w-4 h-4" />
              Track Shipment & Audit Logs
            </Button>
          </Link>
          <Link href="/dashboard/overview" className="w-full sm:w-auto">
            <Button variant="secondary" size="lg" className="w-full text-xs font-mono bg-[#172024] border border-[#EDECE6]/[0.08] text-[#EDECE6] hover:bg-[#1C292C] rounded-xl h-11">
              Return to Console
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
