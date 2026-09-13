import React, { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Sparkles, ArrowRight, TrendingUp } from "lucide-react";
import CountUp from "../components/CountUp";
import { productApi } from "../api/productApi";
import ProductCard from "../components/ProductCard";
import SearchSuggestions from "../components/SearchSuggestions";
import { ProductGridSkeleton, HeroSkeleton } from "../components/Skeletons";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";
import { useCart } from "../context/CartContext";
import { useNavigate } from "react-router-dom";
import { smartSearch, getRecommendations } from "../lib/aiEngine";
import { fadeUp, staggerContainer, springTap } from "../utils/motion";

const CATEGORIES = ["All", "Tech", "Fashion", "Home", "Lifestyle"];

const MARQUEE = [
  "Free Shipping", "Premium Quality", "AI-Powered Recommendations", "Secure Checkout",
  "30-Day Returns", "Handpicked Collection", "5000+ Happy Customers",
];

// ---------- Managed viewed-history ----------
const getViewed = () => JSON.parse(localStorage.getItem("viewedProducts") || "[]");
const trackViewed = (id) => {
  const list = getViewed().filter((x) => x !== id);
  list.unshift(id);
  localStorage.setItem("viewedProducts", JSON.stringify(list.slice(0, 12)));
};

// ---------- Animated marquee ----------
const Marquee = () => (
  <div className="marquee relative overflow-hidden border-y border-gray-100 bg-white/70 backdrop-blur py-3 my-2 select-none">
    <div className="marquee-track gap-8 pr-8">
      {[...MARQUEE, ...MARQUEE].map((t, i) => (
        <span key={i} className="flex items-center gap-8 whitespace-nowrap text-xs font-black uppercase tracking-[0.25em] text-gray-400">
          <span className="text-gradient">{t}</span>
          <span className="text-sky-200">✦</span>
        </span>
      ))}
    </div>
  </div>
);

