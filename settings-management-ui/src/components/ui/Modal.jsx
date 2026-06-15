import { X } from "lucide-react";
import { useEffect } from "react";
import { createPortal } from "react-dom";

function Modal({ isOpen, onClose, title, children }) {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-[#0B0B0B]/60 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      {/* Modal Content */}
      <div className="relative w-full max-w-lg glass-card dark:glass-panel-dark animate-slide-up shadow-[0_20px_50px_rgba(0,0,0,0.5)] border-t border-t-brand/30">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-surface-200 dark:border-surface-800 pb-4 mb-6">
          <h2 className="text-xl font-bold font-heading text-surface-900 dark:text-text-main tracking-tight">
            {title}
          </h2>
          <button
            onClick={onClose}
            className="p-2 text-surface-500 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-500/10 rounded-full transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Body */}
        <div>{children}</div>
      </div>
    </div>,
    document.body
  );
}

export default Modal;