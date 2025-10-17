import { ChevronRight, Home } from 'lucide-react';
import { Link } from 'react-router-dom';
import { cn } from '@/lib/utils';

export interface BreadcrumbItem {
  label: string;
  href?: string;
  isActive?: boolean;
}

interface BreadcrumbProps {
  items: BreadcrumbItem[];
  className?: string;
  showHome?: boolean;
}

export default function Breadcrumb({ 
  items = [
    { label: 'Electronics', href: '/category/electronics' },
    { label: 'Headphones', href: '/category/electronics/headphones' },
    { label: 'Wireless Headphones', isActive: true }
  ],
  className,
  showHome = true 
}: BreadcrumbProps) {
  const allItems = showHome 
    ? [{ label: 'Home', href: '/' }, ...items]
    : items;

  return (
    <nav 
      aria-label="Breadcrumb" 
      className={cn("flex items-center space-x-1 text-sm text-muted-foreground", className)}
    >
      <ol className="flex items-center space-x-1">
        {allItems.map((item, index) => {
          const isLast = index === allItems.length - 1;
          const isFirst = index === 0 && showHome;
          
          return (
            <li key={index} className="flex items-center">
              {index > 0 && (
                <ChevronRight className="h-4 w-4 mx-1 text-muted-foreground/50" />
              )}
              
              {item.href && !item.isActive ? (
                <Link
                  to={item.href}
                  className={cn(
                    "hover:text-foreground transition-colors flex items-center gap-1",
                    isFirst && "font-medium"
                  )}
                >
                  {isFirst && <Home className="h-4 w-4" />}
                  <span className={cn(isFirst && "sr-only sm:not-sr-only")}>
                    {item.label}
                  </span>
                </Link>
              ) : (
                <span 
                  className={cn(
                    "flex items-center gap-1",
                    (item.isActive || isLast) && "text-foreground font-medium",
                    isFirst && "font-medium"
                  )}
                  aria-current={item.isActive || isLast ? "page" : undefined}
                >
                  {isFirst && <Home className="h-4 w-4" />}
                  <span className={cn(isFirst && "sr-only sm:not-sr-only")}>
                    {item.label}
                  </span>
                </span>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}