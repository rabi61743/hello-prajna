import { useState } from 'react';
import SearchFilters, { FilterState } from './SearchFilters';
import ProductGrid from '../product/ProductGrid';
import { useApp } from '@/contexts/AppContext';
import { Product } from '../product/ProductCard';

export default function SearchPage() {
  const { addToCart, addToWishlist } = useApp();
  const [filters, setFilters] = useState<FilterState>({
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
  });

  const handleProductClick = (product: Product) => {
    // Navigate to product detail page
    console.log('Navigate to product:', product.id);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Filters Sidebar */}
        <aside className="hidden lg:block">
          <SearchFilters 
            filters={filters} 
            onFiltersChange={setFilters}
          />
        </aside>

        {/* Product Grid */}
        <main className="lg:col-span-3">
          <ProductGrid
            filters={filters}
            onProductClick={handleProductClick}
            onAddToCart={addToCart}
            onAddToWishlist={addToWishlist}
            showFilters={true}
            onFiltersToggle={() => {}}
          />
        </main>
      </div>
    </div>
  );
}
