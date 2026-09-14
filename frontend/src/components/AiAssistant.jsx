import React, { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, Send, X, Bot, User as UserIcon, ArrowRight, ShoppingCart, Check } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { getAssistantReply, smartSearch } from "../lib/aiEngine";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";
import { productApi } from "../api/productApi";
import { getProductImage } from "../lib/productArt";

const quickReplies = [
  "🌟 Help me pick a gift",
  "🛍️ show me all Tech",
  "🏷️ something under $100",
  "🎁 best deal right now",
  "🚚 Shipping times?",
  "↩️ Return policy?",
];

// Lightweight markdown-ish renderer for **bold** and \n
function render(text) {
  return text.split("**").map((part, i) =>
    i % 2 === 1 ? (
      <span key={i} className="font-semibold text-neutral-300">{part}</span>
    ) : (
      <React.Fragment key={i}>{part}</React.Fragment>
    )
  );
}

const AiAssistant = () => {
  const [open, setOpen] = useState(false);
  const [typing, setTyping] = useState(false);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([
    { role: "bot", text: "Hi! 👋 I'm **Aura**, your AI shopping assistant. Ask me about products, prices, shipping or returns!" },
  ]);
  const { user } = useAuth();
  const navigate = useNavigate();
  const { addItem } = useCart();
  const bodyRef = useRef(null);
  const inputRef = useRef(null);
  const [added, setAdded] = useState({});

  // Self-serve live inventory so Aura can answer from real data anywhere
  const [products, setProducts] = useState([]);
  const [productHints, setProductHints] = useState([]);

  useEffect(() => {
    productApi.getAll().then(({ data }) => setProducts(data)).catch(() => setProducts([]));
  }, [open]);

  useEffect(() => {
    if (open) {
      // welcome again if no conversation yet
      if (messages.length === 1) {
        setTimeout(() => setTyping(false), 600);
      }
      setTimeout(() => inputRef.current?.focus(), 350);
    }
  }, [open]);

  useEffect(() => {
    bodyRef.current?.scrollTo({ top: bodyRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, typing]);

  const send = (raw) => {
    const text = (raw || input).trim();
    if (!text) return;
    setInput("");
    setMessages((m) => [...m, { role: "user", text }]);
    setProductHints([]);
    setTyping(true);

    // Surface matching product cards when the query could be a search
    const matchable = /(show|want|find|do you have|price|how much|recommend|about|help me (pick|find)|looking for|search)/i.test(text) && text.length < 60;
    const hints = matchable ? smartSearch(products, text.replace(/[?.!]*$/, "")).slice(0, 3) : [];

    // Simulate "thinking" for a premium feel, then answer from the AI engine
    const delay = 700 + Math.min(900, text.length * 18);
    setTimeout(() => {
      const reply = getAssistantReply([...messages, { role: "user", text }], products, user);
      setTyping(false);
      setProductHints(hints);
      setMessages((m) => [...m, { role: "bot", text: reply }]);
    }, delay);
  };

  return (
    <>
      {/* Floating launcher */}
      <AnimatePresence>
        {!open && (
          <motion.button
            initial={{ scale: 0, rotate: -30 }}
            animate={{ scale: 1, rotate: 0 }}
            exit={{ scale: 0, rotate: 30 }}
            whileHover={{ scale: 1.08 }}
            whileTap={{ scale: 0.94 }}
            onClick={() => setOpen(true)}
            className="fixed bottom-6 right-6 z-[90] group"
            aria-label="Open AI assistant"
          >
            <span className="absolute inset-0 rounded-2xl bg-gradient-to-tr from-neutral-900 to-neutral-700 opacity-60 blur-xl group-hover:opacity-90 transition-opacity" />
            <span className="relative flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-tr from-neutral-800 via-neutral-600 to-neutral-500 shadow-2xl shadow-neutral-500/50">
              <Bot className="h-7 w-7 text-white" />
            </span>
            <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-neutral-400 border-2 border-white">
              <span className="absolute inset-0 rounded-full bg-neutral-400 animate-ping" />
            </span>
          </motion.button>
        )}
      </AnimatePresence>

      {/* Panel */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 40, scale: 0.92 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 40, scale: 0.92 }}
            transition={{ type: "spring", stiffness: 300, damping: 28 }}
            className="fixed bottom-6 right-6 z-[95] flex h-[520px] max-h-[78vh] w-[calc(100vw-3rem)] max-w-sm flex-col overflow-hidden rounded-[1.75rem] glass-dark shadow-2xl shadow-black/40"
          >
            {/* Header */}
            <div className="relative flex items-center justify-between px-5 py-4 border-b border-white/10">
              <div className="flex items-center gap-3">
                <div className="relative flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-tr from-neutral-900 to-neutral-700">
                  <Bot className="h-5 w-5 text-white" />
                  <span className="absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full bg-neutral-400 border-2 border-neutral-800" />
                </div>
                <div>
                  <p className="text-sm font-bold text-white flex items-center gap-1.5">
                    Aura<span className="text-[10px] text-neutral-400 flex items-center gap-0.5"><Sparkles className="h-3 w-3" /> AI</span>
                  </p>
                  <p className="text-[11px] text-white/50 font-medium">Online · replies instantly</p>
                </div>
              </div>
              <button onClick={() => setOpen(false)} className="text-white/50 hover:text-white transition-colors p-1">
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Messages */}
            <div ref={bodyRef} className="flex-1 overflow-y-auto px-4 py-4 space-y-3">
              {messages.map((m, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.25 }}
                  className={`flex items-end gap-2 ${m.role === "user" ? "justify-end" : ""}`}
                >
                  {m.role === "bot" && (
                    <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-gradient-to-tr from-neutral-900 to-neutral-700">
                      <Bot className="h-3.5 w-3.5 text-white" />
                    </div>
                  )}
                  <div
                    className={`max-w-[82%] rounded-2xl px-3.5 py-2.5 text-[13px] leading-relaxed whitespace-pre-line ${
                      m.role === "user"
                        ? "bg-gradient-to-tr from-neutral-900 to-neutral-700 text-white rounded-br-sm"
                        : "bg-white/10 text-white/90 rounded-bl-sm border border-white/10"
                    }`}
                  >
                    {render(m.text)}
                  </div>
                  {m.role === "user" && (
                    <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-white/10">
                      <UserIcon className="h-3.5 w-3.5 text-white/70" />
                    </div>
                  )}
                </motion.div>
              ))}

              {typing && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex items-end gap-2">
                  <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-gradient-to-tr from-neutral-900 to-neutral-700">
                    <Bot className="h-3.5 w-3.5 text-white" />
                  </div>
                  <div className="flex items-center gap-1 bg-white/10 border border-white/10 rounded-2xl rounded-bl-sm px-3.5 py-3">
                    <span className="typing-dot h-1.5 w-1.5 rounded-full bg-white/70" />
                    <span className="typing-dot h-1.5 w-1.5 rounded-full bg-white/70" />
                    <span className="typing-dot h-1.5 w-1.5 rounded-full bg-white/70" />
                  </div>
                </motion.div>
              )}

              {/* Clickable product cards when Aura matched the query */}
              {!typing && productHints.length > 0 && messages.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                  className="space-y-2 pl-8"
                >
                  <p className="text-[10px] font-black uppercase tracking-widest text-white/40 pl-1">Matches I found for you</p>
                  {productHints.map((p) => (
                    <div
                      key={p._id}
                      className="flex w-full items-center gap-3 rounded-2xl bg-white/5 border border-white/10 p-2.5 hover:bg-white/10 hover:border-neutral-400/50 transition-colors"
                    >
                      <button onClick={() => { setOpen(false); navigate(`/product/${p._id}`); }} className="flex flex-1 min-w-0 items-center gap-3 text-left group">
                        <span className="flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-white">
                          <img src={getProductImage(p)} alt="" className="h-full w-full object-cover" />
                        </span>
                        <span className="min-w-0 flex-1">
                          <span className="block truncate text-[13px] font-bold text-white group-hover:text-neutral-300 transition-colors">{p.name}</span>
                          <span className="block text-[11px] font-semibold text-neutral-400">${Number(p.price).toFixed(2)}</span>
                        </span>
                        <ArrowRight className="h-4 w-4 text-white/40 shrink-0" />
                      </button>
                      <button
                        onClick={() => {
                          setAdded((a) => ({ ...a, [p._id]: true }));
                          addItem(p, 1);
                          setTimeout(() => setAdded((a) => ({ ...a, [p._id]: false })), 1600);
                        }}
                        disabled={added[p._id]}
                        title="Add to bag"
                        className={`shrink-0 flex h-9 w-9 items-center justify-center rounded-xl transition-colors ${
                          added[p._id] ? "bg-neutral-600 text-white" : "bg-neutral-1000/20 text-neutral-400 hover:bg-neutral-1000/40"
                        }`}
                      >
                        {added[p._id] ? <Check className="h-4 w-4" /> : <ShoppingCart className="h-4 w-4" />}
                      </button>
                    </div>
                  ))}
                </motion.div>
              )}

              {/* Quick replies */}
              {messages.length === 1 && !typing && (
                <div className="pt-1 flex flex-wrap gap-2">
                  {quickReplies.map((q) => (
                    <motion.button
                      key={q}
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      whileHover={{ scale: 1.04 }}
                      whileTap={{ scale: 0.96 }}
                      onClick={() => send(q.replace(/^[^\w#]+/, ""))}
                      className="text-[11px] font-semibold text-neutral-300 bg-white/5 hover:bg-white/10 border border-white/10 hover:border-neutral-400/50 rounded-full px-3 py-1.5 transition-colors"
                    >
                      {q}
                    </motion.button>
                  ))}
                </div>
              )}
            </div>

            {/* Input */}
            <div className="p-3 border-t border-white/10">
              <div className="flex items-center gap-2 bg-white/10 rounded-2xl pl-4 pr-1.5 py-1.5 border border-white/10 focus-within:border-neutral-400/60 transition-colors">
                <input
                  ref={inputRef}
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && send()}
                  placeholder={`Ask ${user?.name?.split(" ")[0] || "me"} anything...`}
                  className="flex-1 bg-transparent text-sm text-white placeholder-white/35 outline-none"
                />
                <motion.button
                  whileHover={{ scale: 1.08 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => send()}
                  disabled={!input.trim()}
                  className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-tr from-neutral-900 to-neutral-700 text-white shadow-lg shadow-neutral-400/50 disabled:opacity-40"
                >
                  <Send className="h-4 w-4" />
                </motion.button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default AiAssistant;