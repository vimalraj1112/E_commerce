import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { orderApi } from '../api/orderApi';
import { Package, Clock, CheckCircle, Truck, XCircle, ChevronRight, Loader2 } from 'lucide-react';

const StatusIcon = ({ status }) => {
    switch (status) {
        case 'Pending': return <Clock className="h-5 w-5 text-neutral-600" />;
        case 'Processing': return <div className="h-5 w-5 border-2 border-neutral-500 border-t-transparent rounded-full animate-spin" />;
        case 'Shipped': return <Truck className="h-5 w-5 text-neutral-600" />;
        case 'Delivered': return <CheckCircle className="h-5 w-5 text-neutral-600" />;
        case 'Cancelled': return <XCircle className="h-5 w-5 text-neutral-600" />;
        default: return <Package className="h-5 w-5 text-gray-500" />;
    }
};

const Orders = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const { data } = await orderApi.getMy();
                setOrders(data);
            } catch (error) {
                console.error('Failed to fetch orders', error);
            } finally {
                setLoading(false);
            }
        };
        fetchOrders();
    }, []);

    if (loading) return <div className="flex justify-center py-12"><Loader2 className="animate-spin text-neutral-900 h-8 w-8" /></div>;

    return (
        <div className="max-w-5xl mx-auto space-y-12 animate-in fade-in duration-500">
            <header>
                <h1 className="text-4xl font-black text-gray-900 tracking-tight">Order History</h1>
                <p className="text-gray-500 font-medium">Track your premium purchases and their status.</p>
            </header>

            {orders.length === 0 ? (
                <div className="text-center py-32 glass-card rounded-[2.5rem] shadow-xl shadow-gray-200/40 italic">
                    <div className="bg-gray-50 p-6 rounded-full inline-block mb-6">
                        <Package className="h-12 w-12 text-gray-300" />
                    </div>
                    <h2 className="text-2xl font-black text-gray-900 mb-2">No orders yet</h2>
                    <p className="text-gray-500 font-medium mb-8">Your future treasures will appear here.</p>
                    <Link to="/" className="bg-neutral-900 text-white px-8 py-4 rounded-2xl hover:bg-neutral-800 transition-all font-black shadow-lg shadow-neutral-100 active:scale-95">
                        Start Shopping
                    </Link>
                </div>
            ) : (
                <div className="space-y-8">
                    {orders.map((order) => (
                        <div key={order._id} className="group glass-card rounded-[2.5rem] shadow-xl shadow-gray-200/40 overflow-hidden hover:shadow-2xl transition-all duration-500">
                            <div className="p-8 md:p-10">
                                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 border-b border-gray-50 pb-8 mb-8">
                                    <div className="space-y-2">
                                        <div className="flex items-center space-x-3">
                                            <span className="text-sm font-black text-gray-900 uppercase tracking-widest bg-gray-50 px-3 py-1 rounded-lg border border-gray-100">
                                                Order #{order._id.slice(-6)}
                                            </span>
                                            <span className="text-xs text-gray-400 font-bold">
                                                {new Date(order.created_at).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                                            </span>
                                        </div>
                                        <p className="text-xs text-gray-400 font-medium">
                                            Full ID: <span className="font-mono">{order._id}</span>
                                        </p>
                                    </div>
                                    <div className="flex items-center space-x-4">
                                        <div className="bg-gray-50 px-6 py-3 rounded-2xl flex items-center space-x-3 border border-gray-100 group-hover:bg-white group-hover:shadow-sm transition-all duration-500">
                                            <StatusIcon status={order.status} />
                                            <span className="font-black text-gray-900 text-sm italic">{order.status}</span>
                                        </div>
                                        <button className="p-2 text-gray-300 hover:text-neutral-900 transition-colors">
                                            <ChevronRight className="h-6 w-6" />
                                        </button>
                                    </div>
                                </div>
                                
                                <div className="space-y-6">
                                    {order.items.map((item, idx) => (
                                        <div key={idx} className="flex justify-between items-center bg-gray-50/50 p-4 rounded-2xl border border-transparent hover:border-gray-100 hover:bg-white transition-all">
                                            <div className="flex items-center space-x-4">
                                                <div className="h-12 w-12 bg-white rounded-xl flex items-center justify-center shadow-sm border border-gray-50 italic font-black text-neutral-900">
                                                    {item.quantity}
                                                </div>
                                                <div>
                                                    <p className="font-black text-gray-900 text-sm">{item.name}</p>
                                                    <p className="text-xs text-gray-400 font-bold uppercase tracking-widest leading-none">Premium Selection</p>
                                                </div>
                                            </div>
                                            <span className="font-black text-gray-900 text-lg">${(item.price * item.quantity).toFixed(2)}</span>
                                        </div>
                                    ))}
                                </div>

                                <div className="mt-10 pt-8 border-t border-gray-50 flex flex-col md:flex-row justify-between items-center gap-4">
                                    <div className="flex items-center space-x-2 text-gray-400">
                                        <Package className="h-5 w-5" />
                                        <span className="text-sm font-bold">Standard Premium Delivery</span>
                                    </div>
                                    <div className="flex flex-col items-end">
                                        <span className="text-xs text-gray-400 font-black uppercase tracking-widest mb-1">Total investment</span>
                                        <span className="text-4xl font-black text-neutral-900 tracking-tighter">${order.total_price.toFixed(2)}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default Orders;
