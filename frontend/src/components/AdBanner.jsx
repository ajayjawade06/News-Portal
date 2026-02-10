import React, { useState } from 'react';

const AdBanner = ({ type = 'horizontal', adIndex = 0 }) => {
  const [hovered, setHovered] = useState(false);

  // Sample ads for demonstration
  const sampleAds = [
    {
      title: 'Sharma\'s Restaurant',
      subtitle: 'Authentic Indian Cuisine',
      icon: '🍛',
      color: 'from-orange-500 to-orange-600',
      textColor: 'text-white',
      description: 'Best food in town',
      address: 'Chandrapur Main Road'
    },
    {
      title: 'Digital Shop',
      subtitle: 'Electronics & Gadgets',
      icon: '📱',
      color: 'from-blue-500 to-blue-600',
      textColor: 'text-white',
      description: 'Latest phones & laptops',
      address: 'Market Square'
    },
    {
      title: 'Rajesh Garments',
      subtitle: 'Fashion Store',
      icon: '👔',
      color: 'from-pink-500 to-pink-600',
      textColor: 'text-white',
      description: 'Trendy clothing',
      address: 'Shopping Complex'
    },
    {
      title: 'Dr. Patel Clinic',
      subtitle: 'Healthcare Services',
      icon: '⚕️',
      color: 'from-red-500 to-red-600',
      textColor: 'text-white',
      description: '24/7 Medical Care',
      address: 'Hospital Road'
    },
    {
      title: 'Green Garden Nursery',
      subtitle: 'Plants & Landscaping',
      icon: '🌿',
      color: 'from-green-500 to-green-600',
      textColor: 'text-white',
      description: 'Beautiful gardens',
      address: 'Outskirts'
    },
    {
      title: 'Priya Beauty Salon',
      subtitle: 'Beauty & Wellness',
      icon: '💅',
      color: 'from-purple-500 to-purple-600',
      textColor: 'text-white',
      description: 'Premium services',
      address: 'City Center'
    },
    {
      title: 'Om Sweets',
      subtitle: 'Indian Desserts',
      icon: '🍰',
      color: 'from-yellow-500 to-yellow-600',
      textColor: 'text-black',
      description: 'Traditional sweets',
      address: 'Temple Road'
    },
    {
      title: 'Fitness Gym',
      subtitle: 'Health & Fitness',
      icon: '💪',
      color: 'from-indigo-500 to-indigo-600',
      textColor: 'text-white',
      description: 'Professional trainers',
      address: 'Sports Complex'
    },
    {
      title: 'Property Plus',
      subtitle: 'Real Estate',
      icon: '🏠',
      color: 'from-amber-600 to-amber-700',
      textColor: 'text-white',
      description: 'Buy, Sell, Rent',
      address: 'Central Avenue'
    },
    {
      title: 'Gupta\'s Auto Repair',
      subtitle: 'Car Services',
      icon: '🚗',
      color: 'from-slate-600 to-slate-700',
      textColor: 'text-white',
      description: 'Expert mechanics',
      address: 'Outskirts'
    },
    {
      title: 'Bright Coaching Center',
      subtitle: 'Education & Coaching',
      icon: '📚',
      color: 'from-cyan-500 to-cyan-600',
      textColor: 'text-white',
      description: 'JEE, NEET & HSC',
      address: 'Education Hub'
    },
    {
      title: 'Sharma Hardware',
      subtitle: 'Building Materials',
      icon: '🔨',
      color: 'from-orange-600 to-orange-700',
      textColor: 'text-white',
      description: 'Quality materials',
      address: 'Industrial Area'
    }
  ];

  const ad = sampleAds[adIndex % sampleAds.length];

  if (type === 'horizontal') {
    return (
      <div
        className={`w-full max-w-[728px] h-[90px] rounded-lg shadow-lg overflow-hidden cursor-pointer transition-all duration-300 transform ${
          hovered ? 'shadow-xl scale-[1.02]' : ''
        }`}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        style={{
          background: `linear-gradient(135deg, var(--tw-gradient-stops))`
        }}
        className={`w-full max-w-[728px] h-[90px] rounded-lg shadow-lg overflow-hidden cursor-pointer transition-all duration-300 transform bg-gradient-to-br ${ad.color} ${ad.textColor} ${
          hovered ? 'shadow-xl scale-[1.02]' : ''
        }`}
      >
        <div className="h-full flex items-center justify-between px-6">
          <div className="flex items-center gap-4">
            <div className="text-4xl">{ad.icon}</div>
            <div>
              <div className="font-bold text-lg">{ad.title}</div>
              <div className="text-sm opacity-90">{ad.subtitle}</div>
              <div className="text-xs opacity-75">{ad.address}</div>
            </div>
          </div>
          <button className="px-4 py-1.5 bg-white/20 hover:bg-white/30 rounded-lg font-semibold text-sm transition-colors">
            Call Now
          </button>
        </div>
      </div>
    );
  }

  // Vertical ad (300x250)
  return (
    <div
      className={`w-[300px] h-[250px] rounded-lg shadow-lg overflow-hidden cursor-pointer transition-all duration-300 transform bg-gradient-to-br ${ad.color} ${ad.textColor} ${
        hovered ? 'shadow-xl scale-[1.05]' : ''
      }`}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div className="h-full flex flex-col items-center justify-center p-6 text-center">
        <div className="text-6xl mb-4">{ad.icon}</div>
        <div className="font-bold text-xl mb-2">{ad.title}</div>
        <div className="text-sm opacity-90 mb-1">{ad.subtitle}</div>
        <div className="text-xs opacity-80 mb-3 px-2">{ad.description}</div>
        <div className="text-xs opacity-70 mb-4 italic">📍 {ad.address}</div>
        <button className="px-6 py-2 bg-white/20 hover:bg-white/30 rounded-lg font-semibold text-sm transition-colors w-full">
          Contact Now
        </button>
      </div>
    </div>
  );
};

export default AdBanner;
