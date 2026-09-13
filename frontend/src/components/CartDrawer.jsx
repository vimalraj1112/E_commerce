import React, { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { ShoppingBag, Trash2, Plus, Minus, X, ArrowRight } from "lucide-react";
import { useCart } from "../context/CartContext";
import { getProductImage } from "../lib/productArt";
import { fadeUp, staggerContainer } from "../utils/motion";

const CartDrawer = () => {
  const { cartItems, totalPrice, drawerOpen, closeDrawer, updateQty, removeItem } = useCart();
  const navigate = useNavigate();

  // Lock body scroll while open
  useEffect(() => {
    document.body.style.overflow = drawerOpen ? "hidden" : "";
    return () => (document.body.style.overflow = "");
  }, [drawerOpen]);

  const goCheckout = () => {
    closeDrawer();
    navigate("/cart");
  };

  return (
    <AnimatePresence>
      {drawerOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeDrawer}
            className="fixed inset-0 z-[96] bg-black/40 backdrop-blur-sm"
          />

          {/* Panel */}
          <motion.aside
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", stiffness: 300, damping: 32 }}
            className="fixed top-0 right-0 bottom-0 z-[98] flex w-full max-w-md flex-col bg-[#0b1220] text-white shadow-2xl"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-5 border-b border-white/10">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-tr from-sky-500 to-indigo-500">
                  <ShoppingBag className="h-5 w-5 text-white" />
                </div>
                <div>
                  <p className="font-black font-display leading-none">Your Bag</p>
                  <p className="text-[11px] text-white/50 font-medium mt-1">
                    {cartItems.length} {cartItems.length === 1 ? "item" : "items"}
                  </p>
                </div>
              </div>
              <button onClick={closeDrawer} className="p-2 text-white/50 hover:text-white transition-colors">
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Items */}
            <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4">
              {cartItems.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center opacity-80">
                  <div className="bg-white/5 rounded-2xl p-6 mb-4">
                    <ShoppingBag className="h-10 w-10 text-white/30" />
                  </div>
                  <p className="font-bold">Your bag is empty</p>
                  <p className="text-sm text-white/50 mt-1">Add something special ✨</p>
                  <button
                    onClick={closeDrawer}
                    className="mt-5 rounded-xl bg-gradient-to-tr from-sky-500 to-indigo-500 px-5 py-2.5 text-sm font-bold"
                  >
                    Start Shopping
                  </button>
                </div>
              ) : (
                <motion.div variants={staggerContainer(0.05)} initial="hidden" animate="visible" className="space-y-3">
                  {cartItems.map((item) => (
                    <motion.div
                      key={item.product?._id}
                      variants={fadeUp}
                      layout
                      className="flex gap-4 rounded-2xl bg-white/5 border border-white/10 p-3"
                    >
                      <div className="h-20 w-20 shrink-0 rounded-xl bg-white overflow-hidden p-1 flex items-center justify-center">
                        <img
                          src={getProductImage(item.product)}
                          alt={item.product?.name}
                          className="h-full w-full object-cover"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-bold text-sm truncate">{item.product?.name}</p>
                        <p className="text-[11px] text-white/40 font-bold uppercase tracking-wider mb-2">
                          {item.product?.category}
                        </p>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-1 bg-white/10 rounded-lg p-1">
                            <button
                              onClick={() => updateQty(item.product._id, item.quantity - 1)}
                              className="p-1.5 rounded-md hover:bg-white/10 transition-colors"
                            >
                              <Minus className="h-3.5 w-3.5" />
                            </button>
                            <span className="w-6 text-center text-sm font-bold">{item.quantity}</span>
                            <button
                              onClick={() => updateQty(item.product._id, item.quantity + 1)}
                              className="p-1.5 rounded-md hover:bg-white/10 transition-colors"
                            >
                              <Plus className="h-3.5 w-3.5" />
                            </button>
                          </div>
                          <span className="font-black text-sky-300">${item.subtotal?.toFixed(2)}</span>
                        </div>
                      </div>
                      <button
                        onClick={() => removeItem(item.product._id)}
                        className="self-start p-1.5 text-white/40 hover:text-red-400 transition-colors"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </motion.div>
                  ))}
                </motion.div>
              )}
            </div>

            {/* Footer */}
            {cartItems.length > 0 && (
              <div className="border-t border-white/10 px-6 py-5 space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-bold text-white/50 uppercase tracking-wider">Subtotal</span>
                  <span className="text-2xl font-black text-white">${totalPrice.toFixed(2)}</span>
                </div>
                <div className="flex items-center justify-between text-[11px] font-bold text-white/40 uppercase tracking-wider">
                  <span>Shipping</span>
                  <span className="text-emerald-400">Free</span>
                </div>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={goCheckout}
                  className="group flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-tr from-sky-500 to-indigo-500 py-4 font-black shadow-xl shadow-sky-500/25"
                >
                  Checkout Now
                  <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </motion.button>
              </div>
            )}
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
};

export default CartDrawer;