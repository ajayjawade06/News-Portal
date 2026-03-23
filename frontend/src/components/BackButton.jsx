import { useNavigate, Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

const BackButton = ({ to, label = 'Back', className = '' }) => {
  const navigate = useNavigate();

  const content = (
    <>
      <div className="p-1.5 rounded-lg bg-neutral-100 dark:bg-zinc-800 flex items-center justify-center group-hover:bg-editorial-red/10 transition-colors">
        <ArrowLeft size={16} />
      </div>
      <span className="text-[10px] font-bold uppercase tracking-widest leading-none mt-0.5">
        {label}
      </span>
    </>
  );

  const baseClasses = `group inline-flex items-center gap-2 text-editorial-muted hover:text-editorial-red transition-all duration-300 ${className}`;

  if (to) {
    return (
      <Link to={to} className={baseClasses}>
        {content}
      </Link>
    );
  }

  return (
    <button type="button" onClick={() => navigate(-1)} className={baseClasses}>
      {content}
    </button>
  );
};

export default BackButton;
