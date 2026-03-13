import { useState } from 'react';

const AdBanner = ({ type = 'horizontal', adIndex = 0 }) => {
  const [hovered, setHovered] = useState(false);

  const sampleAds = [
    { title: "Sharma's Restaurant", subtitle: 'Authentic Indian Cuisine', address: 'Chandrapur Main Road' },
    { title: 'Digital Shop', subtitle: 'Electronics & Gadgets', address: 'Market Square' },
    { title: 'Rajesh Garments', subtitle: 'Fashion Store', address: 'Shopping Complex' },
    { title: 'City Hospital', subtitle: 'Quality Healthcare Services', address: 'Medical Plaza, Chandrapur' },
    { title: 'Arjun Auto Garage', subtitle: 'Car Repairs & Maintenance', address: 'Industrial Road' },
    { title: 'Priya Beauty Salon', subtitle: 'Hair & Spa Services', address: 'Mall Road, Rajura' },
    { title: 'Bright Education Center', subtitle: 'Coaching & Tuitions', address: 'Near School, Korpana' },
    { title: 'Green Valley Farm', subtitle: 'Fresh Produce & Organic Foods', address: 'Highway 16, Maharashtra' },
    { title: 'Royal Palace Hotel', subtitle: 'Banquets & Events', address: 'City Center' },
    { title: 'Tech Solutions IT', subtitle: 'Web Design & Development', address: 'Tech Park' },
  ];

  const ad = sampleAds[adIndex % sampleAds.length];

  if (type === 'horizontal') {
    return (
      <div
        className={`w-full max-w-[728px] h-[90px] border border-editorial-border dark:border-zinc-700 bg-neutral-50 dark:bg-zinc-800 flex items-center justify-between px-6 transition-colors ${hovered ? 'bg-neutral-100 dark:bg-zinc-700' : ''}`}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
      >
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-editorial-border flex items-center justify-center text-editorial-muted text-xs font-medium">
            Ad
          </div>
          <div>
            <div className="font-serif font-semibold text-editorial-black text-sm">{ad.title}</div>
            <div className="text-caption text-editorial-muted">{ad.subtitle}</div>
          </div>
        </div>
        <span className="text-xs font-medium text-editorial-muted border-b border-editorial-red pb-0.5">Learn more</span>
      </div>
    );
  }

  return (
    <div
      className={`w-[300px] border border-editorial-border dark:border-zinc-700 bg-neutral-50 dark:bg-zinc-800 p-6 text-center transition-colors ${hovered ? 'bg-neutral-100 dark:bg-zinc-700' : ''}`}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div className="text-caption text-editorial-muted dark:text-zinc-400 mb-3">Advertisement</div>
      <div className="font-serif font-semibold text-editorial-black dark:text-zinc-200 text-sm">{ad.title}</div>
      <div className="text-caption text-editorial-muted dark:text-zinc-400 mt-1">{ad.subtitle}</div>
      <div className="text-caption text-editorial-muted dark:text-zinc-400 mt-3">{ad.address}</div>
    </div>
  );
};

export default AdBanner;
