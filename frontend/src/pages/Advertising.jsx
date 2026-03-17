import { useText } from '../hooks/useText';
import AdRenderer from '../components/AdRenderer';
import CheckoutModal from '../components/CheckoutModal';
import { useState } from 'react';

const Advertising = () => {
  const advertText = useText('Advertise');
  const [selectedPlan, setSelectedPlan] = useState(null);

  const handleOpenCheckout = (planId, planName, planPrice) => {
    setSelectedPlan({ id: planId, name: planName, price: planPrice });
  };

  const handleCloseCheckout = () => {
    setSelectedPlan(null);
  };

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    businessName: '',
    message: ''
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
      <section className="bg-editorial-red text-white py-16 md:py-24 text-center px-4">
        <h1 className="font-serif text-4xl md:text-5xl font-bold mb-4">Advertise With Us</h1>
        <p className="text-lg md:text-xl max-w-2xl mx-auto opacity-90 mb-8">
          Reach thousands of local and global readers daily. Grow your brand with premium ad placements on Lokawani.
        </p>
        <button
          onClick={() => document.getElementById('contact-form').scrollIntoView({ behavior: 'smooth' })}
          className="bg-white text-editorial-red font-semibold py-3 px-8 rounded shadow-lg hover:bg-gray-100 transition duration-300"
        >
          Get Started
        </button>
      </section>

      {/* Why Advertise With Us */}
      <section className="py-16 bg-neutral-50 dark:bg-zinc-900 border-b border-editorial-border dark:border-zinc-800">
        <div className="container-editorial max-w-5xl">
          <h2 className="text-3xl font-serif font-bold text-center mb-10 text-editorial-black dark:text-zinc-100">Why Advertise With Us?</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div className="p-6 bg-white dark:bg-zinc-800 rounded-lg shadow-sm border border-neutral-100 dark:border-zinc-700">
              <div className="text-4xl mb-4">📈</div>
              <h3 className="text-xl font-bold mb-2 dark:text-zinc-100">High Traffic</h3>
              <p className="text-editorial-muted dark:text-zinc-400">Thousands of daily active readers ensure your business gets maximum visibility.</p>
            </div>
            <div className="p-6 bg-white dark:bg-zinc-800 rounded-lg shadow-sm border border-neutral-100 dark:border-zinc-700">
              <div className="text-4xl mb-4">🎯</div>
              <h3 className="text-xl font-bold mb-2 dark:text-zinc-100">Targeted Audience</h3>
              <p className="text-editorial-muted dark:text-zinc-400">Reach the exact demographic you are looking for through our diverse news categories.</p>
            </div>
            <div className="p-6 bg-white dark:bg-zinc-800 rounded-lg shadow-sm border border-neutral-100 dark:border-zinc-700">
              <div className="text-4xl mb-4">💡</div>
              <h3 className="text-xl font-bold mb-2 dark:text-zinc-100">Affordable Pricing</h3>
              <p className="text-editorial-muted dark:text-zinc-400">Get the best return on investment with our flexible and transparent pricing plans.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Ad Placement Options */}
      <section className="py-16 border-b border-editorial-border dark:border-zinc-800">
        <div className="container-editorial max-w-5xl">
          <h2 className="text-3xl font-serif font-bold text-center mb-10 text-editorial-black dark:text-zinc-100">Ad Placement Options</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="border border-editorial-border dark:border-zinc-700 p-5 rounded hover:border-editorial-red transition-colors dark:bg-zinc-900">
              <h4 className="font-bold text-lg mb-1 dark:text-zinc-100">Top Banner</h4>
              <p className="text-sm text-editorial-muted dark:text-zinc-400 mb-3">Visible at the very top of all pages.</p>
              <div className="bg-neutral-100 dark:bg-zinc-800 h-10 w-full flex items-center justify-center text-xs text-neutral-400 border border-dashed border-neutral-300">728x90</div>
            </div>
            <div className="border border-editorial-border dark:border-zinc-700 p-5 rounded hover:border-editorial-red transition-colors dark:bg-zinc-900">
              <h4 className="font-bold text-lg mb-1 dark:text-zinc-100">In-Article Ads</h4>
              <p className="text-sm text-editorial-muted dark:text-zinc-400 mb-3">Appears smoothly between paragraphs.</p>
              <div className="bg-neutral-100 dark:bg-zinc-800 h-16 w-full flex items-center justify-center text-xs text-neutral-400 border border-dashed border-neutral-300">Responsive</div>
            </div>
            <div className="border border-editorial-border dark:border-zinc-700 p-5 rounded hover:border-editorial-red transition-colors dark:bg-zinc-900">
              <h4 className="font-bold text-lg mb-1 dark:text-zinc-100">Sidebar Ads</h4>
              <p className="text-sm text-editorial-muted dark:text-zinc-400 mb-3">Sticky placements on desktop sidebar.</p>
              <div className="bg-neutral-100 dark:bg-zinc-800 h-32 w-full flex items-center justify-center text-xs text-neutral-400 border border-dashed border-neutral-300">300x250</div>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="py-20 bg-neutral-50 dark:bg-zinc-900">
        <div className="container-editorial max-w-6xl">
          <h2 className="text-3xl font-serif font-bold text-center mb-4 text-editorial-black dark:text-zinc-100">Flexible Pricing Plans</h2>
          <p className="text-center text-editorial-muted mb-12 max-w-2xl mx-auto dark:text-zinc-400">Choose a package that fits your marketing budget and business goals.</p>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Basic Plan */}
            <div className="bg-white dark:bg-zinc-800 border border-neutral-200 dark:border-zinc-700 rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow relative flex flex-col">
              <h3 className="text-xl font-bold dark:text-zinc-100">Basic</h3>
              <div className="text-3xl font-bold text-editorial-red my-4">₹999 <span className="text-sm text-neutral-500 font-normal">/ week</span></div>
              <ul className="text-neutral-600 dark:text-zinc-400 space-y-3 mb-8 flex-1">
                <li className="flex items-start gap-2"><span className="text-green-500">✓</span> Sidebar Ad</li>
                <li className="flex items-start gap-2"><span className="text-green-500">✓</span> Small banner</li>
                <li className="flex items-start gap-2"><span className="text-green-500">✓</span> Limited visibility</li>
              </ul>
              <button
                onClick={() => handleOpenCheckout('basic', 'Basic', '999')}
                className="w-full py-2 border border-editorial-red text-editorial-red rounded hover:bg-editorial-red hover:text-white transition-colors">Choose Basic</button>
            </div>

            {/* Standard Plan */}
            <div className="bg-white dark:bg-zinc-800 border border-neutral-200 dark:border-zinc-700 rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow relative flex flex-col">
              <h3 className="text-xl font-bold dark:text-zinc-100">Standard</h3>
              <div className="text-3xl font-bold text-editorial-red my-4">₹2,499 <span className="text-sm text-neutral-500 font-normal">/ week</span></div>
              <ul className="text-neutral-600 dark:text-zinc-400 space-y-3 mb-8 flex-1">
                <li className="flex items-start gap-2"><span className="text-green-500">✓</span> Homepage banner</li>
                <li className="flex items-start gap-2"><span className="text-green-500">✓</span> In-article ads</li>
                <li className="flex items-start gap-2"><span className="text-green-500">✓</span> Medium visibility</li>
              </ul>
              <button
                onClick={() => handleOpenCheckout('standard', 'Standard', '2,499')}
                className="w-full py-2 border border-editorial-red text-editorial-red rounded hover:bg-editorial-red hover:text-white transition-colors">Choose Standard</button>
            </div>

            {/* Premium Plan */}
            <div className="bg-editorial-red text-white transform md:-translate-y-4 rounded-lg p-6 shadow-xl relative border-2 border-red-400 flex flex-col">
              <div className="absolute top-0 right-1/2 translate-x-1/2 -translate-y-1/2 bg-yellow-400 text-black text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wide">Most Popular</div>
              <h3 className="text-xl font-bold">Premium</h3>
              <div className="text-3xl font-bold my-4">₹4,999 <span className="text-sm text-red-100 font-normal">/ week</span></div>
              <ul className="text-red-50 space-y-3 mb-8 flex-1">
                <li className="flex items-start gap-2"><span className="text-yellow-300">✓</span> Top homepage placement</li>
                <li className="flex items-start gap-2"><span className="text-yellow-300">✓</span> In-article + sidebar ads</li>
                <li className="flex items-start gap-2"><span className="text-yellow-300">✓</span> Maximum reach</li>
                <li className="flex items-start gap-2"><span className="text-yellow-300">✓</span> Newsletter inclusion</li>
              </ul>
              <button
                onClick={() => handleOpenCheckout('premium', 'Premium', '4,999')}
                className="w-full py-2 bg-white text-editorial-red rounded hover:bg-gray-100 transition-colors font-bold">Choose Premium</button>
            </div>

            {/* Enterprise Plan */}
            <div className="bg-white dark:bg-zinc-800 border border-neutral-200 dark:border-zinc-700 rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow relative flex flex-col">
              <h3 className="text-xl font-bold dark:text-zinc-100">Enterprise</h3>
              <div className="text-3xl font-bold text-neutral-800 dark:text-neutral-200 my-4">Custom</div>
              <ul className="text-neutral-600 dark:text-zinc-400 space-y-3 mb-8 flex-1">
                <li className="flex items-start gap-2"><span className="text-green-500">✓</span> Sponsored articles</li>
                <li className="flex items-start gap-2"><span className="text-green-500">✓</span> Dedicated promotion</li>
                <li className="flex items-start gap-2"><span className="text-green-500">✓</span> Full site takeover options</li>
                <li className="flex items-start gap-2"><span className="text-green-500">✓</span> Account manager</li>
              </ul>
              <button
                onClick={() => handleOpenCheckout('enterprise', 'Enterprise', 'Custom')}
                className="w-full py-2 border border-neutral-400 text-neutral-600 dark:text-neutral-300 dark:border-zinc-500 rounded hover:bg-neutral-100 dark:hover:bg-zinc-700 transition-colors">Get Custom Quote</button>
            </div>
          </div>
        </div>
      </section>

      {/* Inquiry Form */}
      <section id="contact-form" className="py-20">
        <div className="container-editorial max-w-3xl">
          <div className="bg-white dark:bg-zinc-900 border border-editorial-border dark:border-zinc-800 rounded-xl p-8 md:p-12 shadow-sm">
            <h2 className="text-3xl font-serif font-bold text-center mb-2 dark:text-zinc-100">Start Advertising Today</h2>
            <p className="text-center text-editorial-muted dark:text-zinc-400 mb-8">Fill out the form below and our advertising team will get in touch with you.</p>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-zinc-300 mb-1">Full Name</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2 border border-gray-300 dark:border-zinc-700 rounded-md focus:ring-editorial-red focus:border-editorial-red dark:bg-zinc-800 dark:text-zinc-100"
                    placeholder="John Doe"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-zinc-300 mb-1">Email Address</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2 border border-gray-300 dark:border-zinc-700 rounded-md focus:ring-editorial-red focus:border-editorial-red dark:bg-zinc-800 dark:text-zinc-100"
                    placeholder="john@example.com"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-zinc-300 mb-1">Business/Company Name</label>
                <input
                  type="text"
                  name="businessName"
                  value={formData.businessName}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 dark:border-zinc-700 rounded-md focus:ring-editorial-red focus:border-editorial-red dark:bg-zinc-800 dark:text-zinc-100"
                  placeholder="Your Company Inc."
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-zinc-300 mb-1">Message / Requirements</label>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  required
                  rows="4"
                  className="w-full px-4 py-2 border border-gray-300 dark:border-zinc-700 rounded-md focus:ring-editorial-red focus:border-editorial-red dark:bg-zinc-800 dark:text-zinc-100"
                  placeholder="Tell us about your advertising goals and preferred plan..."
                ></textarea>
              </div>
              <button
                type="submit"
                className="w-full bg-editorial-black dark:bg-zinc-100 text-white dark:text-zinc-900 font-bold py-3 px-4 rounded-md hover:bg-neutral-800 dark:hover:bg-white transition-colors"
              >
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
