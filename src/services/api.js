import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL 
  ? `${process.env.REACT_APP_API_URL}/api` 
  : 'http://localhost:8080/api';

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('accessToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle token refresh
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      
      try {
        const refreshToken = localStorage.getItem('refreshToken');
        if (refreshToken) {
          const response = await axios.post(`${API_BASE_URL}/auth/refresh-token`, {
            refreshToken
          });
          
          const { accessToken, refreshToken: newRefreshToken } = response.data.data;
          localStorage.setItem('accessToken', accessToken);
          localStorage.setItem('refreshToken', newRefreshToken);
          
          originalRequest.headers.Authorization = `Bearer ${accessToken}`;
          return api(originalRequest);
        }
      } catch (refreshError) {
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        localStorage.removeItem('user');
        window.location.href = '/login';
      }
    }
    
    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  login: (credentials) => api.post('/auth/login', credentials),
  register: (userData) => api.post('/auth/register', userData),
  sendOtp: (email) => api.post('/auth/send-otp', { email }),
  verifyOtpRegister: (data) => api.post('/auth/verify-otp-register', data),
  refreshToken: (refreshToken) => api.post('/auth/refresh-token', { refreshToken }),
  forgotPassword: (email) => api.post('/auth/forgot-password', { email }),
  resetPassword: (data) => api.post('/auth/reset-password', data),
  getCurrentUser: () => api.get('/auth/me'),
};

// User API
export const userAPI = {
  getProfile: () => api.get('/users/profile'),
  updateProfile: (data) => api.put('/users/profile', data),
  changePassword: (data) => api.put('/users/password', data),
  updateProfilePhoto: (photoUrl) => api.put('/users/profile-photo', null, { params: { photoUrl } }),
  getVerificationStatus: () => api.get('/users/verification'),
  submitVerification: (data) => api.post('/users/verification', data),
};

// Listings API
export const listingsAPI = {
  getAll: (params) => api.get('/listings', { params }),
  getFeatured: () => api.get('/listings/featured'),
  getById: (id) => api.get(`/listings/${id}`),
  getByCategory: (categoryId, params) => api.get(`/listings/category/${categoryId}`, { params }),
  getMy: (params) => api.get('/listings/my', { params }),
  create: (data) => api.post('/listings', data),
  update: (id, data) => api.put(`/listings/${id}`, data),
  delete: (id) => api.delete(`/listings/${id}`),
};

// Jobs API
export const jobsAPI = {
  getAll: (params) => api.get('/jobs', { params }),
  getFeatured: () => api.get('/jobs/featured'),
  getById: (id) => api.get(`/jobs/${id}`),
  getMy: (params) => api.get('/jobs/my', { params }),
  create: (data) => api.post('/jobs', data),
  update: (id, data) => api.put(`/jobs/${id}`, data),
  delete: (id) => api.delete(`/jobs/${id}`),
  apply: (jobId, data) => api.post(`/jobs/${jobId}/apply`, data, { headers: { 'Content-Type': 'multipart/form-data' } }),
  getApplications: (jobId, params) => api.get(`/jobs/${jobId}/applications`, { params }),
  getMyApplications: (params) => api.get('/jobs/applications/my', { params }),
  getReceivedApplications: (params) => api.get('/jobs/applications/received', { params }),
  updateApplicationStatus: (applicationId, status) => 
    api.put(`/jobs/applications/${applicationId}/status`, null, { params: { status } }),
};

// Inquiries API
export const inquiriesAPI = {
  create: (listingId, data) => api.post(`/inquiries/listing/${listingId}`, data),
  getReceived: (params) => api.get('/inquiries/received', { params }),
  getSent: (params) => api.get('/inquiries/sent', { params }),
  getById: (id) => api.get(`/inquiries/${id}`),
  updateStatus: (id, status) => api.put(`/inquiries/${id}/status`, null, { params: { status } }),
  markAsRead: (id) => api.put(`/inquiries/${id}/read`),
};

// Master Data API
export const masterAPI = {
  getStates: () => api.get('/master/states'),
  getCities: () => api.get('/master/cities'),
  getCitiesWithListings: () => api.get('/master/cities/with-listings'),
  getCitiesByState: (stateId) => api.get(`/master/states/${stateId}/cities`),
  searchCities: (name) => api.get('/master/cities/search', { params: { name } }),
  getCategories: () => api.get('/master/categories'),
  getDealTypes: (categoryId) => api.get(`/master/categories/${categoryId}/deal-types`),
  getJobCategories: () => api.get('/master/job-categories'),
  getHospitalTypes: () => api.get('/master/hospital-types'),
};

// Admin API
export const adminAPI = {
  getDashboardStats: () => api.get('/admin/dashboard'),
  getListingStats: () => api.get('/admin/listings/stats'),
  getUserStats: () => api.get('/admin/users/stats'),
  getUsers: (params) => api.get('/admin/users', { params }),
  getListings: (params) => api.get('/admin/listings', { params }),
  getListingById: (id) => api.get(`/admin/listings/${id}`),
  editListing: (id, data) => api.put(`/admin/listings/${id}`, data),
  approveListing: (id) => api.post(`/admin/listings/${id}/approve`),
  rejectListing: (id, reason) => api.post(`/admin/listings/${id}/reject`, { rejectionReason: reason }),
  deleteListing: (id) => api.delete(`/admin/listings/${id}`),
  featureListing: (id, days) => api.post(`/admin/listings/${id}/feature`, null, { params: { days } }),
  getJobs: (params) => api.get('/admin/jobs', { params }),
  approveJob: (id) => api.post(`/admin/jobs/${id}/approve`),
  rejectJob: (id, reason) => api.post(`/admin/jobs/${id}/reject`, { rejectionReason: reason }),
  deleteJob: (id) => api.delete(`/admin/jobs/${id}`),

  // Verification Management
  getVerifications: (params) => api.get('/admin/verifications', { params }),
  approveVerification: (id) => api.post(`/admin/verifications/${id}/approve`),
  rejectVerification: (id, reason) => api.post(`/admin/verifications/${id}/reject`, { rejectionReason: reason }),
  getUserDetails: (userId) => api.get(`/admin/users/${userId}`),
  changeUserRole: (userId, data) => api.put(`/admin/users/${userId}/roles`, data),
  suspendUser: (userId, reason) => api.post(`/admin/users/${userId}/suspend`, { reason }),
  activateUser: (userId) => api.post(`/admin/users/${userId}/activate`),
  deleteUser: (userId) => api.delete(`/admin/users/${userId}`),
};

export const mediaAPI = {
  upload: (file) => {
    const formData = new FormData();
    formData.append('file', file);
    return api.post('/listings/media/upload', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
  },
  uploadMultiple: (files) => {
    const formData = new FormData();
    Array.from(files).forEach(file => formData.append('files', file));
    return api.post('/listings/media/upload-multiple', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
  }
};

export default api;
