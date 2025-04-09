"use client";

import { useEffect, useState } from "react";
import { CheckCircle, AlertCircle, Info } from "lucide-react";

type ToastProps = {
  message: string;
  duration?: number;
  type?: "success" | "error" | "info";
  onClose?: () => void;
};

export const showToast = (
  message: string,
  type: "success" | "error" | "info" = "info",
  duration = 3000
) => {
  const event = new CustomEvent("toast", {
    detail: { message, type, duration },
  });
  document.dispatchEvent(event);
};

export function Toast({
  message,
  duration = 2000,
  type = "info",
  onClose,
}: ToastProps) {
  const [visible, setVisible] = useState(true);

  const getBgColor = () => {
    switch (type) {
      case "success":
        return "bg-[#2a2a2a]/90 border-green-500/30";
      case "error":
        return "bg-[#2a2a2a]/90 border-red-500/30";
      case "info":
      default:
        return "bg-[#2a2a2a]/90 border-blue-500/30";
    }
  };

  const getIcon = () => {
    switch (type) {
      case "success":
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case "error":
        return <AlertCircle className="w-4 h-4 text-red-500" />;
      case "info":
      default:
        return <Info className="w-4 h-4 text-blue-500" />;
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      setVisible(false);
      setTimeout(() => onClose?.(), 300);
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, onClose]);

  return (
    <div
      className={`fixed top-4 left-1/2 -translate-x-1/2 ${getBgColor()} backdrop-blur-md text-white px-6 py-3 rounded-lg shadow-lg border text-sm font-medium transition-all duration-300 ${
        visible ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-2"
      } z-50 flex items-center gap-2`}
    >
      {getIcon()}
      {message}
    </div>
  );
}

export function ToastContainer() {
  const [toasts, setToasts] = useState<
    Array<{
      id: string;
      message: string;
      type: "success" | "error" | "info";
      duration: number;
    }>
  >([]);

  useEffect(() => {
    const handleToast = (e: Event) => {
      const { message, type, duration } = (e as CustomEvent).detail;
      const id = Math.random().toString(36).substr(2, 9);
      setToasts((prev) => [...prev, { id, message, type, duration }]);
    };

    document.addEventListener("toast", handleToast);
    return () => document.removeEventListener("toast", handleToast);
  }, []);

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  };

  return (
    <>
      {toasts.map((toast) => (
        <Toast
          key={toast.id}
          message={toast.message}
          type={toast.type}
          duration={toast.duration}
          onClose={() => removeToast(toast.id)}
        />
      ))}
    </>
  );
}
