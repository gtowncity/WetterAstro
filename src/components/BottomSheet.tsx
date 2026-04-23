import React, { useEffect } from "react";
import { GlassCard } from "./ui";

export default function BottomSheet(props: {
  open: boolean;
  title?: string;
  onClose: () => void;
  children: React.ReactNode;
}) {
  const { onClose, open, title, children } = props;

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    if (open) window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50">
      <div
        className="absolute inset-0 bg-black/40"
        onClick={onClose}
      />
      <div className="absolute inset-x-0 bottom-0 p-3">
        <GlassCard className="p-4 max-w-3xl mx-auto">
          <div className="flex items-center justify-between mb-3">
            <div className="font-semibold">{title || "Details"}</div>
            <button
              className="px-3 py-1 rounded-full bg-white/10 border border-white/10"
              onClick={onClose}
            >
              Schließen
            </button>
          </div>
          {children}
        </GlassCard>
      </div>
    </div>
  );
}
