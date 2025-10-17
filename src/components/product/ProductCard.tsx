import { useState } from 'react';
import { Heart, ShoppingCart, Star, Eye, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';

export interface Product {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  rating: number;
  reviewCount: number;
  image: string;
  category: string;
  brand?: string;
  inStock?: boolean;
  onSale?: boolean;
  isNew?: boolean;
}

interface ProductCardProps {
  product: Product;
  viewMode?: 'grid' | 'list';
  onClick?: () => void;
  onAddToCart?: () => void;
  onAddToWishlist?: () => void;
  onQuickView?: (e: React.MouseEvent) => void;
  className?: string;
}

export default function ProductCard({
  product = {
    id: '1',
    name: 'Premium Wireless Headphones',
    price: 299.99,
    originalPrice: 399.99,
    rating: 4.5,
    reviewCount: 128,
    image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&q=80',
    category: 'Electronics',
    brand: 'AudioTech',
    inStock: true,
    onSale: true
  },
  viewMode = 'grid',
  onClick = () => {},
  onAddToCart = () => {},
  onAddToWishlist = () => {},
  onQuickView = () => {},
  className
}: ProductCardProps) {
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);

  const discountPercentage = product.originalPrice 
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  const handleWishlistClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsWishlisted(!isWishlisted);
    onAddToWishlist();
  };

  const handleAddToCartClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onAddToCart();
  };

  if (viewMode === 'list') {
    return (
      <Card className={cn("overflow-hidden hover:shadow-lg transition-shadow cursor-pointer", className)}>
        <CardContent className="p-0">
          <div className="flex" onClick={onClick}>
            {/* Image */}
            <div className="relative w-48 h-48 flex-shrink-0">
              <div className={cn(
                "w-full h-full bg-gray-100 flex items-center justify-center",
                !imageLoaded && "animate-pulse"
              )}>
                <img
                  src={product.image}
                  alt={product.name}
                  className={cn(
                    "w-full h-full object-cover transition-opacity",
                    imageLoaded ? "opacity-100" : "opacity-0"
                  )}
                  onLoad={() => setImageLoaded(true)}
                />
              </div>

              {/* Badges */}
              <div className="absolute top-3 left-3 flex flex-col gap-2">
                {product.onSale && (
                  <Badge variant="destructive" className="text-xs">
                    {discountPercentage}% OFF
                  </Badge>
                )}
                {!product.inStock && (
                  <Badge variant="secondary" className="text-xs">
                    Out of Stock
                  </Badge>
                )}
              </div>

              {/* Quick Actions */}
              <div className="absolute top-3 right-3 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <Button
                  variant="secondary"
                  size="icon"
                  className="h-8 w-8"
                  onClick={handleWishlistClick}
                >
                  <Heart className={cn("h-4 w-4", isWishlisted && "fill-red-500 text-red-500")} />
                </Button>
                <Button
                  variant="secondary"
                  size="icon"
                  className="h-8 w-8"
                  onClick={onQuickView}
                >
                  <Eye className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* Content */}
            <div className="flex-1 p-6 flex flex-col justify-between">
              <div className="space-y-3">
                <div>
                  {product.brand && (
                    <p className="text-sm text-muted-foreground">{product.brand}</p>
                  )}
                  <h3 className="font-semibold text-lg line-clamp-2">{product.name}</h3>
                  <p className="text-sm text-muted-foreground">{product.category}</p>
                </div>

                {/* Rating */}
                <div className="flex items-center gap-2">
                  <div className="flex items-center">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`h-4 w-4 ${
                          i < Math.floor(product.rating)
                            ? "fill-yellow-400 text-yellow-400"
                            : "text-gray-300"
                        }`}
                      />
                    ))}
                  </div>
                  <span className="text-sm text-muted-foreground">
                    {product.rating} ({product.reviewCount})
                  </span>
                </div>

                {/* Price */}
                <div className="flex items-center gap-2">
                  <span className="text-2xl font-bold">${product.price}</span>
                  {product.originalPrice && (
                    <span className="text-lg text-muted-foreground line-through">
                      ${product.originalPrice}
                    </span>
                  )}
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-3 mt-4">
                <Button
                  onClick={handleAddToCartClick}
                  disabled={!product.inStock}
                  className="flex-1 gap-2"
                >
                  <ShoppingCart className="h-4 w-4" />
                  {product.inStock ? 'Add to Cart' : 'Out of Stock'}
                </Button>
                <Button variant="outline" onClick={onQuickView} className="gap-2">
                  <Zap className="h-4 w-4" />
                  Quick View
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={cn("group overflow-hidden hover:shadow-lg transition-all cursor-pointer", className)}>
      <CardContent className="p-0">
        <div onClick={onClick}>
          {/* Image Container */}
          <div className="relative aspect-square overflow-hidden">
            <div className={cn(
              "w-full h-full bg-gray-100 flex items-center justify-center",
              !imageLoaded && "animate-pulse"
            )}>
              <img
                src={product.image}
                alt={product.name}
                className={cn(
                  "w-full h-full object-cover transition-all duration-300 group-hover:scale-105",
                  imageLoaded ? "opacity-100" : "opacity-0"
                )}
                onLoad={() => setImageLoaded(true)}
              />
            </div>

            {/* Badges */}
            <div className="absolute top-3 left-3 flex flex-col gap-2">
              {product.onSale && (
                <Badge variant="destructive" className="text-xs">
                  {discountPercentage}% OFF
                </Badge>
              )}
              {!product.inStock && (
                <Badge variant="secondary" className="text-xs">
                  Out of Stock
                </Badge>
              )}
            </div>

            {/* Quick Actions */}
            <div className="absolute top-3 right-3 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
              <Button
                variant="secondary"
                size="icon"
                className="h-8 w-8 backdrop-blur-sm"
                onClick={handleWishlistClick}
              >
                <Heart className={cn("h-4 w-4", isWishlisted && "fill-red-500 text-red-500")} />
              </Button>
              <Button
                variant="secondary"
                size="icon"
                className="h-8 w-8 backdrop-blur-sm"
                onClick={onQuickView}
              >
                <Eye className="h-4 w-4" />
              </Button>
            </div>

            {/* Quick Add to Cart */}
            <div className="absolute bottom-3 left-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity">
              <Button
                onClick={handleAddToCartClick}
                disabled={!product.inStock}
                className="w-full gap-2 backdrop-blur-sm"
                size="sm"
              >
                <ShoppingCart className="h-4 w-4" />
                {product.inStock ? 'Quick Add' : 'Out of Stock'}
              </Button>
            </div>
          </div>

          {/* Product Info */}
          <div className="p-4 space-y-3">
            <div>
              {product.brand && (
                <p className="text-sm text-muted-foreground">{product.brand}</p>
              )}
              <h3 className="font-semibold line-clamp-2 group-hover:text-primary transition-colors">
                {product.name}
              </h3>
            </div>

            {/* Rating */}
            <div className="flex items-center gap-2">
              <div className="flex items-center">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`h-3 w-3 ${
                      i < Math.floor(product.rating)
                        ? "fill-yellow-400 text-yellow-400"
                        : "text-gray-300"
                    }`}
                  />
                ))}
              </div>
              <span className="text-xs text-muted-foreground">
                ({product.reviewCount})
              </span>
            </div>

            {/* Price */}
            <div className="flex items-center gap-2">
              <span className="text-lg font-bold">${product.price}</span>
              {product.originalPrice && (
                <span className="text-sm text-muted-foreground line-through">
                  ${product.originalPrice}
                </span>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}