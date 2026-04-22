import { useState, useEffect } from 'react';
import api from '../utils/api';
import { Tag, Edit, Trash2, Plus, Percent, Check, X } from 'lucide-react';
import BackButton from '../components/BackButton';

const AdPlansManagement = () => {
  const [plans, setPlans] = useState([]);
  const [config, setConfig] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [isEditingConfig, setIsEditingConfig] = useState(false);
  const [discountVal, setDiscountVal] = useState(0);
  const [discountName, setDiscountName] = useState('Special');
  const [isDiscountActive, setIsDiscountActive] = useState(false);

  // New/Edit plan form state
  const [showPlanForm, setShowPlanForm] = useState(false);
  const [editingPlan, setEditingPlan] = useState(null);
  const [formData, setFormData] = useState({
    name: '', internalId: '', title: '', price: 0, durationDays: 7, placements: '', perks: '', isCustom: false, isActive: true
  });

  const fetchData = async () => {
    try {
      setLoading(true);
      const [plansRes, configRes] = await Promise.all([
        api.get('/plans'),
        api.get('/plans/config')
      ]);
      setPlans(plansRes.data.data || []);
      const conf = configRes.data.data;
      setConfig(conf);
      if (conf) {
        setDiscountVal(conf.discountPercentage);
        setDiscountName(conf.discountName || 'Special');
        setIsDiscountActive(conf.isDiscountActive);
      }
      setError(null);
    } catch (err) {
      setError('Failed to load data. Make sure you are logged in as admin.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, []);

  const handleConfigSave = async () => {
    try {
      const res = await api.put('/plans/config/update', {
        discountPercentage: discountVal,
        isDiscountActive,
        discountName
      });
      setConfig(res.data.data);
      setIsEditingConfig(false);
    } catch (err) {
      alert('Failed to update config.');
    }
  };

  const handleFormChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleEditPlan = (plan) => {
    setEditingPlan(plan);
    setFormData({
      ...plan,
      placements: plan.placements.join(', '),
      perks: plan.perks.join(', ')
    });
    setShowPlanForm(true);
  };

  const handleDeletePlan = async (id) => {
    if (!window.confirm('Are you sure you want to delete this plan?')) return;
    try {
      await api.delete(`/plans/${id}`);
      fetchData();
    } catch (err) {
      alert('Failed to delete plan.');
    }
  };

  const handleSavePlan = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        ...formData,
        placements: formData.placements.split(',').map(s => s.trim().toLowerCase()).filter(Boolean),
        perks: formData.perks.split(',').map(s => s.trim()).filter(Boolean)
      };

      if (editingPlan) {
        await api.put(`/plans/${editingPlan._id}`, payload);
      } else {
        await api.post('/plans', payload);
      }
      
      setShowPlanForm(false);
      setEditingPlan(null);
      fetchData();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to save plan.');
    }
  };

  if (loading) return (
    <main className="min-h-[50vh] flex items-center justify-center py-20 bg-neutral-50 dark:bg-zinc-950">
      <div className="w-10 h-10 border-2 border-editorial-border border-t-editorial-red rounded-full animate-spin" />
    </main>
  );

  return (
    <main className="min-h-screen bg-neutral-50 dark:bg-zinc-950 pb-20">
      <div className="container-editorial py-8 lg:py-10">
        <div className="mb-6">
          <BackButton to="/dashboard" label="Back to Dashboard" />
        </div>
        <div className="mb-8 flex justify-between items-end">
          <div>
            <h1 className="font-bold text-editorial-black dark:text-zinc-100 text-2xl sm:text-3xl border-b-2 border-editorial-red pb-2 inline-block">
              Ad Plans & Pricing
            </h1>
            <p className="text-editorial-muted text-sm mt-2">Manage advertisement packages and discounts globally.</p>
          </div>
          <button 
            onClick={() => {
              setEditingPlan(null);
              setFormData({ name: '', internalId: '', title: '', price: 0, durationDays: 7, placements: '', perks: '', isCustom: false, isActive: true });
              setShowPlanForm(true);
            }}
            className="flex items-center gap-2 bg-editorial-black text-white px-4 py-2 rounded font-bold hover:bg-neutral-800 transition-colors"
          >
            <Plus size={16} /> New Plan
          </button>
        </div>

        {error && (
          <div className="bg-red-50 text-red-600 p-4 rounded-md mb-6">{error}</div>
        )}

        {/* Global Config Section */}
        <div className="bg-white dark:bg-zinc-900 border border-editorial-border dark:border-zinc-800 rounded-lg p-6 mb-8">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-bold text-editorial-black dark:text-zinc-100 flex items-center gap-2">
              <Percent size={20} className="text-editorial-red" /> Global Discount Settings
            </h2>
            {!isEditingConfig ? (
              <button onClick={() => setIsEditingConfig(true)} className="text-editorial-muted hover:text-editorial-black dark:hover:text-zinc-100 flex items-center gap-1 text-sm border px-3 py-1 rounded">
                <Edit size={14} /> Edit
              </button>
            ) : (
              <div className="flex gap-2">
                <button onClick={() => setIsEditingConfig(false)} className="text-gray-500 hover:text-gray-800 flex items-center gap-1 text-sm border px-3 py-1 rounded">
                  <X size={14} /> Cancel
                </button>
                <button onClick={handleConfigSave} className="bg-green-600 text-white flex items-center gap-1 text-sm px-3 py-1 rounded hover:bg-green-700">
                  <Check size={14} /> Save
                </button>
              </div>
            )}
          </div>
          
          <div className="flex items-center gap-6">
            <div>
              <p className="text-sm text-editorial-muted mb-1">Discount Active</p>
              {isEditingConfig ? (
                <label className="flex items-center cursor-pointer">
                  <div className="relative">
                    <input type="checkbox" className="sr-only" checked={isDiscountActive} onChange={(e) => setIsDiscountActive(e.target.checked)} />
                    <div className={`block w-10 h-6 rounded-full transition-colors ${isDiscountActive ? 'bg-green-500' : 'bg-gray-300 dark:bg-zinc-700'}`}></div>
                    <div className={`dot absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-transform ${isDiscountActive ? 'transform translate-x-4' : ''}`}></div>
                  </div>
                  <span className="ml-3 text-sm font-medium text-gray-900 dark:text-zinc-200">{isDiscountActive ? 'ON' : 'OFF'}</span>
                </label>
              ) : (
                <span className={`inline-block px-2 py-1 text-xs font-bold rounded ${config?.isDiscountActive ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700 dark:bg-zinc-800 dark:text-zinc-400'}`}>
                  {config?.isDiscountActive ? 'ACTIVE' : 'INACTIVE'}
                </span>
              )}
            </div>
            
            <div className="flex-1 max-w-[200px]">
              <p className="text-sm text-editorial-muted mb-1">Discount Percentage</p>
              {isEditingConfig ? (
                <div className="flex items-center gap-2">
                  <input 
                    type="number" min="0" max="100" 
                    value={discountVal} 
                    onChange={e => setDiscountVal(parseInt(e.target.value) || 0)}
                    className="w-full px-3 py-1.5 border border-gray-300 dark:border-zinc-700 rounded bg-white dark:bg-zinc-800 text-editorial-black dark:text-zinc-100"
                  />
                  <span className="text-editorial-black dark:text-zinc-100 font-bold">%</span>
                </div>
              ) : (
                <span className="text-2xl font-black text-editorial-black dark:text-zinc-100">{config?.discountPercentage}%</span>
              )}
            </div>

            <div className="flex-1 max-w-[200px]">
              <p className="text-sm text-editorial-muted mb-1">Festive Name</p>
              {isEditingConfig ? (
                <input 
                  type="text" 
                  value={discountName} 
                  onChange={e => setDiscountName(e.target.value)}
                  placeholder="e.g. Diwali"
                  className="w-full px-3 py-1.5 border border-gray-300 dark:border-zinc-700 rounded bg-white dark:bg-zinc-800 text-editorial-black dark:text-zinc-100"
                />
              ) : (
                <span className="text-sm font-bold uppercase tracking-wider text-editorial-black dark:text-zinc-100">{config?.discountName || 'Special'}</span>
              )}
            </div>
          </div>
        </div>

        {/* Plans Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {plans.map(plan => (
            <div key={plan._id} className={`bg-white dark:bg-zinc-900 border rounded-lg p-6 relative ${plan.isActive ? 'border-editorial-border dark:border-zinc-800' : 'border-dashed border-gray-300 opacity-70'}`}>
              {!plan.isActive && (
                <div className="absolute top-4 right-4 bg-gray-200 text-gray-600 text-xs px-2 py-1 rounded font-bold">INACTIVE</div>
              )}
              {plan.isActive && plan.isCustom && (
                <div className="absolute top-4 right-4 bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded font-bold">CUSTOM/DYNAMIC</div>
              )}
              <h3 className="text-xl font-bold dark:text-zinc-100 mb-1">{plan.name} <span className="text-sm font-normal text-editorial-muted ml-2">({plan.internalId})</span></h3>
              <p className="text-editorial-muted text-sm mb-4">{plan.title}</p>
              
              <div className="text-3xl font-bold text-editorial-red mb-4">
                {plan.isCustom ? 'Custom' : `₹${plan.price.toLocaleString('en-IN')}`} 
                {!plan.isCustom && <span className="text-sm text-neutral-500 font-normal"> / {plan.durationDays} days</span>}
              </div>

              <div className="mb-4">
                <p className="text-xs font-bold uppercase tracking-wider text-editorial-muted mb-2">Placements</p>
                <div className="flex flex-wrap gap-1">
                  {plan.placements.map((p, i) => (
                    <span key={i} className="bg-neutral-100 dark:bg-zinc-800 border border-neutral-200 dark:border-zinc-700 text-xs px-2 py-1 rounded capitalize text-editorial-black dark:text-zinc-300">{p}</span>
                  ))}
                </div>
              </div>

              <div className="mb-6 flex-1">
                <p className="text-xs font-bold uppercase tracking-wider text-editorial-muted mb-2">Perks</p>
                <ul className="text-sm text-neutral-600 dark:text-zinc-400 space-y-1">
                  {plan.perks.map((perk, i) => (
                    <li key={i} className="flex items-start gap-2"><Check size={14} className="text-green-500 shrink-0 mt-0.5" /> <span>{perk}</span></li>
                  ))}
                </ul>
              </div>

              <div className="flex gap-2 mt-auto">
                <button onClick={() => handleEditPlan(plan)} className="flex-1 flex justify-center items-center gap-1 border border-editorial-black dark:border-zinc-100 text-editorial-black dark:text-zinc-100 py-1.5 rounded hover:bg-neutral-100 dark:hover:bg-zinc-800 transition-colors text-sm font-bold">
                  <Edit size={14} /> Edit
                </button>
                <button onClick={() => handleDeletePlan(plan._id)} className="flex items-center justify-center border border-red-200 text-red-600 px-3 py-1.5 rounded hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors">
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Form Modal */}
        {showPlanForm && (
          <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
            <div className="bg-white dark:bg-zinc-900 w-full max-w-2xl rounded-lg shadow-xl p-6 relative max-h-[90vh] overflow-y-auto">
              <button onClick={() => setShowPlanForm(false)} className="absolute top-4 right-4 text-editorial-muted hover:text-editorial-black dark:text-zinc-500 dark:hover:text-zinc-200">
                <X size={20} />
              </button>
              <h2 className="text-xl font-bold mb-6 font-serif dark:text-zinc-100">{editingPlan ? 'Edit Plan' : 'Create New Plan'}</h2>
              
              <form onSubmit={handleSavePlan} className="space-y-4 text-left">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-zinc-300 mb-1">Name</label>
                    <input type="text" name="name" value={formData.name} onChange={handleFormChange} required className="w-full px-3 py-2 border rounded dark:bg-zinc-800 dark:border-zinc-700 dark:text-zinc-100" placeholder="e.g. Standard" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-zinc-300 mb-1">Internal ID (Unique)</label>
                    <input type="text" name="internalId" value={formData.internalId} onChange={handleFormChange} required disabled={!!editingPlan} className="w-full px-3 py-2 border rounded dark:bg-zinc-800 dark:border-zinc-700 dark:text-zinc-100 disabled:opacity-50" placeholder="e.g. standard" />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-zinc-300 mb-1">Descriptive Title</label>
                  <input type="text" name="title" value={formData.title} onChange={handleFormChange} required className="w-full px-3 py-2 border rounded dark:bg-zinc-800 dark:border-zinc-700 dark:text-zinc-100" placeholder="e.g. Standard Plan" />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-zinc-300 mb-1">Price (₹)</label>
                    <input type="number" name="price" value={formData.price} onChange={handleFormChange} min="0" required={!formData.isCustom} disabled={formData.isCustom} className="w-full px-3 py-2 border rounded dark:bg-zinc-800 dark:border-zinc-700 dark:text-zinc-100 disabled:opacity-50" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-zinc-300 mb-1">Duration (Days)</label>
                    <input type="number" name="durationDays" value={formData.durationDays} onChange={handleFormChange} min="1" required className="w-full px-3 py-2 border rounded dark:bg-zinc-800 dark:border-zinc-700 dark:text-zinc-100" />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-zinc-300 mb-1">Placements (comma separated)</label>
                  <input type="text" name="placements" value={formData.placements} onChange={handleFormChange} className="w-full px-3 py-2 border rounded dark:bg-zinc-800 dark:border-zinc-700 dark:text-zinc-100" placeholder="sidebar, header, in-feed" />
                  <p className="text-xs text-gray-500 mt-1">Valid options: header, sidebar, footer, inline, popup, in-feed</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-zinc-300 mb-1">Perks (comma separated)</label>
                  <textarea name="perks" value={formData.perks} onChange={handleFormChange} rows="3" className="w-full px-3 py-2 border rounded dark:bg-zinc-800 dark:border-zinc-700 dark:text-zinc-100" placeholder="Sidebar Ad Only, 1 Week Campaign..."></textarea>
                </div>

                <div className="flex gap-6 mt-4">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" name="isCustom" checked={formData.isCustom} onChange={handleFormChange} className="w-4 h-4 text-editorial-red" />
                    <span className="text-sm font-medium dark:text-zinc-200">Is Custom/Enterprise Pricing?</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" name="isActive" checked={formData.isActive} onChange={handleFormChange} className="w-4 h-4 text-editorial-red" />
                    <span className="text-sm font-medium dark:text-zinc-200">Plan matches Active status?</span>
                  </label>
                </div>

                <div className="pt-4 border-t border-gray-100 dark:border-zinc-800 mt-6 flex justify-end gap-3">
                  <button type="button" onClick={() => setShowPlanForm(false)} className="px-4 py-2 border rounded text-gray-600 dark:text-zinc-300 hover:bg-gray-50 dark:hover:bg-zinc-800">Cancel</button>
                  <button type="submit" className="px-4 py-2 bg-editorial-red text-white font-bold rounded hover:bg-red-700">Save Plan</button>
                </div>
              </form>
            </div>
          </div>
        )}

      </div>
    </main>
  );
};

export default AdPlansManagement;
