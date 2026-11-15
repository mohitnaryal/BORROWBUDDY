import React, { useState, useEffect } from 'react';
import {
  X,
  ShieldCheck,
  Award,
  Calendar,
  CheckCircle,
  AlertTriangle,
  Clock,
  Sparkles,
  MapPin,
  Star,
  UserCheck,
} from 'lucide-react';
import api from '../services/api';
import LoadingSpinner from './LoadingSpinner';
import { formatDate } from '../utils/formatters';

const BorrowingPassportModal = ({ itemId, isOpen, onClose }) => {
  const [loading, setLoading] = useState(true);
  const [passportData, setPassportData] = useState(null);

  useEffect(() => {
    if (isOpen && itemId) {
      fetchPassport();
    }
  }, [isOpen, itemId]);

  const fetchPassport = async () => {
    setLoading(true);
    try {
      const res = await api.get(`/items/${itemId}/passport`);
      if (res.data.success) {
        setPassportData(res.data.passport);
      }
    } catch (error) {
      console.error('Failed to load item passport:', error);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/70 backdrop-blur-md animate-in fade-in duration-200">
      <div
        onClick={(e) => e.stopPropagation()}
        className="bg-white rounded-3xl shadow-2xl border border-slate-200 w-full max-w-2xl max-h-[90vh] flex flex-col overflow-hidden animate-in zoom-in-95 duration-200"
      >
        {/* Passport Header: Digital Certificate Style */}
        <div className="bg-gradient-to-r from-slate-900 via-navy-900 to-slate-900 text-white p-6 relative overflow-hidden shrink-0">
          {/* Subtle background glow */}
          <div className="absolute top-0 right-0 -mt-8 -mr-8 w-44 h-44 bg-emerald-500/20 rounded-full blur-3xl pointer-events-none" />

          <div className="flex items-start justify-between relative z-10">
            <div className="flex items-center gap-3.5">
              <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 border border-emerald-400/40 flex items-center justify-center text-emerald-400 shadow-inner">
                <ShieldCheck className="w-7 h-7" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono font-bold tracking-widest text-emerald-400 uppercase">
                    Official Passport
                  </span>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                    VERIFIED LEDGER
                  </span>
                </div>
                <h2 className="text-xl font-extrabold text-white tracking-tight mt-0.5">
                  Borrowing Passport
                </h2>
                <p className="text-xs text-slate-400">
                  Cryptographically immutable history & trust record
                </p>
              </div>
            </div>

            <button
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-full transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Scrollable Body */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1">
          {loading ? (
            <LoadingSpinner text="Querying Borrowing Passport ledger..." />
          ) : passportData ? (
            <>
              {/* Item Provenance Card */}
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="flex items-center gap-3.5">
                  <img
                    src={passportData.item.images?.[0] || 'https://images.unsplash.com/photo-1581291518857-4e27b48ff24e?auto=format&fit=crop&w=200&q=80'}
                    alt={passportData.item.title}
                    className="w-14 h-14 rounded-xl object-cover border"
                  />
                  <div>
                    <h3 className="font-bold text-slate-900 text-sm">
                      {passportData.item.title}
                    </h3>
                    <div className="flex items-center gap-2 text-xs text-slate-500 mt-1">
                      <span>{passportData.item.category}</span>
                      <span>•</span>
                      <span>Initial Condition: <strong className="text-slate-700">{passportData.item.condition}</strong></span>
                    </div>
                  </div>
                </div>

                <div className="text-left sm:text-right text-xs text-slate-500">
                  <div className="font-semibold text-slate-800">
                    Listed: {formatDate(passportData.item.listedDate)}
                  </div>
                  <div>Hub: {passportData.item.city}</div>
                </div>
              </div>

              {/* Trust Metric KPI Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="p-3.5 rounded-2xl bg-white border border-slate-200 shadow-sm text-center">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                    Total Borrows
                  </span>
                  <p className="text-2xl font-black text-slate-900 mt-0.5">
                    {passportData.metrics.totalBorrows}
                  </p>
                  <span className="text-[11px] text-emerald-600 font-semibold flex items-center justify-center gap-0.5 mt-1">
                    <CheckCircle className="w-3 h-3" />
                    Completed
                  </span>
                </div>

                <div className="p-3.5 rounded-2xl bg-white border border-slate-200 shadow-sm text-center">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                    On-Time Rate
                  </span>
                  <p className="text-2xl font-black text-emerald-600 mt-0.5">
                    {passportData.metrics.onTimeRate}%
                  </p>
                  <span className="text-[11px] text-slate-500 font-medium mt-1 block">
                    Punctual returns
                  </span>
                </div>

                <div className="p-3.5 rounded-2xl bg-white border border-slate-200 shadow-sm text-center">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                    Damages
                  </span>
                  <p className="text-2xl font-black text-slate-900 mt-0.5">
                    {passportData.metrics.damageReportsCount}
                  </p>
                  <span className="text-[11px] text-emerald-600 font-semibold mt-1 block">
                    {passportData.metrics.damageReportsCount === 0 ? 'Clean Record' : 'Reported'}
                  </span>
                </div>

                <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 shadow-sm text-center">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-700">
                    Trust Score
                  </span>
                  <p className="text-2xl font-black text-emerald-800 mt-0.5">
                    {passportData.metrics.trustScore}/100
                  </p>
                  <span className="text-[11px] font-bold text-emerald-600 flex items-center justify-center gap-0.5 mt-1">
                    <Award className="w-3 h-3" />
                    {passportData.metrics.verificationSeal}
                  </span>
                </div>
              </div>

              {/* Damage Incident Log */}
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2.5 flex items-center gap-1.5">
                  <AlertTriangle className="w-3.5 h-3.5 text-amber-500" />
                  Incident & Damage Audit
                </h4>
                {passportData.damageRecords.length === 0 ? (
                  <div className="p-3.5 rounded-2xl bg-emerald-50/60 border border-emerald-200/80 flex items-center gap-2.5 text-xs text-emerald-800">
                    <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span className="font-medium">
                      Zero reported damages. Every borrower returned this item in good, intact working condition.
                    </span>
                  </div>
                ) : (
                  <div className="space-y-2">
                    {passportData.damageRecords.map((inc, i) => (
                      <div
                        key={i}
                        className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-900 space-y-1"
                      >
                        <div className="flex justify-between font-semibold">
                          <span>Incident on {formatDate(inc.date)}</span>
                          <span>Borrower: {inc.borrowerName}</span>
                        </div>
                        <p>{inc.notes}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Verified Borrowing History Timeline */}
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3 flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-slate-500" />
                  Verified Borrowing Timeline
                </h4>

                {passportData.history.length === 0 ? (
                  <p className="text-xs text-slate-400 italic p-3 bg-slate-50 rounded-xl">
                    No borrowing transactions completed yet. Be the first neighbor to borrow this item!
                  </p>
                ) : (
                  <div className="space-y-3 relative before:absolute before:inset-0 before:left-3.5 before:w-0.5 before:bg-slate-200">
                    {passportData.history.map((tx, idx) => (
                      <div
                        key={idx}
                        className="relative pl-8 flex items-start justify-between text-xs group"
                      >
                        {/* Dot indicator */}
                        <div className="absolute left-2 top-1.5 w-3 h-3 rounded-full bg-emerald-500 ring-4 ring-white" />

                        <div className="flex-1 min-w-0 pr-4">
                          <p className="font-semibold text-slate-800">
                            Borrowed by {tx.borrowerName}
                            {tx.borrowerCity && (
                              <span className="text-slate-400 font-normal"> ({tx.borrowerCity})</span>
                            )}
                          </p>
                          <p className="text-slate-500 text-[11px] mt-0.5">
                            Duration: {tx.durationDays} days • Returned: {formatDate(tx.returnDate)}
                          </p>
                        </div>

                        <div className="shrink-0">
                          {tx.onTime ? (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-medium bg-emerald-50 text-emerald-700 border border-emerald-200">
                              <CheckCircle className="w-3 h-3" />
                              On-Time
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-medium bg-amber-50 text-amber-700 border border-amber-200">
                              Delayed
                            </span>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Verified Reviews Section */}
              {passportData.reviews && passportData.reviews.length > 0 && (
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3 flex items-center gap-1.5">
                    <Star className="w-3.5 h-3.5 text-amber-500" />
                    Verified Borrower Reviews
                  </h4>
                  <div className="space-y-3">
                    {passportData.reviews.map((rev, idx) => (
                      <div
                        key={idx}
                        className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80 text-xs space-y-1.5"
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <img
                              src={rev.reviewer?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=60&q=80'}
                              alt={rev.reviewer?.name}
                              className="w-5 h-5 rounded-full object-cover"
                            />
                            <span className="font-semibold text-slate-800">
                              {rev.reviewer?.name}
                            </span>
                          </div>
                          <div className="flex items-center text-amber-500 font-bold">
                            {'★'.repeat(rev.rating)}
                          </div>
                        </div>
                        <p className="text-slate-600 italic">"{rev.comment}"</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </>
          ) : (
            <p className="text-center text-slate-500 text-sm py-8">
              Unable to load passport data.
            </p>
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500 shrink-0">
          <span className="flex items-center gap-1 font-mono">
            <UserCheck className="w-3.5 h-3.5 text-emerald-600" />
            Protected by BorrowBuddy Trust Framework
          </span>
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-slate-900 text-white font-semibold text-xs hover:bg-slate-800 transition-colors"
          >
            Close Passport
          </button>
        </div>
      </div>
    </div>
  );
};

export default BorrowingPassportModal;
