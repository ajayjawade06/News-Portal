import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useNews } from '../context/NewsContext';

const Navbar = () => {
  const { t, i18n } = useTranslation();
  const { selectedLanguage, setSelectedLanguage } = useNews();
  const navigate = useNavigate();
  const token = localStorage.getItem('token');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [logoError, setLogoError] = useState(false);

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
      <div className="container mx-auto px-4 phone:px-6">
        <div className="flex items-center justify-between h-16 phone:h-18 sm:h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2 phone:space-x-3 group" onClick={() => setMobileMenuOpen(false)}>
            {!logoError ? (
              <img
                src="/image.png"
                alt="DSK News"
                onError={() => setLogoError(true)}
                className="w-12 h-12 phone:w-14 phone:h-14 sm:w-14 sm:h-14 lg:w-16 lg:h-16 object-contain rounded transition-transform duration-300 group-hover:scale-110"
              />
            ) : (
              <img
                src="/image.png"
                alt="DSK News"
                className="w-12 h-12 phone:w-14 phone:h-14 sm:w-14 sm:h-14 lg:w-16 lg:h-16 object-contain rounded"
              />
            )}
            <div>
              <div className="text-lg phone:text-xl sm:text-xl lg:text-2xl font-bold tracking-tight">DSK News</div>
            </div>
          </Link>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-lg hover:bg-white/10 transition-colors touch-manipulation"
            aria-label="Toggle menu"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {mobileMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>

          {/* Desktop Navigation Links - Location-based */}
          <div className="hidden md:flex items-center space-x-1">
            <Link
              to="/"
              className="px-4 py-2 rounded-lg hover:bg-white/10 transition-all duration-200 font-medium hover:scale-105"
            >
              {t('nav.home')}
            </Link>
            <Link
              to="/maharashtra"
              className="px-4 py-2 rounded-lg hover:bg-white/10 transition-all duration-200 font-medium hover:scale-105"
            >
              Maharashtra
            </Link>
            <Link
              to="/chandrapur"
              className="px-4 py-2 rounded-lg hover:bg-white/10 transition-all duration-200 font-medium hover:scale-105"
            >
              Chandrapur
            </Link>
            <Link
              to="/korpana"
              className="px-4 py-2 rounded-lg hover:bg-white/10 transition-all duration-200 font-medium hover:scale-105"
            >
              Korpana
            </Link>
            <Link
              to="/rajura"
              className="px-4 py-2 rounded-lg hover:bg-white/10 transition-all duration-200 font-medium hover:scale-105"
            >
              Rajura
            </Link>

            {/* Language Selector */}
            <div className="flex items-center space-x-2 border-l border-white/20 pl-4 ml-4">
              <svg className="w-5 h-5 text-white/90" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <circle cx="12" cy="12" r="10" />
                <path d="M2 12h20" />
                <path d="M12 2c2.5 3.5 2.5 8.5 0 12" />
                <path d="M12 22c-2.5-3.5-2.5-8.5 0-12" />
              </svg>
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

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-white/20 py-4 phone:py-6 mt-2 animate-slide-down">
            <div className="flex flex-col space-y-2 phone:space-y-3">
              <Link
                to="/"
                onClick={() => setMobileMenuOpen(false)}
                className="px-4 phone:px-6 py-3 phone:py-4 rounded-lg hover:bg-white/10 transition-all duration-200 font-medium active:bg-white/20 touch-manipulation"
              >
                {t('nav.home')}
              </Link>
              <Link
                to="/maharashtra"
                onClick={() => setMobileMenuOpen(false)}
                className="px-4 phone:px-6 py-3 phone:py-4 rounded-lg hover:bg-white/10 transition-all duration-200 font-medium active:bg-white/20 touch-manipulation"
              >
                Maharashtra
              </Link>
              <Link
                to="/chandrapur"
                onClick={() => setMobileMenuOpen(false)}
                className="px-4 phone:px-6 py-3 phone:py-4 rounded-lg hover:bg-white/10 transition-all duration-200 font-medium active:bg-white/20 touch-manipulation"
              >
                Chandrapur
              </Link>
              <Link
                to="/korpana"
                onClick={() => setMobileMenuOpen(false)}
                className="px-4 phone:px-6 py-3 phone:py-4 rounded-lg hover:bg-white/10 transition-all duration-200 font-medium active:bg-white/20 touch-manipulation"
              >
                Korpana
              </Link>
              <Link
                to="/rajura"
                onClick={() => setMobileMenuOpen(false)}
                className="px-4 phone:px-6 py-3 phone:py-4 rounded-lg hover:bg-white/10 transition-all duration-200 font-medium active:bg-white/20 touch-manipulation"
              >
                Rajura
              </Link>

              {/* Language Selector - Mobile */}
              <div className="flex items-center justify-between px-4 phone:px-6 py-3 phone:py-4 border-t border-white/20 mt-2">
                <span className="text-base flex items-center space-x-2">
                  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <circle cx="12" cy="12" r="10" />
                    <path d="M2 12h20" />
                    <path d="M12 2c2.5 3.5 2.5 8.5 0 12" />
                    <path d="M12 22c-2.5-3.5-2.5-8.5 0-12" />
                  </svg>
                  <span>Language</span>
                </span>
                <select
                  value={selectedLanguage}
                  onChange={(e) => handleLanguageChange(e.target.value)}
                  className="bg-white/10 backdrop-blur-sm text-white px-3 phone:px-4 py-2 phone:py-3 rounded-lg text-sm border border-white/20 hover:bg-white/20 transition-all duration-200 cursor-pointer focus:outline-none focus:ring-2 focus:ring-white/50 touch-manipulation"
                >
                  <option value="en" className="bg-gray-800">EN</option>
                  <option value="hi" className="bg-gray-800">HI</option>
                  <option value="mr" className="bg-gray-800">MR</option>
                </select>
              </div>

              {/* Dashboard/Login - Mobile */}
              {token ? (
                <>
                  <Link
                    to="/dashboard"
                    onClick={() => setMobileMenuOpen(false)}
                    className="px-4 phone:px-6 py-3 phone:py-4 rounded-lg bg-white/10 hover:bg-white/20 transition-all duration-200 font-medium active:bg-white/30 touch-manipulation mx-4"
                  >
                    {t('nav.dashboard')}
                  </Link>
                  <button
                    onClick={() => {
                      handleLogout();
                      setMobileMenuOpen(false);
                    }}
                    className="px-4 phone:px-6 py-3 phone:py-4 rounded-lg bg-red-500/80 hover:bg-red-600 transition-all duration-200 font-medium active:bg-red-700 touch-manipulation mx-4"
                  >
                    {t('nav.logout')}
                  </button>
                </>
              ) : (
                <Link
                  to="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="px-4 phone:px-6 py-3 phone:py-4 rounded-lg bg-white text-blue-700 hover:bg-blue-50 transition-all duration-200 font-semibold active:bg-blue-100 touch-manipulation mx-4 text-center"
                >
                  {t('nav.login')}
                </Link>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;

