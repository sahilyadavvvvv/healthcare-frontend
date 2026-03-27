import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-gray-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-1 md:col-span-1">
            <div className="flex items-center space-x-2 mb-4">
              <div className="w-10 h-10 bg-primary-500 rounded-lg flex items-center justify-center"><span className="text-white font-bold text-xl">M</span></div>
              <span className="text-xl font-bold text-white">MedBiz</span>
            </div>
            <p className="text-sm text-gray-400 mb-4">India's premier healthcare business marketplace. Buy, sell, and lease healthcare businesses and find healthcare jobs.</p>
          </div>
          <div>
            <h3 className="text-white font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li><Link to="/listings?category=1" className="text-sm hover:text-primary-400 transition-colors">Hospitals for Sale</Link></li>
              <li><Link to="/listings?category=2" className="text-sm hover:text-primary-400 transition-colors">Pharma Companies</Link></li>
              <li><Link to="/listings?category=3" className="text-sm hover:text-primary-400 transition-colors">Diagnostic Centers</Link></li>
              <li><Link to="/jobs" className="text-sm hover:text-primary-400 transition-colors">Healthcare Jobs</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="text-white font-semibold mb-4">For Sellers</h3>
            <ul className="space-y-2">
              <li><Link to="/listings/create" className="text-sm hover:text-primary-400 transition-colors">Post a Listing</Link></li>
              <li><Link to="/register" className="text-sm hover:text-primary-400 transition-colors">Create Account</Link></li>
              <li><Link to="/jobs/create" className="text-sm hover:text-primary-400 transition-colors">Post a Job</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="text-white font-semibold mb-4">Support</h3>
            <ul className="space-y-2">
              <li><a href="#" className="text-sm hover:text-primary-400 transition-colors">Help Center</a></li>
              <li><a href="#" className="text-sm hover:text-primary-400 transition-colors">Contact Us</a></li>
              <li><a href="#" className="text-sm hover:text-primary-400 transition-colors">Privacy Policy</a></li>
              <li><a href="#" className="text-sm hover:text-primary-400 transition-colors">Terms of Service</a></li>
            </ul>
          </div>
        </div>
        <div className="border-t border-gray-800 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-sm text-gray-400">© {new Date().getFullYear()} MedBiz Marketplace. All rights reserved.</p>
          <p className="text-sm text-gray-400 mt-2 md:mt-0">Made with ❤️ for Healthcare Industry</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
