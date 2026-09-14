import React from 'react';
import { Trash2, Plus, Minus } from 'lucide-react';
import { getProductImage } from '../lib/productArt';

const CartItem = ({ item, updateQty, removeItem }) => {
    const { product, quantity, subtotal } = item;

    return (
        <li className="flex py-8 px-6 md:px-10 hover:bg-gray-50/50 transition-colors group">
            <div className="h-28 w-28 flex-shrink-0 overflow-hidden rounded-2xl bg-gray-50 border border-gray-100 p-2 relative group-hover:scale-105 transition-transform duration-500">
                <img
                    src={getProductImage(product)}
                    alt={product.name}
                    className="h-full w-full object-cover"
                />
            </div>

            <div className="ml-8 flex flex-1 flex-col justify-between">
                <div>
                    <div className="flex justify-between items-start">
                        <div>
                            <h3 className="text-xl font-black text-gray-900 tracking-tight leading-tight group-hover:text-neutral-900 transition-colors">
                                {product.name}
                            </h3>
                            <p className="mt-1 text-xs text-gray-400 font-bold uppercase tracking-widest">{product.category}</p>
                        </div>
                        <p className="text-xl font-black text-gray-900 italic">${subtotal.toFixed(2)}</p>
                    </div>
                </div>

                <div className="flex items-center justify-between mt-4">
                    <div className="flex items-center space-x-4 bg-gray-50 p-1.5 rounded-xl border border-gray-100">
                        <button 
                            onClick={() => updateQty(product._id, quantity - 1)}
                            className="w-8 h-8 flex items-center justify-center rounded-lg bg-white shadow-sm text-gray-500 hover:text-neutral-900 hover:shadow-md transition-all active:scale-90"
                        >
                            <Minus className="h-4 w-4" />
                        </button>
                        <span className="w-6 text-center font-black text-gray-900">{quantity}</span>
                        <button 
                            onClick={() => updateQty(product._id, quantity + 1)}
                            className="w-8 h-8 flex items-center justify-center rounded-lg bg-white shadow-sm text-gray-500 hover:text-neutral-900 hover:shadow-md transition-all active:scale-90"
                        >
                            <Plus className="h-4 w-4" />
                        </button>
                    </div>

                    <button
                        type="button"
                        onClick={() => removeItem(product._id)}
                        className="flex items-center text-xs font-black uppercase tracking-widest text-neutral-500 hover:text-neutral-800 transition-all group/remove"
                    >
                        <div className="p-2 rounded-lg group-hover/remove:bg-neutral-100 transition-colors mr-2">
                            <Trash2 className="h-4 w-4" />
                        </div>
                        Remove
                    </button>
                </div>
            </div>
        </li>
    );
};

export default CartItem;
