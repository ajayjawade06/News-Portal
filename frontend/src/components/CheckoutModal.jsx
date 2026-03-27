import React, { useState, useMemo, useEffect, useCallback } from 'react';
import api from '../utils/api';

// Per-day rates for Enterprise custom pricing
const ENTERPRISE_RATES = {
  weekday: 350,
  weekend: 600,
};

// What each plan unlocks — placements and key perks
const PLAN_CONFIG = {
  basic: {
    label: 'Basic',
    placements: [
      { value: 'sidebar', label: 'Sidebar Placement' },
    ],
    perks: ['Sidebar ad only', '1 week campaign', 'Basic visibility'],
    defaultPlacement: 'sidebar',
  },
  standard: {
    label: 'Standard',
    placements: [
      { value: 'sidebar', label: 'Sidebar Placement' },
      { value: 'in-feed', label: 'In-Feed (Between News Cards)' },
    ],
    perks: ['Sidebar + In-Feed ads', '1 week campaign', 'Medium visibility', 'Homepage reach'],
    defaultPlacement: 'in-feed',
  },
  premium: {
    label: 'Premium',
    placements: [
      { value: 'header', label: 'Header Placement (Top of page)' },
      { value: 'in-feed', label: 'In-Feed (Between News Cards)' },
      { value: 'sidebar', label: 'Sidebar Placement' },
    ],
    perks: ['ALL placements — Header, In-Feed & Sidebar', '1 week campaign', 'Maximum reach', 'Newsletter inclusion'],
    defaultPlacement: 'header',
  },
  enterprise: {
    label: 'Enterprise',
    placements: [
      { value: 'header', label: 'Header Placement (Top of page)' },
      { value: 'in-feed', label: 'In-Feed (Between News Cards)' },
      { value: 'sidebar', label: 'Sidebar Placement' },
    ],
    perks: ['Custom date range', 'All placements', 'Weekday/weekend pricing', 'Dedicated account manager'],
    defaultPlacement: 'header',
  },
};

function countDays(start, end) {
  if (!start || !end) return { weekdays: 0, weekends: 0, total: 0 };
  const s = new Date(start);
  const e = new Date(end);
  let weekdays = 0, weekends = 0;
  const cur = new Date(s);
  while (cur <= e) {
    const day = cur.getDay();
    if (day === 0 || day === 6) weekends++;
    else weekdays++;
    cur.setDate(cur.getDate() + 1);
  }
  return { weekdays, weekends, total: weekdays + weekends };
}

function addDays(dateStr, n) {
  if (!dateStr) return '';
  const d = new Date(dateStr);
  d.setDate(d.getDate() + n);
  return d.toISOString().split('T')[0];
}

// Count how many booked ranges overlap with the given start-end range
function countOverlaps(bookedRanges, start, end) {
  if (!start || !end) return 0;
  const s = new Date(start);
  const e = new Date(end);
  return bookedRanges.filter(range => {
    const rs = new Date(range.startDate);
    const re = range.endDate ? new Date(range.endDate) : new Date('2099-01-01');
    return rs <= e && re >= s;
  }).length;
}

