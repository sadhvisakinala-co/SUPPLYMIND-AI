"use client";

import React, { useState, useEffect, useRef, Suspense } from "react";
import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";
import { api } from "@/lib/api";
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
  Search,
  Sliders,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { PageEntrance } from "@/components/ui/motion";

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
// 1. SKU SELECTION COLUMN (LEFT ~230px, MATCH BOTTOM-LEFT REFERENCE)
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
  const [searchTerm, setSearchTerm] = useState("");

  const skuList = [
    { sku: "ELEC-005", name: "Smart Watch Ultra", stock: 0, status: "Stockout" },
    { sku: "ELEC-001", name: "Wireless Earbuds Pro", stock: 8, status: "Low" },
    { sku: "ELEC-002", name: "Mechanical Keyboard", stock: 65, status: "Normal" },
    { sku: "ELEC-003", name: "USB-C Hub 7-in-1", stock: 6, status: "Low" },
    { sku: "ELEC-004", name: "Portable SSD 1TB", stock: 42, status: "Normal" },
  ];

  const filteredSkus = skuList.filter(
    (item) =>
      item.sku.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-5 w-full">
      {/* Product Search Input */}
      <div className="relative">
        <Search className="w-3.5 h-3.5 text-[#708784] absolute left-3 top-3" />
        <Input
          type="text"
          placeholder="Search SKU or product..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="bg-[#0B191B] border-[rgba(154,231,207,0.12)] text-[#F4F7F4] pl-9 h-9 text-xs font-mono rounded-xl focus:border-[#79E7C7]"
        />
      </div>

      {/* SKU Listing */}
      <div className="space-y-2">
        <span className="text-[10px] uppercase font-bold text-[#708784] tracking-wider font-mono block px-1">
          Catalog SKUs ({filteredSkus.length})
        </span>

        <div className="space-y-1.5">
          {filteredSkus.map((item) => {
            const isSelected = selectedSku === item.sku;
            return (
              <div
                key={item.sku}
                onClick={() => onSelectSku(item.sku)}
                className={`p-3 rounded-xl border cursor-pointer transition-all duration-200 ${
                  isSelected
                    ? "bg-[#176D5B]/25 border-[#79E7C7] shadow-mint-subtle"
                    : "bg-[#0B191B] border-[rgba(154,231,207,0.12)] hover:bg-[#102326] hover:border-[rgba(154,231,207,0.25)]"
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-bold text-[#79E7C7] font-mono flex items-center gap-1.5">
                    <span className={`w-1.5 h-1.5 rounded-full ${isSelected ? "bg-[#79E7C7] animate-pulse" : "bg-[#708784]"}`} />
                    {item.sku}
                  </span>
                  <span
                    className={`text-[9px] font-mono font-bold px-1.5 py-0.2 rounded ${
                      item.status === "Stockout"
                        ? "bg-[#D77979]/20 text-[#D77979]"
                        : item.status === "Low"
                        ? "bg-[#D8AD70]/20 text-[#D8AD70]"
                        : "bg-[#102326] text-[#708784]"
                    }`}
                  >
                    {item.status}
                  </span>
                </div>
                <div className="text-xs text-[#F4F7F4] font-sans truncate">{item.name}</div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Active Dialogue Sessions */}
      <div className="space-y-2 pt-2 border-t border-[rgba(154,231,207,0.12)]">
        <div className="flex items-center justify-between px-1">
          <span className="text-[10px] uppercase font-bold text-[#708784] tracking-wider font-mono">
            Active Sessions ({negotiations.length})
          </span>
          <span className="text-[10px] text-[#79E7C7] font-mono">Live Sync</span>
        </div>

        <div className="space-y-2 max-h-[220px] overflow-y-auto pr-1">
          {negotiations.map((neg) => {
            const isSelected = selectedId === neg.id;
            const effectivePrice = neg.final_price || neg.counter_price || neg.original_price;
            return (
              <div
                key={neg.id}
                onClick={() => onSelectNegotiation(neg.id)}
                className={`p-3 rounded-xl border cursor-pointer transition-all duration-200 font-mono text-xs ${
                  isSelected
                    ? "bg-[#176D5B]/30 border-[#79E7C7] shadow-mint-subtle"
                    : "bg-[#0B191B] border-[rgba(154,231,207,0.1)] hover:bg-[#102326]"
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[#79E7C7] font-bold">{neg.item_sku}</span>
                  <span className="text-[9px] uppercase tracking-wider text-[#A6B8B5]">
                    {neg.status}
                  </span>
                </div>
                <div className="text-[#F4F7F4] font-sans truncate text-xs">
                  {neg.supplier_name || `Supplier #${neg.supplier_id}`}
                </div>
                <div className="flex items-center justify-between text-[11px] text-[#A6B8B5] mt-1 pt-1 border-t border-[rgba(154,231,207,0.06)]">
                  <span>Round {neg.rounds}</span>
                  <strong className="text-[#79E7C7]">${effectivePrice?.toFixed(2)}</strong>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Initiation Control Drawer */}
      <div className="p-4 rounded-2xl bg-[#0B191B] border border-[rgba(154,231,207,0.12)] space-y-3 font-mono text-xs">
        <div className="flex items-center gap-2">
          <Bot className="w-4 h-4 text-[#79E7C7]" />
          <span className="font-bold text-[#F4F7F4] font-sans">New Autonomous Bid</span>
        </div>
        <div>
          <label className="block text-[10px] uppercase text-[#708784] mb-1">Quantity</label>
          <Input
            type="number"
            min="1"
            value={newQty}
            onChange={(e) => setNewQty(Math.max(1, parseInt(e.target.value) || 1))}
            className="bg-[#061011] border-[rgba(154,231,207,0.12)] text-[#F4F7F4] h-8 text-xs font-mono rounded-lg"
          />
        </div>
        <div>
          <label className="block text-[10px] uppercase text-[#708784] mb-1">Target Counter ($)</label>
          <Input
            type="number"
            step="0.5"
            placeholder="e.g. 118.00"
            value={targetPrice}
            onChange={(e) => setTargetPrice(e.target.value)}
            className="bg-[#061011] border-[rgba(154,231,207,0.12)] text-[#F4F7F4] h-8 text-xs font-mono rounded-lg"
          />
        </div>
        <Button
          onClick={onStartNegotiation}
          isLoading={starting}
          className="w-full text-xs font-bold font-mono bg-[#79E7C7] text-[#061011] hover:bg-[#79E7C7]/90 h-9 rounded-xl shadow-mint-subtle"
        >
          Initialize AI Session
        </Button>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// 2. CHAT TRANSCRIPT (CENTER COLUMN — LARGEST SECTION)
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
      <div className="rounded-2xl border border-[rgba(154,231,207,0.12)] bg-[#0B191B] flex flex-col h-[740px] items-center justify-center text-xs text-[#A6B8B5] font-mono shadow-sm">
        <RefreshCw className="w-6 h-6 animate-spin text-[#79E7C7] mb-3" />
        <p>Synchronizing cryptographic session transcript...</p>
      </div>
    );
  }

  if (!negotiation) {
    return (
      <div className="h-[600px] rounded-2xl border border-[rgba(154,231,207,0.12)] flex flex-col items-center justify-center text-[#A6B8B5] text-xs font-mono p-8 text-center bg-[#0B191B] shadow-sm">
        <Bot className="w-10 h-10 text-[#79E7C7]/50 mb-3" />
        <div className="font-sans font-bold text-[#F4F7F4] text-sm mb-1">No Active Negotiation Selected</div>
        <p className="max-w-xs text-[#708784]">
          Select an active session from the left index or initiate an autonomous bidding cycle above.
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
    <div className="rounded-2xl border border-[rgba(154,231,207,0.12)] bg-[#0B191B] flex flex-col h-[740px] shadow-sm overflow-hidden">
      {/* Header */}
      <div className="p-5 border-b border-[rgba(154,231,207,0.12)] bg-[#061011]/90 shrink-0">
        <div className="flex items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1.5 font-mono">
              <span className="text-xs font-bold text-[#79E7C7] bg-[#79E7C7]/10 px-2 py-0.5 rounded border border-[#79E7C7]/30">
                SKU: {negotiation.item_sku}
              </span>
              <span className="text-xs text-[#A6B8B5] bg-[#102326] px-2 py-0.5 rounded border border-[rgba(154,231,207,0.1)]">
                Session #{negotiation.id}
              </span>
              {negotiation.supplier?.name && (
                <span className="text-xs text-[#A6B8B5] font-sans">
                  counterparty: <strong className="text-[#F4F7F4]">{negotiation.supplier.name}</strong>
                </span>
              )}
            </div>
            <h3 className="text-base text-[#F4F7F4] font-sans font-bold tracking-tight">
              {negotiation.item_name || `${negotiation.item_sku} Hardware`} · Volume: {fin?.approved_quantity ?? negotiation.quantity} Units
            </h3>
          </div>

          <div className="text-right font-mono shrink-0">
            <div className="text-[10px] text-[#708784] uppercase tracking-wider">Agreed / Proposed Rate</div>
            <div className="text-2xl font-bold text-[#79E7C7] tracking-tight">
              ${Number(currentPrice).toFixed(2)}
            </div>
            <div className="text-[11px] text-[#A6B8B5]">
              Batch Subtotal: ${Number(negotiatedSubtotal).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </div>
          </div>
        </div>

        {/* AI Reasoning Strip */}
        {negotiation.ai_reasoning && (
          <div className="mt-3 p-3 rounded-xl bg-[#102326] border border-[rgba(154,231,207,0.12)] text-xs text-[#A6B8B5] leading-relaxed flex items-start gap-2.5 font-sans">
            <Sparkles className="w-4 h-4 text-[#79E7C7] shrink-0 mt-0.5" />
            <div>
              <strong className="text-[#F4F7F4]">AI Negotiation Strategy: </strong>
              {negotiation.ai_reasoning}
            </div>
          </div>
        )}
      </div>

      {/* ─── ACTIVE PROCUREMENT GUARDRAILS STRIP ─────────────────────────── */}
      <div className="bg-[#061011]/60 border-b border-[rgba(154,231,207,0.12)] p-3.5 font-mono text-xs shrink-0">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-[11px]">
          <div className="p-2 rounded-lg bg-[#0B191B] border border-[rgba(154,231,207,0.1)] space-y-0.5">
            <span className="text-[#79E7C7] uppercase font-bold text-[9px] block">Spend Cap</span>
            <div className="text-[#F4F7F4] font-bold">$25,000.00</div>
          </div>
          <div className="p-2 rounded-lg bg-[#0B191B] border border-[rgba(154,231,207,0.1)] space-y-0.5">
            <span className="text-[#79E7C7] uppercase font-bold text-[9px] block">Floor (70%)</span>
            <div className="text-[#F4F7F4] font-bold">${(originalPrice * 0.70).toFixed(2)}</div>
          </div>
          <div className="p-2 rounded-lg bg-[#0B191B] border border-[rgba(154,231,207,0.1)] space-y-0.5">
            <span className="text-[#79E7C7] uppercase font-bold text-[9px] block">Human Gate</span>
            <div className="text-[#F4F7F4] font-bold">PO Sign Required</div>
          </div>
          <div className="p-2 rounded-lg bg-[#0B191B] border border-[rgba(154,231,207,0.1)] space-y-0.5">
            <span className="text-[#79E7C7] uppercase font-bold text-[9px] block">Round Limit</span>
            <div className="text-[#F4F7F4] font-bold">Round {negotiation.rounds} of 5</div>
          </div>
        </div>

        {error && error.includes("GUARDRAIL_VIOLATION") && (
          <div className="mt-2.5 p-2.5 rounded-lg bg-[#2e1717] border border-[#D77979]/60 flex items-start gap-2 text-[#D77979] text-xs">
            <ShieldAlert className="w-4 h-4 shrink-0 mt-0.5" />
            <div>{error}</div>
          </div>
        )}
      </div>

      {/* Message Transcript Container */}
      <div
        ref={chatContainerRef}
        className="p-5 flex-1 overflow-y-auto space-y-4 bg-[#061011]/40"
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
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
                className={`flex flex-col max-w-lg p-4 rounded-2xl text-xs space-y-1.5 transition-all shadow-sm ${
                  isBuyer
                    ? "ml-auto bg-[#102326] border border-[#79E7C7]/30 text-[#F4F7F4]"
                    : isMerchant
                    ? "ml-auto bg-[#173034] border border-[#79E7C7]/60 text-[#F4F7F4]"
                    : "mr-auto bg-[#0B191B] border border-[rgba(154,231,207,0.12)] text-[#F4F7F4]"
                }`}
              >
                {/* Message Sender Header */}
                <div className="flex items-center justify-between gap-4 text-[11px] font-semibold border-b border-[rgba(154,231,207,0.08)] pb-1.5 font-sans">
                  <span
                    className={`flex items-center gap-1.5 ${
                      isBuyer
                        ? "text-[#79E7C7]"
                        : isMerchant
                        ? "text-[#5FC7A1]"
                        : "text-[#A6B8B5]"
                    }`}
                  >
                    {isBuyer ? (
                      <Bot className="w-3.5 h-3.5 text-[#79E7C7]" />
                    ) : isMerchant ? (
                      <User className="w-3.5 h-3.5 text-[#5FC7A1]" />
                    ) : (
                      <Building2 className="w-3.5 h-3.5 text-[#A6B8B5]" />
                    )}
                    {senderHeader}
                  </span>

                  <div className="flex items-center gap-2 font-mono">
                    {priceTag !== undefined && priceTag !== null && (
                      <span className="text-[#F4F7F4] bg-[#061011] px-2 py-0.5 rounded font-bold text-[10px] border border-[rgba(154,231,207,0.1)]">
                        ${Number(priceTag).toFixed(2)}/unit
                      </span>
                    )}
                    <span className="text-[10px] text-[#708784]">
                      {timestampStr}
                    </span>
                  </div>
                </div>

                {/* Message Body */}
                <p className="text-xs leading-relaxed text-[#F4F7F4]/90 font-sans pt-1">
                  {messageText}
                </p>
              </motion.div>
            );
          })
        ) : (
          <div className="flex items-center justify-center h-full text-xs text-[#708784] font-mono">
            No dialogue messages recorded for this session.
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Counter Input / Acceptance Footer */}
      <div className="p-4 border-t border-[rgba(154,231,207,0.12)] bg-[#061011]/90 shrink-0">
        {negotiation.status !== "accepted" ? (
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            <div className="relative flex-1">
              <DollarSign className="w-4 h-4 text-[#708784] absolute left-3 top-3" />
              <Input
                type="number"
                step="0.5"
                placeholder="Enter counteroffer ($/unit, min 70% floor)..."
                value={counterInput}
                onChange={(e) => setCounterInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") onSendCounter();
                }}
                className="bg-[#0B191B] text-[#F4F7F4] font-mono text-xs h-10 pl-9 rounded-xl border-[rgba(154,231,207,0.12)] focus:border-[#79E7C7]"
              />
            </div>

            <Button
              onClick={onSendCounter}
              isLoading={countering}
              className="shrink-0 text-xs gap-1.5 shadow-mint-subtle h-10 px-5 font-mono font-bold bg-[#79E7C7] text-[#061011] hover:bg-[#79E7C7]/90 rounded-xl"
            >
              <Send className="w-3.5 h-3.5" /> Submit Counter
            </Button>

            <Button
              onClick={onAcceptTerms}
              isLoading={accepting}
              variant="outline"
              className="shrink-0 text-xs gap-1 h-10 px-4 font-mono font-bold border-[#79E7C7]/50 text-[#79E7C7] hover:bg-[#79E7C7]/10 rounded-xl"
            >
              Accept Rate
            </Button>
          </div>
        ) : (
          <div className="w-full flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 p-1">
            <span className="text-xs text-[#5FC7A1] font-mono font-bold flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-[#5FC7A1] shrink-0" />
              Negotiation Accepted & Locked at ${Number(currentPrice).toFixed(2)}/unit
            </span>
            <Link href="/dashboard/approval">
              <Button size="sm" className="font-mono text-xs gap-1.5 shadow-mint-subtle font-bold bg-[#79E7C7] text-[#061011] hover:bg-[#79E7C7]/90 rounded-xl">
                Proceed to Purchase Approval Gate <ArrowRight className="w-3.5 h-3.5" />
              </Button>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// 3. NEGOTIATION ECONOMICS (RIGHT COLUMN — MATCH BOTTOM-LEFT REFERENCE)
// ─────────────────────────────────────────────────────────────────────────────
function NegotiationEconomics({
  negotiation,
  detailLoading,
}: {
  negotiation: any;
  detailLoading: boolean;
}) {
  if (detailLoading || !negotiation) {
    return (
      <div className="rounded-2xl border border-[rgba(154,231,207,0.12)] bg-[#0B191B] p-5 font-mono text-xs shadow-sm">
        <div className="text-center py-12 text-[#708784]">
          {detailLoading ? "Synchronizing economics..." : "Select a negotiation to view economics."}
        </div>
      </div>
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

  const supplierName = negotiation.supplier?.name || "TechSource Global Ltd";
  const leadTimeDays = negotiation.item_sku === "ELEC-005" ? 7 : (negotiation.supplier?.lead_time_days || 14);
  const reliabilityPct = negotiation.item_sku === "ELEC-005" ? 94 : Math.round((negotiation.supplier?.reliability_score || 0.88) * 100);

  return (
    <div className="rounded-2xl border border-[rgba(154,231,207,0.12)] bg-[#0B191B] p-5 space-y-5 font-mono text-xs shadow-sm">
      <div className="flex items-center gap-2 pb-3 border-b border-[rgba(154,231,207,0.08)]">
        <ShieldCheck className="w-4 h-4 text-[#79E7C7]" />
        <div>
          <h4 className="font-sans font-bold text-sm text-[#F4F7F4]">
            Negotiation Economics
          </h4>
          <p className="text-[11px] text-[#708784] font-mono">Financial balance sheet</p>
        </div>
      </div>

      {/* Financial Table */}
      <div className="p-4 rounded-xl bg-[#061011] border border-[rgba(154,231,207,0.08)] space-y-2.5">
        {linkedOrder?.order_number && (
          <div className="flex items-center justify-between pb-2 border-b border-[rgba(154,231,207,0.08)]">
            <span className="text-[#A6B8B5]">Purchase Order:</span>
            <Link
              href={`/dashboard/approval`}
              className="text-[#79E7C7] font-bold hover:underline flex items-center gap-1 font-mono text-[11px]"
            >
              <span>{linkedOrder.order_number}</span>
              <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
        )}
        <div className="flex justify-between">
          <span className="text-[#A6B8B5]">Target SKU:</span>
          <span className="text-[#79E7C7] font-bold">{negotiation.item_sku}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-[#A6B8B5]">Approved Qty:</span>
          <span className="text-[#F4F7F4] font-bold">{quantity} Units</span>
        </div>
        <div className="flex justify-between">
          <span className="text-[#A6B8B5]">Initial Quote:</span>
          <span className="text-[#F4F7F4]">${Number(originalPrice).toFixed(2)}/unit</span>
        </div>
        {counterPrice !== undefined && counterPrice !== null && (
          <div className="flex justify-between text-[#A6B8B5]">
            <span>Buyer Target:</span>
            <span className="text-[#A6B8B5] font-mono">${Number(counterPrice).toFixed(2)}/unit</span>
          </div>
        )}
        <div className="flex justify-between">
          <span className="text-[#A6B8B5]">Negotiated Rate:</span>
          <span className="text-[#79E7C7] font-bold">${Number(currentPrice).toFixed(2)}/unit</span>
        </div>
        <div className="flex justify-between">
          <span className="text-[#A6B8B5]">Batch Subtotal:</span>
          <span className="text-[#F4F7F4] font-bold font-mono">
            ${Number(negotiatedSubtotal).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </span>
        </div>
        <div className="flex justify-between text-[#5FC7A1]">
          <span>Net Savings:</span>
          <span className="font-bold font-mono">
            -${Number(totalSavings).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} ({savingsPct.toFixed(1)}%)
          </span>
        </div>

        {/* Freight & Tax */}
        <div className="pt-2 border-t border-[rgba(154,231,207,0.08)] space-y-1.5 text-[11px]">
          <div className="flex justify-between text-[#A6B8B5]">
            <span>Expedited Freight:</span>
            <span className="text-[#F4F7F4] font-mono">${Number(freight).toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-[#A6B8B5]">
            <span>Tax (5%):</span>
            <span className="text-[#F4F7F4] font-mono">${Number(tax).toFixed(2)}</span>
          </div>
        </div>

        {/* Total Authorized */}
        <div className="pt-3 border-t-2 border-[#79E7C7]/40 flex justify-between items-baseline text-sm">
          <span className="text-[#F4F7F4] font-sans font-bold text-xs">Total Authorized:</span>
          <span className="text-[#79E7C7] font-bold font-mono text-base">
            ${Number(totalApproved).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} USD
          </span>
        </div>
      </div>

      {/* Vendor SLA Commitments */}
      <div className="space-y-2 pt-1 text-[#A6B8B5] text-[11px]">
        <span className="text-[10px] uppercase font-bold text-[#708784] tracking-wider font-mono block">
          Vendor SLA Commitments
        </span>
        <div className="flex justify-between">
          <span>Counterparty:</span>
          <strong className="text-[#F4F7F4]">{supplierName}</strong>
        </div>
        <div className="flex justify-between">
          <span>Lead Time:</span>
          <strong className="text-[#F4F7F4]">{leadTimeDays} Days (Pacific CX870)</strong>
        </div>
        <div className="flex justify-between">
          <span>Reliability:</span>
          <strong className="text-[#5FC7A1]">{reliabilityPct}%</strong>
        </div>
        <div className="flex justify-between">
          <span>Settlement Rail:</span>
          <strong className="text-[#79E7C7]">PayPal Orders v2</strong>
        </div>
      </div>

      <div className="p-3 rounded-xl bg-[#102326] border border-[rgba(154,231,207,0.12)] text-[11px] text-[#A6B8B5] font-sans leading-relaxed">
        <strong className="text-[#F4F7F4] block mb-0.5">Commercial Floor Guard</strong>
        Deterministic backend validation enforces a minimum 70% quote concession floor. No proposal below ${(originalPrice * 0.7).toFixed(2)} can be authorized.
      </div>
    </div>
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

  // Active dialogue form states
  const [counterInput, setCounterInput] = useState<string>("");
  const [countering, setCountering] = useState<boolean>(false);
  const [accepting, setAccepting] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [showGuardrailsDetails, setShowGuardrailsDetails] = useState<boolean>(false);

  // Fetch all negotiations
  const fetchNegotiations = async (targetId?: number, targetSku?: string) => {
    try {
      setLoading(true);
      setError(null);
      const res = await api.get<any[]>("/api/negotiations");
      const list = res.data || [];
      setNegotiations(list);

      const effectiveSku = targetSku || selectedSku;
      let targetNegotiation = null;

      if (targetId) {
        targetNegotiation = list.find((n) => n.id === targetId);
      } else if (effectiveSku) {
        targetNegotiation = list.find((n) => n.item_sku === effectiveSku);
      }

      if (!targetNegotiation && list.length > 0) {
        targetNegotiation = list[0];
      }

      if (targetNegotiation) {
        setSelectedId(targetNegotiation.id);
        setSelectedSku(targetNegotiation.item_sku);
        await fetchNegotiationDetail(targetNegotiation.id);
      } else {
        setSelectedId(null);
        setSelectedNegotiation(null);
      }
    } catch (err: any) {
      console.error("Failed to load negotiations list", err);
      setError(err.detail || err.message || "Failed to load negotiations");
    } finally {
      setLoading(false);
    }
  };

  // Fetch full details of one selected negotiation
  const fetchNegotiationDetail = async (id: number) => {
    try {
      setDetailLoading(true);
      setError(null);
      setSelectedId(id);
      const res = await api.get<any>(`/api/negotiations/${id}`);
      const data = res.data?.negotiation || res.data;
      setSelectedNegotiation(data);
      if (data?.item_sku) {
        setSelectedSku(data.item_sku);
      }
    } catch (err: any) {
      console.error("Failed to load negotiation detail", err);
      setError(err.detail || err.message || "Failed to load negotiation details");
    } finally {
      setDetailLoading(false);
    }
  };

  // Handle switching SKU from the sidebar
  const handleSelectSku = (sku: string) => {
    setSelectedSku(sku);
    const match = negotiations.find((n) => n.item_sku === sku);
    if (match) {
      fetchNegotiationDetail(match.id);
    } else {
      setSelectedId(null);
      setSelectedNegotiation(null);
    }
  };

  // Load LLM status & initial negotiations on mount
  useEffect(() => {
    api
      .get<any>("/api/negotiations/llm-status")
      .then((res) => setLlmStatus(res.data))
      .catch(() => setLlmStatus({ available: false, provider: "none", model: "deterministic" }));

    fetchNegotiations(idParam ? parseInt(idParam) : undefined, skuParam);
  }, []);

  // Handle starting a new negotiation
  const handleStartNegotiation = async () => {
    try {
      setStarting(true);
      setError(null);

      const quoteRes = await api.get<any[]>(`/api/suppliers/quotations/${selectedSku}`);
      if (!quoteRes.data || quoteRes.data.length === 0) {
        setError(`No quotation benchmark found for ${selectedSku}.`);
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
    <PageEntrance className="space-y-8 font-sans">
      {/* ─── HEADER & ACTIONS ────────────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[rgba(154,231,207,0.12)]">
        <div>
          <span className="text-xs font-mono font-medium text-[#79E7C7] uppercase tracking-wider block mb-1">
            Autonomous Multi-Agent Coordination
          </span>
          <h2 className="font-sans font-bold text-3xl sm:text-4xl text-[#F4F7F4] tracking-tight">
            AI Supplier Negotiation Studio
          </h2>
          <p className="text-sm text-[#A6B8B5] mt-1 font-sans">
            Direct algorithmic negotiation between SUPPLYMIND Buyer Agent and Supplier Sales Agents.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Button
            variant="secondary"
            size="sm"
            onClick={() => fetchNegotiations(selectedId || undefined)}
            className="text-xs gap-1.5 h-9 font-mono bg-[#0B191B] border border-[rgba(154,231,207,0.12)] text-[#F4F7F4] hover:bg-[#102326] rounded-xl"
          >
            <RefreshCw className="w-3.5 h-3.5 text-[#79E7C7]" />
            Refresh
          </Button>

          <Link href="/dashboard/approval">
            <Button size="sm" className="text-xs gap-1.5 h-9 shadow-mint-subtle font-mono font-bold bg-[#79E7C7] text-[#061011] hover:bg-[#79E7C7]/90 rounded-xl">
              <CheckCircle2 className="w-3.5 h-3.5" />
              Approval Gate
            </Button>
          </Link>
        </div>
      </div>

      {error && !error.includes("GUARDRAIL_VIOLATION") && (
        <div className="p-4 rounded-xl bg-[#2e1717] border border-[#D77979]/50 flex items-start gap-3 text-[#D77979] text-xs font-mono">
          <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
          <div>{error}</div>
        </div>
      )}

      {/* ─── 3-COLUMN NEGOTIATION ARCHITECTURE (MATCH BOTTOM-LEFT REFERENCE) ─ */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* LEFT COLUMN: SKU Selection (~230px / 3 cols) */}
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

        {/* CENTER COLUMN: AI Dialogue & Counteroffers (6 cols — Largest Section) */}
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

        {/* RIGHT COLUMN: Negotiation Economics (3 cols) */}
        <div className="lg:col-span-3">
          <NegotiationEconomics
            negotiation={selectedNegotiation}
            detailLoading={detailLoading}
          />
        </div>
      </div>
    </PageEntrance>
  );
}

export default function NegotiationsPage() {
  return (
    <Suspense fallback={<div className="p-8 text-xs text-[#A6B8B5] font-mono">Loading negotiation studio...</div>}>
      <NegotiationStudio />
    </Suspense>
  );
}
