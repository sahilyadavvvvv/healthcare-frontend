import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  FiHome, FiList, FiMail, FiBriefcase, FiFileText, 
  FiUser, FiPlus, FiEdit, FiEye, FiLogOut, 
  FiSettings, FiShield, FiMenu, FiX, FiActivity
} from 'react-icons/fi';
import { useAuth } from '../../context/AuthContext';
import { userAPI } from '../../services/api';
import VerificationModal from '../../components/VerificationModal';

const DashboardPage = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [verification, setVerification] = useState(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [showVerModal, setShowVerModal] = useState(false);

  useEffect(() => {
    const fetchVer = async () => {
      try {
        const res = await userAPI.getVerificationStatus();
        if (res.data?.data) setVerification(res.data.data);
      } catch (err) {
        console.error('Error fetching verification status:', err);
      }
    }
    if (user) fetchVer();
  }, [user]);

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const navItems = [
    { title: 'Overview', icon: FiHome, href: '/dashboard', active: true },
    { title: 'My Listings', icon: FiList, href: '/dashboard/listings' },
    { title: 'Inquiries', icon: FiMail, href: '/dashboard/inquiries' },
    { title: 'My Jobs', icon: FiBriefcase, href: '/dashboard/jobs' },
    { title: 'Applications', icon: FiFileText, href: '/dashboard/applications' },
    { title: 'Settings', icon: FiSettings, href: '/dashboard/profile' },
  ];

  const quickActions = [
    { title: 'Post Listing', icon: FiPlus, href: '/listings/create', color: 'from-blue-500 to-indigo-600' },
    { title: 'Post Job', icon: FiBriefcase, href: '/jobs/create', color: 'from-purple-500 to-pink-600' },
    { title: 'Browse', icon: FiEye, href: '/listings', color: 'from-teal-500 to-emerald-600' },
    { title: 'Find Jobs', icon: FiFileText, href: '/jobs', color: 'from-orange-500 to-red-600' },
  ];

  return (
    <div className="min-h-screen bg-[#f8fafb] flex">
      {/* Sidebar Overlay for Mobile */}
      {!isSidebarOpen && (
        <button 
          onClick={() => setIsSidebarOpen(true)}
          className="lg:hidden fixed bottom-6 right-6 z-50 w-14 h-14 btn-gradient rounded-full shadow-lg flex items-center justify-center text-white"
        >
          <FiMenu className="w-6 h-6" />
        </button>
      )}

      {/* Sidebar */}
      <aside className={`fixed inset-y-0 left-0 z-40 w-72 transition-transform duration-300 transform ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0 lg:static lg:inset-0`}>
        <div className="h-full glass-card border-r border-teal-500/10 flex flex-col">
          {/* Sidebar Header */}
          <div className="p-8 border-b border-teal-500/5">
            <div className="flex items-center justify-between mb-8 lg:hidden">
              <span className="font-black text-xl text-gradient">Menu</span>
              <button onClick={() => setIsSidebarOpen(false)} className="text-[#3c4947]"><FiX className="w-6 h-6" /></button>
            </div>
            
            <div className="flex items-center gap-4 mb-4">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-teal-500 to-emerald-500 flex items-center justify-center text-white shadow-lg shadow-teal-500/20">
                <FiUser className="w-6 h-6" />
              </div>
              <div className="overflow-hidden">
                <h3 className="font-black text-sm text-[#191c1e] truncate">{user?.fullName || 'Health Professional'}</h3>
                <p className="text-[10px] font-bold text-teal-600 uppercase tracking-widest truncate">{user?.roles?.[0] || 'Member'}</p>
              </div>
            </div>
          </div>

          {/* Navigation Items */}
          <nav className="flex-1 p-6 space-y-2 overflow-y-auto">
            {navItems.map((item) => (
              <Link 
                key={item.title} 
                to={item.href}
                className={`flex items-center gap-4 px-4 py-3.5 rounded-xl transition-all duration-300 group ${item.active ? 'btn-gradient text-white shadow-lg shadow-teal-500/20' : 'hover:bg-teal-50 text-[#3c4947] hover:text-teal-600'}`}
              >
                <item.icon className={`w-5 h-5 ${item.active ? 'text-white' : 'text-teal-400 group-hover:text-teal-600'}`} />
                <span className="font-black text-xs uppercase tracking-widest">{item.title}</span>
              </Link>
            ))}
          </nav>

          {/* Sidebar Footer */}
          <div className="p-6 border-t border-teal-500/5">
            <button 
              onClick={handleLogout}
              className="w-full flex items-center gap-4 px-4 py-3.5 rounded-xl text-red-500 hover:bg-red-50 transition-all duration-300 group"
            >
              <FiLogOut className="w-5 h-5 opacity-60 group-hover:opacity-100" />
              <span className="font-black text-xs uppercase tracking-widest">Sign Out</span>
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 min-w-0 overflow-y-auto">
        <div className="max-w-6xl mx-auto p-6 md:p-10 lg:p-12 space-y-10">
          
          {/* Welcome Header */}
          <section className="animate-fadeIn">
            <h1 className="text-4xl md:text-5xl font-black text-[#191c1e] tracking-tighter leading-none mb-4">
              Hello, <span className="text-gradient underline decoration-teal-500/20">{user?.fullName?.split(' ')[0]}</span>
            </h1>
            <p className="text-sm font-bold text-[#3c4947] opacity-60 max-w-2xl tracking-tight leading-relaxed">
              Your institutional command center is active. Monitor your healthcare ecosystem, track analytics, and manage stakeholder inquiries.
            </p>
          </section>

          {/* Quick Actions Grid */}
          <section>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {quickActions.map((action) => (
                <Link 
                  key={action.title} 
                  to={action.href} 
                  className="glass-card p-6 group hover-3d transition-all duration-500 shadow-xl shadow-teal-500/5 flex flex-col items-center text-center"
                >
                  <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${action.color} mb-4 flex items-center justify-center text-white shadow-lg transform group-hover:scale-110 transition-transform duration-500`}>
                    <action.icon className="w-7 h-7" />
                  </div>
                  <h3 className="font-black text-xs uppercase tracking-[0.2em] text-[#191c1e] mb-1">{action.title}</h3>
                  <p className="text-[10px] font-bold text-[#3c4947] opacity-40 uppercase tracking-widest">Execute Node</p>
                </Link>
              ))}
            </div>
          </section>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Account Information */}
            <section className="lg:col-span-2 space-y-6">
              <div className="flex items-center justify-between px-2">
                <h2 className="text-xl font-black text-[#191c1e] tracking-tight uppercase tracking-[0.1em]">Identity Profile</h2>
                <Link to="/dashboard/profile" className="text-[10px] font-black text-teal-600 hover:text-teal-700 uppercase tracking-widest transition-colors flex items-center gap-1.5 underline">
                  <FiEdit className="w-3 h-3" /> Update Credentials
                </Link>
              </div>
              
              <div className="glass-card overflow-hidden shadow-2xl relative">
                <div className="absolute top-0 right-0 w-32 h-32 bg-teal-500/5 rounded-full -mr-16 -mt-16 blur-3xl opacity-50" />
                <div className="p-8 md:p-10 space-y-8 relative z-10">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-8">
                    <div className="space-y-1.5">
                      <p className="text-[10px] font-black text-[#3c4947] opacity-40 uppercase tracking-[0.2em]">Institutional Email</p>
                      <p className="font-black text-[#191c1e] tracking-tight truncate">{user?.email || 'unassigned@medbiz.io'}</p>
                    </div>
                    <div className="space-y-1.5">
                      <p className="text-[10px] font-black text-[#3c4947] opacity-40 uppercase tracking-[0.2em]">Primary Contact</p>
                      <p className="font-black text-[#191c1e] tracking-tight">{user?.mobileNumber || '+91 - Not Set'}</p>
                    </div>
                    <div className="md:col-span-2 space-y-3">
                      <p className="text-[10px] font-black text-[#3c4947] opacity-40 uppercase tracking-[0.2em]">Authorization Nodes</p>
                      <div className="flex flex-wrap gap-2 pt-1">
                        {user?.roles?.map(role => (
                          <span key={role} className="px-3 py-1.5 bg-teal-500 text-white text-[9px] font-black uppercase tracking-widest rounded-lg shadow-lg shadow-teal-500/20">
                            {role}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* Verification Sentinel */}
            <section className="space-y-6">
              <h2 className="text-xl font-black text-[#191c1e] tracking-tight px-2 uppercase tracking-[0.1em]">Protocol Check</h2>
              <div className="glass-card p-8 h-full shadow-2xl relative overflow-hidden group">
                 <div className={`absolute inset-0 opacity-[0.03] transition-opacity duration-700 pointer-events-none flex items-center justify-center`}>
                    <FiShield className="w-48 h-48" />
                 </div>
                 
                 <div className="relative z-10 flex flex-col h-full">
                    <div className="flex items-center justify-between mb-8">
                      <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shadow-lg transition-transform group-hover:scale-110 duration-500 ${verification?.status === 'APPROVED' ? 'bg-emerald-500 text-white shadow-emerald-500/20' : 'bg-orange-500 text-white shadow-orange-500/20'}`}>
                        <FiShield className="w-6 h-6" />
                      </div>
                      <div className={`px-3 py-1 text-[9px] font-black uppercase tracking-widest rounded-full border-2 ${
                        verification?.status === 'APPROVED' ? 'bg-emerald-50 border-emerald-100 text-emerald-600' :
                        verification?.status === 'PENDING' ? 'bg-orange-50 border-orange-100 text-orange-600' :
                        verification?.status === 'REJECTED' ? 'bg-red-50 border-red-100 text-red-600' :
                        'bg-gray-50 border-gray-100 text-gray-500'
                      }`}>
                        {verification?.status || 'Unverified'}
                      </div>
                    </div>

                    {!verification ? (
                      <div className="space-y-4 flex-1">
                        <h3 className="font-black text-base text-[#191c1e] tracking-tight">KYC Pending</h3>
                        <p className="text-xs font-bold text-[#3c4947] opacity-60 leading-relaxed uppercase tracking-wide">Submit institutional credentials to validate your entity.</p>
                        <button 
                          onClick={() => setShowVerModal(true)}
                          className="text-[10px] font-black text-teal-600 hover:text-teal-700 transition-all uppercase tracking-[0.2em] pt-2 underline decoration-teal-500/20"
                        >
                          Initiate Protocol
                        </button>
                      </div>
                    ) : (
                      <div className="space-y-6 flex-1">
                        <div className="space-y-3">
                          <div className="flex justify-between items-center group/data">
                             <span className="text-[9px] font-black text-[#3c4947] opacity-40 uppercase tracking-widest">Type</span>
                             <span className="text-xs font-black text-[#191c1e] truncate">{verification.docType}</span>
                          </div>
                          <div className="flex justify-between items-center group/data">
                             <span className="text-[9px] font-black text-[#3c4947] opacity-40 uppercase tracking-widest">Date</span>
                             <span className="text-xs font-black text-[#191c1e]">{new Date(verification.createdAt).toLocaleDateString()}</span>
                          </div>
                        </div>

                        {verification.status === 'REJECTED' && (
                          <div className="p-4 bg-red-50 rounded-xl border border-red-100 space-y-2">
                            <p className="text-[8px] font-black text-red-500 uppercase tracking-widest">Protocol Failure Reason</p>
                            <p className="text-[10px] font-bold text-red-700 leading-tight">{verification.rejectionReason}</p>
                          </div>
                        )}
                        
                        <div className="pt-4 mt-auto">
                           <div className="w-full h-1 bg-gray-100 rounded-full overflow-hidden">
                              <div className={`h-full transition-all duration-1000 ${verification?.status === 'APPROVED' ? 'w-full bg-emerald-500' : verification?.status === 'PENDING' ? 'w-2/3 bg-orange-500' : 'w-1/3 bg-red-500'}`} />
                           </div>
                           <p className="text-[8px] font-black text-[#3c4947] opacity-20 uppercase tracking-[0.3em] mt-3 text-center">Identity Node Integrity</p>
                        </div>
                      </div>
                    )}
                 </div>
              </div>
            </section>
          </div>
        </div>
      </main>

      <VerificationModal 
        isOpen={showVerModal} 
        onClose={() => setShowVerModal(false)} 
        onSuccess={() => {
          // Re-fetch verification status
          const fetchVer = async () => {
            try {
              const res = await userAPI.getVerificationStatus();
              if (res.data?.data) setVerification(res.data.data);
            } catch (err) {
              console.error('Error fetching verification status:', err);
            }
          };
          fetchVer();
        }}
      />
    </div>
  );
};

export default DashboardPage;
