"use client";

import React, { createContext, useContext, useState, useCallback } from "react";
import { cn } from "@/lib/utils";
import { CheckCircle2, AlertCircle, Info, X } from "lucide-react";

type ToastType = "success" | "error" | "info" | "warning";

interface Toast {
  id: string;
  title: string;
  description?: string;
  type?: ToastType;
}

interface ToastContextType {
  toast: (options: { title: string; description?: string; type?: ToastType }) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    return {
      toast: (opts: { title: string; description?: string; type?: ToastType }) => {
        console.log(`[Toast ${opts.type || "info"}]: ${opts.title} - ${opts.description}`);
      },
    };
  }
  return context;
}

export function Toaster() {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const addToast = useCallback(
    ({ title, description, type = "info" }: { title: string; description?: string; type?: ToastType }) => {
      const id = Math.random().toString(36).substring(2, 9);
      setToasts((prev) => [...prev, { id, title, description, type }]);
      setTimeout(() => {
        setToasts((prev) => prev.filter((t) => t.id !== id));
      }, 5000);
    },
    []
  );

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  return (
    <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2 max-w-md w-full pointer-events-none p-4">
      {toasts.map((t) => (
        <div
          key={t.id}
          className={cn(
            "pointer-events-auto flex items-start gap-3 rounded-xl p-4 shadow-xl border backdrop-blur-md transition-all duration-300 animate-slide-in-right",
            t.type === "success" && "bg-[#101C1A]/95 text-warm-ivory border-emerald-500/40",
            t.type === "error" && "bg-red-950/95 text-red-100 border-red-500/40",
            t.type === "warning" && "bg-amber-950/95 text-amber-100 border-amber-500/40",
            (!t.type || t.type === "info") && "bg-obsidian/95 text-warm-ivory border-champagne-gold/40"
          )}
        >
          {t.type === "success" && <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />}
          {t.type === "error" && <AlertCircle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />}
          {t.type === "warning" && <AlertCircle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />}
          {(!t.type || t.type === "info") && <Info className="w-5 h-5 text-champagne-gold shrink-0 mt-0.5" />}
          
          <div className="flex-1">
            <h5 className="font-semibold text-sm leading-tight">{t.title}</h5>
            {t.description && <p className="text-xs text-muted-sage mt-1 leading-relaxed">{t.description}</p>}
          </div>

          <button
            onClick={() => removeToast(t.id)}
            className="text-muted-sage hover:text-warm-ivory transition-colors p-1"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      ))}
    </div>
  );
}
