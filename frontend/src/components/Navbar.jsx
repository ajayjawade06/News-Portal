import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useText } from '../hooks/useText';
import { useNews } from '../context/NewsContext';
import { Layout, LogOut, Moon, Sun, Globe, Monitor, ShieldCheck } from 'lucide-react';

const CATEGORIES = [
  { path: '/', labelKey: 'nav.home' },
  { path: '/international', label: 'International' },
  { path: '/national', label: 'National' },
  { path: '/maharashtra', label: 'Maharashtra' },
  { path: '/chandrapur', label: 'Chandrapur' },
  { path: '/korpana', label: 'Korpana' },
  { path: '/rajura', label: 'Rajura' },
  { path: '/advertising', labelKey: 'nav.advertise' },
];

const Navbar = () => {
  const { pathname } = useLocation();
  const isAdminPath = pathname.startsWith('/dashboard');

  const setSelectedLanguage = useNews().setSelectedLanguage;
  const homeText = useText('Home');
  const dashboardText = useText('Dashboard');
  const loginText = useText('Login');
  const logoutText = useText('Logout');
  const advertiseText = useText('Advertise');
  const [language, setLanguage] = useState('en');
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
    setLanguage(lang);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/');
  };

  const navLinkBase =
    'px-4 py-3 text-sm font-medium text-editorial-ink dark:text-zinc-200 hover:text-editorial-red hover:bg-editorial-red-muted dark:hover:bg-red-950/30 transition-colors border-b-2 border-transparent hover:border-editorial-red';

  // --- PREMIUM ADMIN STYLES ---
  if (isAdminPath) {
    return (
      <header className="sticky top-0 z-50 bg-white/80 dark:bg-zinc-900/80 backdrop-blur-xl border-b border-neutral-200 dark:border-white/5 transition-all duration-500">
        <div className="container-editorial">
          <div className="flex items-center justify-between h-20">
            <div className="flex items-center gap-8">
              <Link to="/" className="flex items-center gap-3 group">
                <img src="photo/image.png" alt="Logo" className="h-10 w-auto object-contain transition-transform group-hover:scale-105" />
                <div className="h-8 w-px bg-neutral-200 dark:bg-zinc-800 hidden sm:block"></div>
                <div className="hidden sm:block">
                  <h2 className="font-bold text-lg text-editorial-black dark:text-white leading-none">Dashboard</h2>
                  <p className="text-[10px] text-editorial-red font-bold uppercase tracking-widest mt-0.5">Admin Control</p>
                </div>
              </Link>
            </div>

            <div className="flex items-center gap-4">
              <button onClick={toggleTheme} className="w-10 h-10 flex items-center justify-center rounded-xl bg-neutral-100 dark:bg-zinc-800 text-editorial-muted hover:text-editorial-red transition-all">
                {isDark ? <Sun size={18} /> : <Moon size={18} />}
              </button>

              <div className="h-8 w-px bg-neutral-200 dark:bg-zinc-800 hidden sm:block"></div>

              <div className="flex items-center gap-3">
                <div className="hidden sm:flex flex-col items-end mr-1">
                  <span className="text-xs font-black text-editorial-black dark:text-white">Editorial Admin</span>
                  <span className="text-[10px] text-emerald-500 font-bold uppercase flex items-center gap-1"><ShieldCheck size={10} /> Verified Session</span>
                </div>
                <button
                  onClick={handleLogout}
                  className="w-10 h-10 flex items-center justify-center rounded-xl bg-editorial-red/10 text-editorial-red hover:bg-editorial-red hover:text-white transition-all shadow-sm"
                  title="Secure Logout"
                >
                  <LogOut size={18} />
                </button>
              </div>
            </div>
          </div>
        </div>
      </header>
    );
  }

  // --- STANDARD WEBSITE STYLES ---
  return (
    <header className="sticky top-0 z-50 glass-nav transition-all duration-300">
      <div className="container-editorial">
        <div className="flex items-center justify-between h-16 sm:h-20">

          {/* LOGO ONLY */}
          <Link
            to="/"
            className="flex items-center shrink-0"
            onClick={() => setMobileMenuOpen(false)}
          >
            <img
              src="/image.png"
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
                {item.labelKey ? (item.labelKey === 'nav.home' ? homeText : advertiseText) : item.label}
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
              value={language}
              onChange={(e) => handleLanguageChange(e.target.value)}
              className="text-sm font-medium text-editorial-muted dark:text-zinc-300 border border-editorial-border dark:border-zinc-600 bg-white dark:bg-zinc-800 px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-editorial-red cursor-pointer"
            >
              <option value="en">EN</option>
              <option value="hi">HI</option>
              <option value="mr">MR</option>
            </select>

            {/* AUTH BUTTONS */}
            {token ? (
              <div className="flex items-center gap-3">
                <Link to="/dashboard" className="px-5 py-2 bg-editorial-black dark:bg-white text-white dark:text-editorial-black text-xs font-black uppercase tracking-widest rounded transition-all hover:bg-editorial-red dark:hover:bg-editorial-red dark:hover:text-white shadow-sm">
                  {dashboardText}
                </Link>
                <button
                  type="button"
                  onClick={handleLogout}
                  className="text-sm font-medium text-editorial-muted dark:text-zinc-400 hover:text-editorial-red transition-colors hidden sm:inline"
                >
                  <LogOut size={18} />
                </button>
              </div>
            ) : (
              <Link to="/login" className="btn-editorial text-sm py-2 px-4 hidden sm:inline-flex">
                {loginText}
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
                  {item.labelKey ? (item.labelKey === 'nav.home' ? homeText : advertiseText) : item.label}
                </Link>
              ))}

              {token ? (
                <>
                  <Link
                    to="/dashboard"
                    onClick={() => setMobileMenuOpen(false)}
                    className="btn-editorial mt-3 mx-4 text-center py-2.5"
                  >
                    {dashboardText}
                  </Link>
                  <button
                    onClick={() => { handleLogout(); setMobileMenuOpen(false); }}
                    className="mt-2 mx-4 py-2.5 text-sm font-medium text-editorial-muted hover:text-editorial-red text-left"
                  >
                    {logoutText}
                  </button>
                </>
              ) : (
                <Link
                  to="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="btn-editorial mt-3 mx-4 text-center py-2.5"
                >
                  {loginText}
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