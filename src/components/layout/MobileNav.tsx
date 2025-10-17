import { useState } from 'react';
import { Menu, X, Home, Grid, Heart, User, ShoppingCart, Search, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { useNavigate } from 'react-router-dom';
import { useApp } from '@/contexts/AppContext';
import { cn } from '@/lib/utils';

interface NavItem {
  label: string;
  icon: React.ReactNode;
  href: string;
  badge?: number;
}

export default function MobileNav() {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  const { cartItems, wishlistItems, user, setIsAuthModalOpen } = useApp();

  const categories = [
    'Electronics',
    'Fashion',
    'Home & Garden',
    'Sports & Outdoors',
    'Beauty & Personal Care',
    'Books',
    'Toys & Games',
    'Automotive'
  ];

  const mainNavItems: NavItem[] = [
    { label: 'Home', icon: <Home className="h-5 w-5" />, href: '/' },
    { label: 'Categories', icon: <Grid className="h-5 w-5" />, href: '/categories' },
    { 
      label: 'Wishlist', 
      icon: <Heart className="h-5 w-5" />, 
      href: '/wishlist',
      badge: wishlistItems.length 
    },
    { 
      label: 'Cart', 
      icon: <ShoppingCart className="h-5 w-5" />, 
      href: '/cart',
      badge: cartItems.reduce((sum, item) => sum + item.quantity, 0)
    }
  ];

  const handleNavigation = (href: string) => {
    navigate(href);
    setIsOpen(false);
  };

  return (
    <>
      {/* Mobile Bottom Navigation Bar */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t z-40">
        <div className="grid grid-cols-5 gap-1 p-2">
          <Button
            variant="ghost"
            className="flex flex-col items-center gap-1 h-auto py-2"
            onClick={() => navigate('/')}
          >
            <Home className="h-5 w-5" />
            <span className="text-xs">Home</span>
          </Button>
          
          <Button
            variant="ghost"
            className="flex flex-col items-center gap-1 h-auto py-2"
            onClick={() => navigate('/search')}
          >
            <Search className="h-5 w-5" />
            <span className="text-xs">Search</span>
          </Button>
          
          <Button
            variant="ghost"
            className="flex flex-col items-center gap-1 h-auto py-2 relative"
            onClick={() => navigate('/wishlist')}
          >
            <Heart className="h-5 w-5" />
            <span className="text-xs">Wishlist</span>
            {wishlistItems.length > 0 && (
              <Badge 
                variant="destructive" 
                className="absolute top-1 right-2 h-4 w-4 rounded-full p-0 flex items-center justify-center text-[10px]"
              >
                {wishlistItems.length}
              </Badge>
            )}
          </Button>
          
          <Button
            variant="ghost"
            className="flex flex-col items-center gap-1 h-auto py-2 relative"
            onClick={() => navigate('/cart')}
          >
            <ShoppingCart className="h-5 w-5" />
            <span className="text-xs">Cart</span>
            {cartItems.length > 0 && (
              <Badge 
                variant="destructive" 
                className="absolute top-1 right-2 h-4 w-4 rounded-full p-0 flex items-center justify-center text-[10px]"
              >
                {cartItems.reduce((sum, item) => sum + item.quantity, 0)}
              </Badge>
            )}
          </Button>
          
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild>
              <Button
                variant="ghost"
                className="flex flex-col items-center gap-1 h-auto py-2"
              >
                <Menu className="h-5 w-5" />
                <span className="text-xs">Menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-80 p-0">
              <SheetHeader className="p-4 border-b">
                <SheetTitle className="flex items-center justify-between">
                  <span>Menu</span>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setIsOpen(false)}
                  >
                    <X className="h-5 w-5" />
                  </Button>
                </SheetTitle>
              </SheetHeader>

              <div className="overflow-y-auto h-[calc(100vh-80px)]">
                {/* User Section */}
                <div className="p-4 bg-gray-50">
                  {user ? (
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-semibold">
                        {user.firstName[0]}{user.lastName[0]}
                      </div>
                      <div>
                        <p className="font-semibold">{user.firstName} {user.lastName}</p>
                        <p className="text-sm text-muted-foreground">{user.email}</p>
                      </div>
                    </div>
                  ) : (
                    <Button 
                      className="w-full" 
                      onClick={() => {
                        setIsAuthModalOpen(true);
                        setIsOpen(false);
                      }}
                    >
                      <User className="h-4 w-4 mr-2" />
                      Sign In / Register
                    </Button>
                  )}
                </div>

                <Separator />

                {/* Main Navigation */}
                <div className="p-4 space-y-2">
                  {mainNavItems.map((item) => (
                    <Button
                      key={item.label}
                      variant="ghost"
                      className="w-full justify-between h-12"
                      onClick={() => handleNavigation(item.href)}
                    >
                      <div className="flex items-center gap-3">
                        {item.icon}
                        <span>{item.label}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        {item.badge !== undefined && item.badge > 0 && (
                          <Badge variant="secondary">{item.badge}</Badge>
                        )}
                        <ChevronRight className="h-4 w-4" />
                      </div>
                    </Button>
                  ))}
                </div>

                <Separator />

                {/* Categories */}
                <div className="p-4">
                  <h3 className="font-semibold mb-3">Shop by Category</h3>
                  <div className="space-y-2">
                    {categories.map((category) => (
                      <Button
                        key={category}
                        variant="ghost"
                        className="w-full justify-between h-10"
                        onClick={() => handleNavigation(`/category/${category.toLowerCase().replace(/\s+/g, '-')}`)}
                      >
                        <span className="text-sm">{category}</span>
                        <ChevronRight className="h-4 w-4" />
                      </Button>
                    ))}
                  </div>
                </div>

                <Separator />

                {/* Account Links */}
                {user && (
                  <>
                    <div className="p-4 space-y-2">
                      <h3 className="font-semibold mb-3">My Account</h3>
                      <Button
                        variant="ghost"
                        className="w-full justify-start h-10"
                        onClick={() => handleNavigation('/account')}
                      >
                        Profile Settings
                      </Button>
                      <Button
                        variant="ghost"
                        className="w-full justify-start h-10"
                        onClick={() => handleNavigation('/orders')}
                      >
                        My Orders
                      </Button>
                      <Button
                        variant="ghost"
                        className="w-full justify-start h-10"
                        onClick={() => handleNavigation('/addresses')}
                      >
                        Addresses
                      </Button>
                      <Button
                        variant="ghost"
                        className="w-full justify-start h-10"
                        onClick={() => handleNavigation('/payment')}
                      >
                        Payment Methods
                      </Button>
                    </div>
                    <Separator />
                  </>
                )}

                {/* Help & Support */}
                <div className="p-4 space-y-2">
                  <h3 className="font-semibold mb-3">Help & Support</h3>
                  <Button
                    variant="ghost"
                    className="w-full justify-start h-10"
                    onClick={() => handleNavigation('/help')}
                  >
                    Help Center
                  </Button>
                  <Button
                    variant="ghost"
                    className="w-full justify-start h-10"
                    onClick={() => handleNavigation('/contact')}
                  >
                    Contact Us
                  </Button>
                  <Button
                    variant="ghost"
                    className="w-full justify-start h-10"
                    onClick={() => handleNavigation('/faq')}
                  >
                    FAQ
                  </Button>
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>

      {/* Spacer for fixed bottom nav */}
      <div className="md:hidden h-16" />
    </>
  );
}
