import { useState } from "react";
import { Search, ShoppingCart, User, Menu, Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import SmartSearchBar from "../search/SmartSearchBar";
import Wishlist from "../wishlist/Wishlist";
import { ThemeToggle } from '../ui/theme-toggle';
import { useApp } from "@/contexts/AppContext";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";

interface HeaderProps {
  cartItemCount?: number;
  onSearch?: (query: string) => void;
  onCartClick?: () => void;
  onLoginClick?: () => void;
}

export default function Header({ 
  onSearch = () => {}
}: HeaderProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const { cartItems, setIsCartOpen, setIsAuthModalOpen } = useApp();
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    onSearch(query);
  };

  const categories = [
    "Electronics", "Fashion", "Home & Garden", "Sports", "Books", "Beauty"
  ];

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
      {/* Top bar */}
      <div className="bg-gray-900 text-white py-2">
        <div className="container mx-auto px-4 text-center text-sm">
          Free shipping on orders over $50 | 30-day return policy
        </div>
      </div>

      {/* Main header */}
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between gap-4">
          {/* Logo */}
          <div className="flex items-center gap-2">
            <button 
              onClick={() => navigate('/')}
              className="bg-primary text-primary-foreground px-3 py-2 rounded-lg font-bold text-xl hover:opacity-90"
            >
              ShopHub
            </button>
          </div>

          {/* Smart Search bar - hidden on mobile */}
          <div className="hidden md:flex flex-1 max-w-2xl mx-8">
            <SmartSearchBar
              value=""
              onChange={() => {}}
              onSearch={handleSearch}
            />
          </div>

          {/* Right side actions */}
          <div className="flex items-center gap-2">
            {/* Mobile search */}
            <Button variant="ghost" size="icon" className="md:hidden">
              <Search className="h-5 w-5" />
            </Button>

            {/* Theme Toggle */}
            <div className="hidden sm:block">
              <ThemeToggle />
            </div>

            {/* Wishlist */}
            <div className="hidden sm:block">
              <Wishlist />
            </div>

            {/* Cart */}
            <Button 
              variant="ghost" 
              size="icon" 
              className="relative"
              onClick={() => setIsCartOpen(true)}
            >
              <ShoppingCart className="h-5 w-5" />
              {cartItems.length > 0 && (
                <Badge 
                  variant="destructive" 
                  className="absolute -top-2 -right-2 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs"
                >
                  {cartItems.reduce((sum, item) => sum + item.quantity, 0)}
                </Badge>
              )}
            </Button>

            {/* User menu */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon">
                  <User className="h-5 w-5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                {user ? (
                  <>
                    <DropdownMenuItem>
                      Welcome, {user.user_metadata?.first_name || user.email}!
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => navigate('/account')}>
                      My Account
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => navigate('/account')}>
                      My Orders
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={signOut}>
                      Sign Out
                    </DropdownMenuItem>
                  </>
                ) : (
                  <>
                    <DropdownMenuItem onClick={() => setIsAuthModalOpen(true)}>
                      Sign In
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setIsAuthModalOpen(true)}>
                      Create Account
                    </DropdownMenuItem>
                  </>
                )}
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Mobile menu */}
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="md:hidden">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-80">
                <div className="py-4">
                  <div className="space-y-4">
                    <div>
                      <h3 className="font-semibold mb-2">Categories</h3>
                      <div className="space-y-2">
                        {categories.map((category) => (
                          <Button 
                            key={category}
                            variant="ghost" 
                            className="w-full justify-start"
                          >
                            {category}
                          </Button>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>

        {/* Mobile search bar */}
        <div className="md:hidden mt-4">
          <SmartSearchBar
            value=""
            onChange={() => {}}
            onSearch={handleSearch}
            placeholder="Search products..."
          />
        </div>
      </div>

      {/* Categories bar - desktop */}
      <div className="hidden md:block bg-gray-50 border-t">
        <div className="container mx-auto px-4 py-2">
          <div className="flex items-center gap-6 overflow-x-auto">
            {categories.map((category) => (
              <Button 
                key={category}
                variant="ghost" 
                size="sm"
                className="whitespace-nowrap hover:bg-primary hover:text-primary-foreground"
              >
                {category}
              </Button>
            ))}
          </div>
        </div>
      </div>
    </header>
  );
}