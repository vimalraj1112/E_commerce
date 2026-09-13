// Mini "AI" engine — client-side, zero API key needed.
// A deterministic intelligent layer that powers:
//  1. Smart search  -> fuzzy scoring + intent-based suggestion chips
//  2. Recommendations -> content-based personalization from cart + view history
//  3. AI Assistant -> an intent-matching chat brain over products + store policy

// ---------- 1. Fuzzy scoring ----------
const normalize = (s = "") =>
  s.toLowerCase().replace(/[^a-z0-9 ]/g, " ").replace(/\s+/g, " ").trim();

const scoreQuery = (product, query) => {
  const q = normalize(query);
  if (!q) return 0;
  const name = normalize(product.name);
  const cat = normalize(product.category);
  const desc = normalize(product.description);

  let score = 0;
  if (name === q) score += 100;
  if (name.includes(q)) score += 60;
  if (name.startsWith(q)) score += 20;
  // word-level partial matches in name
  name.split(" ").forEach((w) => {
    if (w && q.includes(w) && w.length > 2) score += 22;
    if (q.split(" ").includes(w)) score += 15;
  });
  if (cat.includes(q) || q.includes(cat)) score += 25;
  if (desc.includes(q)) score += 8;
  return score;
};

// ---------- 2. Personalized recommendations ----------
// Content-based affinity: learn category/price preference from cart items
// and recently viewed products, then rank the rest.
export function getRecommendations(all, { cartItems = [], viewedIds = [] } = {}) {
  if (!all || !all.length) return [];

  const likes = { category: {}, price: [] };
  const seen = new Set();

  cartItems.forEach((c) => {
    const p = all.find((x) => String(x._id) === String(c.product_id));
    if (p) {
      likes.category[p.category] = (likes.category[p.category] || 0) + (c.quantity || 1) * 2.1;
      likes.price.push(p.price);
      seen.add(String(p._id));
    }
  });
  viewedIds.forEach((id) => {
    const p = all.find((x) => String(x._id) === String(id));
    if (p) {
      likes.category[p.category] = (likes.category[p.category] || 0) + 1.0;
      likes.price.push(p.price);
      seen.add(String(p._id));
    }
  });
  viewedIds.forEach((id) => seen.add(String(id)));

  const avgPrice = likes.price.length
    ? likes.price.reduce((a, b) => a + b, 0) / likes.price.length
    : null;

  const scored = all
    .filter((p) => !seen.has(String(p._id)))
    .map((p) => {
      let s = Math.random() * 3; // light variety
      s += (likes.category[p.category] || 0) * 14;
      if (avgPrice != null) {
        p.price = Number(p.price);
        s += 6 - Math.min(6, Math.abs(p.price - avgPrice) / (avgPrice || 1) * 4);
      }
      return { p, s };
    })
    .sort((a, b) => b.s - a.s);

  // If nothing learned yet, fall back to "trending" by category popularity
  if (likes.price.length === 0) {
    const catCount = {};
    all.forEach((p) => (catCount[p.category] = (catCount[p.category] || 0) + 1));
    return scored
      .sort((a, b) => (catCount[b.p.category] || 0) - (catCount[a.p.category] || 0) || b.s - a.s)
      .slice(0, 8)
      .map((x) => x.p);
  }

  return scored.slice(0, 8).map((x) => x.p);
}

// ---------- 3. Smart search ----------
export function smartSearch(all, query) {
  const q = normalize(query);
  if (!q) return all || [];
  return [...(all || [])]
    .map((p) => ({ p, s: scoreQuery(p, q) }))
    .filter((x) => x.s > 0)
    .sort((a, b) => b.s - a.s)
    .slice(0, 48)
    .map((x) => x.p);
}

