import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';

export interface ProductImage {
  id: string;
  image_url: string;
  alt_text: string | null;
  is_primary: boolean;
  sort_order: number | null;
}

export interface ProductVariant {
  id: string;
  name: string;
  sku: string;
  price_modifier: number;
  stock_quantity: number;
  attributes: Record<string, any>;
}

export interface ProductDetail {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  price: number;
  original_price: number | null;
  sku: string;
  stock_quantity: number;
  rating_average: number;
  review_count: number;
  sales_count: number;
  views_count: number;
  is_new: boolean;
  is_featured: boolean;
  metadata: Record<string, any> | null;
  categories?: {
    id: string;
    name: string;
    slug: string;
  } | null;
  brands?: {
    id: string;
    name: string;
    slug: string;
    logo_url: string | null;
  } | null;
  product_images: ProductImage[];
  product_variants: ProductVariant[];
}

interface UseProductResult {
  product: ProductDetail | null;
  loading: boolean;
  error: Error | null;
  refetch: () => void;
}

export function useProduct(slugOrId: string | undefined): UseProductResult {
  const [product, setProduct] = useState<ProductDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const { toast } = useToast();

  const fetchProduct = async () => {
    if (!slugOrId) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      // Try to determine if it's a UUID or a slug
      const isUUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(slugOrId);

      let query = supabase
        .from('products')
        .select(`
          *,
          categories(id, name, slug),
          brands(id, name, slug, logo_url),
          product_images(id, image_url, alt_text, is_primary, sort_order),
          product_variants(id, name, sku, price_modifier, stock_quantity, attributes)
        `)
        .eq('is_active', true);

      if (isUUID) {
        query = query.eq('id', slugOrId);
      } else {
        query = query.eq('slug', slugOrId);
      }

      const { data, error: queryError } = await query.maybeSingle();

      if (queryError) throw queryError;

      if (data) {
        setProduct(data as ProductDetail);
        
        // Track product view
        trackProductView(data.id);
      }
    } catch (err) {
      const error = err as Error;
      setError(error);
      toast({
        variant: 'destructive',
        title: 'Error loading product',
        description: error.message
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProduct();
  }, [slugOrId]);

  const trackProductView = async (productId: string) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      await supabase.rpc('track_product_view', {
        p_product_id: productId,
        p_user_id: user?.id || null,
        p_session_id: !user ? generateSessionId() : null
      });
    } catch (err) {
      // Silently fail - don't interrupt user experience
      console.error('Failed to track product view:', err);
    }
  };

  return { product, loading, error, refetch: fetchProduct };
}

function generateSessionId(): string {
  // Generate or retrieve session ID from localStorage
  let sessionId = localStorage.getItem('session_id');
  if (!sessionId) {
    sessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    localStorage.setItem('session_id', sessionId);
  }
  return sessionId;
}
