import { createContext, useContext, useState, ReactNode, useCallback, useMemo } from "react";
import { Product } from "@/components/product/ProductCard";
import { useLocalStorage, useRecentlyViewed } from '@/hooks/useLocalStorage';
import { useToast } from '@/components/ui/use-toast';

export interface CartItem extends Product {
  quantity: number;
  maxQuantity?: number;
}

export interface WishlistItem extends Product {
  dateAdded: string;
}

interface AppContextType {
  // Cart
  cartItems: CartItem[];
  addToCart: (product: Product, quantity?: number) => void;
  updateCartQuantity: (id: string, quantity: number) => void;
  removeFromCart: (id: string) => void;
  clearCart: () => void;
  moveAllToWishlist: () => void;
  cartTotal: {
    subtotal: number;
    shipping: number;
    tax: number;
    total: number;
    itemCount: number;
  };
  
  // Wishlist
  wishlistItems: WishlistItem[];
  addToWishlist: (product: Product) => void;
  removeFromWishlist: (id: string) => void;
  moveToCart: (id: string) => void;
  
  // Auth
  user: any | null;
  
  // UI State
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;
  isAuthModalOpen: boolean;
  setIsAuthModalOpen: (open: boolean) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: ReactNode }) {
  // Persistent state using localStorage
  const [cartItems, setCartItems] = useLocalStorage<CartItem[]>('cartItems', []);
  const [wishlistItems, setWishlistItems] = useLocalStorage<WishlistItem[]>('wishlistItems', []);
  const [user, setUser] = useState<any | null>(null);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const { recentlyViewed, addToRecentlyViewed } = useRecentlyViewed();
  const { toast } = useToast();

  // Add to cart with toast notification
  const addToCart = useCallback((product: Product, quantity: number = 1) => {
    setCartItems(prev => {
      const existingItem = prev.find(item => item.id === product.id);
      
      if (existingItem) {
        const updatedItems = prev.map(item =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
        toast({ title: 'Updated cart', description: `${product.name} quantity updated` });
        return updatedItems;
      } else {
        const newItem: CartItem = {
          ...product,
          quantity,
          maxQuantity: 10
        };
        toast({ title: 'Added to cart', description: `${product.name} added to your cart` });
        return [...prev, newItem];
      }
    });
  }, [setCartItems, toast]);

  // Remove from cart
  const removeFromCart = useCallback((productId: string) => {
    setCartItems(prev => {
      const item = prev.find(item => item.id === productId);
      if (item) {
        toast({ title: 'Removed from cart', description: `${item.name} removed from your cart` });
      }
      return prev.filter(item => item.id !== productId);
    });
  }, [setCartItems, toast]);

  // Update cart quantity
  const updateCartQuantity = useCallback((productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    
    setCartItems(prev =>
      prev.map(item =>
        item.id === productId ? { ...item, quantity } : item
      )
    );
  }, [setCartItems, removeFromCart]);

  // Clear entire cart
  const clearCart = useCallback(() => {
    setCartItems([]);
    toast({ title: 'Cart cleared', description: 'All items removed from your cart' });
  }, [setCartItems, toast]);

  // Add to wishlist
  const addToWishlist = useCallback((product: Product) => {
    setWishlistItems(prev => {
      const exists = prev.find(item => item.id === product.id);
      if (exists) {
        toast({ variant: 'destructive', title: 'Already in wishlist', description: `${product.name} is already in your wishlist` });
        return prev;
      }
      const newItem: WishlistItem = {
        ...product,
        dateAdded: new Date().toISOString()
      };
      toast({ title: 'Added to wishlist', description: `${product.name} added to your wishlist` });
      return [...prev, newItem];
    });
  }, [setWishlistItems, toast]);

  // Remove from wishlist
  const removeFromWishlist = useCallback((productId: string) => {
    setWishlistItems(prev => {
      const item = prev.find(item => item.id === productId);
      if (item) {
        toast({ title: 'Removed from wishlist', description: `${item.name} removed from your wishlist` });
      }
      return prev.filter(item => item.id !== productId);
    });
  }, [setWishlistItems, toast]);

  // Move from wishlist to cart
  const moveToCart = useCallback((productId: string) => {
    const wishlistItem = wishlistItems.find(item => item.id === productId);
    if (wishlistItem) {
      addToCart(wishlistItem);
      removeFromWishlist(productId);
    }
  }, [wishlistItems, addToCart, removeFromWishlist]);

  // Bulk cart operations
  const moveAllToWishlist = useCallback(() => {
    cartItems.forEach(item => {
      addToWishlist(item);
    });
    clearCart();
  }, [cartItems, addToWishlist, clearCart]);

  // Track product views
  const trackProductView = useCallback((productId: string) => {
    addToRecentlyViewed(productId);
  }, [addToRecentlyViewed]);

  // Calculate cart totals
  const cartTotal = useMemo(() => {
    const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const shipping = subtotal > 50 ? 0 : 9.99;
    const tax = subtotal * 0.08;
    const total = subtotal + shipping + tax;
    
    return {
      subtotal,
      shipping,
      tax,
      total,
      itemCount: cartItems.reduce((sum, item) => sum + item.quantity, 0)
    };
  }, [cartItems]);

  return (
    <AppContext.Provider
      value={{
        cartItems,
        addToCart,
        updateCartQuantity,
        removeFromCart,
        clearCart,
        moveAllToWishlist,
        cartTotal,
        wishlistItems,
        addToWishlist,
        removeFromWishlist,
        moveToCart,
        user,
        isCartOpen,
        setIsCartOpen,
        isAuthModalOpen,
        setIsAuthModalOpen
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("useApp must be used within AppProvider");
  }
  return context;
}