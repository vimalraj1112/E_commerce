import React, { useRef } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ShoppingCart, Eye, Sparkles, Heart } from "lucide-react";
import { useWishlist } from "../context/WishlistContext";
import { getProductImage } from "../lib/productArt";
import { fadeUp, springTap } from "../utils/motion";

const ProductCard = ({ product, addToCart, index = 0 }) => {
  const { isSaved, toggle } = useWishlist();
  const saved = isSaved(product._id);
  const ref = useRef(null);

  // Light 3D tilt on hover (cursor-tracked)
  const handleMove = (e) => {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    el.style.transform = `perspective(900px) rotateY(${x * 7}deg) rotateX(${y * -7}deg) translateY(-6px)`;
  };
  const handleLeave = () => {
    const el = ref.current;
    if (el) el.style.transform = "perspective(900px) rotateY(0deg) rotateX(0deg) translateY(0)";
  };

  const lowStock = product.stock_quantity > 0 && product.stock_quantity < 8;

  return (
    <motion.div
      variants={fadeUp}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-40px" }}
      layout
      className="group outline-none"
    >
      <div
        ref={ref}
        onMouseMove={handleMove}
        onMouseLeave={handleLeave}
        style={{ transition: "transform .35s cubic-bezier(.22,.61,.36,1), box-shadow .35s ease" }}
        className="glass-card relative rounded-[2rem] shadow-sm hover:shadow-2xl hover:shadow-neutral-300 overflow-hidden flex flex-col h-full will-change-transform"
      >
        {/* Soft grayscale sheen on hover */}
        <div className="pointer-events-none absolute inset-0 z-20 opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-gradient-to-tr from-neutral-300/20 via-transparent to-neutral-300/20" />

        {/* Trending badge */}
        {product.trending && (
          <motion.span
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 300, damping: 15 }}
            className="absolute top-3 left-3 z-30 flex items-center gap-1 bg-gradient-to-tr from-neutral-800 to-neutral-600 text-white text-[10px] font-black uppercase tracking-widest px-2.5 py-1 rounded-full shadow-lg"
          >
            <Sparkles className="h-3 w-3" /> Trending
          </motion.span>
        )}

        <Link to={`/product/${product._id}`} className="relative aspect-[4/5] overflow-hidden flex items-center justify-center z-10">
          <img
            src={getProductImage(product)}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
          />
          <div className="absolute top-3 right-3">
            <span className="bg-white/90 backdrop-blur px-3 py-1 rounded-full text-[10px] font-black text-gray-900 uppercase tracking-widest shadow-sm border border-gray-100">
              {product.category}
            </span>
          </div>
        </Link>

        <div className="p-5 flex flex-col flex-grow relative z-10">
          <div className="mb-3">
            <h3 className="text-base font-black text-gray-900 leading-tight mb-1 group-hover:text-neutral-700 transition-colors line-clamp-1">{product.name}</h3>
            {lowStock && (
              <span className="inline-flex items-center gap-1 text-[10px] font-bold text-neutral-600 bg-neutral-100 px-2 py-0.5 rounded-full mt-1">
                <span className="h-1.5 w-1.5 rounded-full bg-neutral-500 animate-pulse" />
                Only {product.stock_quantity} left
              </span>
            )}
          </div>

          <div className="mt-auto flex items-center justify-between pt-3 border-t border-gray-50">
            <div className="flex flex-col">
              <span className="text-xs text-gray-400 font-bold">Price</span>
              <span className="text-xl font-black text-gray-900 tracking-tight">${product.price?.toFixed(2)}</span>
            </div>
            <div className="flex items-center space-x-2">
              <motion.div whileHover={{ scale: 1.1 }} whileTap={springTap}>
                <Link
                  to={`/product/${product._id}`}
                  className="p-3 bg-gray-50 text-gray-400 hover:text-neutral-700 hover:bg-neutral-100 rounded-xl transition-all flex"
                  title="View Details"
                >
                  <Eye className="h-5 w-5" />
                </Link>
              </motion.div>
              <motion.button
                whileTap={{ scale: 0.8 }}
                onClick={() => toggle(product._id)}
                className={`p-3 rounded-xl transition-all ${saved ? "bg-neutral-800 text-white shadow-lg shadow-neutral-300" : "bg-gray-50 text-gray-400 hover:text-neutral-800 hover:bg-neutral-100"}`}
                title={saved ? "Remove from wishlist" : "Save to wishlist"}
              >
                <Heart className={`h-5 w-5 ${saved ? "fill-current" : ""}`} />
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.08 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => addToCart(product._id)}
                className="p-3 bg-gradient-to-tr from-neutral-900 to-neutral-700 text-white rounded-xl hover:from-neutral-700 hover:to-neutral-500 shadow-lg shadow-neutral-400/80 transition-all"
                title="Add to Cart"
              >
                <ShoppingCart className="h-5 w-5" />
              </motion.button>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default ProductCard;