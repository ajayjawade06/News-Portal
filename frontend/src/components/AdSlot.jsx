import { useState, useEffect, useRef } from 'react';
import { adAPI } from '../utils/api';

const AdSlot = ({ position, page, className = '' }) => {
  const [ads, setAds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentAdIndex, setCurrentAdIndex] = useState(0);
  const impressionTracked = useRef(false);
  const clickTimeout = useRef(null);

  useEffect(() => {
    const fetchAds = async () => {
      try {
        const response = await adAPI.getAds(position, page);
        setAds(response.data.ads || []);
      } catch (error) {
        console.error('Error fetching ads:', error);
        setAds([]);
      } finally {
        setLoading(false);
      }
    };

    fetchAds();
  }, [position, page]);

  useEffect(() => {
    // Track impression when ad becomes visible
    if (ads.length > 0 && !impressionTracked.current) {
      const trackImpression = async () => {
        try {
          await adAPI.trackImpression(ads[currentAdIndex]._id);
          impressionTracked.current = true;
        } catch (error) {
          console.error('Error tracking impression:', error);
        }
      };

      // Use Intersection Observer to track when ad is visible
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting && !impressionTracked.current) {
              trackImpression();
            }
          });
        },
        { threshold: 0.5 }
      );

      const adElement = document.getElementById(`ad-${position}-${currentAdIndex}`);
      if (adElement) {
        observer.observe(adElement);
      }

      return () => observer.disconnect();
    }
  }, [ads, currentAdIndex, position]);

  const handleAdClick = async (ad) => {
    // Debounce clicks to prevent spam
    if (clickTimeout.current) return;

    clickTimeout.current = setTimeout(() => {
      clickTimeout.current = null;
    }, 1000);

    try {
      await adAPI.trackClick(ad._id);
      // Open ad URL in new tab
      window.open(ad.redirectUrl, '_blank', 'noopener,noreferrer');
    } catch (error) {
      console.error('Error tracking click:', error);
      // Still open the URL even if tracking fails
      window.open(ad.redirectUrl, '_blank', 'noopener,noreferrer');
    }
  };

  // Rotate ads every 30 seconds if multiple ads
  useEffect(() => {
    if (ads.length > 1) {
      const interval = setInterval(() => {
        setCurrentAdIndex((prev) => (prev + 1) % ads.length);
        impressionTracked.current = false; // Reset for new ad
      }, 30000);

      return () => clearInterval(interval);
    }
  }, [ads.length]);

  if (loading) {
    // Skeleton loader
    return (
      <div className={`animate-pulse bg-gray-200 rounded ${className}`}>
        <div className="h-full bg-gray-300 rounded"></div>
      </div>
    );
  }

  if (ads.length === 0) {
    // No ads available - render empty space to prevent layout shift
    return <div className={className}></div>;
  }

  const currentAd = ads[currentAdIndex];

  // Different layouts based on position
  if (position === 'top-banner') {
    return (
      <div className={`bg-white rounded-lg shadow-sm overflow-hidden ${className}`}>
        <div
          id={`ad-${position}-${currentAdIndex}`}
          className="cursor-pointer hover:opacity-90 transition-opacity"
          onClick={() => handleAdClick(currentAd)}
        >
          <img
            src={currentAd.imageUrl}
            alt={currentAd.title}
            className="w-full h-20 sm:h-24 md:h-28 lg:h-32 object-cover"
            loading="lazy"
          />
        </div>
        {ads.length > 1 && (
          <div className="flex justify-center space-x-1 p-2">
            {ads.map((_, index) => (
              <div
                key={index}
                className={`w-2 h-2 rounded-full ${
                  index === currentAdIndex ? 'bg-blue-500' : 'bg-gray-300'
                }`}
              />
            ))}
          </div>
        )}
      </div>
    );
  }

  if (position === 'sidebar') {
    return (
      <div className={`bg-white rounded-lg shadow-sm overflow-hidden ${className}`}>
        <div
          id={`ad-${position}-${currentAdIndex}`}
          className="cursor-pointer hover:opacity-90 transition-opacity"
          onClick={() => handleAdClick(currentAd)}
        >
          <img
            src={currentAd.imageUrl}
            alt={currentAd.title}
            className="w-full h-32 sm:h-36 md:h-40 lg:h-48 object-cover"
            loading="lazy"
          />
        </div>
      </div>
    );
  }

  if (position === 'inline') {
    return (
      <div className={`bg-white rounded-lg shadow-sm overflow-hidden ${className}`}>
        <div
          id={`ad-${position}-${currentAdIndex}`}
          className="cursor-pointer hover:opacity-90 transition-opacity"
          onClick={() => handleAdClick(currentAd)}
        >
          <img
            src={currentAd.imageUrl}
            alt={currentAd.title}
            className="w-full h-16 sm:h-20 md:h-22 lg:h-24 object-cover"
            loading="lazy"
          />
        </div>
      </div>
    );
  }

  return null;
};

export default AdSlot;