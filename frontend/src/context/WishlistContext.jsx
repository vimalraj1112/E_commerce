import React, { createContext, useContext, useState } from "react";
import { useToast } from "./ToastContext";
import { useAuth } from "./AuthContext";

// Wishlist lives in localStorage so it's instant and works without a
// backend change. Heart-toggle on cards + a dedicated /wishlist page.
const WishlistContext = createContext();

const KEY = "wishlistItems"; // array of product ids

export const WishlistProvider = ({ children }) => {
  const { toast } = useToast();
  const { user } = useAuth();
  const [ids, setIds] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem(KEY) || "[]");
    } catch {
      return [];
    }
  });

  const persist = (next) => {
    localStorage.setItem(KEY, JSON.stringify(next));
    setIds(next);
  };

  const toggle = (productId) => {
    if (!user) {
      toast("Please sign in to save items to your wishlist.", "info");
      return { added: null };
    }
    let added = false;
    setIds((cur) => {
      if (cur.includes(productId)) {
        added = false;
        const next = cur.filter((x) => x !== productId);
        persist(next);
        return next;
      }
      added = true;
      const next = [...cur, productId];
      persist(next);
      return next;
    });
    toast(added ? "Saved to wishlist! 💖" : "Removed from wishlist", added ? "success" : "info");
    return { added };
  };

  const isSaved = (id) => ids.includes(id);
  const count = ids.length;

  return (
    <WishlistContext.Provider value={{ ids, count, toggle, isSaved }}>
      {children}
    </WishlistContext.Provider>
  );
};

export const useWishlist = () => useContext(WishlistContext);