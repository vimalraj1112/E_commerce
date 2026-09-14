import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { productApi } from '../api/productApi';
import { orderApi } from '../api/orderApi';
import { Plus, Edit, Trash2, Package, ShoppingBag, CheckCircle, Clock, Truck, XCircle, Loader2, BarChart3 } from 'lucide-react';
import { useToast } from '../context/ToastContext';
import AdminAnalytics from '../components/AdminAnalytics';

const AdminDashboard = () => {
    const { toast } = useToast();
    const [products, setProducts] = useState([]);
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('products');
    const [pendingCount, setPendingCount] = useState(0);
    
    // Product Form State
    const [showForm, setShowForm] = useState(false);
    const [editingProduct, setEditingProduct] = useState(null);
    const [formData, setFormData] = useState({
        name: '', description: '', price: '', category: '', stock_quantity: ''
    });
    const [imageFile, setImageFile] = useState(null);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        setLoading(true);
        try {
            const [prodRes, orderRes] = await Promise.all([
                productApi.getAll(),
                orderApi.getAll()
            ]);
            setProducts(prodRes.data);
            setOrders(orderRes.data);
            const pending = orderRes.data.filter(o => o.status === 'Pending').length;
            setPendingCount(pending);
        } catch (error) {
            console.error('Failed to fetch admin data', error);
        } finally {
            setLoading(false);
        }
    };

    const handleProductSubmit = async (e) => {
        e.preventDefault();
        const data = new FormData();
        Object.keys(formData).forEach(key => data.append(key, formData[key]));
        if (imageFile) data.append('image', imageFile);

        try {
            if (editingProduct) {
                await productApi.update(editingProduct._id, data);
            } else {
                await productApi.add(data);
            }
            setShowForm(false);
            setEditingProduct(null);
            setFormData({ name: '', description: '', price: '', category: '', stock_quantity: '' });
            setImageFile(null);
            fetchData();
            toast(editingProduct ? 'Product updated! ✏️' : 'Product created! ✨', 'success');
        } catch (error) {
            toast('Failed to save product', 'error');
        }
    };

    const handleDeleteProduct = async (id) => {
        if (window.confirm('Are you sure you want to delete this product?')) {
            try {
                await productApi.delete(id);
                fetchData();
                toast('Product deleted 🗑️', 'info');
            } catch (error) {
                toast('Failed to delete product', 'error');
            }
        }
    };

    const handleUpdateStatus = async (orderId, status) => {
        try {
            await orderApi.updateStatus(orderId, status);
            fetchData();
            toast(`Order marked as ${status}`, 'success');
        } catch (error) {
            toast('Failed to update status', 'error');
        }
    };

    if (loading) return <div className="flex justify-center py-20"><Loader2 className="animate-spin h-10 w-10 text-neutral-900" /></div>;

    return (
        <div className="space-y-8 animate-in fade-in duration-700">
            <header className="relative glass-card p-10 rounded-[3rem] shadow-2xl shadow-gray-200/40 overflow-hidden group">
                {/* Background Pattern/Image Overlay */}
                <div className="absolute inset-0 opacity-10 group-hover:opacity-20 transition-opacity pointer-events-none">
                    <img 
                        src="/ecommerce_dashboard_bg_1773158716008.png" 
                        alt="" 
                        className="w-full h-full object-cover grayscale"
                    />
                </div>
                
                <div className="relative flex flex-col md:flex-row justify-between items-center gap-6">
                    <div className="text-center md:text-left">
                        <h1 className="text-4xl font-black text-gray-900 tracking-tight leading-none mb-3">Admin Authority</h1>
                        <p className="text-gray-500 font-medium">Control center for your premium marketplace inventory and orders.</p>
                    </div>
                    <div className="flex bg-gray-50 p-1.5 rounded-2xl border border-gray-100 shadow-inner">
                        {[
                          { key: "products", label: "Catalog", icon: Package },
                          { key: "orders", label: "Orders", icon: ShoppingBag, badge: pendingCount },
                          { key: "analytics", label: "Analytics", icon: BarChart3 },
                        ].map((t) => (
                          <button
                            key={t.key}
                            onClick={() => setActiveTab(t.key)}
                            className={`relative px-5 md:px-7 py-3 rounded-xl font-black text-sm uppercase tracking-widest transition-all flex items-center gap-2 ${activeTab === t.key ? "text-white" : "text-gray-400 hover:text-gray-600"}`}
                          >
                            {activeTab === t.key && (
                              <motion.span
                                layoutId="admin-pill"
                                className="absolute inset-0 rounded-xl bg-gradient-to-tr from-neutral-900 to-neutral-700 shadow-lg shadow-neutral-300"
                                transition={{ type: "spring", stiffness: 380, damping: 30 }}
                              />
                            )}
                            <t.icon className="relative h-4 w-4" />
                            <span className="relative">{t.label}</span>
                            {t.badge > 0 && (
                              <span className="relative -ml-1 -mt-3 bg-neutral-700 text-white text-[10px] h-5 min-w-5 px-1 flex items-center justify-center rounded-full border-2 border-white animate-bounce">
                                {t.badge}
                              </span>
                            )}
                          </button>
                        ))}
                    </div>
                </div>
            </header>

            {activeTab === 'products' ? (
                <div className="space-y-6">
                    <div className="flex justify-between items-center">
                        <h2 className="text-2xl font-bold text-gray-900">Inventory Management</h2>
                        <button 
                            onClick={() => { setShowForm(true); setEditingProduct(null); }}
                            className="bg-neutral-900 text-white px-4 py-2 rounded-xl flex items-center font-bold hover:bg-neutral-800 transition-all shadow-md active:scale-95"
                        >
                            <Plus className="h-5 w-5 mr-1" /> Add Product
                        </button>
                    </div>

                    {showForm && (
                        <div className="glass-card p-8 rounded-3xl shadow-xl border border-white/40 animate-in fade-in slide-in-from-top-4 duration-300">
                            <h3 className="text-xl font-bold mb-6 text-gray-900">{editingProduct ? 'Edit Product' : 'New Product'}</h3>
                            <form onSubmit={handleProductSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <input
                                    placeholder="Product Name"
                                    value={formData.name}
                                    required
                                    className="p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-neutral-500 focus:outline-none transition-all"
                                    onChange={e => setFormData({...formData, name: e.target.value})}
                                />
                                <input
                                    placeholder="Category"
                                    value={formData.category}
                                    required
                                    className="p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-neutral-500 focus:outline-none transition-all"
                                    onChange={e => setFormData({...formData, category: e.target.value})}
                                />
                                <input
                                    type="number"
                                    placeholder="Price"
                                    value={formData.price}
                                    required
                                    className="p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-neutral-500 focus:outline-none transition-all"
                                    onChange={e => setFormData({...formData, price: e.target.value})}
                                />
                                <input
                                    type="number"
                                    placeholder="Stock Quantity"
                                    value={formData.stock_quantity}
                                    required
                                    className="p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-neutral-500 focus:outline-none transition-all"
                                    onChange={e => setFormData({...formData, stock_quantity: e.target.value})}
                                />
                                <textarea
                                    placeholder="Description"
                                    className="p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-neutral-500 focus:outline-none transition-all md:col-span-2"
                                    value={formData.description}
                                    onChange={e => setFormData({...formData, description: e.target.value})}
                                />
                                <div className="md:col-span-2">
                                    <label className="block text-sm font-bold text-gray-700 mb-2">Product Image</label>
                                    <input
                                        type="file"
                                        accept="image/*"
                                        className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-sm file:font-bold file:bg-neutral-50 file:text-neutral-800 hover:file:bg-neutral-100 transition-all"
                                        onChange={e => setImageFile(e.target.files[0])}
                                    />
                                </div>
                                <div className="md:col-span-2 flex justify-end space-x-3 mt-4">
                                    <button 
                                        type="button" 
                                        onClick={() => setShowForm(false)}
                                        className="px-6 py-2 text-gray-500 font-bold hover:text-gray-700 transition-all"
                                    >
                                        Cancel
                                    </button>
                                    <button 
                                        type="submit"
                                        className="bg-neutral-900 text-white px-8 py-2 rounded-xl font-bold hover:bg-neutral-800 transition-all shadow-lg active:scale-95"
                                    >
                                        {editingProduct ? 'Update Product' : 'Create Product'}
                                    </button>
                                </div>
                            </form>
                        </div>
                    )}

                    <div className="glass-card rounded-3xl shadow-sm overflow-hidden">
                        {/* Desktop View Table */}
                        <div className="hidden lg:block overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-100">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Product</th>
                                        <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Category</th>
                                        <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Price</th>
                                        <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Stock</th>
                                        <th className="px-6 py-4 text-right text-xs font-bold text-gray-500 uppercase tracking-wider">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-50">
                                    {products.map((product) => (
                                        <tr key={product._id} className="hover:bg-gray-50 transition-colors">
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="flex items-center">
                                                    <div className="h-12 w-12 flex-shrink-0 bg-gray-100 rounded-lg overflow-hidden">
                                                        <img 
                                                            src={product.image_path ? `/${product.image_path}` : 'https://via.placeholder.com/50'} 
                                                            alt="" 
                                                            className="h-full w-full object-cover"
                                                            onError={(e) => {
                                                                const filename = product.image_path.split('/').pop();
                                                                e.target.src = `/uploads/${filename}`;
                                                            }}
                                                        />
                                                    </div>
                                                    <div className="ml-4">
                                                        <div className="text-sm font-bold text-gray-900">{product.name}</div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span className="px-3 py-1 inline-flex text-xs leading-5 font-bold rounded-full bg-neutral-100 text-neutral-700">
                                                    {product.category}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-gray-900">${product.price?.toFixed(2)}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-gray-500">{product.stock_quantity}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-2">
                                                <button 
                                                    onClick={() => {
                                                        setEditingProduct(product);
                                                        setFormData({
                                                            name: product.name,
                                                            description: product.description,
                                                            price: product.price,
                                                            category: product.category,
                                                            stock_quantity: product.stock_quantity
                                                        });
                                                        setShowForm(true);
                                                    }}
                                                    className="text-neutral-900 hover:text-neutral-900 p-2 hover:bg-neutral-50 rounded-lg transition-all"
                                                >
                                                    <Edit className="h-5 w-5" />
                                                </button>
                                                <button 
                                                    onClick={() => handleDeleteProduct(product._id)}
                                                    className="text-neutral-800 hover:text-neutral-900 p-2 hover:bg-neutral-100 rounded-lg transition-all"
                                                >
                                                    <Trash2 className="h-5 w-5" />
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        {/* Mobile View Cards */}
                        <div className="lg:hidden divide-y divide-gray-50">
                            {products.map((product) => (
                                <div key={product._id} className="p-6 space-y-4">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center">
                                            <div className="h-14 w-14 bg-gray-100 rounded-xl overflow-hidden flex-shrink-0">
                                                <img 
                                                    src={product.image_path ? `/${product.image_path}` : 'https://via.placeholder.com/50'} 
                                                    alt="" 
                                                    className="h-full w-full object-cover"
                                                    onError={(e) => {
                                                        const filename = product.image_path.split('/').pop();
                                                        e.target.src = `/uploads/${filename}`;
                                                    }}
                                                />
                                            </div>
                                            <div className="ml-4">
                                                <h4 className="text-sm font-black text-gray-900">{product.name}</h4>
                                                <span className="text-[10px] font-bold text-neutral-900 bg-neutral-50 px-2 py-0.5 rounded-full uppercase tracking-tighter">
                                                    {product.category}
                                                </span>
                                            </div>
                                        </div>
                                        <div className="flex space-x-1">
                                            <button 
                                                onClick={() => {
                                                    setEditingProduct(product);
                                                    setFormData({
                                                        name: product.name,
                                                        description: product.description,
                                                        price: product.price,
                                                        category: product.category,
                                                        stock_quantity: product.stock_quantity
                                                    });
                                                    setShowForm(true);
                                                }}
                                                className="p-2 text-gray-400 hover:text-neutral-900 transition-colors"
                                            >
                                                <Edit className="h-5 w-5" />
                                            </button>
                                            <button 
                                                onClick={() => handleDeleteProduct(product._id)}
                                                className="p-2 text-gray-400 hover:text-neutral-800 transition-colors"
                                            >
                                                <Trash2 className="h-5 w-5" />
                                            </button>
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-2 gap-4 bg-gray-50 p-4 rounded-2xl">
                                        <div>
                                            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Price</p>
                                            <p className="text-sm font-black text-gray-900">${product.price?.toFixed(2)}</p>
                                        </div>
                                        <div>
                                            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Stock</p>
                                            <p className="text-sm font-black text-gray-900">{product.stock_quantity}</p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            ) : activeTab === 'orders' ? (
                <div className="space-y-6">
                    <h2 className="text-2xl font-bold text-gray-900">All Customer Orders</h2>
                    <div className="glass-card rounded-3xl shadow-sm overflow-hidden">
                        {/* Desktop Table */}
                        <div className="hidden lg:block overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-100">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Order ID</th>
                                        <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Date</th>
                                        <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Total</th>
                                        <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Status</th>
                                        <th className="px-6 py-4 text-right text-xs font-bold text-gray-500 uppercase tracking-wider">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-50">
                                    {orders.map((order) => (
                                        <tr key={order._id} className="hover:bg-gray-50 transition-colors">
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-black text-gray-900 uppercase tracking-tighter">
                                                #{order._id.slice(-8)}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 font-medium">
                                                {new Date(order.created_at).toLocaleDateString()}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-extrabold text-neutral-900">${order.total_price.toFixed(2)}</td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span className={`px-3 py-1 inline-flex text-xs leading-5 font-bold rounded-full ${order.status === 'Delivered' ? 'bg-neutral-800 text-white' : 'bg-neutral-200 text-neutral-800'}`}>
                                                    {order.status}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                                <select 
                                                    value={order.status}
                                                    onChange={(e) => handleUpdateStatus(order._id, e.target.value)}
                                                    className="text-sm font-bold border-gray-200 rounded-lg p-1 bg-gray-50 text-gray-700 focus:outline-none focus:ring-2 focus:ring-neutral-500 transition-all cursor-pointer"
                                                >
                                                    <option value="Pending">Pending</option>
                                                    <option value="Processing">Processing</option>
                                                    <option value="Shipped">Shipped</option>
                                                    <option value="Delivered">Delivered</option>
                                                    <option value="Cancelled">Cancelled</option>
                                                </select>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        {/* Mobile Cards */}
                        <div className="lg:hidden divide-y divide-gray-50">
                            {orders.map((order) => (
                                <div key={order._id} className="p-6 space-y-4">
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Order ID</p>
                                            <h4 className="text-sm font-black text-gray-900 uppercase">#{order._id.slice(-8)}</h4>
                                        </div>
                                        <span className={`px-3 py-1 text-[10px] font-black rounded-full uppercase tracking-wider ${order.status === 'Delivered' ? 'bg-neutral-800 text-white' : 'bg-neutral-200 text-neutral-800'}`}>
                                            {order.status}
                                        </span>
                                    </div>
                                    <div className="grid grid-cols-2 gap-4 bg-gray-50 p-4 rounded-2xl">
                                        <div>
                                            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Amount</p>
                                            <p className="text-sm font-black text-neutral-900">${order.total_price.toFixed(2)}</p>
                                        </div>
                                        <div>
                                            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Date</p>
                                            <p className="text-sm font-bold text-gray-900">{new Date(order.created_at).toLocaleDateString()}</p>
                                        </div>
                                    </div>
                                    <div className="pt-2">
                                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">Update Status</p>
                                        <select 
                                            value={order.status}
                                            onChange={(e) => handleUpdateStatus(order._id, e.target.value)}
                                            className="w-full text-sm font-bold border border-gray-200 rounded-xl p-3 bg-white text-gray-700 focus:ring-2 focus:ring-neutral-500 transition-all font-black uppercase tracking-widest"
                                        >
                                            <option value="Pending">Pending</option>
                                            <option value="Processing">Processing</option>
                                            <option value="Shipped">Shipped</option>
                                            <option value="Delivered">Delivered</option>
                                            <option value="Cancelled">Cancelled</option>
                                        </select>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            ) : (
                <AdminAnalytics orders={orders} products={products} />
            )}
        </div>
    );
};

export default AdminDashboard;
