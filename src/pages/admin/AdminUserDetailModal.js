import React, { useState, useEffect } from 'react';
import { adminAPI } from '../../services/api';
import toast from 'react-hot-toast';
import { FiX, FiUser, FiActivity, FiMapPin, FiMail, FiPhone, FiCalendar, FiShield, FiTag, FiKey, FiAlertCircle, FiCheck } from 'react-icons/fi';

const AdminUserDetailModal = ({ userId, onClose, onUpdated }) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('profile'); // profile, roles
  const [actionLoading, setActionLoading] = useState(false);
  const [selectedRoles, setSelectedRoles] = useState([]);

  const availableRoles = ['BUYER', 'SELLER', 'EMPLOYER', 'JOB_SEEKER', 'ADMIN'];

  useEffect(() => {
    const fetchDetails = async () => {
      try {
        setLoading(true);
        const response = await adminAPI.getUserDetails(userId);
        setData(response.data.data);
        setSelectedRoles(response.data.data.profile.roles || []);
      } catch (error) {
        toast.error('Failed to load user details');
        onClose();
      } finally {
        setLoading(false);
      }
    };
    fetchDetails();
  }, [userId, onClose]);

  const handleToggleRole = (role) => {
    if (selectedRoles.includes(role)) {
      setSelectedRoles(selectedRoles.filter(r => r !== role));
    } else {
      setSelectedRoles([...selectedRoles, role]);
    }
  };

  const handleSaveRoles = async () => {
    if (selectedRoles.length === 0) {
      toast.error('User must have at least one role');
      return;
    }
    setActionLoading(true);
    try {
      await adminAPI.changeUserRole(userId, { roles: selectedRoles });
      toast.success('User roles updated successfully');
      onUpdated();
    } catch (error) {
      toast.error('Failed to update roles');
    } finally {
      setActionLoading(false);
    }
  };

  const handleStatusChange = async (action) => {
    const confirmMsg = action === 'suspend' 
      ? 'Are you sure you want to suspend this account?' 
      : 'Are you sure you want to reactivate this account?';
    
    if (!window.confirm(confirmMsg)) return;

    setActionLoading(true);
    try {
      if (action === 'suspend') {
        const reason = window.prompt('Enter reason for suspension:');
        if (reason === null) return;
        await adminAPI.suspendUser(userId, { reason });
      } else {
        await adminAPI.activateUser(userId);
      }
      toast.success(`User ${action}ed successfully`);
      onUpdated();
      onClose();
    } catch (error) {
      toast.error(`Failed to ${action} user`);
    } finally {
      setActionLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="fixed inset-0 bg-ethereal-surface/80 backdrop-blur-md flex items-center justify-center z-[70]">
        <div className="glass-card p-12 rounded-[2.5rem] border-none text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-ethereal-primary mx-auto"></div>
          <p className="text-ethereal-on-surface-variant font-black uppercase tracking-[0.3em] mt-8 text-[10px]">Accessing Identity Vault...</p>
        </div>
      </div>
    );
  }

  const { profile, listingCount, jobCount, inquiryCount, applicationCount } = data;

  return (
    <div className="fixed inset-0 bg-ethereal-surface/60 backdrop-blur-sm flex items-center justify-center z-[70] p-6 animate-fadeIn">
      <div className="glass-card bg-white/95 rounded-[3rem] border-none shadow-2xl w-full max-w-4xl max-h-[92vh] flex flex-col overflow-hidden animate-scaleIn">
        {/* Identity Header */}
        <div className="bg-ethereal-primary px-12 py-10 text-white relative flex items-center justify-between shrink-0 overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -mr-32 -mt-32 blur-3xl"></div>
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-black/5 rounded-full -ml-24 -mb-24 blur-2xl"></div>
          
          <div className="flex items-center gap-8 relative z-10">
            <div className="w-24 h-24 bg-white/10 backdrop-blur-md rounded-[2rem] flex items-center justify-center text-4xl font-black border border-white/20 shadow-xl">
              {profile.fullName?.charAt(0)}
            </div>
            <div>
              <span className="text-[10px] font-black uppercase tracking-[0.3em] opacity-60 mb-1 block">Account Principal</span>
              <h2 className="text-4xl display-title tracking-tighter uppercase leading-none mb-3">{profile.fullName}</h2>
              <div className="flex items-center gap-4">
                <span className={`px-4 py-1 rounded-full text-[9px] font-black uppercase tracking-widest border border-white/20 ${
                  profile.status === 'ACTIVE' ? 'bg-emerald-500/20 text-emerald-100' : 'bg-rose-500/20 text-rose-100'
                }`}>
                  {profile.status}
                </span>
                <span className="text-[10px] font-medium opacity-60 uppercase tracking-widest">Enrolled {new Date(profile.createdAt).toLocaleDateString(undefined, { month: 'long', year: 'numeric' })}</span>
              </div>
            </div>
          </div>
          <button onClick={onClose} className="p-4 hover:bg-white/10 rounded-[1.5rem] transition-all relative z-10">
            <FiX className="w-8 h-8" />
          </button>
        </div>

        {/* Structural Navigation */}
        <div className="flex border-b border-ethereal-surface px-12 bg-white shrink-0">
          <button onClick={() => setActiveTab('profile')}
            className={`py-6 text-[10px] font-black uppercase tracking-[0.2em] transition-all relative ${
              activeTab === 'profile' ? 'text-ethereal-primary' : 'text-ethereal-on-surface-variant opacity-40 hover:opacity-100'
            }`}>
            Identity Schematic
            {activeTab === 'profile' && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-ethereal-primary" />}
          </button>
          <button onClick={() => setActiveTab('roles')}
            className={`ml-10 py-6 text-[10px] font-black uppercase tracking-[0.2em] transition-all relative ${
              activeTab === 'roles' ? 'text-ethereal-primary' : 'text-ethereal-on-surface-variant opacity-40 hover:opacity-100'
            }`}>
            Protocol Privileges
            {activeTab === 'roles' && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-ethereal-primary" />}
          </button>
        </div>

        {/* Dynamic Context Canvas */}
        <div className="flex-grow overflow-y-auto p-12 custom-scrollbar">
          {activeTab === 'profile' ? (
            <div className="space-y-12 animate-fadeIn">
              {/* Communication Matrix */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="flex items-center gap-6 p-6 bg-ethereal-surface rounded-[2rem] border border-transparent hover:border-ethereal-primary/10 transition-all">
                  <div className="w-14 h-14 bg-white rounded-[1.2rem] flex items-center justify-center text-blue-500 shadow-sm">
                    <FiMail className="w-6 h-6 opacity-60" />
                  </div>
                  <div>
                    <p className="text-[9px] font-black text-ethereal-on-surface-variant uppercase tracking-[0.2em] mb-1 opacity-40">Primary Email</p>
                    <p className="text-base font-black text-ethereal-on-surface tracking-tight lowercase">{profile.email}</p>
                  </div>
                </div>
                <div className="flex items-center gap-6 p-6 bg-ethereal-surface rounded-[2rem] border border-transparent hover:border-ethereal-primary/10 transition-all">
                  <div className="w-14 h-14 bg-white rounded-[1.2rem] flex items-center justify-center text-purple-500 shadow-sm">
                    <FiPhone className="w-6 h-6 opacity-60" />
                  </div>
                  <div>
                    <p className="text-[9px] font-black text-ethereal-on-surface-variant uppercase tracking-[0.2em] mb-1 opacity-40">Direct Line</p>
                    <p className="text-base font-black text-ethereal-on-surface tracking-tight">{profile.mobileNumber || 'Not provisioned'}</p>
                  </div>
                </div>
                <div className="flex items-center gap-6 p-6 bg-ethereal-surface rounded-[2rem] border border-transparent hover:border-ethereal-primary/10 transition-all">
                  <div className="w-14 h-14 bg-white rounded-[1.2rem] flex items-center justify-center text-emerald-500 shadow-sm">
                    <FiMapPin className="w-6 h-6 opacity-60" />
                  </div>
                  <div>
                    <p className="text-[9px] font-black text-ethereal-on-surface-variant uppercase tracking-[0.2em] mb-1 opacity-40">Geographic Node</p>
                    <p className="text-base font-black text-ethereal-on-surface tracking-tight">{profile.city ? `${profile.city}, ${profile.state}` : 'Unknown'}</p>
                  </div>
                </div>
                <div className="flex items-center gap-6 p-6 bg-ethereal-surface rounded-[2rem] border border-transparent hover:border-ethereal-primary/10 transition-all">
                  <div className="w-14 h-14 bg-white rounded-[1.2rem] flex items-center justify-center text-amber-500 shadow-sm">
                    <FiShield className="w-6 h-6 opacity-60" />
                  </div>
                  <div>
                    <p className="text-[9px] font-black text-ethereal-on-surface-variant uppercase tracking-[0.2em] mb-1 opacity-40">Trust Index</p>
                    <p className="text-base font-black text-ethereal-on-surface tracking-tight">{profile.isVerifiedBuyer ? 'Verified Entity' : 'Pending Review'}</p>
                  </div>
                </div>
              </div>

              {/* Engagement Analytics */}
              <div className="space-y-6">
                <h3 className="section-label tracking-[0.2em] flex items-center gap-3">
                  <FiActivity className="text-ethereal-primary" /> Platform Volumetrics
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                  {[
                    { label: 'Listings', val: listingCount, icon: 'L' },
                    { label: 'Roles', val: jobCount, icon: 'J' },
                    { label: 'Inquiries', val: inquiryCount, icon: 'I' },
                    { label: 'Apps', val: applicationCount, icon: 'A' }
                  ].map(stat => (
                    <div key={stat.label} className="glass-card bg-ethereal-surface-low/30 p-6 rounded-[2rem] border-none text-center hover:bg-white transition-all duration-300 shadow-inner group">
                      <p className="text-3xl font-black text-ethereal-on-surface tracking-tighter mb-1 group-hover:scale-110 transition-transform">{stat.val}</p>
                      <p className="text-[9px] text-ethereal-on-surface-variant uppercase font-black tracking-[0.2em] opacity-40">{stat.label}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Protocol Controls */}
              <div className="pt-10 border-t border-ethereal-surface flex flex-wrap gap-4">
                {profile.status === 'ACTIVE' ? (
                  <button onClick={() => handleStatusChange('suspend')} disabled={actionLoading}
                    className="px-8 py-4 bg-rose-50 text-rose-600 rounded-[1.5rem] text-[10px] font-black uppercase tracking-widest hover:bg-rose-100 transition-all flex items-center gap-3 border border-rose-100/50">
                    <FiAlertCircle className="w-4 h-4" /> Suspend Interface
                  </button>
                ) : (
                  <button onClick={() => handleStatusChange('activate')} disabled={actionLoading}
                    className="px-8 py-4 bg-emerald-50 text-emerald-600 rounded-[1.5rem] text-[10px] font-black uppercase tracking-widest hover:bg-emerald-100 transition-all flex items-center gap-3 border border-emerald-100/50">
                    <FiCheck className="w-4 h-4" /> Restore Access
                  </button>
                )}
                <button onClick={() => { if(window.confirm('CRITICAL: Are you sure you want to PERMANENTLY delete this user? This cannot be undone.')) { /* handle delete */ }}}
                  className="px-8 py-4 bg-ethereal-surface text-ethereal-on-surface-variant rounded-[1.5rem] text-[10px] font-black uppercase tracking-widest hover:bg-rose-600 hover:text-white transition-all">
                  Erase Data History
                </button>
              </div>
            </div>
          ) : (
            <div className="space-y-12 animate-fadeIn">
              <div className="p-8 bg-amber-50/50 rounded-[2.5rem] border border-amber-200/30 flex gap-6 items-center">
                <div className="w-16 h-16 bg-white rounded-[1.5rem] flex items-center justify-center shadow-sm shrink-0">
                  <FiKey className="w-7 h-7 text-amber-500" />
                </div>
                <div>
                  <h4 className="text-[11px] font-black text-amber-900 uppercase tracking-[0.2em] mb-1">Authorization Matrix Control</h4>
                  <p className="text-xs text-amber-800/70 font-medium leading-relaxed">
                    Changing identity roles will reconfigure access levels across all restricted sub-modules. 
                    Adding 'ADMIN' grants absolute control over all administrative schemas.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {availableRoles.map(role => (
                  <button key={role} onClick={() => handleToggleRole(role)}
                    className={`p-6 rounded-[2rem] border-2 text-[10px] font-black uppercase tracking-widest transition-all flex items-center justify-between group ${
                      selectedRoles.includes(role) 
                        ? 'border-ethereal-primary bg-ethereal-primary/5 text-ethereal-primary shadow-sm' 
                        : 'border-ethereal-surface text-ethereal-on-surface-variant opacity-60 hover:opacity-100 hover:border-ethereal-primary/20 bg-white'
                    }`}>
                    {role.replace('_', ' ')}
                    <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${
                      selectedRoles.includes(role) ? 'bg-ethereal-primary border-ethereal-primary text-white' : 'border-ethereal-surface'
                    }`}>
                      {selectedRoles.includes(role) && <FiCheck className="w-3 h-3" />}
                    </div>
                  </button>
                ))}
              </div>

              <div className="pt-10 border-t border-ethereal-surface flex justify-end">
                <button onClick={handleSaveRoles} disabled={actionLoading}
                  className="px-10 py-5 bg-ethereal-primary text-white rounded-[1.5rem] font-black text-[10px] uppercase tracking-[0.2em] shadow-xl shadow-ethereal-primary/20 hover:bg-ethereal-primary-high transition-all disabled:opacity-50">
                  {actionLoading ? 'Syncing...' : 'Update Authorization'}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminUserDetailModal;
