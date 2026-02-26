import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

const LOCATIONS = [
  { path: '/maharashtra', label: 'Maharashtra' },
  { path: '/chandrapur', label: 'Chandrapur' },
  { path: '/korpana', label: 'Korpana' },
  { path: '/rajura', label: 'Rajura' },
];

const Footer = () => {
  const { t } = useTranslation();

  return (
    <footer className="bg-neutral-50 dark:bg-zinc-900 border-t border-editorial-border dark:border-zinc-800 mt-auto">
      <div className="container-editorial py-12 lg:py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
          <section>
            <h3 className="font-serif font-bold text-editorial-black dark:text-zinc-100 text-lg mb-4">लोकवाणी</h3>
            <p className="text-sm text-editorial-muted dark:text-zinc-400 leading-relaxed max-w-xs">
लोकवाणी – समाजाचा आवाज, सत्याची बाजू. ताज्या, निष्पक्ष आणि सखोल बातम्यांसाठी आपले विश्वासू व्यासपीठ.            </p>
          </section>

          <section>
            <h3 className="font-sans text-xs font-semibold text-editorial-muted dark:text-zinc-400 uppercase tracking-wider mb-4">
              Sections
            </h3>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-sm text-editorial-ink dark:text-zinc-200 hover:text-editorial-red transition-colors">
                  {t('nav.home')}
                </Link>
              </li>
              {LOCATIONS.map(({ path, label }) => (
                <li key={path}>
                  <Link to={path} className="text-sm text-editorial-ink dark:text-zinc-200 hover:text-editorial-red transition-colors">
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </section>

          <section>
            <h3 className="font-sans text-xs font-semibold text-editorial-muted dark:text-zinc-400 uppercase tracking-wider mb-4">
              Reporter
            </h3>
            <ul className="space-y-2">
              <li>
                <Link to="/login" className="text-sm text-editorial-ink dark:text-zinc-200 hover:text-editorial-red transition-colors">
                  {t('nav.login')}
                </Link>
              </li>
              <li>
                <Link to="/dashboard" className="text-sm text-editorial-ink dark:text-zinc-200 hover:text-editorial-red transition-colors">
                  {t('nav.dashboard')}
                </Link>
              </li>
            </ul>
          </section>

          <section>
            <h3 className="font-sans text-xs font-semibold text-editorial-muted dark:text-zinc-400 uppercase tracking-wider mb-4">
              Legal
            </h3>
            <p className="text-sm text-editorial-muted dark:text-zinc-400">
              Content is published for informational purposes. All rights reserved.
            </p>
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
