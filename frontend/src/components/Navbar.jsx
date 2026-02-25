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
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
      document.documentElement.classList.add('dark');
      setIsDark(true);
    }
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
        <div className="flex items-center justify-between h-16">

          {/* LOGO ONLY */}
          <Link
            to="/"
            className="flex items-center shrink-0"
            onClick={() => setMobileMenuOpen(false)}
          >
            <img
              src="/image.png"   // 👉 Replace with high-quality logo (prefer SVG)
              alt="Lokawani Logo"
              className="h-12 lg:h-14 w-auto object-contain"
            />
          </Link>

          {/* DESKTOP NAVIGATION */}
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

          {/* RIGHT SECTION */}
          <div className="flex items-center gap-2 sm:gap-3">

            {/* THEME BUTTON */}
            <button
              type="button"
              onClick={toggleTheme}
              className="p-2 rounded border border-editorial-border dark:border-zinc-600 bg-white dark:bg-zinc-800 text-editorial-muted dark:text-zinc-300 hover:text-editorial-red hover:border-editorial-red transition-colors"
            >
              {isDark ? '☀️' : '🌙'}
            </button>

            {/* LANGUAGE SELECT */}
            <select
              value={i18n.language}
              onChange={(e) => handleLanguageChange(e.target.value)}
              className="text-sm font-medium text-editorial-muted dark:text-zinc-300 border border-editorial-border dark:border-zinc-600 bg-white dark:bg-zinc-800 px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-editorial-red cursor-pointer"
            >
              <option value="en">EN</option>
              <option value="hi">HI</option>
              <option value="mr">MR</option>
            </select>

            {/* AUTH BUTTONS */}
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

            {/* MOBILE MENU BUTTON */}
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 text-editorial-ink dark:text-zinc-200 hover:bg-neutral-100 dark:hover:bg-zinc-800"
            >
              {mobileMenuOpen ? '✖' : '☰'}
            </button>
          </div>
        </div>

        {/* MOBILE MENU */}
        {mobileMenuOpen && (
          <div className="lg:hidden border-t border-editorial-border dark:border-zinc-800 py-4 animate-fade-in">
            <div className="flex flex-col">
              {CATEGORIES.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setMobileMenuOpen(false)}
                  className="px-4 py-3 text-sm font-medium text-editorial-ink dark:text-zinc-200 hover:bg-editorial-red-muted hover:text-editorial-red"
                >
                  {item.labelKey ? t(item.labelKey) : item.label}
                </Link>
              ))}

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
                    onClick={() => { handleLogout(); setMobileMenuOpen(false); }}
                    className="mt-2 mx-4 py-2.5 text-sm font-medium text-editorial-muted hover:text-editorial-red text-left"
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