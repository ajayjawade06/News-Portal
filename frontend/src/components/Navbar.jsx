import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useNews } from '../context/NewsContext';

const CATEGORIES = [
  { path: '/', labelKey: 'nav.home' },
  { path: '/maharashtra', label: 'Maharashtra' },
  { path: '/chandrapur', label: 'Chandrapur' },
  { path: '/korpana', label: 'Korpana' },
  { path: '/rajura', label: 'Rajura' },
];

const Navbar = () => {
  const { t, i18n } = useTranslation();
  const { setSelectedLanguage } = useNews();
  const navigate = useNavigate();
  const token = localStorage.getItem('token');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [logoError, setLogoError] = useState(false);
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    setIsDark(document.documentElement.classList.contains('dark'));
  }, []);

  const toggleTheme = () => {
    const next = !document.documentElement.classList.contains('dark');
    document.documentElement.classList.toggle('dark', next);
    localStorage.setItem('theme', next ? 'dark' : 'light');
    setIsDark(next);
  };

  const handleLanguageChange = (lang) => {
    setSelectedLanguage(lang);
    i18n.changeLanguage(lang);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/');
  };

  const navLinkBase =
    'px-4 py-3 text-sm font-medium text-editorial-ink dark:text-zinc-200 hover:text-editorial-red hover:bg-editorial-red-muted dark:hover:bg-red-950/30 transition-colors border-b-2 border-transparent hover:border-editorial-red';

  return (
    <header className="sticky top-0 z-50 bg-white dark:bg-zinc-900 border-b border-editorial-border dark:border-zinc-800">
      <div className="container-editorial">
        <div className="flex items-center justify-between h-14 lg:h-16">
          <Link
            to="/"
            className="flex items-center gap-3 shrink-0"
            onClick={() => setMobileMenuOpen(false)}
          >
            {!logoError ? (
              <img
                src="/image.png"
                alt="DSK News"
                onError={() => setLogoError(true)}
                className="h-9 w-auto object-contain"
              />
            ) : (
              <span className="font-serif text-xl font-bold text-editorial-black dark:text-zinc-100">DSK</span>
            )}
            <span className="font-serif text-xl font-bold text-editorial-black dark:text-zinc-100 hidden sm:inline">
              DSK News
            </span>
          </Link>

          <nav className="hidden lg:flex items-center gap-0">
            {CATEGORIES.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={navLinkBase}
              >
                {item.labelKey ? t(item.labelKey) : item.label}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-2 sm:gap-3">
            <button
              type="button"
              onClick={toggleTheme}
              className="p-2 rounded border border-editorial-border dark:border-zinc-600 bg-white dark:bg-zinc-800 text-editorial-muted dark:text-zinc-300 hover:text-editorial-red dark:hover:text-red-400 hover:border-editorial-red dark:hover:border-red-900 transition-colors"
              aria-label={isDark ? 'Switch to day mode' : 'Switch to night mode'}
              title={isDark ? 'Day mode' : 'Night mode'}
            >
              {isDark ? (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              ) : (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                </svg>
              )}
            </button>
            <select
              value={i18n.language}
              onChange={(e) => handleLanguageChange(e.target.value)}
              className="text-sm font-medium text-editorial-muted dark:text-zinc-300 border border-editorial-border dark:border-zinc-600 bg-white dark:bg-zinc-800 px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-editorial-red cursor-pointer"
            >
              <option value="en">EN</option>
              <option value="hi">HI</option>
              <option value="mr">MR</option>
            </select>

            {token ? (
              <>
                <Link to="/dashboard" className="btn-editorial text-sm py-2 px-4 hidden sm:inline-flex">
                  {t('nav.dashboard')}
                </Link>
                <button
                  type="button"
                  onClick={handleLogout}
                  className="text-sm font-medium text-editorial-muted dark:text-zinc-400 hover:text-editorial-red transition-colors hidden sm:inline"
                >
                  {t('nav.logout')}
                </button>
              </>
            ) : (
              <Link to="/login" className="btn-editorial text-sm py-2 px-4 hidden sm:inline-flex">
                {t('nav.login')}
              </Link>
            )}

            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 text-editorial-ink dark:text-zinc-200 hover:bg-neutral-100 dark:hover:bg-zinc-800"
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
          </div>
        </div>

        {mobileMenuOpen && (
          <div className="lg:hidden border-t border-editorial-border dark:border-zinc-800 py-4 animate-fade-in">
            <div className="flex flex-col gap-0">
              {CATEGORIES.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setMobileMenuOpen(false)}
                  className="px-4 py-3 text-sm font-medium text-editorial-ink dark:text-zinc-200 hover:bg-editorial-red-muted dark:hover:bg-red-950/30 hover:text-editorial-red"
                >
                  {item.labelKey ? t(item.labelKey) : item.label}
                </Link>
              ))}
              <div className="border-t border-editorial-border dark:border-zinc-800 mt-2 pt-3 px-4 flex justify-between items-center">
                <span className="text-sm text-editorial-muted dark:text-zinc-400">Theme</span>
                <button
                  type="button"
                  onClick={toggleTheme}
                  className="p-2 rounded border border-editorial-border dark:border-zinc-600 text-editorial-muted dark:text-zinc-300 hover:text-editorial-red"
                >
                  {isDark ? 'Day' : 'Night'}
                </button>
              </div>
              <div className="border-t border-editorial-border dark:border-zinc-800 mt-2 pt-3 px-4 flex justify-between items-center">
                <span className="text-sm text-editorial-muted dark:text-zinc-400">Language</span>
                <select
                  value={i18n.language}
                  onChange={(e) => handleLanguageChange(e.target.value)}
                  className="text-sm border border-editorial-border dark:border-zinc-600 dark:bg-zinc-800 dark:text-zinc-200 px-3 py-1.5 focus:ring-2 focus:ring-editorial-red"
                >
                  <option value="en">EN</option>
                  <option value="hi">HI</option>
                  <option value="mr">MR</option>
                </select>
              </div>
              {token ? (
                <>
                  <Link
                    to="/dashboard"
                    onClick={() => setMobileMenuOpen(false)}
                    className="btn-editorial mt-3 mx-4 text-center py-2.5"
                  >
                    {t('nav.dashboard')}
                  </Link>
                  <button
                    type="button"
                    onClick={() => { handleLogout(); setMobileMenuOpen(false); }}
                    className="mt-2 mx-4 py-2.5 text-sm font-medium text-editorial-muted dark:text-zinc-400 hover:text-editorial-red text-left"
                  >
                    {t('nav.logout')}
                  </button>
                </>
              ) : (
                <Link
                  to="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="btn-editorial mt-3 mx-4 text-center py-2.5"
                >
                  {t('nav.login')}
                </Link>
              )}
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Navbar;
