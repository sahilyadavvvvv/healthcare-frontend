import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { FiMail, FiLock, FiEye, FiEyeOff } from 'react-icons/fi';
import { useAuth } from '../../context/AuthContext';
import toast from 'react-hot-toast';

const LoginPage = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { login, isAuthenticated } = useAuth();

    const [formData, setFormData] = useState({ email: '', password: '' });
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [hoverSide, setHoverSide] = useState(null); // 'left' or 'right'
    const [errors, setErrors] = useState({});

    const redirect = location.search ? location.search.split('=')[1] : '/dashboard';

    useEffect(() => {
        if (isAuthenticated) {
            navigate(redirect);
        }
    }, [isAuthenticated, navigate, redirect]);

    const validateForm = () => {
        const newErrors = {};
        if (!formData.email) newErrors.email = 'Email is required';
        else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Invalid email format';
        if (!formData.password) newErrors.password = 'Password is required';
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validateForm()) return;
        
        setLoading(true);
        const result = await login(formData);
        setLoading(false);
        
        if (result.success) {
            navigate(redirect);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }));
    };

    return (
        <div className="min-h-full w-full flex overflow-hidden relative bg-[#f8fafb]">
            {/* Dynamic Background */}
            <div className="absolute inset-0 z-0">
                <img src="/images/auth/auth_bg.png" alt="" className="w-full h-full object-cover opacity-10" />
                <div className="absolute inset-0 bg-gradient-to-br from-teal-50/30 via-white/50 to-emerald-50/30" />
                <div className="absolute inset-0 bg-mesh opacity-20" />
            </div>

            {/* The Sliding Wall - Changing to absolute to stay within relative container */}
            <div 
                className={`absolute top-0 bottom-0 w-1/2 bg-white/95 backdrop-blur-md z-20 shadow-[0_0_100px_rgba(0,0,0,0.05)] transition-all duration-1000 cubic-bezier(0.16, 1, 0.3, 1) pointer-events-none hidden md:block ${
                    hoverSide === 'right' ? 'left-0' : 'left-1/2'
                }`}
            />

            {/* Mobile Background Helper */}
            <div className="md:hidden absolute inset-0 bg-white/90 z-10" />

            {/* Left Pane: Branding/Writing */}
            <div 
                onMouseEnter={() => setHoverSide('left')}
                className="flex-1 hidden md:flex flex-col items-center justify-center p-12 relative z-30 transition-all duration-700 min-h-[70vh]"
            >
                <div className={`max-w-md transition-all duration-1000 ${hoverSide === 'right' ? 'opacity-20 blur-sm scale-95' : 'opacity-100'}`}>
                    <Link to="/" className="inline-flex flex-col items-center mb-6">
                        <div className="w-16 h-16 glass bg-teal-500/10 rounded-2xl flex items-center justify-center mb-4 shadow-xl shadow-teal-500/5 hover-3d">
                            <span className="text-gradient font-black text-3xl tracking-tighter hover-3d-child">M</span>
                        </div>
                        <span className="text-[10px] font-black text-[#191c1e] uppercase tracking-[0.5em] opacity-30">MedBiz Intelligence</span>
                    </Link>
                    <div className="space-y-4 text-center">
                        <h1 className="text-5xl font-black text-[#191c1e] tracking-tighter leading-[0.9] text-balance">
                            Elevating <span className="text-gradient">Healthcare</span> Standards.
                        </h1>
                        <p className="text-base font-bold text-[#3c4947] opacity-60 leading-relaxed max-w-sm mx-auto">
                            Access the most elite marketplace for clinical equipment and specialized medical careers.
                        </p>
                        <div className="pt-6">
                            <div className="inline-flex items-center gap-4 px-5 py-2.5 glass bg-white/50 rounded-xl border-none shadow-sm">
                                <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                                <span className="text-[9px] font-black uppercase tracking-widest text-[#3c4947] opacity-50">Verified Network of 5,000+ Specialists</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Right Pane: Login Form */}
            <div 
                onMouseEnter={() => setHoverSide('right')}
                className="flex-1 flex items-center justify-center p-6 md:p-12 relative z-30 transition-all duration-700 min-h-[70vh]"
            >
                <div className={`max-w-md w-full transition-all duration-1000 ${hoverSide === 'left' ? 'opacity-20 blur-sm scale-95' : 'opacity-100'}`}>
                    <div className="md:hidden text-center mb-8">
                        <h2 className="text-3xl font-black text-[#191c1e] tracking-tighter">Welcome Back</h2>
                    </div>

                    <div className="glass-card p-6 md:p-10 shadow-[0_30px_80px_-20px_rgba(0,0,0,0.1)] relative overflow-hidden">
                        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-teal-500 to-emerald-500 opacity-60" />
                        
                        <div className="mb-8 text-center md:text-left">
                            <h2 className="text-3xl font-black text-[#191c1e] tracking-tighter leading-none mb-2">Authorize <span className="text-gradient">Entry</span></h2>
                            <p className="text-[9px] font-black text-[#3c4947] opacity-40 uppercase tracking-widest leading-none">Sentinel Protection Protocol Active</p>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div>
                                <label htmlFor="email" className="text-[9px] font-black uppercase tracking-widest text-[#3c4947] opacity-40 mb-2 block">Institutional Access Key</label>
                                <div className="relative group/input">
                                    <FiMail className="absolute left-4 top-1/2 transform -translate-y-1/2 text-teal-400 w-4 h-4 transition-colors group-focus-within/input:text-teal-600" />
                                    <input 
                                        id="email" 
                                        name="email" 
                                        type="email" 
                                        value={formData.email} 
                                        onChange={handleChange} 
                                        className={`google-font glass w-full pl-12 pr-4 py-4 bg-white/40 border-none rounded-xl text-[#191c1e] placeholder-[#3c4947]/20 font-bold focus:ring-4 focus:ring-teal-500/5 transition-all ${errors.email ? 'ring-4 ring-red-500/5' : ''}`} 
                                        placeholder="dr.smith@hospital.com" 
                                    />
                                </div>
                                {errors.email && <p className="text-[9px] font-bold text-red-500 mt-2 uppercase tracking-wide">{errors.email}</p>}
                            </div>

                            <div>
                                <div className="flex justify-between items-center mb-2">
                                    <label htmlFor="password" className="text-[9px] font-black uppercase tracking-widest text-[#3c4947] opacity-40">Verification Code</label>
                                    <Link to="/forgot-password" university-mode="true" className="text-[9px] font-black text-teal-600 hover:text-teal-700 uppercase tracking-widest transition-colors">Recover</Link>
                                </div>
                                <div className="relative group/input">
                                    <FiLock className="absolute left-4 top-1/2 transform -translate-y-1/2 text-teal-400 w-4 h-4 transition-colors group-focus-within/input:text-teal-600" />
                                    <input 
                                        id="password" 
                                        name="password" 
                                        type={showPassword ? 'text' : 'password'} 
                                        value={formData.password} 
                                        onChange={handleChange} 
                                        className={`google-font glass w-full pl-12 pr-12 py-4 bg-white/40 border-none rounded-xl text-[#191c1e] placeholder-[#3c4947]/20 font-bold focus:ring-4 focus:ring-teal-500/5 transition-all ${errors.password ? 'ring-4 ring-red-500/5' : ''}`} 
                                        placeholder="••••••••" 
                                    />
                                    <button 
                                        type="button" 
                                        onClick={() => setShowPassword(!showPassword)} 
                                        className="absolute right-4 top-1/2 transform -translate-y-1/2 text-teal-300 hover:text-teal-600 transition-colors"
                                    >
                                        {showPassword ? <FiEyeOff className="w-4 h-4" /> : <FiEye className="w-4 h-4" />}
                                    </button>
                                </div>
                                {errors.password && <p className="text-[9px] font-bold text-red-500 mt-2 uppercase tracking-wide">{errors.password}</p>}
                            </div>

                            <div className="flex items-center pb-1">
                                <label className="flex items-center cursor-pointer group/check">
                                    <div className="relative">
                                        <input type="checkbox" className="peer w-4 h-4 opacity-0 absolute cursor-pointer" />
                                        <div className="w-4 h-4 rounded-lg border-none glass bg-teal-500/10 peer-checked:bg-teal-500 flex items-center justify-center transition-all">
                                            <div className="w-1.5 h-1.5 rounded-full bg-white opacity-0 peer-checked:opacity-100 transition-opacity" />
                                        </div>
                                    </div>
                                    <span className="ml-3 text-[9px] font-black uppercase tracking-widest text-[#3c4947] opacity-40 group-hover/check:opacity-100 transition-opacity">Persistent Authorization</span>
                                </label>
                            </div>

                            <button 
                                type="submit" 
                                disabled={loading} 
                                className="btn-gradient w-full py-5 rounded-2xl font-black text-xs uppercase tracking-[0.3em] shadow-xl shadow-teal-500/20 hover:shadow-teal-500/40 hover:-translate-y-1 transition-all flex items-center justify-center gap-4 mt-2"
                            >
                                {loading ? <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white"></div> : <>Establish Link <FiLock className="w-4 h-4" /></>}
                            </button>
                        </form>
                    </div>
                    
                    <div className="mt-8 text-center md:flex items-center justify-center gap-6">
                        <p className="text-[9px] font-black text-[#3c4947] opacity-30 uppercase tracking-[0.2em]">New to the collective?</p>
                        <Link to="/register" className="glass px-6 py-2.5 rounded-full text-[9px] font-black text-teal-600 hover:text-teal-700 uppercase tracking-widest transition-all hover:bg-white inline-block mt-4 md:mt-0">Request Official Access</Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LoginPage;
