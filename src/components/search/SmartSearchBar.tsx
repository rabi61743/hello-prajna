import { useState, useEffect, useRef } from 'react';
import { Search, X, Clock, TrendingUp, Filter } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { useSearchHistory } from '@/hooks/useLocalStorage';
import { cn } from '@/lib/utils';

interface SearchSuggestion {
  id: string;
  text: string;
  type: 'product' | 'category' | 'brand' | 'query';
  count?: number;
  image?: string;
}

interface SmartSearchBarProps {
  value: string;
  onChange: (value: string) => void;
  onSearch: (query: string) => void;
  onFilterToggle?: () => void;
  placeholder?: string;
  showFilters?: boolean;
  activeFiltersCount?: number;
  className?: string;
}

const mockSuggestions: SearchSuggestion[] = [
  { id: '1', text: 'iPhone 15 Pro', type: 'product', image: 'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=100&q=80' },
  { id: '2', text: 'Samsung Galaxy', type: 'product', image: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=100&q=80' },
  { id: '3', text: 'Wireless Headphones', type: 'category', count: 156 },
  { id: '4', text: 'Apple', type: 'brand', count: 89 },
  { id: '5', text: 'Gaming Laptop', type: 'category', count: 45 },
  { id: '6', text: 'Nike Air Max', type: 'product', image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=100&q=80' },
  { id: '7', text: 'Smart Watch', type: 'category', count: 78 },
  { id: '8', text: 'Sony', type: 'brand', count: 34 }
];

const trendingSearches = [
  'iPhone 15', 'Black Friday Deals', 'Gaming Setup', 'Winter Jackets', 'Smart Home'
];

export default function SmartSearchBar({
  value = '',
  onChange = () => {},
  onSearch = () => {},
  onFilterToggle,
  placeholder = 'Search products, brands, categories...',
  showFilters = false,
  activeFiltersCount = 0,
  className
}: SmartSearchBarProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [suggestions, setSuggestions] = useState<SearchSuggestion[]>([]);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const searchRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  
  const { 
    searchHistory, 
    addToSearchHistory, 
    removeFromSearchHistory, 
    clearSearchHistory 
  } = useSearchHistory();

  // Filter suggestions based on input
  useEffect(() => {
    if (value.length > 0) {
      const filtered = mockSuggestions.filter(suggestion =>
        suggestion.text.toLowerCase().includes(value.toLowerCase())
      );
      setSuggestions(filtered);
    } else {
      setSuggestions([]);
    }
    setSelectedIndex(-1);
  }, [value]);

  // Handle click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Handle keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!isOpen) return;

    const totalItems = suggestions.length + (value.length === 0 ? searchHistory.length : 0);

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setSelectedIndex(prev => (prev + 1) % totalItems);
        break;
      case 'ArrowUp':
        e.preventDefault();
        setSelectedIndex(prev => (prev - 1 + totalItems) % totalItems);
        break;
      case 'Enter':
        e.preventDefault();
        if (selectedIndex >= 0) {
          if (value.length === 0 && selectedIndex < searchHistory.length) {
            // Select from history
            const selectedQuery = searchHistory[selectedIndex];
            onChange(selectedQuery);
            handleSearch(selectedQuery);
          } else if (suggestions.length > 0) {
            // Select from suggestions
            const adjustedIndex = value.length === 0 ? selectedIndex - searchHistory.length : selectedIndex;
            if (adjustedIndex >= 0 && adjustedIndex < suggestions.length) {
              const selectedSuggestion = suggestions[adjustedIndex];
              onChange(selectedSuggestion.text);
              handleSearch(selectedSuggestion.text);
            }
          }
        } else {
          handleSearch(value);
        }
        break;
      case 'Escape':
        setIsOpen(false);
        inputRef.current?.blur();
        break;
    }
  };

  const handleSearch = (query: string) => {
    if (query.trim()) {
      addToSearchHistory(query.trim());
      onSearch(query.trim());
      setIsOpen(false);
    }
  };

  const handleSuggestionClick = (suggestion: SearchSuggestion) => {
    onChange(suggestion.text);
    handleSearch(suggestion.text);
  };

  const handleHistoryClick = (query: string) => {
    onChange(query);
    handleSearch(query);
  };

  const handleClear = () => {
    onChange('');
    inputRef.current?.focus();
  };

  const getSuggestionIcon = (type: SearchSuggestion['type']) => {
    switch (type) {
      case 'product':
        return <Search className="h-4 w-4 text-muted-foreground" />;
      case 'category':
        return <Filter className="h-4 w-4 text-muted-foreground" />;
      case 'brand':
        return <TrendingUp className="h-4 w-4 text-muted-foreground" />;
      default:
        return <Search className="h-4 w-4 text-muted-foreground" />;
    }
  };

  return (
    <div ref={searchRef} className={cn("relative w-full max-w-2xl", className)}>
      {/* Search Input */}
      <div className="relative">
        <div className="flex items-center">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              ref={inputRef}
              type="text"
              placeholder={placeholder}
              value={value}
              onChange={(e) => onChange(e.target.value)}
              onFocus={() => setIsOpen(true)}
              onKeyDown={handleKeyDown}
              className="pl-10 pr-10 h-12 text-base"
            />
            {value && (
              <Button
                variant="ghost"
                size="icon"
                onClick={handleClear}
                className="absolute right-2 top-1/2 -translate-y-1/2 h-6 w-6"
              >
                <X className="h-4 w-4" />
              </Button>
            )}
          </div>
          
          {/* Filter Toggle */}
          {showFilters && (
            <Button
              variant="outline"
              onClick={onFilterToggle}
              className="ml-2 h-12 gap-2"
            >
              <Filter className="h-4 w-4" />
              Filters
              {activeFiltersCount > 0 && (
                <Badge variant="secondary" className="ml-1 h-5 min-w-[20px] text-xs">
                  {activeFiltersCount}
                </Badge>
              )}
            </Button>
          )}
        </div>
      </div>

      {/* Dropdown */}
      {isOpen && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-background border rounded-lg shadow-lg z-50 max-h-96 overflow-y-auto">
          {/* Search History */}
          {value.length === 0 && searchHistory.length > 0 && (
            <div className="p-3">
              <div className="flex items-center justify-between mb-3">
                <h4 className="text-sm font-medium text-muted-foreground">Recent Searches</h4>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={clearSearchHistory}
                  className="text-xs h-auto p-1"
                >
                  Clear All
                </Button>
              </div>
              <div className="space-y-1">
                {searchHistory.slice(0, 5).map((query, index) => (
                  <div
                    key={query}
                    onClick={() => handleHistoryClick(query)}
                    className={cn(
                      "flex items-center gap-3 p-2 rounded-md cursor-pointer hover:bg-muted",
                      selectedIndex === index && "bg-muted"
                    )}
                  >
                    <Clock className="h-4 w-4 text-muted-foreground" />
                    <span className="flex-1 text-sm">{query}</span>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={(e) => {
                        e.stopPropagation();
                        removeFromSearchHistory(query);
                      }}
                      className="h-6 w-6 opacity-0 group-hover:opacity-100"
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Trending Searches */}
          {value.length === 0 && (
            <div className="p-3">
              <h4 className="text-sm font-medium text-muted-foreground mb-3">Trending</h4>
              <div className="flex flex-wrap gap-2">
                {trendingSearches.map((trend) => (
                  <Badge
                    key={trend}
                    variant="secondary"
                    className="cursor-pointer hover:bg-secondary/80"
                    onClick={() => {
                      onChange(trend);
                      handleSearch(trend);
                    }}
                  >
                    <TrendingUp className="h-3 w-3 mr-1" />
                    {trend}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {/* Suggestions */}
          {suggestions.length > 0 && (
            <>
              {(value.length === 0 && searchHistory.length > 0) && <Separator />}
              <div className="p-3">
                <h4 className="text-sm font-medium text-muted-foreground mb-3">Suggestions</h4>
                <div className="space-y-1">
                  {suggestions.map((suggestion, index) => {
                    const adjustedIndex = value.length === 0 ? index + searchHistory.length : index;
                    return (
                      <div
                        key={suggestion.id}
                        onClick={() => handleSuggestionClick(suggestion)}
                        className={cn(
                          "flex items-center gap-3 p-2 rounded-md cursor-pointer hover:bg-muted",
                          selectedIndex === adjustedIndex && "bg-muted"
                        )}
                      >
                        {suggestion.image ? (
                          <img
                            src={suggestion.image}
                            alt={suggestion.text}
                            className="w-8 h-8 rounded object-cover"
                          />
                        ) : (
                          getSuggestionIcon(suggestion.type)
                        )}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <span className="text-sm truncate">{suggestion.text}</span>
                            <Badge variant="outline" className="text-xs">
                              {suggestion.type}
                            </Badge>
                          </div>
                          {suggestion.count && (
                            <p className="text-xs text-muted-foreground">
                              {suggestion.count} results
                            </p>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </>
          )}

          {/* No Results */}
          {value.length > 0 && suggestions.length === 0 && (
            <div className="p-6 text-center">
              <Search className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
              <p className="text-sm text-muted-foreground">No suggestions found</p>
              <Button
                variant="link"
                size="sm"
                onClick={() => handleSearch(value)}
                className="mt-2"
              >
                Search for "{value}"
              </Button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}