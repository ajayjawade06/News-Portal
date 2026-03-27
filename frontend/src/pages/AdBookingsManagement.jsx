import { useState, useEffect } from 'react';
import api from '../utils/api';
import { CheckCircle, XCircle, Clock, Calendar, User, Mail, Building, CreditCard, AlertCircle, DollarSign, Phone } from 'lucide-react';
import BackButton from '../components/BackButton';

const STATUS_INFO = {
  pending: { label: 'Pending', icon: Clock, color: 'text-yellow-600 bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200' },
  approved: { label: 'Approved', icon: CheckCircle, color: 'text-green-600 bg-green-50 dark:bg-green-900/20 border-green-200' },
  rejected: { label: 'Rejected', icon: XCircle, color: 'text-red-600 bg-red-50 dark:bg-red-900/20 border-red-200' },
};

const PLAN_LABELS = { basic: 'Basic', standard: 'Standard', premium: 'Premium', enterprise: 'Enterprise' };

const AdBookingsManagement = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState('all');
  const [updatingId, setUpdatingId] = useState(null);
  const [totalRevenue, setTotalRevenue] = useState(0);
  const fetchAnalytics = async () => {
    try {
      const analRes = await api.get('/ads/analytics');
      setTotalRevenue(analRes.data.data.totalRevenue);
    } catch (err) {
      console.error('Failed to fetch analytics:', err);
    }
  };

  const fetchBookings = async () => {
    try {
      setLoading(true);
      const [bookRes, analRes] = await Promise.all([
        api.get('/bookings'),
        api.get('/ads/analytics')
      ]);
      setBookings(bookRes.data.data || []);
      setTotalRevenue(analRes.data.data.totalRevenue);
      setError(null);
    } catch (err) {
      setError('Failed to load data. Make sure you are logged in as admin.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchBookings(); }, []);

  const handleStatusChange = async (id, status) => {
    setUpdatingId(id);
    try {
      const res = await api.patch(`/bookings/${id}/status`, { status });
      setBookings(prev => prev.map(b => b._id === id ? res.data.data : b));
      // Update revenue immediately after status change
      if (status === 'approved') {
        fetchAnalytics();
      }
    } catch {
      alert('Failed to update booking status.');
    } finally {
      setUpdatingId(null);
    }
  };

  const filtered = filter === 'all' ? bookings : bookings.filter(b => b.status === filter);

  const stats = {
    total: bookings.length,
    pending: bookings.filter(b => b.status === 'pending').length,
    approved: bookings.filter(b => b.status === 'approved').length,
    rejected: bookings.filter(b => b.status === 'rejected').length,
    bookingOnlyRevenue: bookings.filter(b => b.status === 'approved').reduce((sum, b) => sum + (b.amountPaid || 0), 0),
  };

  if (loading) return (
    <main className="min-h-[50vh] flex items-center justify-center py-20 bg-neutral-50 dark:bg-zinc-950">
      <div className="w-10 h-10 border-2 border-editorial-border border-t-editorial-red rounded-full animate-spin" />
    </main>
  );

  return (
    <main className="min-h-screen bg-neutral-50 dark:bg-zinc-950">
      <div className="container-editorial py-8 lg:py-10">
        {/* Header */}
        <div className="mb-6">
          <BackButton to="/dashboard" label="Back to Dashboard" />
        </div>
        <div className="mb-8">
          <h1 className="font-bold text-editorial-black dark:text-zinc-100 text-2xl sm:text-3xl border-b-2 border-editorial-red pb-2 inline-block">
            Ad Bookings
          </h1>
          <p className="text-editorial-muted text-sm mt-2">Review and manage advertisement slot requests</p>
        </div>

        {/* Premium Stats Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 mb-10">
          {[
            { label: 'Total Bookings', value: stats.total, icon: Clock, color: 'text-editorial-black dark:text-white', bg: 'bg-neutral-100 dark:bg-zinc-800' },
            { label: 'Pending Requests', value: stats.pending, icon: Clock, color: 'text-yellow-600', bg: 'bg-yellow-500/10' },
            { label: 'Approved slots', value: stats.approved, icon: CheckCircle, color: 'text-green-600', bg: 'bg-green-500/10' },
            { label: 'Total Revenue', value: `₹${totalRevenue.toLocaleString('en-IN')}`, icon: DollarSign, color: 'text-editorial-red', bg: 'bg-editorial-red/10' },
          ].map((stat, i) => (
            <div key={i} className="bg-white/70 dark:bg-zinc-900/70 backdrop-blur-xl border border-white/20 dark:border-white/5 p-6 rounded-2xl shadow-sm hover:shadow-md transition-all duration-300">
              <div className={`${stat.bg} ${stat.color} w-10 h-10 rounded-xl flex items-center justify-center mb-4`}>
                <stat.icon size={20} />
              </div>
              <p className="text-editorial-muted text-[10px] font-bold uppercase tracking-widest mb-1 opacity-70">{stat.label}</p>
              <h3 className="text-2xl font-black text-editorial-black dark:text-white tracking-tight">{stat.value}</h3>
            </div>
          ))}
        </div>

        {error && (
          <div className="bg-red-50 dark:bg-red-900/20 text-red-600 p-4 rounded-md flex items-start gap-3 mb-6">
            <AlertCircle size={20} className="shrink-0 mt-0.5" />
            <p>{error}</p>
          </div>
        )}

        {/* Filter pills */}
        <div className="flex gap-2 mb-5 flex-wrap">
          {['all', 'pending', 'approved', 'rejected'].map(f => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-4 py-1.5 text-sm font-medium rounded-full border transition-colors capitalize ${
                filter === f
                  ? 'bg-editorial-black text-white border-editorial-black dark:bg-zinc-100 dark:text-zinc-900 dark:border-zinc-100'
                  : 'border-editorial-border dark:border-zinc-700 text-editorial-muted hover:border-editorial-black dark:hover:border-zinc-400'
              }`}
            >
              {f === 'all' ? `All (${stats.total})` : f === 'pending' ? `Pending (${stats.pending})` : f === 'approved' ? `Approved (${stats.approved})` : `Rejected (${stats.rejected})`}
            </button>
          ))}
        </div>

        {/* Bookings list */}
        {filtered.length === 0 ? (
          <div className="card-editorial p-12 text-center text-editorial-muted">
            No bookings found.
          </div>
        ) : (
          <div className="space-y-4">
            {filtered.map(booking => {
              const StatusIcon = STATUS_INFO[booking.status]?.icon || Clock;
              return (
                <div key={booking._id} className="bg-white dark:bg-zinc-900 border border-editorial-border dark:border-zinc-800 rounded-lg p-5 lg:p-6">
                  <div className="flex flex-col sm:flex-row sm:items-start gap-4">
                    <div className="flex-1 space-y-3">
                      {/* Plan + Status Badge */}
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="font-bold text-editorial-black dark:text-zinc-100 text-lg">
                          {PLAN_LABELS[booking.planId] || booking.planId} Plan
                        </span>
                        <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold border ${STATUS_INFO[booking.status]?.color}`}>
                          <StatusIcon size={12} />
                          {STATUS_INFO[booking.status]?.label}
                        </span>
                        <span className="text-xs text-editorial-muted capitalize bg-neutral-100 dark:bg-zinc-800 px-2 py-0.5 rounded-full">
                          {booking.placement}
                        </span>
                      </div>

                      {/* Details grid */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 text-sm">
                        <div className="flex items-center gap-2 text-editorial-muted">
                          <User size={14} className="shrink-0" />
                          <span className="text-editorial-black dark:text-zinc-200 font-medium">{booking.advertiserName}</span>
                        </div>
                        <div className="flex items-center gap-2 text-editorial-muted">
                          <Mail size={14} className="shrink-0" />
                          <a href={`mailto:${booking.email}`} className="text-editorial-red hover:underline break-all">{booking.email}</a>
                        </div>
                        <div className="flex items-center gap-2 text-editorial-muted">
                          <Phone size={14} className="shrink-0" />
                          <a href={`tel:${booking.phone}`} className="text-editorial-black dark:text-zinc-200 hover:text-editorial-red transition-colors">{booking.phone}</a>
                        </div>
                        <div className="flex items-center gap-2 text-editorial-muted">
                          <Building size={14} className="shrink-0" />
                          <span className="text-editorial-black dark:text-zinc-200">{booking.businessName}</span>
                        </div>
                        <div className="flex items-center gap-2 text-editorial-muted">
                          <Calendar size={14} className="shrink-0" />
                          <span>
                            <span className="text-editorial-black dark:text-zinc-200">{new Date(booking.startDate).toLocaleDateString('en-IN')}</span>
                            <span className="mx-1">—</span>
                            <span className="text-editorial-black dark:text-zinc-200">{new Date(booking.endDate).toLocaleDateString('en-IN')}</span>
                          </span>
                        </div>
                        <div className="flex items-center gap-2 text-editorial-muted">
                          <CreditCard size={14} className="shrink-0" />
                          <span className="text-editorial-red font-bold text-base">₹{(booking.amountPaid || 0).toLocaleString('en-IN')}</span>
                        </div>
                        <div className="text-xs text-editorial-muted">
                          Booked {new Date(booking.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                        </div>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    {booking.status === 'pending' && (
                      <div className="flex gap-2 sm:flex-col sm:w-32">
                        <button
                          onClick={() => handleStatusChange(booking._id, 'approved')}
                          disabled={updatingId === booking._id}
                          className="flex-1 sm:w-full flex items-center justify-center gap-1.5 bg-green-600 text-white text-sm font-bold py-2 px-3 rounded hover:bg-green-700 transition-colors disabled:opacity-60"
                        >
                          <CheckCircle size={14} />
                          Approve
                        </button>
                        <button
                          onClick={() => handleStatusChange(booking._id, 'rejected')}
                          disabled={updatingId === booking._id}
                          className="flex-1 sm:w-full flex items-center justify-center gap-1.5 border border-red-400 text-red-600 text-sm font-bold py-2 px-3 rounded hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors disabled:opacity-60"
                        >
                          <XCircle size={14} />
                          Reject
                        </button>
                      </div>
                    )}
                    {booking.status === 'approved' && (
                      <button
                        onClick={() => handleStatusChange(booking._id, 'rejected')}
                        disabled={updatingId === booking._id}
                        className="sm:w-32 flex items-center justify-center gap-1.5 border border-red-400 text-red-600 text-sm font-bold py-2 px-3 rounded hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors disabled:opacity-60"
                      >
                        <XCircle size={14} />
                        Revoke
                      </button>
                    )}
                    {booking.status === 'rejected' && (
                      <button
                        onClick={() => handleStatusChange(booking._id, 'approved')}
                        disabled={updatingId === booking._id}
                        className="sm:w-32 flex items-center justify-center gap-1.5 bg-green-600 text-white text-sm font-bold py-2 px-3 rounded hover:bg-green-700 transition-colors disabled:opacity-60"
                      >
                        <CheckCircle size={14} />
                        Re-approve
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </main>
  );
};

export default AdBookingsManagement;
