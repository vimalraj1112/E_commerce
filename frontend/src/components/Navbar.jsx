import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { ShoppingCart, LogOut, ShoppingBag, User, Sparkles, Heart } from 'lucide-react';
import { useToast } from '../context/ToastContext';

const Navbar = () => {
    const { user, isAdmin, logout } = useAuth();
    const { toast } = useToast();
    const { cartCount, openDrawer } = useCart();
    const { count: wishCount } = useWishlist();
    const navigate = useNavigate();

    // On logout, ensure the drawer closes and cart resets naturally via context
    const handleLogout = () => {
        logout();
        toast('Signed out. See you soon! 👋', 'info');
        navigate('/login');
    };

    return (
        <nav className="bg-gradient-to-r from-sky-600/90 via-indigo-600/90 to-fuchsia-600/90 backdrop-blur-xl sticky top-0 z-50 border-b border-white/20 shadow-lg shadow-indigo-500/10">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-20">
                    <div className="flex items-center">
                        <Link to="/" className="flex-shrink-0 flex items-center group transition-all">
                            <motion.span
                                whileHover={{ rotate: 8 }}
                                className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-tr from-sky-500 to-indigo-600 shadow-lg shadow-sky-200"
                            >
                                <ShoppingBag className="h-5 w-5 text-white" />
                            </motion.span>
                            <span className="ml-3 text-2xl font-black text-white tracking-tighter font-display drop-shadow-sm">
                                Mini<span className="text-cyan-200">Shop</span>
                            </span>
                        </Link>
                        <div className="hidden sm:ml-10 sm:flex sm:space-x-8">
                            <Link to="/" className="text-white/85 hover:text-white inline-flex items-center px-1 pt-1 text-sm font-bold transition-colors">
                                Shop
                            </Link>
                            {user && !isAdmin && (
                                <Link to="/orders" className="text-white/85 hover:text-white inline-flex items-center px-1 pt-1 text-sm font-bold transition-colors">
                                    My Orders
                                </Link>
                            )}
                            {isAdmin && (
                                <Link to="/admin" className="text-white/85 hover:text-white inline-flex items-center px-1 pt-1 text-sm font-bold transition-colors">
                                    Admin Panel
                                </Link>
                            )}
                        </div>
                    </div>
                    <div className="flex items-center space-x-6">
                        {user ? (
                            <>
                                {!isAdmin && (
                                    <button
                                        onClick={openDrawer}
                                        className="text-white/85 hover:text-white transition-all relative p-2 hover:bg-white/10 rounded-xl"
                                        title="Open bag"
                                    >
                                        <ShoppingCart className="h-6 w-6" />
                                        <AnimatePresence>
                                            {cartCount > 0 && (
                                                <motion.span
                                                    key={cartCount}
                                                    initial={{ scale: 0 }}
                                                    animate={{ scale: 1 }}
                                                    exit={{ scale: 0 }}
                                                    transition={{ type: "spring", stiffness: 500, damping: 22 }}
                                                    className="absolute -top-0.5 -right-0.5 min-w-[1.1rem] h-4.5 px-1 bg-gradient-to-tr from-sky-500 to-indigo-600 text-white text-[10px] font-bold rounded-full flex items-center justify-center shadow-lg"
                                                >
                                                    {cartCount}
                                                </motion.span>
                                            )}
                                        </AnimatePresence>
                                    </button>
                                )}
                                <Link
                                    to="/wishlist"
                                    className="text-white/85 hover:text-white transition-all relative p-2 hover:bg-white/10 rounded-xl"
                                    title="Wishlist"
                                >
                                    <Heart className="h-6 w-6" />
                                    <AnimatePresence>
                                        {wishCount > 0 && (
                                            <motion.span
                                                key={wishCount}
                                                initial={{ scale: 0 }}
                                                animate={{ scale: 1 }}
                                                exit={{ scale: 0 }}
                                                transition={{ type: "spring", stiffness: 500, damping: 22 }}
                                                className="absolute -top-0.5 -right-0.5 min-w-[1.1rem] h-4.5 px-1 bg-gradient-to-tr from-pink-500 to-rose-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center shadow-lg"
                                            >
                                                {wishCount}
                                            </motion.span>
                                        )}
                                    </AnimatePresence>
                                </Link>
                                <div className="flex items-center space-x-2.5 bg-white/15 backdrop-blur px-4 py-2 rounded-2xl border border-white/20 shadow-sm">
                                    <div className="bg-white p-1.5 rounded-lg text-sky-600">
                                        <User className="h-4 w-4" />
                                    </div>
                                    <div className="leading-none">
                                        <span className="text-sm font-bold text-white">{user.name}</span>
                                        {isAdmin && (
                                            <p className="text-[10px] font-black text-cyan-200 uppercase tracking-wider mt-0.5">Admin</p>
                                        )}
                                    </div>
                                </div>
                                <button
                                    onClick={handleLogout}
                                    className="p-2 text-white/80 hover:text-red-200 hover:bg-white/10 rounded-xl transition-all"
                                    title="Logout"
                                >
                                    <LogOut className="h-5 w-5" />
                                </button>
                            </>
                        ) : (
                            <div className="space-x-4 flex items-center">
                                <Link to="/login" className="text-white/85 hover:text-white font-bold transition-colors">Login</Link>
                                <motion.span whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }} className="inline-block">
                                    <Link to="/register" className="flex items-center gap-1.5 bg-gradient-to-tr from-sky-600 to-indigo-600 text-white px-6 py-2.5 rounded-xl font-bold hover:from-sky-700 hover:to-indigo-700 transition-all shadow-lg shadow-sky-200 active:scale-95">
                                        <Sparkles className="h-4 w-4" /> Register
                                    </Link>
                                </motion.span>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
