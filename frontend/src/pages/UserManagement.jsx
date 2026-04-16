import { useState, useEffect } from 'react';
import api from '../utils/api';
import BackButton from '../components/BackButton';
import useText from '../hooks/useText';
import { useUserAuth } from '../context/UserAuthContext';
import { Search, Loader2, ShieldAlert, ShieldCheck, Trash2, Mail, Phone, Calendar } from 'lucide-react';

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const { user } = useUserAuth();
  const titleText = useText('User Management');

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const res = await api.get('/user-auth/admin/users');
      setUsers(res.data.data || []);
    } catch (err) {
      console.error('Error fetching users:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleBan = async (id, isBanned) => {
    if (!window.confirm(`Are you sure you want to ${isBanned ? 'unban' : 'ban'} this user?`)) return;
    try {
      await api.patch(`/user-auth/admin/users/${id}/toggle-ban`);
      setUsers(users.map(u => u._id === id ? { ...u, isBanned: !isBanned } : u));
    } catch (err) {
      alert(err.response?.data?.message || 'Error updating ban status');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('WARNING: Are you sure you want to permanently delete this user? This action cannot be undone.')) return;
    try {
      await api.delete(`/user-auth/admin/users/${id}`);
      setUsers(users.filter(u => u._id !== id));
    } catch (err) {
      alert(err.response?.data?.message || 'Error deleting user');
    }
  };

  const filteredUsers = users.filter(u => 
    `${u.firstName} ${u.lastName}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
    u.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    u.businessName?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <main className="min-h-screen bg-[#f8f9fa] dark:bg-[#09090b] pb-20 selection:bg-editorial-red selection:text-white">
      <div className="bg-white dark:bg-zinc-900 border-b border-neutral-200 dark:border-zinc-800 pt-10 pb-12">
        <div className="container-editorial">
          <BackButton to="/dashboard" label="Dashboard" />
          <div className="mt-8">
            <h1 className="font-bold text-4xl text-editorial-black dark:text-white tracking-tight leading-tight">
              {titleText}
            </h1>
            <p className="text-editorial-muted text-base mt-2 max-w-lg">
              Monitor, ban, and secure registered user accounts on your platform.
            </p>
          </div>
        </div>
      </div>

      <div className="container-editorial mt-8">
        <div className="bg-white dark:bg-zinc-900 border border-neutral-200 dark:border-zinc-800 rounded-3xl p-6 md:p-8 shadow-sm relative overflow-hidden">
          
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
            <div className="relative w-full md:w-96">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" size={18} />
              <input
                type="text"
                placeholder="Search users by name, email, or business..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-neutral-50 dark:bg-zinc-950 border border-neutral-200 dark:border-zinc-800 rounded-xl text-sm focus:ring-2 focus:ring-editorial-red focus:border-transparent outline-none transition-all dark:text-white"
              />
            </div>
            <div className="flex items-center gap-3">
              <span className="text-sm font-bold bg-neutral-100 dark:bg-zinc-800 text-editorial-muted px-4 py-2 rounded-xl">
                Total Users: {users.length}
              </span>
            </div>
          </div>

          {loading ? (
            <div className="flex flex-col items-center justify-center py-20">
              <Loader2 className="w-8 h-8 animate-spin text-editorial-red mb-4" />
              <p className="text-editorial-muted text-sm font-medium">Fetching accounts...</p>
            </div>
          ) : filteredUsers.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-editorial-muted text-lg">No users found matching your search.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-neutral-200 dark:border-zinc-800 text-xs uppercase tracking-wider text-editorial-muted font-bold">
                    <th className="pb-4 pl-4 font-bold">User Details</th>
                    <th className="pb-4 font-bold">Business / Phone</th>
                    <th className="pb-4 font-bold">Status</th>
                    <th className="pb-4 font-bold">Registration</th>
                    <th className="pb-4 pr-4 font-bold text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-100 dark:divide-zinc-800/50">
                  {filteredUsers.map((u) => (
                    <tr key={u._id} className="hover:bg-neutral-50 dark:hover:bg-zinc-800/20 transition-colors">
                      <td className="py-4 pl-4">
                        <p className="font-bold text-editorial-black dark:text-zinc-100 text-sm">
                          {u.firstName} {u.lastName}
                        </p>
                        <div className="flex items-center gap-1.5 mt-1 text-xs text-editorial-muted">
                          <Mail size={12} /> {u.email}
                        </div>
                      </td>
                      <td className="py-4">
                        {u.businessName ? (
                          <p className="text-sm font-medium text-editorial-black dark:text-zinc-300">{u.businessName}</p>
                        ) : (
                          <span className="-ml-1 text-xs text-editorial-muted">N/A</span>
                        )}
                        {u.phone && (
                          <div className="flex items-center gap-1.5 mt-1 text-xs text-editorial-muted">
                            <Phone size={12} /> {u.phone}
                          </div>
                        )}
                      </td>
                      <td className="py-4">
                        <div className="flex flex-col gap-2 items-start">
                          <span className={`px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider rounded-lg ${
                            u.isVerified 
                              ? 'bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400' 
                              : 'bg-amber-50 text-amber-600 dark:bg-amber-500/10 dark:text-amber-400'
                          }`}>
                            {u.isVerified ? 'Verified' : 'Unverified'}
                          </span>
                          <span className={`px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider rounded-lg ${
                            u.isBanned 
                              ? 'bg-rose-50 text-rose-600 dark:bg-rose-500/10 dark:text-rose-400' 
                              : 'bg-neutral-100 text-neutral-500 dark:bg-zinc-800'
                          }`}>
                            {u.isBanned ? 'Banned' : 'Active'}
                          </span>
                        </div>
                      </td>
                      <td className="py-4">
                        <div className="flex items-center gap-1.5 text-xs text-editorial-muted whitespace-nowrap">
                          <Calendar size={12} />
                          {new Date(u.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                        </div>
                      </td>
                      <td className="py-4 pr-4">
                        <div className="flex justify-end gap-2">
                          <button
                            onClick={() => handleToggleBan(u._id, u.isBanned)}
                            title={u.isBanned ? "Unban User" : "Ban User"}
                            className={`p-2 rounded-xl transition-all ${
                              u.isBanned 
                                ? 'bg-emerald-50 text-emerald-600 hover:bg-emerald-100 dark:bg-emerald-500/10 dark:text-emerald-400 dark:hover:bg-emerald-500/20' 
                                : 'bg-rose-50 text-rose-600 hover:bg-rose-100 dark:bg-rose-500/10 dark:text-rose-400 dark:hover:bg-rose-500/20'
                            }`}
                          >
                            {u.isBanned ? <ShieldCheck size={16} /> : <ShieldAlert size={16} />}
                          </button>
                          
                          <button
                            onClick={() => handleDelete(u._id)}
                            title="Delete User"
                            className="p-2 bg-neutral-100 text-neutral-600 hover:bg-neutral-200 dark:bg-zinc-800 dark:text-zinc-400 dark:hover:bg-zinc-700 rounded-xl transition-all"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </main>
  );
};

export default UserManagement;
