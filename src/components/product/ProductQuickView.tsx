import { useState } from 'react';
import { X, Heart, ShoppingCart, Star, Truck, Shield, RotateCcw } from 'lucide-react';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import ProductImageGallery from './ProductImageGallery';
import ProductVariantSelector, { ProductVariant } from './ProductVariantSelector';
import QuantitySelector from './QuantitySelector';
import { cn } from '@/lib/utils';

interface Product {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  rating: number;
  reviewCount: number;
  description: string;
  features: string[];
  images: Array<{ id: string; url: string; alt: string; isMain?: boolean }>;
  variants: ProductVariant[];
  stock: number;
  category: string;
  brand: string;
  sku: string;
  inStock: boolean;
  onSale?: boolean;
  freeShipping?: boolean;
}

interface ProductQuickViewProps {
  product: Product | null;
  isOpen: boolean;
  onClose: () => void;
  onAddToCart: (product: Product, quantity: number, variants: Record<string, string>) => void;
  onAddToWishlist: (product: Product) => void;
  className?: string;
}

export default function ProductQuickView({
  product = {
    id: '1',
    name: 'Premium Wireless Headphones',
    price: 299.99,
    originalPrice: 399.99,
    rating: 4.5,
    reviewCount: 128,
    description: 'Experience premium sound quality with our latest wireless headphones featuring active noise cancellation and 30-hour battery life.',
    features: ['Active Noise Cancellation', '30-hour Battery', 'Wireless Charging', 'Premium Materials'],
    images: [
      { id: '1', url: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&q=80', alt: 'Headphones main view', isMain: true },
      { id: '2', url: 'https://images.unsplash.com/photo-1484704849700-f032a568e944?w=800&q=80', alt: 'Headphones side view' }
    ],
    variants: [
      { id: 'black', name: 'Black', type: 'color', value: '#000000', available: true },
      { id: 'white', name: 'White', type: 'color', value: '#ffffff', available: true }
    ],
    stock: 15,
    category: 'Electronics',
    brand: 'AudioTech',
    sku: 'AT-WH-001',
    inStock: true,
    onSale: true,
    freeShipping: true
  },
  isOpen = false,
  onClose = () => {},
  onAddToCart = () => {},
  onAddToWishlist = () => {},
  className
}: ProductQuickViewProps) {
  const [selectedVariants, setSelectedVariants] = useState<Record<string, string>>({});
  const [quantity, setQuantity] = useState(1);

  if (!product) return null;

  const handleVariantChange = (type: string, variantId: string) => {
    setSelectedVariants(prev => ({ ...prev, [type]: variantId }));
  };

  const handleAddToCart = () => {
    onAddToCart(product, quantity, selectedVariants);
    onClose();
  };

  const handleAddToWishlist = () => {
    onAddToWishlist(product);
  };

  const discountPercentage = product.originalPrice 
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className={cn("max-w-4xl w-full max-h-[90vh] overflow-y-auto p-0", className)}>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-0">
          {/* Image Gallery */}
          <div className="p-6 bg-gray-50">
            <ProductImageGallery images={product.images} />
          </div>

          {/* Product Details */}
          <div className="p-6 space-y-6">
            {/* Header */}
            <div className="space-y-2">
              <div className="flex items-start justify-between">
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">{product.brand}</p>
                  <h2 className="text-2xl font-bold">{product.name}</h2>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={onClose}
                  className="shrink-0"
                >
                  <X className="h-4 w-4" />
                </Button>
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
                  {product.rating} ({product.reviewCount} reviews)
                </span>
              </div>

              {/* Badges */}
              <div className="flex flex-wrap gap-2">
                {product.onSale && (
                  <Badge variant="destructive">
                    {discountPercentage}% OFF
                  </Badge>
                )}
                {product.freeShipping && (
                  <Badge variant="secondary" className="gap-1">
                    <Truck className="h-3 w-3" />
                    Free Shipping
                  </Badge>
                )}
                {product.inStock && (
                  <Badge variant="secondary" className="bg-green-100 text-green-800">
                    In Stock
                  </Badge>
                )}
              </div>
            </div>

            {/* Price */}
            <div className="space-y-1">
              <div className="flex items-center gap-3">
                <span className="text-3xl font-bold">${product.price}</span>
                {product.originalPrice && (
                  <span className="text-lg text-muted-foreground line-through">
                    ${product.originalPrice}
                  </span>
                )}
              </div>
              <p className="text-sm text-muted-foreground">SKU: {product.sku}</p>
            </div>

            <Separator />

            {/* Description */}
            <div className="space-y-2">
              <h4 className="font-medium">Description</h4>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {product.description}
              </p>
            </div>

            {/* Features */}
            {product.features.length > 0 && (
              <div className="space-y-2">
                <h4 className="font-medium">Key Features</h4>
                <ul className="space-y-1">
                  {product.features.map((feature, index) => (
                    <li key={index} className="text-sm text-muted-foreground flex items-center gap-2">
                      <div className="w-1.5 h-1.5 bg-primary rounded-full" />
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <Separator />

            {/* Variants */}
            {product.variants.length > 0 && (
              <ProductVariantSelector
                variants={product.variants}
                selectedVariants={selectedVariants}
                onVariantChange={handleVariantChange}
              />
            )}

            {/* Quantity */}
            <QuantitySelector
              quantity={quantity}
              onQuantityChange={setQuantity}
              stock={product.stock}
              max={10}
              showStock={true}
            />

            <Separator />

            {/* Actions */}
            <div className="space-y-3">
              <div className="flex gap-3">
                <Button
                  onClick={handleAddToCart}
                  disabled={!product.inStock}
                  className="flex-1 gap-2"
                >
                  <ShoppingCart className="h-4 w-4" />
                  Add to Cart
                </Button>
                <Button
                  variant="outline"
                  onClick={handleAddToWishlist}
                  className="gap-2"
                >
                  <Heart className="h-4 w-4" />
                  Wishlist
                </Button>
              </div>

              {/* Additional Info */}
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Shield className="h-4 w-4" />
                  <span>2 Year Warranty</span>
                </div>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <RotateCcw className="h-4 w-4" />
                  <span>30 Day Returns</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}