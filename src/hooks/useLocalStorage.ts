import { useState, useEffect, useCallback } from 'react';

export function useLocalStorage<T>(
  key: string,
  initialValue: T,
  options: {
    serialize?: (value: T) => string;
    deserialize?: (value: string) => T;
  } = {}
) {
  const {
    serialize = JSON.stringify,
    deserialize = JSON.parse,
  } = options;

  // Get initial value from localStorage or use provided initial value
  const [storedValue, setStoredValue] = useState<T>(() => {
    if (typeof window === 'undefined') {
      return initialValue;
    }

    try {
      const item = window.localStorage.getItem(key);
      return item ? deserialize(item) : initialValue;
    } catch (error) {
      console.warn(`Error reading localStorage key "${key}":`, error);
      return initialValue;
    }
  });

  // Update localStorage when state changes
  const setValue = useCallback((value: T | ((val: T) => T)) => {
    try {
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);
      
      if (typeof window !== 'undefined') {
        window.localStorage.setItem(key, serialize(valueToStore));
      }
    } catch (error) {
      console.warn(`Error setting localStorage key "${key}":`, error);
    }
  }, [key, serialize, storedValue]);

  // Remove item from localStorage
  const removeValue = useCallback(() => {
    try {
      setStoredValue(initialValue);
      if (typeof window !== 'undefined') {
        window.localStorage.removeItem(key);
      }
    } catch (error) {
      console.warn(`Error removing localStorage key "${key}":`, error);
    }
  }, [key, initialValue]);

  return [storedValue, setValue, removeValue] as const;
}

// Hook for managing recently viewed products
export function useRecentlyViewed() {
  const [recentlyViewed, setRecentlyViewed] = useLocalStorage<string[]>('recentlyViewed', []);

  const addToRecentlyViewed = useCallback((productId: string) => {
    setRecentlyViewed(prev => {
      const filtered = prev.filter(id => id !== productId);
      return [productId, ...filtered].slice(0, 10); // Keep only last 10 items
    });
  }, [setRecentlyViewed]);

  const clearRecentlyViewed = useCallback(() => {
    setRecentlyViewed([]);
  }, [setRecentlyViewed]);

  return {
    recentlyViewed,
    addToRecentlyViewed,
    clearRecentlyViewed
  };
}

// Hook for managing search history
export function useSearchHistory() {
  const [searchHistory, setSearchHistory] = useLocalStorage<string[]>('searchHistory', []);

  const addToSearchHistory = useCallback((query: string) => {
    if (query.trim().length < 2) return;
    
    setSearchHistory(prev => {
      const filtered = prev.filter(q => q.toLowerCase() !== query.toLowerCase());
      return [query, ...filtered].slice(0, 20); // Keep only last 20 searches
    });
  }, [setSearchHistory]);

  const removeFromSearchHistory = useCallback((query: string) => {
    setSearchHistory(prev => prev.filter(q => q !== query));
  }, [setSearchHistory]);

  const clearSearchHistory = useCallback(() => {
    setSearchHistory([]);
  }, [setSearchHistory]);

  return {
    searchHistory,
    addToSearchHistory,
    removeFromSearchHistory,
    clearSearchHistory
  };
}

// Hook for managing user preferences
export function useUserPreferences() {
  const [preferences, setPreferences] = useLocalStorage('userPreferences', {
    currency: 'USD',
    language: 'en',
    itemsPerPage: 20,
    defaultSort: 'relevance',
    showOutOfStock: true,
    emailNotifications: true,
    pushNotifications: false,
    darkMode: 'system' as 'light' | 'dark' | 'system'
  });

  const updatePreference = useCallback((key: string, value: any) => {
    setPreferences(prev => ({ ...prev, [key]: value }));
  }, [setPreferences]);

  return {
    preferences,
    updatePreference,
    setPreferences
  };
}

// Hook for offline state detection
export function useOfflineStatus() {
  const [isOffline, setIsOffline] = useState(!navigator.onLine);

  useEffect(() => {
    const handleOnline = () => setIsOffline(false);
    const handleOffline = () => setIsOffline(true);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  return isOffline;
}