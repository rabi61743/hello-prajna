import { useEffect, useState } from 'react';
import { Clock, X } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useRecentlyViewed } from '@/hooks/useLocalStorage';
import { cn } from '@/lib/utils';

interface Product {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  image: string;
  category: string;
  rating: number;
}

interface RecentlyViewedProps {
  products?: Product[];
  maxItems?: number;
  onProductClick?: (productId: string) => void;
  onClear?: () => void;
  className?: string;
  variant?: 'sidebar' | 'horizontal';
}

export default function RecentlyViewed({
  products = [],
  maxItems = 10,
  onProductClick = () => {},
  onClear = () => {},
  className,
  variant = 'sidebar'
}: RecentlyViewedProps) {
  const { recentlyViewed, clearRecentlyViewed } = useRecentlyViewed();
  const [viewedProducts, setViewedProducts] = useState<Product[]>([]);

  useEffect(() => {
    // In a real app, you would fetch product details based on recentlyViewed IDs
    // For now, we'll use the provided products
    const filtered = products
      .filter(p => recentlyViewed.includes(p.id))
      .slice(0, maxItems);
    setViewedProducts(filtered);
  }, [recentlyViewed, products, maxItems]);

  const handleClear = () => {
    clearRecentlyViewed();
    onClear();
  };

  if (viewedProducts.length === 0) {
    return null;
  }

  if (variant === 'horizontal') {
    return (
      <div className={cn('space-y-4', className)}>
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold flex items-center gap-2">
            <Clock className="h-5 w-5" />
            Recently Viewed
          </h3>
          <Button variant="ghost" size="sm" onClick={handleClear}>
            Clear All
          </Button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
          {viewedProducts.map((product) => (
            <Card
              key={product.id}
              className="cursor-pointer hover:shadow-lg transition-shadow"
              onClick={() => onProductClick(product.id)}
            >
              <CardContent className="p-3 space-y-2">
                <div className="aspect-square overflow-hidden rounded-md bg-gray-100">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div>
                  <p className="text-sm font-medium line-clamp-2">{product.name}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="font-semibold">${product.price}</span>
                    {product.originalPrice && (
                      <span className="text-xs text-muted-foreground line-through">
                        ${product.originalPrice}
                      </span>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <Card className={cn('w-full', className)}>
      <CardHeader>
        <CardTitle className="flex items-center justify-between text-base">
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4" />
            Recently Viewed
          </div>
          <Button variant="ghost" size="sm" onClick={handleClear} className="h-auto p-1">
            <X className="h-4 w-4" />
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <ScrollArea className="h-[400px]">
          <div className="space-y-3 p-4">
            {viewedProducts.map((product) => (
              <div
                key={product.id}
                className="flex gap-3 cursor-pointer hover:bg-muted/50 p-2 rounded-lg transition-colors"
                onClick={() => onProductClick(product.id)}
              >
                <div className="w-16 h-16 flex-shrink-0 overflow-hidden rounded-md bg-gray-100">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium line-clamp-2 mb-1">
                    {product.name}
                  </p>
                  <p className="text-xs text-muted-foreground mb-1">
                    {product.category}
                  </p>
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-sm">${product.price}</span>
                    {product.originalPrice && (
                      <>
                        <span className="text-xs text-muted-foreground line-through">
                          ${product.originalPrice}
                        </span>
                        <Badge variant="destructive" className="text-xs px-1 py-0">
                          {Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}% OFF
                        </Badge>
                      </>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}

// Hook to track product views
export function useTrackProductView() {
  const { addToRecentlyViewed } = useRecentlyViewed();

  const trackView = (productId: string) => {
    addToRecentlyViewed(productId);
  };

  return { trackView };
}
