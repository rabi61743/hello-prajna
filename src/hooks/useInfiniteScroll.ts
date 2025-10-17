import { useState, useEffect, useCallback, useRef } from 'react';

interface UseInfiniteScrollOptions {
  threshold?: number;
  rootMargin?: string;
  enabled?: boolean;
}

export function useInfiniteScroll(
  callback: () => void,
  options: UseInfiniteScrollOptions = {}
) {
  const { threshold = 1.0, rootMargin = '100px', enabled = true } = options;
  const [isFetching, setIsFetching] = useState(false);
  const observerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!enabled || !observerRef.current) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !isFetching) {
          setIsFetching(true);
          callback();
        }
      },
      { threshold, rootMargin }
    );

    observer.observe(observerRef.current);

    return () => observer.disconnect();
  }, [callback, threshold, rootMargin, enabled, isFetching]);

  const setIsFetchingComplete = useCallback(() => {
    setIsFetching(false);
  }, []);

  return { observerRef, isFetching, setIsFetchingComplete };
}

interface UsePaginationOptions {
  initialPage?: number;
  pageSize?: number;
}

export function usePagination<T>(
  data: T[],
  options: UsePaginationOptions = {}
) {
  const { initialPage = 1, pageSize = 20 } = options;
  const [currentPage, setCurrentPage] = useState(initialPage);

  const totalPages = Math.ceil(data.length / pageSize);
  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const currentData = data.slice(startIndex, endIndex);

  const goToPage = useCallback((page: number) => {
    setCurrentPage(Math.max(1, Math.min(page, totalPages)));
  }, [totalPages]);

  const nextPage = useCallback(() => {
    goToPage(currentPage + 1);
  }, [currentPage, goToPage]);

  const prevPage = useCallback(() => {
    goToPage(currentPage - 1);
  }, [currentPage, goToPage]);

  const hasNextPage = currentPage < totalPages;
  const hasPrevPage = currentPage > 1;

  return {
    currentPage,
    totalPages,
    currentData,
    hasNextPage,
    hasPrevPage,
    goToPage,
    nextPage,
    prevPage,
    pageSize,
    totalItems: data.length,
    startIndex: startIndex + 1,
    endIndex: Math.min(endIndex, data.length)
  };
}

// Hook for managing infinite scroll with data fetching
export function useInfiniteData<T>(
  fetchFunction: (page: number) => Promise<{ data: T[]; hasMore: boolean }>,
  initialData: T[] = []
) {
  const [data, setData] = useState<T[]>(initialData);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadMore = useCallback(async () => {
    if (loading || !hasMore) return;

    setLoading(true);
    setError(null);

    try {
      const result = await fetchFunction(page);
      setData(prev => [...prev, ...result.data]);
      setHasMore(result.hasMore);
      setPage(prev => prev + 1);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load data');
    } finally {
      setLoading(false);
    }
  }, [fetchFunction, page, loading, hasMore]);

  const reset = useCallback(() => {
    setData(initialData);
    setPage(1);
    setHasMore(true);
    setLoading(false);
    setError(null);
  }, [initialData]);

  const { observerRef, isFetching, setIsFetchingComplete } = useInfiniteScroll(
    loadMore,
    { enabled: hasMore && !loading }
  );

  useEffect(() => {
    if (isFetching) {
      setIsFetchingComplete();
    }
  }, [isFetching, setIsFetchingComplete]);

  return {
    data,
    loading,
    error,
    hasMore,
    loadMore,
    reset,
    observerRef
  };
}