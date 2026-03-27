import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { jobsAPI, masterAPI } from '../../services/api';
import { FiSearch, FiMapPin, FiFilter, FiBriefcase, FiDollarSign } from 'react-icons/fi';

const JobsPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [categories, setCategories] = useState([]);
  const [cities, setCities] = useState([]);
  const [showFilters, setShowFilters] = useState(false);
  const [pagination, setPagination] = useState({ page: 0, size: 10, totalElements: 0, totalPages: 0 });
  const [filters, setFilters] = useState({ 
    keyword: searchParams.get('keyword') || '', 
    categoryId: searchParams.get('category') || '', 
    cityId: '', 
    employmentType: '', 
    experienceLevel: '', 
    sortBy: 'createdAt', 
    sortDirection: 'desc' 
  });

  // Carousel State
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const carouselImages = [
    '/images/carousel/surgeon.png',
    '/images/carousel/nurse.png',
    '/images/carousel/lab.png'
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % carouselImages.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [carouselImages.length]);

  useEffect(() => {
    fetchMasterData();
  }, []);

  useEffect(() => {
    const keyword = searchParams.get('keyword') || '';
    const categoryId = searchParams.get('category') || '';
    
    setFilters(prev => ({
      ...prev,
      keyword,
      categoryId
    }));
  }, [searchParams]);

  useEffect(() => {
    fetchJobs();
  }, [filters, pagination.page]);

  const fetchMasterData = async () => {
    try {
      const [catRes, cityRes] = await Promise.all([masterAPI.getJobCategories(), masterAPI.getCities()]);
      setCategories(catRes.data.data || []);
      setCities(cityRes.data.data || []);
    } catch (error) { console.error('Error fetching master data:', error); }
  };

  const fetchJobs = async () => {
    setLoading(true);
    try {
      const params = { ...filters, page: pagination.page, size: pagination.size };
      Object.keys(params).forEach(key => { if (!params[key]) delete params[key]; });
      const response = await jobsAPI.getAll(params);
      const data = response.data.data;
      setJobs(data.content || []);
      setPagination(prev => ({ ...prev, totalElements: data.totalElements, totalPages: data.totalPages }));
    } catch (error) { console.error('Error fetching jobs:', error); }
    setLoading(false);
  };

  const handleFilterChange = (e) => { const { name, value } = e.target; setFilters(prev => ({ ...prev, [name]: value })); };
  const applyFilters = () => { setPagination(prev => ({ ...prev, page: 0 })); fetchJobs(); setShowFilters(false); };
  const clearFilters = () => { setFilters({ keyword: '', categoryId: '', cityId: '', employmentType: '', experienceLevel: '', sortBy: 'createdAt', sortDirection: 'desc' }); fetchJobs(); };

  return (
    <div className="min-h-screen bg-mesh">
      {/* Search & Hero Header with Carousel */}
      <div className="relative pt-44 pb-24 overflow-hidden min-h-[500px] flex items-center">
        {/* Background Carousel */}
        <div className="absolute inset-0 z-0">
          {carouselImages.map((img, idx) => (
            <div
              key={idx}
              className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
                idx === currentImageIndex ? 'opacity-100' : 'opacity-0'
              }`}
            >
              <img src={img} alt="" className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-r from-white via-white/80 to-white/20" />
            </div>
          ))}
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full">
          <div className="max-w-3xl">
            <div className="inline-block glass bg-teal-50/50 px-4 py-1.5 rounded-full text-teal-700 font-black text-[10px] uppercase tracking-[0.2em] mb-4 backdrop-blur-md">
               Elite Careers
            </div>
            <h1 className="text-4xl md:text-6xl font-black text-[#191c1e] tracking-tighter leading-none mb-8">
              Explore Institutional <span className="text-gradient">Opportunities</span>
            </h1>
            
            <div className="glass p-2 rounded-2xl shadow-xl flex flex-col md:flex-row gap-2 max-w-2xl bg-white/70 backdrop-blur-xl">
              <div className="flex-1 relative">
                <FiSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-teal-400 w-6 h-6" />
                <input 
                  type="text" 
                  name="keyword" 
                  value={filters.keyword} 
                  onChange={handleFilterChange} 
                  placeholder="Search elite roles (Surgeon, Nurse, MD)..." 
                  className="w-full pl-14 pr-4 py-4 bg-transparent text-[#191c1e] placeholder-[#3c4947]/40 text-lg rounded-xl focus:outline-none transition-all border-none" 
                  onKeyDown={(e) => e.key === 'Enter' && applyFilters()} 
                />
              </div>
              <button 
                onClick={applyFilters} 
                className="btn-gradient px-10 py-4 rounded-xl font-black text-xs uppercase tracking-widest shadow-xl shadow-teal-500/10"
              >
                Search
              </button>
            </div>

            <div className="mt-8 flex items-center gap-4">
              <button 
                onClick={() => setShowFilters(!showFilters)} 
                className={`glass px-6 py-3 rounded-xl flex items-center gap-3 font-bold text-sm transition-all border-none shadow-sm backdrop-blur-md ${showFilters ? 'bg-teal-500 text-white shadow-teal-200' : 'bg-white/80 text-[#191c1e] hover:bg-white'}`}
              >
                <FiFilter /> Filters 
                {(filters.categoryId || filters.cityId || filters.employmentType || filters.experienceLevel) && (
                  <span className="bg-emerald-400 text-white text-[10px] rounded-full w-5 h-5 flex items-center justify-center font-black animate-pulse">!</span>
                )}
              </button>
              <p className="text-[#3c4947] font-bold text-sm opacity-60">
                {pagination.totalElements} premium vacancies active
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="flex gap-6">
          {showFilters && (
            <div className="w-80 glass-card p-8 h-fit sticky top-24 z-20 overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-teal-500/5 rounded-bl-[100px] pointer-events-none" />
              <div className="flex justify-between items-center mb-8">
                <h3 className="text-xl font-black text-[#191c1e] tracking-tighter">Refine Search</h3>
                <button onClick={clearFilters} className="text-xs font-black text-teal-600 uppercase tracking-widest">Reset</button>
              </div>
              <div className="space-y-6">
                <div>
                  <label className="text-[10px] font-black text-[#3c4947] uppercase tracking-[0.2em] mb-2 block opacity-60">Field</label>
                  <select name="categoryId" value={filters.categoryId} onChange={handleFilterChange} className="w-full bg-[#f2f4f6] border-none rounded-xl px-4 py-3 text-sm font-bold text-[#191c1e] focus:ring-2 focus:ring-teal-500 transition-all cursor-pointer">
                    <option value="">All Segments</option>
                    {categories.map(cat => (<option key={cat.id} value={cat.id}>{cat.name}</option>))}
                  </select>
                </div>
                <div>
                  <label className="text-[10px] font-black text-[#3c4947] uppercase tracking-[0.2em] mb-2 block opacity-60">Location</label>
                  <select name="cityId" value={filters.cityId} onChange={handleFilterChange} className="w-full bg-[#f2f4f6] border-none rounded-xl px-4 py-3 text-sm font-bold text-[#191c1e] focus:ring-2 focus:ring-teal-500 transition-all cursor-pointer">
                    <option value="">All Regions</option>
                    {cities.map(city => (<option key={city.id} value={city.id}>{city.name}</option>))}
                  </select>
                </div>
                <div>
                  <label className="text-[10px] font-black text-[#3c4947] uppercase tracking-[0.2em] mb-2 block opacity-60">Structure</label>
                  <select name="employmentType" value={filters.employmentType} onChange={handleFilterChange} className="w-full bg-[#f2f4f6] border-none rounded-xl px-4 py-3 text-sm font-bold text-[#191c1e] focus:ring-2 focus:ring-teal-500 transition-all cursor-pointer">
                    <option value="">All Types</option>
                    <option value="FULL_TIME">Full Time</option>
                    <option value="PART_TIME">Part Time</option>
                    <option value="CONTRACT">Contract</option>
                    <option value="LOCUM">Locum</option>
                  </select>
                </div>
                <div>
                  <label className="text-[10px] font-black text-[#3c4947] uppercase tracking-[0.2em] mb-2 block opacity-60">Seniority</label>
                  <select name="experienceLevel" value={filters.experienceLevel} onChange={handleFilterChange} className="w-full bg-[#f2f4f6] border-none rounded-xl px-4 py-3 text-sm font-bold text-[#191c1e] focus:ring-2 focus:ring-teal-500 transition-all cursor-pointer">
                    <option value="">All Levels</option>
                    <option value="FRESHER">Fresher</option>
                    <option value="ONE_TO_THREE">1-3 Years</option>
                    <option value="THREE_TO_FIVE">3-5 Years</option>
                    <option value="FIVE_PLUS">5+ Years</option>
                  </select>
                </div>
                <button onClick={applyFilters} className="btn-gradient w-full py-4 rounded-xl font-black text-xs uppercase tracking-widest shadow-xl shadow-teal-500/10">Update Results</button>
              </div>
            </div>
          )}

          <div className="flex-1">
            {loading ? (
              <div className="space-y-6">
                {[1, 2, 3].map(i => (
                  <div key={i} className="glass-card p-8 h-40 skeleton" />
                ))}
              </div>
            ) : jobs.length === 0 ? (
              <div className="glass-card p-24 text-center relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-teal-50/50 to-emerald-50/50 -z-10" />
                <FiBriefcase className="w-20 h-20 text-teal-300 mx-auto mb-8 animate-pulse" />
                <h3 className="text-3xl font-black text-[#191c1e] tracking-tighter mb-4 leading-none">Global Standards Met</h3>
                <p className="text-lg text-[#3c4947] font-medium opacity-60 mb-8 max-w-sm mx-auto">
                   Elite roles are exclusive. Your criteria didn't match current institutional needs.
                </p>
                <button onClick={clearFilters} className="btn-gradient px-10 py-4 rounded-xl font-black text-xs uppercase tracking-widest">
                  Reset Paramenters
                </button>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {jobs.map(job => (
                    <Link key={job.id} to={`/jobs/${job.id}`} className="hover-3d group block">
                      <div className="glass-card hover-3d-child p-8 h-full relative overflow-hidden group flex flex-col">
                        <div className="mb-6 flex-1">
                          <div className="flex items-center gap-3 mb-4">
                            <span className="glass bg-teal-500/10 text-teal-600 text-[10px] font-black uppercase tracking-[0.2em] px-2 py-1 rounded">
                              {job.categoryName}
                            </span>
                            <span className="text-[#3c4947] text-[10px] font-bold opacity-40 lowercase tracking-tight">
                              {new Date(job.createdAt).toLocaleDateString()}
                            </span>
                          </div>
                          <h3 className="text-xl font-black text-[#191c1e] tracking-tighter group-hover:text-teal-600 transition-colors leading-tight mb-4 line-clamp-2">
                            {job.title}
                          </h3>
                          <p className="text-xs font-bold text-[#3c4947] opacity-60">
                            {job.employerCompany || job.employerName}
                          </p>
                        </div>

                        <div className="space-y-4 pt-6 border-t border-[#f2f4f6]">
                          <div className="flex items-center justify-between">
                            <span className="text-[10px] font-black text-[#3c4947] opacity-40 uppercase tracking-widest">Compensation</span>
                            <span className="text-lg font-black text-[#191c1e] tracking-tighter">
                              ₹{job.salaryMinLpa} - {job.salaryMaxLpa} <span className="text-[10px] opacity-50 ml-1">LPA</span>
                            </span>
                          </div>
                          <div className="flex flex-wrap gap-2">
                            <span className="flex items-center gap-1.5 text-[10px] font-black text-[#3c4947] bg-[#f2f4f6] px-3 py-1.5 rounded-lg uppercase tracking-wider">
                              <FiMapPin className="text-teal-500" /> {job.cityName}
                            </span>
                            <span className="flex items-center gap-1.5 text-[10px] font-black text-teal-700 bg-teal-50 px-3 py-1.5 rounded-lg uppercase tracking-wider">
                              <FiBriefcase className="text-teal-500" /> {job.employmentType?.replace('_', ' ')}
                            </span>
                          </div>
                          <div className="text-[10px] font-black text-emerald-700 bg-emerald-50 px-3 py-2 rounded-lg uppercase tracking-wider text-center">
                            Exp: {job.experienceRequired?.replace('_', ' ')}
                          </div>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default JobsPage;
