import React, { createContext, useContext, useState, useCallback } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { CheckCircle2, AlertCircle, Info, X, XCircle } from "lucide-react";

const ToastContext = createContext();

const ICON = {
  success: <CheckCircle2 className="h-5 w-5 text-neutral-300" />,
  error: <XCircle className="h-5 w-5 text-neutral-400" />,
  info: <Info className="h-5 w-5 text-neutral-500" />,
  warn: <AlertCircle className="h-5 w-5 text-neutral-500" />,
};

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  const push = useCallback((message, type = "success", duration = 3200) => {
    const id = Math.random().toString(36).slice(2);
    setToasts((t) => [...t, { id, message, type }]);
    setTimeout(() => setToasts((t) => t.filter((x) => x.id !== id)), duration);
  }, []);

  const dismiss = (id) => setToasts((t) => t.filter((x) => x.id !== id));

  return (
    <ToastContext.Provider value={{ toast: push, dismiss }}>
      {children}
      <div className="fixed bottom-5 left-1/2 -translate-x-1/2 z-[100] flex flex-col items-center gap-2 px-4 w-full max-w-md pointer-events-none">
        <AnimatePresence>
          {toasts.map((t) => (
            <motion.div
              key={t.id}
              layout
              initial={{ opacity: 0, y: 24, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 12, scale: 0.95 }}
              transition={{ type: "spring", stiffness: 380, damping: 28 }}
              className="pointer-events-auto w-full flex items-center gap-3 px-4 py-3.5 rounded-2xl glass-dark shadow-2xl shadow-black/30"
            >
              <span className="shrink-0">{ICON[t.type] || ICON.info}</span>
              <p className="flex-1 text-sm font-semibold text-white">{t.message}</p>
              <button
                onClick={() => dismiss(t.id)}
                className="shrink-0 text-white/40 hover:text-white transition-colors"
              >
                <X className="h-4 w-4" />
              </button>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  );
};

export const useToast = () => useContext(ToastContext);