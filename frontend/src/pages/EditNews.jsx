import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import api from '../utils/api';
import { IMAGE_BASE_URL } from '../config';

const EditNews = () => {
  const { id } = useParams();
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: '',
    subHeading: '',
    content: '',
    baseLanguage: 'en',
    location: '',
    category: '',
    published: false,
  });
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [existingImage, setExistingImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchNews = async () => {
      try {
        const response = await api.get(`/news/${id}`);
        const news = response.data.data;
        const baseLang = news.baseLanguage || 'en';
        setFormData({
          title: news.title[baseLang] || news.title.en || '',
          subHeading: news.subHeading?.[baseLang] || news.subHeading?.en || '',
          content: news.content[baseLang] || news.content.en || '',
          baseLanguage: baseLang,
          location: news.location || news.coverage || '',
          category: news.category,
          published: news.published,
        });
        if (news.image) setExistingImage(news.image);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to fetch article');
      } finally {
        setFetching(false);
      }
    };
    fetchNews();
  }, [id]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({ ...formData, [name]: type === 'checkbox' ? checked : value });
    setError('');
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      setExistingImage(null);
      const reader = new FileReader();
      reader.onloadend = () => setImagePreview(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const removeImage = () => {
    setImage(null);
    setImagePreview(null);
    setExistingImage(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (!formData.title || !formData.content || !formData.location || !formData.category) {
      setError('Please fill all required fields');
      return;
    }
    setLoading(true);
    try {
      const formDataToSend = new FormData();
      formDataToSend.append('title', formData.title);
      formDataToSend.append('subHeading', formData.subHeading || '');
      formDataToSend.append('content', formData.content);
      formDataToSend.append('baseLanguage', formData.baseLanguage);
      formDataToSend.append('location', formData.location);
      formDataToSend.append('category', formData.category);
      formDataToSend.append('published', formData.published);
      if (image) formDataToSend.append('image', image);

      await api.put(`/news/${id}`, formDataToSend, { headers: { 'Content-Type': 'multipart/form-data' } });
      navigate('/dashboard/manage');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update article');
    } finally {
      setLoading(false);
    }
  };

  if (fetching) {
    return (
      <main className="min-h-[50vh] flex items-center justify-center py-20 bg-white dark:bg-zinc-950">
        <div className="w-10 h-10 border-2 border-editorial-border border-t-editorial-red rounded-full animate-spin" />
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-white dark:bg-zinc-950 py-8 lg:py-10">
      <div className="container-editorial max-w-2xl">
        <h1 className="font-serif font-bold text-editorial-black text-2xl border-b-2 border-editorial-red pb-2 mb-6">
          {t('form.editTitle')}
        </h1>

        {error && (
          <div className="border border-editorial-red bg-editorial-red-muted text-editorial-red-dark px-4 py-3 mb-6">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="card-editorial p-6 sm:p-8">
          <div className="mb-6 border border-editorial-border bg-neutral-50 px-4 py-3 text-sm text-editorial-ink">
            Edits will be re-translated to all languages when you save.
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
              <input type="text" name="title" value={formData.title} onChange={handleChange} required className="input-editorial" />
            </div>
            <div>
              <label className="block text-sm font-medium text-editorial-ink mb-2">Sub-heading <span className="text-editorial-muted text-xs">(optional)</span></label>
              <input type="text" name="subHeading" value={formData.subHeading} onChange={handleChange} className="input-editorial" />
            </div>
            <div>
              <label className="block text-sm font-medium text-editorial-ink mb-2">Content <span className="text-editorial-red">*</span></label>
              <textarea name="content" value={formData.content} onChange={handleChange} required rows={8} className="input-editorial resize-y" />
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
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-editorial-ink mb-2">{t('form.category')} <span className="text-editorial-red">*</span></label>
                <input type="text" name="category" value={formData.category} onChange={handleChange} required className="input-editorial" />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-editorial-ink mb-2">{t('form.image')}</label>
              {imagePreview ? (
                <div className="space-y-2">
                  <img src={imagePreview} alt="Preview" className="max-w-xs h-48 object-cover border border-editorial-border" />
                  <button type="button" onClick={removeImage} className="btn-editorial-outline text-sm py-2">{t('form.removeImage')}</button>
                </div>
              ) : existingImage ? (
                <div className="space-y-2">
                  <img src={`${IMAGE_BASE_URL}${existingImage}`} alt="Current" className="max-w-xs h-48 object-cover border border-editorial-border" />
                  <button type="button" onClick={removeImage} className="btn-editorial-outline text-sm py-2">{t('form.removeImage')}</button>
                </div>
              ) : (
                <label className="flex flex-col items-center justify-center border-2 border-dashed border-editorial-border p-6 cursor-pointer">
                  <input type="file" accept="image/*" onChange={handleImageChange} className="hidden" />
                  <span className="text-sm text-editorial-muted">Choose new image (optional)</span>
                </label>
              )}
            </div>
            <div className="flex items-center gap-3 py-2">
              <input type="checkbox" name="published" checked={formData.published} onChange={handleChange} className="w-4 h-4 border-editorial-border text-editorial-red focus:ring-editorial-red" />
              <label className="text-sm font-medium text-editorial-ink">{t('form.published')}</label>
            </div>
            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <button type="submit" disabled={loading} className="btn-editorial flex-1 py-3">
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    {t('common.loading')}
                  </span>
                ) : (
                  t('common.save')
                )}
              </button>
              <button type="button" onClick={() => navigate('/dashboard/manage')} className="btn-editorial-outline flex-1 py-3">
                {t('common.cancel')}
              </button>
            </div>
          </div>
        </form>
      </div>
    </main>
  );
};

export default EditNews;
