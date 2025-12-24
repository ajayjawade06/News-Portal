import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import api from '../utils/api';
import { IMAGE_BASE_URL } from '../config';

const EditNews = () => {
  const { id } = useParams();
  const { t } = useTranslation();
  const navigate = useNavigate();
  // Simplified form: Reporter writes in ONE language only
  // Auto-translation happens on backend
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    baseLanguage: 'en', // Language reporter writes in
    coverage: '',
    category: '',
    published: false
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
        
        // Load news using baseLanguage (or default to 'en' for backward compatibility)
        const baseLang = news.baseLanguage || 'en';
        
        setFormData({
          title: news.title[baseLang] || news.title.en || '',
          content: news.content[baseLang] || news.content.en || '',
          baseLanguage: baseLang,
          coverage: news.coverage,
          category: news.category,
          published: news.published
        });

        if (news.image) {
          setExistingImage(news.image);
        }
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to fetch news');
      } finally {
        setFetching(false);
      }
    };

    fetchNews();
  }, [id]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
    setError('');
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      setExistingImage(null);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
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

    // Validation: Only need title, content, coverage, category
    if (!formData.title || !formData.content || !formData.coverage || !formData.category) {
      setError('Please fill all required fields');
      return;
    }

    setLoading(true);

    try {
      // Simplified FormData: Only send single language input
      // Backend will auto-translate to all languages
      const formDataToSend = new FormData();
      formDataToSend.append('title', formData.title);
      formDataToSend.append('content', formData.content);
      formDataToSend.append('baseLanguage', formData.baseLanguage);
      formDataToSend.append('coverage', formData.coverage);
      formDataToSend.append('category', formData.category);
      formDataToSend.append('published', formData.published);

      if (image) {
        formDataToSend.append('image', image);
      }

      await api.put(`/news/${id}`, formDataToSend, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      navigate('/dashboard/manage');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update news post');
    } finally {
      setLoading(false);
    }
  };

  if (fetching) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <p className="text-gray-600">{t('common.loading')}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <h1 className="text-3xl font-bold mb-6">{t('form.editTitle')}</h1>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-md">
        {/* Info Banner: Auto-translation feature */}
        <div className="mb-6 bg-blue-50 border border-blue-200 text-blue-800 px-4 py-3 rounded">
          <p className="text-sm">
            <strong>Auto-Translation:</strong> Edit your news in one language. 
            The system will automatically re-translate it to all languages when you save.
          </p>
        </div>

        {/* Base Language Selection */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Write in Language <span className="text-red-500">*</span>
          </label>
          <select
            name="baseLanguage"
            value={formData.baseLanguage}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500"
          >
            <option value="en">English</option>
            <option value="hi">Hindi (हिंदी)</option>
            <option value="mr">Marathi (मराठी)</option>
          </select>
          <p className="text-xs text-gray-500 mt-1">
            Select the language you want to edit in. Other languages will be auto-translated.
          </p>
        </div>

        {/* Single Title Field */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Title <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            required
            placeholder="Enter news title"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500"
          />
        </div>

        {/* Single Content Field */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Content <span className="text-red-500">*</span>
          </label>
          <textarea
            name="content"
            value={formData.content}
            onChange={handleChange}
            required
            rows="8"
            placeholder="Write your news content here..."
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500"
          />
        </div>

        {/* Coverage and Category */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {t('form.coverage')} <span className="text-red-500">*</span>
            </label>
            <select
              name="coverage"
              value={formData.coverage}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500"
            >
              <option value="">{t('form.selectCoverage')}</option>
              <option value="local">Local</option>
              <option value="national">National</option>
              <option value="international">International</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {t('form.category')} <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="category"
              value={formData.category}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500"
            />
          </div>
        </div>

        {/* Image Upload */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            {t('form.image')}
          </label>
          {imagePreview ? (
            <div className="mb-2">
              <img
                src={imagePreview}
                alt="Preview"
                className="max-w-xs h-48 object-cover rounded"
              />
              <button
                type="button"
                onClick={removeImage}
                className="mt-2 text-red-600 hover:text-red-800 text-sm"
              >
                {t('form.removeImage')}
              </button>
            </div>
          ) : existingImage ? (
            <div className="mb-2">
              <img
                src={`${IMAGE_BASE_URL}${existingImage}`}
                alt="Current"
                className="max-w-xs h-48 object-cover rounded"
              />
              <button
                type="button"
                onClick={removeImage}
                className="mt-2 text-red-600 hover:text-red-800 text-sm"
              >
                {t('form.removeImage')}
              </button>
            </div>
          ) : (
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500"
            />
          )}
        </div>

        {/* Published Checkbox */}
        <div className="mb-6">
          <label className="flex items-center">
            <input
              type="checkbox"
              name="published"
              checked={formData.published}
              onChange={handleChange}
              className="mr-2"
            />
            <span className="text-sm font-medium text-gray-700">
              {t('form.published')}
            </span>
          </label>
        </div>

        {/* Submit Button */}
        <div className="flex space-x-4">
          <button
            type="submit"
            disabled={loading}
            className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 disabled:opacity-50"
          >
            {loading ? t('common.loading') : t('common.save')}
          </button>
          <button
            type="button"
            onClick={() => navigate('/dashboard/manage')}
            className="bg-gray-600 text-white px-6 py-2 rounded-md hover:bg-gray-700"
          >
            {t('common.cancel')}
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditNews;

