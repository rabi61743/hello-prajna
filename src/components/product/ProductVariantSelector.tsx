import { useState } from 'react';
import { Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

export interface ProductVariant {
  id: string;
  name: string;
  type: 'color' | 'size' | 'style';
  value: string;
  available: boolean;
  price?: number; // Price difference from base price
  image?: string; // For color variants
}

interface ProductVariantSelectorProps {
  variants: ProductVariant[];
  selectedVariants: Record<string, string>;
  onVariantChange: (type: string, variantId: string) => void;
  className?: string;
}

export default function ProductVariantSelector({
  variants = [
    { id: 'red', name: 'Red', type: 'color', value: '#ef4444', available: true },
    { id: 'blue', name: 'Blue', type: 'color', value: '#3b82f6', available: true },
    { id: 'black', name: 'Black', type: 'color', value: '#000000', available: false },
    { id: 'xs', name: 'XS', type: 'size', value: 'XS', available: true },
    { id: 's', name: 'S', type: 'size', value: 'S', available: true },
    { id: 'm', name: 'M', type: 'size', value: 'M', available: true },
    { id: 'l', name: 'L', type: 'size', value: 'L', available: false },
    { id: 'xl', name: 'XL', type: 'size', value: 'XL', available: true }
  ],
  selectedVariants = {},
  onVariantChange = () => {},
  className
}: ProductVariantSelectorProps) {
  // Group variants by type
  const variantGroups = variants.reduce((groups, variant) => {
    if (!groups[variant.type]) {
      groups[variant.type] = [];
    }
    groups[variant.type].push(variant);
    return groups;
  }, {} as Record<string, ProductVariant[]>);

  const renderColorVariant = (variant: ProductVariant, isSelected: boolean) => (
    <button
      key={variant.id}
      onClick={() => variant.available && onVariantChange(variant.type, variant.id)}
      disabled={!variant.available}
      className={cn(
        "relative w-10 h-10 rounded-full border-2 transition-all",
        isSelected 
          ? "border-primary ring-2 ring-primary/20" 
          : "border-gray-300 hover:border-gray-400",
        !variant.available && "opacity-50 cursor-not-allowed"
      )}
      title={`${variant.name}${!variant.available ? ' (Out of stock)' : ''}`}
    >
      <div 
        className="w-full h-full rounded-full"
        style={{ backgroundColor: variant.value }}
      />
      {isSelected && (
        <div className="absolute inset-0 flex items-center justify-center">
          <Check className="h-4 w-4 text-white drop-shadow-lg" />
        </div>
      )}
      {!variant.available && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-8 h-0.5 bg-gray-500 rotate-45" />
        </div>
      )}
    </button>
  );

  const renderSizeVariant = (variant: ProductVariant, isSelected: boolean) => (
    <Button
      key={variant.id}
      variant={isSelected ? "default" : "outline"}
      size="sm"
      onClick={() => variant.available && onVariantChange(variant.type, variant.id)}
      disabled={!variant.available}
      className={cn(
        "min-w-[3rem] h-10",
        !variant.available && "opacity-50 cursor-not-allowed line-through"
      )}
    >
      {variant.value}
      {variant.price && variant.price !== 0 && (
        <span className="ml-1 text-xs">
          {variant.price > 0 ? `+$${variant.price}` : `-$${Math.abs(variant.price)}`}
        </span>
      )}
    </Button>
  );

  const renderStyleVariant = (variant: ProductVariant, isSelected: boolean) => (
    <div key={variant.id} className="flex-1">
      <Button
        variant={isSelected ? "default" : "outline"}
        onClick={() => variant.available && onVariantChange(variant.type, variant.id)}
        disabled={!variant.available}
        className={cn(
          "w-full h-12 text-left justify-start",
          !variant.available && "opacity-50 cursor-not-allowed"
        )}
      >
        <div className="flex items-center gap-3">
          {variant.image && (
            <img 
              src={variant.image} 
              alt={variant.name}
              className="w-8 h-8 rounded object-cover"
            />
          )}
          <div>
            <div className="font-medium">{variant.name}</div>
            {variant.price && variant.price !== 0 && (
              <div className="text-xs text-muted-foreground">
                {variant.price > 0 ? `+$${variant.price}` : `-$${Math.abs(variant.price)}`}
              </div>
            )}
          </div>
        </div>
      </Button>
    </div>
  );

  const getVariantTypeLabel = (type: string) => {
    switch (type) {
      case 'color': return 'Color';
      case 'size': return 'Size';
      case 'style': return 'Style';
      default: return type.charAt(0).toUpperCase() + type.slice(1);
    }
  };

  return (
    <div className={cn("space-y-6", className)}>
      {Object.entries(variantGroups).map(([type, typeVariants]) => {
        const selectedVariant = typeVariants.find(v => v.id === selectedVariants[type]);
        
        return (
          <div key={type} className="space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="font-medium text-sm">
                {getVariantTypeLabel(type)}
                {selectedVariant && (
                  <span className="ml-2 text-muted-foreground font-normal">
                    {selectedVariant.name}
                  </span>
                )}
              </h4>
              
              {/* Availability indicator */}
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <span>{typeVariants.filter(v => v.available).length} available</span>
                {typeVariants.some(v => !v.available) && (
                  <Badge variant="secondary" className="text-xs">
                    {typeVariants.filter(v => !v.available).length} out of stock
                  </Badge>
                )}
              </div>
            </div>

            {/* Variant Options */}
            <div className={cn(
              "flex gap-2",
              type === 'color' && "flex-wrap",
              type === 'size' && "flex-wrap",
              type === 'style' && "flex-col space-y-2"
            )}>
              {typeVariants.map((variant) => {
                const isSelected = selectedVariants[type] === variant.id;
                
                switch (type) {
                  case 'color':
                    return renderColorVariant(variant, isSelected);
                  case 'size':
                    return renderSizeVariant(variant, isSelected);
                  case 'style':
                    return renderStyleVariant(variant, isSelected);
                  default:
                    return renderSizeVariant(variant, isSelected);
                }
              })}
            </div>

            {/* Size Guide Link for size variants */}
            {type === 'size' && (
              <Button variant="link" size="sm" className="h-auto p-0 text-xs">
                Size Guide
              </Button>
            )}
          </div>
        );
      })}
    </div>
  );
}