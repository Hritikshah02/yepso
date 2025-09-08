"use client";
import React, { createContext, useContext, useMemo, useState } from "react";

export type ToastType = "success" | "info" | "error";

type Toast = { id: number; message: string; type: ToastType };

type ToastContextType = {
  showToast: (message: string, opts?: { type?: ToastType; durationMs?: number }) => void;
};

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);
  const showToast = (message: string, opts?: { type?: ToastType; durationMs?: number }) => {
    const id = Date.now() + Math.floor(Math.random() * 1000);
    const type = opts?.type ?? "success";
    const duration = Math.max(800, Math.min(opts?.durationMs ?? 2000, 10000));
    setToasts((prev) => [...prev, { id, message, type }]);
    window.setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, duration);
  };

  const value = useMemo(() => ({ showToast }), []);

  return (
    <ToastContext.Provider value={value}>
      {children}
      {/* Bottom-center toast stack */}
      <div className="pointer-events-none fixed inset-x-0 bottom-6 z-[60] flex justify-center px-4">
        <div className="space-y-2 w-full max-w-xl">
          {toasts.map((t) => (
            <div
              key={t.id}
              className={`mx-auto flex items-start gap-3 rounded-lg shadow-xl ring-1 ring-black/10 px-4 py-3 text-white animate-slide-up-fade ${
                t.type === "error" ? "bg-red-600" : t.type === "info" ? "bg-gray-800" : "bg-black"
              }`}
              style={{ width: "fit-content", maxWidth: "100%" }}
              role="status"
              aria-live="polite"
            >
              <i className={`mt-0.5 fa-solid ${t.type === "error" ? "fa-circle-xmark" : "fa-circle-check"}`}></i>
              <span className="text-sm sm:text-[15px] leading-snug">{t.message}</span>
            </div>
          ))}
        </div>
      </div>
      <style jsx global>{`
        @keyframes slideUpFade { 0% { opacity: 0; transform: translateY(16px); } 100% { opacity: 1; transform: translateY(0);} }
        .animate-slide-up-fade { animation: slideUpFade 250ms ease-out; }
      `}</style>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error("useToast must be used within a ToastProvider");
  return ctx;
}
