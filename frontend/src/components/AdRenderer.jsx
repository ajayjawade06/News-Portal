import { useState, useEffect } from 'react';
import api from '../utils/api';
import { API_BASE_URL } from '../config';
import AdBanner from './AdBanner'; // The fallback / skeleton banner

const AdRenderer = ({ placement = 'header', fallbackIndex = 0 }) => {
  const [ads, setAds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentAdIndex, setCurrentAdIndex] = useState(0);

  useEffect(() => {
    let active = true;

    const fetchAds = async () => {
      try {
        setLoading(true);
        // GET /active fetches from the public active ads route
        const response = await api.get(`/ads/active?placement=${placement}`);
        if (active) {
          setAds(response.data.data || []);
        }
      } catch (err) {
        console.error(`Failed to fetch ads for placement: ${placement}`, err);
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    };

    fetchAds();

    return () => {
      active = false;
    };
  }, [placement]);

  // Rotate through multiple ads if they have equal priority
  useEffect(() => {
    if (ads.length <= 1) return;

    const timer = setInterval(() => {
      setCurrentAdIndex((prev) => (prev + 1) % ads.length);
    }, 15000); // rotate every 15 seconds

    return () => clearInterval(timer);
  }, [ads]);

  if (loading) {
    // Show skeleton / fallback while loading
    return <AdBanner type={placement === 'sidebar' ? 'vertical' : 'horizontal'} adIndex={fallbackIndex} />;
  }

  if (ads.length === 0) {
    // If no active ads for this placement, show the fallback dummy banner
    return <AdBanner type={placement === 'sidebar' ? 'vertical' : 'horizontal'} adIndex={fallbackIndex} />;
  }

  const ad = ads[currentAdIndex];

  // For Script/HTML Type Ads
  if (ad.type === 'script') {
    return (
      <div 
        className={`w-full flex justify-center my-4 ${
          placement === 'sidebar' ? 'max-w-[300px]' : 'max-w-[728px]'
        }`}
        dangerouslySetInnerHTML={{ __html: ad.content }}
      />
    );
  }

  // For Image Type Ads
  const adContent = (
    <div className={`relative group w-full flex justify-center my-4`}>
      <img
        src={ad.content.startsWith('http') ? ad.content : `${API_BASE_URL}${ad.content}`}
        alt={ad.title || 'Advertisement'}
        className={`object-contain bg-neutral-50 dark:bg-zinc-800 ${
          placement === 'sidebar' 
            ? 'w-[300px] h-[250px]' 
            : 'w-full max-w-[728px] max-h-[90px]'
        }`}
      />
      <div className="absolute top-0 right-0 bg-black/60 text-white text-[10px] px-1.5 py-0.5 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity">
        Ad
      </div>
    </div>
  );

  return ad.targetLink ? (
    <a href={ad.targetLink} target="_blank" rel="noopener noreferrer" className="block w-full flex justify-center">
      {adContent}
    </a>
  ) : adContent;
};

export default AdRenderer;
