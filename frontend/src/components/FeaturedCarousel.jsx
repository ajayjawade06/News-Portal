import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { IMAGE_BASE_URL } from '../config';
import { useNews } from '../context/NewsContext';

const FeaturedCarousel = ({ featuredNews }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const { getNewsContent } = useNews();
  const timerRef = useRef(null);

  const nextSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % featuredNews.length);
  };

  const prevSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + featuredNews.length) % featuredNews.length);
  };

  useEffect(() => {
    if (!isPaused) {
      timerRef.current = setInterval(nextSlide, 5000);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isPaused, currentIndex]);

  if (!featuredNews || featuredNews.length === 0) return null;

  return (
    <div 
      className="relative w-full rounded-2xl overflow-hidden shadow-premium group"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      <div className="relative h-[400px] lg:h-[500px] w-full overflow-hidden">
        {featuredNews.map((item, index) => (
          <div
            key={item._id}
            className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
              index === currentIndex ? 'opacity-100 z-10' : 'opacity-0 z-0'
            }`}
          >
            <Link to={`/news/${item._id}`} className="block relative w-full h-full">
              {item.image && (
                <img
                  src={item.image.startsWith('http') || item.image.startsWith('data:') ? item.image : `${IMAGE_BASE_URL}${item.image}`}
                  alt={getNewsContent(item, 'title')}
                  className={`absolute inset-0 w-full h-full object-cover transition-transform duration-[5s] ease-linear ${
                    index === currentIndex ? 'scale-110' : 'scale-100'
                  }`}
                />
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-[#09090b]/90 via-[#09090b]/40 to-transparent flex flex-col justify-end p-6 md:p-8 lg:p-12 z-10">
                <div className="flex items-center gap-3 mb-3 flex-wrap animate-fade-in">
                  <span className="bg-editorial-red text-white text-[10px] md:text-xs font-bold uppercase tracking-widest px-3 py-1.5 rounded-sm shadow-md">Featured</span>
                  <span className="text-zinc-300 font-sans text-xs uppercase tracking-wider">
                    {new Date(item.createdAt).toLocaleDateString('mr-IN', { day: 'numeric', month: 'long', year: 'numeric' })}
                  </span>
                  {item.views !== undefined && (
                    <span className="text-zinc-300 font-sans text-xs uppercase tracking-wider flex items-center gap-1">
                      • 👁️ {item.views.toLocaleString()} views
                    </span>
                  )}
                </div>
                <h2 className="font-serif font-black text-white text-3xl md:text-4xl lg:text-5xl leading-tight mb-4 drop-shadow-md animate-slide-up">
                  {getNewsContent(item, 'title')}
                </h2>
                <p className="text-zinc-200 mb-0 hidden sm:block text-base md:text-lg line-clamp-2 md:w-3/4 font-light drop-shadow animate-slide-up delay-100">
                  {getNewsContent(item, 'subHeading') || getNewsContent(item, 'content').substring(0, 200)}...
                </p>
              </div>
            </Link>
          </div>
        ))}

        {/* Navigation Arrows */}
        <button
          onClick={(e) => { e.preventDefault(); prevSlide(); }}
          className="absolute left-4 top-1/2 -translate-y-1/2 z-20 bg-black/30 hover:bg-black/50 text-white p-2 rounded-full backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6"/></svg>
        </button>
        <button
          onClick={(e) => { e.preventDefault(); nextSlide(); }}
          className="absolute right-4 top-1/2 -translate-y-1/2 z-20 bg-black/30 hover:bg-black/50 text-white p-2 rounded-full backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m9 18 6-6-6-6"/></svg>
        </button>

        {/* Indicators */}
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 flex gap-2">
          {featuredNews.map((_, index) => (
            <button
              key={index}
              onClick={(e) => { e.preventDefault(); setCurrentIndex(index); }}
              className={`h-1.5 transition-all duration-300 rounded-full ${
                index === currentIndex ? 'w-8 bg-editorial-red' : 'w-2 bg-white/50 hover:bg-white/80'
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default FeaturedCarousel;
