// Placeholder exports for remaining pages
// These pages can be fully implemented as needed

import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { listingsAPI, jobsAPI, userAPI, inquiriesAPI, masterAPI } from '../services/api';
import toast from 'react-hot-toast';
import { FaEye, FaMapMarkerAlt, FaRupeeSign, FaLock } from 'react-icons/fa';

// Generic placeholder component
const PlaceholderPage = ({ title, description, linkText, linkHref }) => (
  <div className="min-h-screen bg-ethereal-surface py-12 px-4">
    <div className="max-w-4xl mx-auto">
      <div className="glass-card rounded-3xl p-12 text-center animate-fadeIn">
        <h1 className="text-4xl display-title mb-6">{title}</h1>
        <p className="text-ethereal-on-surface-variant text-lg mb-8 max-w-2xl mx-auto">{description}</p>
        {linkText && linkHref && (
          <Link to={linkHref} className="btn-ethereal-primary inline-block">
            {linkText}
          </Link>
        )}
      </div>
    </div>
  </div>
);

// Listing Pages
export const CreateListingPage = () => (
  <PlaceholderPage
    title="Create Listing"
    description="Create a new marketplace listing for your hospital, pharma company, or diagnostic center."
    linkText="Back to Dashboard"
    linkHref="/dashboard"
  />
);

