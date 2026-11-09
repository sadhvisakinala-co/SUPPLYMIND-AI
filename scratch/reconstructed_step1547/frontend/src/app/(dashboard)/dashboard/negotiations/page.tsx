"use client";

import React, { useState, useEffect, useRef, Suspense } from "react";
import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";
import { api } from "@/lib/api";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Bot,
  Sparkles,
  Send,
  CheckCircle2,
  AlertCircle,
  RefreshCw,
  ArrowRight,
  ShieldCheck,
  Shield,
  ShieldAlert,
  Lock,
  ChevronDown,
  ChevronUp,
  User,
  DollarSign,
  Building2,
  Cpu,
} from "lucide-react";

// Format timestamp helper
function formatTime(ts: string | undefined): string {
  if (!ts) return "Just now";
  try {
    const d = new Date(ts);
    if (isNaN(d.getTime())) return "Just now";
    return d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" });
  } catch {
    return "Just now";
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// 1. SESSION SELECTOR (LEFT COLUMN)
// ─────────────────────────────────────────────────────────────────────────────
function SessionSelector({
  negotiations,
  selectedId,
  selectedSku,
  onSelectNegotiation,
  onSelectSku,
  newQty,
  setNewQty,
  targetPrice,
  setTargetPrice,
  onStartNegotiation,
  starting,
}: {
  negotiations: any[];
  selectedId: number | null;
  selectedSku: string;
  onSelectNegotiation: (id: number) => void;
  onSelectSku: (sku: string) => void;
  newQty: number;
  setNewQty: (q: number) => void;
  targetPrice: string;
  setTargetPrice: (p: string) => void;
  onStartNegotiation: () => void;
  starting: boolean;
}) {
  return (
    <div className="space-y-6">
      <Card variant="default" className="border-border-subtle p-5">
        <h4 className="font-display font-bold text-sm text-soft-ivory mb-3 flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-electric-teal" /> Initiate AI Session
        </h4>

        <div className="space-y-3 font-mono text-xs">
          <div>
            <label className="block text-silver-sage mb-1 font-sans">Target SKU</label>
            <select
              value={selectedSku}
              onChange={(e) => onSelectSku(e.target.value)}
              className="w-full bg-graphite border border-border-subtle rounded-lg p-2 text-soft-ivory text-xs focus:outline-none focus:border-electric-teal"
            >
              <option value="ELEC-005">ELEC-005 (Smart Watch Ultra)</option>
              <option value="ELEC-001">ELEC-001 (Wireless Earbuds Pro)</option>
              <option value="ELEC-002">ELEC-002 (Mechanical Keyboard)</option>
              <option value="ELEC-003">ELEC-003 (USB-C Hub 7-in-1)</option>
              <option value="ELEC-004">ELEC-004 (Portable SSD 1TB)</option>
            </select>
          </div>

          <div>
            <label className="block text-silver-sage mb-1 font-sans">Approved Quantity</label>
            <Input
              type="number"
              min="1"
              value={newQty}
              onChange={(e) => setNewQty(Math.max(1, parseInt(e.target.value) || 1))}
              className="bg-graphite border-border-subtle text-soft-ivory h-8 text-xs font-mono"
            />
          </div>

          <div>
            <label className="block text-silver-sage mb-1 font-sans">Target Price ($/unit)</label>
            <Input
              type="number"
              step="0.5"
              placeholder="e.g. 118.00"
              value={targetPrice}
              onChange={(e) => setTargetPrice(e.target.value)}
              className="bg-graphite border-border-subtle text-soft-ivory h-8 text-xs font-mono"
            />
          </div>

          <Button
            onClick={onStartNegotiation}
            isLoading={starting}
            className="w-full text-xs gap-1.5 shadow-teal-subtle mt-2 font-mono font-bold"
          >
            <Bot className="w-3.5 h-3.5" />
            Initialize AI Bidding
          </Button>
        </div>
      </Card>

      {/* Active Sessions List */}
      <div className="space-y-2.5">
        <h5 className="text-[11px] uppercase font-bold text-silver-sage tracking-wider font-mono px-1">
          Active Negotiations ({negotiations.length})
        </h5>

        {negotiations.map((neg) => {
          const isSelected = selectedId === neg.id;
          const effectivePrice = neg.final_price || neg.counter_price || neg.original_price;
          return (
            <div
              key={neg.id}
              onClick={() => onSelectNegotiation(neg.id)}
              className={`p-3.5 rounded-xl border cursor-pointer transition-all font-mono ${
                isSelected
                  ? "border-electric-teal bg-surface shadow-teal-subtle"
                  : "border-border-subtle bg-charcoal hover:border-border-subtle/80"
              }`}
            >
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs font-bold text-electric-teal">
                  {neg.item_sku}
                </span>
                <Badge
                  variant={
                    neg.status === "accepted"
                      ? "success"
                      : neg.status === "counter_offered"
                      ? "warning"
                      : "default"
                  }
                  className="text-[9px] py-0 px-1.5"
                >
                  {neg.status.toUpperCase()}
                </Badge>
              </div>

              <div className="text-xs text-soft-ivory font-sans font-semibold truncate">
                {neg.supplier_name || `Supplier #${neg.supplier_id}`}
              </div>

              <div className="text-[11px] text-silver-sage font-sans mt-0.5">
                Qty: {neg.quantity} units · Round {neg.rounds}
              </div>

              {neg.order_number && (
                <div className="flex items-center gap-1 mt-1 text-[10px] text-electric-teal font-mono">
                  <CheckCircle2 className="w-3 h-3 text-electric-teal shrink-0" />
                  <span className="truncate">{neg.order_number}</span>
                </div>
              )}

              <div className="flex items-center justify-between text-[11px] text-silver-sage pt-2 border-t border-border-subtle mt-2">
                <span>Quote: ${neg.original_price?.toFixed(2)}</span>
                <span className="text-electric-teal font-bold">
                  ${effectivePrice?.toFixed(2)}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// 2. CHAT TRANSCRIPT (CENTER COLUMN)
// ─────────────────────────────────────────────────────────────────────────────
function ChatTranscript({
  negotiation,
  detailLoading,
  counterInput,
  setCounterInput,
  onSendCounter,
  onAcceptTerms,
  countering,
  accepting,
  error,
  llmStatus,
  showGuardrailsDetails,
  setShowGuardrailsDetails,
}: {
  negotiation: any;
  detailLoading: boolean;
  counterInput: string;
  setCounterInput: (val: string) => void;
  onSendCounter: () => void;
  onAcceptTerms: () => void;
  countering: boolean;
  accepting: boolean;
  error: string | null;
  llmStatus: any;
  showGuardrailsDetails: boolean;
  setShowGuardrailsDetails: (val: boolean | ((prev: boolean) => boolean)) => void;
}) {
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [negotiation?.messages, detailLoading]);

  if (detailLoading) {
    return (
      <Card variant="default" className="border-border-subtle flex flex-col h-[740px] items-center justify-center text-xs text-silver-sage font-mono">
        <RefreshCw className="w-6 h-6 animate-spin text-electric-teal mb-3" />
        <p>Loading session transcript for {negotiation?.item_sku || "selected SKU"}...</p>
      </Card>
    );
  }

  if (!negotiation) {
    return (
      <div className="h-[600px] rounded-2xl border border-border-subtle flex flex-col items-center justify-center text-silver-sage text-xs font-mono p-8 text-center bg-charcoal">
        <Bot className="w-10 h-10 text-electric-teal/50 mb-3" />
        <div className="font-bold text-soft-ivory text-sm mb-1">No Active Negotiation Selected</div>
        <p className="max-w-xs text-silver-sage">
          Select an active session from the left sidebar or initialize a new bidding session above.
        </p>
      </div>
    );
  }

  const fin = negotiation.financial_summary;
  const linkedOrder = negotiation.linked_order;
  const originalPrice = fin?.initial_unit_price ?? negotiation.original_price ?? 0;
  const finalPrice = fin?.final_negotiated_unit_price ?? negotiation.final_price ?? originalPrice;
  const currentPrice =
    negotiation.status === "accepted"
      ? finalPrice
      : (negotiation.counter_price || negotiation.original_price || finalPrice);
  const negotiatedSubtotal = fin?.negotiated_merchandise_subtotal ?? (currentPrice * (fin?.approved_quantity ?? negotiation.quantity ?? 1));
  const totalApproved = fin?.total_approved_payment ?? (linkedOrder?.total_amount || negotiatedSubtotal);

  return (
    <Card variant="default" className="border-border-subtle flex flex-col h-[740px]">
      {/* Header */}
      <CardHeader className="p-5 border-b border-border-subtle bg-graphite shrink-0">
        <div className="flex items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="font-mono text-sm font-bold text-electric-teal">
                SKU: {negotiation.item_sku}
              </span>
              <Badge variant="outline" className="text-[10px] font-mono">
                Session #{negotiation.id}
              </Badge>
              {negotiation.supplier?.name && (
                <span className="text-xs text-silver-sage font-sans">
                  with <strong className="text-soft-ivory">{negotiation.supplier.name}</strong>
                </span>
              )}
            </div>
            <CardTitle className="text-base text-soft-ivory font-display">
              {negotiation.item_name || `${negotiation.item_sku} Hardware`} · Volume: {fin?.approved_quantity ?? negotiation.quantity} Units
            </CardTitle>
          </div>

          <div className="text-right font-mono shrink-0">
            <div className="text-[10px] text-silver-sage uppercase">Agreed / Proposed Rate</div>
            <div className="text-2xl font-bold text-electric-teal">
              ${Number(currentPrice).toFixed(2)}
            </div>
            <div className="text-[10px] text-silver-sage">
              Subtotal: ${Number(negotiatedSubtotal).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </div>
            {linkedOrder?.order_number && (
              <div className="text-[10px] text-electric-teal font-semibold mt-0.5">
                PO Total: ${Number(totalApproved).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </div>
            )}
          </div>
        </div>

        {/* AI Reasoning Strip */}
        {negotiation.ai_reasoning && (
          <div className="mt-3 p-3 rounded-lg bg-surface border border-electric-teal/20 text-xs text-silver-sage leading-relaxed flex items-start gap-2">
            <Sparkles className="w-4 h-4 text-electric-teal shrink-0 mt-0.5" />
            <div>
              <strong className="text-soft-ivory font-sans">AI Negotiation Strategy: </strong>
              {negotiation.ai_reasoning}
            </div>
          </div>
        )}
      </CardHeader>

      {/* ─── ACTIVE NEGOTIATION GUARDRAILS SECURITY PANEL ─────────────────── */}
      <div className="bg-graphite/90 border-b border-border-subtle p-4 font-mono text-xs shrink-0">
        <div className="flex items-center justify-between gap-3 mb-2.5">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-surface border border-electric-teal/40 flex items-center justify-center text-electric-teal shadow-teal-subtle">
              <Shield className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-sans font-bold text-soft-ivory text-xs">
                  Active Negotiation Guardrails
                </span>
                <span className="inline-flex items-center gap-1 px-1.5 py-0.2 rounded text-[9px] font-bold bg-electric-teal/15 text-electric-teal border border-electric-teal/30">
                  <ShieldCheck className="w-2.5 h-2.5" /> DETERMINISTIC POLICY ENFORCED
                </span>
              </div>
              <div className="text-[10px] text-silver-sage font-sans">
                FastAPI deterministic validation gates every proposal before merchant approval hand-off.
              </div>
            </div>
          </div>

          <button
            onClick={() => setShowGuardrailsDetails((prev) => !prev)}
            className="text-[11px] text-silver-sage hover:text-soft-ivory flex items-center gap-1 px-2 py-1 rounded bg-surface/50 border border-border-subtle transition-colors"
          >
            <span>{showGuardrailsDetails ? "Collapse Policy" : "Expand Policy"}</span>
            {showGuardrailsDetails ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
          </button>
        </div>

        {/* Compact 4-Pillar Policy Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-[10px]">
          <div className="p-2.5 rounded-lg bg-charcoal border border-border-subtle space-y-1">
            <span className="text-silver-sage block uppercase font-sans font-bold text-[9px] text-electric-teal">
              Spending Policy
            </span>
            <div className="text-soft-ivory font-bold truncate">Cap: $25,000.00</div>
            <div className="text-silver-sage text-[9px] truncate">
              Commitment: ${Number(negotiatedSubtotal).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </div>
          </div>

          <div className="p-2.5 rounded-lg bg-charcoal border border-border-subtle space-y-1">
            <span className="text-silver-sage block uppercase font-sans font-bold text-[9px] text-electric-teal">
              Supplier Limits
            </span>
            <div className="text-soft-ivory font-bold truncate">
              Floor: ${(originalPrice * 0.70).toFixed(2)}
            </div>
            <div className="text-silver-sage text-[9px] truncate">Max 30% Concession</div>
          </div>

          <div className="p-2.5 rounded-lg bg-charcoal border border-border-subtle space-y-1">
            <span className="text-silver-sage block uppercase font-sans font-bold text-[9px] text-electric-teal">
              Transaction Rail
            </span>
            <div className="text-soft-ivory font-bold truncate">Approval Gate Req.</div>
            <div className="text-silver-sage text-[9px] truncate">PayPal Orders v2</div>
          </div>

          <div className="p-2.5 rounded-lg bg-charcoal border border-border-subtle space-y-1">
            <span className="text-silver-sage block uppercase font-sans font-bold text-[9px] text-electric-teal">
              Round Controls
            </span>
            <div className="text-soft-ivory font-bold truncate">
              Round {negotiation.rounds} of 5
            </div>
            <div className="text-silver-sage text-[9px] truncate">Server Auto-Reject</div>
          </div>
        </div>

        {/* Expandable Policy Details Drawer */}
        {showGuardrailsDetails && (
          <div className="mt-3 p-3 rounded-lg bg-surface border border-border-subtle space-y-2 text-[11px] font-sans text-silver-sage animate-fade-in leading-relaxed">
            <div className="font-bold text-soft-ivory text-xs font-mono flex items-center gap-1.5">
              <Lock className="w-3.5 h-3.5 text-electric-teal" /> Verified Commercial Guardrails Protocol
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
              <div>
                <strong className="text-soft-ivory block font-mono text-[10px]">Merchant Spending Policy:</strong>
                Maximum authorized procurement budget is capped at $25,000.00 USD. Bids exceeding this threshold are rejected.
              </div>
              <div>
                <strong className="text-soft-ivory block font-mono text-[10px]">Supplier Commercial Floor:</strong>
                Supplier cost-plus margin requires a hard price floor at 70% of list quotation (${(originalPrice * 0.70).toFixed(2)}).
              </div>
              <div>
                <strong className="text-soft-ivory block font-mono text-[10px]">Transaction Controls:</strong>
                No counteroffer agreement can directly capture funds. Every negotiated outcome must pass through the Merchant Approval Gate.
              </div>
              <div>
                <strong className="text-soft-ivory block font-mono text-[10px]">Agent Inference Integrity:</strong>
                {llmStatus?.available ? (
                  <span>Live generative inference active via {llmStatus.provider} ({llmStatus.model}).</span>
                ) : (
                  <span>Operating in bounded deterministic simulation mode with transparent policy disclosure.</span>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Highlighted Guardrail Violation Banner */}
        {error && error.includes("GUARDRAIL_VIOLATION") && (
          <div className="mt-3 p-3 rounded-lg bg-[#2e1717] border border-error/60 flex items-start gap-2.5 text-error text-xs animate-shake">
            <ShieldAlert className="w-4 h-4 text-error shrink-0 mt-0.5" />
            <div className="flex-1">
              <strong className="font-bold block font-sans">Deterministic Guardrail Enforced:</strong>
              <div className="text-[11px] mt-0.5 text-error font-mono">{error}</div>
            </div>
          </div>
        )}
      </div>

      {/* Message Transcript Container */}
      <CardContent
        ref={chatContainerRef}
        className="p-5 flex-1 overflow-y-auto space-y-4 bg-charcoal/50"
      >
        {negotiation.messages && negotiation.messages.length > 0 ? (
          negotiation.messages.map((msg: any, idx: number) => {
            const role = String(msg.role || msg.sender || "").toLowerCase();
            const isBuyer = role.includes("buyer") || role.includes("ai");
            const isSupplier = role.includes("supplier") || role.includes("vendor");
            const isMerchant = role.includes("merchant");

            const messageText = msg.content || msg.message || "";
            const priceTag = msg.price;
            const timestampStr = formatTime(msg.timestamp);

            const supplierName = negotiation.supplier?.name || "Supplier Agent";
            const senderHeader =
              msg.sender_name ||
              (isBuyer
                ? "Buyer Agent (SUPPLYMIND AI)"
                : isMerchant
                ? "Alex Chen (Merchant)"
                : `Supplier Agent (${supplierName})`);

            return (
              <div
                key={idx}
                className={`flex flex-col max-w-lg p-4 rounded-xl text-xs space-y-1.5 transition-all ${
                  isBuyer
                    ? "ml-auto bg-surface border border-electric-teal/40 text-soft-ivory shadow-sm"
                    : isMerchant
                    ? "ml-auto bg-[#1b2f2b] border border-electric-teal/60 text-soft-ivory"
                    : "mr-auto bg-graphite border border-border-subtle text-soft-ivory"
                }`}
              >
                {/* Message Sender Header */}
                <div className="flex items-center justify-between gap-4 text-[11px] font-semibold border-b border-border-subtle/50 pb-1.5">
                  <span
                    className={`flex items-center gap-1.5 font-sans ${
                      isBuyer
                        ? "text-electric-teal"
                        : isMerchant
                        ? "text-success"
                        : "text-silver-sage"
                    }`}
                  >
                    {isBuyer ? (
                      <Bot className="w-3.5 h-3.5 text-electric-teal" />
                    ) : isMerchant ? (
                      <User className="w-3.5 h-3.5 text-success" />
                    ) : (
                      <Building2 className="w-3.5 h-3.5 text-silver-sage" />
                    )}
                    {senderHeader}
                  </span>

                  <div className="flex items-center gap-2">
                    {priceTag !== undefined && priceTag !== null && (
                      <span className="font-mono text-soft-ivory bg-black/50 px-2 py-0.5 rounded font-bold text-[10px]">
                        ${Number(priceTag).toFixed(2)}/unit
                      </span>
                    )}
                    <span className="text-[10px] text-silver-sage font-mono">
                      {timestampStr}
                    </span>
                  </div>
                </div>

                {/* Message Body */}
                <p className="text-xs leading-relaxed text-soft-ivory font-sans pt-1">
                  {messageText}
                </p>
              </div>
            );
          })
        ) : (
          <div className="flex items-center justify-center h-full text-xs text-silver-sage font-mono">
            No dialogue messages recorded for this session.
          </div>
        )}
        <div ref={messagesEndRef} />
      </CardContent>

      {/* Counter Input / Acceptance Footer */}
      <div className="p-4 border-t border-border-subtle bg-graphite shrink-0">
        {negotiation.status !== "accepted" ? (
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            <div className="relative flex-1">
              <DollarSign className="w-4 h-4 text-silver-sage absolute left-3 top-3" />
              <Input
                type="number"
                step="0.5"
                placeholder="Enter counteroffer ($/unit, min 70% floor)..."
                value={counterInput}
                onChange={(e) => setCounterInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") onSendCounter();
                }}
                className="bg-charcoal text-soft-ivory font-mono text-xs h-10 pl-9"
              />
            </div>

            <Button
              onClick={onSendCounter}
              isLoading={countering}
              className="shrink-0 text-xs gap-1.5 shadow-teal-subtle h-10 px-5 font-mono font-bold"
            >
              <Send className="w-3.5 h-3.5" /> Submit Counter
            </Button>

            <Button
              onClick={onAcceptTerms}
              isLoading={accepting}
              variant="outline"
              className="shrink-0 text-xs gap-1 h-10 px-4 font-mono font-bold border-electric-teal/50 hover:bg-electric-teal/10"
            >
              Accept Rate
            </Button>
          </div>
        ) : (
          <div className="w-full flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 p-2">
            <span className="text-xs text-success font-mono font-bold flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-success shrink-0" />
              Negotiation Accepted & Locked at ${Number(currentPrice).toFixed(2)}/unit
            </span>
            <Link href="/dashboard/approval">
              <Button size="sm" className="font-mono text-xs gap-1.5 shadow-teal-subtle font-bold">
                Proceed to Purchase Approval Gate <ArrowRight className="w-3.5 h-3.5" />
              </Button>
            </Link>
          </div>
        )}
      </div>
    </Card>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// 3. NEGOTIATION ECONOMICS (RIGHT COLUMN)
// ─────────────────────────────────────────────────────────────────────────────
function NegotiationEconomics({
  negotiation,
  detailLoading,
}: {
  negotiation: any;
  detailLoading: boolean;
}) {
  if (detailLoading) {
    return (
      <Card variant="default" className="border-border-subtle p-5 font-mono text-xs">
        <div className="flex items-center justify-center py-12 text-silver-sage">
          <RefreshCw className="w-4 h-4 animate-spin text-electric-teal mr-2" />
          <span>Synchronizing economics...</span>
        </div>
      </Card>
    );
  }

  if (!negotiation) {
    return (
      <Card variant="default" className="border-border-subtle p-5 font-mono text-xs">
        <div className="text-center py-12 text-silver-sage">
          Select a negotiation session to view verified economics.
        </div>
      </Card>
    );
  }

  const fin = negotiation.financial_summary;
  const linkedOrder = negotiation.linked_order;

  const originalPrice = fin?.initial_unit_price ?? negotiation.original_price ?? 0;
  const counterPrice = fin?.buyer_counteroffer_price ?? negotiation.counter_price;
  const finalPrice = fin?.final_negotiated_unit_price ?? negotiation.final_price ?? originalPrice;
  const currentPrice =
    negotiation.status === "accepted"
      ? finalPrice
      : (negotiation.counter_price || negotiation.original_price || finalPrice);
  const quantity = fin?.approved_quantity ?? negotiation.quantity ?? 1;

  const initialSubtotal = fin?.initial_merchandise_subtotal ?? (originalPrice * quantity);
  const negotiatedSubtotal = fin?.negotiated_merchandise_subtotal ?? (currentPrice * quantity);
  const totalSavings = fin?.merchandise_savings ?? Math.max(0, initialSubtotal - negotiatedSubtotal);
  const savingsPct = fin?.savings_percentage ?? (initialSubtotal > 0 ? (totalSavings / initialSubtotal) * 100 : 0);

  // Freight & Tax calculations
  const freight = fin?.expedited_freight ?? (negotiation.item_sku === "ELEC-005" ? 350.0 : 0.0);
  const tax = fin?.tax_amount ?? (negotiatedSubtotal * 0.05);
  const totalApproved = fin?.total_approved_payment ?? (negotiatedSubtotal + freight + tax);

  // Supplier Commitments
  const supplierName = negotiation.supplier?.name || "TechSource Global Ltd";
  const leadTimeDays =
    negotiation.item_sku === "ELEC-005"
      ? 7
      : negotiation.supplier?.lead_time_days || 14;
  const reliabilityPct =
    negotiation.item_sku === "ELEC-005"
      ? 94
      : Math.round((negotiation.supplier?.reliability_score || 0.88) * 100);

  return (
    <Card variant="default" className="border-border-subtle p-5 space-y-5 font-mono text-xs">
      <h4 className="font-display font-bold text-sm text-soft-ivory font-sans flex items-center gap-2">
        <ShieldCheck className="w-4 h-4 text-electric-teal" /> Negotiation Economics
      </h4>

      {/* Financial Truth Box */}
      <div className="p-3.5 rounded-xl bg-graphite border border-border-subtle space-y-2.5">
        {linkedOrder?.order_number && (
          <div className="flex items-center justify-between pb-2 border-b border-border-subtle">
            <span className="text-silver-sage">Purchase Order:</span>
            <Link
              href={`/dashboard/approval`}
              className="text-electric-teal font-bold hover:underline flex items-center gap-1 font-mono text-[11px]"
            >
              <span>{linkedOrder.order_number}</span>
              <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
        )}
        <div className="flex justify-between">
          <span className="text-silver-sage">Approved Quantity:</span>
          <span className="text-soft-ivory font-bold">{quantity} Units</span>
        </div>
        <div className="flex justify-between">
          <span className="text-silver-sage">Initial Quotation:</span>
          <span className="text-soft-ivory">${Number(originalPrice).toFixed(2)}/unit</span>
        </div>
        <div className="flex justify-between">
          <span className="text-silver-sage">Initial Subtotal:</span>
          <span className="text-soft-ivory font-mono">
            ${Number(initialSubtotal).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </span>
        </div>
        {counterPrice !== undefined && counterPrice !== null && (
          <div className="flex justify-between text-silver-sage">
            <span>Buyer Counteroffer:</span>
            <span className="text-silver-sage font-mono">${Number(counterPrice).toFixed(2)}/unit</span>
          </div>
        )}
        <div className="flex justify-between">
          <span className="text-silver-sage">Negotiated Unit Price:</span>
          <span className="text-electric-teal font-bold">${Number(currentPrice).toFixed(2)}/unit</span>
        </div>
        <div className="flex justify-between">
          <span className="text-silver-sage">Negotiated Subtotal:</span>
          <span className="text-soft-ivory font-bold font-mono">
            ${Number(negotiatedSubtotal).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </span>
        </div>
        <div className="flex justify-between text-success">
          <span>Merchandise Savings:</span>
          <span className="font-bold font-mono">
            -${Number(totalSavings).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} ({savingsPct.toFixed(1)}%)
          </span>
        </div>

        {/* Expedited Logistics and Taxes */}
        <div className="pt-2 border-t border-border-subtle space-y-1.5 text-[11px]">
          <div className="flex justify-between text-silver-sage">
            <span>Expedited Freight:</span>
            <span className="text-soft-ivory font-mono">${Number(freight).toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-silver-sage">
            <span>Tax (5% of Subtotal):</span>
            <span className="text-soft-ivory font-mono">${Number(tax).toFixed(2)}</span>
          </div>
        </div>

        {/* Total Approved Payment Gate Total */}
        <div className="pt-2.5 border-t-2 border-electric-teal/40 flex justify-between items-baseline text-sm">
          <span className="text-soft-ivory font-sans font-bold text-xs">Total Approved:</span>
          <span className="text-electric-teal font-bold font-mono text-base">
            ${Number(totalApproved).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} {fin?.currency || "USD"}
          </span>
        </div>

        {linkedOrder && (
          <div className="pt-1 text-[10px] text-silver-sage text-right font-sans">
            Status: <strong className="text-success uppercase">{linkedOrder.status.replace("_", " ")}</strong>
          </div>
        )}
      </div>

      {/* Vendor SLA Commitments */}
      <div className="space-y-3 pt-2">
        <h5 className="text-[10px] uppercase font-bold text-silver-sage tracking-wider">
          Vendor SLA Commitments
        </h5>
        <div className="space-y-2 text-silver-sage text-[11px]">
          <div className="flex justify-between">
            <span>Vendor Name:</span>
            <strong className="text-soft-ivory">{supplierName}</strong>
          </div>
          <div className="flex justify-between">
            <span>Guaranteed Lead:</span>
            <strong className="text-soft-ivory">{leadTimeDays} Days</strong>
          </div>
          <div className="flex justify-between">
            <span>Supplier Reliability:</span>
            <strong className="text-soft-ivory">{reliabilityPct}%</strong>
          </div>
          <div className="flex justify-between">
            <span>Settlement Method:</span>
            <strong className="text-electric-teal">PayPal Verified Rails</strong>
          </div>
        </div>
      </div>

      <div className="p-3 rounded-lg bg-surface border border-electric-teal/20 text-[11px] text-silver-sage font-sans leading-relaxed">
        <strong className="text-soft-ivory block mb-1">Sandbox Transparency</strong>
        Supplier responses operate within simulated commercial margins. Quotes and concessions are validated deterministically by backend integrity checks.
      </div>
    </Card>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// 4. NEGOTIATION STUDIO (MAIN ORCHESTRATOR)
// ─────────────────────────────────────────────────────────────────────────────
function NegotiationStudio() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const idParam = searchParams.get("id");
  const skuParam = searchParams.get("sku") || "ELEC-005";
  const qtyParam = searchParams.get("qty") || "150";

  const [negotiations, setNegotiations] = useState<any[]>([]);
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [selectedSku, setSelectedSku] = useState<string>(skuParam);
  const [selectedNegotiation, setSelectedNegotiation] = useState<any>(null);

  const [loading, setLoading] = useState<boolean>(true);
  const [detailLoading, setDetailLoading] = useState<boolean>(false);
  const [llmStatus, setLlmStatus] = useState<any>(null);

  // New negotiation form states
  const [newQty, setNewQty] = useState<number>(parseInt(qtyParam) || 150);
  const [targetPrice, setTargetPrice] = useState<string>("");
  const [starting, setStarting] = useState<boolean>(false);

  // Counteroffer state
  const [counterInput, setCounterInput] = useState<string>("");
  const [countering, setCountering] = useState<boolean>(false);
  const [accepting, setAccepting] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [showGuardrailsDetails, setShowGuardrailsDetails] = useState<boolean>(false);

  // Guard against asynchronous race conditions
  const requestIdRef = useRef<number>(0);

  // Check LLM connection status
  const fetchLlmStatus = async () => {
    try {
      const res = await api.get<any>("/api/negotiations/status/llm");
      setLlmStatus(res.data);
    } catch {
      setLlmStatus({ available: false, provider: "none", message: "Deterministic engine fallback active" });
    }
  };

  // Fetch single negotiation detail with full messages and supplier metadata
  const fetchNegotiationDetail = async (id: number) => {
    const requestId = ++requestIdRef.current;
    setSelectedId(id);
    setDetailLoading(true);
    setError(null);

    // Reset stale state immediately if switching to a different ID
    if (selectedNegotiation?.id !== id) {
      setSelectedNegotiation(null);
    }

    try {
      const res = await api.get<any>(`/api/negotiations/${id}`);
      // Drop response if a newer selection occurred
      if (requestId !== requestIdRef.current) return;

      setSelectedNegotiation(res.data);
      if (res.data?.item_sku) {
        setSelectedSku(res.data.item_sku);
      }

      if (typeof window !== "undefined") {
        localStorage.setItem("supplymind_active_negotiation_id", String(id));
        const url = new URL(window.location.href);
        url.searchParams.set("id", String(id));
        if (res.data?.item_sku) {
          url.searchParams.set("sku", res.data.item_sku);
        }
        window.history.replaceState({}, "", url.toString());
      }
    } catch (err: any) {
      if (requestId !== requestIdRef.current) return;
      console.error("Failed to load negotiation detail", err);
      setError(err.detail || err.message || "Failed to load negotiation transcript");
    } finally {
      if (requestId === requestIdRef.current) {
        setDetailLoading(false);
      }
    }
  };

  // Fetch list of negotiations
  const fetchNegotiations = async (targetId?: number) => {
    try {
      setLoading(true);
      const res = await api.get<any[]>("/api/negotiations");
      const list = res.data || [];
      setNegotiations(list);

      // Determine which negotiation to select
      let idToLoad: number | null = null;
      if (targetId) {
        idToLoad = targetId;
      } else if (idParam) {
        const parsed = parseInt(idParam);
        if (!isNaN(parsed) && list.some((n) => n.id === parsed)) {
          idToLoad = parsed;
        }
      }

      if (!idToLoad && typeof window !== "undefined") {
        const savedId = localStorage.getItem("supplymind_active_negotiation_id");
        if (savedId) {
          const parsedSaved = parseInt(savedId);
          if (!isNaN(parsedSaved) && list.some((n) => n.id === parsedSaved)) {
            idToLoad = parsedSaved;
          }
        }
      }

      // Single source of truth default: prioritize authoritative accepted demo negotiation for ELEC-005 linked to PO-2024-00892
      if (!idToLoad && list.length > 0) {
        const authoritativeDemo =
          list.find((n) => n.item_sku === "ELEC-005" && n.status === "accepted") ||
          list.find((n) => n.has_linked_order) ||
          list[0];
        idToLoad = authoritativeDemo ? authoritativeDemo.id : list[0].id;
      }

      if (idToLoad) {
        await fetchNegotiationDetail(idToLoad);
      }
    } catch (err) {
      console.error("Failed to load negotiations", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLlmStatus();
    fetchNegotiations();
  }, []);

  // Handle switching SKU from selector dropdown
  const handleSelectSku = (sku: string) => {
    setSelectedSku(sku);
    if (sku === "ELEC-005") {
      setNewQty(150);
      setTargetPrice("118.00");
    } else if (sku === "ELEC-001") {
      setNewQty(100);
      setTargetPrice("37.00");
    }

    // Find matching negotiation for this SKU
    const matching =
      negotiations.find((n) => n.item_sku === sku && n.status === "accepted") ||
      negotiations.find((n) => n.item_sku === sku);

    if (matching) {
      fetchNegotiationDetail(matching.id);
    } else {
      setSelectedId(null);
      setSelectedNegotiation(null);
    }
  };

  // Handle starting a new negotiation
  const handleStartNegotiation = async () => {
    try {
      setStarting(true);
      setError(null);
      const quoteRes = await api.get<any[]>(`/api/suppliers/quotations/${selectedSku}`);
      if (!quoteRes.data || quoteRes.data.length === 0) {
        setError(`No active quotations found for SKU ${selectedSku}`);
        return;
      }
      const quote = quoteRes.data[0];

      const res = await api.post<any>("/api/negotiations/start", {
        quotation_id: quote.id || quote.quotation_id,
        quantity: newQty,
        target_price: targetPrice ? parseFloat(targetPrice) : undefined,
      });

      const newNeg = res.data?.negotiation || res.data;
      await fetchNegotiations(newNeg.id);
    } catch (err: any) {
      setError(err.detail || err.message || "Failed to start negotiation");
    } finally {
      setStarting(false);
    }
  };

  // Handle submitting counteroffer
  const handleSendCounter = async () => {
    if (!selectedNegotiation || !counterInput) return;
    const priceVal = parseFloat(counterInput);
    if (isNaN(priceVal) || priceVal <= 0) {
      setError("Please enter a valid numeric counter price.");
      return;
    }

    try {
      setCountering(true);
      setError(null);
      const res = await api.post<any>(
        `/api/negotiations/${selectedNegotiation.id}/counter`,
        { counter_price: priceVal }
      );
      const updated = res.data?.negotiation || res.data;
      setSelectedNegotiation(updated);
      setCounterInput("");
      const listRes = await api.get<any[]>("/api/negotiations");
      setNegotiations(listRes.data || []);
    } catch (err: any) {
      setError(err.detail || err.message || "Failed to send counteroffer");
    } finally {
      setCountering(false);
    }
  };

  // Handle accepting terms
  const handleAcceptTerms = async () => {
    if (!selectedNegotiation) return;
    try {
      setAccepting(true);
      setError(null);
      const res = await api.post<any>(
        `/api/negotiations/${selectedNegotiation.id}/accept`,
        {}
      );
      const updated = res.data?.negotiation || res.data;
      setSelectedNegotiation(updated);
      const listRes = await api.get<any[]>("/api/negotiations");
      setNegotiations(listRes.data || []);
    } catch (err: any) {
      setError(err.detail || err.message || "Failed to accept terms");
    } finally {
      setAccepting(false);
    }
  };

  return (
    <div className="space-y-8 animate-fade-in font-sans">
      {/* ─── HEADER & ACTIONS ────────────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-mono font-semibold text-electric-teal uppercase tracking-widest block mb-1">
            Autonomous Multi-Agent Coordination
          </span>
          <h2 className="font-display font-bold text-3xl text-soft-ivory">
            AI Supplier Negotiation Studio
          </h2>
          <p className="text-xs text-silver-sage mt-1 font-mono">
            Direct algorithmic dialog between SUPPLYMIND Buyer Agent and Supplier Sales Agents.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Button
            variant="secondary"
            size="sm"
            onClick={() => fetchNegotiations(selectedId || undefined)}
            className="text-xs gap-1.5 h-9 font-mono"
          >
            <RefreshCw className="w-3.5 h-3.5 text-electric-teal" />
            Refresh Chat
          </Button>

          <Link href="/dashboard/approval">
            <Button size="sm" className="text-xs gap-1.5 h-9 shadow-teal-subtle font-mono font-bold">
              <CheckCircle2 className="w-3.5 h-3.5" />
              Proceed to Approval Gate
            </Button>
          </Link>
        </div>
      </div>

      {/* ─── LLM STATUS & ENGINE TRANSPARENCY BANNER ─────────────────────── */}
      <div className="p-4 rounded-xl bg-charcoal border border-border-subtle flex flex-col md:flex-row md:items-center justify-between gap-3 text-xs font-mono">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-surface border border-electric-teal/30 flex items-center justify-center text-electric-teal shrink-0">
            <Cpu className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-soft-ivory font-sans">
                {llmStatus?.available
                  ? "Autonomous Multi-Agent Sandbox"
                  : "Autonomous Multi-Agent Sandbox (Deterministic Simulation)"}
              </span>
              <Badge
                variant={llmStatus?.available ? "success" : "default"}
                className="text-[10px] py-0 px-2"
              >
                {llmStatus?.available ? `LIVE LLM ACTIVE (${llmStatus.provider.toUpperCase()})` : "DETERMINISTIC SIMULATION"}
              </Badge>
            </div>
            <p className="text-silver-sage text-[11px] mt-0.5 font-sans leading-relaxed">
              {llmStatus?.available
                ? "Live generative LLM agents are formulating strategic bids and supplier counter-arguments."
                : "Supplier companies and quotations are simulated. Margin floor guardrails strictly enforced server-side."}
            </p>
          </div>
        </div>

        <div className="text-[11px] text-silver-sage text-right shrink-0">
          <div>Engine Mode: <strong className="text-electric-teal">{llmStatus?.model || "deterministic_rules"}</strong></div>
          <div>Margin Floor: <strong className="text-soft-ivory">70% of Quote</strong></div>
        </div>
      </div>

      {error && !error.includes("GUARDRAIL_VIOLATION") && (
        <div className="p-4 rounded-xl bg-[#2e1717] border border-error/50 flex items-start gap-3 text-error text-xs font-mono">
          <AlertCircle className="w-4 h-4 text-error shrink-0 mt-0.5" />
          <div>{error}</div>
        </div>
      )}

      {/* ─── 3-COLUMN NEGOTIATION ARCHITECTURE ─────────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* LEFT COLUMN: Request & Product Details (3-cols) */}
        <div className="lg:col-span-3">
          <SessionSelector
            negotiations={negotiations}
            selectedId={selectedId}
            selectedSku={selectedSku}
            onSelectNegotiation={fetchNegotiationDetail}
            onSelectSku={handleSelectSku}
            newQty={newQty}
            setNewQty={setNewQty}
            targetPrice={targetPrice}
            setTargetPrice={setTargetPrice}
            onStartNegotiation={handleStartNegotiation}
            starting={starting}
          />
        </div>

        {/* CENTER COLUMN: AI Dialogue & Counteroffers (6-cols) */}
        <div className="lg:col-span-6">
          <ChatTranscript
            negotiation={selectedNegotiation}
            detailLoading={detailLoading}
            counterInput={counterInput}
            setCounterInput={setCounterInput}
            onSendCounter={handleSendCounter}
            onAcceptTerms={handleAcceptTerms}
            countering={countering}
            accepting={accepting}
            error={error}
            llmStatus={llmStatus}
            showGuardrailsDetails={showGuardrailsDetails}
            setShowGuardrailsDetails={setShowGuardrailsDetails}
          />
        </div>

        {/* RIGHT COLUMN: Supplier Commitments & Financial Impact (3-cols) */}
        <div className="lg:col-span-3">
          <NegotiationEconomics
            negotiation={selectedNegotiation}
            detailLoading={detailLoading}
          />
        </div>
      </div>
    </div>
  );
}

export default function NegotiationsPage() {
  return (
    <Suspense fallback={<div className="p-8 text-xs text-silver-sage font-mono">Loading negotiation studio...</div>}>
      <NegotiationStudio />
    </Suspense>
  );
}