const CheckoutModal = ({ plan, onClose }) => {
  const isEnterprise = plan.id === 'enterprise';
  const isWeekly = !isEnterprise;

  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const planConfig = PLAN_CONFIG[plan.id] || PLAN_CONFIG.premium;
  const [placement, setPlacement] = useState(planConfig.defaultPlacement);

  // Booked dates data from backend
  const [bookedData, setBookedData] = useState(null);
  const [bookedLoading, setBookedLoading] = useState(false);

  const [advertiserName, setAdvertiserName] = useState('');
  const [email, setEmail] = useState('');
  const [businessName, setBusinessName] = useState('');

  // Fetch booked date ranges whenever placement changes
  const fetchBookedDates = useCallback(async (pl) => {
    setBookedLoading(true);
    try {
      const res = await api.get(`/bookings/booked-dates?placement=${pl}`);
      setBookedData(res.data.data);
    } catch {
      setBookedData(null);
    } finally {
      setBookedLoading(false);
    }
  }, []);

  useEffect(() => { fetchBookedDates(placement); }, [placement, fetchBookedDates]);

  const effectiveEndDate = isWeekly ? addDays(startDate, 7) : endDate;

  // Availability status for selected dates
  const datesAvailability = useMemo(() => {
    if (!bookedData || !startDate || !effectiveEndDate) return null;
    const allRanges = [...(bookedData.adSlots || []), ...(bookedData.bookings || [])];
    const overlaps = countOverlaps(allRanges, startDate, effectiveEndDate);
    const remaining = bookedData.maxAllowed - overlaps;
    return { overlaps, remaining, isFull: remaining <= 0 };
  }, [bookedData, startDate, effectiveEndDate]);

  const { weekdays, weekends, total } = useMemo(
    () => countDays(startDate, effectiveEndDate),
    [startDate, effectiveEndDate]
  );
  const enterpriseCost = weekdays * ENTERPRISE_RATES.weekday + weekends * ENTERPRISE_RATES.weekend;
  const displayAmount = isEnterprise ? enterpriseCost.toLocaleString('en-IN') : plan.price;

  const handleStartDateChange = (val) => {
    setStartDate(val);
    if (isEnterprise && endDate && val > endDate) setEndDate('');
  };

  const nextStep = () => {
    setError('');

    if (step === 1) {
      if (!startDate || !placement) {
        return setError('Please select a placement and start date.');
      }
      if (isEnterprise && !endDate) {
        return setError('Please select an end date for your custom campaign.');
      }
      if (isEnterprise && new Date(startDate) > new Date(endDate)) {
        return setError('End date must be on or after the start date.');
      }
      if (isEnterprise && total < 1) {
        return setError('Please select at least 1 day.');
      }
      if (datesAvailability?.isFull) {
        return setError(`The ${placement} placement is fully booked for the selected dates. Please choose different dates or a different placement.`);
      }
    }

    if (step === 2) {
      if (!advertiserName || !email || !businessName) {
        return setError('Please fill in all advertiser details.');
      }
    }

    setStep(step + 1);
  };

  const prevStep = () => setStep(step - 1);

  const handleSubmit = async (e) => {
    if (e) e.preventDefault();
    
    setLoading(true);
    setError('');

    try {
      const amountToPay = isEnterprise
        ? enterpriseCost
        : parseInt(plan.price.replace(/,/g, ''), 10);

      // 1. Create Order on Backend
      const orderRes = await api.post('/razorpay/order', {
        amount: amountToPay,
        receipt: `receipt_booking_${Date.now()}`
      });

      if (!orderRes.data?.success) {
        throw new Error(orderRes.data?.message || 'Failed to create order');
      }

      const { order } = orderRes.data;

      // 2. Open Razorpay Checkout
      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID, // Enter the Key ID generated from the Dashboard
        amount: order.amount,
        currency: order.currency,
        name: "Lokawani News",
        description: `${plan.name} Ad Booking`,
        image: "/image.png",
        order_id: order.id,
        handler: async function (response) {
          try {
            // 3. Verify Payment on Backend
            const verifyRes = await api.post('/razorpay/verify', {
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
            });

            if (verifyRes.data?.success) {
              // 4. Finalize Booking
              const bookingRes = await api.post('/bookings/book', {
                advertiserName,
                email,
                businessName,
                planId: plan.id,
                placement,
                startDate,
                endDate: effectiveEndDate,
                amountPaid: amountToPay,
                razorpay_payment_id: response.razorpay_payment_id // Optional: store payment ID
              });

              if (bookingRes.data?.success) {
                setStep(4);
              } else {
                setError(bookingRes.data?.message || 'Payment verified but booking failed. Please contact support.');
              }
            } else {
              setError('Payment verification failed. Please contact support.');
            }
          } catch (err) {
            setError('Error during payment verification: ' + (err.response?.data?.message || err.message));
          } finally {
            setLoading(false);
          }
        },
        prefill: {
          name: advertiserName,
          email: email
        },
        notes: {
          address: "Lokawani Corporate Office"
        },
        theme: {
          color: "#dc2626" // editorial-red
        },
        modal: {
          ondismiss: function() {
            setLoading(false);
          }
        }
      };

      const rzp1 = new window.Razorpay(options);
      rzp1.open();

    } catch (err) {
      const msg = err.response?.data?.message || err.message || 'Error initiating payment.';
      setError(msg);
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 px-4">
      <div className="bg-white dark:bg-zinc-900 rounded-lg shadow-xl w-full max-w-lg overflow-hidden relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-800 dark:text-zinc-400 dark:hover:text-zinc-100 z-10 text-lg leading-none"
        >
          ✕
        </button>

        {/* Header */}
        <div className="bg-editorial-red text-white p-6">
          <h2 className="text-xl font-bold font-serif mb-1">Checkout</h2>
          <p className="text-red-100/80 text-sm mb-3">
            {plan.name} Plan •{' '}
            {isEnterprise
              ? 'Custom Pricing (Weekdays ₹350/day · Weekends ₹600/day)'
              : `₹${plan.price} / week`}
          </p>
          <div className="flex flex-wrap gap-x-3 gap-y-1">
            {planConfig.perks.map((perk, i) => (
              <span key={i} className="text-xs text-red-100 flex items-center gap-1">
                <span className="text-yellow-300">✓</span> {perk}
              </span>
            ))}
          </div>
        </div>

        <div className="p-6">
          {error && (
            <div className="mb-4 bg-red-50 text-red-600 border border-red-200 p-3 rounded text-sm font-medium">
              {error}
            </div>
          )}

          {/* STEP 1: Dates */}
          {step === 1 && (
            <div className="space-y-4 animate-fade-in">
              <h3 className="font-bold text-gray-800 dark:text-zinc-100 mb-2">Step 1: Campaign Dates</h3>

              {/* Placement — only options unlocked by this plan */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-zinc-300 mb-1">
                  Ad Placement
                  {planConfig.placements.length === 1 && (
                    <span className="ml-2 text-xs text-editorial-muted font-normal">(included with this plan)</span>
                  )}
                </label>
                <select
                  value={placement}
                  onChange={(e) => setPlacement(e.target.value)}
                  disabled={planConfig.placements.length === 1}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-zinc-700 rounded-md focus:ring-editorial-red focus:border-editorial-red dark:bg-zinc-800 dark:text-zinc-100 disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  {planConfig.placements.map(p => (
                    <option key={p.value} value={p.value}>{p.label}</option>
                  ))}
                </select>
              </div>

              {/* Start Date */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-zinc-300 mb-1">
                  {isWeekly ? 'Campaign Start Date' : 'Start Date'}
                </label>
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => handleStartDateChange(e.target.value)}
                  min={new Date().toISOString().split('T')[0]}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-zinc-700 rounded-md focus:ring-editorial-red focus:border-editorial-red dark:bg-zinc-800 dark:text-zinc-100"
                />
              </div>

              {/* Weekly: auto-show end date; Enterprise: allow custom end date */}
              {isWeekly && startDate && (
                <div className="bg-neutral-50 dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 rounded-md px-4 py-3 text-sm text-gray-600 dark:text-zinc-300 flex justify-between">
                  <span>Campaign ends:</span>
                  <span className="font-semibold text-editorial-black dark:text-zinc-100">{effectiveEndDate}</span>
                </div>
              )}

              {isEnterprise && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-zinc-300 mb-1">End Date</label>
                  <input
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    min={startDate || new Date().toISOString().split('T')[0]}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-zinc-700 rounded-md focus:ring-editorial-red focus:border-editorial-red dark:bg-zinc-800 dark:text-zinc-100"
                  />
                </div>
              )}

              {/* Availability status */}
              {startDate && effectiveEndDate && (
                <div>
                  {bookedLoading ? (
                    <div className="text-xs text-editorial-muted">Checking availability...</div>
                  ) : datesAvailability ? (
                    datesAvailability.isFull ? (
                      <div className="bg-red-50 border border-red-200 text-red-600 text-sm rounded-md px-4 py-3 font-medium">
                        ⚠️ The <span className="capitalize">{placement}</span> placement is fully booked for these dates. Please choose different dates or placement.
                      </div>
                    ) : (
                      <div className="bg-green-50 border border-green-200 text-green-700 text-sm rounded-md px-4 py-3">
                        ✅ <strong>{datesAvailability.remaining} slot{datesAvailability.remaining !== 1 ? 's' : ''} available</strong> for the selected dates.
                      </div>
                    )
                  ) : null}
                </div>
              )}

              {/* Enterprise: Live pricing breakdown */}
              {isEnterprise && startDate && endDate && total > 0 && (
                <div className="bg-amber-50 dark:bg-zinc-800 border border-amber-200 dark:border-zinc-700 rounded-md px-4 py-3 space-y-1 text-sm">
                  <p className="font-semibold text-gray-700 dark:text-zinc-200 mb-2">Pricing Breakdown</p>
                  <div className="flex justify-between text-gray-600 dark:text-zinc-400">
                    <span>{weekdays} weekdays × ₹{ENTERPRISE_RATES.weekday}</span>
                    <span>₹{(weekdays * ENTERPRISE_RATES.weekday).toLocaleString('en-IN')}</span>
                  </div>
                  <div className="flex justify-between text-gray-600 dark:text-zinc-400">
                    <span>{weekends} weekend days × ₹{ENTERPRISE_RATES.weekend}</span>
                    <span>₹{(weekends * ENTERPRISE_RATES.weekend).toLocaleString('en-IN')}</span>
                  </div>
                  <div className="flex justify-between font-bold text-editorial-black dark:text-zinc-100 pt-2 border-t border-amber-200 dark:border-zinc-600 mt-1">
                    <span>Total ({total} days)</span>
                    <span className="text-editorial-red">₹{enterpriseCost.toLocaleString('en-IN')}</span>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* STEP 2: Business Details */}
          {step === 2 && (
            <div className="space-y-4 animate-fade-in">
              <h3 className="font-bold text-gray-800 dark:text-zinc-100 mb-2">Step 2: Business Details</h3>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-zinc-300 mb-1">Full Name</label>
                <input
                  type="text"
                  value={advertiserName}
                  onChange={(e) => setAdvertiserName(e.target.value)}
                  placeholder="John Doe"
                  className="w-full px-3 py-2 border border-gray-300 dark:border-zinc-700 rounded-md focus:ring-editorial-red focus:border-editorial-red dark:bg-zinc-800 dark:text-zinc-100"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-zinc-300 mb-1">Email Address</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="john@example.com"
                  className="w-full px-3 py-2 border border-gray-300 dark:border-zinc-700 rounded-md focus:ring-editorial-red focus:border-editorial-red dark:bg-zinc-800 dark:text-zinc-100"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-zinc-300 mb-1">Business Name</label>
                <input
                  type="text"
                  value={businessName}
                  onChange={(e) => setBusinessName(e.target.value)}
                  placeholder="Your Company Inc."
                  className="w-full px-3 py-2 border border-gray-300 dark:border-zinc-700 rounded-md focus:ring-editorial-red focus:border-editorial-red dark:bg-zinc-800 dark:text-zinc-100"
                />
              </div>
            </div>
          )}

                  {/* STEP 3: Review & Pay */}
          {step === 3 && (
            <div className="space-y-4 animate-fade-in">
              <h3 className="font-bold text-gray-800 dark:text-zinc-100 mb-2">Step 3: Review & Pay</h3>
              <p className="text-xs text-editorial-muted mb-4">Please review your booking details before proceeding to payment.</p>

              <div className="bg-neutral-50 dark:bg-zinc-800 rounded-lg p-4 space-y-3 text-sm">
                <div className="flex justify-between border-b border-gray-200 dark:border-zinc-700 pb-2">
                  <span className="text-gray-600 dark:text-zinc-400">Plan</span>
                  <span className="font-semibold text-editorial-black dark:text-zinc-100">{plan.name}</span>
                </div>
                <div className="flex justify-between border-b border-gray-200 dark:border-zinc-700 pb-2">
                  <span className="text-gray-600 dark:text-zinc-400">Placement</span>
                  <span className="font-semibold text-editorial-black dark:text-zinc-100 capitalize">{placement}</span>
                </div>
                <div className="flex justify-between border-b border-gray-200 dark:border-zinc-700 pb-2">
                  <span className="text-gray-600 dark:text-zinc-400">Campaign Dates</span>
                  <span className="font-semibold text-editorial-black dark:text-zinc-100">{startDate} to {effectiveEndDate}</span>
                </div>
                <div className="flex justify-between border-b border-gray-200 dark:border-zinc-700 pb-2">
                  <span className="text-gray-600 dark:text-zinc-400">Advertiser</span>
                  <span className="font-semibold text-editorial-black dark:text-zinc-100">{advertiserName} ({businessName})</span>
                </div>
                <div className="flex justify-between pt-1">
                  <span className="text-gray-600 dark:text-zinc-400 font-bold">Total Amount</span>
                  <span className="font-bold text-editorial-red text-lg">₹{displayAmount}</span>
                </div>
              </div>

              <div className="text-[10px] text-gray-400 text-center px-4">
                By clicking "Pay Now", you'll be redirected to Razorpay's secure payment gateway.
              </div>
            </div>
          )}

          {/* STEP 4: Success */}
          {step === 4 && (
            <div className="text-center py-8 animate-fade-in text-gray-800 dark:text-zinc-100">
              <div className="w-16 h-16 bg-green-100 text-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold mb-2">Booking Confirmed!</h3>
              <p className="text-editorial-muted mb-1">
                <span className="font-semibold">{startDate}</span> to <span className="font-semibold">{effectiveEndDate}</span>
              </p>
              <p className="text-editorial-muted mb-6 text-sm">
                Our team will contact you at <span className="font-semibold">{email}</span> to collect your banner assets.
              </p>
              <button
                onClick={onClose}
                className="bg-editorial-black text-white px-6 py-2 rounded font-bold hover:bg-neutral-800 transition-colors"
              >
                Close
              </button>
            </div>
          )}

          {/* Navigation */}
          {step < 4 && (
            <div className="flex justify-between items-center mt-8 pt-4 border-t border-gray-100 dark:border-zinc-800">
              <div className="text-xs text-gray-400 font-medium">Step {step} of 3</div>
              <div className="flex gap-3">
                {step > 1 && (
                  <button
                    onClick={prevStep}
                    disabled={loading}
                    className="px-4 py-2 text-sm font-medium text-gray-600 dark:text-zinc-300 hover:text-editorial-black dark:hover:text-white"
                  >
                    Back
                  </button>
                )}
                {step < 3 ? (
                  <button
                    onClick={nextStep}
                    className="bg-editorial-black text-white text-sm font-bold px-5 py-2 rounded hover:bg-neutral-800 transition-colors"
                  >
                    Continue
                  </button>
                ) : (
                  <button
                    onClick={handleSubmit}
                    disabled={loading}
                    className="bg-editorial-red text-white text-sm font-bold px-5 py-2 rounded hover:bg-red-700 transition-colors flex items-center gap-2 disabled:opacity-70"
                  >
                    {loading ? 'Processing...' : `Pay ₹${displayAmount}`}
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CheckoutModal;
