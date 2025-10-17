import { Suspense } from "react";
import { useRoutes, Routes, Route } from "react-router-dom";
import Home from "./components/home";
import Header from "./components/layout/Header";
import ProductDetail from "./components/product/ProductDetail";
import Checkout from "./components/checkout/Checkout";
import OrderConfirmation from "./components/checkout/OrderConfirmation";
import UserAccount from "./components/account/UserAccount";
import ShoppingCart from "./components/cart/ShoppingCart";
import AuthModal from "./components/auth/AuthModal";
import MobileNav from "./components/layout/MobileNav";
import OfflineIndicator from "./components/ui/offline-indicator";
import routes from "tempo-routes";
import { useApp } from "./contexts/AppContext";
import { ErrorBoundary } from "./components/ui/error-boundary";
import { LoadingState } from "./components/ui/loading";
import { ThemeProvider } from "./contexts/ThemeContext";
import { usePerformanceMonitoring } from "./hooks/useAnalytics";
import { Toaster } from "@/components/ui/toaster";

function App() {
  // Track performance metrics
  usePerformanceMonitoring();

  return (
    <ThemeProvider>
      <ErrorBoundary>
        <AppContent />
      </ErrorBoundary>
    </ThemeProvider>
  );
}

function AppContent() {
  const { addToCart, addToWishlist } = useApp();

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <OfflineIndicator />
      <Suspense fallback={<LoadingState message="Loading page..." fullScreen />}>
        <>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route 
              path="/product/:id" 
              element={
                <ProductDetail 
                  onAddToCart={addToCart}
                  onAddToWishlist={addToWishlist}
                />
              } 
            />
            <Route path="/checkout" element={<Checkout />} />
            <Route path="/order-confirmation/:orderId" element={<OrderConfirmation />} />
            <Route path="/account" element={<UserAccount />} />
          </Routes>
          {import.meta.env.VITE_TEMPO === "true" && useRoutes(routes)}
        </>
      </Suspense>
      
      {/* Global Components */}
      <ShoppingCart />
      <AuthModal />
      <MobileNav />
      <Toaster />
    </div>
  );
}

export default App;