import { createContext, useContext, useState, useEffect } from 'react';
import i18n from '../i18n';
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
  // Sync with i18n language - this ensures news content language matches UI language
  // Initialize with current i18n language
  const [selectedLanguage, setSelectedLanguage] = useState(i18n.language || 'en');
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Sync selectedLanguage with i18n language changes
  // For MCA Viva: This demonstrates reactive language switching
  useEffect(() => {
    const handleLanguageChange = (lng) => {
      setSelectedLanguage(lng);
    };

    // Set initial language from i18n
    setSelectedLanguage(i18n.language || 'en');

    // Listen to i18n language changes
    i18n.on('languageChanged', handleLanguageChange);

    return () => {
      i18n.off('languageChanged', handleLanguageChange);
    };
  }, []);

  // Fetch news based on coverage type
  const fetchNews = async (coverage = null) => {
    setLoading(true);
    setError(null);
    try {
      const params = coverage ? { coverage } : {};
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
  const getNewsContent = (newsItem, field = 'title') => {
    if (!newsItem || !newsItem[field]) return '';
    
    const content = newsItem[field];
    
    // Use current i18n language (synced with selectedLanguage)
    const currentLang = i18n.language || selectedLanguage;
    
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

