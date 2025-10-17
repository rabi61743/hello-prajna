import { useEffect, useCallback } from 'react';
import { useLocation } from 'react-router-dom';

interface AnalyticsEvent {
  category: string;
  action: string;
  label?: string;
  value?: number;
  metadata?: Record<string, any>;
}

interface ProductViewEvent {
  productId: string;
  productName: string;
  price: number;
  category: string;
}

interface SearchEvent {
  query: string;
  resultsCount: number;
  filters?: Record<string, any>;
}

interface CartEvent {
  productId: string;
  productName: string;
  price: number;
  quantity: number;
  action: 'add' | 'remove' | 'update';
}

interface CheckoutEvent {
  step: number;
  stepName: string;
  cartTotal: number;
  itemCount: number;
}

class AnalyticsService {
  private events: AnalyticsEvent[] = [];
  private sessionId: string;
  private userId?: string;

  constructor() {
    this.sessionId = this.generateSessionId();
    this.loadUserId();
  }

  private generateSessionId(): string {
    return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  private loadUserId() {
    const stored = localStorage.getItem('analytics_user_id');
    if (stored) {
      this.userId = stored;
    } else {
      this.userId = `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      localStorage.setItem('analytics_user_id', this.userId);
    }
  }

  track(event: AnalyticsEvent) {
    const enrichedEvent = {
      ...event,
      timestamp: new Date().toISOString(),
      sessionId: this.sessionId,
      userId: this.userId,
      url: window.location.href,
      userAgent: navigator.userAgent
    };

    this.events.push(enrichedEvent);
    
    // Store in localStorage for persistence
    this.saveToStorage();
    
    // Log to console in development
    if (process.env.NODE_ENV === 'development') {
      console.log('[Analytics]', enrichedEvent);
    }

    // In production, you would send this to your analytics service
    // this.sendToServer(enrichedEvent);
  }

  private saveToStorage() {
    try {
      const stored = localStorage.getItem('analytics_events') || '[]';
      const events = JSON.parse(stored);
      events.push(...this.events);
      
      // Keep only last 100 events
      const trimmed = events.slice(-100);
      localStorage.setItem('analytics_events', JSON.stringify(trimmed));
      
      this.events = [];
    } catch (error) {
      console.error('Failed to save analytics:', error);
    }
  }

  getEvents(): AnalyticsEvent[] {
    try {
      const stored = localStorage.getItem('analytics_events');
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  }

  clearEvents() {
    localStorage.removeItem('analytics_events');
    this.events = [];
  }
}

const analytics = new AnalyticsService();

export function useAnalytics() {
  const location = useLocation();

  // Track page views
  useEffect(() => {
    analytics.track({
      category: 'Navigation',
      action: 'Page View',
      label: location.pathname,
      metadata: {
        search: location.search,
        hash: location.hash
      }
    });
  }, [location]);

  const trackProductView = useCallback((event: ProductViewEvent) => {
    analytics.track({
      category: 'Product',
      action: 'View',
      label: event.productName,
      value: event.price,
      metadata: {
        productId: event.productId,
        category: event.category
      }
    });
  }, []);

  const trackProductClick = useCallback((event: ProductViewEvent) => {
    analytics.track({
      category: 'Product',
      action: 'Click',
      label: event.productName,
      value: event.price,
      metadata: {
        productId: event.productId,
        category: event.category
      }
    });
  }, []);

  const trackSearch = useCallback((event: SearchEvent) => {
    analytics.track({
      category: 'Search',
      action: 'Query',
      label: event.query,
      value: event.resultsCount,
      metadata: {
        filters: event.filters
      }
    });
  }, []);

  const trackCartAction = useCallback((event: CartEvent) => {
    analytics.track({
      category: 'Cart',
      action: event.action === 'add' ? 'Add to Cart' : 
              event.action === 'remove' ? 'Remove from Cart' : 
              'Update Cart',
      label: event.productName,
      value: event.price * event.quantity,
      metadata: {
        productId: event.productId,
        quantity: event.quantity
      }
    });
  }, []);

  const trackCheckout = useCallback((event: CheckoutEvent) => {
    analytics.track({
      category: 'Checkout',
      action: `Step ${event.step}`,
      label: event.stepName,
      value: event.cartTotal,
      metadata: {
        itemCount: event.itemCount
      }
    });
  }, []);

  const trackWishlistAction = useCallback((productId: string, productName: string, action: 'add' | 'remove') => {
    analytics.track({
      category: 'Wishlist',
      action: action === 'add' ? 'Add to Wishlist' : 'Remove from Wishlist',
      label: productName,
      metadata: {
        productId
      }
    });
  }, []);

  const trackFilterChange = useCallback((filters: Record<string, any>) => {
    analytics.track({
      category: 'Filters',
      action: 'Apply',
      metadata: filters
    });
  }, []);

  const trackSortChange = useCallback((sortBy: string) => {
    analytics.track({
      category: 'Sort',
      action: 'Change',
      label: sortBy
    });
  }, []);

  const trackError = useCallback((error: Error, context?: string) => {
    analytics.track({
      category: 'Error',
      action: 'Exception',
      label: error.message,
      metadata: {
        stack: error.stack,
        context
      }
    });
  }, []);

  const trackPerformance = useCallback((metric: string, value: number) => {
    analytics.track({
      category: 'Performance',
      action: metric,
      value,
      metadata: {
        timestamp: Date.now()
      }
    });
  }, []);

  return {
    trackProductView,
    trackProductClick,
    trackSearch,
    trackCartAction,
    trackCheckout,
    trackWishlistAction,
    trackFilterChange,
    trackSortChange,
    trackError,
    trackPerformance,
    getEvents: () => analytics.getEvents(),
    clearEvents: () => analytics.clearEvents()
  };
}

// Performance monitoring hook
export function usePerformanceMonitoring() {
  const { trackPerformance } = useAnalytics();

  useEffect(() => {
    // Track page load time
    if (window.performance && window.performance.timing) {
      const timing = window.performance.timing;
      const loadTime = timing.loadEventEnd - timing.navigationStart;
      
      if (loadTime > 0) {
        trackPerformance('Page Load Time', loadTime);
      }
    }

    // Track First Contentful Paint
    if ('PerformanceObserver' in window) {
      try {
        const observer = new PerformanceObserver((list) => {
          for (const entry of list.getEntries()) {
            if (entry.name === 'first-contentful-paint') {
              trackPerformance('First Contentful Paint', entry.startTime);
            }
          }
        });
        observer.observe({ entryTypes: ['paint'] });
        
        return () => observer.disconnect();
      } catch (error) {
        console.error('Performance observer error:', error);
      }
    }
  }, [trackPerformance]);
}
