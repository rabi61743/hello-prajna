import { useState } from 'react';
import { Grid, List, SlidersHorizontal } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { LoadingSpinner, ProductGridSkeleton } from '@/components/ui/loading';
import ProductCard from './ProductCard';
import ProductQuickView from './ProductQuickView';
import { useInfiniteScroll } from '@/hooks/useInfiniteScroll';
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
  brand?: string;
  inStock?: boolean;
  onSale?: boolean;
}

interface ProductGridProps {
  products: Product[];
  loading?: boolean;
  hasMore?: boolean;
  onLoadMore?: () => void;
  onProductClick?: (product: Product) => void;
  onAddToCart?: (product: Product) => void;
  onAddToWishlist?: (product: Product) => void;
  className?: string;
  showFilters?: boolean;
  onFiltersToggle?: () => void;
}

const sortOptions = [
  { value: 'relevance', label: 'Relevance' },
  { value: 'price-low', label: 'Price: Low to High' },
  { value: 'price-high', label: 'Price: High to Low' },
  { value: 'rating', label: 'Customer Rating' },
  { value: 'newest', label: 'Newest First' },
  { value: 'popularity', label: 'Most Popular' }
];

export default function ProductGrid({
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
      inStock: true,
      onSale: true
    },
    {
      id: '2',
      name: 'Smart Fitness Watch',
      price: 199.99,
      rating: 4.2,
      reviewCount: 89,
      image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&q=80',
      category: 'Electronics',
      brand: 'FitTech',
      inStock: true
    },
    {
      id: '3',
      name: 'Ergonomic Office Chair',
      price: 449.99,
      originalPrice: 599.99,
      rating: 4.7,
      reviewCount: 234,
      image: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400&q=80',
      category: 'Furniture',
      brand: 'ComfortPlus',
      inStock: true,
      onSale: true
    },
    {
      id: '4',
      name: 'Professional Camera Lens',
      price: 899.99,
      rating: 4.8,
      reviewCount: 156,
      image: 'https://images.unsplash.com/photo-1606983340126-99ab4feaa64a?w=400&q=80',
      category: 'Photography',
      brand: 'LensMaster',
      inStock: false
    }
  ],
  loading = false,
  hasMore = true,
  onLoadMore = () => {},
  onProductClick = () => {},
  onAddToCart = () => {},
  onAddToWishlist = () => {},
  className,
  showFilters = true,
  onFiltersToggle = () => {}
}: ProductGridProps) {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [sortBy, setSortBy] = useState('relevance');
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);

  const { observerRef } = useInfiniteScroll(onLoadMore, {
    enabled: hasMore && !loading
  });

  const handleQuickView = (product: Product, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setQuickViewProduct(product);
  };

  const gridClasses = {
    grid: 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6',
    list: 'space-y-4'
  };

  return (
    <div className={cn("space-y-6", className)}>
      {/* Header Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">
              {products.length} {products.length === 1 ? 'product' : 'products'}
            </span>
            {loading && (
              <Badge variant="secondary" className="gap-1">
                <LoadingSpinner size="sm" />
                Loading...
              </Badge>
            )}
          </div>
          
          {showFilters && (
            <Button
              variant="outline"
              size="sm"
              onClick={onFiltersToggle}
              className="gap-2"
            >
              <SlidersHorizontal className="h-4 w-4" />
              Filters
            </Button>
          )}
        </div>

        <div className="flex items-center gap-3">
          {/* Sort Dropdown */}
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">Sort by:</span>
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-40">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {sortOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* View Mode Toggle */}
          <div className="flex items-center border rounded-md">
            <Button
              variant={viewMode === 'grid' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setViewMode('grid')}
              className="rounded-r-none"
            >
              <Grid className="h-4 w-4" />
            </Button>
            <Button
              variant={viewMode === 'list' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setViewMode('list')}
              className="rounded-l-none"
            >
              <List className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Products Grid/List */}
      {products.length > 0 ? (
        <div className={gridClasses[viewMode]}>
          {products.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              viewMode={viewMode}
              onClick={() => onProductClick(product)}
              onAddToCart={() => onAddToCart(product)}
              onAddToWishlist={() => onAddToWishlist(product)}
              onQuickView={(e) => handleQuickView(product, e)}
            />
          ))}
        </div>
      ) : !loading ? (
        <div className="text-center py-12">
          <div className="text-muted-foreground">
            <Grid className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <h3 className="text-lg font-medium mb-2">No products found</h3>
            <p className="text-sm">Try adjusting your search or filters</p>
          </div>
        </div>
      ) : null}

      {/* Loading State */}
      {loading && products.length === 0 && (
        <ProductGridSkeleton count={8} />
      )}

      {/* Infinite Scroll Trigger */}
      {hasMore && products.length > 0 && (
        <div ref={observerRef} className="flex justify-center py-8">
          {loading && (
            <div className="flex items-center gap-2 text-muted-foreground">
              <LoadingSpinner size="sm" />
              <span>Loading more products...</span>
            </div>
          )}
        </div>
      )}

      {/* End of Results */}
      {!hasMore && products.length > 0 && (
        <div className="text-center py-8 text-muted-foreground">
          <p className="text-sm">You've reached the end of the results</p>
        </div>
      )}

      {/* Quick View Modal */}
      {quickViewProduct && (
        <ProductQuickView
          product={{
            ...quickViewProduct,
            brand: quickViewProduct.brand || 'Unknown',
            inStock: quickViewProduct.inStock ?? true,
            description: '',
            features: [],
            images: [{ id: '1', url: quickViewProduct.image, alt: quickViewProduct.name, isMain: true }],
            variants: [],
            stock: 10,
            sku: 'SKU-' + quickViewProduct.id,
            freeShipping: false
          }}
          isOpen={!!quickViewProduct}
          onClose={() => setQuickViewProduct(null)}
          onAddToCart={(product, quantity, variants) => {
            onAddToCart(quickViewProduct);
            setQuickViewProduct(null);
          }}
          onAddToWishlist={(product) => {
            onAddToWishlist(quickViewProduct);
          }}
        />
      )}
    </div>
  );
}