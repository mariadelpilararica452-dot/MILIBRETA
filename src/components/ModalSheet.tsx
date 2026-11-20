import React, { useEffect } from 'react';
import { X } from 'lucide-react';

interface ModalSheetProps {
  open: boolean;
  title: string;
  onClose: () => void;
  children: React.ReactNode;
}

export function ModalSheet({ open, title, onClose, children }: ModalSheetProps) {
  useEffect(() => {
    if (!open) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-slate-900/50 backdrop-blur-xs sm:items-center sm:p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-sheet-title"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="w-full max-h-[90vh] overflow-y-auto rounded-t-3xl bg-white shadow-xl sm:max-w-lg sm:rounded-2xl">
        <div className="sticky top-0 z-10 flex flex-col bg-white/95 backdrop-blur-xs border-b border-slate-100 px-5 pt-3 pb-4">
          <div className="mx-auto mb-3 h-1.5 w-10 rounded-full bg-slate-300 sm:hidden" aria-hidden="true" />
          <div className="flex items-center justify-between gap-4">
            <h2 id="modal-sheet-title" className="text-lg font-bold text-slate-900">
              {title}
            </h2>
            <button
              type="button"
              onClick={onClose}
              aria-label="Cerrar ventana"
              className="flex min-h-[44px] min-w-[44px] items-center justify-center rounded-xl text-slate-500 hover:bg-slate-100 hover:text-slate-900 focus-visible:outline-2 focus-visible:outline-blue-700"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>
        <div className="p-5 pb-safe">{children}</div>
      </div>
    </div>
  );
}

interface ConfirmDialogProps {
  open: boolean;
  title: string;
  message: string;
  confirmLabel: string;
  onConfirm: () => void;
  onCancel: () => void;
}

export function ConfirmDialog({
  open,
  title,
  message,
  confirmLabel,
  onConfirm,
  onCancel,
}: ConfirmDialogProps) {
  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4 backdrop-blur-xs"
      role="alertdialog"
      aria-modal="true"
      aria-labelledby="confirm-dialog-title"
      onClick={(e) => {
        if (e.target === e.currentTarget) onCancel();
      }}
    >
      <div className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-xl">
        <h2 id="confirm-dialog-title" className="text-lg font-bold text-slate-900">
          {title}
        </h2>
        <p className="mt-2 text-base leading-relaxed text-slate-600">{message}</p>
        <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
          <button
            type="button"
            onClick={onCancel}
            className="min-h-[48px] rounded-xl border border-slate-300 bg-white px-5 py-3 text-base font-semibold text-slate-700 hover:bg-slate-50 focus-visible:outline-2 focus-visible:outline-blue-700 whitespace-nowrap"
          >
            Cancelar
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className="min-h-[48px] rounded-xl bg-red-600 px-5 py-3 text-base font-semibold text-white hover:bg-red-700 focus-visible:outline-2 focus-visible:outline-red-700 whitespace-nowrap"
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
