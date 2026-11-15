import React, { useState } from 'react';
import { X, Calendar, MessageSquare, ShieldAlert, ArrowRight, Loader2, Info } from 'lucide-react';
import api from '../services/api';
import toast from 'react-hot-toast';
import { formatCurrency, calculateDays } from '../utils/formatters';

const BorrowRequestModal = ({ item, isOpen, onClose, onSuccess }) => {
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [message, setMessage] = useState('');
  const [submitting, setSubmitting] = useState(false);

  if (!isOpen || !item) return null;

  // Format today's date for date input min attribute
  const today = new Date().toISOString().split('T')[0];

  const totalDays = startDate && endDate ? calculateDays(startDate, endDate) : 0;
  const estimatedTotal = totalDays * (item.pricePerDay || 0);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!startDate || !endDate) {
      toast.error('Please select both borrow start and return dates');
      return;
    }

    if (new Date(endDate) < new Date(startDate)) {
      toast.error('Return date cannot be earlier than start date');
      return;
    }

    setSubmitting(true);
    try {
      const res = await api.post('/requests', {
        itemId: item._id,
        startDate,
        endDate,
        message,
      });

      if (res.data.success) {
        toast.success('Borrow request sent to owner!');
        onClose();
        if (onSuccess) onSuccess(res.data.request);
      }
    } catch (error) {
      const errMsg =
        error.response?.data?.message || 'Failed to submit borrow request';
      toast.error(errMsg);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div
        onClick={(e) => e.stopPropagation()}
        className="bg-white rounded-3xl shadow-2xl border border-slate-200/80 w-full max-w-lg overflow-hidden animate-in zoom-in-95 duration-200"
      >
        {/* Modal Header */}
        <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
          <div>
            <h3 className="text-lg font-bold text-slate-900">
              Request to Borrow Item
            </h3>
            <p className="text-xs text-slate-500 truncate max-w-sm">
              {item.title}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-full transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {/* Item Quick Overview */}
          <div className="flex items-center gap-3.5 p-3 rounded-2xl bg-slate-50 border border-slate-200/60">
            <img
              src={item.images?.[0] || 'https://images.unsplash.com/photo-1581291518857-4e27b48ff24e?auto=format&fit=crop&w=200&q=80'}
              alt={item.title}
              className="w-14 h-14 rounded-xl object-cover border"
            />
            <div className="flex-1 min-w-0">
              <h4 className="text-sm font-semibold text-slate-900 truncate">
                {item.title}
              </h4>
              <p className="text-xs text-slate-500">
                Owner: {item.owner?.name} • {item.city}
              </p>
              <p className="text-xs font-bold text-emerald-600 mt-0.5">
                {item.pricePerDay === 0 ? 'Free to Borrow' : `${formatCurrency(item.pricePerDay)} / day`}
              </p>
            </div>
          </div>

          {/* Date Picker Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                Start Date
              </label>
              <div className="relative">
                <input
                  type="date"
                  min={today}
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  required
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 text-slate-800"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                Return Date
              </label>
              <div className="relative">
                <input
                  type="date"
                  min={startDate || today}
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  required
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 text-slate-800"
                />
              </div>
            </div>
          </div>

          {/* Pricing Estimation Pill */}
          {startDate && endDate && (
            <div className="p-4 rounded-2xl bg-emerald-50/70 border border-emerald-200/60 text-xs text-emerald-950 space-y-1.5">
              <div className="flex justify-between font-medium">
                <span>Borrow Duration:</span>
                <span className="font-bold">{totalDays} {totalDays === 1 ? 'day' : 'days'}</span>
              </div>
              <div className="flex justify-between font-medium">
                <span>Estimated Borrow Fee:</span>
                <span className="font-bold">
                  {item.pricePerDay === 0 ? 'Free (₹0)' : formatCurrency(estimatedTotal)}
                </span>
              </div>
              {item.securityDeposit > 0 && (
                <div className="flex justify-between text-slate-600 pt-1 border-t border-emerald-200/60">
                  <span className="flex items-center gap-1">
                    <Info className="w-3.5 h-3.5 text-slate-500" />
                    Refundable Security Deposit:
                  </span>
                  <span className="font-semibold">{formatCurrency(item.securityDeposit)}</span>
                </div>
              )}
            </div>
          )}

          {/* Note to Owner */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
              Message to Owner (Optional)
            </label>
            <textarea
              rows={3}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="e.g., Hi, I need this for my university event this weekend. I will return it cleanly on Sunday evening."
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 text-slate-800 resize-none"
            />
          </div>

          {/* Borrowing Rules Reminder */}
          {item.borrowingRules && (
            <div className="p-3 rounded-xl bg-amber-50/80 border border-amber-200/60 flex items-start gap-2.5 text-xs text-amber-900">
              <ShieldAlert className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
              <div>
                <span className="font-bold">Owner's Borrowing Terms: </span>
                <span>{item.borrowingRules}</span>
              </div>
            </div>
          )}

          {/* Action buttons */}
          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              disabled={submitting}
              className="px-4 py-2.5 rounded-xl border border-slate-200 text-sm font-medium text-slate-600 hover:bg-slate-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white text-sm font-semibold shadow-md shadow-emerald-600/20 transition-all active:scale-95"
            >
              {submitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Submitting...</span>
                </>
              ) : (
                <>
                  <span>Submit Request</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default BorrowRequestModal;
