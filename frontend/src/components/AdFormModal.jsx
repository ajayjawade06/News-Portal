import { useState, useEffect, useRef } from 'react';
import { X, Upload, Save, Eye, Code } from 'lucide-react';
import api from '../utils/api';
import { API_BASE_URL } from '../config';

const AdFormModal = ({ ad, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    title: '',
    type: 'image',
    content: '',
    targetLink: '',
    placement: 'header',
    startDate: '',
    endDate: '',
    isActive: true,
    priority: 0,
    plan: 'none',
    price: 0
  });

  const [imageFile, setImageFile] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const dialogRef = useRef(null);

  useEffect(() => {
    if (ad) {
      setFormData({
        title: ad.title || '',
        type: ad.type || 'image',
        content: ad.content || '',
        targetLink: ad.targetLink || '',
        placement: ad.placement || 'header',
        startDate: ad.startDate ? new Date(ad.startDate).toISOString().slice(0, 16) : '',
        endDate: ad.endDate ? new Date(ad.endDate).toISOString().slice(0, 16) : '',
        isActive: ad.isActive !== undefined ? ad.isActive : true,
        priority: ad.priority || 0,
        plan: ad.plan || 'none',
        price: ad.price || 0
      });

      if (ad.type === 'image' && ad.content) {
        setPreviewImage(ad.content.startsWith('http') ? ad.content : `${API_BASE_URL}${ad.content}`);
      }
    }
  }, [ad]);

  // Click outside to close
  useEffect(() => {
    const handleOutsideClick = (e) => {
      if (dialogRef.current && !dialogRef.current.contains(e.target)) {
        onClose();
      }
    };
    document.addEventListener('mousedown', handleOutsideClick);
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, [onClose]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const data = new FormData();
      
      // Append all text fields
      Object.keys(formData).forEach(key => {
        if (key === 'content') {
           if (formData.type === 'script') {
               data.append(key, formData[key]);
           } else if (ad && ad.type === 'image' && !imageFile) {
               // keep existing image path if not updating image
               data.append(key, formData[key]);
           }
        } else {
             data.append(key, formData[key]);
        }
      });

      // Append image if type is image and a file is selected
      if (formData.type === 'image' && imageFile) {
        data.append('image', imageFile);
      } else if (formData.type === 'image' && !imageFile && !ad) {
        throw new Error('Please select an image for banner ads');
      }

      if (ad) {
        await api.put(`/ads/${ad._id}`, data, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
      } else {
        await api.post('/ads', data, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
      }

      onSave();
    } catch (err) {
      console.error('Error saving ad:', err);
      setError(err.response?.data?.message || err.message || 'Failed to save advertisement');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 text-editorial-black overflow-y-auto bg-black/50 backdrop-blur-sm">
      <div 
        ref={dialogRef}
        className="relative w-full max-w-2xl bg-white dark:bg-zinc-900 rounded-lg shadow-2xl border border-editorial-border dark:border-zinc-800 my-8 flex flex-col max-h-[90vh]"
      >
        <div className="sticky top-0 z-10 flex items-center justify-between px-6 py-4 border-b border-editorial-border bg-white dark:bg-zinc-900 rounded-t-lg">
          <h2 className="text-xl font-serif font-bold dark:text-zinc-100">
            {ad ? 'Edit Advertisement' : 'Create Advertisement'}
          </h2>
          <button 
            onClick={onClose}
            className="p-2 text-editorial-muted hover:text-editorial-black hover:bg-neutral-100 rounded-full transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        <div className="p-6 overflow-y-auto custom-scrollbar">
          {error && (
            <div className="bg-red-50 text-red-600 p-3 rounded mb-6 text-sm">
              {error}
            </div>
          )}

          <form id="ad-form" onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {/* Title */}
              <div className="space-y-1 sm:col-span-2">
                <label className="text-sm font-medium text-editorial-black dark:text-zinc-300">
                  Ad Title (Internal Reference) *
                </label>
                <input
                  type="text"
                  name="title"
                  required
                  value={formData.title}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-editorial-border rounded bg-transparent focus:ring-1 focus:ring-editorial-red focus:border-editorial-red transition-colors dark:text-zinc-100"
                  placeholder="e.g., Summer Sale Header Banner"
                />
              </div>

              {/* Placement */}
              <div className="space-y-1">
                <label className="text-sm font-medium text-editorial-black dark:text-zinc-300">
                  Placement *
                </label>
                <select
                  name="placement"
                  required
                  value={formData.placement}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-editorial-border rounded bg-transparent focus:ring-1 focus:ring-editorial-red focus:border-editorial-red transition-colors dark:text-zinc-100 dark:bg-zinc-900"
                >
                  <option value="header">Header (728x90)</option>
                  <option value="sidebar">Sidebar (300x250 or vertical)</option>
                  <option value="inline">Inline (Between articles)</option>
                  <option value="footer">Footer</option>
                  <option value="popup">Popup / Overlay</option>
                </select>
              </div>

              {/* Priority */}
              <div className="space-y-1">
                <label className="text-sm font-medium text-editorial-black dark:text-zinc-300">
                  Priority (Higher shows first)
                </label>
                <input
                  type="number"
                  name="priority"
                  value={formData.priority}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-editorial-border rounded bg-transparent focus:ring-1 focus:ring-editorial-red focus:border-editorial-red transition-colors dark:text-zinc-100"
                  min="0"
                />
              </div>

              {/* Start Date */}
              <div className="space-y-1">
                <label className="text-sm font-medium text-editorial-black dark:text-zinc-300">
                  Start Date (Optional)
                </label>
                <input
                  type="datetime-local"
                  name="startDate"
                  value={formData.startDate}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-editorial-border rounded bg-transparent focus:ring-1 focus:ring-editorial-red focus:border-editorial-red transition-colors dark:text-zinc-100"
                />
              </div>

              {/* End Date */}
              <div className="space-y-1">
                <label className="text-sm font-medium text-editorial-black dark:text-zinc-300">
                  End Date (Optional)
                </label>
                <input
                  type="datetime-local"
                  name="endDate"
                  value={formData.endDate}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-editorial-border rounded bg-transparent focus:ring-1 focus:ring-editorial-red focus:border-editorial-red transition-colors dark:text-zinc-100"
                />
              </div>

              {/* Plan */}
              <div className="space-y-1">
                <label className="text-sm font-medium text-editorial-black dark:text-zinc-300">
                  Ad Plan *
                </label>
                <select
                  name="plan"
                  required
                  value={formData.plan}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-editorial-border rounded bg-transparent focus:ring-1 focus:ring-editorial-red focus:border-editorial-red transition-colors dark:text-zinc-100 dark:bg-zinc-900"
                >
                  <option value="none">None / House Ad</option>
                  <option value="basic">Basic (₹999)</option>
                  <option value="standard">Standard (₹2499)</option>
                  <option value="premium">Premium (₹4999)</option>
                  <option value="enterprise">Enterprise (Custom)</option>
                </select>
              </div>

              {/* Revenue (Price) */}
              <div className="space-y-1">
                <label className="text-sm font-medium text-editorial-black dark:text-zinc-300">
                  Revenue (₹ Price)
                </label>
                <input
                  type="number"
                  name="price"
                  value={formData.price}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-editorial-border rounded bg-transparent focus:ring-1 focus:ring-editorial-red focus:border-editorial-red transition-colors dark:text-zinc-100"
                  min="0"
                  placeholder="e.g. 4999"
                />
                <p className="text-[10px] text-editorial-muted">This amount contributes to analytics revenue.</p>
              </div>
            </div>

            {/* Type Toggle */}
            <div className="pt-4 border-t border-editorial-border">
              <label className="text-sm font-medium text-editorial-black dark:text-zinc-300 mb-3 block">
                Ad Type *
              </label>
              <div className="flex bg-neutral-100 dark:bg-zinc-800 p-1 rounded-md w-fit">
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, type: 'image' })}
                  className={`px-4 py-2 rounded text-sm font-medium transition-colors flex items-center gap-2 ${
                    formData.type === 'image' 
                      ? 'bg-white dark:bg-zinc-700 shadow-sm text-editorial-black dark:text-zinc-100' 
                      : 'text-editorial-muted hover:text-editorial-black'
                  }`}
                >
                  <Eye size={16} /> Image Banner
                </button>
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, type: 'script' })}
                  className={`px-4 py-2 rounded text-sm font-medium transition-colors flex items-center gap-2 ${
                    formData.type === 'script' 
                      ? 'bg-white dark:bg-zinc-700 shadow-sm text-editorial-black dark:text-zinc-100' 
                      : 'text-editorial-muted hover:text-editorial-black'
                  }`}
                >
                  <Code size={16} /> Custom Script / HTML
                </button>
              </div>
            </div>

            {/* Content Based on Type */}
            {formData.type === 'image' ? (
              <div className="space-y-4">
                <div className="space-y-1">
                  <label className="text-sm font-medium text-editorial-black dark:text-zinc-300">
                    Banner Image *
                  </label>
                  
                  <div className="border-2 border-dashed border-editorial-border rounded-lg p-6 flex flex-col items-center justify-center bg-neutral-50 dark:bg-zinc-800/50 hover:bg-neutral-100 transition-colors cursor-pointer relative">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    />
                    
                    {previewImage ? (
                      <div className="relative w-full max-h-48 flex justify-center">
                        <img 
                          src={previewImage} 
                          alt="Ad preview" 
                          className="max-h-48 object-contain rounded"
                        />
                        <div className="absolute inset-x-0 bottom-0 bg-black/60 text-white text-xs py-2 text-center opacity-0 hover:opacity-100 transition-opacity">
                          Click or drag to change image
                        </div>
                      </div>
                    ) : (
                      <div className="flex flex-col items-center text-center">
                        <div className="w-12 h-12 rounded-full bg-editorial-red/10 text-editorial-red flex items-center justify-center mb-3">
                          <Upload size={24} />
                        </div>
                        <p className="font-medium text-editorial-black dark:text-zinc-300">Click to upload banner image</p>
                        <p className="text-xs text-editorial-muted mt-1">PNG, JPG, GIF up to 5MB</p>
                      </div>
                    )}
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-sm font-medium text-editorial-black dark:text-zinc-300">
                    Target URL (Optional)
                  </label>
                  <input
                    type="url"
                    name="targetLink"
                    value={formData.targetLink}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-editorial-border rounded bg-transparent focus:ring-1 focus:ring-editorial-red focus:border-editorial-red transition-colors dark:text-zinc-100"
                    placeholder="https://example.com/promotion"
                  />
                  <p className="text-xs text-editorial-muted">Url the user is redirected to when they click the banner.</p>
                </div>
              </div>
            ) : (
              <div className="space-y-1">
                <label className="text-sm font-medium text-editorial-black dark:text-zinc-300">
                  Custom Script / HTML *
                </label>
                <textarea
                  name="content"
                  required
                  value={formData.content}
                  onChange={handleChange}
                  rows={8}
                  className="w-full px-4 py-2 border border-editorial-border rounded bg-neutral-900 text-neutral-100 focus:ring-1 focus:ring-editorial-red focus:border-editorial-red transition-colors font-mono text-sm"
                  placeholder="<!-- Insert AdSense or other ad network code here -->\n<ins class='adsbygoogle' ...></ins>"
                />
                <p className="text-xs text-editorial-muted">This code will be injected directly into the selected placement area.</p>
              </div>
            )}

            {/* Active Toggle */}
            <div className="flex items-center gap-3 pt-2">
              <label className="relative inline-flex items-center cursor-pointer">
                <input 
                  type="checkbox" 
                  name="isActive"
                  checked={formData.isActive}
                  onChange={handleChange}
                  className="sr-only peer" 
                />
                <div className="w-11 h-6 bg-neutral-200 peer-focus:outline-none rounded-full peer dark:bg-zinc-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-editorial-red"></div>
                <span className="ml-3 text-sm font-medium text-editorial-black dark:text-zinc-300">
                  Active (show this ad)
                </span>
              </label>
            </div>
          </form>
        </div>

        <div className="sticky bottom-0 z-10 p-4 sm:px-6 bg-neutral-50 dark:bg-zinc-800/90 border-t border-editorial-border rounded-b-lg flex justify-end gap-3 backdrop-blur mt-auto">
          <button
            type="button"
            onClick={onClose}
            className="btn-editorial-outline px-6 py-2"
            disabled={loading}
          >
            Cancel
          </button>
          <button
            type="submit"
            form="ad-form"
            className="btn-editorial px-6 py-2 flex items-center gap-2"
            disabled={loading}
          >
            {loading ? (
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <Save size={18} />
            )}
            {loading ? 'Saving...' : 'Save Advertisement'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdFormModal;
