import { useState } from 'react';
import { X, Plus, Minus, Heart, Trash2, ShoppingBag, Truck, Tag } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Checkbox } from '@/components/ui/checkbox';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useApp } from '@/contexts/AppContext';
import { useToast } from '@/components/ui/use-toast';
import { cn } from '@/lib/utils';

interface CartItem {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  image: string;
  quantity: number;
  category: string;
  inStock: boolean;
  maxQuantity?: number;
}

export default function ShoppingCart() {
  const { 
    cartItems = [
      {
        id: '1',
        name: 'Premium Wireless Headphones',
        price: 299.99,
        originalPrice: 399.99,
        image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=200&q=80',
        quantity: 1,
        category: 'Electronics',
        inStock: true,
        maxQuantity: 5
      },
      {
        id: '2',
        name: 'Smart Fitness Watch',
        price: 199.99,
        image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=200&q=80',
        quantity: 2,
        category: 'Electronics',
        inStock: true,
        maxQuantity: 3
      }
    ],
    isCartOpen = false,
    setIsCartOpen = () => {},
    updateCartQuantity = () => {},
    removeFromCart = () => {},
    clearCart = () => {},
    moveAllToWishlist = () => {},
    cartTotal = {
      subtotal: 699.97,
      shipping: 0,
      tax: 55.99,
      total: 755.96,
      itemCount: 3
    }
  } = useApp();

  const { toast } = useToast();
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [promoCode, setPromoCode] = useState('');

  const handleSelectItem = (itemId: string, checked: boolean) => {
    setSelectedItems(prev => 
      checked 
        ? [...prev, itemId]
        : prev.filter(id => id !== itemId)
    );
  };

  const handleSelectAll = (checked: boolean) => {
    setSelectedItems(checked ? cartItems.map(item => item.id) : []);
  };

  const handleBulkRemove = () => {
    selectedItems.forEach(id => removeFromCart(id));
    setSelectedItems([]);
    toast({ title: 'Items removed', description: `${selectedItems.length} items removed from cart` });
  };

  const handleBulkMoveToWishlist = () => {
    // Move selected items to wishlist
    selectedItems.forEach(id => {
      const item = cartItems.find(item => item.id === id);
      if (item) {
        // Add to wishlist logic here
        removeFromCart(id);
      }
    });
  setSelectedItems([]);
  toast({ title: 'Moved to wishlist', description: `${selectedItems.length} items moved to wishlist` });
  };

  const updateQuantity = (itemId: string, newQuantity: number) => {
    const item = cartItems.find(item => item.id === itemId);
    if (item && newQuantity > 0 && newQuantity <= (item.maxQuantity || 10)) {
      updateCartQuantity(itemId, newQuantity);
    }
  };

  const applyPromoCode = () => {
    if (promoCode.trim()) {
      // Promo code logic here
      toast({ title: 'Promo applied', description: `Code "${promoCode}" applied successfully` });
      setPromoCode('');
    }
  };

  return (
    <Sheet open={isCartOpen} onOpenChange={setIsCartOpen}>
      <SheetContent className="w-full sm:max-w-lg flex flex-col">
        <SheetHeader>
          <SheetTitle className="flex items-center gap-2">
            <ShoppingBag className="h-5 w-5" />
            Shopping Cart ({cartTotal.itemCount})
          </SheetTitle>
        </SheetHeader>

        {cartItems.length === 0 ? (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center space-y-4">
              <ShoppingBag className="h-16 w-16 text-muted-foreground mx-auto" />
              <div>
                <h3 className="font-medium">Your cart is empty</h3>
                <p className="text-sm text-muted-foreground">Add some products to get started</p>
              </div>
              <Button onClick={() => setIsCartOpen(false)}>
                Continue Shopping
              </Button>
            </div>
          </div>
        ) : (
          <>
            {/* Bulk Actions */}
            {cartItems.length > 1 && (
              <div className="space-y-3 pb-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      checked={selectedItems.length === cartItems.length}
                      onCheckedChange={handleSelectAll}
                    />
                    <span className="text-sm">
                      Select All ({selectedItems.length}/{cartItems.length})
                    </span>
                  </div>
                  
                  {selectedItems.length > 0 && (
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={handleBulkMoveToWishlist}
                        className="gap-1"
                      >
                        <Heart className="h-3 w-3" />
                        Wishlist
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={handleBulkRemove}
                        className="gap-1 text-destructive hover:text-destructive"
                      >
                        <Trash2 className="h-3 w-3" />
                        Remove
                      </Button>
                    </div>
                  )}
                </div>
                <Separator />
              </div>
            )}

            {/* Cart Items */}
            <ScrollArea className="flex-1 -mx-6 px-6">
              <div className="space-y-4">
                {cartItems.map((item) => (
                  <div key={item.id} className="space-y-3">
                    <div className="flex gap-3">
                      {cartItems.length > 1 && (
                        <Checkbox
                          checked={selectedItems.includes(item.id)}
                          onCheckedChange={(checked) => handleSelectItem(item.id, checked as boolean)}
                          className="mt-2"
                        />
                      )}
                      
                      <div className="flex gap-3 flex-1">
                        <div className="w-20 h-20 rounded-lg overflow-hidden bg-gray-100">
                          <img
                            src={item.image}
                            alt={item.name}
                            className="w-full h-full object-cover"
                          />
                        </div>

                        <div className="flex-1 space-y-2">
                          <div>
                            <h4 className="font-medium text-sm line-clamp-2">{item.name}</h4>
                            <p className="text-xs text-muted-foreground">{item.category}</p>
                          </div>

                          <div className="flex items-center gap-2">
                            <span className="font-semibold">${item.price}</span>
                            {item.originalPrice && (
                              <span className="text-sm text-muted-foreground line-through">
                                ${item.originalPrice}
                              </span>
                            )}
                          </div>

                          <div className="flex items-center justify-between">
                            {/* Quantity Controls */}
                            <div className="flex items-center gap-2">
                              <Button
                                variant="outline"
                                size="icon"
                                className="h-8 w-8"
                                onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                disabled={item.quantity <= 1}
                              >
                                <Minus className="h-3 w-3" />
                              </Button>
                              
                              <Input
                                type="number"
                                value={item.quantity}
                                onChange={(e) => updateQuantity(item.id, parseInt(e.target.value) || 1)}
                                className="w-16 h-8 text-center text-sm"
                                min={1}
                                max={item.maxQuantity || 10}
                              />
                              
                              <Button
                                variant="outline"
                                size="icon"
                                className="h-8 w-8"
                                onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                disabled={item.quantity >= (item.maxQuantity || 10)}
                              >
                                <Plus className="h-3 w-3" />
                              </Button>
                            </div>

                            {/* Item Actions */}
                            <div className="flex gap-1">
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8"
                                onClick={() => {
                                  // Move to wishlist logic
                                  removeFromCart(item.id);
                                  toast({ title: 'Moved to wishlist', description: `${item.name} moved to wishlist` });
                                }}
                              >
                                <Heart className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8 text-destructive hover:text-destructive"
                                onClick={() => removeFromCart(item.id)}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>

                          {!item.inStock && (
                            <Badge variant="destructive" className="text-xs">
                              Out of Stock
                            </Badge>
                          )}
                        </div>
                      </div>
                    </div>
                    <Separator />
                  </div>
                ))}
              </div>
            </ScrollArea>

            {/* Promo Code */}
            <div className="space-y-3 pt-4">
              <div className="flex gap-2">
                <Input
                  placeholder="Enter promo code"
                  value={promoCode}
                  onChange={(e) => setPromoCode(e.target.value)}
                  className="flex-1"
                />
                <Button 
                  variant="outline" 
                  onClick={applyPromoCode}
                  disabled={!promoCode.trim()}
                  className="gap-2"
                >
                  <Tag className="h-4 w-4" />
                  Apply
                </Button>
              </div>
            </div>

            {/* Cart Summary */}
            <div className="space-y-4 pt-4 border-t">
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>Subtotal ({cartTotal.itemCount} items)</span>
                  <span>${cartTotal.subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="flex items-center gap-1">
                    <Truck className="h-4 w-4" />
                    Shipping
                  </span>
                  <span className={cn(cartTotal.shipping === 0 && "text-green-600")}>
                    {cartTotal.shipping === 0 ? 'FREE' : `$${cartTotal.shipping.toFixed(2)}`}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Tax</span>
                  <span>${cartTotal.tax.toFixed(2)}</span>
                </div>
                <Separator />
                <div className="flex justify-between font-semibold text-base">
                  <span>Total</span>
                  <span>${cartTotal.total.toFixed(2)}</span>
                </div>
              </div>

              {cartTotal.shipping === 0 && (
                <div className="text-xs text-green-600 flex items-center gap-1">
                  <Truck className="h-3 w-3" />
                  Free shipping on orders over $50
                </div>
              )}

              <div className="space-y-2">
                <Button className="w-full" size="lg">
                  Proceed to Checkout
                </Button>
                <Button 
                  variant="outline" 
                  className="w-full" 
                  onClick={() => setIsCartOpen(false)}
                >
                  Continue Shopping
                </Button>
              </div>

              {cartItems.length > 1 && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={clearCart}
                  className="w-full text-destructive hover:text-destructive"
                >
                  Clear Cart
                </Button>
              )}
            </div>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
}