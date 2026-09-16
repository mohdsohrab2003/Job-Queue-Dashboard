import { X } from "lucide-react";

function Modal({ isOpen, onClose, title, children, size = "md" }) {
  if (!isOpen) {
    return null;
  }

  const sizes = {
    sm: "max-w-sm",
    md: "max-w-md",
    lg: "max-w-lg",
    xl: "max-w-xl",
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Overlay */}
      <div className="absolute inset-0 bg-slate-950/50" onClick={onClose} />

      {/* Modal */}
      <div
        className={`
          relative w-full rounded-xl bg-white
          shadow-xl ${sizes[size]}
        `}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4">
          <h2 className="text-lg font-semibold text-slate-900">{title}</h2>

          <button
            type="button"
            onClick={onClose}
            className="
              rounded-lg p-1.5 text-slate-400
              transition hover:bg-slate-100
              hover:text-slate-700
            "
            aria-label="Close modal"
          >
            <X size={20} />
          </button>
        </div>

        {/* Body */}
        <div className="p-5">{children}</div>
      </div>
    </div>
  );
}

export default Modal;