const Home = () => {
  const [allProducts, setAllProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchFocused, setSearchFocused] = useState(false);
  const [activeCat, setActiveCat] = useState("All");
  const { cartItems: cart, addItem } = useCart();
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const { data } = await productApi.getAll();
      // Fake "trending" flags for top few to power badges (demo)
      const tagged = data.map((p, i) => (i < 4 ? { ...p, trending: true } : p));
      setAllProducts(tagged);
    } catch (error) {
      toast("Couldn't load products — is the backend running?", "error", 5000);
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = async (productId) => {
    if (!user) {
      toast("Please sign in to add items to your bag.", "info");
      navigate("/login");
      return;
    }
    const product = allProducts.find((p) => String(p._id) === String(productId));
    if (!product) return;
    const res = await addItem(product, 1);
    if (res?.ok) trackViewed(productId);
  };

  // ---- AI: smart search + recommendations ----
  const searched = useMemo(() => smartSearch(allProducts, searchTerm), [allProducts, searchTerm]);
  const visible = useMemo(
    () => (activeCat === "All" ? searched : searched.filter((p) => p.category === activeCat)),
    [searched, activeCat]
  );

  const recommendations = useMemo(
    () => getRecommendations(allProducts, { cartItems: cart, viewedIds: getViewed() }),
    [allProducts, cart]
  );

  if (loading) {
    return (
      <div className="space-y-10">
        <HeroSkeleton />
        <ProductGridSkeleton />
      </div>
    );
  }

  return (
    <div className="space-y-12">
      <Marquee />

      {/* ============ PREMIUM HERO ============ */}
      <section className="relative overflow-hidden rounded-[3rem] gradient-border text-white px-8 py-16 md:px-16 md:py-24 bg-[#0b1220]">
        {/* animated multi-color aurora wash */}
        <div className="absolute inset-0 bg-aurora opacity-60" />
        {/* dark vignette to keep text crisp */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#0b1220]/85 via-[#0b1220]/30 to-[#0b1220]/80" />

        {/* ambient orbs */}
        <div className="absolute inset-0">
          <motion.div className="glow-orb h-80 w-80 bg-sky-500/50" style={{ top: "-10%", left: "-6%" }} animate={{ x: [0, 50, -20, 0], y: [0, 30, 60, 0] }} transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }} />
          <motion.div className="glow-orb h-72 w-72 bg-fuchsia-500/40" style={{ bottom: "-15%", right: "-8%" }} animate={{ x: [0, -40, 20, 0], y: [0, -30, -10, 0] }} transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }} />
          <motion.div className="glow-orb h-56 w-56 bg-emerald-400/40" style={{ top: "20%", right: "15%" }} animate={{ x: [0, 30, -40, 0], y: [0, 40, -20, 0] }} transition={{ duration: 22, repeat: Infinity, ease: "easeInOut" }} />
        </div>

        <div className="relative grid md:grid-cols-2 gap-12 items-center">
          <div>
            <motion.div
              variants={staggerContainer(0.12)}
              initial="hidden"
              animate="visible"
              className="space-y-6"
            >
              <motion.div variants={fadeUp} className="inline-flex items-center gap-2 text-[11px] font-black uppercase tracking-[0.25em] text-sky-300 bg-white/5 border border-white/10 rounded-full px-4 py-2 backdrop-blur">
                <span className="sparkle-dot h-1.5 w-1.5 rounded-full bg-sky-400" />
                AI-Curated Premium Collection
              </motion.div>

              <motion.h1 variants={fadeUp} className="font-display font-black text-5xl md:text-6xl leading-[1.02] tracking-tight">
                Elevate Your
                <br />
                <span className="text-gradient-glow">Lifestyle.</span>
              </motion.h1>

              <motion.p variants={fadeUp} className="text-white/70 text-lg font-medium leading-relaxed max-w-md">
                Discover our handpicked collection of premium products, thoughtfully curated by an AI shopping assistant that learns your taste.
              </motion.p>

              <motion.div variants={fadeUp} className="flex flex-wrap gap-4 pt-2">
                <a
                  href="#ai-recommended"
                  className="group inline-flex items-center gap-2 rounded-2xl bg-gradient-to-tr from-sky-500 to-indigo-500 px-7 py-4 font-black text-sm shadow-2xl shadow-sky-500/30 hover:shadow-sky-500/50 hover:scale-[1.03] active:scale-[0.97] transition-all"
                >
                  <Sparkles className="h-4 w-4" />
                  Get AI Recommendations
                  <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </a>
                <a
                  href="#collection"
                  className="group inline-flex items-center gap-2 rounded-2xl bg-white/5 border border-white/15 px-7 py-4 font-black text-sm backdrop-blur hover:bg-white/10 hover:scale-[1.03] active:scale-[0.97] transition-all"
                >
                  Shop Collection
                </a>
              </motion.div>
            </motion.div>
          </div>

          {/* Animated stat board */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            className="relative"
          >
            <div className="glass-dark rounded-[2rem] p-8 space-y-6 shadow-2xl shadow-black/40">
              <div className="grid grid-cols-2 gap-6">
                {[
                  { n: <CountUp to={120} suffix="+" />, l: "Signature pieces" },
                  { n: <CountUp to={98} suffix="%" />, l: "Satisfaction rate" },
                  { n: <CountUp to={523} />, l: "Free deliveries" },
                  { n: <CountUp to={24} suffix="/7" />, l: "Premium support" },
                ].map((s, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6 + i * 0.12 }}
                    className="rounded-2xl bg-white/[0.04] border border-white/10 p-5"
                  >
                    <div className="text-3xl font-black text-gradient-glow">{s.n}</div>
                    <div className="mt-1 text-[11px] font-bold text-white/50 uppercase tracking-widest">{s.l}</div>
                  </motion.div>
                ))}
              </div>
              <div className="flex items-center gap-3 pt-1 border-t border-white/10 text-xs font-semibold text-white/60">
                <TrendingUp className="h-4 w-4 text-emerald-400" />
                Accelerating thanks to live AI personalization
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ============ AI RECOMMENDED ============ */}
      {recommendations.length >= 4 && (
        <section id="ai-recommended" className="space-y-6 animate-in">
          <div className="flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-tr from-sky-500 to-indigo-500 shadow-lg shadow-sky-200">
              <Sparkles className="h-5 w-5 text-white" />
            </span>
            <div>
              <h2 className="text-2xl font-black text-gray-900 tracking-tight font-display">Recommended For You</h2>
              <p className="text-sm text-gray-400 font-medium">AI-curated from your cart & browsing history</p>
            </div>
          </div>
          <motion.div variants={staggerContainer(0.06)} initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-40px" }} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {recommendations.slice(0, 4).map((p, i) => (
              <ProductCard key={p._id} product={p} addToCart={handleAddToCart} index={i} />
            ))}
          </motion.div>
        </section>
      )}

      {/* ============ COLLECTION + SEARCH ============ */}
      <section id="collection" className="space-y-8">
        <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }} className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <h2 className="text-3xl font-black text-gray-900 tracking-tight font-display">
              The <span className="text-gradient">Collection</span>
            </h2>
            <p className="text-gray-400 font-medium mt-1">{visible.length} pieces · live search</p>
          </div>

          <div className="relative md:w-[24rem]">
            <span className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </span>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onFocus={() => setSearchFocused(true)}
              onBlur={() => setTimeout(() => setSearchFocused(false), 140)}
              placeholder="Try 'wireless' or 'sneakers'..."
              className="glass-card block w-full pl-12 pr-4 py-4 rounded-2xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-4 focus:ring-white/80 focus:border-sky-300 shadow-sm transition-all font-medium"
            />
            {(searchFocused || searchTerm.trim()) && (
              <SearchSuggestions
                query={searchTerm}
                all={allProducts}
                onClear={() => setSearchTerm("")}
              />
            )}
          </div>
        </motion.div>

        {/* Category filter */}
        <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }} className="flex flex-wrap gap-2">
          {CATEGORIES.map((cat) => (
            <motion.button
              key={cat}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setActiveCat(cat)}
              className={`relative px-5 py-2.5 rounded-full text-sm font-bold transition-colors ${
                activeCat === cat
                  ? "text-white"
                  : "text-gray-500 hover:text-gray-800 glass-card shadow-sm"
              }`}
            >
              {activeCat === cat && (
                <motion.span layoutId="pill" className="absolute inset-0 rounded-full bg-gradient-to-tr from-sky-600 to-indigo-600 shadow-lg shadow-sky-200" transition={{ type: "spring", stiffness: 380, damping: 30 }} />
              )}
              <span className="relative">{cat}</span>
            </motion.button>
          ))}
        </motion.div>

        {/* Grid */}
        {visible.length > 0 ? (
          <motion.div
            layout
            variants={staggerContainer(0.07)}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-60px" }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
          >
            <AnimatePresence mode="popLayout">
              {visible.map((p, i) => (
                <ProductCard key={p._id} product={p} addToCart={handleAddToCart} index={i} />
              ))}
            </AnimatePresence>
          </motion.div>
        ) : (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="glass-card text-center py-24 rounded-[2rem] border-2 border-dashed border-white/50">
            <div className="glass-card p-4 rounded-2xl inline-block shadow-sm mb-4">
              <Search className="h-10 w-10 text-gray-300" />
            </div>
            <h3 className="text-xl font-black text-gray-900 mb-2">No matching pieces found</h3>
            <p className="text-gray-500 font-medium">Try a different search term or category.</p>
          </motion.div>
        )}
      </section>
    </div>
  );
};

export default Home;