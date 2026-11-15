import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Search,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Repeat,
  Package,
  Users,
  Building,
  CheckCircle2,
  Clock,
  HeartHandshake,
  TrendingUp,
  MapPin,
  Star,
  Zap,
} from 'lucide-react';
import api from '../services/api';
import ItemCard from '../components/ItemCard';
import BorrowingPassportModal from '../components/BorrowingPassportModal';
import { CATEGORIES } from '../utils/constants';

const Home = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCity, setSelectedCity] = useState('');
  const [featuredItems, setFeaturedItems] = useState([]);
  const [communityStats, setCommunityStats] = useState({
    totalItems: 12,
    totalUsers: 5,
    completedBorrows: 3,
    citiesCount: 5,
  });
  const [loading, setLoading] = useState(true);
  const [passportModalItem, setPassportModalItem] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [statsRes, itemsRes] = await Promise.all([
          api.get('/stats/community'),
          api.get('/items/featured'),
        ]);

        if (statsRes.data.success) {
          setCommunityStats(statsRes.data.stats);
        }
        if (itemsRes.data.success) {
          setFeaturedItems(itemsRes.data.items);
        }
      } catch (error) {
        console.error('Error fetching home data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (searchQuery.trim()) params.append('q', searchQuery.trim());
    if (selectedCity && selectedCity !== 'All') params.append('city', selectedCity);
    navigate(`/explore?${params.toString()}`);
  };

  return (
    <div className="space-y-20 pb-20 overflow-x-hidden">
      {/* 1. HERO SECTION */}
      <section className="relative pt-12 pb-20 md:pt-20 md:pb-28 bg-gradient-to-b from-slate-100/80 via-white to-slate-50 border-b border-slate-200/60 overflow-hidden">
        {/* Glow ambient circles */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-emerald-400/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute top-1/3 right-10 w-[300px] h-[300px] bg-blue-400/10 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center max-w-3xl mx-auto space-y-6">
            
            {/* Tagline Pill */}
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-50 border border-emerald-200/80 text-emerald-800 text-xs font-semibold shadow-sm">
              <Sparkles className="w-4 h-4 text-emerald-600" />
              <span>Borrow More. Buy Less. — Community Circular Economy</span>
            </div>

            {/* Main Headline */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-slate-900 tracking-tight leading-[1.15]">
              Everything You Need.{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-teal-500">
                Borrow It Nearby.
              </span>
            </h1>

            {/* Subheading */}
            <p className="text-base sm:text-xl text-slate-600 leading-relaxed font-normal max-w-2xl mx-auto">
              Why buy something you will use once? Discover drills, camping tents,
              projectors, books, and sports gear shared by verified people right in your campus or neighborhood.
            </p>

            {/* Search Bar Bar */}
            <form
              onSubmit={handleSearchSubmit}
              className="mt-8 p-2 rounded-2xl bg-white shadow-xl shadow-slate-200/70 border border-slate-200 flex flex-col sm:flex-row items-center gap-2 max-w-2xl mx-auto"
            >
              <div className="flex-1 flex items-center gap-3 px-3 w-full">
                <Search className="w-5 h-5 text-slate-400 shrink-0" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search drill, tent, projector, Harry Potter..."
                  className="w-full py-2 bg-transparent text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none"
                />
              </div>

              <div className="hidden sm:block w-px h-8 bg-slate-200" />

              <div className="w-full sm:w-auto flex items-center gap-2 px-3 sm:px-0">
                <MapPin className="w-4 h-4 text-emerald-600 shrink-0" />
                <select
                  value={selectedCity}
                  onChange={(e) => setSelectedCity(e.target.value)}
                  className="bg-transparent text-xs sm:text-sm font-medium text-slate-700 py-2 focus:outline-none cursor-pointer"
                >
                  <option value="">All Locations</option>
                  <option value="Phagwara">Phagwara</option>
                  <option value="Jalandhar">Jalandhar</option>
                  <option value="Ludhiana">Ludhiana</option>
                  <option value="Kangra">Kangra</option>
                  <option value="Chandigarh">Chandigarh</option>
                </select>
              </div>

              <button
                type="submit"
                className="w-full sm:w-auto px-6 py-3 rounded-xl bg-slate-900 hover:bg-emerald-600 text-white text-sm font-bold shadow-md transition-all active:scale-95 shrink-0"
              >
                Find Items
              </button>
            </form>

            {/* CTAs */}
            <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
              <Link
                to="/explore"
                className="flex items-center gap-2 px-6 py-3.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-sm font-semibold shadow-md shadow-slate-900/10 transition-all active:scale-95"
              >
                <span>Explore Items</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                to="/items/add"
                className="flex items-center gap-2 px-6 py-3.5 rounded-xl bg-white hover:bg-slate-50 border border-slate-200 text-slate-800 text-sm font-semibold shadow-sm transition-all active:scale-95"
              >
                <Repeat className="w-4 h-4 text-emerald-600" />
                <span>Start Lending</span>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 2. REAL DATABASE COMMUNITY STATISTICS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="p-8 sm:p-10 rounded-3xl bg-slate-900 text-white shadow-xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center divide-y sm:divide-y-0 sm:divide-x divide-slate-800">
            <div className="space-y-1">
              <p className="text-3xl sm:text-4xl font-black text-white tracking-tight">
                {communityStats.totalItems}+
              </p>
              <p className="text-xs sm:text-sm font-medium text-slate-400">
                Items Shared & Listed
              </p>
            </div>

            <div className="space-y-1 pt-6 sm:pt-0">
              <p className="text-3xl sm:text-4xl font-black text-emerald-400 tracking-tight">
                {communityStats.totalUsers}
              </p>
              <p className="text-xs sm:text-sm font-medium text-slate-400">
                Verified Members
              </p>
            </div>

            <div className="space-y-1 pt-6 sm:pt-0">
              <p className="text-3xl sm:text-4xl font-black text-white tracking-tight">
                {communityStats.completedBorrows}
              </p>
              <p className="text-xs sm:text-sm font-medium text-slate-400">
                Completed Borrows
              </p>
            </div>

            <div className="space-y-1 pt-6 sm:pt-0">
              <p className="text-3xl sm:text-4xl font-black text-emerald-400 tracking-tight">
                {communityStats.citiesCount}
              </p>
              <p className="text-xs sm:text-sm font-medium text-slate-400">
                Active Campus / City Hubs
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 3. FEATURED COMMUNITY ITEMS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold text-emerald-700 tracking-wider uppercase">
              <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
              <span>Community Catalog</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight mt-1">
              Popular Items Available Near You
            </h2>
          </div>
          <Link
            to="/explore"
            className="flex items-center gap-1.5 text-sm font-semibold text-emerald-700 hover:text-emerald-800 group"
          >
            <span>View all items</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {/* Items Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {featuredItems.slice(0, 8).map((item) => (
            <ItemCard
              key={item._id}
              item={item}
              onOpenPassport={(it) => setPassportModalItem(it)}
            />
          ))}
        </div>
      </section>

      {/* 4. HOW BORROWBUDDY WORKS */}
      <section id="how-it-works" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center max-w-2xl mx-auto space-y-3 mb-14">
          <span className="text-xs font-bold uppercase tracking-wider text-emerald-700">
            Seamless Workflow
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            How BorrowBuddy Works
          </h2>
          <p className="text-slate-600 text-sm">
            Borrowing from trusted campus peers or neighbors takes under two minutes.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 relative">
          {/* Step 1 */}
          <div className="p-6 rounded-3xl bg-white border border-slate-200/80 shadow-sm relative space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-slate-900 text-white flex items-center justify-center font-black text-lg">
              1
            </div>
            <h3 className="font-bold text-slate-900 text-base">
              Discover Nearby
            </h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Browse tools, gear, electronics, or books available in your locality, college hostel, or PG neighborhood.
            </p>
          </div>

          {/* Step 2 */}
          <div className="p-6 rounded-3xl bg-white border border-slate-200/80 shadow-sm relative space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-emerald-600 text-white flex items-center justify-center font-black text-lg">
              2
            </div>
            <h3 className="font-bold text-slate-900 text-base">
              Request & Schedule
            </h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Pick your borrow and return dates. The owner reviews and approves your request with verified overlap prevention.
            </p>
          </div>

          {/* Step 3 */}
          <div className="p-6 rounded-3xl bg-white border border-slate-200/80 shadow-sm relative space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-slate-900 text-white flex items-center justify-center font-black text-lg">
              3
            </div>
            <h3 className="font-bold text-slate-900 text-base">
              Handover & Use
            </h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Meet up locally, inspect the item, confirm handover in the app, and get your project or trip done without buying.
            </p>
          </div>

          {/* Step 4 */}
          <div className="p-6 rounded-3xl bg-white border border-slate-200/80 shadow-sm relative space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-emerald-600 text-white flex items-center justify-center font-black text-lg">
              4
            </div>
            <h3 className="font-bold text-slate-900 text-base">
              Return & Passport Audit
            </h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Return on time. The owner confirms return condition, updates the immutable Borrowing Passport, and exchanges two-way reviews.
            </p>
          </div>
        </div>
      </section>

      {/* 5. BENEFITS OF BORROWING */}
      <section className="bg-slate-100/70 border-y border-slate-200/80 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto space-y-3 mb-12">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-700">
              Why Borrow Instead of Buying?
            </span>
            <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">
              A Smarter, Greener Way to Live
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-8 rounded-3xl bg-white border border-slate-200/70 shadow-sm space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                <TrendingUp className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900">
                Save Up to 90% of Costs
              </h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                An average drill is used for only 13 minutes in its entire lifespan. Why spend ₹4,000 when you can borrow it for ₹50 or free?
              </p>
            </div>

            <div className="p-8 rounded-3xl bg-white border border-slate-200/70 shadow-sm space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center">
                <HeartHandshake className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900">
                Build Genuine Community Trust
              </h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                Connect with fellow college students, hostel mates, and neighborhood residents who share similar hobbies and values.
              </p>
            </div>

            <div className="p-8 rounded-3xl bg-white border border-slate-200/70 shadow-sm space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900">
                Borrowing Passports for Peace of Mind
              </h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                Every item carries an immutable track record of past borrowers, punctuality scores, and verified damage checks.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 6. VERIFIED COMMUNITY TESTIMONIALS (DEMO CONTENT) */}
      <section id="community" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
            Voices from Campus & Hubs
          </span>
          <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">
            Loved by Students & Residents
          </h2>
          <p className="text-xs text-slate-400">
            (Identified demo community feedback from initial trial hubs)
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 rounded-3xl bg-white border border-slate-200/80 shadow-sm space-y-4">
            <div className="flex items-center gap-1 text-amber-400">
              {'★'.repeat(5)}
            </div>
            <p className="text-sm text-slate-700 italic leading-relaxed">
              "As a hostel student near LPU Law Gate, buying a heavy Bosch drill to mount my project board made zero sense. Aarav lent me his in 15 minutes. Absolute game-changer!"
            </p>
            <div className="flex items-center gap-3 pt-2 border-t border-slate-100">
              <img
                src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&q=80"
                alt="Mehak"
                className="w-9 h-9 rounded-full object-cover"
              />
              <div>
                <p className="text-xs font-bold text-slate-900">Mehak Sharma</p>
                <p className="text-[11px] text-slate-500">Student • Phagwara Hub</p>
              </div>
            </div>
          </div>

          <div className="p-6 rounded-3xl bg-white border border-slate-200/80 shadow-sm space-y-4">
            <div className="flex items-center gap-1 text-amber-400">
              {'★'.repeat(5)}
            </div>
            <p className="text-sm text-slate-700 italic leading-relaxed">
              "We borrowed Vikram's 4-person waterproof tent for our weekend trek to Triund. The Borrowing Passport gave us confidence that the gear was leak-free and well maintained."
            </p>
            <div className="flex items-center gap-3 pt-2 border-t border-slate-100">
              <img
                src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=100&q=80"
                alt="Arjun"
                className="w-9 h-9 rounded-full object-cover"
              />
              <div>
                <p className="text-xs font-bold text-slate-900">Arjun Mehta</p>
                <p className="text-[11px] text-slate-500">PG Resident • Kangra Hub</p>
              </div>
            </div>
          </div>

          <div className="p-6 rounded-3xl bg-white border border-slate-200/80 shadow-sm space-y-4">
            <div className="flex items-center gap-1 text-amber-400">
              {'★'.repeat(5)}
            </div>
            <p className="text-sm text-slate-700 italic leading-relaxed">
              "Lending my portable projector during exam semester break helped me earn some pocket money while meeting awesome fellow movie lovers in Sector 17!"
            </p>
            <div className="flex items-center gap-3 pt-2 border-t border-slate-100">
              <img
                src="https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?auto=format&fit=crop&w=100&q=80"
                alt="Rohan"
                className="w-9 h-9 rounded-full object-cover"
              />
              <div>
                <p className="text-xs font-bold text-slate-900">Rohan Verma</p>
                <p className="text-[11px] text-slate-500">Item Owner • Chandigarh Hub</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 7. CALL TO ACTION BANNER */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="p-10 sm:p-14 rounded-3xl bg-gradient-to-tr from-slate-900 via-navy-900 to-slate-900 text-white text-center space-y-6 relative overflow-hidden shadow-2xl">
          <div className="max-w-xl mx-auto space-y-3">
            <h2 className="text-3xl sm:text-4xl font-black tracking-tight">
              Have Items Lying Idle in Your Room?
            </h2>
            <p className="text-slate-300 text-sm leading-relaxed">
              Join thousands of neighbors in Phagwara, Jalandhar, Ludhiana, Kangra, and Chandigarh.
              List your tools, books, and gear in 2 minutes.
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
            <Link
              to="/items/add"
              className="px-6 py-3.5 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-bold text-sm shadow-lg shadow-emerald-500/20 transition-all active:scale-95"
            >
              List an Item Now
            </Link>
            <Link
              to="/explore"
              className="px-6 py-3.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-semibold text-sm border border-slate-700 transition-all active:scale-95"
            >
              Browse All Items
            </Link>
          </div>
        </div>
      </section>

      {/* Passport Modal */}
      {passportModalItem && (
        <BorrowingPassportModal
          itemId={passportModalItem._id}
          isOpen={!!passportModalItem}
          onClose={() => setPassportModalItem(null)}
        />
      )}
    </div>
  );
};

export default Home;
