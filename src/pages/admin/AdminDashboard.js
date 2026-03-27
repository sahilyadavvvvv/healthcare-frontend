import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { adminAPI } from '../../services/api';
import { FiUsers, FiList, FiBriefcase, FiMail, FiCheck, FiX, FiEye } from 'react-icons/fi';

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => { fetchStats(); }, []);

  const fetchStats = async () => {
    try {
      const response = await adminAPI.getDashboardStats();
      setStats(response.data.data);
    } catch (error) { console.error('Error fetching stats:', error); }
    setLoading(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-ethereal-surface flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-ethereal-primary"></div>
      </div>
    );
  }

  const statCards = [
    { title: 'Total Network Users', value: stats?.totalUsers || 0, icon: FiUsers, gradient: 'from-blue-500/20 to-indigo-500/20', accent: 'text-blue-600', label: stats?.newUsersToday ? `+${stats.newUsersToday} recently` : 'Stable growth' },
    { title: 'Active Listings', value: stats?.totalListings || 0, icon: FiList, gradient: 'from-teal-500/20 to-emerald-500/20', accent: 'text-teal-600', label: stats?.pendingListings ? `${stats.pendingListings} pending review` : 'All caught up' },
    { title: 'Career Opportunities', value: stats?.totalJobs || 0, icon: FiBriefcase, gradient: 'from-purple-500/20 to-pink-500/20', accent: 'text-purple-600', label: stats?.pendingJobs ? `${stats.pendingJobs} processing` : 'Optimized flow' },
    { title: 'Strategic Inquiries', value: stats?.inquiriesToday || 0, icon: FiMail, gradient: 'from-orange-500/20 to-red-500/20', accent: 'text-orange-600', label: '24h activity' }
  ];

  return (
    <div className="min-h-screen bg-ethereal-surface py-12 px-4 md:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-12">
          <span className="section-label mb-2 block tracking-[0.2em]">Administrative Control</span>
          <h1 className="text-4xl display-title uppercase tracking-tighter">Command Center</h1>
          <p className="text-ethereal-on-surface-variant font-medium mt-1">Platform-wide analytics and strategic orchestration</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          {statCards.map((stat, idx) => (
            <div key={stat.title} className="glass-card p-8 rounded-[2rem] border-none animate-fadeIn group" style={{ animationDelay: `${idx * 0.1}s` }}>
              <div className="flex items-center justify-between mb-8">
                <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${stat.gradient} flex items-center justify-center group-hover:scale-110 transition-transform duration-500`}>
                  <stat.icon className={`w-7 h-7 ${stat.accent}`} />
                </div>
                <span className="text-[10px] font-black uppercase tracking-widest text-ethereal-on-surface-variant opacity-40">{stat.label}</span>
              </div>
              <h3 className="text-4xl font-bold text-ethereal-on-surface mb-1 tracking-tight">{stat.value.toLocaleString()}</h3>
              <p className="text-sm font-bold text-ethereal-on-surface-variant uppercase tracking-widest opacity-60">{stat.title}</p>
            </div>
          ))}
        </div>

        {/* Core Operations */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
          <div className="lg:col-span-2 glass-card p-10 rounded-[2.5rem] border-none">
            <div className="flex justify-between items-center mb-10">
              <h2 className="text-2xl font-bold text-ethereal-on-surface tracking-tight">Active Pipeline</h2>
              <Link to="/admin/listings?status=PENDING" className="text-ethereal-primary text-sm font-black uppercase tracking-widest hover:underline">Full Audit</Link>
            </div>
            <div className="grid gap-4">
              <div className="flex items-center justify-between p-6 bg-ethereal-surface-low/50 rounded-3xl group hover:bg-white transition-all duration-300">
                <div className="flex items-center gap-5">
                  <div className="p-4 rounded-2xl bg-orange-100/50 text-orange-600"><FiList size={22} /></div>
                  <div>
                    <p className="font-bold text-ethereal-on-surface">Listings Vetting</p>
                    <p className="text-xs font-medium text-ethereal-on-surface-variant opacity-60">{stats?.pendingListings || 0} assets awaiting clinical verification</p>
                  </div>
                </div>
                <Link to="/admin/listings?status=PENDING" className="btn-ethereal-secondary !px-6 !py-2.5 text-xs font-black">Verify</Link>
              </div>
              <div className="flex items-center justify-between p-6 bg-ethereal-surface-low/50 rounded-3xl group hover:bg-white transition-all duration-300">
                <div className="flex items-center gap-5">
                  <div className="p-4 rounded-2xl bg-purple-100/50 text-purple-600"><FiBriefcase size={22} /></div>
                  <div>
                    <p className="font-bold text-ethereal-on-surface">Career Path Approval</p>
                    <p className="text-xs font-medium text-ethereal-on-surface-variant opacity-60">{stats?.pendingJobs || 0} professional roles in processing</p>
                  </div>
                </div>
                <Link to="/admin/jobs?status=PENDING" className="btn-ethereal-secondary !px-6 !py-2.5 text-xs font-black">Audit</Link>
              </div>
              <div className="flex items-center justify-between p-6 bg-ethereal-surface-low/50 rounded-3xl group hover:bg-white transition-all duration-300">
                <div className="flex items-center gap-5">
                  <div className="p-4 rounded-2xl bg-blue-100/50 text-blue-600"><FiUsers size={22} /></div>
                  <div>
                    <p className="font-bold text-ethereal-on-surface">KYC Integrity Suite</p>
                    <p className="text-xs font-medium text-ethereal-on-surface-variant opacity-60">{stats?.pendingVerifications || 0} buyer identity requests</p>
                  </div>
                </div>
                <Link to="/admin/verifications" className="btn-ethereal-secondary !px-6 !py-2.5 text-xs font-black">Authorize</Link>
              </div>
            </div>
          </div>

          <div className="glass-card p-10 rounded-[2.5rem] border-none bg-gradient-to-br from-white to-ethereal-surface-low">
            <h2 className="text-2xl font-bold text-ethereal-on-surface tracking-tight mb-8">Pulse Report</h2>
            <div className="space-y-6">
              {[
                { label: 'New Entities', value: stats?.newUsersToday, color: 'bg-green-500' },
                { label: 'Asset Intake', value: stats?.newListingsToday, color: 'bg-blue-500' },
                { label: 'Network Inquiries', value: stats?.inquiriesToday, color: 'bg-orange-500' },
                { label: 'Talent Moves', value: stats?.applicationsToday, color: 'bg-purple-500' },
                { label: 'Weekly Growth', value: stats?.newUsersWeek, color: 'bg-pink-500' },
              ].map((item) => (
                <div key={item.label} className="flex items-center justify-between group">
                  <div className="flex items-center gap-4">
                    <div className={`w-1.5 h-1.5 ${item.color} rounded-full`}></div>
                    <span className="text-sm font-bold text-ethereal-on-surface-variant uppercase tracking-wider group-hover:text-ethereal-primary transition-colors">{item.label}</span>
                  </div>
                  <span className="text-lg font-black text-ethereal-on-surface">{item.value || 0}</span>
                </div>
              ))}
            </div>
            <div className="mt-12 p-6 rounded-3xl bg-ethereal-primary/5 border border-ethereal-primary/10">
              <p className="text-[10px] font-black uppercase tracking-[0.2em] text-ethereal-primary mb-2">Systems Status</p>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-xs font-bold text-ethereal-on-surface">Core Infrastructure Nominal</span>
              </div>
            </div>
          </div>
        </div>

        {/* Global Strategy Tools */}
        <div className="glass-card p-10 rounded-[2.5rem] border-none">
          <h2 className="text-2xl font-bold text-ethereal-on-surface tracking-tight mb-10">Ecosystem Management</h2>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { to: '/admin/listings', icon: FiList, label: 'Asset Library' },
              { to: '/admin/jobs', icon: FiBriefcase, label: 'Talent Pool' },
              { to: '/admin/users', icon: FiUsers, label: 'Entity Directory' },
              { to: '/admin/verifications', icon: FiCheck, label: 'Trust Gateway' },
            ].map((link) => (
              <Link key={link.label} to={link.to} className="group p-8 bg-ethereal-surface-low/50 rounded-3xl hover:bg-ethereal-primary hover:text-white transition-all duration-500 text-center">
                <link.icon className="w-8 h-8 mx-auto mb-4 text-ethereal-on-surface-variant group-hover:text-white transition-colors" />
                <p className="font-bold uppercase tracking-widest text-[10px]">{link.label}</p>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
