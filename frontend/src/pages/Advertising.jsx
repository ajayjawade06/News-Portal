import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useText } from '../hooks/useText';
import AdRenderer from '../components/AdRenderer';
import CheckoutModal from '../components/CheckoutModal';
import api from '../utils/api';

const Advertising = () => {
  const location = useLocation();
  const advertText = useText('Advertise');
  const [selectedPlan, setSelectedPlan] = useState(null);
  
  const [plans, setPlans] = useState([]);
  const [discountConfig, setDiscountConfig] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPlansAndConfig = async () => {
      try {
        const [plansRes, configRes] = await Promise.all([
          api.get('/plans/active'),
          api.get('/plans/config')
        ]);
        setPlans(plansRes.data.data || []);
        setDiscountConfig(configRes.data.data);
      } catch (error) {
        console.error('Error fetching plans:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchPlansAndConfig();
  }, []);

  // Check if we should re-open checkout modal after login
  useEffect(() => {
    if (location.state?.pendingPlanId && plans.length > 0) {
      const planToRestore = plans.find(p => p.internalId === location.state.pendingPlanId);
      if (planToRestore) {
        handleOpenCheckout(
          planToRestore.internalId, 
          planToRestore.name, 
          planToRestore.price, 
          planToRestore.isCustom, 
          planToRestore.durationDays
        );
        // Clear state to prevent modal reopening on refresh
        window.history.replaceState({}, document.title);
      }
    }
  }, [location.state, plans]);

  const handleOpenCheckout = (planId, planName, planPrice, isCustom, durationDays) => {
    setSelectedPlan({ 
      id: planId, 
      name: planName, 
      price: planPrice, 
      isCustom, 
      durationDays,
      discountPercentage: discountConfig?.isDiscountActive ? discountConfig.discountPercentage : 0,
      discountName: discountConfig?.discountName || 'Special'
    });
  };

  const handleCloseCheckout = () => {
    setSelectedPlan(null);
  };

  const [formData, setFormData] = useState({
    name: '', email: '', businessName: '', message: ''
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    alert('Thank you for your inquiry! Our team will get back to you shortly.');
    setFormData({ name: '', email: '', businessName: '', message: '' });
  };

  return (
    <div className="bg-white dark:bg-zinc-950 min-h-screen">
      {/* Hero Section */}
      <section className="bg-editorial-red text-white py-16 md:py-24 text-center px-4 relative overflow-hidden">
        {discountConfig?.isDiscountActive && discountConfig.discountPercentage > 0 && (
          <div className="absolute top-0 left-0 w-full bg-yellow-400 text-black py-2 font-bold uppercase tracking-widest text-sm z-10">
            {discountConfig.discountName || 'Special'} Offer: Get {discountConfig.discountPercentage}% OFF on all Ad Plans!
          </div>
        )}
        <h1 className={`font-serif text-4xl md:text-5xl font-bold mb-4 ${discountConfig?.isDiscountActive ? 'mt-8' : ''}`}>Advertise With Us</h1>
        <p className="text-lg md:text-xl max-w-2xl mx-auto opacity-90 mb-8">
          Reach thousands of local and global readers daily. Grow your brand with premium ad placements on Lokawani.
        </p>
        <button
          onClick={() => document.getElementById('pricing-plans').scrollIntoView({ behavior: 'smooth' })}
          className="bg-white text-editorial-red font-semibold py-3 px-8 rounded shadow-lg hover:bg-gray-100 transition duration-300"
        >
          View Pricing
        </button>
      </section>

      {/* Why Advertise With Us */}
      <section className="py-16 bg-neutral-50 dark:bg-zinc-900 border-b border-editorial-border dark:border-zinc-800">
        <div className="container-editorial max-w-5xl">
          <h2 className="text-3xl font-serif font-bold text-center mb-10 text-editorial-black dark:text-zinc-100">Why Advertise With Us?</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div className="p-6 bg-white dark:bg-zinc-800 rounded-lg shadow-sm border border-neutral-100 dark:border-zinc-700 hover:-translate-y-1 transition-transform">
              <div className="text-4xl mb-4">📈</div>
              <h3 className="text-xl font-bold mb-2 dark:text-zinc-100">High Traffic</h3>
              <p className="text-editorial-muted dark:text-zinc-400">Thousands of daily active readers ensure your business gets maximum visibility.</p>
            </div>
            <div className="p-6 bg-white dark:bg-zinc-800 rounded-lg shadow-sm border border-neutral-100 dark:border-zinc-700 hover:-translate-y-1 transition-transform">
              <div className="text-4xl mb-4">🎯</div>
              <h3 className="text-xl font-bold mb-2 dark:text-zinc-100">Targeted Audience</h3>
              <p className="text-editorial-muted dark:text-zinc-400">Reach the exact demographic you are looking for through our diverse news categories.</p>
            </div>
            <div className="p-6 bg-white dark:bg-zinc-800 rounded-lg shadow-sm border border-neutral-100 dark:border-zinc-700 hover:-translate-y-1 transition-transform">
              <div className="text-4xl mb-4">💡</div>
              <h3 className="text-xl font-bold mb-2 dark:text-zinc-100">Affordable Pricing</h3>
              <p className="text-editorial-muted dark:text-zinc-400">Get the best return on investment with our flexible and transparent pricing plans.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing-plans" className="py-20 bg-white dark:bg-zinc-950">
        <div className="container-editorial max-w-7xl">
          <h2 className="text-3xl font-serif font-bold text-center mb-4 text-editorial-black dark:text-zinc-100">Flexible Pricing Plans</h2>
          <p className="text-center text-editorial-muted mb-12 max-w-2xl mx-auto dark:text-zinc-400">Choose a package that fits your marketing budget and business goals.</p>

          {loading ? (
             <div className="flex justify-center items-center py-20">
               <div className="w-10 h-10 border-2 border-t-editorial-red rounded-full animate-spin"></div>
             </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 items-start">
              {plans.map((plan, idx) => {
                const isDiscounted = !plan.isCustom && discountConfig?.isDiscountActive && discountConfig.discountPercentage > 0;
                const discountedPrice = isDiscounted 
                  ? Math.round(plan.price * (1 - (discountConfig.discountPercentage / 100))) 
                  : plan.price;

                // Make the 3rd plan (typically premium) pop out more
                const isPopular = idx === 2 || plan.internalId === 'premium';
                
                return (
                  <div key={plan._id} className={`flex flex-col relative ${
                    isPopular 
                    ? 'bg-editorial-red text-white transform md:-translate-y-4 rounded-xl p-8 shadow-2xl border-2 border-red-400 z-10' 
                    : 'bg-neutral-50 dark:bg-zinc-900 border border-neutral-200 dark:border-zinc-800 rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow'
                  }`}>
                    {isPopular && (
                      <div className="absolute top-0 right-1/2 translate-x-1/2 -translate-y-1/2 bg-yellow-400 text-black text-xs font-black px-4 py-1 rounded-full uppercase tracking-widest">
                        Most Popular
                      </div>
                    )}
                    
                    <h3 className={`text-2xl font-bold ${isPopular ? '' : 'dark:text-zinc-100'}`}>{plan.name}</h3>
                    <p className={`text-sm mt-1 mb-4 ${isPopular ? 'text-red-100' : 'text-editorial-muted dark:text-zinc-400'}`}>{plan.title}</p>
                    
                    <div className="mb-6">
                      {plan.isCustom ? (
                        <div className={`text-3xl font-black ${isPopular ? '' : 'text-editorial-black dark:text-zinc-100'}`}>Custom</div>
                      ) : (
                        <div className="flex flex-col">
                          {isDiscounted && (
                            <div className="text-sm line-through opacity-70 mb-1">₹{plan.price.toLocaleString('en-IN')}</div>
                          )}
                          <div className={`text-4xl font-black ${isPopular ? '' : 'text-editorial-red'}`}>
                            ₹{discountedPrice.toLocaleString('en-IN')}
                            <span className={`text-sm font-normal ml-1 ${isPopular ? 'text-red-100' : 'text-neutral-500'}`}>/ {plan.durationDays} days</span>
                          </div>
                        </div>
                      )}
                    </div>
                    
                    <ul className={`space-y-3 mb-8 flex-1 text-sm ${isPopular ? 'text-red-50' : 'text-neutral-600 dark:text-zinc-400'}`}>
                      {plan.perks.map((perk, i) => (
                        <li key={i} className="flex items-start gap-2">
                          <span className={isPopular ? "text-yellow-300" : "text-green-500"}>✓</span> 
                          {perk}
                        </li>
                      ))}
                    </ul>

                    <button
                      onClick={() => handleOpenCheckout(plan.internalId, plan.name, plan.price, plan.isCustom, plan.durationDays)}
                      className={`w-full py-3 rounded font-bold transition-all ${
                        isPopular 
                        ? 'bg-white text-editorial-red hover:bg-gray-100 shadow-md' 
                        : 'border-2 border-editorial-black dark:border-zinc-300 text-editorial-black dark:text-zinc-100 hover:bg-editorial-black hover:text-white dark:hover:bg-white dark:hover:text-zinc-900'
                      }`}
                    >
                      {plan.isCustom ? 'Get Custom Quote' : `Choose ${plan.name}`}
                    </button>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </section>

      {/* Inquiry Form */}
      <section id="contact-form" className="py-20 bg-neutral-50 dark:bg-zinc-900 border-t border-editorial-border dark:border-zinc-800">
        <div className="container-editorial max-w-3xl">
          <div className="bg-white dark:bg-zinc-950 border border-editorial-border dark:border-zinc-800 rounded-xl p-8 md:p-12 shadow-sm">
            <h2 className="text-3xl font-serif font-bold text-center mb-2 dark:text-zinc-100">Start Advertising Today</h2>
            <p className="text-center text-editorial-muted dark:text-zinc-400 mb-8">Fill out the form below and our advertising team will get in touch with you.</p>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-zinc-300 mb-1">Full Name</label>
                  <input type="text" name="name" value={formData.name} onChange={handleChange} required className="w-full px-4 py-2 border border-gray-300 dark:border-zinc-700 rounded-md focus:ring-editorial-red focus:border-editorial-red dark:bg-zinc-800 dark:text-zinc-100" placeholder="John Doe" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-zinc-300 mb-1">Email Address</label>
                  <input type="email" name="email" value={formData.email} onChange={handleChange} required className="w-full px-4 py-2 border border-gray-300 dark:border-zinc-700 rounded-md focus:ring-editorial-red focus:border-editorial-red dark:bg-zinc-800 dark:text-zinc-100" placeholder="john@example.com" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-zinc-300 mb-1">Business/Company Name</label>
                <input type="text" name="businessName" value={formData.businessName} onChange={handleChange} required className="w-full px-4 py-2 border border-gray-300 dark:border-zinc-700 rounded-md focus:ring-editorial-red focus:border-editorial-red dark:bg-zinc-800 dark:text-zinc-100" placeholder="Your Company Inc." />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-zinc-300 mb-1">Message / Requirements</label>
                <textarea name="message" value={formData.message} onChange={handleChange} required rows="4" className="w-full px-4 py-2 border border-gray-300 dark:border-zinc-700 rounded-md focus:ring-editorial-red focus:border-editorial-red dark:bg-zinc-800 dark:text-zinc-100" placeholder="Tell us about your advertising goals and preferred plan..."></textarea>
              </div>
              <button type="submit" className="w-full bg-editorial-black dark:bg-zinc-100 text-white dark:text-zinc-900 font-bold py-3 px-4 rounded-md hover:bg-neutral-800 dark:hover:bg-white transition-colors">
                Send Inquiry
              </button>
            </form>
          </div>
        </div>
      </section>

      {selectedPlan && (
        <CheckoutModal plan={selectedPlan} onClose={handleCloseCheckout} />
      )}
    </div>
  );
};

export default Advertising;
