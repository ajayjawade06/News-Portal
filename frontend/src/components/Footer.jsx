import { Link } from 'react-router-dom';
import { useText } from '../hooks/useText';

const LOCATIONS = [
  { path: '/maharashtra', label: 'Maharashtra' },
  { path: '/chandrapur', label: 'Chandrapur' },
  { path: '/korpana', label: 'Korpana' },
  { path: '/rajura', label: 'Rajura' },
];

const Footer = () => {
  const homeText = useText('Home');
  const loginText = useText('Login');
  const dashboardText = useText('Dashboard');

  return (
    <footer className="bg-neutral-50 dark:bg-zinc-900 border-t border-editorial-border dark:border-zinc-800 mt-auto">
      <div className="container-editorial py-12 lg:py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
          <section className="sm:col-span-2 lg:col-span-1">
            <h3 className="font-serif font-bold text-editorial-black dark:text-zinc-100 text-2xl mb-4 text-editorial-red">लोकवाणी<span className="text-editorial-black dark:text-zinc-100"></span></h3>
            <p className="text-sm text-editorial-muted dark:text-zinc-400 leading-relaxed mb-6 max-w-xs">
              समाजाचा आवाज, सत्याची बाजू. ताज्या, निष्पक्ष आणि सखोल बातम्यांसाठी आपले विश्वासू व्यासपीठ.
            </p>
            <div className="flex gap-3">
              <a href="#" className="w-8 h-8 rounded-full bg-neutral-200 dark:bg-zinc-800 flex items-center justify-center text-editorial-muted hover:bg-editorial-red hover:text-white transition-colors" aria-label="Facebook">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" /></svg>
              </a>
              <a href="#" className="w-8 h-8 rounded-full bg-neutral-200 dark:bg-zinc-800 flex items-center justify-center text-editorial-muted hover:bg-editorial-black hover:text-white transition-colors" aria-label="X (Twitter)">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M18.901 1.153h3.68l-8.04 9.19L24 22.846h-7.406l-5.8-7.584-6.638 7.584H.474l8.6-9.825L0 1.154h7.594l5.243 6.932ZM17.61 20.64h2.039L6.486 3.24H4.298Z" /></svg>
              </a>
              <a href="#" className="w-8 h-8 rounded-full bg-neutral-200 dark:bg-zinc-800 flex items-center justify-center text-editorial-muted hover:bg-red-600 hover:text-white transition-colors" aria-label="YouTube">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" /></svg>
              </a>
            </div>
          </section>

          <section>
            <h3 className="font-sans text-xs font-semibold text-editorial-black dark:text-zinc-100 uppercase tracking-wider mb-4 border-b border-editorial-red/20 pb-2 inline-block">
              Categories
            </h3>
            <ul className="space-y-3">
              <li>
                <Link to="/" className="text-sm text-editorial-muted dark:text-zinc-400 hover:text-editorial-red hover:translate-x-1 inline-block transition-transform">
                  {homeText}
                </Link>
              </li>
              {LOCATIONS.map(({ path, label }) => (
                <li key={path}>
                  <Link to={path} className="text-sm text-editorial-muted dark:text-zinc-400 hover:text-editorial-red hover:translate-x-1 inline-block transition-transform">
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </section>

          <section>
            <h3 className="font-sans text-xs font-semibold text-editorial-black dark:text-zinc-100 uppercase tracking-wider mb-4 border-b border-editorial-red/20 pb-2 inline-block">
              Quick Links
            </h3>
            <ul className="space-y-3">
              <li>
                <Link to="/user/login" className="text-sm text-editorial-muted dark:text-zinc-400 hover:text-editorial-red hover:translate-x-1 inline-block transition-transform">
                  {loginText}
                </Link>
              </li>
              <li>
                <Link to="/dashboard" className="text-sm text-editorial-muted dark:text-zinc-400 hover:text-editorial-red hover:translate-x-1 inline-block transition-transform">
                  Reporter {dashboardText}
                </Link>
              </li>
              <li>
                <span className="text-sm text-editorial-muted dark:text-zinc-400 cursor-pointer hover:text-editorial-red hover:translate-x-1 inline-block transition-transform">
                  Privacy Policy
                </span>
              </li>
              <li>
                <span className="text-sm text-editorial-muted dark:text-zinc-400 cursor-pointer hover:text-editorial-red hover:translate-x-1 inline-block transition-transform">
                  Terms of Service
                </span>
              </li>
            </ul>
          </section>

          <section>
            <h3 className="font-sans text-xs font-semibold text-editorial-black dark:text-zinc-100 uppercase tracking-wider mb-4 border-b border-editorial-red/20 pb-2 inline-block">
              Advertise With Us
            </h3>
            <p className="text-sm text-editorial-muted dark:text-zinc-400 leading-relaxed mb-4">
              Reach thousands of daily readers. Promote your business with our flexible ad plans starting at just <span className="font-semibold text-editorial-black dark:text-zinc-200">₹999/week</span>.
            </p>
            <Link to="/advertising" className="inline-block bg-editorial-red text-white text-xs font-bold px-4 py-2 hover:bg-editorial-red-dark transition-colors rounded shadow-sm">
              View Plans
            </Link>
          </section>
        </div>

        <div className="mt-12 pt-8 border-t border-editorial-border dark:border-zinc-800 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-xs text-editorial-muted dark:text-zinc-500">
            &copy; {new Date().getFullYear()} Lokawani. All rights reserved.
          </p>
          <div className="flex items-center gap-4">
            <span className="text-xs text-editorial-muted dark:text-zinc-500">Developed by Ajay Jawade</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
