import { useState, useMemo, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../utils/api';
import useText from '../hooks/useText';
import { useNews } from '../context/NewsContext';
import BackButton from '../components/BackButton';

const CreateNews = () => {
  const navigate = useNavigate();
  const pageTitle = useText('Create news');
  // text constants defined above
  const autoTranslateNote = useText('Create a post; it will be translated to all languages automatically.');
  const labelCategory = useText('Category');
  const labelImage = useText('Image');
  const labelPublished = useText('Published');
  const btnRemoveImage = useText('Remove image');
  const btnLoading = useText('Loading...');
  const btnSubmit = useText('Submit');
  const btnCancel = useText('Cancel');
  // form state
  const { news, fetchNews } = useNews();
  const categories = useMemo(() => [...new Set(news.map(n => n.category).filter(Boolean))], [news]);
  const [showCustomCat, setShowCustomCat] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    subHeading: '',
    content: '',
    baseLanguage: 'mr',
    location: '',
    category: '',
    published: false,
    isFeatured: false,
  });
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [translating, setTranslating] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (news.length === 0) fetchNews();
  }, [news, fetchNews]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (name === 'category') {
      if (value === '__other__') {
        setShowCustomCat(true);
        setFormData({ ...formData, category: '' });
        return;
      } else {
        setShowCustomCat(false);
      }
    }
    setFormData({ ...formData, [name]: type === 'checkbox' ? checked : value });
    setError('');
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      const reader = new FileReader();
      reader.onloadend = () => setImagePreview(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const removeImage = () => {
    setImage(null);
    setImagePreview(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (!formData.title || !formData.content || !formData.location || !formData.category) {
      setError('Please fill all required fields');
      return;
    }
    setLoading(true);
    setTranslating(true);
    try {
      const formDataToSend = new FormData();
      formDataToSend.append('title', formData.title);
      formDataToSend.append('subHeading', formData.subHeading || '');
      formDataToSend.append('content', formData.content);
      formDataToSend.append('baseLanguage', formData.baseLanguage);
      formDataToSend.append('location', formData.location);
      formDataToSend.append('category', formData.category);
      formDataToSend.append('published', formData.published);
      formDataToSend.append('isFeatured', formData.isFeatured);
      if (image) formDataToSend.append('image', image);

      await api.post('/news', formDataToSend);
      setTranslating(false);
      navigate('/dashboard/manage');
    } catch (err) {
      setTranslating(false);
      setError(err.response?.data?.message || 'Failed to create news post');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-white dark:bg-zinc-950 py-8 lg:py-10">
      <div className="container-editorial max-w-2xl">
        <div className="mb-6">
          <BackButton to="/dashboard/manage" label="Cancel & Back" />
        </div>
        <h1 className="font-serif font-bold text-editorial-black text-2xl sm:text-3xl border-b-2 border-editorial-red pb-2 mb-2">
          {pageTitle || 'Create news'}
        </h1>
        <p className="text-sm text-editorial-muted mb-6">
          {autoTranslateNote}
        </p>

        {error && (
          <div className="border border-editorial-red bg-editorial-red-muted text-editorial-red-dark px-4 py-3 mb-6">
            {error}
          </div>
        )}

        {translating && (
          <div className="border border-editorial-border bg-neutral-50 px-4 py-4 mb-6 flex items-center gap-3">
            <div className="w-6 h-6 border-2 border-editorial-border border-t-editorial-red rounded-full animate-spin shrink-0" />
            <div>
              <p className="font-medium text-sm text-editorial-ink">Translating to all languages...</p>
              <p className="text-caption text-editorial-muted">Please wait.</p>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="card-editorial p-6 sm:p-8">
          <div className="mb-6 border border-editorial-border bg-neutral-50 px-4 py-3 text-sm text-editorial-ink">
            <strong>Auto-translation:</strong> Write in one language; the system will translate to English, Hindi, and Marathi.
          </div>

          <div className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-editorial-ink mb-2">Write in language <span className="text-editorial-red">*</span></label>
              <select name="baseLanguage" value={formData.baseLanguage} onChange={handleChange} required className="input-editorial">
                <option value="en">English</option>
                <option value="hi">Hindi</option>
                <option value="mr">Marathi</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-editorial-ink mb-2">Title <span className="text-editorial-red">*</span></label>
              <input type="text" name="title" value={formData.title} onChange={handleChange} required placeholder="Enter headline" className="input-editorial" />
            </div>
            <div>
              <label className="block text-sm font-medium text-editorial-ink mb-2">Sub-heading <span className="text-editorial-muted text-xs">(optional)</span></label>
              <input type="text" name="subHeading" value={formData.subHeading} onChange={handleChange} placeholder="Optional" className="input-editorial" />
            </div>
            <div>
              <label className="block text-sm font-medium text-editorial-ink mb-2">Content <span className="text-editorial-red">*</span></label>
              <textarea name="content" value={formData.content} onChange={handleChange} required rows={6} placeholder="Write your article..." className="input-editorial resize-y" />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <label className="block text-sm font-medium text-editorial-ink mb-2">Location <span className="text-editorial-red">*</span></label>
                <select name="location" value={formData.location} onChange={handleChange} required className="input-editorial">
                  <option value="">Select</option>
                  <option value="maharashtra">Maharashtra</option>
                  <option value="chandrapur">Chandrapur</option>
                  <option value="korpana">Korpana</option>
                  <option value="rajura">Rajura</option>
                  <option value="national">National</option>
                  <option value="international">International</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-editorial-ink mb-2">{labelCategory} <span className="text-editorial-red">*</span></label>
                {!showCustomCat ? (
                  <select name="category" value={formData.category} onChange={handleChange} required className="input-editorial">
                    <option value="">Select</option>
                    {categories.map((c) => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                    <option value="__other__">Other</option>
                  </select>
                ) : (
                  <input type="text" name="category" value={formData.category} onChange={handleChange} required placeholder="Enter category" className="input-editorial" />
                )}
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-editorial-ink mb-2">{labelImage}</label>
              {imagePreview ? (
                <div className="space-y-2">
                  <img src={imagePreview} alt="Preview" className="max-w-xs h-48 object-cover border border-editorial-border" />
                  <button type="button" onClick={removeImage} className="btn-editorial-outline text-sm py-2">
                    {btnRemoveImage}
                  </button>
                </div>
              ) : (
                <label className="flex flex-col items-center justify-center border-2 border-dashed border-editorial-border p-8 cursor-pointer hover:border-editorial-muted transition-colors">
                  <input type="file" accept="image/*" onChange={handleImageChange} className="hidden" />
                  <span className="text-sm text-editorial-muted">Click to upload image (optional)</span>
                </label>
              )}
            </div>
            <div className="flex flex-col sm:flex-row gap-4 py-2 border-y border-editorial-border my-4">
              <div className="flex items-center gap-3">
                <input type="checkbox" name="published" id="published" checked={formData.published} onChange={handleChange} className="w-4 h-4 border-editorial-border text-editorial-red focus:ring-editorial-red" />
                <label htmlFor="published" className="text-sm font-medium text-editorial-ink">{labelPublished}</label>
              </div>
              <div className="flex items-center gap-3">
                <input type="checkbox" name="isFeatured" id="isFeatured" checked={formData.isFeatured} onChange={handleChange} className="w-4 h-4 border-editorial-border text-editorial-red focus:ring-editorial-red" />
                <label htmlFor="isFeatured" className="text-sm font-medium text-editorial-red font-bold uppercase tracking-wider">⭐ Featured News</label>
              </div>
            </div>
            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <button type="submit" disabled={loading || translating} className="btn-editorial flex-1 py-3">
                {loading || translating ? (
                  <span className="flex items-center justify-center gap-2">
                    <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    {btnLoading}
                  </span>
                ) : (
                  btnSubmit
                )}
              </button>
              <button type="button" onClick={() => navigate('/dashboard/manage')} className="btn-editorial-outline flex-1 py-3">
                {btnCancel}
              </button>
            </div>
          </div>
        </form>
      </div>
    </main>
  );
};

export default CreateNews;
