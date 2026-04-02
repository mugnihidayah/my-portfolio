"use client";

import { useToast } from "@/context/ToastContext";
import { CheckCircle2, Info, AlertTriangle, X } from "lucide-react";
import { useEffect, useState } from "react";

export default function ToastContainer() {
  const { toasts, removeToast } = useToast();

  return (
    <div className="fixed bottom-16 right-4 z-9999 flex flex-col gap-2 pointer-events-none">
      {toasts.map((toast) => (
        <ToastItem
          key={toast.id}
          toast={toast}
          onRemove={() => removeToast(toast.id)}
        />
      ))}
    </div>
  );
}

function ToastItem({
  toast,
  onRemove,
}: {
  toast: { id: string; message: string; type: "info" | "success" | "error" };
  onRemove: () => void;
}) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        setVisible(true);
      });
    });

    // Start fade out before removal
    const timer = setTimeout(() => {
      setVisible(false);
    }, 2700);

    return () => clearTimeout(timer);
  }, []);

  const iconMap = {
    info: <Info size={14} style={{ color: "var(--accent-color)" }} />,
    success: <CheckCircle2 size={14} style={{ color: "#4ec9b0" }} />,
    error: <AlertTriangle size={14} style={{ color: "#f44747" }} />,
  };

  return (
    <div
      data-motion="toast"
      data-state={visible ? "open" : "closed"}
      className="flex items-center gap-2.5 px-4 py-2.5 rounded-sm border shadow-xl pointer-events-auto max-w-xs"
      style={{
        backgroundColor: "var(--sidebar-bg)",
        borderColor: "var(--border-color)",
        color: "var(--editor-fg)",
      }}
    >
      {iconMap[toast.type]}
      <span className="text-[12px] flex-1">{toast.message}</span>
      <button
        type="button"
        onClick={onRemove}
        className="p-0.5 rounded-sm hover:bg-white/10 transition-colors shrink-0"
        style={{ color: "var(--editor-fg)", opacity: 0.4 }}
      >
        <X size={12} />
      </button>
    </div>
  );
}
