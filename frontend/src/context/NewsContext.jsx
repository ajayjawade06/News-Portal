import { createContext, useContext, useState } from 'react';
import api from '../utils/api';

const NewsContext = createContext();

export const useNews = () => {
  const context = useContext(NewsContext);
  if (!context) {
    throw new Error('useNews must be used within NewsProvider');
  }
  return context;
};

export const NewsProvider = ({ children }) => {
  // Track selected language manually (updated by Navbar handler)
  const [selectedLanguage, setSelectedLanguage] = useState('en');
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // selectedLanguage is controlled by Navbar via setSelectedLanguage;
  // no effect hook needed since there is no i18n event system anymore.

  // Fetch news based on location type
  // Updated to use 'location' instead of 'coverage' for location-based filtering
  // Location values: maharashtra, chandrapur, korpana, rajura
  const fetchNews = async (location = null) => {
    setLoading(true);
    setError(null);
    try {
      const params = location ? { location } : {};
      const response = await api.get('/news', { params });
      setNews(response.data.data || []);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch news');
      setNews([]);
    } finally {
      setLoading(false);
    }
  };

  // Get news content in selected language with fallback
  // For MCA Viva: This function demonstrates language-based content retrieval
  // Supports title, subHeading, and content fields
  const getNewsContent = (newsItem, field = 'title') => {
    if (!newsItem || !newsItem[field]) return '';
    
    const content = newsItem[field];
    
    // Use current selectedLanguage from context
    const currentLang = selectedLanguage;
    
    // Try current language first
    if (content[currentLang] && content[currentLang].trim()) {
      return content[currentLang];
    }
    
    // Fallback to English
    if (content.en && content.en.trim()) {
      return content.en;
    }
    
    // Fallback to any available language
    const availableLang = Object.keys(content).find(lang => content[lang] && content[lang].trim());
    return availableLang ? content[availableLang] : '';
  };

  const value = {
    selectedLanguage,
    setSelectedLanguage,
    news,
    loading,
    error,
    fetchNews,
    getNewsContent
  };

  return <NewsContext.Provider value={value}>{children}</NewsContext.Provider>;
};

