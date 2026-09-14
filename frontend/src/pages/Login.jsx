import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Mail, Lock, ArrowRight, ShieldCheck } from 'lucide-react';
import { staggerContainer, fadeUp } from '../utils/motion';
import { authApi } from '../api/authApi';
import { useAuth } from '../context/AuthContext';

const Login = () => {
    const [formData, setFormData] = useState({ email: '', password: '' });
    const [error, setError] = useState('');
    const navigate = useNavigate();
    const { login } = useAuth();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const { data } = await authApi.login(formData);
            login(data.access_token, data.user);
            navigate(data.user.role === 'admin' ? '/admin' : '/');
        } catch (err) {
            setError(err.response?.data?.msg || 'Login failed');
        }
    };

    const inputClass =
        "block w-full pl-11 pr-4 py-3.5 bg-white/70 border border-neutral-200 rounded-2xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-4 focus:ring-neutral-300/40 focus:border-neutral-400 focus:bg-white transition-all font-medium shadow-sm";

    return (
        <div className="relative min-h-[85vh] flex items-center justify-center px-4 py-16 overflow-hidden">
            {/* floating gray orbs for premium depth */}
            <div className="glow-orb h-72 w-72 -top-10 -left-10 bg-neutral-300/50" />
            <div className="glow-orb h-72 w-72 -bottom-12 -right-12 bg-neutral-400/40" style={{ animationDelay: "5s" }} />

            <motion.div
                initial={{ opacity: 0, y: 26, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                className="w-full max-w-md"
            >
                <div className="premium-border shadow-2xl shadow-neutral-400/30">
                    <div className="p-8 md:p-12 bg-white/40 rounded-[2rem]">
                        <motion.div variants={staggerContainer(0.08)} initial="hidden" animate="visible">
                            <div className="text-center mb-8">
                                <motion.div variants={fadeUp} className="shine mb-4 inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-tr from-neutral-900 to-neutral-600 text-white shadow-xl shadow-neutral-400">
                                    <ShieldCheck className="h-7 w-7" />
                                </motion.div>
                                <motion.h2 variants={fadeUp} className="text-3xl font-black text-gray-900 tracking-tight mb-2 font-display">
                                    Welcome <span className="text-gradient">Back</span>
                                </motion.h2>
                                <motion.p variants={fadeUp} className="text-gray-500 font-medium">
                                    Sign in to your premium account.
                                </motion.p>
                            </div>

                            {error && (
                                <motion.div
                                    initial={{ opacity: 0, y: 6 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="mb-6 p-4 bg-neutral-100 border border-neutral-200 rounded-2xl flex items-center gap-2 text-neutral-800 text-sm font-bold"
                                >
                                    <span aria-hidden>⚠️</span> {error}
                                </motion.div>
                            )}

                            <motion.form
                                variants={staggerContainer(0.09, 0.1)}
                                onSubmit={handleSubmit}
                                className="space-y-5"
                            >
                                <motion.div variants={fadeUp}>
                                    <label className="block text-sm font-bold text-gray-700 mb-2">Email Address</label>
                                    <div className="relative">
                                        <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                                        <input
                                            type="email"
                                            required
                                            placeholder="name@example.com"
                                            className={inputClass}
                                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                        />
                                    </div>
                                </motion.div>

                                <motion.div variants={fadeUp}>
                                    <label className="block text-sm font-bold text-gray-700 mb-2">Password</label>
                                    <div className="relative">
                                        <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                                        <input
                                            type="password"
                                            required
                                            placeholder="••••••••"
                                            className={inputClass}
                                            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                        />
                                    </div>
                                </motion.div>

                                <motion.button
                                    variants={fadeUp}
                                    type="submit"
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    className="shine group w-full flex justify-center items-center gap-2 py-4 px-4 bg-gradient-to-tr from-neutral-900 to-neutral-700 text-white text-base font-bold rounded-2xl shadow-xl shadow-neutral-400/50 transition-all"
                                >
                                    Log In
                                    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                                </motion.button>
                            </motion.form>

                            <motion.p variants={fadeUp} className="mt-10 text-center text-sm text-gray-500 font-medium">
                                Don't have an account?{" "}
                                <Link to="/register" className="font-bold text-neutral-900 hover:underline">Create one now</Link>
                            </motion.p>
                        </motion.div>
                    </div>
                </div>
            </motion.div>
        </div>
    );
};

export default Login;