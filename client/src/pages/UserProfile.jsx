import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  MapPin,
  Star,
  Package,
  MessageSquare,
  Calendar,
  ShieldCheck,
  ArrowLeft,
  Sparkles,
} from 'lucide-react';
import api from '../services/api';
import ItemCard from '../components/ItemCard';
import LoadingSpinner from '../components/LoadingSpinner';
import BorrowingPassportModal from '../components/BorrowingPassportModal';
import { formatDate } from '../utils/formatters';

const UserProfile = () => {
  const { id } = useParams();
  const [userProfile, setUserProfile] = useState(null);
  const [items, setItems] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('items'); // 'items' | 'reviews'
  const [passportItem, setPassportItem] = useState(null);

  useEffect(() => {
    fetchProfile();
  }, [id]);

  const fetchProfile = async () => {
    setLoading(true);
    try {
      const res = await api.get(`/users/${id}`);
      if (res.data.success) {
        setUserProfile(res.data.user);
        setItems(res.data.items);
        setReviews(res.data.reviews);
      }
    } catch (error) {
      console.error('Failed to load user profile:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <LoadingSpinner text="Retrieving member profile..." />;
  }

  if (!userProfile) {
    return (
      <div className="text-center py-20">
        <p className="text-slate-500 text-sm">User profile not found.</p>
        <Link to="/explore" className="text-emerald-600 text-xs font-bold mt-2 block">
          Return to Explore
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Back link */}
      <Link
        to="/explore"
        className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-900 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Back to community catalog</span>
      </Link>

      {/* Member Hero Banner */}
      <div className="p-6 sm:p-8 rounded-3xl bg-white border border-slate-200 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="flex items-start sm:items-center gap-4">
          <img
            src={userProfile.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80'}
            alt={userProfile.name}
            className="w-20 h-20 rounded-2xl object-cover border border-slate-100 shadow-md"
          />
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-black text-slate-900 tracking-tight">
                {userProfile.name}
              </h1>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                Verified Member
              </span>
            </div>

            <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500">
              <span className="flex items-center text-amber-500 font-bold">
                <Star className="w-3.5 h-3.5 fill-amber-400 mr-1" />
                {userProfile.rating || '5.0'} ({userProfile.totalReviews || 0} reviews)
              </span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <MapPin className="w-3 h-3 text-emerald-600" />
                {userProfile.locality ? `${userProfile.locality}, ` : ''}{userProfile.city}
              </span>
              <span>•</span>
              <span>Member since {formatDate(userProfile.createdAt)}</span>
            </div>

            {userProfile.bio && (
              <p className="text-xs text-slate-600 pt-1 max-w-xl">
                "{userProfile.bio}"
              </p>
            )}
          </div>
        </div>

        {/* Member Trust Badge */}
        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-900 space-y-1 self-stretch md:self-auto text-center md:text-left">
          <div className="flex items-center justify-center md:justify-start gap-1.5 font-bold text-emerald-800">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>Community Trusted</span>
          </div>
          <p className="text-[11px] text-emerald-700">
            {items.length} items listed • Verified ID & mobile
          </p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-3 border-b border-slate-200 pb-2">
        <button
          onClick={() => setActiveTab('items')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            activeTab === 'items'
              ? 'bg-slate-900 text-white shadow-sm'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <Package className="w-4 h-4" />
          <span>Listed Items ({items.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('reviews')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            activeTab === 'reviews'
              ? 'bg-slate-900 text-white shadow-sm'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <MessageSquare className="w-4 h-4" />
          <span>Community Reviews ({reviews.length})</span>
        </button>
      </div>

      {/* Tab 1: Listed Items */}
      {activeTab === 'items' && (
        <div>
          {items.length === 0 ? (
            <p className="text-xs text-slate-500 py-10 text-center">
              This user does not currently have any active listed items.
            </p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {items.map((item) => (
                <ItemCard
                  key={item._id}
                  item={item}
                  onOpenPassport={(it) => setPassportItem(it)}
                />
              ))}
            </div>
          )}
        </div>
      )}

      {/* Tab 2: Community Reviews */}
      {activeTab === 'reviews' && (
        <div className="space-y-4 max-w-3xl">
          {reviews.length === 0 ? (
            <p className="text-xs text-slate-500 py-10 text-center">
              No reviews written for this user yet.
            </p>
          ) : (
            <div className="space-y-3">
              {reviews.map((rev) => (
                <div
                  key={rev._id}
                  className="p-5 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-2 text-xs"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <img
                        src={rev.reviewer?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=60&q=80'}
                        alt={rev.reviewer?.name}
                        className="w-7 h-7 rounded-full object-cover border"
                      />
                      <div>
                        <span className="font-bold text-slate-900">
                          {rev.reviewer?.name}
                        </span>
                        <span className="text-[11px] text-slate-400 block">
                          Verified transaction for {rev.item?.title}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center text-amber-500 font-bold">
                      {'★'.repeat(rev.rating)}
                    </div>
                  </div>

                  <p className="text-slate-700 italic pt-1">
                    "{rev.comment}"
                  </p>

                  {rev.tags && rev.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {rev.tags.map((t, idx) => (
                        <span
                          key={idx}
                          className="px-2 py-0.5 rounded-lg bg-emerald-50 text-emerald-800 text-[10px] font-semibold border border-emerald-200"
                        >
                          {t}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Passport modal */}
      {passportItem && (
        <BorrowingPassportModal
          itemId={passportItem._id}
          isOpen={!!passportItem}
          onClose={() => setPassportItem(null)}
        />
      )}
    </div>
  );
};

export default UserProfile;
