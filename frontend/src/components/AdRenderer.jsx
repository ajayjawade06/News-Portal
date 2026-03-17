import { useState, useEffect, useRef } from 'react';
import api from '../utils/api';
import { API_BASE_URL } from '../config';
import CtaBanner from './CtaBanner';

const AdRenderer = ({ placement = 'header' }) => {
  const [ads, setAds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentAdIndex, setCurrentAdIndex] = useState(0);
  const adRef = useRef(null);
  const trackedViews = useRef(new Set());

  useEffect(() => {
    let active = true;

    const fetchAds = async () => {
      try {
        setLoading(true);
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

  // View Tracking with Intersection Observer
  useEffect(() => {
    if (ads.length === 0 || loading) return;

    const currentAd = ads[currentAdIndex];
    if (!currentAd || trackedViews.current.has(currentAd._id)) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            // Track view
            api.post(`/ads/${currentAd._id}/view`).catch(() => {});
            trackedViews.current.add(currentAd._id);
            observer.disconnect();
          }
        });
      },
      { threshold: 0.5 } // 50% of the ad must be visible
    );

    if (adRef.current) {
      observer.observe(adRef.current);
    }

    return () => observer.disconnect();
  }, [ads, currentAdIndex, loading]);

  // Rotate through multiple ads
  useEffect(() => {
    if (ads.length <= 1) return;

    const timer = setInterval(() => {
      setCurrentAdIndex((prev) => (prev + 1) % ads.length);
    }, 15000);

    return () => clearInterval(timer);
  }, [ads]);

  const handleAdClick = (adId) => {
    api.post(`/ads/${adId}/click`).catch(() => {});
  };

  if (loading) {
    return <CtaBanner type={placement === 'sidebar' ? 'vertical' : 'horizontal'} />;
  }

  if (ads.length === 0) {
    return <CtaBanner type={placement === 'sidebar' ? 'vertical' : 'horizontal'} />;
  }

  const ad = ads[currentAdIndex];

  // For Script/HTML Type Ads
  if (ad.type === 'script') {
    return (
      <div 
        ref={adRef}
        className={`w-full flex justify-center my-4 ${
          placement === 'sidebar' ? 'max-w-[300px]' : 'max-w-[728px]'
        }`}
        dangerouslySetInnerHTML={{ __html: ad.content }}
        onClick={() => handleAdClick(ad._id)}
      />
    );
  }

  // For Image Type Ads
  const adContent = (
    <div ref={adRef} className={`relative group w-full flex justify-center my-4`}>
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
    <a 
      href={ad.targetLink} 
      target="_blank" 
      rel="noopener noreferrer" 
      className="block w-full flex justify-center"
      onClick={() => handleAdClick(ad._id)}
    >
      {adContent}
    </a>
  ) : adContent;
};

export default AdRenderer;
