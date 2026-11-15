import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  MapPin,
  Star,
  ShieldCheck,
  Calendar,
  AlertCircle,
  Clock,
  ArrowLeft,
  Share2,
  Edit,
  Trash2,
  CheckCircle,
  HelpCircle,
  User,
  Sparkles,
} from 'lucide-react';
import api from '../services/api';
import { useAuth } from '../hooks/useAuth';
import LoadingSpinner from '../components/LoadingSpinner';
import BorrowRequestModal from '../components/BorrowRequestModal';
import BorrowingPassportModal from '../components/BorrowingPassportModal';
import ConfirmModal from '../components/ConfirmModal';
import toast from 'react-hot-toast';
import { formatCurrency, formatDate } from '../utils/formatters';

const ItemDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();

  const [item, setItem] = useState(null);
  const [activeTransaction, setActiveTransaction] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeImageIndex, setActiveImageIndex] = useState(0);

  // Modals
  const [isRequestModalOpen, setIsRequestModalOpen] = useState(false);
  const [isPassportModalOpen, setIsPassportModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    fetchItemDetails();
  }, [id]);

  const fetchItemDetails = async () => {
    setLoading(true);
    try {
      const res = await api.get(`/items/${id}`);
      if (res.data.success) {
        setItem(res.data.item);
        setActiveTransaction(res.data.activeTransaction);
      }
    } catch (error) {
      console.error('Failed to load item:', error);
      toast.error('Item not found or unavailable');
      navigate('/explore');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteItem = async () => {
    setDeleting(true);
    try {
      const res = await api.delete(`/items/${id}`);
      if (res.data.success) {
        toast.success('Item deleted successfully');
        navigate('/dashboard');
      }
    } catch (error) {
      const msg = error.response?.data?.message || 'Failed to delete item';
      toast.error(msg);
    } finally {
      setDeleting(false);
      setIsDeleteModalOpen(false);
    }
  };

  if (loading) {
    return <LoadingSpinner text="Retrieving item details and passport records..." />;
  }

  if (!item) return null;

  const isOwner = user && item.owner && user._id === item.owner._id;
  const isFree = !item.pricePerDay || item.pricePerDay === 0;

  const images = item.images && item.images.length > 0
    ? item.images.map((img) =>
        img.startsWith('/uploads') ? `http://localhost:5000${img}` : img
      )
    : [
        'https://images.unsplash.com/photo-1581291518857-4e27b48ff24e?auto=format&fit=crop&w=800&q=80',
      ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Back button & Breadcrumb */}
      <div className="flex items-center justify-between text-xs font-medium text-slate-500">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-1.5 hover:text-slate-900 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to catalog</span>
        </button>

        <div className="flex items-center gap-2">
          <span>Explore</span>
          <span>/</span>
          <span>{item.category}</span>
          <span>/</span>
          <span className="text-slate-800 font-bold truncate max-w-xs">{item.title}</span>
        </div>
      </div>

      {/* Main Grid: Images & Summary (Left) + Pricing/Actions Card (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Column (8 cols): Media Gallery & Details */}
        <div className="lg:col-span-8 space-y-8">
          
          {/* Image Gallery */}
          <div className="space-y-3">
            <div className="relative aspect-[16/10] sm:aspect-[16/9] w-full rounded-3xl overflow-hidden bg-slate-900 border border-slate-200 shadow-md">
              <img
                src={images[activeImageIndex]}
                alt={item.title}
                className="w-full h-full object-cover"
              />

              {/* Status and Badge Overlays */}
              <div className="absolute top-4 left-4 flex flex-wrap gap-2">
                <span className="px-3 py-1.5 rounded-full text-xs font-bold bg-white/95 backdrop-blur text-slate-900 shadow">
                  {item.category}
                </span>
                <span className="px-3 py-1.5 rounded-full text-xs font-semibold bg-slate-900/90 backdrop-blur text-white shadow">
                  Condition: {item.condition}
                </span>
              </div>

              {/* Availability Tag */}
              <div className="absolute top-4 right-4">
                {item.isAvailable ? (
                  <span className="px-3 py-1.5 rounded-full text-xs font-bold bg-emerald-500 text-white shadow-md shadow-emerald-500/30 flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-white animate-pulse" />
                    Available Now
                  </span>
                ) : (
                  <span className="px-3 py-1.5 rounded-full text-xs font-semibold bg-slate-800/95 backdrop-blur text-slate-300">
                    Currently Borrowed
                  </span>
                )}
              </div>
            </div>

            {/* Thumbnail selector if multiple images */}
            {images.length > 1 && (
              <div className="flex items-center gap-3 overflow-x-auto pb-2">
                {images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveImageIndex(idx)}
                    className={`relative w-20 h-16 rounded-xl overflow-hidden border-2 shrink-0 transition-all ${
                      activeImageIndex === idx
                        ? 'border-emerald-600 scale-105 shadow'
                        : 'border-transparent opacity-70 hover:opacity-100'
                    }`}
                  >
                    <img src={img} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Title and Meta */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-xs font-semibold text-slate-500">
              <MapPin className="w-4 h-4 text-emerald-600" />
              <span>
                {item.locality ? `${item.locality}, ` : ''}{item.city} (India)
              </span>
              <span>•</span>
              <span>Listed {formatDate(item.createdAt)}</span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight leading-snug">
              {item.title}
            </h1>
          </div>

          {/* Item Description */}
          <div className="p-6 rounded-3xl bg-white border border-slate-200/80 shadow-sm space-y-3">
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-900">
              Item Description
            </h3>
            <p className="text-sm text-slate-600 leading-relaxed whitespace-pre-line">
              {item.description}
            </p>
          </div>

          {/* Borrowing Rules & Guidelines */}
          <div className="p-6 rounded-3xl bg-amber-50/60 border border-amber-200/80 space-y-2">
            <div className="flex items-center gap-2 text-amber-900 font-bold text-sm">
              <ShieldCheck className="w-5 h-5 text-amber-600" />
              <span>Owner's Borrowing Guidelines & Rules</span>
            </div>
            <p className="text-xs text-amber-900 leading-relaxed pl-7">
              {item.borrowingRules || 'Please handle this item with respect and return it in clean, original condition.'}
            </p>
          </div>

          {/* Owner Information Card */}
          {item.owner && (
            <div className="p-6 rounded-3xl bg-white border border-slate-200/80 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <img
                  src={item.owner.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80'}
                  alt={item.owner.name}
                  className="w-16 h-16 rounded-2xl object-cover border border-slate-100 shadow-sm"
                />
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-extrabold text-slate-900 text-base">
                      {item.owner.name}
                    </h3>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                      Verified Owner
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-slate-500 mt-1">
                    <span className="flex items-center text-amber-500 font-bold">
                      <Star className="w-3.5 h-3.5 fill-amber-400 mr-1" />
                      {item.owner.rating || '5.0'}
                    </span>
                    <span>•</span>
                    <span>{item.owner.city}</span>
                    <span>•</span>
                    <span>Member since {formatDate(item.owner.createdAt)}</span>
                  </div>
                  {item.owner.bio && (
                    <p className="text-xs text-slate-500 mt-2 line-clamp-2 italic">
                      "{item.owner.bio}"
                    </p>
                  )}
                </div>
              </div>

              <Link
                to={`/users/${item.owner._id}`}
                className="px-4 py-2 rounded-xl border border-slate-200 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors shrink-0"
              >
                View Profile
              </Link>
            </div>
          )}
        </div>

        {/* Right Column (4 cols): Sticky Action & Pricing Card */}
        <div className="lg:col-span-4 sticky top-24 space-y-4">
          
          <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-xl space-y-6">
            
            {/* Price Header */}
            <div className="pb-4 border-b border-slate-100">
              <span className="text-xs uppercase font-bold tracking-wider text-slate-400 block">
                Borrow Rate
              </span>
              <div className="flex items-baseline gap-2 mt-1">
                {isFree ? (
                  <span className="text-3xl font-black text-emerald-600">
                    Free
                  </span>
                ) : (
                  <>
                    <span className="text-3xl font-black text-slate-900">
                      {formatCurrency(item.pricePerDay)}
                    </span>
                    <span className="text-sm font-medium text-slate-500">
                      / day
                    </span>
                  </>
                )}
              </div>

              {item.securityDeposit > 0 && (
                <p className="text-xs text-slate-500 mt-2 flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span>
                    Refundable security deposit: <strong>{formatCurrency(item.securityDeposit)}</strong>
                  </span>
                </p>
              )}
            </div>

            {/* Quick Passport Widget */}
            <div className="p-4 rounded-2xl bg-gradient-to-br from-slate-900 to-navy-900 text-white space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-400 flex items-center gap-1">
                  <ShieldCheck className="w-4 h-4" />
                  Borrowing Passport
                </span>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-500/20 text-emerald-300">
                  VERIFIED
                </span>
              </div>

              <div className="grid grid-cols-2 gap-2 text-center text-xs">
                <div className="p-2 rounded-xl bg-white/10">
                  <span className="text-[10px] text-slate-300 block">Borrows</span>
                  <span className="text-base font-extrabold text-white">
                    {item.totalBorrows} times
                  </span>
                </div>
                <div className="p-2 rounded-xl bg-white/10">
                  <span className="text-[10px] text-slate-300 block">Damages</span>
                  <span className="text-base font-extrabold text-emerald-400">
                    {item.damageReportsCount === 0 ? '0 (Clean)' : item.damageReportsCount}
                  </span>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setIsPassportModalOpen(true)}
                className="w-full py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs shadow-md transition-all active:scale-95 text-center block"
              >
                Inspect Item Passport
              </button>
            </div>

            {/* Request or Owner Actions */}
            <div className="space-y-3">
              {isOwner ? (
                <div className="space-y-2">
                  <div className="p-3 rounded-2xl bg-slate-100 text-center text-xs font-semibold text-slate-700">
                    You are the owner of this item
                  </div>
                  <div className="flex items-center gap-2">
                    <Link
                      to={`/items/edit/${item._id}`}
                      className="flex-1 flex items-center justify-center gap-1.5 py-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold transition-all"
                    >
                      <Edit className="w-3.5 h-3.5" />
                      <span>Edit Item</span>
                    </Link>
                    <button
                      onClick={() => setIsDeleteModalOpen(true)}
                      className="p-3 rounded-xl border border-rose-200 text-rose-600 hover:bg-rose-50 transition-colors"
                      title="Delete item"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ) : isAuthenticated ? (
                <button
                  type="button"
                  onClick={() => setIsRequestModalOpen(true)}
                  className="w-full py-3.5 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm shadow-lg shadow-emerald-600/25 transition-all active:scale-95"
                >
                  Request to Borrow
                </button>
              ) : (
                <div className="space-y-2">
                  <Link
                    to="/login"
                    className="w-full py-3.5 rounded-2xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-sm shadow-md transition-all block text-center"
                  >
                    Sign In to Borrow
                  </Link>
                  <p className="text-[11px] text-center text-slate-500">
                    Registration is free for college & neighborhood members
                  </p>
                </div>
              )}
            </div>

            {/* Community Guarantee Pledge */}
            <div className="text-[11px] text-slate-500 space-y-1.5 pt-2 border-t border-slate-100">
              <div className="flex items-center gap-1.5 text-slate-700 font-semibold">
                <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />
                <span>Protected by BorrowBuddy Trust Framework</span>
              </div>
              <p>
                Requests are subject to owner approval. Handover and returns are verified directly between members.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Borrow Request Modal */}
      <BorrowRequestModal
        item={item}
        isOpen={isRequestModalOpen}
        onClose={() => setIsRequestModalOpen(false)}
        onSuccess={() => {
          setIsRequestModalOpen(false);
          navigate('/dashboard');
        }}
      />

      {/* Borrowing Passport Modal */}
      <BorrowingPassportModal
        itemId={item._id}
        isOpen={isPassportModalOpen}
        onClose={() => setIsPassportModalOpen(false)}
      />

      {/* Delete Item Confirmation Modal */}
      <ConfirmModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleDeleteItem}
        title="Delete Item Listing"
        message="Are you sure you want to remove this item from BorrowBuddy? This cannot be undone."
        confirmText="Delete Listing"
        type="danger"
        isLoading={deleting}
      />
    </div>
  );
};

export default ItemDetails;
