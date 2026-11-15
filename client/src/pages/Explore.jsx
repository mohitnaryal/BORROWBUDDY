import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
  Search,
  Filter,
  X,
  MapPin,
  SlidersHorizontal,
  RotateCcw,
  PackageOpen,
  Sparkles,
} from 'lucide-react';
import api from '../services/api';
import ItemCard from '../components/ItemCard';
import LoadingSpinner from '../components/LoadingSpinner';
import BorrowingPassportModal from '../components/BorrowingPassportModal';
import { CATEGORIES, CONDITIONS, CITIES } from '../utils/constants';

const Explore = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  // Search & Filter States
  const [searchTerm, setSearchTerm] = useState(searchParams.get('q') || '');
  const [selectedCategory, setSelectedCategory] = useState(
    searchParams.get('category') || 'All'
  );
  const [selectedCity, setSelectedCity] = useState(
    searchParams.get('city') || 'All'
  );
  const [selectedCondition, setSelectedCondition] = useState(
    searchParams.get('condition') || 'All'
  );
  const [availableOnly, setAvailableOnly] = useState(
    searchParams.get('availability') === 'available'
  );
  const [priceType, setPriceType] = useState(
    searchParams.get('priceType') || 'all'
  );
  const [sortOption, setSortOption] = useState(
    searchParams.get('sort') || 'newest'
  );

  const [items, setItems] = useState([]);
  const [totalCount, setTotalCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [showFiltersMobile, setShowFiltersMobile] = useState(false);
  const [passportItem, setPassportItem] = useState(null);

  // Sync state to URL and fetch items
  useEffect(() => {
    fetchFilteredItems();
  }, [
    selectedCategory,
    selectedCity,
    selectedCondition,
    availableOnly,
    priceType,
    sortOption,
  ]);

  const fetchFilteredItems = async (customSearch = searchTerm) => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (customSearch.trim()) params.append('q', customSearch.trim());
      if (selectedCategory !== 'All') params.append('category', selectedCategory);
      if (selectedCity !== 'All') params.append('city', selectedCity);
      if (selectedCondition !== 'All') params.append('condition', selectedCondition);
      if (availableOnly) params.append('availability', 'available');
      if (priceType !== 'all') params.append('priceType', priceType);
      if (sortOption) params.append('sort', sortOption);

      // Update URL query string
      setSearchParams(params, { replace: true });

      const res = await api.get(`/items?${params.toString()}`);
      if (res.data.success) {
        setItems(res.data.items);
        setTotalCount(res.data.total);
      }
    } catch (error) {
      console.error('Failed to load items:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchFilteredItems(searchTerm);
  };

  const resetAllFilters = () => {
    setSearchTerm('');
    setSelectedCategory('All');
    setSelectedCity('All');
    setSelectedCondition('All');
    setAvailableOnly(false);
    setPriceType('all');
    setSortOption('newest');
    setSearchParams({}, { replace: true });
    fetchFilteredItems('');
  };

  const hasActiveFilters =
    searchTerm ||
    selectedCategory !== 'All' ||
    selectedCity !== 'All' ||
    selectedCondition !== 'All' ||
    availableOnly ||
    priceType !== 'all' ||
    sortOption !== 'newest';

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      
      {/* Top Header & Search Bar */}
      <div className="space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              Explore Community Items
            </h1>
            <p className="text-sm text-slate-500 mt-0.5">
              Discover {totalCount} items shared by verified neighbors across colleges and hubs
            </p>
          </div>

          {/* Search Input */}
          <form
            onSubmit={handleSearchSubmit}
            className="flex items-center gap-2 w-full md:w-96 bg-white rounded-2xl border border-slate-200 shadow-sm px-3.5 py-1.5 focus-within:ring-2 focus-within:ring-emerald-500 focus-within:border-emerald-500"
          >
            <Search className="w-4 h-4 text-slate-400 shrink-0" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search items, titles, localities..."
              className="w-full py-1.5 text-xs sm:text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none"
            />
            {searchTerm && (
              <button
                type="button"
                onClick={() => {
                  setSearchTerm('');
                  fetchFilteredItems('');
                }}
                className="text-slate-400 hover:text-slate-600 p-1"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
            <button
              type="submit"
              className="px-3 py-1 rounded-xl bg-slate-900 text-white text-xs font-semibold hover:bg-emerald-600 transition-colors shrink-0"
            >
              Search
            </button>
          </form>
        </div>

        {/* Category Pills Scroller */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none pt-2">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2 rounded-xl text-xs font-semibold shrink-0 transition-all ${
                selectedCategory === cat
                  ? 'bg-slate-900 text-white shadow-sm'
                  : 'bg-white border border-slate-200/90 text-slate-600 hover:bg-slate-50 hover:text-slate-900'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Filter and Sorting Toolbar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-sm flex flex-wrap items-center justify-between gap-4">
        {/* Left Filters */}
        <div className="flex flex-wrap items-center gap-3">
          {/* City Dropdown */}
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 bg-slate-50 text-xs text-slate-700">
            <MapPin className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
            <select
              value={selectedCity}
              onChange={(e) => setSelectedCity(e.target.value)}
              className="bg-transparent font-medium focus:outline-none cursor-pointer"
            >
              <option value="All">All Cities</option>
              {CITIES.filter((c) => c !== 'All').map((city) => (
                <option key={city} value={city}>
                  {city}
                </option>
              ))}
            </select>
          </div>

          {/* Condition Dropdown */}
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 bg-slate-50 text-xs text-slate-700">
            <span className="font-semibold text-slate-500">Condition:</span>
            <select
              value={selectedCondition}
              onChange={(e) => setSelectedCondition(e.target.value)}
              className="bg-transparent font-medium focus:outline-none cursor-pointer"
            >
              <option value="All">Any Condition</option>
              {CONDITIONS.map((cond) => (
                <option key={cond} value={cond}>
                  {cond}
                </option>
              ))}
            </select>
          </div>

          {/* Price Type */}
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 bg-slate-50 text-xs text-slate-700">
            <span className="font-semibold text-slate-500">Price:</span>
            <select
              value={priceType}
              onChange={(e) => setPriceType(e.target.value)}
              className="bg-transparent font-medium focus:outline-none cursor-pointer"
            >
              <option value="all">All Items</option>
              <option value="free">Free Only (₹0)</option>
              <option value="paid">Paid Borrowing</option>
            </select>
          </div>

          {/* Available Only Toggle */}
          <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-slate-700 select-none px-2 py-1">
            <input
              type="checkbox"
              checked={availableOnly}
              onChange={(e) => setAvailableOnly(e.target.checked)}
              className="rounded border-slate-300 text-emerald-600 focus:ring-emerald-500"
            />
            <span>Available Now Only</span>
          </label>
        </div>

        {/* Right Sort & Reset */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 text-xs text-slate-600">
            <SlidersHorizontal className="w-3.5 h-3.5 text-slate-400" />
            <span className="font-medium">Sort by:</span>
            <select
              value={sortOption}
              onChange={(e) => setSortOption(e.target.value)}
              className="bg-slate-50 border border-slate-200 rounded-xl px-2.5 py-1.5 font-semibold text-slate-800 focus:outline-none cursor-pointer"
            >
              <option value="newest">Newest First</option>
              <option value="popular">Most Borrowed</option>
              <option value="price_asc">Price: Low to High</option>
              <option value="price_desc">Price: High to Low</option>
            </select>
          </div>

          {hasActiveFilters && (
            <button
              onClick={resetAllFilters}
              className="flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-semibold text-slate-500 hover:text-slate-900 hover:bg-slate-100 transition-colors"
              title="Reset all filters"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset</span>
            </button>
          )}
        </div>
      </div>

      {/* Main Items Display */}
      {loading ? (
        <LoadingSpinner text="Searching community catalog..." />
      ) : items.length === 0 ? (
        <div className="text-center py-20 px-4 bg-white rounded-3xl border border-slate-200/80 space-y-4">
          <div className="w-16 h-16 rounded-3xl bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
            <PackageOpen className="w-8 h-8" />
          </div>
          <div className="max-w-md mx-auto space-y-1">
            <h3 className="text-lg font-bold text-slate-900">
              No items match your criteria
            </h3>
            <p className="text-xs text-slate-500">
              Try adjusting your category, keyword search, or resetting the location filter.
            </p>
          </div>
          <button
            onClick={resetAllFilters}
            className="px-4 py-2 rounded-xl bg-slate-900 text-white text-xs font-semibold hover:bg-slate-800"
          >
            Clear All Filters
          </button>
        </div>
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

      {/* Passport Modal */}
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

export default Explore;
