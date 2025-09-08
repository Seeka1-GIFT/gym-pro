import { useEffect } from 'react';

/**
 * Simple confirmation dialog that appears over the page. It closes on Escape.
 */
export default function ConfirmDialog({
  open,
  title,
  message,
  onConfirm,
  onCancel
}: {
  open: boolean;
  title: string;
  message?: string;
  onConfirm: () => void;
  onCancel: () => void;
}) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (!open) return;
      if (e.key === 'Escape') onCancel();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, onCancel]);

  if (!open) return null;
  return (
    <div role="dialog" aria-modal className="fixed inset-0 z-50 grid place-items-center bg-black/50 p-4">
      <div className="card max-w-sm w-full">
        <h3 className="text-lg font-semibold">{title}</h3>
        {message && <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">{message}</p>}
        <div className="mt-4 flex justify-end gap-2">
          <button
            className="btn bg-slate-200 text-slate-900 hover:bg-slate-300 dark:bg-slate-800 dark:text-slate-100"
            onClick={onCancel}
          >
            Cancel
          </button>
          <button className="btn" onClick={onConfirm}>
            Confirm
          </button>
        </div>
      </div>
    </div>
  );
}