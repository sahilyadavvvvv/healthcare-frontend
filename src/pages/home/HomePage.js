import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { listingsAPI, jobsAPI, masterAPI } from '../../services/api';
import { 
  FiSearch, 
  FiMapPin, 
  FiDollarSign, 
  FiActivity, 
  FiTool, 
  FiBriefcase,
  FiChevronRight,
  FiStar
} from 'react-icons/fi';

const HomePage = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [featuredListings, setFeaturedListings] = useState([]);
  const [featuredJobs, setFeaturedJobs] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentSlide, setCurrentSlide] = useState(0);

  const carouselImages = [
    'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&q=80&w=2000', // Modern Hospital
    'https://images.unsplash.com/photo-1576091160550-217359f42f8c?auto=format&fit=crop&q=80&w=2000', // Medical Tech
    'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&q=80&w=2000'  // Healthcare Profs
  ];

  useEffect(() => {
    fetchInitialData();
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % carouselImages.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const fetchInitialData = async () => {
    try {
      const [listingsRes, jobsRes, categoriesRes] = await Promise.all([
        listingsAPI.getFeatured(),
        jobsAPI.getFeatured(),
        masterAPI.getCategories()
      ]);
      
      setFeaturedListings(listingsRes.data.data || []);
      setFeaturedJobs(jobsRes.data.data || []);
      setCategories(categoriesRes.data.data || []);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    const query = searchQuery.trim();
    if (!query) return;

    // Smart Search: Check if the query matches a category name (case-insensitive)
    const matchedCategory = categories.find(c => 
      c.name.toLowerCase() === query.toLowerCase() || 
      query.toLowerCase().includes(c.name.toLowerCase().replace(' companies', ''))
    );

    if (matchedCategory) {
      navigate(`/listings?category=${matchedCategory.id}`);
    } else {
      navigate(`/listings?keyword=${encodeURIComponent(query)}`);
    }
  };

  const formatPrice = (price) => {
    if (price >= 10000000) {
      return `₹${(price / 10000000).toFixed(1)} Cr`;
    } else if (price >= 100000) {
      return `₹${(price / 100000).toFixed(1)} L`;
    }
    return `₹${price?.toLocaleString()}`;
  };

  const categoryIcons = {
    'Hospitals': FiActivity,
    'Pharma Companies': FiActivity,
    'Diagnostics': FiActivity
  };

  return (
    <div className="min-h-screen bg-mesh">
      {/* Hero Section with Carousel */}
      <section className="relative h-[600px] overflow-hidden">
        {/* Background Carousel */}
        <div className="absolute inset-0 z-0">
          {carouselImages.map((img, index) => (
            <div
              key={index}
              className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
                index === currentSlide ? 'opacity-100' : 'opacity-0'
              }`}
            >
              <div 
                className="absolute inset-0 bg-cover bg-center animate-carousel"
                style={{ backgroundImage: `url(${img})` }}
              />
              <div className="absolute inset-0 bg-gradient-to-r from-primary-900/80 to-transparent" />
            </div>
          ))}
        </div>

        {/* Hero Content */}
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full flex flex-col justify-center">
          <div className="max-w-3xl hover-3d">
            <div className="hover-3d-child">
              <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight">
                India's <span className="text-secondary">Premier</span>
                <br /> Healthcare Marketplace
              </h1>
              <p className="text-xl text-primary-100 mb-10 max-w-2xl drop-shadow-lg">
                The Digital Architect for healthcare professionals. Buy, sell, lease, and hire within India's most trusted ecosystem.
              </p>

              {/* Glassmorphic Search Bar */}
              <div className="glass p-2 rounded-2xl shadow-2xl max-w-2xl">
                <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-2">
                  <div className="flex-1 relative">
                    <FiSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-primary-400 w-6 h-6" />
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Search hospitals, labs, pharma..."
                      className="w-full pl-14 pr-4 py-4 bg-white/10 text-white placeholder-primary-200 text-lg rounded-xl focus:outline-none focus:bg-white/20 transition-all"
                    />
                  </div>
                  <button
                    type="submit"
                    className="bg-secondary hover:bg-secondary-600 text-primary-900 px-10 py-4 rounded-xl font-bold text-lg transition-all transform hover:scale-105 active:scale-95 shadow-lg"
                  >
                    Explore
                  </button>
                </form>
              </div>

              <div className="flex flex-wrap gap-3 mt-8">
                {['Hospitals', 'Diagnostics', 'Pharma Companies'].map((tag) => (
                  <button 
                    key={tag}
                    onClick={() => navigate(`/listings?keyword=${encodeURIComponent(tag)}`)}
                    className="glass px-4 py-2 rounded-full text-sm text-white hover:bg-white/20 cursor-pointer transition-all border-none"
                  >
                    {tag}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Floating Decorative Elements */}
        <div className="absolute top-20 right-[10%] w-32 h-32 glass rounded-3xl float-3d opacity-20 hidden md:block" />
        <div className="absolute bottom-20 right-[20%] w-20 h-20 glass rounded-full float-3d opacity-10 hidden md:block" style={{ animationDelay: '2s' }} />
      </section>

      {/* Categories Section */}
      <section className="py-24 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4 tracking-tight">Browse by Specialized Category</h2>
            <div className="h-1 w-20 bg-secondary mx-auto rounded-full" />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {categories.map((category) => {
              const IconComponent = categoryIcons[category.name] || FiActivity;
              return (
                <Link
                  key={category.id}
                  to={`/listings?category=${category.id}`}
                  className="hover-3d group"
                >
                  <div className="glass-card p-10 h-full hover-3d-child relative overflow-hidden group">
                    <div className="absolute -right-6 -top-6 w-32 h-32 bg-gradient-to-br from-teal-400/10 to-emerald-500/10 rounded-full group-hover:from-teal-400/20 group-hover:to-emerald-500/20 transition-all duration-700 blur-2xl" />
                    <div className="w-20 h-20 bg-[#f2f4f6] rounded-3xl flex items-center justify-center mb-8 shadow-sm group-hover:bg-gradient-to-br group-hover:from-teal-400 group-hover:to-emerald-500 group-hover:shadow-xl group-hover:shadow-teal-500/20 transition-all duration-500 transform group-hover:-rotate-6">
                      <IconComponent className="w-10 h-10 text-[#14B8A6] group-hover:text-white transition-colors" />
                    </div>
                    <h3 className="text-2xl font-black text-[#191c1e] mb-4 tracking-tighter group-hover:text-[#10B981] transition-colors leading-none">
                      {category.name}
                    </h3>
                    <p className="text-[#3c4947] text-base leading-relaxed line-clamp-2 font-medium opacity-80">
                      {category.description || 'Institutional-grade healthcare opportunities and strategic placement.'}
                    </p>
                    <div className="mt-8 flex items-center text-[#14B8A6] font-bold text-sm uppercase tracking-widest gap-2 opacity-0 group-hover:opacity-100 transition-all transform translate-y-2 group-hover:translate-y-0">
                      Explore Segment <FiChevronRight className="group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* Featured Listings - Glass Cards */}
      <section className="py-24 bg-primary-900/5 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-end mb-16">
            <div>
              <h2 className="text-4xl font-bold text-gray-900 mb-2">Exclusive Opportunities</h2>
              <p className="text-gray-500">Hand-picked premium healthcare businesses for you.</p>
            </div>
            <Link 
              to="/listings" 
              className="px-6 py-3 glass-card bg-white text-primary-600 font-bold hover:bg-primary-50 transition-all flex items-center gap-2"
            >
              Explore All <FiChevronRight />
            </Link>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[1, 2, 3].map((i) => (
                <div key={i} className="glass-card h-96 skeleton" />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {featuredListings.map((listing) => (
                <Link
                  key={listing.id}
                  to={`/listings/${listing.id}`}
                  className="hover-3d"
                >
                  <div className="glass-card hover-3d-child h-full">
                    <div className="relative h-56 overflow-hidden rounded-t-xl">
                      {listing.primaryImage ? (
                        <img
                          src={listing.primaryImage}
                          alt={listing.displayTitle}
                          className="w-full h-full object-cover transform scale-110 group-hover:scale-125 transition-transform duration-700"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-primary-50">
                          <FiActivity className="w-16 h-16 text-primary-200" />
                        </div>
                      )}
                      <div className="absolute top-4 left-4 flex gap-2">
                        {listing.isConfidential && (
                          <span className="glass bg-yellow-500/90 text-white text-[10px] uppercase tracking-widest px-3 py-1 rounded-full font-bold">
                            Confidential
                          </span>
                        )}
                        <span className="glass bg-primary-600/90 text-white text-[10px] uppercase tracking-widest px-3 py-1 rounded-full font-bold">
                          {listing.dealTypeName}
                        </span>
                      </div>
                    </div>
                    <div className="p-6">
                      <div className="flex items-center gap-2 mb-3">
                        <span className="text-secondary font-bold text-xs uppercase tracking-tighter">
                          {listing.categoryName}
                        </span>
                        <span className="w-1 h-1 bg-gray-300 rounded-full" />
                        <span className="text-gray-400 text-xs font-medium">
                          <FiMapPin className="inline mr-1" />{listing.cityName}
                        </span>
                      </div>
                      <h3 className="text-lg font-bold text-gray-800 mb-4 line-clamp-1 group-hover:text-primary-600 transition-colors">
                        {listing.displayTitle}
                      </h3>
                      <div className="flex items-center justify-between mt-auto">
                        <div className="text-2xl font-black text-primary-600">
                          {formatPrice(listing.askingPrice)}
                        </div>
                        <button className="w-10 h-10 glass-card bg-primary-50 text-primary-600 rounded-full flex items-center justify-center hover:bg-primary-500 hover:text-white transition-all">
                          <FiChevronRight className="w-6 h-6" />
                        </button>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>
      {/* How It Works - Glass Steps */}
      <section className="py-24 bg-white relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Strategic Workflow</h2>
            <p className="text-gray-500">How we facilitate high-value healthcare transactions.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {[
              { id: 1, title: 'Asset Curation', desc: 'Detail your hospital or pharma unit for our global network.' },
              { id: 2, title: 'Strategic Matching', desc: 'Our algorithm connects you with pre-verified institutional investors.' },
              { id: 3, title: 'Secure Closure', desc: 'Navigate negotiations and close deals with our secure advisory layer.' }
            ].map((step) => (
              <div key={step.id} className="text-center hover-3d">
                <div className="hover-3d-child">
                  <div className="w-24 h-24 glass-card bg-primary-50 rounded-full flex items-center justify-center mx-auto mb-8 relative">
                    <span className="text-4xl font-black text-primary-600">{step.id}</span>
                    <div className="absolute inset-0 rounded-full border-2 border-dashed border-secondary/30" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-800 mb-4">{step.title}</h3>
                  <p className="text-gray-500 leading-relaxed">{step.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Elite Healthcare Careers - Modern Redesign */}
      <section className="py-24 bg-[#f7f9fb] relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-8">
            <div className="max-w-2xl">
              <div className="inline-block glass bg-teal-50 px-4 py-1.5 rounded-full text-teal-700 font-black text-[10px] uppercase tracking-[0.2em] mb-4">
                Placements & Careers
              </div>
              <h2 className="text-4xl md:text-5xl font-black text-[#191c1e] tracking-tighter leading-none mb-4">
                Elite Healthcare Careers
              </h2>
              <p className="text-lg text-[#3c4947] font-medium opacity-70">
                Direct access to institutional openings and leadership roles in the medical sector.
              </p>
            </div>
            <Link 
              to="/jobs" 
              className="group flex items-center gap-3 bg-white px-8 py-4 rounded-2xl shadow-ambient hover:shadow-xl transition-all font-bold text-[#191c1e]"
            >
              Explore All Vacancies 
              <div className="w-8 h-8 bg-teal-50 rounded-full flex items-center justify-center group-hover:bg-teal-500 group-hover:text-white transition-all">
                <FiChevronRight />
              </div>
            </Link>
          </div>

          {/* New: Top Healthcare Roles Grid */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-16">
            {[
              { id: 'doctors', title: 'Doctors', count: '120+', icon: FiActivity },
              { id: 'nursing', title: 'Nursing', count: '85+', icon: FiActivity },
              { id: 'admin', title: 'Healthcare Admin', count: '42+', icon: FiBriefcase },
              { id: 'specialist', title: 'Specialists', count: '64+', icon: FiTool }
            ].map((role) => (
              <div key={role.id} className="glass-card p-6 flex items-center justify-between group hover:bg-teal-50/50 transition-colors">
                <div>
                  <p className="text-2xl font-black text-[#191c1e] tracking-tighter">{role.count}</p>
                  <p className="text-sm font-bold text-[#3c4947] opacity-60">{role.title}</p>
                </div>
                <div className="w-12 h-12 bg-[#f2f4f6] rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                  <role.icon className="text-teal-600 w-5 h-5" />
                </div>
              </div>
            ))}
          </div>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {[1, 2].map((i) => (
                <div key={i} className="glass-card h-48 skeleton" />
              ))}
            </div>
          ) : featuredJobs.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {featuredJobs.map((job) => (
                <Link
                  key={job.id}
                  to={`/jobs/${job.id}`}
                  className="hover-3d group"
                >
                  <div className="glass-card hover-3d-child p-8 relative overflow-hidden">
                    <div className="absolute right-0 top-0 w-32 h-32 bg-teal-500/5 rounded-bl-[100px] group-hover:bg-teal-500/10 transition-all pointer-events-none" />
                    <div className="flex justify-between items-start mb-6">
                      <div className="flex-1">
                        <h3 className="text-2xl font-black text-[#191c1e] mb-1 tracking-tighter group-hover:text-teal-600 transition-colors leading-tight">{job.title}</h3>
                        <p className="text-[#10B981] font-bold text-sm tracking-tight">{job.employerCompany || job.employerName}</p>
                      </div>
                      <span className="glass bg-[#f2f4f6] text-[#3c4947] text-[10px] uppercase font-black tracking-[0.2em] px-3 py-1.5 rounded-lg border-none shadow-sm">
                        {job.categoryName}
                      </span>
                    </div>
                    <div className="flex flex-wrap gap-6 text-sm font-bold text-[#3c4947] opacity-60 mb-8 lowercase tracking-tight">
                      <span className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-teal-400" /> {job.cityName}
                      </span>
                      <span className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-emerald-400" /> {job.employmentType?.replace('_', ' ')}
                      </span>
                    </div>
                    <div className="flex justify-between items-center pt-8 border-t border-[#f2f4f6]">
                      <div className="flex items-baseline gap-1">
                        <span className="text-xs font-bold text-[#3c4947] opacity-40 uppercase tracking-widest leading-none">p.a.</span>
                        <span className="text-2xl font-black text-[#191c1e] tracking-tighter">
                          ₹{job.salaryMinLpa} - {job.salaryMaxLpa}L
                        </span>
                      </div>
                      <button className="btn-gradient px-8 py-3 rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl shadow-teal-500/10">
                        Apply Now
                      </button>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="glass-card p-12 text-center relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-teal-50/50 to-emerald-50/50 -z-10" />
              <div className="w-20 h-20 bg-white rounded-3xl shadow-ambient mx-auto mb-8 flex items-center justify-center">
                <FiBriefcase className="text-teal-500 w-10 h-10" />
              </div>
              <h3 className="text-3xl font-black text-[#191c1e] tracking-tighter mb-4 leading-none">Premium Opportunities Coming Soon</h3>
              <p className="text-lg text-[#3c4947] font-medium opacity-60 mb-8 max-w-xl mx-auto">
                We're currently vetting elite medical placements. Check back shortly for institutional-grade career transitions.
              </p>
              <button 
                onClick={() => navigate('/jobs')}
                className="btn-gradient px-10 py-4 rounded-2xl font-black text-sm uppercase tracking-widest inline-flex items-center gap-3"
              >
                Search All Openings <FiChevronRight />
              </button>
            </div>
          )}
        </div>
      </section>

      {/* Trust & CTA Section */}
      <section className="py-24 bg-primary-900 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-secondary via-transparent to-transparent" />
        </div>
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <div className="inline-block glass bg-white/10 px-6 py-2 rounded-full text-secondary font-bold text-sm mb-8 tracking-widest uppercase">
            Start Your Journey
          </div>
          <h2 className="text-5xl md:text-6xl font-bold text-white mb-8">
            The World's Safest <span className="text-gradient">Healthcare</span> Market
          </h2>
          <p className="text-xl text-primary-100 mb-12 max-w-2xl mx-auto leading-relaxed">
            Join 5,000+ verified professionals. Experience institutional-grade security for your healthcare business transitions.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-6">
            <Link to="/register" className="glass bg-secondary px-10 py-5 rounded-2xl text-primary-900 font-bold text-xl hover:bg-secondary-600 transition-all transform hover:scale-105 active:scale-95 shadow-2xl">
              Create Partner ID
            </Link>
            <Link to="/listings/create" className="glass px-10 py-5 rounded-2xl text-white font-bold text-xl hover:bg-white/10 transition-all border-white/20">
              List Your Business
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
