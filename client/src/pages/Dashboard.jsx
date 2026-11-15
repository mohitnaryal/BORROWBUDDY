import React, { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import {
  LayoutDashboard,
  Package,
  Send,
  Inbox,
  History,
  User,
  PlusCircle,
  Clock,
  CheckCircle,
  XCircle,
  AlertTriangle,
  RotateCcw,
  Sparkles,
  MapPin,
  Star,
  ShieldCheck,
  Edit,
  Trash2,
  Calendar,
  Eye,
  CheckCheck,
  ArrowRight,
  MessageSquare,
  Loader2,
} from 'lucide-react';
import api from '../services/api';
import { useAuth } from '../hooks/useAuth';
import LoadingSpinner from '../components/LoadingSpinner';
import StatusBadge from '../components/StatusBadge';
import ConfirmModal from '../components/ConfirmModal';
import BorrowingPassportModal from '../components/BorrowingPassportModal';
import ReviewModal from '../components/ReviewModal';
import toast from 'react-hot-toast';
import { formatCurrency, formatDate } from '../utils/formatters';

const Dashboard = () => {
  const { user, updateUser } = useAuth();
  const [searchParams, setSearchParams] = useSearchParams();
  const initialTab = searchParams.get('tab') || 'overview';

  const [activeTab, setActiveTab] = useState(initialTab);
  const [loading, setLoading] = useState(true);

  // Data States
  const [dashboardStats, setDashboardStats] = useState({
    totalListedItems: 0,
    activeBorrowRequests: 0,
    currentlyBorrowed: 0,
    pendingReceivedRequests: 0,
    completedTransactions: 0,
  });

  const [myItems, setMyItems] = useState([]);
  const [sentRequests, setSentRequests] = useState([]);
  const [receivedRequests, setReceivedRequests] = useState([]);
  const [transactions, setTransactions] = useState([]);

  // Profile Form State
  const [profileForm, setProfileForm] = useState({
    name: user?.name || '',
    phone: user?.phone || '',
    city: user?.city || '',
    locality: user?.locality || '',
    bio: user?.bio || '',
    avatar: user?.avatar || '',
  });
  const [savingProfile, setSavingProfile] = useState(false);

  // Modals state
  const [passportItemId, setPassportItemId] = useState(null);
  const [reviewTx, setReviewTx] = useState(null);

  // Confirm Modal state
  const [confirmModalConfig, setConfirmModalConfig] = useState({
    isOpen: false,
    title: '',
    message: '',
    confirmText: 'Confirm',
    type: 'danger',
    showDamageInputs: false,
    onConfirm: () => {},
  });

  // Switch tab and sync with URL
  const handleTabChange = (tabId) => {
    setActiveTab(tabId);
    setSearchParams({ tab: tabId });
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      const [statsRes, itemsRes, sentRes, receivedRes, txRes] =
        await Promise.all([
          api.get('/stats/dashboard'),
          api.get('/items/my'),
          api.get('/requests/sent'),
          api.get('/requests/received'),
          api.get('/transactions'),
        ]);

      if (statsRes.data.success) setDashboardStats(statsRes.data.stats);
      if (itemsRes.data.success) setMyItems(itemsRes.data.items);
      if (sentRes.data.success) setSentRequests(sentRes.data.requests);
      if (receivedRes.data.success) setReceivedRequests(receivedRes.data.requests);
      if (txRes.data.success) setTransactions(txRes.data.transactions);
    } catch (error) {
      console.error('Failed to load dashboard data:', error);
      toast.error('Could not refresh all dashboard stats');
    } finally {
      setLoading(false);
    }
  };

  // --- Item Actions ---
  const handleToggleItemAvailability = async (item) => {
    try {
      const res = await api.put(`/items/${item._id}`, {
        isAvailable: !item.isAvailable,
      });
      if (res.data.success) {
        toast.success(
          `Item marked ${!item.isAvailable ? 'Available' : 'Unavailable'}`
        );
        fetchDashboardData();
      }
    } catch (error) {
      toast.error('Failed to update item availability');
    }
  };

  const handleDeleteItem = (itemId) => {
    setConfirmModalConfig({
      isOpen: true,
      title: 'Delete Item',
      message: 'Are you sure you want to permanently delete this listed item?',
      confirmText: 'Delete',
      type: 'danger',
      showDamageInputs: false,
      onConfirm: async () => {
        try {
          const res = await api.delete(`/items/${itemId}`);
          if (res.data.success) {
            toast.success('Item deleted successfully');
            fetchDashboardData();
          }
        } catch (error) {
          toast.error(error.response?.data?.message || 'Failed to delete');
        } finally {
          setConfirmModalConfig((prev) => ({ ...prev, isOpen: false }));
        }
      },
    });
  };

  // --- Request Actions ---
  const handleApproveRequest = (requestId) => {
    setConfirmModalConfig({
      isOpen: true,
      title: 'Approve Borrow Request',
      message: 'Approving this request will create an active transaction agreement and decline overlapping requests.',
      confirmText: 'Approve & Reserve',
      type: 'success',
      showDamageInputs: false,
      onConfirm: async () => {
        try {
          const res = await api.put(`/requests/${requestId}/approve`);
          if (res.data.success) {
            toast.success('Request approved! Transaction created.');
            fetchDashboardData();
          }
        } catch (error) {
          toast.error(error.response?.data?.message || 'Approval failed');
        } finally {
          setConfirmModalConfig((prev) => ({ ...prev, isOpen: false }));
        }
      },
    });
  };

  const handleRejectRequest = (requestId) => {
    setConfirmModalConfig({
      isOpen: true,
      title: 'Decline Borrow Request',
      message: 'Are you sure you want to decline this borrowing request?',
      confirmText: 'Decline Request',
      type: 'danger',
      showDamageInputs: false,
      onConfirm: async () => {
        try {
          const res = await api.put(`/requests/${requestId}/reject`);
          if (res.data.success) {
            toast.success('Request declined');
            fetchDashboardData();
          }
        } catch (error) {
          toast.error(error.response?.data?.message || 'Action failed');
        } finally {
          setConfirmModalConfig((prev) => ({ ...prev, isOpen: false }));
        }
      },
    });
  };

  const handleCancelSentRequest = (requestId) => {
    setConfirmModalConfig({
      isOpen: true,
      title: 'Cancel Request',
      message: 'Are you sure you want to cancel your pending borrow request?',
      confirmText: 'Yes, Cancel',
      type: 'danger',
      showDamageInputs: false,
      onConfirm: async () => {
        try {
          const res = await api.put(`/requests/${requestId}/cancel`);
          if (res.data.success) {
            toast.success('Borrow request cancelled');
            fetchDashboardData();
          }
        } catch (error) {
          toast.error(error.response?.data?.message || 'Cancel failed');
        } finally {
          setConfirmModalConfig((prev) => ({ ...prev, isOpen: false }));
        }
      },
    });
  };

  // --- Transaction Actions ---
  const handleConfirmHandover = (txId) => {
    setConfirmModalConfig({
      isOpen: true,
      title: 'Confirm Item Handover',
      message: 'Have you met and completed the physical handover of this item?',
      confirmText: 'Confirm Handover',
      type: 'success',
      showDamageInputs: false,
      onConfirm: async () => {
        try {
          const res = await api.put(`/transactions/${txId}/handover`);
          if (res.data.success) {
            toast.success('Handover confirmed! Status is now Borrowed.');
            fetchDashboardData();
          }
        } catch (error) {
          toast.error(error.response?.data?.message || 'Handover failed');
        } finally {
          setConfirmModalConfig((prev) => ({ ...prev, isOpen: false }));
        }
      },
    });
  };

  const handleRequestReturn = (txId) => {
    setConfirmModalConfig({
      isOpen: true,
      title: 'Signal Item Return',
      message: 'Have you returned or are you ready to hand back the item to its owner?',
      confirmText: 'Signal Return',
      type: 'info',
      showDamageInputs: false,
      onConfirm: async () => {
        try {
          const res = await api.put(`/transactions/${txId}/return`);
          if (res.data.success) {
            toast.success('Return initiated! Owner will confirm upon receipt.');
            fetchDashboardData();
          }
        } catch (error) {
          toast.error(error.response?.data?.message || 'Action failed');
        } finally {
          setConfirmModalConfig((prev) => ({ ...prev, isOpen: false }));
        }
      },
    });
  };

  const handleConfirmReturn = (txId) => {
    setConfirmModalConfig({
      isOpen: true,
      title: 'Confirm Item Return & Inspect Condition',
      message: 'Verify that the item was returned in clean, undamaged condition. If any damages or missing parts occurred, you can report them below to update the Borrowing Passport.',
      confirmText: 'Confirm Return & Complete',
      type: 'success',
      showDamageInputs: true,
      onConfirm: async (data = {}) => {
        try {
          const res = await api.put(`/transactions/${txId}/confirm-return`, data);
          if (res.data.success) {
            toast.success('Return confirmed! Transaction marked Completed.');
            fetchDashboardData();
          }
        } catch (error) {
          toast.error(error.response?.data?.message || 'Confirmation failed');
        } finally {
          setConfirmModalConfig((prev) => ({ ...prev, isOpen: false }));
        }
      },
    });
  };

  // --- Profile Settings Form ---
  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    setSavingProfile(true);
    try {
      const res = await api.put('/users/profile', profileForm);
      if (res.data.success) {
        toast.success('Profile updated successfully!');
        updateUser(res.data.user);
      }
    } catch (error) {
      toast.error('Failed to update profile');
    } finally {
      setSavingProfile(false);
    }
  };

  if (loading) {
    return <LoadingSpinner text="Loading your community dashboard..." />;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* 1. Dashboard User Header Card */}
      <div className="p-6 sm:p-8 rounded-3xl bg-white border border-slate-200/90 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <img
            src={user?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80'}
            alt={user?.name}
            className="w-16 h-16 rounded-2xl object-cover border border-slate-100 shadow-sm"
          />
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                Welcome back, {user?.name}!
              </h1>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                Verified Member
              </span>
            </div>
            <div className="flex items-center gap-3 text-xs text-slate-500 mt-1">
              <span className="flex items-center text-amber-500 font-bold">
                <Star className="w-3.5 h-3.5 fill-amber-400 mr-1" />
                {user?.rating || '5.0'} ({user?.totalReviews || 0} reviews)
              </span>
              <span>•</span>
              <span className="flex items-center gap-1 text-slate-600">
                <MapPin className="w-3 h-3 text-emerald-600" />
                {user?.locality ? `${user?.locality}, ` : ''}{user?.city}
              </span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3 self-stretch sm:self-auto">
          <Link
            to="/items/add"
            className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs shadow-md shadow-emerald-600/20 transition-all active:scale-95"
          >
            <PlusCircle className="w-4 h-4" />
            <span>+ List an Item</span>
          </Link>
          <Link
            to="/explore"
            className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-50 font-semibold text-xs transition-colors"
          >
            <span>Explore Items</span>
          </Link>
        </div>
      </div>

      {/* 2. Top Metric KPI Grid (Calculated from real DB records) */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3 sm:gap-4">
        
        {/* Metric 1 */}
        <div
          onClick={() => handleTabChange('items')}
          className="p-4 rounded-2xl bg-white border border-slate-200/90 shadow-sm cursor-pointer hover:border-emerald-500 transition-all group"
        >
          <div className="flex items-center justify-between text-slate-400 group-hover:text-emerald-600">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
              My Listed Items
            </span>
            <Package className="w-4 h-4" />
          </div>
          <p className="text-2xl font-black text-slate-900 mt-1">
            {dashboardStats.totalListedItems}
          </p>
          <span className="text-[10px] text-slate-500 font-medium">
            Active in catalog
          </span>
        </div>

        {/* Metric 2 */}
        <div
          onClick={() => handleTabChange('sent')}
          className="p-4 rounded-2xl bg-white border border-slate-200/90 shadow-sm cursor-pointer hover:border-emerald-500 transition-all group"
        >
          <div className="flex items-center justify-between text-slate-400 group-hover:text-emerald-600">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
              Active Sent
            </span>
            <Send className="w-4 h-4" />
          </div>
          <p className="text-2xl font-black text-slate-900 mt-1">
            {dashboardStats.activeBorrowRequests}
          </p>
          <span className="text-[10px] text-slate-500 font-medium">
            Requests awaiting owner
          </span>
        </div>

        {/* Metric 3 */}
        <div
          onClick={() => handleTabChange('transactions')}
          className="p-4 rounded-2xl bg-white border border-slate-200/90 shadow-sm cursor-pointer hover:border-emerald-500 transition-all group"
        >
          <div className="flex items-center justify-between text-slate-400 group-hover:text-emerald-600">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
              In Possession
            </span>
            <RotateCcw className="w-4 h-4" />
          </div>
          <p className="text-2xl font-black text-indigo-600 mt-1">
            {dashboardStats.currentlyBorrowed}
          </p>
          <span className="text-[10px] text-slate-500 font-medium">
            Items currently borrowed
          </span>
        </div>

        {/* Metric 4 */}
        <div
          onClick={() => handleTabChange('received')}
          className="p-4 rounded-2xl bg-white border border-slate-200/90 shadow-sm cursor-pointer hover:border-emerald-500 transition-all group"
        >
          <div className="flex items-center justify-between text-slate-400 group-hover:text-emerald-600">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
              Received Pending
            </span>
            <Inbox className="w-4 h-4" />
          </div>
          <p className="text-2xl font-black text-amber-600 mt-1">
            {dashboardStats.pendingReceivedRequests}
          </p>
          <span className="text-[10px] text-slate-500 font-medium">
            Requires your approval
          </span>
        </div>

        {/* Metric 5 */}
        <div
          onClick={() => handleTabChange('transactions')}
          className="p-4 rounded-2xl bg-white border border-slate-200/90 shadow-sm cursor-pointer hover:border-emerald-500 transition-all group col-span-2 md:col-span-1"
        >
          <div className="flex items-center justify-between text-slate-400 group-hover:text-emerald-600">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
              Completed
            </span>
            <CheckCheck className="w-4 h-4" />
          </div>
          <p className="text-2xl font-black text-emerald-600 mt-1">
            {dashboardStats.completedTransactions}
          </p>
          <span className="text-[10px] text-slate-500 font-medium">
            Successful transactions
          </span>
        </div>
      </div>

      {/* 3. Navigation Tabs Bar */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-slate-200 scrollbar-none">
        {[
          { id: 'overview', label: 'My Overview', icon: LayoutDashboard },
          { id: 'items', label: `My Items (${myItems.length})`, icon: Package },
          { id: 'sent', label: `Borrow Requests Sent (${sentRequests.length})`, icon: Send },
          { id: 'received', label: `Requests Received (${receivedRequests.length})`, icon: Inbox },
          { id: 'transactions', label: `Borrowing History (${transactions.length})`, icon: History },
          { id: 'profile', label: 'Profile Settings', icon: User },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => handleTabChange(tab.id)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold shrink-0 transition-all ${
                isActive
                  ? 'bg-slate-900 text-white shadow-sm'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-white'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* 4. TAB CONTENTS */}

      {/* TAB A: OVERVIEW */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            {/* Quick Actions Card */}
            <div className="p-6 rounded-3xl bg-gradient-to-br from-slate-900 to-navy-900 text-white space-y-4">
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-400 flex items-center gap-1.5">
                <Sparkles className="w-4 h-4" />
                Quick Actions
              </span>
              <h3 className="text-lg font-bold">Community Circular Hub</h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                Need tools for an upcoming project, camping gear for a weekend trek, or study supplies?
              </p>
              <div className="flex flex-col gap-2 pt-2">
                <Link
                  to="/explore"
                  className="w-full py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs text-center transition-all shadow"
                >
                  Explore Items Nearby
                </Link>
                <Link
                  to="/items/add"
                  className="w-full py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-semibold text-xs text-center transition-all"
                >
                  + List an Item to Share
                </Link>
              </div>
            </div>

            {/* In-Possession Status Card */}
            <div className="p-6 rounded-3xl bg-white border border-slate-200/90 shadow-sm space-y-3">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Items In Possession
              </span>
              <h3 className="text-base font-bold text-slate-900">
                Currently Borrowed
              </h3>
              {transactions.filter((tx) => ['Approved', 'Borrowed', 'Return Requested'].includes(tx.status) && tx.borrower._id === user?._id).length === 0 ? (
                <p className="text-xs text-slate-500 py-4">
                  You do not currently have any active borrowed items.
                </p>
              ) : (
                <div className="space-y-3">
                  {transactions
                    .filter(
                      (tx) =>
                        ['Approved', 'Borrowed', 'Return Requested'].includes(tx.status) &&
                        tx.borrower._id === user?._id
                    )
                    .slice(0, 2)
                    .map((tx) => (
                      <div
                        key={tx._id}
                        className="p-3 rounded-2xl bg-slate-50 border border-slate-200 text-xs flex items-center justify-between"
                      >
                        <div className="truncate pr-2">
                          <p className="font-bold text-slate-900 truncate">
                            {tx.item?.title}
                          </p>
                          <p className="text-[11px] text-slate-500">
                            Return by: {formatDate(tx.endDate)}
                          </p>
                        </div>
                        <StatusBadge status={tx.status} />
                      </div>
                    ))}
                </div>
              )}
            </div>

            {/* Pending Requests Received Card */}
            <div className="p-6 rounded-3xl bg-white border border-slate-200/90 shadow-sm space-y-3">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Lending Requests
              </span>
              <h3 className="text-base font-bold text-slate-900">
                Incoming Inquiries
              </h3>
              {receivedRequests.filter((r) => r.status === 'Pending').length === 0 ? (
                <p className="text-xs text-slate-500 py-4">
                  No pending incoming requests on your items right now.
                </p>
              ) : (
                <div className="space-y-2">
                  {receivedRequests
                    .filter((r) => r.status === 'Pending')
                    .slice(0, 2)
                    .map((r) => (
                      <div
                        key={r._id}
                        className="p-3 rounded-2xl bg-amber-50/60 border border-amber-200/70 text-xs space-y-1.5"
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-slate-900 truncate max-w-[150px]">
                            {r.borrower?.name}
                          </span>
                          <span className="font-semibold text-amber-700">
                            {r.totalDays} days
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-600 truncate">
                          Item: {r.item?.title}
                        </p>
                        <button
                          onClick={() => handleTabChange('received')}
                          className="text-[11px] font-bold text-emerald-700 hover:underline pt-1 block"
                        >
                          Review & Approve →
                        </button>
                      </div>
                    ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* TAB B: MY LISTED ITEMS */}
      {activeTab === 'items' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-slate-900">
              Items You Have Listed for Sharing
            </h2>
            <Link
              to="/items/add"
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-900 text-white text-xs font-semibold hover:bg-emerald-600 transition-colors"
            >
              <PlusCircle className="w-3.5 h-3.5" />
              <span>Add New Item</span>
            </Link>
          </div>

          {myItems.length === 0 ? (
            <div className="text-center py-16 px-4 bg-white rounded-3xl border border-slate-200 space-y-3">
              <Package className="w-12 h-12 text-slate-300 mx-auto" />
              <h3 className="text-base font-bold text-slate-800">
                You haven't listed any items yet
              </h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                Turn your occasionally used drills, projectors, camping gear, or books into community assets.
              </p>
              <Link
                to="/items/add"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-600 text-white font-semibold text-xs shadow"
              >
                List Your First Item
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {myItems.map((item) => (
                <div
                  key={item._id}
                  className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-sm flex flex-col justify-between"
                >
                  <div className="relative aspect-[16/9] bg-slate-100 overflow-hidden">
                    <img
                      src={item.images?.[0] || 'https://images.unsplash.com/photo-1581291518857-4e27b48ff24e?auto=format&fit=crop&w=400&q=80'}
                      alt={item.title}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute top-3 left-3 flex gap-1.5">
                      <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-white text-slate-900 shadow">
                        {item.category}
                      </span>
                    </div>
                    <div className="absolute top-3 right-3">
                      {item.isAvailable ? (
                        <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-500 text-white">
                          Available
                        </span>
                      ) : (
                        <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-slate-900/80 text-slate-200">
                          Unavailable
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                    <div>
                      <h3 className="font-bold text-slate-900 text-base line-clamp-1">
                        {item.title}
                      </h3>
                      <p className="text-xs text-slate-500 mt-1">
                        {item.city} • Condition: {item.condition}
                      </p>
                      <div className="flex items-center justify-between text-xs mt-3 pt-2 border-t border-slate-100">
                        <span className="font-bold text-slate-900">
                          {item.pricePerDay === 0 ? 'Free' : `${formatCurrency(item.pricePerDay)} / day`}
                        </span>
                        <span className="text-slate-500">
                          Borrowed {item.totalBorrows} times
                        </span>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                      <button
                        onClick={() => setPassportItemId(item._id)}
                        className="flex items-center gap-1 px-3 py-1.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-700 hover:bg-slate-50"
                        title="View passport"
                      >
                        <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                        <span>Passport</span>
                      </button>

                      <div className="flex items-center gap-1.5">
                        <button
                          onClick={() => handleToggleItemAvailability(item)}
                          className={`px-3 py-1.5 rounded-xl text-xs font-semibold border transition-colors ${
                            item.isAvailable
                              ? 'border-amber-200 text-amber-700 hover:bg-amber-50'
                              : 'border-emerald-200 text-emerald-700 hover:bg-emerald-50'
                          }`}
                        >
                          {item.isAvailable ? 'Pause' : 'Activate'}
                        </button>
                        <Link
                          to={`/items/edit/${item._id}`}
                          className="p-2 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50"
                          title="Edit"
                        >
                          <Edit className="w-3.5 h-3.5" />
                        </Link>
                        <button
                          onClick={() => handleDeleteItem(item._id)}
                          className="p-2 rounded-xl border border-rose-200 text-rose-600 hover:bg-rose-50"
                          title="Delete"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* TAB C: BORROW REQUESTS SENT */}
      {activeTab === 'sent' && (
        <div className="space-y-4">
          <h2 className="text-lg font-bold text-slate-900">
            Requests You Have Sent to Item Owners
          </h2>

          {sentRequests.length === 0 ? (
            <div className="text-center py-16 px-4 bg-white rounded-3xl border border-slate-200 space-y-2">
              <Send className="w-10 h-10 text-slate-300 mx-auto" />
              <h3 className="text-base font-bold text-slate-800">
                No borrow requests sent yet
              </h3>
              <p className="text-xs text-slate-500">
                Explore items in your locality and send your first borrowing request!
              </p>
              <Link
                to="/explore"
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-900 text-white text-xs font-semibold"
              >
                Find Items to Borrow
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {sentRequests.map((req) => (
                <div
                  key={req._id}
                  className="p-5 rounded-3xl bg-white border border-slate-200 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4"
                >
                  <div className="flex items-center gap-4">
                    <img
                      src={req.item?.images?.[0] || 'https://images.unsplash.com/photo-1581291518857-4e27b48ff24e?auto=format&fit=crop&w=200&q=80'}
                      alt={req.item?.title}
                      className="w-16 h-16 rounded-2xl object-cover border"
                    />
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-bold text-slate-900 text-sm">
                          {req.item?.title}
                        </h3>
                        <StatusBadge status={req.status} />
                      </div>
                      <p className="text-xs text-slate-500 mt-1">
                        Owner: <strong>{req.owner?.name}</strong> ({req.owner?.city}) •{' '}
                        {formatDate(req.startDate)} to {formatDate(req.endDate)} ({req.totalDays} days)
                      </p>
                      {req.message && (
                        <p className="text-xs text-slate-600 mt-1 italic">
                          "{req.message}"
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-3 w-full md:w-auto justify-end">
                    <span className="text-sm font-extrabold text-slate-900">
                      {req.estimatedPrice === 0 ? 'Free' : formatCurrency(req.estimatedPrice)}
                    </span>

                    {req.status === 'Pending' && (
                      <button
                        onClick={() => handleCancelSentRequest(req._id)}
                        className="px-3 py-1.5 rounded-xl border border-rose-200 text-rose-600 hover:bg-rose-50 text-xs font-semibold"
                      >
                        Cancel Request
                      </button>
                    )}

                    {req.status === 'Approved' && (
                      <button
                        onClick={() => handleTabChange('transactions')}
                        className="px-3.5 py-1.5 rounded-xl bg-emerald-600 text-white text-xs font-semibold hover:bg-emerald-700"
                      >
                        View Agreement
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* TAB D: REQUESTS RECEIVED (INCOMING) */}
      {activeTab === 'received' && (
        <div className="space-y-4">
          <h2 className="text-lg font-bold text-slate-900">
            Requests Received for Your Items
          </h2>

          {receivedRequests.length === 0 ? (
            <div className="text-center py-16 px-4 bg-white rounded-3xl border border-slate-200 space-y-2">
              <Inbox className="w-10 h-10 text-slate-300 mx-auto" />
              <h3 className="text-base font-bold text-slate-800">
                No borrowing requests received yet
              </h3>
              <p className="text-xs text-slate-500">
                When neighbors request your items, they will appear here for your review and approval.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {receivedRequests.map((req) => (
                <div
                  key={req._id}
                  className="p-6 rounded-3xl bg-white border border-slate-200 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4"
                >
                  <div className="flex items-start gap-4">
                    <img
                      src={req.borrower?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80'}
                      alt={req.borrower?.name}
                      className="w-12 h-12 rounded-full object-cover border"
                    />
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-slate-900 text-sm">
                          {req.borrower?.name}
                        </span>
                        <span className="text-xs text-amber-500 font-semibold">
                          ⭐ {req.borrower?.rating || '5.0'}
                        </span>
                        <StatusBadge status={req.status} />
                      </div>
                      <p className="text-xs text-slate-600">
                        Wants to borrow: <strong className="text-slate-900">{req.item?.title}</strong>
                      </p>
                      <p className="text-xs text-slate-500">
                        Dates: {formatDate(req.startDate)} to {formatDate(req.endDate)} ({req.totalDays} days) • Location: {req.borrower?.city}
                      </p>
                      {req.message && (
                        <p className="text-xs text-slate-700 bg-slate-50 p-2.5 rounded-xl border border-slate-100 italic">
                          "{req.message}"
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-3 w-full md:w-auto justify-end">
                    {req.status === 'Pending' ? (
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleRejectRequest(req._id)}
                          className="px-4 py-2 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 text-xs font-semibold"
                        >
                          Decline
                        </button>
                        <button
                          onClick={() => handleApproveRequest(req._id)}
                          className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-md shadow-emerald-600/20"
                        >
                          Approve Request
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={() => handleTabChange('transactions')}
                        className="px-4 py-2 rounded-xl border border-slate-200 text-slate-700 text-xs font-semibold hover:bg-slate-50"
                      >
                        View Agreement
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* TAB E: BORROWING HISTORY & ACTIVE TRANSACTIONS */}
      {activeTab === 'transactions' && (
        <div className="space-y-4">
          <h2 className="text-lg font-bold text-slate-900">
            Active Borrow Agreements & Historical Ledger
          </h2>

          {transactions.length === 0 ? (
            <div className="text-center py-16 px-4 bg-white rounded-3xl border border-slate-200 space-y-2">
              <History className="w-10 h-10 text-slate-300 mx-auto" />
              <h3 className="text-base font-bold text-slate-800">
                No active or past transactions
              </h3>
              <p className="text-xs text-slate-500">
                Once a borrow request is approved, the live transaction and audit trail will appear here.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {transactions.map((tx) => {
                const isBorrower = tx.borrower?._id === user?._id;
                const otherParty = isBorrower ? tx.owner : tx.borrower;

                return (
                  <div
                    key={tx._id}
                    className="p-6 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-4"
                  >
                    {/* Top Row: Item + Status */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
                      <div className="flex items-center gap-3">
                        <img
                          src={tx.item?.images?.[0] || 'https://images.unsplash.com/photo-1581291518857-4e27b48ff24e?auto=format&fit=crop&w=150&q=80'}
                          alt={tx.item?.title}
                          className="w-12 h-12 rounded-xl object-cover border"
                        />
                        <div>
                          <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-700">
                            {isBorrower ? 'You Borrowed' : 'You Lent'}
                          </span>
                          <h3 className="font-extrabold text-slate-900 text-sm">
                            {tx.item?.title}
                          </h3>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <StatusBadge status={tx.status} />
                        <button
                          onClick={() => setPassportItemId(tx.item?._id)}
                          className="p-1.5 rounded-lg border border-slate-200 text-slate-500 hover:text-slate-900"
                          title="View Item Passport"
                        >
                          <ShieldCheck className="w-4 h-4 text-emerald-600" />
                        </button>
                      </div>
                    </div>

                    {/* Middle Details Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs text-slate-600 bg-slate-50 p-4 rounded-2xl">
                      <div>
                        <span className="text-slate-400 block text-[10px] uppercase font-bold">
                          {isBorrower ? 'Lender / Owner' : 'Borrower'}
                        </span>
                        <span className="font-bold text-slate-900">
                          {otherParty?.name} ({otherParty?.city})
                        </span>
                        <span className="text-slate-400 block text-[11px]">
                          Ph: {otherParty?.phone}
                        </span>
                      </div>

                      <div>
                        <span className="text-slate-400 block text-[10px] uppercase font-bold">
                          Scheduled Period
                        </span>
                        <span className="font-semibold text-slate-800">
                          {formatDate(tx.startDate)} – {formatDate(tx.endDate)}
                        </span>
                      </div>

                      <div>
                        <span className="text-slate-400 block text-[10px] uppercase font-bold">
                          On-Time Status
                        </span>
                        <span className="font-semibold text-emerald-600">
                          {tx.isReturnedOnTime ? 'On Schedule' : 'Delayed'}
                        </span>
                      </div>
                    </div>

                    {/* Bottom Workflow Action Buttons */}
                    <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
                      <div className="text-xs text-slate-500">
                        {tx.status === 'Approved' && 'Step 1: Coordinate local meetup and confirm physical handover.'}
                        {tx.status === 'Borrowed' && 'Step 2: Item in use. Hand back to owner once finished.'}
                        {tx.status === 'Return Requested' && 'Step 3: Borrower has initiated return. Owner please confirm receipt.'}
                        {tx.status === 'Completed' && 'Step 4: Transaction complete. Please exchange community reviews.'}
                      </div>

                      <div className="flex items-center gap-2">
                        {/* Handover action */}
                        {tx.status === 'Approved' && (
                          <button
                            onClick={() => handleConfirmHandover(tx._id)}
                            className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow transition-all"
                          >
                            Confirm Item Handover
                          </button>
                        )}

                        {/* Return requested by borrower */}
                        {tx.status === 'Borrowed' && isBorrower && (
                          <button
                            onClick={() => handleRequestReturn(tx._id)}
                            className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold shadow transition-all"
                          >
                            I Have Handed Back the Item
                          </button>
                        )}

                        {/* Confirm return by owner */}
                        {['Borrowed', 'Return Requested'].includes(tx.status) && !isBorrower && (
                          <button
                            onClick={() => handleConfirmReturn(tx._id)}
                            className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow transition-all"
                          >
                            Confirm Return & Complete
                          </button>
                        )}

                        {/* Completed actions: Leave review */}
                        {tx.status === 'Completed' && (
                          <button
                            onClick={() => setReviewTx(tx)}
                            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold shadow transition-all"
                          >
                            <Star className="w-3.5 h-3.5 text-amber-400" />
                            <span>Leave Review</span>
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* TAB F: PROFILE SETTINGS */}
      {activeTab === 'profile' && (
        <div className="max-w-2xl bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm space-y-6">
          <div>
            <h2 className="text-lg font-bold text-slate-900">
              Profile Settings
            </h2>
            <p className="text-xs text-slate-500">
              Manage your personal community profile and contact information
            </p>
          </div>

          <form onSubmit={handleProfileSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                Full Name
              </label>
              <input
                type="text"
                required
                value={profileForm.name}
                onChange={(e) =>
                  setProfileForm({ ...profileForm, name: e.target.value })
                }
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-emerald-500 outline-none text-slate-900"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                  Phone Number
                </label>
                <input
                  type="tel"
                  required
                  value={profileForm.phone}
                  onChange={(e) =>
                    setProfileForm({ ...profileForm, phone: e.target.value })
                  }
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-emerald-500 outline-none text-slate-900"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                  City Hub
                </label>
                <input
                  type="text"
                  required
                  value={profileForm.city}
                  onChange={(e) =>
                    setProfileForm({ ...profileForm, city: e.target.value })
                  }
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-emerald-500 outline-none text-slate-900"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                Locality / Campus / Hostel
              </label>
              <input
                type="text"
                required
                value={profileForm.locality}
                onChange={(e) =>
                  setProfileForm({ ...profileForm, locality: e.target.value })
                }
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-emerald-500 outline-none text-slate-900"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                Community Bio
              </label>
              <textarea
                rows={3}
                value={profileForm.bio}
                onChange={(e) =>
                  setProfileForm({ ...profileForm, bio: e.target.value })
                }
                placeholder="Share your interests, hobbies, or what tools you like lending..."
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-emerald-500 outline-none text-slate-900 resize-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                Avatar Image URL
              </label>
              <input
                type="url"
                value={profileForm.avatar}
                onChange={(e) =>
                  setProfileForm({ ...profileForm, avatar: e.target.value })
                }
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-emerald-500 outline-none text-slate-900"
              />
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={savingProfile}
                className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-slate-900 hover:bg-emerald-600 disabled:opacity-50 text-white text-xs font-bold transition-all"
              >
                {savingProfile && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                <span>Save Profile Changes</span>
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Reusable Modals */}
      <ConfirmModal
        isOpen={confirmModalConfig.isOpen}
        onClose={() => setConfirmModalConfig((prev) => ({ ...prev, isOpen: false }))}
        onConfirm={confirmModalConfig.onConfirm}
        title={confirmModalConfig.title}
        message={confirmModalConfig.message}
        confirmText={confirmModalConfig.confirmText}
        type={confirmModalConfig.type}
        showDamageInputs={confirmModalConfig.showDamageInputs}
      />

      {passportItemId && (
        <BorrowingPassportModal
          itemId={passportItemId}
          isOpen={!!passportItemId}
          onClose={() => setPassportItemId(null)}
        />
      )}

      {reviewTx && (
        <ReviewModal
          transaction={reviewTx}
          isOpen={!!reviewTx}
          onClose={() => setReviewTx(null)}
          onSuccess={() => {
            setReviewTx(null);
            fetchDashboardData();
          }}
        />
      )}
    </div>
  );
};

export default Dashboard;
