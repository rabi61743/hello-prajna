import { useState } from 'react';
import { Minus, Plus, Package } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

interface QuantitySelectorProps {
  quantity: number;
  onQuantityChange: (quantity: number) => void;
  min?: number;
  max?: number;
  stock?: number;
  disabled?: boolean;
  size?: 'sm' | 'md' | 'lg';
  showStock?: boolean;
  className?: string;
}

export default function QuantitySelector({
  quantity = 1,
  onQuantityChange = () => {},
  min = 1,
  max,
  stock = 10,
  disabled = false,
  size = 'md',
  showStock = true,
  className
}: QuantitySelectorProps) {
  const [inputValue, setInputValue] = useState(quantity.toString());
  
  const effectiveMax = max !== undefined ? Math.min(max, stock) : stock;
  const isAtMin = quantity <= min;
  const isAtMax = quantity >= effectiveMax;
  const isLowStock = stock <= 5 && stock > 0;
  const isOutOfStock = stock <= 0;

  const handleIncrement = () => {
    if (!isAtMax && !disabled) {
      const newQuantity = quantity + 1;
      onQuantityChange(newQuantity);
      setInputValue(newQuantity.toString());
    }
  };

  const handleDecrement = () => {
    if (!isAtMin && !disabled) {
      const newQuantity = quantity - 1;
      onQuantityChange(newQuantity);
      setInputValue(newQuantity.toString());
    }
  };

  const handleInputChange = (value: string) => {
    setInputValue(value);
    
    const numValue = parseInt(value);
    if (!isNaN(numValue) && numValue >= min && numValue <= effectiveMax) {
      onQuantityChange(numValue);
    }
  };

  const handleInputBlur = () => {
    const numValue = parseInt(inputValue);
    if (isNaN(numValue) || numValue < min) {
      setInputValue(min.toString());
      onQuantityChange(min);
    } else if (numValue > effectiveMax) {
      setInputValue(effectiveMax.toString());
      onQuantityChange(effectiveMax);
    }
  };

  const sizeClasses = {
    sm: {
      button: 'h-8 w-8',
      input: 'h-8 w-12 text-sm',
      container: 'gap-1'
    },
    md: {
      button: 'h-10 w-10',
      input: 'h-10 w-16',
      container: 'gap-2'
    },
    lg: {
      button: 'h-12 w-12',
      input: 'h-12 w-20 text-lg',
      container: 'gap-3'
    }
  };

  const currentSize = sizeClasses[size];

  return (
    <div className={cn("space-y-3", className)}>
      {/* Quantity Selector */}
      <div className={cn("flex items-center", currentSize.container)}>
        <Button
          variant="outline"
          size="icon"
          className={currentSize.button}
          onClick={handleDecrement}
          disabled={isAtMin || disabled || isOutOfStock}
        >
          <Minus className="h-4 w-4" />
        </Button>
        
        <Input
          type="text"
          value={inputValue}
          onChange={(e) => handleInputChange(e.target.value)}
          onBlur={handleInputBlur}
          disabled={disabled || isOutOfStock}
          className={cn(
            "text-center font-medium",
            currentSize.input
          )}
          min={min}
          max={effectiveMax}
        />
        
        <Button
          variant="outline"
          size="icon"
          className={currentSize.button}
          onClick={handleIncrement}
          disabled={isAtMax || disabled || isOutOfStock}
        >
          <Plus className="h-4 w-4" />
        </Button>
      </div>

      {/* Stock Information */}
      {showStock && (
        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center gap-2">
            <Package className="h-4 w-4 text-muted-foreground" />
            <span className="text-muted-foreground">Stock:</span>
            <span className={cn(
              "font-medium",
              isOutOfStock && "text-destructive",
              isLowStock && !isOutOfStock && "text-yellow-600"
            )}>
              {isOutOfStock ? 'Out of stock' : `${stock} available`}
            </span>
          </div>

          {/* Stock Status Badge */}
          {isLowStock && !isOutOfStock && (
            <Badge variant="secondary" className="text-xs bg-yellow-100 text-yellow-800">
              Low Stock
            </Badge>
          )}
          
          {isOutOfStock && (
            <Badge variant="destructive" className="text-xs">
              Out of Stock
            </Badge>
          )}
        </div>
      )}

      {/* Bulk Purchase Options */}
      {stock >= 10 && size !== 'sm' && (
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              const newQuantity = Math.min(5, effectiveMax);
              onQuantityChange(newQuantity);
              setInputValue(newQuantity.toString());
            }}
            disabled={disabled || isOutOfStock}
            className="text-xs"
          >
            5 items
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              const newQuantity = Math.min(10, effectiveMax);
              onQuantityChange(newQuantity);
              setInputValue(newQuantity.toString());
            }}
            disabled={disabled || isOutOfStock}
            className="text-xs"
          >
            10 items
          </Button>
          {stock >= 20 && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                const newQuantity = Math.min(20, effectiveMax);
                onQuantityChange(newQuantity);
                setInputValue(newQuantity.toString());
              }}
              disabled={disabled || isOutOfStock}
              className="text-xs"
            >
              20 items
            </Button>
          )}
        </div>
      )}

      {/* Quantity Limits Info */}
      {(max || effectiveMax < stock) && size !== 'sm' && (
        <p className="text-xs text-muted-foreground">
          {max && max < stock 
            ? `Maximum ${max} items per order`
            : `Limited to ${effectiveMax} items`
          }
        </p>
      )}
    </div>
  );
}