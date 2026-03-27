import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { FiMenu, FiX, FiUser, FiLogOut, FiSettings, FiList, FiMail, FiBriefcase, FiFileText, FiHome, FiShoppingBag, FiTool, FiUsers } from 'react-icons/fi';

const Header = () => {
  const { user, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  // Check if we are on the landing page
  const isLandingPage = location.pathname === '/';

  const handleLogout = () => { logout(); navigate('/'); };
  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  const toggleDropdown = () => setIsDropdownOpen(!isDropdownOpen);

  return (
    <header className="glass sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="flex items-center space-x-2 group">
            <div className="w-10 h-10 bg-gradient-to-br from-teal-400 to-emerald-500 rounded-xl flex items-center justify-center shadow-lg shadow-teal-500/20 group-hover:scale-105 transition-transform">
              <span className="text-white font-black text-xl">M</span>
            </div>
            <span className="text-xl font-black text-[#191c1e] tracking-tighter hide-mobile">MedBiz</span>
          </Link>

          <nav className="hidden md:flex items-center space-x-8">
            <div className="relative group">
              <button className="flex items-center space-x-1 text-[#3c4947] font-semibold hover:text-[#14B8A6] transition-colors tracking-tight"><span>Buy / Lease</span></button>
              <div className="absolute top-full left-0 mt-3 w-56 bg-white/90 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/20 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 transform translate-y-2 group-hover:translate-y-0 p-2">
                <Link to="/listings?category=1" className="block px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-teal-50 hover:text-teal-700 rounded-xl transition-colors">Hospitals</Link>
                <Link to="/listings?category=2" className="block px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-teal-50 hover:text-teal-700 rounded-xl transition-colors">Pharma Companies</Link>
                <Link to="/listings?category=3" className="block px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-teal-50 hover:text-teal-700 rounded-xl transition-colors">Diagnostics</Link>
              </div>
            </div>
            <div className="relative group">
              <button className="flex items-center space-x-1 text-[#3c4947] font-semibold hover:text-[#14B8A6] transition-colors tracking-tight"><span>Jobs</span></button>
              <div className="absolute top-full left-0 mt-3 w-56 bg-white/90 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/20 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 transform translate-y-2 group-hover:translate-y-0 p-2">
                <Link to="/jobs" className="block px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-teal-50 hover:text-teal-700 rounded-xl transition-colors">Find Jobs</Link>
                <Link to="/jobs/create" className="block px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-teal-50 hover:text-teal-700 rounded-xl transition-colors">Post a Job</Link>
              </div>
            </div>
          </nav>

          <div className="flex items-center space-x-4">
            {isAuthenticated ? (
              <>
                <Link to="/listings/create" className="btn btn-gradient text-xs py-2 px-5 hidden sm:flex font-bold uppercase tracking-wider rounded-xl">Post an Ad</Link>
                <div className="relative">
                  <button onClick={toggleDropdown} className="flex items-center space-x-2 focus:outline-none">
                    <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center border-2 border-white shadow-sm overflow-hidden">
                      {user?.profilePhotoUrl ? <img src={user.profilePhotoUrl} alt={user.fullName} className="w-10 h-10 rounded-full object-cover" /> : <span className="text-primary-600 font-medium">{user?.fullName?.charAt(0) || 'U'}</span>}
                    </div>
                    <div className="hidden md:block text-left mr-2">
                      <p className="text-sm font-bold text-gray-800 leading-tight">{user?.fullName?.split(' ')[0]}</p>
                      <p className="text-[10px] text-gray-500 uppercase font-black tracking-tighter"></p>
                    </div>
                  </button>
                  {isDropdownOpen && (
                    <div className="absolute right-0 mt-3 w-64 bg-white/95 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/20 py-2 z-50 transform origin-top-right transition-all animate-fadeIn">
                      <div className="px-4 py-3 border-b border-gray-100 mb-1">
                        <p className="text-xs text-gray-400 font-bold uppercase tracking-widest leading-none mb-1">Signed in as</p>
                        <p className="text-sm font-bold text-[#191c1e] truncate">{user?.fullName}</p>
                      </div>
                      <Link to="/dashboard" className="dropdown-item py-2.5 mx-2 rounded-xl" onClick={() => setIsDropdownOpen(false)}><FiHome size={16} />Dashboard</Link>
                      <Link to="/dashboard/listings" className="dropdown-item py-2.5 mx-2 rounded-xl" onClick={() => setIsDropdownOpen(false)}><FiList size={16} />My Listings</Link>
                      <Link to="/dashboard/inquiries" className="dropdown-item py-2.5 mx-2 rounded-xl" onClick={() => setIsDropdownOpen(false)}><FiMail size={16} />Inquiries</Link>
                      <Link to="/dashboard/jobs" className="dropdown-item py-2.5 mx-2 rounded-xl" onClick={() => setIsDropdownOpen(false)}><FiBriefcase size={16} />My Jobs</Link>
                      <Link to="/dashboard/applications" className="dropdown-item py-2.5 mx-2 rounded-xl" onClick={() => setIsDropdownOpen(false)}><FiFileText size={16} />Applications</Link>
                      <Link to="/dashboard/profile" className="dropdown-item py-2.5 mx-2 rounded-xl" onClick={() => setIsDropdownOpen(false)}><FiSettings size={16} />Profile Settings</Link>
                      {user?.roles?.includes('ADMIN') && <Link to="/admin" className="dropdown-item py-2.5 mx-2 rounded-xl text-teal-600 bg-teal-50" onClick={() => setIsDropdownOpen(false)}><FiUsers size={16} />Admin Panel</Link>}
                      <div className="border-t border-gray-100 my-1 pt-1">
                        <button onClick={handleLogout} className="dropdown-item py-2.5 mx-2 rounded-xl text-red-500 w-[calc(100%-1rem)]"><FiLogOut size={16} />Logout</button>
                      </div>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <div className="flex items-center space-x-3">
                <Link to="/login" className="text-sm font-bold text-[#3c4947] hover:text-[#14B8A6] px-4">Login</Link>
                <Link to="/register" className="btn btn-gradient text-xs py-2 px-5 font-bold uppercase tracking-wider rounded-xl">Sign Up</Link>
              </div>
            )}
            <button onClick={toggleMenu} className="md:hidden p-2 text-gray-600 hover:text-primary-500">
              {isMenuOpen ? <FiX size={24} /> : <FiMenu size={24} />}
            </button>
          </div>
        </div>

        {isMenuOpen && (
          <div className="md:hidden py-4 border-t">
            <nav className="flex flex-col space-y-2">
              <Link to="/listings" className="px-4 py-2 text-gray-600 hover:bg-gray-50 rounded-lg" onClick={() => setIsMenuOpen(false)}><FiShoppingBag className="inline mr-2" />Browse Listings</Link>
              <Link to="/jobs" className="px-4 py-2 text-gray-600 hover:bg-gray-50 rounded-lg" onClick={() => setIsMenuOpen(false)}><FiBriefcase className="inline mr-2" />Jobs</Link>
              {isAuthenticated && <Link to="/listings/create" className="btn btn-primary mx-4 mt-2" onClick={() => setIsMenuOpen(false)}>Post an Ad</Link>}
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