export const MyListingsPage = () => {
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('');

  useEffect(() => {
    fetchListings();
    masterAPI.getCategories().then(res => setCategories(res.data?.data || []));
  }, []);

  const fetchListings = async () => {
    try {
      const { data } = await listingsAPI.getMy({ size: 100 });
      setListings(data.data.content);
    } catch (error) {
      toast.error('Failed to fetch listings');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return (
    <div className="min-h-screen bg-ethereal-surface flex items-center justify-center">
      <div className="animate-pulse text-ethereal-primary font-medium">Loading your listings...</div>
    </div>
  );

  return (
    <div className="min-h-screen bg-ethereal-surface py-10 px-4 md:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-10">
          <div>
            <span className="section-label mb-2 block">Marketplace</span>
            <h1 className="text-4xl display-title">My Listings</h1>
          </div>
          <div className="flex flex-wrap items-center gap-4 w-full md:w-auto">
            <select
              value={selectedCategory}
              onChange={e => setSelectedCategory(e.target.value)}
              className="bg-white border border-ethereal-outline-variant px-4 py-2.5 rounded-full text-sm focus:ring-2 focus:ring-ethereal-primary/20 focus:outline-none transition-all"
            >
              <option value="">All Categories</option>
              {categories.map(c => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
            <Link to="/listings/create" className="btn-ethereal-primary whitespace-nowrap">
              Post New Listing
            </Link>
          </div>
        </div>

        {listings.filter(listing => {
          if (!selectedCategory) return true;
          const categoryObj = categories.find(c => String(c.id) === selectedCategory);
          return categoryObj && listing.categoryName === categoryObj.name;
        }).length === 0 ? (
          <div className="glass-card p-12 text-center rounded-3xl">
            <p className="text-ethereal-on-surface-variant mb-6 text-lg">You haven't posted any listings yet.</p>
            <Link to="/listings/create" className="text-ethereal-primary font-bold hover:underline">Get started today</Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {listings.filter(listing => {
              if (!selectedCategory) return true;
              const categoryObj = categories.find(c => String(c.id) === selectedCategory);
              return categoryObj && listing.categoryName === categoryObj.name;
            }).map(listing => (
              <div key={listing.id} className="glass-card rounded-3xl overflow-hidden group">
                <div className="relative h-56 overflow-hidden">
                  <img 
                    src={listing.primaryImage || '/placeholder-image.jpg'} 
                    alt={listing.displayTitle} 
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" 
                  />
                  <div className="absolute top-4 right-4 flex gap-2">
                    {listing.isConfidential && (
                      <span className="bg-orange-500/90 text-white backdrop-blur-md px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider flex items-center gap-1.5 shadow-lg">
                        <FaLock size={10} /> Confidential
                      </span>
                    )}
                    <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider backdrop-blur-md shadow-lg ${
                      listing.status === 'ACTIVE' ? 'bg-green-500/90 text-white' : 'bg-yellow-500/90 text-white'
                    }`}>
                      {listing.status}
                    </span>
                  </div>
                </div>
                <div className="p-6">
                  <div className="mb-4">
                    <span className="section-label mb-1 block opacity-60">{listing.categoryName}</span>
                    <h3 className="text-xl font-bold text-ethereal-on-surface line-clamp-1 leading-tight">{listing.displayTitle}</h3>
                  </div>
                  <p className="text-ethereal-on-surface-variant text-sm mb-6 line-clamp-2 leading-relaxed h-10">
                    {listing.shortDescription}
                  </p>
                  <div className="flex justify-between items-center pt-5 border-t border-ethereal-outline-variant/30">
                    <div className="flex flex-col">
                      <span className="text-[10px] text-ethereal-on-surface-variant font-bold uppercase tracking-wider mb-0.5">Asking Price</span>
                      <span className="text-xl font-bold text-ethereal-primary flex items-center leading-none">
                        <FaRupeeSign size={16} className="mr-0.5" />
                        {listing.askingPrice?.toLocaleString()}
                      </span>
                    </div>
                    <div className="flex gap-2">
                      <Link to={`/listings/${listing.id}`} className="p-2.5 rounded-full bg-ethereal-surface-low text-ethereal-primary hover:bg-ethereal-primary hover:text-white transition-all shadow-sm" title="View Details">
                        <FaEye />
                      </Link>
                      <Link to={`/listings/${listing.id}/edit`} className="btn-ethereal-secondary !px-4 !py-2 text-sm">
                        Edit
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export const MyInquiriesPage = () => {
  const [activeTab, setActiveTab] = useState('received');
  const [inquiries, setInquiries] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchInquiries();
  }, [activeTab]);

  const fetchInquiries = async () => {
    setLoading(true);
    try {
      const { data } = activeTab === 'received'
        ? await inquiriesAPI.getReceived({ size: 100 })
        : await inquiriesAPI.getSent({ size: 100 });
      setInquiries(data.data.content || []);
    } catch (error) {
      toast.error('Failed to fetch inquiries');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-ethereal-surface py-12 px-4 md:px-8">
      <div className="max-w-6xl mx-auto">
        <div className="mb-10 text-center md:text-left">
          <span className="section-label mb-2 block">Communications</span>
          <h1 className="text-4xl display-title">Listing Inquiries</h1>
        </div>

        <div className="flex justify-center md:justify-start mb-10">
          <div className="glass-panel p-1.5 rounded-full flex items-center gap-1">
            <button
              className={`px-8 py-2.5 rounded-full text-sm font-bold transition-all ${
                activeTab === 'received' 
                  ? 'bg-ethereal-primary text-white shadow-lg' 
                  : 'text-ethereal-on-surface-variant hover:text-ethereal-primary'
              }`}
              onClick={() => setActiveTab('received')}
            >
              Received Inquiries
            </button>
            <button
              className={`px-8 py-2.5 rounded-full text-sm font-bold transition-all ${
                activeTab === 'sent' 
                  ? 'bg-ethereal-primary text-white shadow-lg' 
                  : 'text-ethereal-on-surface-variant hover:text-ethereal-primary'
              }`}
              onClick={() => setActiveTab('sent')}
            >
              Sent Inquiries
            </button>
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center py-20">
            <div className="animate-spin h-8 w-8 border-4 border-ethereal-primary border-t-transparent rounded-full"></div>
          </div>
        ) : inquiries.length === 0 ? (
          <div className="glass-card p-16 text-center rounded-3xl animate-fadeIn">
            <p className="text-ethereal-on-surface-variant text-lg">No inquiries found in this section.</p>
          </div>
        ) : (
          <div className="grid gap-6">
            {inquiries.map((inq, idx) => (
              <div key={inq.id} className="glass-card p-6 md:p-8 rounded-3xl animate-fadeIn" style={{ animationDelay: `${idx * 0.1}s` }}>
                <div className="flex flex-col md:flex-row justify-between gap-6">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-4">
                      <h3 className="text-xl font-bold text-ethereal-on-surface">{inq.listingTitle}</h3>
                      <span className="px-3 py-1 text-[10px] font-bold tracking-wider uppercase rounded-full bg-blue-100/50 text-blue-700 border border-blue-200/50">
                        {inq.status}
                      </span>
                    </div>
                    
                    <div className="relative mb-6">
                      <div className="absolute -left-4 top-0 bottom-0 w-1 bg-ethereal-primary/20 rounded-full"></div>
                      <p className="text-ethereal-on-surface-variant italic leading-relaxed text-lg pl-2">
                        "{inq.message}"
                      </p>
                    </div>

                    <div className="pt-6 border-t border-ethereal-outline-variant/30 flex flex-wrap items-center gap-x-8 gap-y-3 text-sm">
                      {activeTab === 'received' ? (
                        <>
                          <div className="flex flex-col">
                            <span className="section-label opacity-60">Buyer Information</span>
                            <span className="font-bold text-ethereal-on-surface">{inq.buyerName}</span>
                          </div>
                          <div className="flex flex-col">
                            <span className="section-label opacity-60">Contact Details</span>
                            <span className="text-ethereal-on-surface-variant">{inq.buyerEmail} • {inq.buyerMobile}</span>
                          </div>
                        </>
                      ) : (
                        <>
                          <div className="flex flex-col">
                            <span className="section-label opacity-60">Seller Information</span>
                            <span className="font-bold text-ethereal-on-surface">{inq.sellerName}</span>
                          </div>
                          <div className="flex flex-col">
                            <span className="section-label opacity-60">Contact Details</span>
                            <span className="text-ethereal-on-surface-variant">{inq.sellerEmail} • {inq.sellerMobile}</span>
                          </div>
                        </>
                      )}
                      <div className="flex flex-col md:ml-auto">
                        <span className="section-label opacity-60">Received On</span>
                        <span className="text-ethereal-on-surface-variant text-xs">{new Date(inq.createdAt).toLocaleString()}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

// Job Pages
export const CreateJobPage = () => (
  <PlaceholderPage
    title="Post a Job"
    description="Create a new job posting to hire healthcare professionals."
    linkText="Back to Dashboard"
    linkHref="/dashboard"
  />
);

export const MyJobsPage = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchJobs = async () => {
    try {
      const { data } = await jobsAPI.getMy({ size: 100 });
      setJobs(data.data.content);
    } catch (error) {
      toast.error('Failed to fetch jobs');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return (
    <div className="min-h-screen bg-ethereal-surface flex items-center justify-center">
      <div className="animate-spin h-10 w-10 border-4 border-ethereal-primary border-t-transparent rounded-full"></div>
    </div>
  );

  return (
    <div className="min-h-screen bg-ethereal-surface py-12 px-4 md:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12">
          <div>
            <span className="section-label mb-2 block tracking-widest">Recruitment</span>
            <h1 className="text-4xl lg:text-5xl display-title">My Job Postings</h1>
          </div>
          <Link to="/jobs/create" className="btn-ethereal-primary shadow-xl">
            Post New Job
          </Link>
        </div>

        {jobs.length === 0 ? (
          <div className="glass-card p-20 text-center rounded-3xl animate-fadeIn">
            <h3 className="text-2xl font-bold text-ethereal-on-surface mb-2">Build your team</h3>
            <p className="text-ethereal-on-surface-variant mb-8">You haven't posted any jobs yet. Start hiring healthcare professionals today.</p>
            <Link to="/jobs/create" className="text-ethereal-primary font-bold hover:underline">Post your first job</Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {jobs.map((job, idx) => (
              <div key={job.id} className="glass-card p-8 rounded-3xl animate-fadeIn group" style={{ animationDelay: `${idx * 0.1}s` }}>
                <div className="flex justify-between items-start mb-6">
                  <div className="p-3 rounded-2xl bg-ethereal-surface-low text-ethereal-primary group-hover:bg-ethereal-primary group-hover:text-white transition-colors duration-300">
                    <span className="text-xs font-bold uppercase tracking-widest">{job.employmentType?.charAt(0)}</span>
                  </div>
                  <span className={`px-4 py-1 text-[10px] font-bold uppercase tracking-widest rounded-full backdrop-blur-md shadow-sm border ${
                    job.status === 'ACTIVE' 
                      ? 'bg-green-50 text-green-700 border-green-100' 
                      : 'bg-yellow-50 text-yellow-700 border-yellow-100'
                  }`}>
                    {job.status}
                  </span>
                </div>
                
                <h3 className="text-2xl font-bold text-ethereal-on-surface mb-2 group-hover:text-ethereal-primary transition-colors line-clamp-1">{job.title}</h3>
                
                <div className="flex flex-col gap-3 mb-8">
                  <div className="flex items-center text-ethereal-on-surface-variant text-sm font-medium">
                    <FaMapMarkerAlt className="mr-2 opacity-50" /> {job.cityName}
                  </div>
                  <div className="flex items-center text-ethereal-on-surface-variant text-xs font-bold uppercase tracking-widest">
                    {job.employmentType}
                  </div>
                </div>

                <Link 
                  to={`/jobs/${job.id}`} 
                  className="flex items-center justify-center w-full py-3.5 rounded-2xl bg-ethereal-surface-low text-ethereal-primary font-bold hover:bg-ethereal-primary hover:text-white transition-all duration-300 group/btn"
                >
                  Manage Role
                  <FaEye className="ml-2 transform group-hover/btn:scale-110 transition-transform" />
                </Link>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export const MyApplicationsPage = () => {
  const [activeTab, setActiveTab] = useState('received');
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchApplications();
  }, [activeTab]);

  const fetchApplications = async () => {
    setLoading(true);
    try {
      const { data } = activeTab === 'received'
        ? await jobsAPI.getReceivedApplications({ size: 100 })
        : await jobsAPI.getMyApplications({ size: 100 });
      setApplications(data.data.content || []);
    } catch (error) {
      toast.error('Failed to fetch applications');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (appId, newStatus) => {
    try {
      await jobsAPI.updateApplicationStatus(appId, newStatus);
      toast.success(`Applicant ${newStatus.toLowerCase()} successfully`);
      fetchApplications();
    } catch (error) {
      toast.error('Failed to update status');
    }
  };

  return (
    <div className="min-h-screen bg-ethereal-surface py-12 px-4 md:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-12">
          <span className="section-label mb-2 block">Talent Pipeline</span>
          <h1 className="text-4xl display-title">Job Applications</h1>
        </div>

        <div className="flex flex-col md:flex-row gap-8">
          {/* Navigation */}
          <div className="w-full md:w-64 flex-shrink-0">
            <div className="glass-panel p-2 rounded-3xl flex flex-col gap-1">
              <button
                className={`w-full text-left px-6 py-4 rounded-2xl text-sm font-bold transition-all ${
                  activeTab === 'received' 
                    ? 'bg-ethereal-primary text-white shadow-lg' 
                    : 'text-ethereal-on-surface-variant hover:bg-ethereal-surface-low'
                }`}
                onClick={() => setActiveTab('received')}
              >
                Applications for My Jobs
              </button>
              <button
                className={`w-full text-left px-6 py-4 rounded-2xl text-sm font-bold transition-all ${
                  activeTab === 'sent' 
                    ? 'bg-ethereal-primary text-white shadow-lg' 
                    : 'text-ethereal-on-surface-variant hover:bg-ethereal-surface-low'
                }`}
                onClick={() => setActiveTab('sent')}
              >
                My Applications
              </button>
            </div>
          </div>

          {/* Content */}
          <div className="flex-1">
            {loading ? (
              <div className="flex justify-center py-12">
                <div className="animate-spin h-8 w-8 border-2 border-ethereal-primary border-t-transparent rounded-full"></div>
              </div>
            ) : applications.length === 0 ? (
              <div className="no-border-card text-center py-20 flex flex-col items-center">
                <div className="w-16 h-16 bg-ethereal-surface-low rounded-full flex items-center justify-center mb-6">
                  <FaEye className="text-ethereal-primary opacity-30" size={24} />
                </div>
                <p className="text-ethereal-on-surface-variant text-lg">No applications found in this section.</p>
              </div>
            ) : (
              <div className="grid gap-6">
                {applications.map((app, idx) => (
                  <div key={app.id} className="no-border-card animate-fadeIn overflow-hidden relative" style={{ animationDelay: `${idx * 0.05}s` }}>
                    <div className="flex flex-col lg:flex-row gap-8">
                      <div className="flex-1">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                          <div>
                            <span className="section-label block opacity-60 mb-1">{app.jobTitle}</span>
                            <h3 className="text-xl font-bold text-ethereal-on-surface">
                              {activeTab === 'received' ? app.seekerName : `${app.employerName} (${app.employerCompany})`}
                            </h3>
                          </div>
                          <span className={`self-start sm:self-center px-4 py-1.5 text-[10px] font-bold uppercase tracking-widest rounded-full border ${
                            ['ACCEPTED', 'HIRED'].includes(app.status) 
                              ? 'bg-green-50 text-green-700 border-green-100' 
                              : app.status === 'REJECTED' 
                                ? 'bg-red-50 text-red-700 border-red-100' 
                                : 'bg-blue-50 text-blue-700 border-blue-100'
                          }`}>
                            {app.status}
                          </span>
                        </div>

                        {app.coverLetter && (
                          <div className="mb-8 p-6 bg-ethereal-surface-low rounded-2xl relative overflow-hidden group">
                            <div className="absolute top-0 right-0 w-2 h-2 bg-ethereal-primary rounded-bl-lg opacity-20"></div>
                            <p className="text-ethereal-on-surface-variant text-sm italic relative z-10 leading-relaxed">
                              "{app.coverLetter}"
                            </p>
                          </div>
                        )}

                        <div className="flex flex-wrap items-center justify-between gap-6">
                          <div className="flex flex-wrap gap-8 text-sm">
                            <div className="flex flex-col">
                              <span className="section-label opacity-40">Applied On</span>
                              <span className="font-medium text-ethereal-on-surface-variant">{new Date(app.appliedAt).toLocaleDateString()}</span>
                            </div>
                            {activeTab === 'received' && (
                              <>
                                <div className="flex flex-col">
                                  <span className="section-label opacity-40">Contact</span>
                                  <span className="font-medium text-ethereal-on-surface-variant">{app.seekerEmail} • {app.seekerMobile}</span>
                                </div>
                              </>
                            )}
                          </div>
                          {app.cvUrl && (
                            <a 
                              href={`http://localhost:8080${app.cvUrl.replace('/api/listings/media/', '/api/uploads/')}`} 
                              target="_blank" 
                              rel="noopener noreferrer" 
                              className="px-6 py-2 bg-ethereal-surface-low border border-ethereal-primary/20 text-ethereal-primary font-bold rounded-xl hover:bg-ethereal-primary hover:text-white transition-all duration-300 flex items-center gap-2"
                            >
                              <FaEye size={14} /> View Document
                            </a>
                          )}
                        </div>
                      </div>

                      {activeTab === 'received' && app.status === 'APPLIED' && (
                        <div className="flex lg:flex-col items-stretch gap-3 lg:w-48 lg:border-l border-ethereal-outline-variant/30 lg:pl-8 pt-8 lg:pt-0">
                          <button 
                            onClick={() => handleStatusChange(app.id, 'ACCEPTED')} 
                            className="flex-1 bg-ethereal-secondary text-white py-3 rounded-2xl font-bold shadow-lg shadow-teal-500/10 hover:shadow-teal-500/20 hover:scale-[1.02] transition-all"
                          >
                            Shortlist
                          </button>
                          <button 
                            onClick={() => handleStatusChange(app.id, 'REJECTED')} 
                            className="flex-1 bg-red-50 text-red-600 py-3 rounded-2xl font-bold hover:bg-red-100 transition-all border border-red-100"
                          >
                            Decline
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

// Profile
export const ProfilePage = () => {
  const [profile, setProfile] = useState({ fullName: '', mobileNumber: '', companyName: '', cityId: '', cityName: '' });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const { data } = await userAPI.getProfile();
      setProfile({
        fullName: data.data.fullName || '',
        mobileNumber: data.data.mobileNumber || '',
        companyName: data.data.companyName || '',
        cityId: data.data.city?.id || '',
        cityName: data.data.city?.name || ''
      });
    } catch (error) {
      toast.error('Failed to load profile');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfile(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const payload = {
        fullName: profile.fullName,
        mobileNumber: profile.mobileNumber,
        companyName: profile.companyName,
      };
      if (profile.cityId) payload.cityId = profile.cityId;

      await userAPI.updateProfile(payload);
      toast.success('Profile updated successfully');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return (
    <div className="min-h-screen bg-ethereal-surface flex items-center justify-center">
      <div className="animate-pulse text-ethereal-primary font-medium text-lg">Loading profile...</div>
    </div>
  );

  return (
    <div className="min-h-screen bg-ethereal-surface py-20 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="flex flex-col items-center text-center mb-12">
          <div className="w-24 h-24 bg-ethereal-primary rounded-full flex items-center justify-center text-white text-3xl font-bold mb-6 shadow-xl shadow-blue-500/20">
            {profile.fullName.charAt(0)}
          </div>
          <span className="section-label mb-2 block tracking-widest">Account Settings</span>
          <h1 className="text-4xl display-title uppercase tracking-tighter">Personal Profile</h1>
        </div>

        <div className="glass-card p-10 md:p-16 rounded-[2.5rem] relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-ethereal-primary/5 rounded-full blur-3xl -mr-32 -mt-32"></div>
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-ethereal-secondary/5 rounded-full blur-3xl -ml-32 -mb-32"></div>
          
          <form onSubmit={handleSubmit} className="relative z-10">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-10">
              <div className="space-y-2">
                <label className="section-label opacity-60 ml-1">Legal Full Name</label>
                <input 
                  type="text" 
                  name="fullName" 
                  value={profile.fullName} 
                  onChange={handleChange} 
                  className="w-full bg-ethereal-surface-low border border-ethereal-outline-variant/30 px-6 py-4 rounded-2xl focus:ring-4 focus:ring-ethereal-primary/5 focus:border-ethereal-primary focus:outline-none transition-all text-ethereal-on-surface font-medium" 
                  required 
                />
              </div>
              <div className="space-y-2">
                <label className="section-label opacity-60 ml-1">Primary Mobile</label>
                <input 
                  type="text" 
                  name="mobileNumber" 
                  value={profile.mobileNumber} 
                  onChange={handleChange} 
                  className="w-full bg-ethereal-surface-low border border-ethereal-outline-variant/30 px-6 py-4 rounded-2xl focus:ring-4 focus:ring-ethereal-primary/5 focus:border-ethereal-primary focus:outline-none transition-all text-ethereal-on-surface font-medium" 
                  required 
                  pattern="^[6-9]\d{9}$" 
                />
              </div>
              <div className="md:col-span-2 space-y-2">
                <label className="section-label opacity-60 ml-1">Entity / Organization</label>
                <input 
                  type="text" 
                  name="companyName" 
                  value={profile.companyName} 
                  onChange={handleChange} 
                  className="w-full bg-ethereal-surface-low border border-ethereal-outline-variant/30 px-6 py-4 rounded-2xl focus:ring-4 focus:ring-ethereal-primary/5 focus:border-ethereal-primary focus:outline-none transition-all text-ethereal-on-surface font-medium" 
                />
              </div>
              <div className="md:col-span-2 space-y-2">
                <label className="section-label opacity-60 ml-1">Registered Analytics City</label>
                <div className="relative group">
                  <input 
                    type="text" 
                    disabled 
                    value={profile.cityName} 
                    className="w-full bg-ethereal-surface-low/50 border border-ethereal-outline-variant/20 px-6 py-4 rounded-2xl text-ethereal-on-surface-variant font-medium cursor-not-allowed" 
                    placeholder="City" 
                  />
                  <div className="absolute right-6 top-1/2 -translate-y-1/2 text-[10px] font-bold uppercase text-ethereal-primary opacity-60">Locked</div>
                </div>
                <p className="text-[10px] font-bold text-ethereal-on-surface-variant mt-3 uppercase tracking-widest flex items-center gap-2">
                  <span className="w-1 h-1 bg-ethereal-primary rounded-full"></span>
                  Contact infrastructure support for regional updates.
                </p>
              </div>
            </div>

            <div className="mt-16 flex justify-center md:justify-end">
              <button 
                type="submit" 
                disabled={saving} 
                className="btn-ethereal-primary min-w-[200px] py-4 text-lg shadow-2xl disabled:opacity-50"
              >
                {saving ? (
                  <span className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    Syncing...
                  </span>
                ) : 'Update Identity'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

// Admin Pages
export const AdminListings = () => (
  <PlaceholderPage
    title="Listings Administration"
    description="Full lifecycle management for clinical assets and marketplace listings. Review, moderate, and authorize clinical inventory listings for global distribution."
  />
);

export const AdminJobs = () => (
  <PlaceholderPage
    title="Human Capital Management"
    description="Strategic oversight of healthcare recruitment listings. Approve specialized clinical roles and ensure vetting compliance for hospital staffing."
  />
);

export const AdminUsers = () => (
  <PlaceholderPage
    title="Identity Ecosystem"
    description="Administrative control over the healthcare professional directory. Monitor verified practitioners, clinical organizations, and strategic buyers."
  />
);

export const AdminVerifications = () => (
  <PlaceholderPage
    title="KYC & Integrity Suite"
    description="Critical verification gateway for buyer authorization. Review Aadhar credentials and clinical certifications to maintain ecosystem trust."
  />
);
