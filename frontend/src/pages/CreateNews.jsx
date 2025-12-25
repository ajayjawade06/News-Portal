import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import api from '../utils/api';

const CreateNews = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  // Simplified form: Reporter writes in ONE language only
  // Auto-translation happens on backend
  const [formData, setFormData] = useState({
    title: '',
    subHeading: '', // Optional sub-heading for additional context
    content: '',
    baseLanguage: 'en', // Language reporter writes in
    location: '', // Location-based coverage (replaces old coverage field)
    category: '',
    published: false
  });
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [translating, setTranslating] = useState(false);
  const [error, setError] = useState('');

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
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Validation: Only need title, content, location, category
    if (!formData.title || !formData.content || !formData.location || !formData.category) {
      setError('Please fill all required fields');
      return;
    }

    setLoading(true);
    setTranslating(true);
    setError('');

    try {
      // Simplified FormData: Only send single language input
      // Backend will auto-translate to all languages automatically
      const formDataToSend = new FormData();
      formDataToSend.append('title', formData.title);
      formDataToSend.append('subHeading', formData.subHeading || '');
      formDataToSend.append('content', formData.content);
      formDataToSend.append('baseLanguage', formData.baseLanguage);
      formDataToSend.append('location', formData.location);
      formDataToSend.append('category', formData.category);
      formDataToSend.append('published', formData.published);

      if (image) {
        formDataToSend.append('image', image);
      }

      // Backend automatically translates to all languages (en, hi, mr)
      const response = await api.post('/news', formDataToSend, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

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
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-indigo-50/30 py-4 sm:py-6 lg:py-8">
      <div className="container mx-auto px-3 sm:px-4 max-w-4xl">
        <div className="mb-4 sm:mb-6 lg:mb-8">
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-800 mb-1 sm:mb-2">{t('form.title')}</h1>
          <p className="text-sm sm:text-base text-gray-600">Create a news post and let AI translate it automatically</p>
        </div>

        {error && (
          <div className="bg-red-50 border-l-4 border-red-500 text-red-700 px-4 py-3 rounded-lg mb-6 flex items-center space-x-2">
            <span>⚠️</span>
            <span>{error}</span>
          </div>
        )}

        {translating && (
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border-l-4 border-blue-500 text-blue-800 px-6 py-4 rounded-lg mb-6 flex items-center space-x-3 shadow-md">
            <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-blue-600"></div>
            <div>
              <p className="font-semibold">🔄 Translating your news to all languages...</p>
              <p className="text-sm mt-1 text-blue-600">This may take a few seconds. Please wait.</p>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="bg-white p-4 sm:p-6 lg:p-8 rounded-xl sm:rounded-2xl shadow-lg sm:shadow-xl border border-gray-100">
          {/* Info Banner: Auto-translation feature */}
          <div className="mb-4 sm:mb-6 lg:mb-8 bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 text-blue-800 px-4 sm:px-6 py-3 sm:py-4 rounded-lg sm:rounded-xl flex items-start space-x-2 sm:space-x-3">
            <span className="text-xl sm:text-2xl flex-shrink-0">✨</span>
            <div>
              <p className="font-semibold mb-1 text-sm sm:text-base">Auto-Translation Enabled</p>
              <p className="text-xs sm:text-sm">
                Write your news in one language. The system will automatically translate it to English, Hindi, and Marathi.
              </p>
            </div>
          </div>

        {/* Base Language Selection */}
        <div className="mb-4 sm:mb-6">
          <label className="block text-sm font-semibold text-gray-700 mb-2 sm:mb-3">
            Write in Language <span className="text-red-500">*</span>
          </label>
          <select
            name="baseLanguage"
            value={formData.baseLanguage}
            onChange={handleChange}
            required
            className="w-full px-3 sm:px-4 py-2.5 sm:py-3 text-base border-2 border-gray-300 rounded-lg sm:rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white touch-manipulation"
          >
            <option value="en">🇬🇧 English</option>
            <option value="hi">🇮🇳 Hindi (हिंदी)</option>
            <option value="mr">🇮🇳 Marathi (मराठी)</option>
          </select>
          <p className="text-xs text-gray-500 mt-2 flex items-center space-x-1">
            <span>💡</span>
            <span>Select the language you want to write in. Other languages will be auto-translated.</span>
          </p>
        </div>

        {/* Single Title Field */}
        <div className="mb-4 sm:mb-6">
          <label className="block text-sm font-semibold text-gray-700 mb-2 sm:mb-3">
            Title <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            required
            placeholder="Enter news title"
            className="w-full px-3 sm:px-4 py-2.5 sm:py-3 text-base border-2 border-gray-300 rounded-lg sm:rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
          />
        </div>

        {/* Sub-Heading Field (Optional) */}
        <div className="mb-4 sm:mb-6">
          <label className="block text-sm font-semibold text-gray-700 mb-2 sm:mb-3">
            Sub-Heading <span className="text-gray-400 text-xs">(Optional)</span>
          </label>
          <input
            type="text"
            name="subHeading"
            value={formData.subHeading}
            onChange={handleChange}
            placeholder="Enter sub-heading for additional context"
            className="w-full px-3 sm:px-4 py-2.5 sm:py-3 text-base border-2 border-gray-300 rounded-lg sm:rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
          />
          <p className="text-xs text-gray-500 mt-2 flex items-center space-x-1">
            <span>💡</span>
            <span>Sub-heading provides additional context below the title and improves readability.</span>
          </p>
        </div>

        {/* Single Content Field */}
        <div className="mb-4 sm:mb-6">
          <label className="block text-sm font-semibold text-gray-700 mb-2 sm:mb-3">
            Content <span className="text-red-500">*</span>
          </label>
          <textarea
            name="content"
            value={formData.content}
            onChange={handleChange}
            required
            rows="8"
            placeholder="Write your news content here..."
            className="w-full px-3 sm:px-4 py-2.5 sm:py-3 text-base border-2 border-gray-300 rounded-lg sm:rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 resize-y"
          />
        </div>

        {/* Location and Category */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 mb-4 sm:mb-6">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2 sm:mb-3">
              Location <span className="text-red-500">*</span>
            </label>
            <select
              name="location"
              value={formData.location}
              onChange={handleChange}
              required
              className="w-full px-3 sm:px-4 py-2.5 sm:py-3 text-base border-2 border-gray-300 rounded-lg sm:rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white touch-manipulation"
            >
              <option value="">Select Location</option>
              <option value="maharashtra">📍 Maharashtra</option>
              <option value="chandrapur">📍 Chandrapur</option>
              <option value="korpana">📍 Korpana</option>
              <option value="rajura">📍 Rajura</option>
            </select>
            <p className="text-xs text-gray-500 mt-2 flex items-center space-x-1">
              <span>💡</span>
              <span>Location-based news helps readers find news relevant to their area.</span>
            </p>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2 sm:mb-3">
              {t('form.category')} <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="category"
              value={formData.category}
              onChange={handleChange}
              required
              placeholder="e.g., Politics, Sports, Economy"
              className="w-full px-3 sm:px-4 py-2.5 sm:py-3 text-base border-2 border-gray-300 rounded-lg sm:rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
            />
          </div>
        </div>

        {/* Image Upload */}
        <div className="mb-4 sm:mb-6">
          <label className="block text-sm font-semibold text-gray-700 mb-3">
            {t('form.image')}
          </label>
          {imagePreview ? (
            <div className="relative inline-block">
              <img
                src={imagePreview}
                alt="Preview"
                className="max-w-xs h-48 object-cover rounded-xl shadow-lg border-2 border-gray-200"
              />
              <button
                type="button"
                onClick={removeImage}
                className="mt-3 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors duration-200 text-sm font-medium"
              >
                {t('form.removeImage')}
              </button>
            </div>
          ) : (
            <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center hover:border-blue-400 transition-colors duration-200">
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="hidden"
                id="image-upload"
              />
              <label htmlFor="image-upload" className="cursor-pointer">
                <div className="text-4xl mb-2">📷</div>
                <p className="text-gray-600 font-medium">Click to upload image</p>
                <p className="text-xs text-gray-400 mt-1">PNG, JPG, GIF up to 5MB</p>
              </label>
            </div>
          )}
        </div>

        {/* Published Checkbox */}
        <div className="mb-8 p-4 bg-gray-50 rounded-xl">
          <label className="flex items-center cursor-pointer">
            <input
              type="checkbox"
              name="published"
              checked={formData.published}
              onChange={handleChange}
              className="w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500 cursor-pointer"
            />
            <span className="ml-3 text-sm font-semibold text-gray-700">
              {t('form.published')}
            </span>
          </label>
        </div>

        {/* Submit Button */}
        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
          <button
            type="submit"
            disabled={loading || translating}
            className="flex-1 bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 sm:px-8 py-3 sm:py-4 rounded-lg sm:rounded-xl hover:from-blue-700 hover:to-indigo-700 active:from-blue-800 active:to-indigo-800 disabled:opacity-50 font-semibold shadow-lg hover:shadow-xl transition-all duration-200 touch-manipulation text-base sm:text-lg"
          >
            {loading || translating ? (
              <span className="flex items-center justify-center">
                <span className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white mr-2"></span>
                {t('common.loading')}
              </span>
            ) : (
              t('form.submit')
            )}
          </button>
          <button
            type="button"
            onClick={() => navigate('/dashboard/manage')}
            className="px-6 sm:px-8 py-3 sm:py-4 bg-gray-200 text-gray-700 rounded-lg sm:rounded-xl hover:bg-gray-300 active:bg-gray-400 font-semibold transition-all duration-200 touch-manipulation text-base sm:text-lg"
          >
            {t('common.cancel')}
          </button>
        </div>
      </form>
    </div>
    </div>
  );
};

export default CreateNews;

