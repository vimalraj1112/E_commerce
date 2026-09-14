import React, { useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Search, TrendingUp, X } from "lucide-react";
import { smartSearch } from "../lib/aiEngine";
import { getProductImage } from "../lib/productArt";

// Live autocomplete dropdown shown under the collection search input.
// Powered by the same fuzzy "AI" search engine used for the main grid.
const SearchSuggestions = ({ query, all, onClear }) => {
  const navigate = useNavigate();
  const hasQuery = query.trim().length > 0;

  const results = useMemo(() => {
    if (!hasQuery) return [];
    // show top 5, keep trending items boosted for a nice touch
    return smartSearch(all, query).slice(0, 5);
  }, [all, query, hasQuery]);

  const popular = useMemo(
    () => (hasQuery ? [] : all.filter((p) => p.trending).slice(0, 4)),
    [all, hasQuery]
  );

  return (
    <AnimatePresence>
      {hasQuery && (
        <motion.div
          initial={{ opacity: 0, y: -6, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -6, scale: 0.98 }}
          transition={{ duration: 0.16 }}
          className="glass-card absolute left-0 right-0 top-full mt-2 z-30 overflow-hidden rounded-2xl shadow-2xl shadow-black/10"
        >
          <div className="px-4 py-2.5 text-[10px] font-black uppercase tracking-widest text-gray-400 border-b border-gray-50 flex items-center justify-between">
            <span className="flex items-center gap-1.5">
              <Search className="h-3 w-3" /> Top matches
            </span>
            <button onClick={onClear} className="text-gray-300 hover:text-gray-600 transition-colors">
              <X className="h-3.5 w-3.5" />
            </button>
          </div>

          {results.length > 0 ? (
            <ul className="divide-y divide-gray-50">
              {results.map((p, i) => (
                <motion.li
                  key={p._id}
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.04 }}
                >
                  <button
                    onClick={() => navigate(`/product/${p._id}`)}
                    className="w-full flex items-center gap-3 px-4 py-2.5 text-left hover:bg-neutral-100/60 transition-colors group"
                  >
                    <span className="flex h-11 w-11 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-gray-50 border border-gray-100">
                      <img
                        src={getProductImage(p)}
                        alt=""
                        className="h-full w-full object-cover"
                      />
                    </span>
                    <span className="flex-1 min-w-0">
                      <span className="block text-sm font-bold text-gray-800 group-hover:text-neutral-700 transition-colors truncate">
                        {p.name}
                      </span>
                      <span className="block text-[11px] text-gray-400 font-semibold uppercase tracking-wider">
                        {p.category}
                      </span>
                    </span>
                    <span className="text-sm font-black text-gray-900">${Number(p.price).toFixed(2)}</span>
                  </button>
                </motion.li>
              ))}
            </ul>
          ) : (
            <p className="px-4 py-6 text-sm text-gray-400 font-medium text-center">
              No matches for “{query}” — try “wireless” or “sneakers”.
            </p>
          )}
        </motion.div>
      )}

      {/* Trending suggestions when input is empty & focused */}
      {!hasQuery && popular.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: -6 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.18 }}
          className="glass-card absolute left-0 right-0 top-full mt-2 z-30 overflow-hidden rounded-2xl shadow-2xl shadow-black/10"
        >
          <div className="px-4 py-2.5 text-[10px] font-black uppercase tracking-widest text-gray-400 border-b border-gray-50 flex items-center gap-1.5">
            <TrendingUp className="h-3 w-3 text-neutral-600" /> Trending now
          </div>
          <ul className="divide-y divide-gray-50">
            {popular.map((p) => (
              <li key={p._id}>
                <button
                  onClick={() => navigate(`/product/${p._id}`)}
                  className="w-full flex items-center gap-3 px-4 py-2.5 text-left hover:bg-neutral-100/60 transition-colors"
                >
                  <span className="text-sm font-bold text-gray-700 flex-1 truncate">{p.name}</span>
                  <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">{p.category}</span>
                </button>
              </li>
            ))}
          </ul>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default SearchSuggestions;