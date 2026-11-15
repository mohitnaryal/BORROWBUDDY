import React from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Star, ShieldCheck, ArrowRight } from 'lucide-react';
import { formatCurrency } from '../utils/formatters';

const ItemCard = ({ item, onOpenPassport }) => {
  const imageUrl =
    item.images && item.images.length > 0
      ? item.images[0].startsWith('/uploads')
        ? `http://localhost:5000${item.images[0]}`
        : item.images[0]
      : 'https://images.unsplash.com/photo-1581291518857-4e27b48ff24e?auto=format&fit=crop&w=600&q=80';

  const isFree = !item.pricePerDay || item.pricePerDay === 0;

  return (
    <div className="group bg-white rounded-2xl border border-slate-200/90 overflow-hidden shadow-sm hover:shadow-xl hover:border-slate-300 transition-all duration-300 flex flex-col h-full">
      {/* Image Container */}
      <div className="relative aspect-[4/3] w-full overflow-hidden bg-slate-100">
        <img
          src={imageUrl}
          alt={item.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />

        {/* Category Pill */}
        <div className="absolute top-3 left-3 flex flex-wrap gap-1.5">
          <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-white/90 backdrop-blur-md text-slate-800 shadow-sm">
            {item.category}
          </span>
          <span className="px-2 py-0.5 rounded-full text-[11px] font-medium bg-slate-900/80 backdrop-blur-md text-slate-100 shadow-sm">
            {item.condition}
          </span>
        </div>

        {/* Availability Badge */}
        <div className="absolute top-3 right-3">
          {item.isAvailable ? (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-500 text-white shadow-sm shadow-emerald-500/30">
              <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
              Available
            </span>
          ) : (
            <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-slate-800/90 backdrop-blur text-slate-300">
              Borrowed
            </span>
          )}
        </div>

        {/* Passport quick badge */}
        {item.totalBorrows > 0 && (
          <button
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              if (onOpenPassport) onOpenPassport(item);
            }}
            title="Verified Borrowing Passport Available"
            className="absolute bottom-2.5 right-2.5 flex items-center gap-1 px-2 py-1 rounded-lg bg-slate-900/80 hover:bg-slate-900 backdrop-blur-md text-[11px] font-semibold text-emerald-400 border border-emerald-500/30 shadow transition-colors"
          >
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            <span>Passport ({item.totalBorrows})</span>
          </button>
        )}
      </div>

      {/* Content */}
      <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between">
        <div>
          {/* Location */}
          <div className="flex items-center gap-1.5 text-xs font-medium text-slate-500 mb-1.5">
            <MapPin className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
            <span className="truncate">
              {item.locality ? `${item.locality}, ` : ''}{item.city}
            </span>
          </div>

          {/* Title */}
          <h3 className="font-bold text-slate-900 text-base leading-snug line-clamp-2 group-hover:text-emerald-700 transition-colors mb-2">
            {item.title}
          </h3>

          {/* Owner info */}
          {item.owner && (
            <div className="flex items-center justify-between text-xs text-slate-600 pt-2 border-t border-slate-100">
              <div className="flex items-center gap-2 min-w-0">
                <img
                  src={item.owner.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=60&q=80'}
                  alt={item.owner.name}
                  className="w-5 h-5 rounded-full object-cover shrink-0"
                />
                <span className="truncate font-medium">{item.owner.name}</span>
              </div>
              <div className="flex items-center text-amber-500 font-semibold shrink-0">
                <Star className="w-3.5 h-3.5 fill-amber-400 mr-0.5" />
                <span>{item.owner.rating || '5.0'}</span>
              </div>
            </div>
          )}
        </div>

        {/* Bottom Bar: Price & CTA */}
        <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
          <div>
            <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400 block">
              Borrow Rate
            </span>
            <div className="flex items-baseline gap-1">
              {isFree ? (
                <span className="text-base font-extrabold text-emerald-600">
                  Free
                </span>
              ) : (
                <>
                  <span className="text-lg font-black text-slate-900">
                    {formatCurrency(item.pricePerDay)}
                  </span>
                  <span className="text-xs text-slate-500 font-medium">/ day</span>
                </>
              )}
            </div>
          </div>

          <Link
            to={`/items/${item._id}`}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-emerald-600 text-white text-xs font-semibold shadow-sm transition-all duration-200 group-hover:bg-emerald-600 active:scale-95"
          >
            <span>Details</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ItemCard;
