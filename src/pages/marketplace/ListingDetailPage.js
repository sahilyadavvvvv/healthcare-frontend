import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { listingsAPI, inquiriesAPI, userAPI } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import VerificationModal from '../../components/VerificationModal';
import toast from 'react-hot-toast';
import { FiPhone, FiMail, FiMapPin, FiCheck, FiArrowLeft, FiShield, FiPhoneCall, FiCheckCircle, FiInfo, FiChevronLeft } from 'react-icons/fi';

const ListingDetailPage = () => {
  const { id } = useParams();
  const { user, isAuthenticated } = useAuth();
  const [listing, setListing] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showInquiryModal, setShowInquiryModal] = useState(false);
  const [showVerificationModal, setShowVerificationModal] = useState(false);
  const [verificationStatus, setVerificationStatus] = useState(null);
  const [inquiryData, setInquiryData] = useState({ buyerName: '', buyerEmail: '', buyerPhone: '', message: '' });
  const [submitting, setSubmitting] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => { 
    fetchListing();
    if (isAuthenticated && !user?.isVerifiedBuyer) {
      fetchVerificationStatus();
    }
  }, [id, isAuthenticated, user]);

  const fetchVerificationStatus = async () => {
    try {
      const res = await userAPI.getVerificationStatus();
      if (res.data?.data) {
        setVerificationStatus(res.data.data.status);
      }
    } catch (error) {
      console.error('Error fetching verification status', error);
    }
  };

  const fetchListing = async () => {
    try {
      const response = await listingsAPI.getById(id);
      setListing(response.data.data);
      if (user) setInquiryData({ buyerName: user.fullName || '', buyerEmail: user.email || '', buyerPhone: user.mobileNumber || '', message: '' });
    } catch (error) { console.error('Error fetching listing:', error); }
    setLoading(false);
  };

  const handleInquirySubmit = async (e) => {
    e.preventDefault();
    if (!isAuthenticated) { toast.error('Please login to send inquiry'); return; }
    setSubmitting(true);
    try {
      await inquiriesAPI.create(id, inquiryData);
      toast.success('Inquiry sent successfully!');
      setShowInquiryModal(false);
    } catch (error) { toast.error(error.response?.data?.message || 'Failed to send inquiry'); }
    setSubmitting(false);
  };

  const formatPrice = (price) => {
    if (price >= 10000000) return `₹${(price / 10000000).toFixed(1)} Crore`;
    if (price >= 100000) return `₹${(price / 100000).toFixed(1)} Lakh`;
    return `₹${price?.toLocaleString()}`;
  };

  if (loading) {
    return (<div className="min-h-screen flex items-center justify-center"><div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500"></div></div>);
  }

  if (!listing) {
    return (<div className="min-h-screen flex items-center justify-center"><div className="text-center"><h2 className="text-xl font-bold text-gray-800 mb-2">Listing Not Found</h2><Link to="/listings" className="text-primary-500">Back to Listings</Link></div></div>);
  }

  const isOwner = isAuthenticated && user?.id === listing?.seller?.id;

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4">
        <Link to="/listings" className="inline-flex items-center text-gray-600 hover:text-primary-500 mb-6"><FiChevronLeft className="mr-1" />Back to Listings</Link>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            {/* Images */}
            <div className="card overflow-hidden group">
              <div className="h-96 bg-gray-200 relative">
                {listing.images && listing.images.length > 0 ? (
                  <>
                    <img 
                      src={listing.images[currentImageIndex]} 
                      alt={listing.displayTitle} 
                      className="w-full h-full object-cover transition-all duration-300" 
                    />
                    
                    {listing.images.length > 1 && (
                      <>
                        <button 
                          onClick={(e) => {
                            e.preventDefault();
                            setCurrentImageIndex((prev) => (prev === 0 ? listing.images.length - 1 : prev - 1));
                          }}
                          className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white p-2 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <FiChevronLeft className="text-gray-800" size={24} />
                        </button>
                        <button 
                          onClick={(e) => {
                            e.preventDefault();
                            setCurrentImageIndex((prev) => (prev === listing.images.length - 1 ? 0 : prev + 1));
                          }}
                          className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white p-2 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <FiChevronLeft className="text-gray-800 rotate-180" size={24} />
                        </button>
                        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/50 text-white px-3 py-1 rounded-full text-sm">
                          {currentImageIndex + 1} / {listing.images.length}
                        </div>
                      </>
                    )}
                  </>
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-gray-100">
                    <span className="text-gray-400 text-xl">No Image Available</span>
                  </div>
                )}
              </div>
              {listing.images && listing.images.length > 1 && (
                <div className="flex overflow-x-auto gap-2 p-4 scrollbar-hide">
                  {listing.images.map((img, idx) => (
                    <img 
                      key={idx} 
                      src={img} 
                      alt={`${idx + 1}`} 
                      onClick={() => setCurrentImageIndex(idx)}
                      className={`w-24 h-24 object-cover rounded-lg cursor-pointer transition-all ${
                        currentImageIndex === idx ? 'ring-4 ring-primary-500 scale-95 opacity-100' : 'opacity-60 hover:opacity-100'
                      }`} 
                    />
                  ))}
                </div>
              )}
            </div>

            {/* Details */}
            <div className="card p-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="badge badge-primary">{listing.category?.name}</span>
                    <span className="badge badge-secondary">{listing.dealType?.name}</span>
                  </div>
                  <h1 className="text-2xl font-bold text-gray-800">{listing.displayTitle}</h1>
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                <div className="bg-gray-50 rounded-lg p-4">
                  <p className="text-sm text-gray-500 mb-1">Asking Price</p>
                  <p className="text-xl font-bold text-primary-600">{formatPrice(listing.askingPrice)}</p>
                  {listing.priceNegotiable && <p className="text-xs text-gray-500">Negotiable</p>}
                </div>
                <div className="bg-gray-50 rounded-lg p-4">
                  <p className="text-sm text-gray-500 mb-1">Location</p>
                  <p className="text-lg font-semibold text-gray-800">{listing.cityName}</p>
                  <p className="text-sm text-gray-500">{listing.stateName}</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-4">
                  <p className="text-sm text-gray-500 mb-1">Inquiries</p>
                  <p className="text-lg font-semibold text-gray-800">{listing.inquiryCount}</p>
                </div>
              </div>

              <div className="mb-6">
                <h2 className="text-lg font-semibold text-gray-800 mb-2">Description</h2>
                <p className="text-gray-600 whitespace-pre-line">{listing.detailedDescription || listing.shortDescription}</p>
              </div>

              {listing.categoryDetails && (
                <div className="border-t pt-6">
                  <h2 className="text-lg font-semibold text-gray-800 mb-4">Additional Details</h2>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {Object.entries(listing.categoryDetails).map(([key, value]) => {
                      if (['id', 'listingId', 'listing', 'createdAt', 'updatedAt'].includes(key) || value === null) return null;
                      
                      let displayValue = value;
                      if (typeof value === 'boolean') {
                        displayValue = value ? 'Yes' : 'No';
                      } else if (typeof value === 'object') {
                        displayValue = value.name || JSON.stringify(value);
                      }
                      
                      return (
                        <div key={key} className="bg-gray-50 rounded-lg p-3">
                          <p className="text-xs text-gray-500 mb-1">{key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}</p>
                          <p className="font-medium text-gray-800">{displayValue}</p>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <div className="card p-6 sticky top-24">
              <div className="text-center mb-6">
                <p className="text-3xl font-bold text-primary-600">{formatPrice(listing.askingPrice)}</p>
                {listing.priceNegotiable && <span className="text-sm text-gray-500">Price Negotiable</span>}
              </div>

              {isOwner ? (
                <Link to={`/listings/${listing.id}/edit`} className="btn btn-primary w-full py-3 mb-3 font-bold text-center block bg-teal-600 text-white rounded-lg">
                  Edit Listing
                </Link>
              ) : (
                <div className="space-y-4">
                  {/* Basic Protocol - 1000rs */}
                  <div className="group relative w-full">
                    <button 
                      onClick={() => toast.success('Basic Contact Protocol Initiated (₹1,000)')} 
                      className="w-full py-4 bg-white border-2 border-ethereal-primary/30 text-ethereal-primary rounded-[1.2rem] font-black text-[11px] uppercase tracking-widest hover:bg-ethereal-primary hover:text-white transition-all shadow-lg shadow-ethereal-primary/5 flex flex-col items-center justify-center gap-1 group"
                    >
                      <span>₹1,000 | Contact Access</span>
                      <span className="text-[8px] opacity-60">Standard Protocol</span>
                    </button>
                    {/* Tooltip */}
                    <div className="invisible group-hover:visible absolute z-[60] bottom-full left-1/2 -translate-x-1/2 mb-4 w-72 p-4 bg-slate-900 text-white rounded-2xl shadow-2xl animate-fadeIn pointer-events-none">
                      <div className="flex items-start gap-3">
                        <FiInfo className="w-4 h-4 text-ethereal-primary shrink-0 mt-0.5" />
                        <p className="text-[10px] font-medium leading-relaxed">
                          Paying 1000rs you will get the contact no of that seller but we dont take guarantee
                        </p>
                      </div>
                      <div className="absolute top-full left-1/2 -translate-x-1/2 border-8 border-transparent border-t-slate-900"></div>
                    </div>
                  </div>

                  {/* Premium Protocol - 10000rs */}
                  <div className="group relative w-full">
                    <button 
                      onClick={() => toast.success('Premium Fulfillment Protocol Initiated (₹10,000)')} 
                      className="w-full py-4 bg-gradient-to-br from-ethereal-primary to-blue-700 text-white rounded-[1.2rem] font-black text-[11px] uppercase tracking-widest hover:shadow-xl hover:shadow-blue-500/20 transition-all transform hover:scale-[1.02] active:scale-95 flex flex-col items-center justify-center gap-1"
                    >
                      <span className="flex items-center gap-2">
                        <FiCheckCircle className="w-4 h-4" /> ₹10,000 | Verified Meeting
                      </span>
                      <span className="text-[8px] text-blue-100/80">Full-Fulfillment Guarantee</span>
                    </button>
                    {/* Tooltip */}
                    <div className="invisible group-hover:visible absolute z-[60] bottom-full left-1/2 -translate-x-1/2 mb-4 w-72 p-4 bg-slate-900 text-white rounded-2xl shadow-2xl animate-fadeIn pointer-events-none">
                      <div className="flex items-start gap-3">
                        <FiShield className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                        <p className="text-[10px] font-medium leading-relaxed">
                          We take full gurantee of buyer to pick the call and arrange the meeting as well
                        </p>
                      </div>
                      <div className="absolute top-full left-1/2 -translate-x-1/2 border-8 border-transparent border-t-slate-900"></div>
                    </div>
                  </div>

                  <p className="text-[9px] font-bold text-ethereal-on-surface-variant/40 text-center uppercase tracking-widest px-4">
                    Choose a protocol to initiate stakeholder engagement
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Inquiry Modal */}
      {showInquiryModal && (
        <div className="modal-overlay" onClick={() => setShowInquiryModal(false)}>
          <div className="modal-content p-6" onClick={e => e.stopPropagation()}>
            <h2 className="text-xl font-bold text-gray-800 mb-4">Send Inquiry</h2>
            <form onSubmit={handleInquirySubmit} className="space-y-4">
              <div><label className="form-label">Your Name</label><input type="text" value={inquiryData.buyerName} onChange={e => setInquiryData({ ...inquiryData, buyerName: e.target.value })} className="form-input" required /></div>
              <div><label className="form-label">Email</label><input type="email" value={inquiryData.buyerEmail} onChange={e => setInquiryData({ ...inquiryData, buyerEmail: e.target.value })} className="form-input" required /></div>
              <div><label className="form-label">Phone</label><input type="tel" value={inquiryData.buyerPhone} onChange={e => setInquiryData({ ...inquiryData, buyerPhone: e.target.value })} className="form-input" required /></div>
              <div><label className="form-label">Message</label><textarea value={inquiryData.message} onChange={e => setInquiryData({ ...inquiryData, message: e.target.value })} className="form-input" rows="4" maxLength="300" placeholder="I'm interested in this listing..." required /></div>
              <div className="flex gap-3"><button type="button" onClick={() => setShowInquiryModal(false)} className="btn btn-secondary flex-1">Cancel</button><button type="submit" disabled={submitting} className="btn btn-primary flex-1">{submitting ? 'Sending...' : 'Send Inquiry'}</button></div>
            </form>
          </div>
        </div>
      )}

      {/* Verification Modal */}
      <VerificationModal 
        isOpen={showVerificationModal} 
        onClose={() => setShowVerificationModal(false)} 
        onSuccess={fetchVerificationStatus}
      />
    </div>
  );
};

export default ListingDetailPage;
