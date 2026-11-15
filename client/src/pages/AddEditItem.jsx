import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Upload,
  Sparkles,
  ArrowRight,
  Loader2,
  Image as ImageIcon,
  MapPin,
  ShieldCheck,
  Info,
  X,
} from 'lucide-react';
import api from '../services/api';
import { useAuth } from '../hooks/useAuth';
import LoadingSpinner from '../components/LoadingSpinner';
import toast from 'react-hot-toast';
import { ITEM_CATEGORIES, CONDITIONS, CITIES } from '../utils/constants';

const AddEditItem = () => {
  const { id } = useParams();
  const isEditMode = !!id;
  const navigate = useNavigate();
  const { user } = useAuth();

  const [loading, setLoading] = useState(isEditMode);
  const [submitting, setSubmitting] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'Tools',
    condition: 'Like New',
    city: user?.city || 'Phagwara',
    locality: user?.locality || 'Hostel / Campus Area',
    pricePerDay: '0',
    securityDeposit: '0',
    borrowingRules:
      'Please return the item in the same clean, working condition it was received. Prompt return is appreciated.',
    isAvailable: true,
  });

  // Image upload state
  const [imageUrlInput, setImageUrlInput] = useState('');
  const [imageUrls, setImageUrls] = useState([]);
  const [selectedFiles, setSelectedFiles] = useState([]);

  useEffect(() => {
    if (isEditMode) {
      fetchExistingItem();
    }
  }, [id]);

  const fetchExistingItem = async () => {
    setLoading(true);
    try {
      const res = await api.get(`/items/${id}`);
      if (res.data.success) {
        const item = res.data.item;
        setFormData({
          title: item.title,
          description: item.description,
          category: item.category,
          condition: item.condition,
          city: item.city,
          locality: item.locality,
          pricePerDay: item.pricePerDay.toString(),
          securityDeposit: item.securityDeposit ? item.securityDeposit.toString() : '0',
          borrowingRules: item.borrowingRules || '',
          isAvailable: item.isAvailable,
        });
        setImageUrls(item.images || []);
      }
    } catch (error) {
      console.error('Error fetching item for edit:', error);
      toast.error('Failed to load item for editing');
      navigate('/dashboard');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleAddImageUrl = () => {
    if (!imageUrlInput.trim()) return;
    setImageUrls([...imageUrls, imageUrlInput.trim()]);
    setImageUrlInput('');
  };

  const handleRemoveImageUrl = (indexToRemove) => {
    setImageUrls(imageUrls.filter((_, idx) => idx !== indexToRemove));
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      setSelectedFiles(Array.from(e.target.files));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.title.trim() || !formData.description.trim()) {
      toast.error('Please enter a title and description');
      return;
    }

    if (imageUrls.length === 0 && selectedFiles.length === 0) {
      toast.error('Please provide at least one image URL or upload an image');
      return;
    }

    setSubmitting(true);

    try {
      // If user uploaded actual files via input, use FormData
      if (selectedFiles.length > 0) {
        const data = new FormData();
        data.append('title', formData.title);
        data.append('description', formData.description);
        data.append('category', formData.category);
        data.append('condition', formData.condition);
        data.append('city', formData.city);
        data.append('locality', formData.locality);
        data.append('pricePerDay', formData.pricePerDay);
        data.append('securityDeposit', formData.securityDeposit);
        data.append('borrowingRules', formData.borrowingRules);
        data.append('isAvailable', formData.isAvailable);

        selectedFiles.forEach((file) => {
          data.append('images', file);
        });

        // Also append any external URLs
        imageUrls.forEach((url) => {
          data.append('images', url);
        });

        const headers = { 'Content-Type': 'multipart/form-data' };
        if (isEditMode) {
          await api.put(`/items/${id}`, data, { headers });
          toast.success('Item updated successfully!');
        } else {
          await api.post('/items', data, { headers });
          toast.success('Item listed on BorrowBuddy!');
        }
      } else {
        // Plain JSON submission
        const payload = {
          ...formData,
          pricePerDay: Number(formData.pricePerDay) || 0,
          securityDeposit: Number(formData.securityDeposit) || 0,
          images: imageUrls,
        };

        if (isEditMode) {
          await api.put(`/items/${id}`, payload);
          toast.success('Item updated successfully!');
        } else {
          await api.post('/items', payload);
          toast.success('Item listed on BorrowBuddy!');
        }
      }

      navigate('/dashboard');
    } catch (error) {
      const msg = error.response?.data?.message || 'Failed to save item';
      toast.error(msg);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return <LoadingSpinner text="Loading item data..." />;
  }

  // Preview Image
  const previewImg =
    imageUrls.length > 0
      ? imageUrls[0]
      : 'https://images.unsplash.com/photo-1581291518857-4e27b48ff24e?auto=format&fit=crop&w=600&q=80';

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      <div>
        <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
          {isEditMode ? 'Edit Item Listing' : 'List an Item for Community Borrowing'}
        </h1>
        <p className="text-sm text-slate-500 mt-0.5">
          {isEditMode
            ? 'Update the terms, condition, and availability of your item'
            : 'Help neighbors and students nearby while keeping your item protected with verified passports'}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Form Column (8 cols) */}
        <form onSubmit={handleSubmit} className="lg:col-span-8 space-y-6">
          
          {/* Section 1: Basic Information */}
          <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-4">
            <h2 className="text-sm font-bold uppercase tracking-wider text-slate-900 border-b border-slate-100 pb-3">
              1. Basic Information
            </h2>

            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                Item Title *
              </label>
              <input
                type="text"
                name="title"
                required
                value={formData.title}
                onChange={handleInputChange}
                placeholder="e.g., Bosch Cordless Impact Drill Kit or Quechua 4-Person Tent"
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none text-slate-900"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                  Category *
                </label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none text-slate-900 bg-white"
                >
                  {ITEM_CATEGORIES.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                  Current Condition *
                </label>
                <select
                  name="condition"
                  value={formData.condition}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none text-slate-900 bg-white"
                >
                  {CONDITIONS.map((cond) => (
                    <option key={cond} value={cond}>
                      {cond}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                Description & What's Included *
              </label>
              <textarea
                name="description"
                required
                rows={4}
                value={formData.description}
                onChange={handleInputChange}
                placeholder="Detail what the item does, all cables, accessories, or bits included, and any special handling notes..."
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none text-slate-900 resize-none"
              />
            </div>
          </div>

          {/* Section 2: Location & Availability */}
          <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-4">
            <h2 className="text-sm font-bold uppercase tracking-wider text-slate-900 border-b border-slate-100 pb-3">
              2. Location & Availability
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                  City Hub *
                </label>
                <select
                  name="city"
                  value={formData.city}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none text-slate-900 bg-white"
                >
                  {CITIES.filter((c) => c !== 'All').map((city) => (
                    <option key={city} value={city}>
                      {city}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                  Locality / Neighborhood / Hostel *
                </label>
                <input
                  type="text"
                  name="locality"
                  required
                  value={formData.locality}
                  onChange={handleInputChange}
                  placeholder="e.g. Law Gate, Model Town, Sector 17"
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none text-slate-900"
                />
              </div>
            </div>

            {isEditMode && (
              <div className="pt-2">
                <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-slate-800">
                  <input
                    type="checkbox"
                    name="isAvailable"
                    checked={formData.isAvailable}
                    onChange={handleInputChange}
                    className="rounded border-slate-300 text-emerald-600 focus:ring-emerald-500"
                  />
                  <span>Mark as currently available for borrowing</span>
                </label>
              </div>
            )}
          </div>

          {/* Section 3: Pricing & Rules */}
          <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-4">
            <h2 className="text-sm font-bold uppercase tracking-wider text-slate-900 border-b border-slate-100 pb-3">
              3. Borrowing Terms & Pricing
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                  Price Per Day (₹)
                </label>
                <input
                  type="number"
                  name="pricePerDay"
                  min="0"
                  step="10"
                  value={formData.pricePerDay}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none text-slate-900"
                />
                <span className="text-[11px] text-slate-400 mt-1 block">
                  Set to 0 for Free Community Lending
                </span>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                  Refundable Security Deposit (₹, Optional)
                </label>
                <input
                  type="number"
                  name="securityDeposit"
                  min="0"
                  step="50"
                  value={formData.securityDeposit}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none text-slate-900"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                Borrowing Guidelines & Handling Rules
              </label>
              <textarea
                name="borrowingRules"
                rows={2}
                value={formData.borrowingRules}
                onChange={handleInputChange}
                placeholder="e.g. Do not use without safety glasses, return packed in original box..."
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none text-slate-900 resize-none"
              />
            </div>
          </div>

          {/* Section 4: Images */}
          <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-4">
            <h2 className="text-sm font-bold uppercase tracking-wider text-slate-900 border-b border-slate-100 pb-3">
              4. Photos of the Item
            </h2>

            {/* URL input */}
            <div className="space-y-2">
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider">
                Add Image by URL
              </label>
              <div className="flex gap-2">
                <input
                  type="url"
                  value={imageUrlInput}
                  onChange={(e) => setImageUrlInput(e.target.value)}
                  placeholder="https://images.unsplash.com/..."
                  className="flex-1 px-4 py-2 rounded-xl border border-slate-200 text-xs sm:text-sm focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none text-slate-900"
                />
                <button
                  type="button"
                  onClick={handleAddImageUrl}
                  className="px-4 py-2 rounded-xl bg-slate-900 text-white text-xs font-semibold hover:bg-slate-800 shrink-0"
                >
                  Add URL
                </button>
              </div>
            </div>

            {/* Local file upload option */}
            <div className="pt-2">
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                Or Upload from Computer
              </label>
              <input
                type="file"
                multiple
                accept="image/*"
                onChange={handleFileChange}
                className="block w-full text-xs text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-emerald-50 file:text-emerald-700 hover:file:bg-emerald-100 cursor-pointer"
              />
            </div>

            {/* Images List */}
            {imageUrls.length > 0 && (
              <div className="pt-2">
                <p className="text-xs font-medium text-slate-500 mb-2">Attached Images:</p>
                <div className="flex flex-wrap gap-3">
                  {imageUrls.map((url, idx) => (
                    <div key={idx} className="relative group w-20 h-20 rounded-xl overflow-hidden border">
                      <img src={url} alt="" className="w-full h-full object-cover" />
                      <button
                        type="button"
                        onClick={() => handleRemoveImageUrl(idx)}
                        className="absolute top-1 right-1 p-1 rounded-full bg-slate-900/80 text-white hover:bg-rose-600 transition-colors"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Submit Button */}
          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={() => navigate('/dashboard')}
              className="px-5 py-3 rounded-2xl border border-slate-200 text-sm font-semibold text-slate-700 hover:bg-slate-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="flex items-center gap-2 px-7 py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white text-sm font-bold shadow-lg shadow-emerald-600/25 transition-all active:scale-95"
            >
              {submitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Saving...</span>
                </>
              ) : (
                <>
                  <span>{isEditMode ? 'Update Listing' : 'Publish to BorrowBuddy'}</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </div>
        </form>

        {/* Live Preview Column (4 cols) */}
        <div className="lg:col-span-4 sticky top-24 space-y-3">
          <div className="flex items-center gap-1.5 text-xs font-bold text-slate-500 uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
            <span>Live Catalog Preview</span>
          </div>

          {/* Card Mockup */}
          <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-lg">
            <div className="relative aspect-[4/3] w-full bg-slate-100">
              <img
                src={previewImg}
                alt="Preview"
                className="w-full h-full object-cover"
              />
              <div className="absolute top-3 left-3 flex gap-1.5">
                <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-white text-slate-800 shadow">
                  {formData.category}
                </span>
                <span className="px-2 py-0.5 rounded-full text-[11px] font-medium bg-slate-900 text-white">
                  {formData.condition}
                </span>
              </div>
              <div className="absolute top-3 right-3">
                <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-500 text-white">
                  Available
                </span>
              </div>
            </div>

            <div className="p-5 space-y-3">
              <div className="flex items-center gap-1 text-xs text-slate-500">
                <MapPin className="w-3.5 h-3.5 text-emerald-600" />
                <span>
                  {formData.locality ? `${formData.locality}, ` : ''}{formData.city}
                </span>
              </div>
              <h4 className="font-bold text-slate-900 text-base line-clamp-1">
                {formData.title || 'Your Item Title'}
              </h4>
              <p className="text-xs text-slate-500 line-clamp-2">
                {formData.description || 'Description will appear here as you type.'}
              </p>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                <div>
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">
                    Rate
                  </span>
                  <span className="text-base font-extrabold text-slate-900">
                    {Number(formData.pricePerDay) === 0
                      ? 'Free'
                      : `₹${Number(formData.pricePerDay)} / day`}
                  </span>
                </div>
                <span className="px-3 py-1.5 rounded-xl bg-slate-900 text-white text-xs font-semibold">
                  View Details
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddEditItem;
