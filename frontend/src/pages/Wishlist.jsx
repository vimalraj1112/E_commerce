import React, { useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import { Heart, ShoppingCart, Trash2, ArrowRight } from "lucide-react";
import { productApi } from "../api/productApi";
import { useWishlist } from "../context/WishlistContext";
import { useCart } from "../context/CartContext";
import { getProductImage } from "../lib/productArt";
import { fadeUp, staggerContainer } from "../utils/motion";

const Wishlist = () => {
  const { ids, toggle, isSaved } = useWishlist();
  const { addItem } = useCart();
  const [products, setProducts] = React.useState([]);
  const [loaded, setLoaded] = React.useState(false);

  React.useEffect(() => {
    productApi.getAll()
      .then(({ data }) => setProducts(data))
      .catch(() => setProducts([]))
      .finally(() => setLoaded(true));
  }, []);

  const items = useMemo(() => products.filter((p) => isSaved(p._id)), [products, ids]);

  if (!loaded) {
    return (
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {[1, 2].map((i) => (
          <div key={i} className="shimmer h-72 rounded-3xl bg-white/60" />
        ))}
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="text-center py-28 max-w-md mx-auto">
        <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring", stiffness: 260, damping: 16 }} className="inline-flex h-20 w-20 items-center justify-center rounded-3xl bg-gradient-to-tr from-neutral-800 to-neutral-600 shadow-xl shadow-neutral-300 mb-6">
          <Heart className="h-9 w-9 text-white" />
        </motion.div>
        <h2 className="text-3xl font-black text-gray-900 font-display mb-2">Your wishlist is empty</h2>
        <p className="text-gray-500 font-medium mb-8">Tap the heart on any product to save it here for later.</p>
        <Link to="/" className="inline-flex items-center gap-2 rounded-2xl bg-gradient-to-tr from-neutral-900 to-neutral-700 text-white px-7 py-4 font-black">
          Discover Products <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      <div className="flex items-end justify-between">
        <div>
          <h1 className="text-4xl font-black text-gray-900 font-display tracking-tight">
            Your <span className="text-gradient">Wishlist</span>
          </h1>
          <p className="text-gray-500 font-medium mt-1">{items.length} saved {items.length === 1 ? "piece" : "pieces"}</p>
        </div>
      </div>

      <motion.div variants={staggerContainer(0.06)} initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-40px" }} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <AnimatePresence mode="popLayout">
          {items.map((p) => (
            <motion.div key={p._id} variants={fadeUp} layout exit={{ opacity: 0, scale: 0.9 }} className="group glass-card rounded-3xl overflow-hidden shadow-sm hover:shadow-2xl hover:-translate-y-1 transition-all">
              <Link to={`/product/${p._id}`} className="block relative aspect-[4/5] overflow-hidden">
                <img src={getProductImage(p)} alt={p.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                <span className="absolute top-3 right-3 bg-white/90 backdrop-blur px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest shadow-sm">
                  {p.category}
                </span>
              </Link>
              <div className="p-5">
                <h3 className="font-black text-gray-900 mb-1 group-hover:text-neutral-700 transition-colors line-clamp-1">{p.name}</h3>
                <div className="flex items-center justify-between mt-3">
                  <span className="text-xl font-black text-gray-900">${Number(p.price).toFixed(2)}</span>
                  <div className="flex items-center space-x-2">
                    <motion.button
                      whileTap={{ scale: 0.85 }}
                      onClick={() => toggle(p._id)}
                      className="p-2.5 bg-gray-50 text-neutral-700 hover:bg-neutral-100 rounded-xl transition-colors"
                      title="Remove"
                    >
                      <Trash2 className="h-4 w-4" />
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.92 }}
                      onClick={() => addItem(p, 1)}
                      className="flex items-center gap-1.5 rounded-xl bg-gradient-to-tr from-neutral-900 to-neutral-700 text-white px-4 py-2.5 text-sm font-bold shadow-lg shadow-neutral-300"
                    >
                      <ShoppingCart className="h-4 w-4" /> Add
                    </motion.button>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>
    </div>
  );
};

export default Wishlist;