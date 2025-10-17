import { useState } from 'react';
import { X, Plus, Check, Star, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';

interface Product {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  rating: number;
  reviewCount: number;
  image: string;
  category: string;
  brand: string;
  features: string[];
  specifications: Record<string, string>;
  inStock: boolean;
}

interface ProductComparisonProps {
  products?: Product[];
  maxProducts?: number;
  onAddProduct?: () => void;
  onRemoveProduct?: (productId: string) => void;
  onAddToCart?: (product: Product) => void;
  isOpen?: boolean;
  onClose?: () => void;
}

export default function ProductComparison({
  products = [
    {
      id: '1',
      name: 'Premium Wireless Headphones',
      price: 299.99,
      originalPrice: 399.99,
      rating: 4.5,
      reviewCount: 128,
      image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&q=80',
      category: 'Electronics',
      brand: 'AudioTech',
      features: ['Active Noise Cancellation', '40-hour Battery', 'Wireless Charging'],
      specifications: {
        'Battery Life': '40 hours',
        'Connectivity': 'Bluetooth 5.0',
        'Weight': '250g',
        'Warranty': '2 years'
      },
      inStock: true
    },
    {
      id: '2',
      name: 'Studio Pro Headphones',
      price: 349.99,
      rating: 4.7,
      reviewCount: 256,
      image: 'https://images.unsplash.com/photo-1484704849700-f032a568e944?w=400&q=80',
      category: 'Electronics',
      brand: 'SoundMaster',
      features: ['Studio Quality Sound', '50-hour Battery', 'Premium Materials'],
      specifications: {
        'Battery Life': '50 hours',
        'Connectivity': 'Bluetooth 5.2',
        'Weight': '280g',
        'Warranty': '3 years'
      },
      inStock: true
    }
  ],
  maxProducts = 4,
  onAddProduct = () => {},
  onRemoveProduct = () => {},
  onAddToCart = () => {},
  isOpen = false,
  onClose = () => {}
}: ProductComparisonProps) {
  const [selectedProducts, setSelectedProducts] = useState<Product[]>(products);

  const handleRemove = (productId: string) => {
    setSelectedProducts(prev => prev.filter(p => p.id !== productId));
    onRemoveProduct(productId);
  };

  // Get all unique specification keys
  const allSpecKeys = Array.from(
    new Set(
      selectedProducts.flatMap(p => Object.keys(p.specifications))
    )
  );

  // Get all unique features
  const allFeatures = Array.from(
    new Set(
      selectedProducts.flatMap(p => p.features)
    )
  );

  const ComparisonTable = () => (
    <div className="overflow-x-auto">
      <table className="w-full border-collapse">
        <thead>
          <tr>
            <th className="sticky left-0 bg-white z-10 p-4 text-left font-semibold border-b w-48">
              Compare
            </th>
            {selectedProducts.map((product) => (
              <th key={product.id} className="p-4 border-b min-w-[250px]">
                <div className="space-y-3">
                  <div className="relative">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-full aspect-square object-cover rounded-lg"
                    />
                    <Button
                      variant="secondary"
                      size="icon"
                      className="absolute top-2 right-2 h-8 w-8"
                      onClick={() => handleRemove(product.id)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                  <div className="text-left">
                    <p className="text-sm text-muted-foreground">{product.brand}</p>
                    <h3 className="font-semibold line-clamp-2">{product.name}</h3>
                  </div>
                </div>
              </th>
            ))}
            {selectedProducts.length < maxProducts && (
              <th className="p-4 border-b min-w-[250px]">
                <Button
                  variant="outline"
                  className="w-full h-full min-h-[200px] border-dashed"
                  onClick={onAddProduct}
                >
                  <Plus className="h-8 w-8" />
                </Button>
              </th>
            )}
          </tr>
        </thead>

        <tbody>
          {/* Price Row */}
          <tr className="hover:bg-muted/50">
            <td className="sticky left-0 bg-white z-10 p-4 font-medium border-b">
              Price
            </td>
            {selectedProducts.map((product) => (
              <td key={product.id} className="p-4 border-b">
                <div className="space-y-1">
                  <div className="text-2xl font-bold">${product.price}</div>
                  {product.originalPrice && (
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-muted-foreground line-through">
                        ${product.originalPrice}
                      </span>
                      <Badge variant="destructive" className="text-xs">
                        {Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}% OFF
                      </Badge>
                    </div>
                  )}
                </div>
              </td>
            ))}
          </tr>

          {/* Rating Row */}
          <tr className="hover:bg-muted/50">
            <td className="sticky left-0 bg-white z-10 p-4 font-medium border-b">
              Rating
            </td>
            {selectedProducts.map((product) => (
              <td key={product.id} className="p-4 border-b">
                <div className="space-y-1">
                  <div className="flex items-center gap-1">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={cn(
                          'h-4 w-4',
                          i < Math.floor(product.rating)
                            ? 'fill-yellow-400 text-yellow-400'
                            : 'text-gray-300'
                        )}
                      />
                    ))}
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {product.rating} ({product.reviewCount} reviews)
                  </p>
                </div>
              </td>
            ))}
          </tr>

          {/* Availability Row */}
          <tr className="hover:bg-muted/50">
            <td className="sticky left-0 bg-white z-10 p-4 font-medium border-b">
              Availability
            </td>
            {selectedProducts.map((product) => (
              <td key={product.id} className="p-4 border-b">
                <Badge variant={product.inStock ? 'default' : 'secondary'}>
                  {product.inStock ? 'In Stock' : 'Out of Stock'}
                </Badge>
              </td>
            ))}
          </tr>

          <tr>
            <td colSpan={selectedProducts.length + 1} className="p-4">
              <Separator />
            </td>
          </tr>

          {/* Specifications */}
          <tr>
            <td colSpan={selectedProducts.length + 1} className="p-4 font-semibold text-lg">
              Specifications
            </td>
          </tr>

          {allSpecKeys.map((specKey) => (
            <tr key={specKey} className="hover:bg-muted/50">
              <td className="sticky left-0 bg-white z-10 p-4 font-medium border-b">
                {specKey}
              </td>
              {selectedProducts.map((product) => (
                <td key={product.id} className="p-4 border-b">
                  {product.specifications[specKey] || '-'}
                </td>
              ))}
            </tr>
          ))}

          <tr>
            <td colSpan={selectedProducts.length + 1} className="p-4">
              <Separator />
            </td>
          </tr>

          {/* Features */}
          <tr>
            <td colSpan={selectedProducts.length + 1} className="p-4 font-semibold text-lg">
              Features
            </td>
          </tr>

          {allFeatures.map((feature) => (
            <tr key={feature} className="hover:bg-muted/50">
              <td className="sticky left-0 bg-white z-10 p-4 font-medium border-b">
                {feature}
              </td>
              {selectedProducts.map((product) => (
                <td key={product.id} className="p-4 border-b text-center">
                  {product.features.includes(feature) ? (
                    <Check className="h-5 w-5 text-green-600 mx-auto" />
                  ) : (
                    <X className="h-5 w-5 text-gray-300 mx-auto" />
                  )}
                </td>
              ))}
            </tr>
          ))}

          {/* Action Row */}
          <tr>
            <td className="sticky left-0 bg-white z-10 p-4 font-medium">
              Actions
            </td>
            {selectedProducts.map((product) => (
              <td key={product.id} className="p-4">
                <div className="space-y-2">
                  <Button
                    className="w-full"
                    onClick={() => onAddToCart(product)}
                    disabled={!product.inStock}
                  >
                    {product.inStock ? 'Add to Cart' : 'Out of Stock'}
                  </Button>
                  <Button variant="outline" className="w-full">
                    View Details
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </Button>
                </div>
              </td>
            ))}
          </tr>
        </tbody>
      </table>
    </div>
  );

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-6xl w-full max-h-[90vh] p-0">
        <DialogHeader className="p-6 pb-0">
          <DialogTitle className="flex items-center justify-between">
            <span>Compare Products ({selectedProducts.length})</span>
            <Button variant="ghost" size="icon" onClick={onClose}>
              <X className="h-5 w-5" />
            </Button>
          </DialogTitle>
        </DialogHeader>

        <ScrollArea className="h-[calc(90vh-80px)]">
          <div className="p-6">
            {selectedProducts.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-muted-foreground mb-4">
                  No products to compare. Add products to get started.
                </p>
                <Button onClick={onAddProduct}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Product
                </Button>
              </div>
            ) : (
              <ComparisonTable />
            )}
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}

// Hook for managing product comparison
export function useProductComparison(maxProducts: number = 4) {
  const [compareProducts, setCompareProducts] = useState<Product[]>([]);
  const [isOpen, setIsOpen] = useState(false);

  const addToCompare = (product: Product) => {
    if (compareProducts.length >= maxProducts) {
      return false;
    }
    if (compareProducts.find(p => p.id === product.id)) {
      return false;
    }
    setCompareProducts(prev => [...prev, product]);
    return true;
  };

  const removeFromCompare = (productId: string) => {
    setCompareProducts(prev => prev.filter(p => p.id !== productId));
  };

  const clearCompare = () => {
    setCompareProducts([]);
  };

  const openComparison = () => {
    if (compareProducts.length > 0) {
      setIsOpen(true);
    }
  };

  return {
    compareProducts,
    addToCompare,
    removeFromCompare,
    clearCompare,
    openComparison,
    isOpen,
    setIsOpen
  };
}
