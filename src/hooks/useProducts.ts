import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';
import { FilterState } from '@/components/search/SearchFilters';

export interface Product {
  id: string;
  name: string;
  slug: string;
  price: number;
  original_price: number | null;
  rating_average: number;
  review_count: number;
  category_id: string | null;
  brand_id: string | null;
  is_new: boolean;
  stock_quantity: number;
  categories?: {
    name: string;
    slug: string;
  } | null;
  brands?: {
    name: string;
    slug: string;
  } | null;
  product_images?: Array<{
    image_url: string;
    is_primary: boolean;
  }>;
}

interface UseProductsResult {
  products: Product[];
  loading: boolean;
  error: Error | null;
  hasMore: boolean;
  loadMore: () => void;
}

export function useProducts(filters: FilterState, limit: number = 12): UseProductsResult {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [offset, setOffset] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    // Reset when filters change
    setOffset(0);
    setProducts([]);
    fetchProducts(0, true);
  }, [filters]);

  const fetchProducts = async (currentOffset: number, isNewQuery: boolean = false) => {
    try {
      setLoading(true);
      setError(null);

      let query = supabase
        .from('products')
        .select(`
          *,
          categories(name, slug),
          brands(name, slug),
          product_images(image_url, is_primary)
        `)
        .eq('is_active', true)
        .order('created_at', { ascending: false })
        .range(currentOffset, currentOffset + limit - 1);

      // Apply category filters
      if (filters.categories && filters.categories.length > 0) {
        const categoryIds = await getCategoryIdsByNames(filters.categories);
        if (categoryIds.length > 0) {
          query = query.in('category_id', categoryIds);
        }
      }

      // Apply brand filters
      if (filters.brands && filters.brands.length > 0) {
        const brandIds = await getBrandIdsByNames(filters.brands);
        if (brandIds.length > 0) {
          query = query.in('brand_id', brandIds);
        }
      }

      // Apply price range filter
      if (filters.priceRange) {
        query = query
          .gte('price', filters.priceRange[0])
          .lte('price', filters.priceRange[1]);
      }

      // Apply rating filter
      if (filters.rating > 0) {
        query = query.gte('rating_average', filters.rating);
      }

      // Apply stock filter
      if (filters.inStock) {
        query = query.gt('stock_quantity', 0);
      }

      // Apply sale filter
      if (filters.onSale) {
        query = query.not('original_price', 'is', null);
      }

      // Apply search query
      if (filters.searchQuery) {
        query = query.ilike('name', `%${filters.searchQuery}%`);
      }

      // Apply sorting
      switch (filters.sortBy) {
        case 'price-low':
          query = query.order('price', { ascending: true });
          break;
        case 'price-high':
          query = query.order('price', { ascending: false });
          break;
        case 'rating':
          query = query.order('rating_average', { ascending: false });
          break;
        case 'popularity':
          query = query.order('sales_count', { ascending: false });
          break;
        case 'newest':
          query = query.order('created_at', { ascending: false });
          break;
      }

      const { data, error: queryError } = await query;

      if (queryError) throw queryError;

      const newProducts = data || [];
      
      if (isNewQuery) {
        setProducts(newProducts);
      } else {
        setProducts(prev => [...prev, ...newProducts]);
      }

      setHasMore(newProducts.length === limit);
    } catch (err) {
      const error = err as Error;
      setError(error);
      toast({
        variant: 'destructive',
        title: 'Error loading products',
        description: error.message
      });
    } finally {
      setLoading(false);
    }
  };

  const loadMore = () => {
    if (!loading && hasMore) {
      const newOffset = offset + limit;
      setOffset(newOffset);
      fetchProducts(newOffset, false);
    }
  };

  return { products, loading, error, hasMore, loadMore };
}

async function getCategoryIdsByNames(names: string[]): Promise<string[]> {
  const { data } = await supabase
    .from('categories')
    .select('id')
    .in('name', names);
  
  return data?.map(c => c.id) || [];
}

async function getBrandIdsByNames(names: string[]): Promise<string[]> {
  const { data } = await supabase
    .from('brands')
    .select('id')
    .in('name', names);
  
  return data?.map(b => b.id) || [];
}
