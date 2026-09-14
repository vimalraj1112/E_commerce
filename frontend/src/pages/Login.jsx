import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
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

    return (
        <div className="min-h-[80vh] flex items-center justify-center px-4">
            <div className="max-w-md w-full glass-card rounded-3xl shadow-xl shadow-gray-200/40 overflow-hidden">
                <div className="p-8 md:p-12">
                    <div className="text-center mb-10">
                        <h2 className="text-3xl font-black text-gray-900 tracking-tight mb-2">Welcome Back</h2>
                        <p className="text-gray-500 font-medium">Please enter your details to sign in.</p>
                    </div>

                    {error && (
                        <div className="mb-6 p-4 bg-neutral-100 border border-neutral-200 rounded-2xl flex items-center text-neutral-800 text-sm font-bold animate-in fade-in duration-300">
                             {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-2">Email Address</label>
                            <input
                                type="email"
                                required
                                placeholder="name@example.com"
                                className="block w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-2xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:bg-white transition-all font-medium"
                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-2">Password</label>
                            <input
                                type="password"
                                required
                                placeholder="••••••••"
                                className="block w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-2xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:bg-white transition-all font-medium"
                                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                            />
                        </div>
                        <button
                            type="submit"
                            className="w-full flex justify-center py-4 px-4 bg-primary-600 hover:bg-primary-700 text-white text-base font-bold rounded-2xl shadow-lg shadow-primary-200 transition-all active:scale-[0.98] outline-none focus:ring-4 focus:ring-primary-100"
                        >
                            Log In
                        </button>
                    </form>

                    <div className="mt-10 text-center">
                        <p className="text-sm text-gray-500 font-medium">
                            Don't have an account? <Link to="/register" className="text-primary-600 hover:text-primary-700 font-bold transition-colors">Create one now</Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;
