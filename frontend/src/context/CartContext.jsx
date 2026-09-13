import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from "react";
import { cartApi } from "../api/cartApi";
import { useAuth } from "./AuthContext";
import { useToast } from "./ToastContext";

// A single source of truth for the shopping bag:
//  - keeps cart + count in sync app-wide
//  - drives the slide-in CartDrawer
//  - warns on insufficient stock
const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const { user, isAdmin } = useAuth();
  const { toast } = useToast();
  const [cart, setCart] = useState({ items: [], total_price: 0 });
  const [drawerOpen, setDrawerOpen] = useState(false);
  const loaded = useRef(false);

  const fetchCart = useCallback(async () => {
    if (!user || isAdmin) {
      setCart({ items: [], total_price: 0 });
      return;
    }
    try {
      const { data } = await cartApi.get();
      setCart(data);
      loaded.current = true;
    } catch {
      setCart({ items: [], total_price: 0 });
    }
  }, [user, isAdmin]);

  // Load once per auth change
  useEffect(() => {
    loaded.current = false;
    fetchCart();
  }, [fetchCart]);

  // Listen for external updates (e.g. after checkout clears the cart)
  useEffect(() => {
    const handler = () => fetchCart();
    window.addEventListener("cart-updated", handler);
    return () => window.removeEventListener("cart-updated", handler);
  }, [fetchCart]);

  const addItem = async (product, quantity = 1) => {
    if (!user) {
      toast("Please sign in to add items to your bag.", "info");
      return { ok: false, redirect: "/login" };
    }
    if (isAdmin) {
      toast("Admins don't shop — use a customer account to add to cart.", "warn");
      return { ok: false };
    }
    if (product.stock_quantity > 0 && product.stock_quantity < quantity) {
      toast(`Only ${product.stock_quantity} in stock.`, "warn");
      return { ok: false };
    }
    try {
      await cartApi.addItem({ product_id: product._id, quantity });
      await fetchCart();
      window.dispatchEvent(new Event("cart-updated"));
      setDrawerOpen(true);
      toast(`Added ${quantity} × ${product.name} to your bag! ✨`, "success");
      return { ok: true };
    } catch {
      toast("Failed to add to cart", "error");
      return { ok: false };
    }
  };

  const updateQty = async (productId, quantity) => {
    if (quantity < 1) return;
    try {
      await cartApi.updateQty({ product_id: productId, quantity });
      await fetchCart();
    } catch {
      toast("Failed to update quantity", "error");
    }
  };

  const removeItem = async (productId) => {
    try {
      await cartApi.remove(productId);
      await fetchCart();
    } catch {
      toast("Failed to remove item", "error");
    }
  };

  const openDrawer = () => setDrawerOpen(true);
  const closeDrawer = () => setDrawerOpen(false);

  return (
    <CartContext.Provider
      value={{
        cart,
        cartItems: cart.items,
        totalPrice: cart.total_price,
        cartCount: cart.items.reduce((a, i) => a + i.quantity, 0),
        addItem,
        updateQty,
        removeItem,
        fetchCart,
        drawerOpen,
        openDrawer,
        closeDrawer,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);