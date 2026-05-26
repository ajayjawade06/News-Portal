import { Link } from 'react-router-dom';

const CtaBanner = ({ type = 'horizontal' }) => {
  if (type === 'horizontal') {
    return (
      <div className="w-full max-w-[728px] min-h-[90px] bg-gradient-to-r from-editorial-red/10 to-editorial-red/5 border border-editorial-red/20 flex flex-col sm:flex-row items-center justify-between gap-4 px-6 py-3 transition-all hover:shadow-md mx-auto">
        <div className="flex items-center gap-4 mb-2 sm:mb-0">
          <div className="w-10 h-10 bg-editorial-red text-white flex items-center justify-center rounded-full shrink-0">
            <span className="text-xl">🚀</span>
          </div>
          <div>
            <div className="font-serif font-bold text-editorial-black dark:text-zinc-100 text-sm md:text-base">Advertise With Us</div>
            <div className="text-xs md:text-sm text-editorial-muted">Reach thousands of readers daily. Promote your business here.</div>
          </div>
        </div>
        <Link to="/advertising" className="bg-editorial-red hover:bg-editorial-red-dark text-white text-xs font-semibold px-4 py-2 rounded shadow transition-colors whitespace-nowrap">
          Advertise Now
        </Link>
      </div>
    );
  }

  // Vertical (Sidebar)
  return (
    <div className="w-[300px] bg-gradient-to-b from-editorial-red/10 to-editorial-red/5 border border-editorial-red/20 p-6 text-center transition-all hover:shadow-md mx-auto flex flex-col items-center justify-center min-h-[250px]">
      <div className="w-14 h-14 bg-editorial-red text-white flex items-center justify-center rounded-full mb-4 shadow-sm">
        <span className="text-2xl">🚀</span>
      </div>
      <div className="font-serif font-bold text-editorial-black dark:text-zinc-100 text-lg mb-2">Advertise With Us</div>
      <div className="text-sm text-editorial-muted mb-6">
        Reach thousands of readers daily.<br/>Promote your business here.
      </div>
      <Link to="/advertising" className="bg-editorial-red hover:bg-editorial-red-dark text-white text-sm font-semibold px-6 py-2.5 rounded shadow transition-colors w-full">
        Contact Us
      </Link>
    </div>
  );
};

export default CtaBanner;
