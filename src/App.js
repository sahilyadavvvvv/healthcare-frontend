import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';

// Layout Components
import Header from './components/layout/Header';
import Footer from './components/layout/Footer';

// Main Pages
import HomePage from './pages/home/HomePage';
import LoginPage from './pages/auth/LoginPage';
import RegisterPage from './pages/auth/RegisterPage';
import ForgotPasswordPage from './pages/auth/ForgotPasswordPage';
import ResetPasswordPage from './pages/auth/ResetPasswordPage';
import ListingsPage from './pages/marketplace/ListingsPage';
import ListingDetailPage from './pages/marketplace/ListingDetailPage';
import CreateListingPage from './pages/marketplace/CreateListingPage';
import JobsPage from './pages/jobs/JobsPage';
import JobDetailPage from './pages/jobs/JobDetailPage';
import CreateJobPage from './pages/jobs/CreateJobPage';
import DashboardPage from './pages/dashboard/DashboardPage';

// Admin Pages
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminListingsPage from './pages/admin/AdminListingsPage';
import AdminJobsPage from './pages/admin/AdminJobsPage';
import AdminUsersPage from './pages/admin/AdminUsersPage';
import AdminVerificationsPage from './pages/admin/AdminVerificationsPage';

// Additional Pages (remaining placeholders)
import {
  MyListingsPage,
  MyInquiriesPage,
  MyJobsPage,
  MyApplicationsPage,
  ProfilePage
} from './pages/RemainingPages';

// Context
import { AuthProvider } from './context/AuthContext';

function App() {
  return (
    <Router>
      <div className="min-h-screen flex flex-col bg-gray-50">
        <Toaster 
          position="top-right"
          toastOptions={{
            duration: 4000,
            style: {
              background: '#363636',
              color: '#fff',
            },
          }}
        />
        <Header />
        <main className="flex-grow">
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<HomePage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/forgot-password" element={<ForgotPasswordPage />} />
            <Route path="/reset-password" element={<ResetPasswordPage />} />
            
            {/* Marketplace Routes */}
            <Route path="/listings" element={<ListingsPage />} />
            <Route path="/listings/:id" element={<ListingDetailPage />} />
            <Route path="/listings/create" element={<CreateListingPage />} />
            <Route path="/listings/:id/edit" element={<CreateListingPage />} />
            
            {/* Jobs Routes */}
            <Route path="/jobs" element={<JobsPage />} />
            <Route path="/jobs/:id" element={<JobDetailPage />} />
            <Route path="/jobs/create" element={<CreateJobPage />} />
            <Route path="/jobs/:id/edit" element={<CreateJobPage />} />
            
            {/* Dashboard Routes */}
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/dashboard/listings" element={<MyListingsPage />} />
            <Route path="/dashboard/inquiries" element={<MyInquiriesPage />} />
            <Route path="/dashboard/jobs" element={<MyJobsPage />} />
            <Route path="/dashboard/applications" element={<MyApplicationsPage />} />
            <Route path="/dashboard/profile" element={<ProfilePage />} />
            
            {/* Admin Routes */}
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="/admin/listings" element={<AdminListingsPage />} />
            <Route path="/admin/jobs" element={<AdminJobsPage />} />
            <Route path="/admin/users" element={<AdminUsersPage />} />
            <Route path="/admin/verifications" element={<AdminVerificationsPage />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
