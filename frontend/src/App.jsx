import React from "react";
import { BrowserRouter as Router, useLocation } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { AuthProvider } from "./context/AuthContext";
import { ToastProvider } from "./context/ToastContext";
import { CartProvider } from "./context/CartContext";
import { WishlistProvider } from "./context/WishlistContext";
import Navbar from "./components/Navbar";
import AppRoutes from "./routes/AppRoutes";
import AiAssistant from "./components/AiAssistant";
import CartDrawer from "./components/CartDrawer";
import AnimatedBackground from "./components/AnimatedBackground";
import useLenis from "./hooks/useLenis";

// Inner component so we can use useLocation (must be inside Router)
const PageShell = () => {
  const location = useLocation();
  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={location.pathname}
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -10 }}
        transition={{ duration: 0.32, ease: [0.22, 1, 0.36, 1] }}
      >
        <AppRoutes />
      </motion.div>
    </AnimatePresence>
  );
};

function App() {
  useLenis();

  return (
    <ToastProvider>
      <AuthProvider>
        <CartProvider>
          <WishlistProvider>
            <Router future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
              <AnimatedBackground />
              <div className="min-h-screen flex flex-col relative animated-bg-root">
                <Navbar />
                <main className="flex-grow max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8 w-full min-w-0 bg-white/20 backdrop-blur-md">
                  <PageShell />
                </main>
                <footer className="bg-white/20 backdrop-blur-md border-t border-white/30 py-6 text-center text-gray-700 text-sm">
                   <p>© 2024 Mini E-commerce. <span className="text-gradient font-bold">Premium Experience.</span> <span className="font-black">Powered by Vimal</span></p>
                </footer>
              </div>
              <CartDrawer />
              <AiAssistant />
            </Router>
          </WishlistProvider>
        </CartProvider>
      </AuthProvider>
    </ToastProvider>
  );
}

export default App;