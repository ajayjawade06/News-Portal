import { Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useNews } from '../context/NewsContext';

const Navbar = () => {
  const { t, i18n } = useTranslation();
  const { selectedLanguage, setSelectedLanguage } = useNews();
  const navigate = useNavigate();
  const token = localStorage.getItem('token');

  const handleLanguageChange = (lang) => {
    // Update both i18n (for UI) and NewsContext (for news content)
    // This ensures UI and news content language stay in sync
    setSelectedLanguage(lang);
    i18n.changeLanguage(lang);
    // NewsContext will automatically sync via i18n.on('languageChanged') listener
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/');
  };

  return (
    <nav className="bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-700 text-white shadow-xl sticky top-0 z-50 backdrop-blur-sm bg-opacity-95">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2 group">
            <div className="text-3xl transform group-hover:scale-110 transition-transform duration-300">
              📰
            </div>
            <div>
              <div className="text-2xl font-bold tracking-tight">News Portal</div>
              <div className="text-xs text-blue-200 opacity-75">Multilingual News</div>
            </div>
          </Link>

          {/* Navigation Links */}
          <div className="hidden md:flex items-center space-x-1">
            <Link
              to="/"
              className="px-4 py-2 rounded-lg hover:bg-white/10 transition-all duration-200 font-medium hover:scale-105"
            >
              {t('nav.home')}
            </Link>
            <Link
              to="/local"
              className="px-4 py-2 rounded-lg hover:bg-white/10 transition-all duration-200 font-medium hover:scale-105"
            >
              {t('nav.local')}
            </Link>
            <Link
              to="/national"
              className="px-4 py-2 rounded-lg hover:bg-white/10 transition-all duration-200 font-medium hover:scale-105"
            >
              {t('nav.national')}
            </Link>
            <Link
              to="/international"
              className="px-4 py-2 rounded-lg hover:bg-white/10 transition-all duration-200 font-medium hover:scale-105"
            >
              {t('nav.international')}
            </Link>

            {/* Language Selector */}
            <div className="flex items-center space-x-2 border-l border-white/20 pl-4 ml-4">
              <span className="text-lg">🌐</span>
              <select
                value={selectedLanguage}
                onChange={(e) => handleLanguageChange(e.target.value)}
                className="bg-white/10 backdrop-blur-sm text-white px-3 py-1.5 rounded-lg text-sm border border-white/20 hover:bg-white/20 transition-all duration-200 cursor-pointer focus:outline-none focus:ring-2 focus:ring-white/50"
              >
                <option value="en" className="bg-gray-800">EN</option>
                <option value="hi" className="bg-gray-800">HI</option>
                <option value="mr" className="bg-gray-800">MR</option>
              </select>
            </div>

            {/* Dashboard/Login */}
            {token ? (
              <>
                <Link
                  to="/dashboard"
                  className="px-4 py-2 rounded-lg bg-white/10 hover:bg-white/20 transition-all duration-200 font-medium hover:scale-105 ml-2"
                >
                  {t('nav.dashboard')}
                </Link>
                <button
                  onClick={handleLogout}
                  className="px-4 py-2 rounded-lg bg-red-500/80 hover:bg-red-600 transition-all duration-200 font-medium hover:scale-105 ml-2 shadow-lg hover:shadow-xl"
                >
                  {t('nav.logout')}
                </button>
              </>
            ) : (
              <Link
                to="/login"
                className="px-6 py-2 rounded-lg bg-white text-blue-700 hover:bg-blue-50 transition-all duration-200 font-semibold hover:scale-105 ml-4 shadow-lg hover:shadow-xl"
              >
                {t('nav.login')}
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;

