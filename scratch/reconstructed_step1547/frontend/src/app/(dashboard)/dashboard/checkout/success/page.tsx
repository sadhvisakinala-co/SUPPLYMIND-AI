"use client";

import React from "react";
import Link from "next/link";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle2, ArrowRight, FileText, Truck } from "lucide-react";

export default function CheckoutSuccessPage() {
  return (
    <div className="max-w-2xl mx-auto py-12 animate-fade-in font-sans">
      <Card variant="default" className="border-border-subtle p-8 text-center space-y-6">
        <div className="w-16 h-16 rounded-full bg-[#172c23] border-2 border-success flex items-center justify-center text-success mx-auto">
          <CheckCircle2 className="w-8 h-8" />
        </div>

        <div>
          <span className="text-xs uppercase font-bold text-electric-teal tracking-widest block mb-1 font-mono">
            PayPal Orders v2 Verified
          </span>
          <h2 className="font-display font-bold text-3xl text-soft-ivory">
            Procurement Settlement Confirmed
          </h2>
          <p className="text-xs text-silver-sage max-w-md mx-auto mt-2 leading-relaxed">
            Your payment authorization has been captured successfully in the PayPal Sandbox environment. Dispatch instructions have been transmitted to the supplier.
          </p>
        </div>

        <div className="p-4 rounded-xl bg-graphite border border-border-subtle text-xs text-left space-y-2 font-mono">
          <div className="flex justify-between">
            <span className="text-silver-sage">Transaction Status:</span>
            <span className="text-success font-bold">COMPLETED</span>
          </div>
          <div className="flex justify-between">
            <span className="text-silver-sage">Settlement Rail:</span>
            <span className="text-soft-ivory">PayPal Sandbox Orders v2</span>
          </div>
          <div className="flex justify-between">
            <span className="text-silver-sage">Seller Protection:</span>
            <span className="text-electric-teal font-bold">ELIGIBLE</span>
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
