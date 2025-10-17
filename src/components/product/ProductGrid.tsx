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
import { useProducts, Product as DBProduct } from '@/hooks/useProducts';
import { FilterState } from '@/components/search/SearchFilters';

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
  filters?: FilterState;
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
  filters = {
    searchQuery: '',
    categories: [],
    brands: [],
    priceRange: [0, 1000],
    rating: 0,
    sortBy: 'relevance',
    inStock: false,
    onSale: false,
    freeShipping: false,
    features: []
  },
  onProductClick = () => {},
  onAddToCart = () => {},
  onAddToWishlist = () => {},
  className,
  showFilters = true,
  onFiltersToggle = () => {}
}: ProductGridProps) {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);
  
  // Fetch products from Supabase
  const { products: dbProducts, loading, hasMore, loadMore } = useProducts(filters);

  // Convert DB products to Product format for ProductCard
  const products: Product[] = dbProducts.map(p => ({
    id: p.id,
    name: p.name,
    price: p.price,
    originalPrice: p.original_price || undefined,
    rating: p.rating_average,
    reviewCount: p.review_count,
    image: p.product_images?.[0]?.image_url || 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&q=80',
    category: p.categories?.name || 'Uncategorized',
    brand: p.brands?.name,
    inStock: p.stock_quantity > 0,
    onSale: !!p.original_price,
    isNew: p.is_new
  }));

  const { observerRef } = useInfiniteScroll(loadMore, {
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
          {/* Sort Dropdown - Sorting is now handled by filters */}
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">
              Sorted by: {sortOptions.find(o => o.value === filters.sortBy)?.label || 'Relevance'}
            </span>
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