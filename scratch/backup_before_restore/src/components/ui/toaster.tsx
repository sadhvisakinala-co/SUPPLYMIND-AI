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
    <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2 max-w-md w-full pointer-events-none p-4 font-sans">
      {toasts.map((t) => (
        <div
          key={t.id}
          className={cn(
            "pointer-events-auto flex items-start gap-3 rounded-2xl p-4 shadow-atelier-elevated border backdrop-blur-md transition-all duration-300",
            t.type === "success" && "bg-[#172b22]/95 text-[#EDECE6] border-[#5FC7A1]/40",
            t.type === "error" && "bg-[#2e1717]/95 text-[#EDECE6] border-[#D77979]/40",
            t.type === "warning" && "bg-[#282115]/95 text-[#EDECE6] border-[#D8AD70]/40",
            (!t.type || t.type === "info") && "bg-[#172024]/95 text-[#EDECE6] border-[#4BC5B1]/40"
          )}
        >
          {t.type === "success" && <CheckCircle2 className="w-5 h-5 text-[#5FC7A1] shrink-0 mt-0.5" />}
          {t.type === "error" && <AlertCircle className="w-5 h-5 text-[#D77979] shrink-0 mt-0.5" />}
          {t.type === "warning" && <AlertCircle className="w-5 h-5 text-[#D8AD70] shrink-0 mt-0.5" />}
          {(!t.type || t.type === "info") && <Info className="w-5 h-5 text-[#4BC5B1] shrink-0 mt-0.5" />}
          
          <div className="flex-1">
            <h5 className="font-semibold text-sm leading-tight text-[#EDECE6] font-display">{t.title}</h5>
            {t.description && <p className="text-xs text-[#9AA9A8] mt-1 leading-relaxed font-mono">{t.description}</p>}
          </div>

          <button
            onClick={() => removeToast(t.id)}
            className="text-[#697D7E] hover:text-[#EDECE6] transition-colors p-1"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      ))}
    </div>
  );
}
