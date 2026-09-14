import React, { useState } from 'react';
import { orderApi } from '../api/orderApi';
import CartItem from '../components/CartItem';
import { ShoppingBag, CreditCard, Loader2 } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useToast } from '../context/ToastContext';
import { useCart } from '../context/CartContext';
import { motion } from 'framer-motion';
import { fadeUp, staggerContainer } from '../utils/motion';

const Cart = () => {
    const { cart, updateQty: updateQuantity, removeItem, fetchCart } = useCart();
    const [placingOrder, setPlacingOrder] = useState(false);
    const navigate = useNavigate();
    const { toast } = useToast();

    const handleCheckout = async () => {
        setPlacingOrder(true);
        try {
            await orderApi.place();
            await fetchCart();
            toast('Order placed successfully! 🎉');
            navigate('/orders');
        } catch (error) {
            toast(error.response?.data?.msg || 'Checkout failed — try again.', 'error');
        } finally {
            setPlacingOrder(false);
        }
    };

    if (cart.items.length === 0) return (
        <div className="text-center py-20 glass-card rounded-3xl shadow-sm">
            <ShoppingBag className="mx-auto h-12 w-12 text-gray-400 mb-4" />
            <h2 className="text-xl font-bold text-gray-900 mb-2">Your cart is empty</h2>
            <p className="text-gray-500 mb-8">Looks like you haven't added anything to your cart yet.</p>
            <Link to="/" className="bg-primary-600 text-white px-6 py-3 rounded-xl hover:bg-primary-700 transition-colors font-medium">
                Continue Shopping
            </Link>
        </div>
    );

    return (
        <div className="max-w-7xl mx-auto space-y-10 animate-in fade-in duration-500">
            <header className="flex flex-col md:flex-row justify-between items-end gap-4">
                <div>
                    <h1 className="text-4xl font-black text-gray-900 tracking-tight">Shopping Bag</h1>
                    <p className="text-gray-500 font-medium">Review your items and proceed to secure checkout.</p>
                </div>
                <div className="bg-gray-50 px-6 py-3 rounded-2xl border border-gray-100 shadow-sm">
                    <span className="text-sm font-bold text-gray-400 uppercase tracking-widest mr-2">Subtotal:</span>
                    <span className="text-2xl font-black text-primary-600">${cart.total_price.toFixed(2)}</span>
                </div>
            </header>

            <div className="lg:grid lg:grid-cols-12 lg:gap-x-12 lg:items-start">
                <div className="lg:col-span-8 space-y-6">
                    <div className="glass-card rounded-[2.5rem] shadow-xl shadow-gray-200/40 overflow-hidden">
                        <ul role="list" className="divide-y divide-gray-50">
                            {cart.items.map((item) => (
                                <CartItem 
                                    key={item.product._id} 
                                    item={item} 
                                    updateQty={updateQuantity}
                                    removeItem={removeItem}
                                />
                            ))}
                        </ul>
                    </div>

                    <Link to="/" className="inline-flex items-center text-gray-500 hover:text-primary-600 font-bold transition-all group">
                        <div className="bg-gray-100 p-2 rounded-xl mr-3 group-hover:bg-primary-50 transition-colors">
                            <ShoppingBag className="h-5 w-5" />
                        </div>
                        Continue Shopping
                    </Link>
                </div>

                <section className="lg:col-span-4 mt-12 lg:mt-0 lg:sticky lg:top-24">
                    <div className="glass-card rounded-[2.5rem] shadow-2xl shadow-primary-900/10 p-8 space-y-8">
                        <h2 className="text-2xl font-black text-gray-900 tracking-tight">Summary</h2>
                        
                        <div className="space-y-4">
                            <div className="flex items-center justify-between text-sm font-bold">
                                <span className="text-gray-400 uppercase tracking-wider">Subtotal</span>
                                <span className="text-gray-900">${cart.total_price.toFixed(2)}</span>
                            </div>
                            <div className="flex items-center justify-between text-sm font-bold">
                                <span className="text-gray-400 uppercase tracking-wider">Shipping</span>
                                <span className="text-neutral-800 uppercase tracking-wider">Free</span>
                            </div>
                            <div className="pt-4 border-t border-gray-100 flex items-center justify-between">
                                <span className="text-xl font-black text-gray-900">Total</span>
                                <span className="text-2xl font-black text-primary-600">${cart.total_price.toFixed(2)}</span>
                            </div>
                        </div>

                        <button
                            onClick={handleCheckout}
                            disabled={placingOrder}
                            className="w-full bg-primary-600 hover:bg-primary-700 text-white py-5 rounded-2xl font-black text-lg shadow-xl shadow-primary-200 transition-all active:scale-[0.98] flex items-center justify-center group"
                        >
                            {placingOrder ? <Loader2 className="animate-spin h-6 w-6" /> : (
                                <>
                                    <CreditCard className="mr-3 h-6 w-6 group-hover:rotate-6 transition-transform" />
                                    Checkout Now
                                </>
                            )}
                        </button>
                        
                        <div className="flex items-center justify-center space-x-4">
                            <img src="https://upload.wikimedia.org/wikipedia/commons/5/5e/Visa_Inc._logo.svg" alt="Visa" className="h-4 opacity-30 grayscale hover:grayscale-0 transition-all cursor-not-allowed" />
                            <img src="https://upload.wikimedia.org/wikipedia/commons/2/2a/Mastercard-logo.svg" alt="Mastercard" className="h-6 opacity-30 grayscale hover:grayscale-0 transition-all cursor-not-allowed" />
                        </div>
                    </div>
                </section>
            </div>
        </div>
    );
};

export default Cart;