// ---------- 4. AI Assistant ----------
// Intent-matching brain. Each handler inspects product data + store policy.
export function getAssistantReply(messages, allProducts, user) {
  const last = messages[messages.length - 1]?.text || "";
  const text = last.toLowerCase();
  const products = allProducts || [];

  const find = (query) => {
    const q = normalize(query);
    return [...products]
      .map((p) => ({ p, s: scoreQuery(p, query) + (normalize(p.category).includes(q) ? 30 : 0) }))
      .filter((x) => x.s > 0)
      .sort((a, b) => b.s - a.s)[0];
  };

  // Greetings
  if (/(^|\s)(hi|hello|hey|yo|good (morning|afternoon|evening))/.test(text) || text === "hi") {
    return `Hey${user?.name ? " " + user.name : ""}! 👋 I'm **Aura**, your AI shopping assistant.\n\nHere's what I can do:\n• 🔍 Find products by name, category or vibe\n• 💰 Shop within a budget (try "under $100")\n• 🛍️ Browse a whole category ("show me all Tech")\n• 🎁 Pick a gift • 🔥 Spot the best deal\n• 📦 Explain shipping, returns & checkout\n\nTry one of the quick replies below, or just ask! ✨`;
  }

  // Product lookup: "show me headphones", "i want a backpack", "do you have watches"
  const lookups = ["show me", "i want", "looking for", "find me", "do you have", "price of", "how much is", "cost", "recommend", "what about", "tell me about", "i need", "search"];
  const lookupHit = lookups.some((k) => text.includes(k));
  if (lookupHit) {
    const query = text.replace(/^(show me|i want|looking for|find me|do you have|price of|how much is|recommend|tell me about|i need|search|what about)\s*/g, "").replace(/[?.!]*$/, "").trim();
    const bad = /^(a |an |the |some |me |you |it |that |more |please )/.test(query) ? query.replace(/^(a |an |the |some |me |you |it |that |more |please )/, "").trim() : query;
    const clean = bad || query;
    if (clean.length > 1) {
      const hit = find(clean);
      if (hit) {
        const inStock = hit.stock_quantity > 0;
        return `I found the **${hit.name}** (${hit.category}). 🎯\n\n• Price: **$${Number(hit.price).toFixed(2)}**\n• In stock: ${hit.stock_quantity} units\n• ${hit.description}\n\n${inStock ? "Ready to add it to your bag? Just open the product page." : "This one's out of stock right now — I can suggest a similar alternative."}\n\nWant me to find more in ${hit.category}?`;
      }
      return `Hmm, I couldn't find an exact match for "${clean}". 🧐\n\nTry one of our popular categories instead:\n• Tech\n• Fashion\n• Home\n• Lifestyle\n\nOr tell me a vibe you're after (e.g. "sneakers", "warm", "travel").`;
    }
  }

  // Price / cheapest
  if (text.includes("cheapest") || text.includes("lowest") || text.includes("budget") || text.includes("best deal")) {
    const cheap = [...products].sort((a, b) => Number(a.price) - Number(b.price))[0];
    return cheap
      ? `The most budget-friendly pick right now is the **${cheap.name}** at **$${Number(cheap.price).toFixed(2)}**. 💸\n\nIt's a ${cheap.category} item with ${cheap.stock_quantity} in stock. Great value for the money!`
      : "I don't have product data loaded yet — please refresh the page.";
  }

  // Stock / availability
  if (text.includes("stock") || text.includes("available") || text.includes("sold out") || text.includes("availability")) {
    const inStock = products.filter((p) => p.stock_quantity > 0).length;
    const out = products.filter((p) => p.stock_quantity <= 0);
    let r = `We currently have **${inStock}** items in stock across the store. ✅\n\n`;
    if (out.length) r += `Out of stock right now: ${out.map((o) => o.name).join(", ")}.`;
    return r;
  }

  // Categories overview
  if (text.includes("category") || text.includes("what do you sell") || text.includes("everything") || text.includes("products")) {
    const cats = {};
    products.forEach((p) => (cats[p.category] = (cats[p.category] || 0) + 1));
    const lines = Object.entries(cats).map(([c, n]) => `• **${c}** — ${n} items`).join("\n");
    return `Here's what's in the store right now:\n\n${lines}\n\nWhich category appeals to you? I can hand-pick a few standout pieces. ✨`;
  }

  // Shipping
  if (text.includes("shipping") || text.includes("delivery") || text.includes("deliver")) {
    return "🚚 **Shipping & Delivery**\n\n• Free standard shipping on all premium orders\n• Usually arrives in **3–5 business days**\n• Tracking updates are sent as your order moves Pending → Processing → Shipped → Delivered\n• International orders may take 7–14 days";
  }

  // Returns
  if (text.includes("return") || text.includes("refund") || text.includes("exchange")) {
    return "↩️ **Returns & Refunds**\n\n• **30-day** easy return window on eligible items\n• Items must be unused and in original packaging\n• Refunds are processed within 5–7 business days of receiving your return";
  }

  // Checkout / pay
  if (text.includes("checkout") || text.includes("pay") || text.includes("payment") || text.includes("order")) {
    return "💳 **Checkout**\n\n• Review your bag, adjust quantities, then hit **Checkout Now**\n• Your order is placed instantly and enters the Pending queue\n• Shipping is always **free**\n• An admin updates your order status as it progresses";
  }

  // Cart help
  if (text.includes("cart") || text.includes("bag") || text.includes("add to")) {
    return "🛍️ **Your Cart**\n\n• Click the cart icon in the navbar to review your items\n• Adjust quantities with + / −\n• Remove any item with the trash icon\n• Total auto-updates as you edit\n\nEven quicker: click **Add to Cart** on any product card.";
  }

  // Account / login
  if (text.includes("login") || text.includes("sign in") || text.includes("account") || text.includes("register") || text.includes("create")) {
    return "👤 **Account**\n\n• **Register** with your name, email & a password\n• **Log in** to sync your cart and place orders\n• Your JWT session keeps you signed in until logout\n\nAdmins get an extra **Admin Panel** to manage products & orders.";
  }

  // Category browse: "show me all tech", "list fashion", "i want to see home"
  const catMatch = text.match(/(tech|fashion|home|lifestyle)/);
  if (catMatch && /(show|list|browse|see|all|want|from|category|in)/.test(text)) {
    const cat = catMatch[1][0].toUpperCase() + catMatch[1].slice(1);
    const picks = products.filter((p) => p.category.toLowerCase() === catMatch[1]).slice(0, 3);
    if (picks.length) {
      return `Here's a taste of our **${cat}** collection:\n\n${picks
        .map((p) => `• **${p.name}** — $${Number(p.price).toFixed(2)} (${p.stock_quantity} in stock)`)
        .join("\n")}\n\nWant me to narrow it down further — by price, style or a specific item?`;
    }
    return `We found **${cat}** in the catalog — I can show you the full range. Try asking for a specific item or budget.`;
  }

  // Budget pick: "under $100" / "below 200" / "$50 - $150"
  const budgetMatch = text.match(/(?:under|below|less than|max|<=|≤|b[uU]dget[^$]{0,4})\s*\$?(\d+)/) ||
                      text.match(/\$(\d+)\s*(?:to|-)\s*\$?(\d+)/);
  let budget = null;
  let budgetMax = null;
  if (budgetMatch) {
    if (budgetMatch[2]) { budget = Number(budgetMatch[1]); budgetMax = Number(budgetMatch[2]); }
    else budget = Number(budgetMatch[1]);
  }
  if ((text.includes("budget") || text.includes("under") || text.includes("affordable") || text.includes("cheap") || budget)) {
    const picks = products
      .filter((p) => (budgetMax ? Number(p.price) >= budget && Number(p.price) <= budgetMax : Number(p.price) <= (budget || 100)))
      .sort((a, b) => Number(a.price) - Number(b.price))
      .slice(0, 3);
    if (picks.length) {
      const range = budgetMax ? `$${budget}–$${budgetMax}` : `under $${budget || 100}`;
      return `Great news — I found **${picks.length}+** options ${range}:\n\n${picks
        .map((p) => `• **${p.name}** — $${Number(p.price).toFixed(2)} (${p.category})`)
        .join("\n")}\n\nThese are the best value picks I'd recommend. 💸`;
    }
    return `Hmm, I don't see anything price-matched under that budget right now. Try a higher amount, or ask me to "show me all [category]".`;
  }

  // Deal of the day / best deal
  if (text.includes("deal") || text.includes("discount") || text.includes("sale") || text.includes("offer") || text.includes("value")) {
    const deal = products.filter((p) => p.stock_quantity > 0)
      .sort((a, b) => Number(b.price) - Number(a.price))
      .filter((p) => Number(p.price) > 100)[0];
    const pick = deal || [...products].sort((a, b) => Number(a.price) - Number(b.price))[1] || products[0];
    if (pick) {
      return `🔥 **Deal of the moment:** the **${pick.name}** (${pick.category}) at **$${Number(pick.price).toFixed(2)}** —${pick.stock_quantity < 10 ? " only " + pick.stock_quantity + " left!" : " limited availability!"}\n\nIt's a premium pick that typically punches well above its price. Tap the card to add it to your bag.`;
    }
    return "I'm still loading our deals — refresh the page and ask again!";
  }

  // Thanks / appreciation
  if (text.includes("thank") || text.includes("thanks") || text.includes("great") || text.includes("awesome") || text.includes("perfect") || text.includes("good")) {
    return `You're welcome! 😊 Happy to help${user?.name ? " " + user.name : ""}.\n\nAnything else you'd like me to find or explain?`;
  }

  // Help fallback
  if (text.includes("help") || text.includes("hi") || text.includes("what can you") || text.includes("how")) {
    return "I'm your AI guide to the store. Try asking:\n• “show me all Tech”\n• “something under $100”\n• “help me pick a gift”\n• “best deal right now”\n• “do you do returns?”\n\nI answer from our **live inventory** and give you tappable product cards. ✨";
  }

  // Gift recommendation (nice demo)
  if (text.includes("gift") || text.includes("present")) {
    const top = [...products].sort((a, b) => Number(b.price) - Number(a.price));
    const pick = top[Math.floor(Math.random() * Math.min(3, top.length))];
    return pick
      ? `🎁 Great choice — a gift should feel special!\n\nI'd recommend the **${pick.name}** ($${Number(pick.price).toFixed(2)}). It's a premium ${pick.category} piece that always impresses.\n\nIs the recipient more techy, fashionable, or home-focused? I can tailor the pick.`
      : "I'd love to help pick a gift — please tell me their style or budget!";
  }

  // Default smart fallback: try to answer with anything related
  const anyHit = products.find((p) => normalize(p.name) && text.includes(normalize(p.name).split(" ")[0]));
  if (anyHit) {
    return `The **${anyHit.name}** (${anyHit.category}) is currently **$${Number(anyHit.price).toFixed(2)}** with ${anyHit.stock_quantity} in stock. ${anyHit.description}`;
  }

  return `I'm not 100% sure about that one, but here's what I can do:\n\n• Search for a product (e.g. "show me smartwatches")\n• Explain **shipping, returns, or checkout**\n• Suggest the **cheapest** or a **gift** pick\n\nTry rephrasing, or ask me to "help" for a menu. 🪄`;
}

// Suggested chips for the assistant
export const assistantSuggestions = [
  "show me smartwatches",
  "what do you sell?",
  "help me pick a gift",
  "do you do returns?",
];