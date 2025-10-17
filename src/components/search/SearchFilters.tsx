import { useState } from "react";
import { Filter, X, Star, DollarSign, Tag, Truck, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { ChevronDown } from "lucide-react";

export interface FilterState {
  searchQuery: string;
  categories: string[];
  brands: string[];
  priceRange: [number, number];
  rating: number;
  sortBy: string;
  inStock: boolean;
  onSale: boolean;
  freeShipping: boolean;
  features: string[];
}

interface SearchFiltersProps {
  filters: FilterState;
  onFiltersChange: (filters: FilterState) => void;
  className?: string;
  isMobile?: boolean;
}

const categories = [
  "Electronics", "Fashion", "Home & Garden", "Sports & Outdoors", 
  "Beauty & Personal Care", "Books", "Toys & Games", "Automotive"
];

const brands = [
  "Apple", "Samsung", "Nike", "Adidas", "Sony", "Canon", 
  "Dell", "HP", "Amazon", "Google", "Microsoft", "LG"
];

const features = [
  "Wireless", "Waterproof", "Bluetooth", "USB-C", "Fast Charging",
  "Eco-Friendly", "Organic", "Handmade", "Premium Quality", "Limited Edition"
];

export default function SearchFilters({ 
  filters = {
    searchQuery: "",
    categories: [],
    brands: [],
    priceRange: [0, 1000],
    rating: 0,
    sortBy: "relevance",
    inStock: false,
    onSale: false,
    freeShipping: false,
    features: []
  },
  onFiltersChange = () => {},
  className = "",
  isMobile = false
}: SearchFiltersProps) {
  const [isOpen, setIsOpen] = useState(false);

  const updateFilter = (key: keyof FilterState, value: any) => {
    onFiltersChange({ ...filters, [key]: value });
  };

  const toggleArrayFilter = (key: 'categories' | 'brands' | 'features', value: string) => {
    const currentArray = filters[key] || [];
    const newArray = currentArray.includes(value)
      ? currentArray.filter(item => item !== value)
      : [...currentArray, value];
    updateFilter(key, newArray);
  };

  const clearAllFilters = () => {
    onFiltersChange({
      searchQuery: filters.searchQuery, // Keep search query
      categories: [],
      brands: [],
      priceRange: [0, 1000],
      rating: 0,
      sortBy: "relevance",
      inStock: false,
      onSale: false,
      freeShipping: false,
      features: []
    });
  };

  const getActiveFiltersCount = () => {
    return (
      (filters.categories?.length || 0) +
      (filters.brands?.length || 0) +
      (filters.features?.length || 0) +
      (filters.rating > 0 ? 1 : 0) +
      (filters.priceRange?.[0] > 0 || filters.priceRange?.[1] < 1000 ? 1 : 0) +
      (filters.inStock ? 1 : 0) +
      (filters.onSale ? 1 : 0) +
      (filters.freeShipping ? 1 : 0)
    );
  };

  const FilterContent = () => (
    <div className="space-y-6">
      {/* Active Filters Summary */}
      {getActiveFiltersCount() > 0 && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="font-medium text-sm">Active Filters ({getActiveFiltersCount()})</h4>
            <Button variant="ghost" size="sm" onClick={clearAllFilters}>
              Clear All
            </Button>
          </div>
          
          <div className="flex flex-wrap gap-2">
            {filters.categories?.map(category => (
              <Badge key={category} variant="secondary" className="gap-1">
                {category}
                <X 
                  className="h-3 w-3 cursor-pointer" 
                  onClick={() => toggleArrayFilter('categories', category)}
                />
              </Badge>
            ))}
            {filters.brands?.map(brand => (
              <Badge key={brand} variant="secondary" className="gap-1">
                {brand}
                <X 
                  className="h-3 w-3 cursor-pointer" 
                  onClick={() => toggleArrayFilter('brands', brand)}
                />
              </Badge>
            ))}
            {filters.features?.map(feature => (
              <Badge key={feature} variant="secondary" className="gap-1">
                {feature}
                <X 
                  className="h-3 w-3 cursor-pointer" 
                  onClick={() => toggleArrayFilter('features', feature)}
                />
              </Badge>
            ))}
          </div>
        </div>
      )}

      {/* Quick Filters */}
      <div className="space-y-3">
        <h4 className="font-medium text-sm flex items-center gap-2">
          <Shield className="h-4 w-4" />
          Quick Filters
        </h4>
        <div className="space-y-2">
          <div className="flex items-center space-x-2">
            <Checkbox
              id="inStock"
              checked={filters.inStock}
              onCheckedChange={(checked) => updateFilter('inStock', checked)}
            />
            <label htmlFor="inStock" className="text-sm">In Stock Only</label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox
              id="onSale"
              checked={filters.onSale}
              onCheckedChange={(checked) => updateFilter('onSale', checked)}
            />
            <label htmlFor="onSale" className="text-sm">On Sale</label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox
              id="freeShipping"
              checked={filters.freeShipping}
              onCheckedChange={(checked) => updateFilter('freeShipping', checked)}
            />
            <label htmlFor="freeShipping" className="text-sm flex items-center gap-1">
              <Truck className="h-3 w-3" />
              Free Shipping
            </label>
          </div>
        </div>
      </div>

      <Separator />

      {/* Price Range */}
      <div className="space-y-3">
        <h4 className="font-medium text-sm flex items-center gap-2">
          <DollarSign className="h-4 w-4" />
          Price Range
        </h4>
        <div className="px-2">
          <Slider
            value={filters.priceRange || [0, 1000]}
            onValueChange={(value) => updateFilter('priceRange', value as [number, number])}
            max={1000}
            min={0}
            step={10}
            className="w-full"
          />
          <div className="flex justify-between text-sm text-muted-foreground mt-2">
            <span>${filters.priceRange?.[0] || 0}</span>
            <span>${filters.priceRange?.[1] || 1000}</span>
          </div>
        </div>
      </div>

      <Separator />

      {/* Rating Filter */}
      <div className="space-y-3">
        <h4 className="font-medium text-sm flex items-center gap-2">
          <Star className="h-4 w-4" />
          Minimum Rating
        </h4>
        <div className="space-y-2">
          {[4, 3, 2, 1].map((rating) => (
            <div key={rating} className="flex items-center space-x-2">
              <Checkbox
                id={`rating-${rating}`}
                checked={filters.rating === rating}
                onCheckedChange={(checked) => updateFilter('rating', checked ? rating : 0)}
              />
              <label htmlFor={`rating-${rating}`} className="text-sm flex items-center gap-1">
                <div className="flex">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`h-3 w-3 ${
                        i < rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"
                      }`}
                    />
                  ))}
                </div>
                & Up
              </label>
            </div>
          ))}
        </div>
      </div>

      <Separator />

      {/* Categories */}
      <Collapsible defaultOpen>
        <CollapsibleTrigger className="flex items-center justify-between w-full">
          <h4 className="font-medium text-sm flex items-center gap-2">
            <Tag className="h-4 w-4" />
            Categories ({filters.categories?.length || 0})
          </h4>
          <ChevronDown className="h-4 w-4" />
        </CollapsibleTrigger>
        <CollapsibleContent className="space-y-2 mt-3">
          {categories.map((category) => (
            <div key={category} className="flex items-center space-x-2">
              <Checkbox
                id={`category-${category}`}
                checked={filters.categories?.includes(category) || false}
                onCheckedChange={() => toggleArrayFilter('categories', category)}
              />
              <label htmlFor={`category-${category}`} className="text-sm">
                {category}
              </label>
            </div>
          ))}
        </CollapsibleContent>
      </Collapsible>

      <Separator />

      {/* Brands */}
      <Collapsible>
        <CollapsibleTrigger className="flex items-center justify-between w-full">
          <h4 className="font-medium text-sm">
            Brands ({filters.brands?.length || 0})
          </h4>
          <ChevronDown className="h-4 w-4" />
        </CollapsibleTrigger>
        <CollapsibleContent className="space-y-2 mt-3">
          {brands.map((brand) => (
            <div key={brand} className="flex items-center space-x-2">
              <Checkbox
                id={`brand-${brand}`}
                checked={filters.brands?.includes(brand) || false}
                onCheckedChange={() => toggleArrayFilter('brands', brand)}
              />
              <label htmlFor={`brand-${brand}`} className="text-sm">
                {brand}
              </label>
            </div>
          ))}
        </CollapsibleContent>
      </Collapsible>

      <Separator />

      {/* Features */}
      <Collapsible>
        <CollapsibleTrigger className="flex items-center justify-between w-full">
          <h4 className="font-medium text-sm">
            Features ({filters.features?.length || 0})
          </h4>
          <ChevronDown className="h-4 w-4" />
        </CollapsibleTrigger>
        <CollapsibleContent className="space-y-2 mt-3">
          {features.map((feature) => (
            <div key={feature} className="flex items-center space-x-2">
              <Checkbox
                id={`feature-${feature}`}
                checked={filters.features?.includes(feature) || false}
                onCheckedChange={() => toggleArrayFilter('features', feature)}
              />
              <label htmlFor={`feature-${feature}`} className="text-sm">
                {feature}
              </label>
            </div>
          ))}
        </CollapsibleContent>
      </Collapsible>
    </div>
  );

  if (isMobile) {
    return (
      <Sheet open={isOpen} onOpenChange={setIsOpen}>
        <SheetTrigger asChild>
          <Button variant="outline" className="gap-2">
            <Filter className="h-4 w-4" />
            Filters
            {getActiveFiltersCount() > 0 && (
              <Badge variant="secondary" className="ml-1 h-5 min-w-[20px] text-xs">
                {getActiveFiltersCount()}
              </Badge>
            )}
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="w-80 overflow-y-auto">
          <SheetHeader>
            <SheetTitle>Filters</SheetTitle>
          </SheetHeader>
          <div className="mt-6">
            <FilterContent />
          </div>
        </SheetContent>
      </Sheet>
    );
  }

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="text-lg flex items-center gap-2">
          <Filter className="h-5 w-5" />
          Filters
          {getActiveFiltersCount() > 0 && (
            <Badge variant="secondary" className="ml-2">
              {getActiveFiltersCount()}
            </Badge>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <FilterContent />
      </CardContent>
    </Card>
  );
}