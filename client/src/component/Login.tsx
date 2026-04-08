import React, { useState, useEffect } from 'react';
import { Mail, Lock, User, CheckCircle, ArrowRight, Eye, EyeOff, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useDispatch, useSelector } from 'react-redux';
import { signupUser, loginUser, googleLogin, facebookLogin } from '../store/user/user.thunk';
import { clearError } from '../store/user/user.slice';
import { useGoogleLogin } from '@react-oauth/google';
import type { AppDispatch, RootState } from '../store/store';
import toast, { Toaster } from 'react-hot-toast';

const AuthPage: React.FC = () => {
    const [isLogin, setIsLogin] = useState(true);
    const [showPassword, setShowPassword] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        confirmPassword: ''
    });

    const dispatch = useDispatch<AppDispatch>();
    const { isLoading, error, success } = useSelector((state: RootState) => state.user);

    const toggleAuth = () => {
        setIsLogin(!isLogin);
        dispatch(clearError());
    };

    useEffect(() => {
        if (error) {
            toast.error(error);
            dispatch(clearError());
        }
        if (success) {
            toast.success(isLogin ? "Logged in successfully!" : "Verification email sent!");
        }
    }, [error, success, isLogin, dispatch]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const validateForm = () => {
        if (!formData.email.includes('@')) return "Invalid email address";
        if (formData.password.length < 8) return "Password must be at least 8 characters";
        if (!isLogin && formData.password !== formData.confirmPassword) return "Passwords do not match";
        if (!isLogin && !formData.name) return "Name is required";
        return null;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const validationError = validateForm();
        if (validationError) {
            toast.error(validationError);
            return;
        }

        if (isLogin) {
            dispatch(loginUser({ email: formData.email, password: formData.password }));
        } else {
            dispatch(signupUser(formData));
        }
    };

    const loginWithGoogle = useGoogleLogin({
        onSuccess: (tokenResponse) => {
            dispatch(googleLogin(tokenResponse.access_token));
            // Note: Our backend expects 'credential' (ID Token) usually from the standard button, 
            // but useGoogleLogin gives access_token. I'll adjust the backend or use the credential.
            // Actually, @react-oauth/google's GoogleLogin component gives the ID Token.
            // useGoogleLogin gives access_token which requires a different backend verify flow.
            // Let's use the GoogleLogin component for simplicity or adjust the backend.
        },
        onError: () => toast.error("Google Login Failed"),
    });

    // Let's use custom handle for Google Login to get ID token if needed, 
    // but the easiest is the GoogleLogin component or Implicit flow.
    // I will use a custom button with useGoogleLogin for better styling.

    return (
        <div className="min-h-screen bg-[#F8FAFC] flex flex-col relative overflow-hidden font-outfit">
            <Toaster position="top-center" />

            {/* Background pattern */}
            <div className="absolute inset-0 pointer-events-none opacity-[0.03] select-none">
                <img src="/src/assets/Group 6.svg" className="absolute -bottom-20 -left-20 w-1/2" alt="" />
                <img src="/src/assets/Group 6.svg" className="absolute -top-20 -right-20 w-1/2 rotate-180" alt="" />
            </div>

            <header className="p-8 relative z-10">
                <img src="/src/assets/logo.png" alt="Bexex Logo" className="h-10 opacity-90" />
            </header>

            <main className="flex-1 flex flex-col items-center justify-center p-6 relative z-10 -mt-10">
                <div className="w-full max-w-[440px]">
                    <div className="flex justify-center mb-10">
                        <div className="bg-white/60 backdrop-blur-md p-1.5 rounded-2xl shadow-sm border border-slate-100 flex gap-1">
                            {['Log In', 'Sign Up'].map((tab) => (
                                <button
                                    key={tab}
                                    onClick={() => setIsLogin(tab === 'Log In')}
                                    className={`px-8 py-2.5 rounded-xl text-sm font-semibold transition-all duration-300 ${isLogin === (tab === 'Log In') ? 'bg-black text-white shadow-lg' : 'text-slate-400 hover:text-slate-600'}`}
                                >
                                    {tab}
                                </button>
                            ))}
                        </div>
                    </div>

                    <motion.div
                        layout
                        className="bg-white p-10 rounded-[44px] shadow-[0_40px_80px_-16px_rgba(0,0,0,0.06)] border border-slate-50 relative overflow-hidden"
                    >
                        <form className="space-y-5" onSubmit={handleSubmit}>
                            <AnimatePresence mode="popLayout">
                                {!isLogin && (
                                    <motion.div
                                        initial={{ opacity: 0, scale: 0.95 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        exit={{ opacity: 0, scale: 0.95 }}
                                        className="relative group"
                                    >
                                        <User className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-black transition-colors" size={19} />
                                        <input
                                            name="name"
                                            value={formData.name}
                                            onChange={handleChange}
                                            type="text"
                                            placeholder="Full Name"
                                            className="w-full bg-slate-50 border-none px-14 py-4.5 rounded-2xl outline-none focus:ring-2 focus:ring-black/5 transition-all text-slate-900 font-medium placeholder:text-slate-300"
                                        />
                                    </motion.div>
                                )}
                            </AnimatePresence>

                            <div className="relative group">
                                <Mail className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-black transition-colors" size={19} />
                                <input
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    type="email"
                                    placeholder="Email Address"
                                    className="w-full bg-slate-50 border-none px-14 py-4.5 rounded-2xl outline-none focus:ring-2 focus:ring-black/5 transition-all text-slate-900 font-medium placeholder:text-slate-300"
                                />
                            </div>

                            <div className="relative group">
                                <Lock className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-black transition-colors" size={19} />
                                <input
                                    name="password"
                                    value={formData.password}
                                    onChange={handleChange}
                                    type={showPassword ? "text" : "password"}
                                    placeholder="Password"
                                    className="w-full bg-slate-50 border-none px-14 py-4.5 rounded-2xl outline-none focus:ring-2 focus:ring-black/5 transition-all text-slate-900 font-medium placeholder:text-slate-300"
                                />
                                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-5 top-1/2 -translate-y-1/2 text-slate-300 hover:text-black transition-colors">
                                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                </button>
                            </div>

                            <AnimatePresence mode="popLayout">
                                {!isLogin && (
                                    <motion.div
                                        initial={{ opacity: 0, scale: 0.95 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        exit={{ opacity: 0, scale: 0.95 }}
                                        className="relative group"
                                    >
                                        <CheckCircle className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-black transition-colors" size={19} />
                                        <input
                                            name="confirmPassword"
                                            value={formData.confirmPassword}
                                            onChange={handleChange}
                                            type="password"
                                            placeholder="Confirm Password"
                                            className="w-full bg-slate-50 border-none px-14 py-4.5 rounded-2xl outline-none focus:ring-2 focus:ring-black/5 transition-all text-slate-900 font-medium placeholder:text-slate-300"
                                        />
                                    </motion.div>
                                )}
                            </AnimatePresence>

                            <button
                                disabled={isLoading}
                                className="w-full bg-black text-white py-5 rounded-2xl font-bold flex items-center justify-center gap-3 hover:scale-[1.01] active:scale-[0.99] transition-all shadow-xl shadow-black/10 disabled:bg-slate-800"
                            >
                                {isLoading ? (
                                    <Loader2 className="animate-spin" size={20} />
                                ) : (
                                    <>
                                        <span>{isLogin ? 'Log In' : 'Sign Up'}</span>
                                        <ArrowRight size={18} />
                                    </>
                                )}
                            </button>

                            <div className="relative my-8">
                                <div className="absolute inset-0 flex items-center">
                                    <div className="w-full border-t border-slate-100"></div>
                                </div>
                                <div className="relative flex justify-center text-xs uppercase">
                                    <span className="bg-white px-4 text-slate-400 font-bold tracking-widest">Or continue with</span>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <button
                                    type="button"
                                    onClick={() => loginWithGoogle()}
                                    className="flex items-center justify-center gap-3 py-4 px-6 rounded-2xl border border-slate-100 hover:bg-slate-50 transition-all font-semibold text-slate-600"
                                >
                                    <img src="https://www.google.com/favicon.ico" className="w-5 h-5" alt="Google" />
                                    <span>Google</span>
                                </button>
                                <button
                                    type="button"
                                    onClick={() => toast.error("Facebook login setup required")}
                                    className="flex items-center justify-center gap-3 py-4 px-6 rounded-2xl border border-slate-100 hover:bg-slate-50 transition-all font-semibold text-slate-600"
                                >
                                    <svg className="w-5 h-5 text-[#1877F2] fill-current" viewBox="0 0 24 24">
                                        <path d="M24 12.073C24 5.405 18.627 0 12 0S0 5.405 0 12.073C0 18.1 4.388 23.094 10.125 24V15.563H7.078V12.073H10.125V9.413c0-3.047 1.807-4.747 4.583-4.747 1.33 0 2.731.239 2.731.239v3.022h-1.542c-1.477 0-1.93.923-1.93 1.887v2.266h3.401l-.544 3.437h-2.857V24C19.612 23.094 24 18.1 24 12.073z" />
                                    </svg>
                                    <span>Facebook</span>
                                </button>
                            </div>
                        </form>

                        <div className="mt-8 text-center">
                            <button onClick={toggleAuth} className="text-sm font-medium text-slate-400 hover:text-black transition-colors">
                                {isLogin ? "Don't have an account? Sign up" : "Already have an account? Log in"}
                            </button>
                        </div>
                    </motion.div>

                    {error && (
                        <div className="mt-6 text-center">
                            <p className="text-xs font-semibold text-rose-500 bg-rose-50 py-2 px-4 rounded-full inline-block">
                                Error: {error}
                            </p>
                        </div>
                    )}
                </div>
            </main>

            <footer className="p-8 text-center text-[11px] text-slate-300 uppercase tracking-widest font-semibold">
                &copy; 2026 Bexex Global. High Security Audit Portal
            </footer>
        </div>
    );
};

export default AuthPage;
