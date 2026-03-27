import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { masterAPI } from '../../services/api';
import { FiUser, FiMail, FiLock, FiPhone, FiEye, FiEyeOff, FiActivity, FiMapPin, FiCheckCircle } from 'react-icons/fi';
import toast from 'react-hot-toast';

const RegisterPage = () => {
  const navigate = useNavigate();
  const { sendOtp, verifyOtpAndRegister } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);
  const [step, setStep] = useState(1);
  const [cities, setCities] = useState([]);
  const [formData, setFormData] = useState({ fullName: '', email: '', password: '', confirmPassword: '', mobileNumber: '', companyName: '', cityId: '', roles: [] });
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [errors, setErrors] = useState({});
  const otpInputs = useRef([]);

  const roleOptions = [
    { value: 'SELLER', label: 'Seller / Lister', description: 'Post healthcare businesses for sale' },
    { value: 'BUYER', label: 'Buyer / Investor', description: 'Browse listings and send inquiries' },
    { value: 'EMPLOYER', label: 'Employer', description: 'Post healthcare job openings' },
    { value: 'JOB_SEEKER', label: 'Job Seeker', description: 'Find and apply for healthcare jobs' }
  ];

  const validateStep1 = () => {
    const newErrors = {};
    if (!formData.fullName || formData.fullName.length < 2) newErrors.fullName = 'Full name must be at least 2 characters';
    if (!formData.email) newErrors.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Invalid email format';
    if (!formData.password) newErrors.password = 'Password is required';
    else if (!/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/.test(formData.password)) newErrors.password = 'Password must be at least 8 characters with 1 uppercase, 1 lowercase, and 1 number';
    if (formData.password !== formData.confirmPassword) newErrors.confirmPassword = 'Passwords do not match';
    if (!formData.mobileNumber || !/^[6-9]\d{9}$/.test(formData.mobileNumber)) newErrors.mobileNumber = 'Invalid Indian mobile number';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateStep2 = () => {
    const newErrors = {};
    if (formData.roles.length === 0) newErrors.roles = 'Please select at least one role';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => { if (validateStep1()) setStep(2); };

  const handleSendOtp = async (e) => {
    if (e) e.preventDefault();
    if (!validateStep2()) return;

    setLoading(true);
    const result = await sendOtp(formData.email);
    setLoading(false);

    if (result.success) {
      setStep(3);
    }
  };

  const handleResendOtp = async () => {
    setResending(true);
    const result = await sendOtp(formData.email);
    setResending(false);
    if (result.success) setOtp(['', '', '', '', '', '']);
  };

  const handleOtpChange = (element, index) => {
    if (isNaN(element.value)) return false;

    const newOtp = [...otp];
    newOtp[index] = element.value;
    setOtp(newOtp);

    // Focus next input
    if (element.value !== '' && index < 5) {
      otpInputs.current[index + 1].focus();
    }
  };

  const handleOtpKeyDown = (e, index) => {
    if (e.key === 'Backspace' && otp[index] === '' && index > 0) {
      otpInputs.current[index - 1].focus();
    }
  };

  const handleVerifyAndRegister = async (e) => {
    if (e) e.preventDefault();
    const otpValue = otp.join('');
    if (otpValue.length !== 6) {
      toast.error('Please enter the full 6-digit verification code');
      return;
    }

    setLoading(true);
    const registrationData = {
      ...formData,
      otp: otpValue,
      cityId: formData.cityId ? parseInt(formData.cityId) : undefined,
      companyName: formData.companyName || undefined
    };
    delete registrationData.confirmPassword;

    const result = await verifyOtpAndRegister(registrationData);
    setLoading(false);

    if (result.success) {
      navigate('/dashboard');
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }));
  };

  const handleRoleChange = (role) => {
    setFormData(prev => ({ ...prev, roles: prev.roles.includes(role) ? prev.roles.filter(r => r !== role) : [...prev.roles, role] }));
    if (errors.roles) setErrors(prev => ({ ...prev, roles: '' }));
  };

  const searchCities = async (query) => {
    if (query.length > 2) {
      try { const response = await masterAPI.searchCities(query); setCities(response.data.data || []); } catch (error) { console.error('Error searching cities:', error); }
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center py-12 px-4 relative overflow-hidden bg-[#f8fafb]">
      {/* Background Layer */}
      <div className="absolute inset-0 z-0">
        <img src="/images/auth/auth_bg.png" alt="" className="w-full h-full object-cover opacity-20" />
        <div className="absolute inset-0 bg-gradient-to-br from-teal-50/50 via-white/80 to-emerald-50/50" />
        <div className="absolute inset-0 bg-mesh opacity-30" />
      </div>

      <div className="max-w-md w-full relative z-10">
        <div className="text-center mb-6">
          <Link to="/" className="inline-flex flex-col items-center">
            <div className="w-14 h-14 glass bg-teal-500/10 rounded-2xl flex items-center justify-center mb-3 shadow-lg shadow-teal-500/5 transition-transform hover:scale-105">
              <span className="text-gradient font-black text-2xl tracking-tighter">M</span>
            </div>
          </Link>
          <h2 className="mt-4 text-3xl font-black text-[#191c1e] tracking-tighter leading-none">
            Join the <span className="text-gradient">Collective</span>
          </h2>
          <p className="mt-3 text-xs font-bold text-[#3c4947] opacity-60">Architecting the future of healthcare commerce.</p>
        </div>

        {/* Stepper */}
        <div className="flex items-center justify-center mb-6 px-4">
          {[
            { n: 1, l: 'Profile' },
            { n: 2, l: 'Role' },
            { n: 3, l: 'Verify' }
          ].map((s, i) => (
            <React.Fragment key={s.n}>
              <div className="flex flex-col items-center gap-1.5">
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-[10px] font-black transition-all duration-500 ${step >= s.n ? 'btn-gradient text-white shadow-lg shadow-teal-500/20 scale-110' : 'glass bg-white/50 text-[#3c4947] opacity-40'}`}>
                  {step > s.n ? <FiCheckCircle className="w-4 h-4" /> : s.n}
                </div>
                <span className={`text-[8px] font-black uppercase tracking-widest transition-opacity duration-300 ${step >= s.n ? 'text-teal-600 opacity-100' : 'text-[#3c4947] opacity-40'}`}>
                  {s.l}
                </span>
              </div>
              {i < 2 && (
                <div className="w-12 h-[1px] mx-3 mb-4">
                  <div className={`h-full transition-all duration-700 ${step > s.n ? 'bg-gradient-to-r from-teal-500 to-emerald-500' : 'bg-[#eef1f4]'}`} />
                </div>
              )}
            </React.Fragment>
          ))}
        </div>

        <div className="glass-card p-6 md:p-8 shadow-xl relative overflow-hidden group">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-teal-500 to-emerald-500 opacity-50" />

          {step === 1 && (
            <div className="space-y-4 animate-fadeIn">
              <div>
                <label htmlFor="fullName" className="text-[10px] font-black uppercase tracking-widest text-[#191c1e] mb-2 block">Full Legal Name</label>
                <div className="relative group/input">
                  <FiUser className="absolute left-4 top-1/2 transform -translate-y-1/2 text-teal-400 w-4 h-4" />
                  <input id="fullName" name="fullName" type="text" value={formData.fullName} onChange={handleChange} className={`glass w-full pl-12 pr-4 py-3 bg-white/50 border border-teal-500/20 rounded-xl text-[#191c1e] font-bold focus:ring-2 focus:ring-teal-500/20 transition-all ${errors.fullName ? 'ring-2 ring-red-500/20' : ''}`} placeholder="" />
                </div>
                {errors.fullName && <p className="text-[9px] font-bold text-red-500 mt-1 uppercase tracking-wide">{errors.fullName}</p>}
              </div>

              <div>
                <label htmlFor="mobileNumber" className="text-[10px] font-black uppercase tracking-widest text-[#191c1e] mb-2 block">Contact number</label>
                <div className="relative group/input">
                  <FiPhone className="absolute left-4 top-1/2 transform -translate-y-1/2 text-teal-400 w-4 h-4" />
                  <input id="mobileNumber" name="mobileNumber" type="tel" value={formData.mobileNumber} onChange={handleChange} className={`glass w-full pl-12 pr-4 py-3 bg-white/50 border border-teal-500/20 rounded-xl text-[#191c1e] font-bold focus:ring-2 focus:ring-teal-500/20 transition-all ${errors.mobileNumber ? 'ring-2 ring-red-500/20' : ''}`} placeholder="" maxLength="10" />
                </div>
                {errors.mobileNumber && <p className="text-[9px] font-bold text-red-500 mt-1 uppercase tracking-wide">{errors.mobileNumber}</p>}
              </div>

              <div>
                <label htmlFor="email" className="text-[10px] font-black uppercase tracking-widest text-[#191c1e] mb-2 block">Email id</label>
                <div className="relative group/input">
                  <FiMail className="absolute left-4 top-1/2 transform -translate-y-1/2 text-teal-400 w-4 h-4" />
                  <input id="email" name="email" type="email" value={formData.email} onChange={handleChange} className={`glass w-full pl-12 pr-4 py-3 bg-white/50 border border-teal-500/20 rounded-xl text-[#191c1e] font-bold focus:ring-2 focus:ring-teal-500/20 transition-all ${errors.email ? 'ring-2 ring-red-500/20' : ''}`} placeholder="" />
                </div>
                {errors.email && <p className="text-[9px] font-bold text-red-500 mt-1 uppercase tracking-wide">{errors.email}</p>}
              </div>

              <div>
                <label htmlFor="password" className="text-[10px] font-black uppercase tracking-widest text-[#191c1e] mb-2 block">password</label>
                <div className="relative group/input">
                  <FiLock className="absolute left-4 top-1/2 transform -translate-y-1/2 text-teal-400 w-4 h-4" />
                  <input id="password" name="password" type={showPassword ? 'text' : 'password'} value={formData.password} onChange={handleChange} className={`glass w-full pl-12 pr-10 py-3 bg-white/50 border border-teal-500/20 rounded-xl text-[#191c1e] font-bold focus:ring-2 focus:ring-teal-500/20 transition-all ${errors.password ? 'ring-2 ring-red-500/20' : ''}`} placeholder="" />
                  <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 transform -translate-y-1/2 text-teal-300 hover:text-teal-600 transition-colors">{showPassword ? <FiEyeOff className="w-4 h-4" /> : <FiEye className="w-4 h-4" />}</button>
                </div>
                {errors.password && <p className="text-[9px] font-bold text-red-500 mt-1 uppercase tracking-wide">{errors.password}</p>}
              </div>

              <div>
                <label htmlFor="confirmPassword" className="text-[10px] font-black uppercase tracking-widest text-[#191c1e] mb-2 block">Confirm pasword</label>
                <div className="relative group/input">
                  <FiLock className="absolute left-4 top-1/2 transform -translate-y-1/2 text-teal-400 w-4 h-4" />
                  <input id="confirmPassword" name="confirmPassword" type="password" value={formData.confirmPassword} onChange={handleChange} className={`glass w-full pl-12 pr-4 py-3 bg-white/50 border border-teal-500/20 rounded-xl text-[#191c1e] font-bold focus:ring-2 focus:ring-teal-500/20 transition-all ${errors.confirmPassword ? 'ring-2 ring-red-500/20' : ''}`} placeholder="" />
                </div>
                {errors.confirmPassword && <p className="text-[9px] font-bold text-red-500 mt-1 uppercase tracking-wide">{errors.confirmPassword}</p>}
              </div>

              <button type="button" onClick={handleNext} className="btn-gradient w-full py-4 rounded-xl font-black text-[10px] uppercase tracking-[0.2em] shadow-lg shadow-teal-500/20 hover:shadow-teal-500/30 transition-all mt-2">Initialize Profile</button>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-6 animate-fadeIn">
              <div>
                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-[#191c1e] mb-4 block text-center">Define Your Professional Role</label>
                <div className="grid grid-cols-1 gap-3">
                  {roleOptions.map((role) => {
                    const isActive = formData.roles.includes(role.value);
                    return (
                      <button
                        key={role.value}
                        type="button"
                        onClick={() => handleRoleChange(role.value)}
                        className={`text-left p-4 rounded-xl border-none transition-all relative overflow-hidden group/role ${isActive ? 'glass bg-teal-500 text-white shadow-lg shadow-teal-500/20 scale-[1.01]' : 'glass bg-white/40 hover:bg-white/60 text-[#191c1e]'}`}
                      >
                        <div className={`mb-2 transition-colors ${isActive ? 'text-white' : 'text-teal-400'}`}>
                          <FiActivity className="w-5 h-5" />
                        </div>
                        <span className="block font-black text-[11px] tracking-tight mb-0.5">{role.label}</span>
                        <p className={`text-[8px] font-bold leading-relaxed opacity-60 ${isActive ? 'text-white' : 'text-[#3c4947]'}`}>{role.description}</p>
                        {isActive && <FiCheckCircle className="absolute top-3 right-3 w-4 h-4 text-white animate-pulse" />}
                      </button>
                    );
                  })}
                </div>
                {errors.roles && <p className="text-[9px] font-bold text-red-500 mt-3 uppercase tracking-wide text-center">{errors.roles}</p>}
              </div>

              <div>
                <label htmlFor="companyName" className="text-[10px] font-black uppercase tracking-widest text-[#191c1e] mb-2 block">Institution</label>
                <div className="relative group/input">
                  <FiActivity className="absolute left-4 top-1/2 transform -translate-y-1/2 text-teal-400 w-4 h-4" />
                  <input id="companyName" name="companyName" type="text" value={formData.companyName} onChange={handleChange} className="glass w-full pl-12 pr-4 py-3 bg-white/50 border border-teal-500/20 rounded-xl text-[#191c1e] font-bold focus:ring-2 focus:ring-teal-500/20 transition-all" placeholder="" />
                </div>
              </div>

              <div>
                <label htmlFor="cityId" className="text-[10px] font-black uppercase tracking-widest text-[#191c1e] mb-2 block">Jurisdiction</label>
                <div className="relative group/input">
                  <FiMapPin className="absolute left-4 top-1/2 transform -translate-y-1/2 text-teal-400 w-4 h-4" />
                  <input id="cityId" name="cityId" list="cities" type="text" onChange={(e) => { searchCities(e.target.value); handleChange(e); }} className="glass w-full pl-12 pr-4 py-3 bg-white/50 border border-teal-500/20 rounded-xl text-[#191c1e] font-bold focus:ring-2 focus:ring-teal-500/20 transition-all" placeholder="" />
                  <datalist id="cities">{cities.map((city) => (<option key={city.id} value={city.id}>{city.name}, {city.state?.name}</option>))}</datalist>
                </div>
              </div>

              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => setStep(1)} className="glass px-6 py-4 rounded-xl font-black text-[10px] uppercase tracking-widest text-[#3c4947] hover:bg-white transition-all bg-white/40">Back</button>
                <button
                  type="button"
                  onClick={handleSendOtp}
                  disabled={loading}
                  className="btn-gradient flex-1 py-4 rounded-xl font-black text-[10px] uppercase tracking-[0.2em] shadow-lg shadow-teal-500/20 hover:shadow-teal-500/30 transition-all flex items-center justify-center gap-2"
                >
                  {loading ? <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white"></div> : 'Confirm & Send OTP'}
                </button>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-6 animate-fadeIn text-center">
              <div className="w-16 h-16 glass bg-teal-500/10 text-teal-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-teal-500/5 transition-transform animate-bounce-slow">
                <FiMail className="w-8 h-8" />
              </div>
              <div>
                <h3 className="text-2xl font-black text-[#191c1e] tracking-tighter mb-1">Security Verification</h3>
                <p className="text-[10px] font-bold text-[#3c4947] opacity-60 leading-relaxed uppercase tracking-wide">
                  Sentinel alert: Verification key sent to:<br />
                  <span className="text-teal-600 font-black">{formData.email}</span>
                </p>
              </div>

              <div className="flex justify-between gap-2 mt-2">
                {otp.map((data, index) => (
                  <input
                    key={index}
                    type="text"
                    maxLength="1"
                    ref={el => otpInputs.current[index] = el}
                    value={data}
                    onChange={e => handleOtpChange(e.target, index)}
                    onKeyDown={e => handleOtpKeyDown(e, index)}
                    className="w-full h-12 text-center text-xl font-black glass bg-white/50 border-2 border-teal-500/10 rounded-xl focus:border-teal-500 focus:bg-white focus:ring-4 focus:ring-teal-500/5 transition-all outline-none text-[#191c1e]"
                  />
                ))}
              </div>

              <button
                type="button"
                onClick={handleVerifyAndRegister}
                disabled={loading}
                className="btn-gradient w-full py-4 rounded-xl font-black text-[10px] uppercase tracking-[0.2em] shadow-lg shadow-teal-500/20 hover:shadow-emerald-500/30 transition-all mt-2 flex items-center justify-center gap-3"
              >
                {loading ? <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white"></div> : <>Authenticate & Launch <FiCheckCircle className="w-4 h-4" /></>}
              </button>

              <div className="pt-2 space-y-3">
                <p className="text-[8px] font-black text-[#3c4947] opacity-40 uppercase tracking-[0.2em]">
                  No pulse?{' '}
                  <button
                    disabled={resending}
                    onClick={handleResendOtp}
                    className="text-teal-600 hover:text-teal-700 transition-colors uppercase"
                  >
                    {resending ? 'Transmitting...' : 'Resend Key'}
                  </button>
                </p>
                <button
                  onClick={() => setStep(2)}
                  className="text-[8px] font-black text-emerald-600 hover:text-emerald-700 uppercase tracking-widest transition-colors block mx-auto underline"
                >
                  Adjust Registration Logic
                </button>
              </div>
            </div>
          )}
        </div>

        {step < 3 && (
          <p className="mt-6 text-center text-xs font-bold text-[#3c4947] opacity-60">
            Already a member? <Link to="/login" className="text-teal-600 hover:text-teal-700 font-black uppercase tracking-widest ml-1 transition-colors">Authorize Entry</Link>
          </p>
        )}
      </div>
    </div>
  );
};

export default RegisterPage;
