import React, { useState } from 'react';
import { X, AlertTriangle, CheckCircle, Loader2 } from 'lucide-react';

const ConfirmModal = ({
  isOpen,
  onClose,
  onConfirm,
  title = 'Are you sure?',
  message = 'This action cannot be undone.',
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  type = 'danger', // 'danger' | 'success' | 'info'
  isLoading = false,
  showDamageInputs = false, // for item return confirmation
}) => {
  const [damageReported, setDamageReported] = useState(false);
  const [damageNotes, setDamageNotes] = useState('');

  if (!isOpen) return null;

  const handleConfirm = () => {
    if (showDamageInputs) {
      onConfirm({ damageReported, damageNotes });
    } else {
      onConfirm();
    }
  };

  const getButtonColor = () => {
    switch (type) {
      case 'danger':
        return 'bg-rose-600 hover:bg-rose-700 text-white';
      case 'success':
        return 'bg-emerald-600 hover:bg-emerald-700 text-white';
      case 'info':
      default:
        return 'bg-slate-900 hover:bg-slate-800 text-white';
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div
        onClick={(e) => e.stopPropagation()}
        className="bg-white rounded-3xl shadow-2xl border border-slate-200 w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-200"
      >
        <div className="p-6">
          <div className="flex items-start gap-4">
            <div
              className={`w-10 h-10 rounded-2xl flex items-center justify-center shrink-0 ${
                type === 'danger'
                  ? 'bg-rose-100 text-rose-600'
                  : 'bg-emerald-100 text-emerald-600'
              }`}
            >
              {type === 'danger' ? (
                <AlertTriangle className="w-5 h-5" />
              ) : (
                <CheckCircle className="w-5 h-5" />
              )}
            </div>

            <div className="flex-1">
              <h3 className="text-base font-bold text-slate-900">{title}</h3>
              <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                {message}
              </p>

              {/* Damage inputs for Return confirmation */}
              {showDamageInputs && (
                <div className="mt-4 pt-3 border-t border-slate-100 space-y-3">
                  <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-slate-700">
                    <input
                      type="checkbox"
                      checked={damageReported}
                      onChange={(e) => setDamageReported(e.target.checked)}
                      className="rounded border-slate-300 text-rose-600 focus:ring-rose-500"
                    />
                    <span>Report damage or missing parts on this return</span>
                  </label>

                  {damageReported && (
                    <textarea
                      rows={2}
                      value={damageNotes}
                      onChange={(e) => setDamageNotes(e.target.value)}
                      placeholder="Specify the condition issues or missing accessories..."
                      className="w-full px-3 py-2 text-xs rounded-xl border border-rose-200 bg-rose-50/50 focus:ring-1 focus:ring-rose-500 outline-none"
                    />
                  )}
                </div>
              )}
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 mt-6 pt-2">
            <button
              type="button"
              disabled={isLoading}
              onClick={onClose}
              className="px-4 py-2 rounded-xl border border-slate-200 text-xs font-semibold text-slate-600 hover:bg-slate-50 transition-colors"
            >
              {cancelText}
            </button>
            <button
              type="button"
              disabled={isLoading}
              onClick={handleConfirm}
              className={`flex items-center gap-2 px-5 py-2 rounded-xl text-xs font-semibold shadow-sm transition-all ${getButtonColor()}`}
            >
              {isLoading && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
              <span>{confirmText}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConfirmModal;
