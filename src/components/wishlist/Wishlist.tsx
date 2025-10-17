import { useState } from "react";
import { Heart, X, ShoppingCart, Star, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Product } from "../product/ProductCard";
import { useApp } from "@/contexts/AppContext";

interface WishlistItem extends Product {
  dateAdded: string;
  inStock: boolean;
}

interface WishlistProps {
  items?: WishlistItem[];
  onRemoveItem?: (id: string) => void;
  onAddToCart?: (product: Product) => void;
  onMoveAllToCart?: () => void;
  isOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
}

export default function Wishlist() {
  const { 
    wishlistItems, 
    removeFromWishlist, 
    addToCart 
  } = useApp();
  const [isSheetOpen, setIsSheetOpen] = useState(false);

  const inStockItems = wishlistItems.filter(item => item.inStock);

  const handleMoveAllToCart = () => {
    inStockItems.forEach(item => {
      addToCart(item, 1);
      removeFromWishlist(item.id);
    });
  };

  const WishlistContent = () => (
    <div className="flex flex-col h-full">
      <div className="flex-1 overflow-y-auto">
        {wishlistItems.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-64 text-center">
            <Heart className="h-16 w-16 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">Your wishlist is empty</h3>
            <p className="text-muted-foreground mb-4">Save items you love for later</p>
            <Button onClick={() => setIsSheetOpen(false)}>
              Start Shopping
            </Button>
          </div>
        ) : (
          <div className="space-y-4 p-4">
            {wishlistItems.map((item) => (
              <Card key={item.id} className="overflow-hidden">
                <CardContent className="p-4">
                  <div className="flex gap-4">
                    <div className="relative">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-20 h-20 object-cover rounded-md"
                      />
                      {!item.inStock && (
                        <div className="absolute inset-0 bg-black/50 rounded-md flex items-center justify-center">
                          <span className="text-white text-xs font-medium">Out of Stock</span>
                        </div>
                      )}
                      {item.isNew && (
                        <Badge className="absolute -top-1 -right-1 bg-green-500 text-xs px-1">
                          New
                        </Badge>
                      )}
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-start mb-2">
                        <h4 className="font-medium text-sm leading-tight line-clamp-2">
                          {item.name}
                        </h4>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => removeFromWishlist(item.id)}
                          className="text-muted-foreground hover:text-destructive p-1"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                      
                      <p className="text-xs text-muted-foreground mb-2">{item.category}</p>
                      
                      {/* Rating */}
                      <div className="flex items-center gap-1 mb-2">
                        <div className="flex items-center">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              className={`h-3 w-3 ${
                                i < Math.floor(item.rating)
                                  ? "fill-yellow-400 text-yellow-400"
                                  : "text-gray-300"
                              }`}
                            />
                          ))}
                        </div>
                        <span className="text-xs text-muted-foreground">
                          ({item.reviewCount})
                        </span>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="font-semibold">
                            ${item.price.toFixed(2)}
                          </span>
                          {item.originalPrice && (
                            <span className="text-xs text-muted-foreground line-through">
                              ${item.originalPrice.toFixed(2)}
                            </span>
                          )}
                        </div>
                        
                        <Button
                          size="sm"
                          onClick={() => {
                            addToCart(item, 1);
                            removeFromWishlist(item.id);
                          }}
                          disabled={!item.inStock}
                          className="h-8"
                        >
                          <ShoppingCart className="h-3 w-3 mr-1" />
                          {item.inStock ? 'Add to Cart' : 'Notify Me'}
                        </Button>
                      </div>
                      
                      <p className="text-xs text-muted-foreground mt-2">
                        Added {new Date(item.dateAdded).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

      {wishlistItems.length > 0 && (
        <div className="border-t bg-white p-4 space-y-3">
          <div className="flex justify-between text-sm">
            <span>Total items: {wishlistItems.length}</span>
            <span>In stock: {inStockItems.length}</span>
          </div>
          
          {inStockItems.length > 0 && (
            <Button 
              className="w-full" 
              onClick={handleMoveAllToCart}
            >
              Add All In-Stock Items to Cart ({inStockItems.length})
            </Button>
          )}
          
          <Button 
            variant="outline" 
            className="w-full"
            onClick={() => setIsSheetOpen(false)}
          >
            Continue Shopping
          </Button>
        </div>
      )}
    </div>
  );

  return (
    <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <Heart className="h-5 w-5" />
          {wishlistItems.length > 0 && (
            <Badge 
              variant="destructive" 
              className="absolute -top-2 -right-2 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs"
            >
              {wishlistItems.length}
            </Badge>
          )}
        </Button>
      </SheetTrigger>
      <SheetContent side="right" className="w-full sm:w-96 p-0">
        <SheetHeader className="p-4 border-b">
          <SheetTitle className="flex items-center gap-2">
            <Heart className="h-5 w-5" />
            My Wishlist ({wishlistItems.length})
          </SheetTitle>
        </SheetHeader>
        <WishlistContent />
      </SheetContent>
    </Sheet>
  );
}