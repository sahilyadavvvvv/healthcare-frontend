import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { authAPI } from '../../services/api';
import { FiLock, FiEye, FiEyeOff, FiCheck, FiX, FiCheckCircle } from 'react-icons/fi';
import toast from 'react-hot-toast';

const ResetPasswordPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [formData, setFormData] = useState({ newPassword: '', confirmPassword: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  
  // Extract email and otp from URL search params
  const queryParams = new URLSearchParams(location.search);
  const email = queryParams.get('email');
  const otp = queryParams.get('otp');

  useEffect(() => {
    if (!email || !otp) {
      toast.error('Invalid password reset link');
      navigate('/login');
    }
  }, [email, otp, navigate]);

  const validatePassword = (pass) => {
    const minLength = pass.length >= 8;
    const hasUpper = /[A-Z]/.test(pass);
    const hasLower = /[a-z]/.test(pass);
    const hasNumber = /[0-9]/.test(pass);
    return { minLength, hasUpper, hasLower, hasNumber };
  };

  const passwordStrength = validatePassword(formData.newPassword);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!passwordStrength.minLength || !passwordStrength.hasUpper || !passwordStrength.hasLower || !passwordStrength.hasNumber) {
      toast.error('Please meet all password requirements');
      return;
    }

    if (formData.newPassword !== formData.confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }

    setLoading(true);
    try {
      await authAPI.resetPassword({
        email,
        otp,
        newPassword: formData.newPassword
      });
      setSuccess(true);
      toast.success('Password changed successfully!');
      setTimeout(() => navigate('/login'), 5000);
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to reset password. The link may have expired.';
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
        <div className="max-w-md w-full bg-white p-10 rounded-2xl shadow-2xl border border-gray-100 text-center animate-fadeIn">
          <div className="mx-auto flex items-center justify-center h-20 w-20 rounded-full bg-green-100 mb-6">
            <FiCheckCircle className="h-12 w-12 text-green-600" />
          </div>
          <h2 className="text-3xl font-extrabold text-gray-900 mb-2">Success!</h2>
          <p className="text-gray-600 mb-8">
            Your password has been reset successfully. You can now use your new password to sign in.
          </p>
          <p className="text-sm text-gray-400 mb-4">Redirecting you to login page in 5 seconds...</p>
          <Link to="/login" className="btn btn-primary w-full py-4 rounded-xl text-lg font-bold shadow-lg shadow-primary-200">
            Sign In Now
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <h2 className="text-3xl font-extrabold text-gray-900">Set new password</h2>
          <p className="mt-2 text-sm text-gray-600">
            Resetting password for <span className="font-bold text-gray-900">{email}</span>
          </p>
        </div>

        <div className="bg-white p-8 rounded-2xl shadow-xl border border-gray-100">
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">New Password</label>
                <div className="relative rounded-md shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FiLock className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={formData.newPassword}
                    onChange={(e) => setFormData({ ...formData, newPassword: e.target.value })}
                    className="block w-full pl-10 pr-10 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 sm:text-sm transition-all"
                    placeholder="••••••••"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? <FiEyeOff className="h-5 w-5" /> : <FiEye className="h-5 w-5" />}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Confirm New Password</label>
                <div className="relative rounded-md shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FiLock className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="password"
                    required
                    value={formData.confirmPassword}
                    onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                    className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 sm:text-sm transition-all"
                    placeholder="••••••••"
                  />
                </div>
              </div>
            </div>

            {/* Password Requirements */}
            <div className="bg-gray-50 p-4 rounded-xl space-y-2">
              <Requirement met={passwordStrength.minLength} text="At least 8 characters" />
              <Requirement met={passwordStrength.hasUpper} text="Contains uppercase letter" />
              <Requirement met={passwordStrength.hasLower} text="Contains lowercase letter" />
              <Requirement met={passwordStrength.hasNumber} text="Contains a number" />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full flex justify-center py-4 px-4 border border-transparent rounded-xl shadow-lg hover:shadow-primary-200 text-lg font-bold text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-all disabled:opacity-50"
            >
              {loading ? (
                <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-white"></div>
              ) : (
                'Set New Password'
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

const Requirement = ({ met, text }) => (
  <div className={`flex items-center text-xs ${met ? 'text-green-600' : 'text-gray-400'}`}>
    {met ? <FiCheck className="mr-2 h-3 w-3" /> : <FiX className="mr-2 h-3 w-3" />}
    <span className={met ? 'font-semibold' : ''}>{text}</span>
  </div>
);

export default ResetPasswordPage;
