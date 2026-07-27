# Ecommerce Marketplace (Amazon) - Frontend System Design

## Table of Contents

1. [Requirements Overview](#1-requirements-overview)
2. [High-Level Architecture](#2-high-level-architecture)
3. [Core Data Types](#3-core-data-types)
4. [Cart Store (Zustand)](#4-cart-store-zustand)
5. [Product List Data Fetching](#5-product-list-data-fetching)
6. [Product Card Component](#6-product-card-component)
7. [Product Grid Component](#7-product-grid-component)
8. [Search with Autocomplete](#8-search-with-autocomplete)
9. [Filter Sidebar Component](#9-filter-sidebar-component)
10. [Price Range Filter](#10-price-range-filter)
11. [Rating Filter](#11-rating-filter)
12. [Facet Filter (Dynamic)](#12-facet-filter-dynamic)
13. [Product Detail Page](#13-product-detail-page)
14. [Product Image Gallery](#14-product-image-gallery)
15. [Variant Selector](#15-variant-selector)
16. [Cart Drawer](#16-cart-drawer)
17. [Cart Item Component](#17-cart-item-component)
18. [Multi-Step Checkout](#18-multi-step-checkout)
19. [Review & Rating System](#19-review--rating-system)
20. [Review Card Component](#20-review-card-component)
21. [Product Recommendations Carousel](#21-product-recommendations-carousel)
22. [Wishlist Management](#22-wishlist-management)
23. [URL-Based Filter State](#23-url-based-filter-state)
24. [Performance Optimizations](#24-performance-optimizations)
25. [Recently Viewed Products](#25-recently-viewed-products)
26. [Accessibility Considerations](#26-accessibility-considerations)

---

## 1. Requirements Overview

### Functional Requirements
- **Product Catalog**: Browse, search, filter products
- **Product Details**: Images, descriptions, reviews, Q&A
- **Shopping Cart**: Add, update, remove items
- **Checkout**: Multi-step checkout with payment
- **User Account**: Orders, addresses, payment methods
- **Search**: Autocomplete, filters, faceted search
- **Reviews & Ratings**: Write and browse reviews
- **Wishlist**: Save products for later
- **Recommendations**: Personalized product suggestions

### Non-Functional Requirements
- **Performance**: < 3s LCP, instant cart updates
- **SEO**: Server-side rendering for product pages
- **Scalability**: Handle millions of products
- **Accessibility**: WCAG 2.1 AA compliance
- **Mobile-first**: Responsive across all devices

---

## 2. High-Level Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                     Ecommerce Application                        │
├─────────────────────────────────────────────────────────────────┤
│  ┌──────────┐  ┌──────────────┐  ┌─────────────────────────┐   │
│  │  Header  │  │   Product    │  │      Sidebar            │   │
│  │  Search  │  │   Grid/List  │  │      Filters            │   │
│  │  Cart    │  │              │  │      Categories         │   │
│  └──────────┘  └──────────────┘  └─────────────────────────┘   │
├─────────────────────────────────────────────────────────────────┤
│                      State Management (Zustand)                  │
├─────────────────────────────────────────────────────────────────┤
│  Cart Store  │  User Store  │  Search Store  │  Filter Store   │
├─────────────────────────────────────────────────────────────────┤
│                    Data Layer (TanStack Query)                   │
├─────────────────────────────────────────────────────────────────┤
│  Products API  │  Cart API  │  Orders API  │  Search API       │
└─────────────────────────────────────────────────────────────────┘
```

---

## 3. Core Data Types

```typescript
// types/product.ts
interface Product {
  id: string;
  sku: string;
  title: string;
  slug: string;
  description: string;
  brand: Brand;
  category: Category;
  images: ProductImage[];
  price: Price;
  variants: ProductVariant[];
  inventory: InventoryStatus;
  rating: Rating;
  reviewCount: number;
  specifications: Specification[];
  tags: string[];
  isFeatured: boolean;
  createdAt: string;
}

interface Price {
  amount: number;
  currency: string;
  compareAt?: number; // Original price for discounts
  discount?: Discount;
}

interface Discount {
  type: 'percentage' | 'fixed';
  value: number;
  validUntil?: string;
}

interface ProductImage {
  id: string;
  url: string;
  alt: string;
  width: number;
  height: number;
  isPrimary: boolean;
}

interface ProductVariant {
  id: string;
  sku: string;
  name: string;
  options: VariantOption[];
  price: Price;
  inventory: InventoryStatus;
  image?: ProductImage;
}

interface VariantOption {
  name: string; // e.g., "Color", "Size"
  value: string; // e.g., "Red", "XL"
}

interface InventoryStatus {
  inStock: boolean;
  quantity: number;
  lowStockThreshold: number;
  backorderAllowed: boolean;
}

interface Category {
  id: string;
  name: string;
  slug: string;
  parentId?: string;
  children?: Category[];
  image?: string;
  productCount: number;
}

interface Brand {
  id: string;
  name: string;
  slug: string;
  logo?: string;
}

// types/cart.ts
interface Cart {
  id: string;
  items: CartItem[];
  subtotal: number;
  tax: number;
  shipping: number;
  discount: number;
  total: number;
  currency: string;
  itemCount: number;
}

interface CartItem {
  id: string;
  productId: string;
  variantId?: string;
  title: string;
  image: string;
  price: number;
  quantity: number;
  maxQuantity: number;
  variant?: VariantOption[];
}
```

---

## 4. Cart Store (Zustand)

```typescript
// stores/cartStore.ts
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface CartState {
  cart: Cart | null;
  isOpen: boolean;
  isLoading: boolean;

  // Actions
  openCart: () => void;
  closeCart: () => void;
  addItem: (product: Product, quantity: number, variantId?: string) => Promise<void>;
  updateQuantity: (itemId: string, quantity: number) => Promise<void>;
  removeItem: (itemId: string) => Promise<void>;
  clearCart: () => Promise<void>;
  applyCoupon: (code: string) => Promise<boolean>;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      cart: null,
      isOpen: false,
      isLoading: false,

      openCart: () => set({ isOpen: true }),
      closeCart: () => set({ isOpen: false }),

      addItem: async (product, quantity, variantId) => {
        set({ isLoading: true });
        try {
          const res = await fetch('/api/cart/items', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ productId: product.id, quantity, variantId }),
          });
          const cart = await res.json();
          set({ cart, isOpen: true });
        } finally {
          set({ isLoading: false });
        }
      },

      updateQuantity: async (itemId, quantity) => {
        const prevCart = get().cart;
        // Optimistic update
        set((state) => ({
          cart: state.cart ? {
            ...state.cart,
            items: state.cart.items.map((item) =>
              item.id === itemId ? { ...item, quantity } : item
            ),
          } : null,
        }));

        try {
          const res = await fetch(`/api/cart/items/${itemId}`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ quantity }),
          });
          const cart = await res.json();
          set({ cart });
        } catch {
          set({ cart: prevCart }); // Rollback on error
        }
      },

      removeItem: async (itemId) => {
        const prevCart = get().cart;
        // Optimistic update
        set((state) => ({
          cart: state.cart ? {
            ...state.cart,
            items: state.cart.items.filter((item) => item.id !== itemId),
          } : null,
        }));

        try {
          const res = await fetch(`/api/cart/items/${itemId}`, { method: 'DELETE' });
          const cart = await res.json();
          set({ cart });
        } catch {
          set({ cart: prevCart });
        }
      },

      clearCart: async () => {
        await fetch('/api/cart', { method: 'DELETE' });
        set({ cart: null });
      },

      applyCoupon: async (code) => {
        const res = await fetch('/api/cart/coupon', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ code }),
        });
        if (res.ok) {
          const cart = await res.json();
          set({ cart });
          return true;
        }
        return false;
      },
    }),
    { name: 'cart-storage' }
  )
);
```

---

## 5. Product List Data Fetching

```typescript
// hooks/useProducts.ts
import { useInfiniteQuery } from '@tanstack/react-query';

interface ProductsResponse {
  products: Product[];
  totalCount: number;
  page: number;
  pageSize: number;
  hasMore: boolean;
  facets: Facet[];
}

interface Facet {
  field: string;
  label: string;
  values: FacetValue[];
}

interface FacetValue {
  value: string;
  count: number;
  selected: boolean;
}

interface ProductFilters {
  category?: string;
  brand?: string[];
  priceMin?: number;
  priceMax?: number;
  rating?: number;
  inStock?: boolean;
  sort?: 'price_asc' | 'price_desc' | 'rating' | 'newest' | 'bestselling';
  search?: string;
}

export function useProducts(filters: ProductFilters) {
  return useInfiniteQuery({
    queryKey: ['products', filters],
    queryFn: async ({ pageParam = 1 }) => {
      const params = new URLSearchParams({
        page: String(pageParam),
        pageSize: '24',
        ...Object.fromEntries(
          Object.entries(filters).filter(([_, v]) => v !== undefined)
        ),
      });

      const res = await fetch(`/api/products?${params}`);
      return res.json() as Promise<ProductsResponse>;
    },
    getNextPageParam: (lastPage) =>
      lastPage.hasMore ? lastPage.page + 1 : undefined,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}
```

---

## 6. Product Card Component

```tsx
// components/ProductCard.tsx
import { memo } from 'react';
import { Heart, Star, ShoppingCart } from 'lucide-react';
import { formatPrice } from '@/utils/format';

interface ProductCardProps {
  product: Product;
  variant?: 'grid' | 'list';
}

export const ProductCard = memo(function ProductCard({
  product,
  variant = 'grid',
}: ProductCardProps) {
  const { addItem, isLoading } = useCartStore();
  const { toggleWishlist, isInWishlist } = useWishlistStore();
  const inWishlist = isInWishlist(product.id);

  const primaryImage = product.images.find((i) => i.isPrimary) || product.images[0];
  const hasDiscount = product.price.compareAt && product.price.compareAt > product.price.amount;
  const discountPercent = hasDiscount
    ? Math.round((1 - product.price.amount / product.price.compareAt!) * 100)
    : 0;

  if (variant === 'list') {
    return <ProductCardList product={product} />;
  }

  return (
    <div className="group relative bg-white rounded-lg border hover:shadow-lg transition-shadow">
      {/* Image */}
      <Link href={`/product/${product.slug}`} className="block aspect-square overflow-hidden rounded-t-lg">
        <img
          src={primaryImage.url}
          alt={primaryImage.alt}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform"
          loading="lazy"
        />
      </Link>

      {/* Badges */}
      <div className="absolute top-2 left-2 flex flex-col gap-1">
        {hasDiscount && (
          <span className="px-2 py-0.5 bg-red-500 text-white text-xs font-medium rounded">
            -{discountPercent}%
          </span>
        )}
        {!product.inventory.inStock && (
          <span className="px-2 py-0.5 bg-gray-500 text-white text-xs rounded">
            Out of Stock
          </span>
        )}
      </div>

      {/* Wishlist button */}
      <button
        onClick={() => toggleWishlist(product.id)}
        className="absolute top-2 right-2 p-2 bg-white rounded-full shadow-md opacity-0 group-hover:opacity-100 transition-opacity"
      >
        <Heart
          className={cn('w-4 h-4', inWishlist ? 'fill-red-500 text-red-500' : 'text-gray-400')}
        />
      </button>

      {/* Content */}
      <div className="p-4">
        <Link href={`/product/${product.slug}`}>
          <h3 className="font-medium text-gray-900 line-clamp-2 hover:text-blue-600">
            {product.title}
          </h3>
        </Link>

        {/* Rating */}
        <div className="flex items-center gap-1 mt-1">
          <div className="flex">
            {[1, 2, 3, 4, 5].map((star) => (
              <Star
                key={star}
                className={cn(
                  'w-4 h-4',
                  star <= product.rating.average
                    ? 'fill-yellow-400 text-yellow-400'
                    : 'text-gray-300'
                )}
              />
            ))}
          </div>
          <span className="text-sm text-gray-500">({product.reviewCount})</span>
        </div>

        {/* Price */}
        <div className="mt-2 flex items-baseline gap-2">
          <span className="text-lg font-bold text-gray-900">
            {formatPrice(product.price.amount, product.price.currency)}
          </span>
          {hasDiscount && (
            <span className="text-sm text-gray-500 line-through">
              {formatPrice(product.price.compareAt!, product.price.currency)}
            </span>
          )}
        </div>

        {/* Add to Cart */}
        <button
          onClick={() => addItem(product, 1)}
          disabled={!product.inventory.inStock || isLoading}
          className="mt-3 w-full py-2 bg-yellow-400 hover:bg-yellow-500 text-sm font-medium rounded disabled:bg-gray-200 disabled:cursor-not-allowed"
        >
          Add to Cart
        </button>
      </div>
    </div>
  );
});
```

---

## 7. Product Grid Component

```tsx
// components/ProductGrid.tsx
import { useMemo } from 'react';

interface ProductGridProps {
  filters: ProductFilters;
  viewMode: 'grid' | 'list';
}

export function ProductGrid({ filters, viewMode }: ProductGridProps) {
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
  } = useProducts(filters);

  const products = useMemo(
    () => data?.pages.flatMap((p) => p.products) ?? [],
    [data]
  );

  const totalCount = data?.pages[0]?.totalCount ?? 0;

  if (isLoading) {
    return <ProductGridSkeleton count={12} viewMode={viewMode} />;
  }

  if (products.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">No products found</p>
      </div>
    );
  }

  return (
    <div>
      {/* Results count */}
      <p className="text-sm text-gray-500 mb-4">
        Showing {products.length} of {totalCount} products
      </p>

      {/* Grid/List */}
      <div
        className={cn(
          viewMode === 'grid'
            ? 'grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4'
            : 'flex flex-col gap-4'
        )}
      >
        {products.map((product) => (
          <ProductCard key={product.id} product={product} variant={viewMode} />
        ))}
      </div>

      {/* Load More */}
      {hasNextPage && (
        <div className="mt-8 text-center">
          <button
            onClick={() => fetchNextPage()}
            disabled={isFetchingNextPage}
            className="px-6 py-2 bg-white border rounded-lg hover:bg-gray-50"
          >
            {isFetchingNextPage ? 'Loading...' : 'Load More'}
          </button>
        </div>
      )}
    </div>
  );
}

function ProductGridSkeleton({ count, viewMode }: { count: number; viewMode: 'grid' | 'list' }) {
  return (
    <div
      className={cn(
        viewMode === 'grid'
          ? 'grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4'
          : 'flex flex-col gap-4'
      )}
    >
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="bg-white rounded-lg border p-4 animate-pulse">
          <div className="aspect-square bg-gray-200 rounded mb-4" />
          <div className="h-4 bg-gray-200 rounded w-3/4 mb-2" />
          <div className="h-4 bg-gray-200 rounded w-1/2" />
        </div>
      ))}
    </div>
  );
}
```

---

## 8. Search with Autocomplete

```tsx
// components/SearchBar.tsx
import { useState, useRef, useEffect } from 'react';
import { Search, X, Clock, TrendingUp } from 'lucide-react';
import { useDebounce } from '@/hooks/useDebounce';

export function SearchBar() {
  const [query, setQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const debouncedQuery = useDebounce(query, 200);

  const { data: suggestions } = useSearchSuggestions(debouncedQuery);
  const { data: recentSearches } = useRecentSearches();
  const { data: trendingSearches } = useTrendingSearches();

  const handleSearch = (searchQuery: string) => {
    saveRecentSearch(searchQuery);
    router.push(`/search?q=${encodeURIComponent(searchQuery)}`);
    setIsOpen(false);
  };

  return (
    <div className="relative flex-1 max-w-2xl">
      <div className="flex items-center bg-white border rounded-lg focus-within:ring-2 focus-within:ring-yellow-400">
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => setIsOpen(true)}
          onKeyDown={(e) => e.key === 'Enter' && handleSearch(query)}
          placeholder="Search products..."
          className="flex-1 px-4 py-2 outline-none rounded-l-lg"
        />
        {query && (
          <button onClick={() => setQuery('')} className="p-2">
            <X className="w-4 h-4 text-gray-400" />
          </button>
        )}
        <button
          onClick={() => handleSearch(query)}
          className="px-4 py-2 bg-yellow-400 hover:bg-yellow-500 rounded-r-lg"
        >
          <Search className="w-5 h-5" />
        </button>
      </div>

      {/* Dropdown */}
      {isOpen && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-white border rounded-lg shadow-lg z-50">
          {debouncedQuery.length >= 2 && suggestions ? (
            <SuggestionsList
              suggestions={suggestions}
              query={debouncedQuery}
              onSelect={handleSearch}
            />
          ) : (
            <>
              {/* Recent Searches */}
              {recentSearches?.length > 0 && (
                <div className="p-2 border-b">
                  <h4 className="text-xs font-medium text-gray-500 mb-2">Recent</h4>
                  {recentSearches.map((search) => (
                    <button
                      key={search}
                      onClick={() => handleSearch(search)}
                      className="flex items-center gap-2 w-full px-2 py-1.5 hover:bg-gray-50 rounded"
                    >
                      <Clock className="w-4 h-4 text-gray-400" />
                      <span>{search}</span>
                    </button>
                  ))}
                </div>
              )}

              {/* Trending */}
              {trendingSearches?.length > 0 && (
                <div className="p-2">
                  <h4 className="text-xs font-medium text-gray-500 mb-2">Trending</h4>
                  {trendingSearches.map((search) => (
                    <button
                      key={search}
                      onClick={() => handleSearch(search)}
                      className="flex items-center gap-2 w-full px-2 py-1.5 hover:bg-gray-50 rounded"
                    >
                      <TrendingUp className="w-4 h-4 text-orange-500" />
                      <span>{search}</span>
                    </button>
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      )}
    </div>
  );
}
```

---

## 9. Filter Sidebar Component

```tsx
// components/FilterSidebar.tsx
import { useState } from 'react';
import { ChevronDown, ChevronUp, X } from 'lucide-react';

interface FilterSidebarProps {
  facets: Facet[];
  filters: ProductFilters;
  onChange: (filters: ProductFilters) => void;
  onClose?: () => void;
}

export function FilterSidebar({ facets, filters, onChange, onClose }: FilterSidebarProps) {
  const activeFilterCount = Object.values(filters).filter(
    (v) => v !== undefined && (Array.isArray(v) ? v.length > 0 : true)
  ).length;

  const clearAllFilters = () => {
    onChange({});
  };

  return (
    <aside className="w-64 bg-white border-r h-full overflow-y-auto">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b sticky top-0 bg-white">
        <h2 className="font-semibold">Filters</h2>
        <div className="flex items-center gap-2">
          {activeFilterCount > 0 && (
            <button
              onClick={clearAllFilters}
              className="text-sm text-blue-600 hover:underline"
            >
              Clear all
            </button>
          )}
          {onClose && (
            <button onClick={onClose} className="lg:hidden p-1">
              <X className="w-5 h-5" />
            </button>
          )}
        </div>
      </div>

      {/* Price Range */}
      <FilterSection title="Price" defaultOpen>
        <PriceRangeFilter
          min={filters.priceMin}
          max={filters.priceMax}
          onChange={(min, max) => onChange({ ...filters, priceMin: min, priceMax: max })}
        />
      </FilterSection>

      {/* Rating */}
      <FilterSection title="Rating" defaultOpen>
        <RatingFilter
          value={filters.rating}
          onChange={(rating) => onChange({ ...filters, rating })}
        />
      </FilterSection>

      {/* Dynamic Facets */}
      {facets.map((facet) => (
        <FilterSection key={facet.field} title={facet.label}>
          <FacetFilter
            facet={facet}
            selected={filters[facet.field as keyof ProductFilters] as string[] | undefined}
            onChange={(values) =>
              onChange({ ...filters, [facet.field]: values.length > 0 ? values : undefined })
            }
          />
        </FilterSection>
      ))}

      {/* In Stock Only */}
      <div className="p-4 border-b">
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={filters.inStock ?? false}
            onChange={(e) => onChange({ ...filters, inStock: e.target.checked || undefined })}
            className="rounded"
          />
          <span className="text-sm">In Stock Only</span>
        </label>
      </div>
    </aside>
  );
}

// Collapsible filter section
function FilterSection({
  title,
  defaultOpen = false,
  children,
}: {
  title: string;
  defaultOpen?: boolean;
  children: React.ReactNode;
}) {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <div className="border-b">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center justify-between w-full p-4 text-left hover:bg-gray-50"
      >
        <span className="font-medium">{title}</span>
        {isOpen ? (
          <ChevronUp className="w-4 h-4" />
        ) : (
          <ChevronDown className="w-4 h-4" />
        )}
      </button>
      {isOpen && <div className="px-4 pb-4">{children}</div>}
    </div>
  );
}
```

---

## 10. Price Range Filter

```tsx
// components/filters/PriceRangeFilter.tsx
import { useState, useEffect } from 'react';
import { useDebounce } from '@/hooks/useDebounce';

interface PriceRangeFilterProps {
  min?: number;
  max?: number;
  onChange: (min?: number, max?: number) => void;
  minLimit?: number;
  maxLimit?: number;
}

export function PriceRangeFilter({
  min,
  max,
  onChange,
  minLimit = 0,
  maxLimit = 10000,
}: PriceRangeFilterProps) {
  const [localMin, setLocalMin] = useState(min ?? minLimit);
  const [localMax, setLocalMax] = useState(max ?? maxLimit);

  const debouncedMin = useDebounce(localMin, 300);
  const debouncedMax = useDebounce(localMax, 300);

  useEffect(() => {
    const newMin = debouncedMin === minLimit ? undefined : debouncedMin;
    const newMax = debouncedMax === maxLimit ? undefined : debouncedMax;
    onChange(newMin, newMax);
  }, [debouncedMin, debouncedMax]);

  // Preset price ranges
  const presets = [
    { label: 'Under $25', min: 0, max: 25 },
    { label: '$25 - $50', min: 25, max: 50 },
    { label: '$50 - $100', min: 50, max: 100 },
    { label: '$100 - $200', min: 100, max: 200 },
    { label: 'Over $200', min: 200, max: maxLimit },
  ];

  return (
    <div className="space-y-4">
      {/* Dual Range Slider */}
      <div className="relative h-2">
        <div className="absolute inset-0 bg-gray-200 rounded" />
        <div
          className="absolute h-full bg-yellow-400 rounded"
          style={{
            left: `${((localMin - minLimit) / (maxLimit - minLimit)) * 100}%`,
            right: `${100 - ((localMax - minLimit) / (maxLimit - minLimit)) * 100}%`,
          }}
        />
        <input
          type="range"
          min={minLimit}
          max={maxLimit}
          value={localMin}
          onChange={(e) => setLocalMin(Math.min(Number(e.target.value), localMax - 10))}
          className="absolute inset-0 w-full appearance-none bg-transparent pointer-events-none [&::-webkit-slider-thumb]:pointer-events-auto [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-yellow-400 [&::-webkit-slider-thumb]:appearance-none"
        />
        <input
          type="range"
          min={minLimit}
          max={maxLimit}
          value={localMax}
          onChange={(e) => setLocalMax(Math.max(Number(e.target.value), localMin + 10))}
          className="absolute inset-0 w-full appearance-none bg-transparent pointer-events-none [&::-webkit-slider-thumb]:pointer-events-auto [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-yellow-400 [&::-webkit-slider-thumb]:appearance-none"
        />
      </div>

      {/* Input Fields */}
      <div className="flex items-center gap-2">
        <div className="flex-1">
          <label className="text-xs text-gray-500">Min</label>
          <input
            type="number"
            value={localMin}
            onChange={(e) => setLocalMin(Number(e.target.value))}
            className="w-full px-2 py-1 border rounded text-sm"
          />
        </div>
        <span className="text-gray-400 mt-4">-</span>
        <div className="flex-1">
          <label className="text-xs text-gray-500">Max</label>
          <input
            type="number"
            value={localMax}
            onChange={(e) => setLocalMax(Number(e.target.value))}
            className="w-full px-2 py-1 border rounded text-sm"
          />
        </div>
      </div>

      {/* Presets */}
      <div className="space-y-1">
        {presets.map((preset) => (
          <button
            key={preset.label}
            onClick={() => {
              setLocalMin(preset.min);
              setLocalMax(preset.max);
            }}
            className={cn(
              'block w-full text-left text-sm px-2 py-1 rounded hover:bg-gray-100',
              localMin === preset.min && localMax === preset.max && 'bg-yellow-50 text-yellow-700'
            )}
          >
            {preset.label}
          </button>
        ))}
      </div>
    </div>
  );
}
```

---

## 11. Rating Filter

```tsx
// components/filters/RatingFilter.tsx
import { Star } from 'lucide-react';

interface RatingFilterProps {
  value?: number;
  onChange: (rating?: number) => void;
}

export function RatingFilter({ value, onChange }: RatingFilterProps) {
  const ratings = [4, 3, 2, 1];

  return (
    <div className="space-y-2">
      {ratings.map((rating) => (
        <button
          key={rating}
          onClick={() => onChange(value === rating ? undefined : rating)}
          className={cn(
            'flex items-center gap-2 w-full px-2 py-1.5 rounded text-sm hover:bg-gray-100',
            value === rating && 'bg-yellow-50'
          )}
        >
          <div className="flex">
            {[1, 2, 3, 4, 5].map((star) => (
              <Star
                key={star}
                className={cn(
                  'w-4 h-4',
                  star <= rating
                    ? 'fill-yellow-400 text-yellow-400'
                    : 'text-gray-300'
                )}
              />
            ))}
          </div>
          <span className="text-gray-600">& Up</span>
        </button>
      ))}
    </div>
  );
}
```

---

## 12. Facet Filter (Dynamic)

```tsx
// components/filters/FacetFilter.tsx
import { useState } from 'react';
import { Search } from 'lucide-react';

interface FacetFilterProps {
  facet: Facet;
  selected?: string[];
  onChange: (values: string[]) => void;
}

export function FacetFilter({ facet, selected = [], onChange }: FacetFilterProps) {
  const [search, setSearch] = useState('');
  const [showAll, setShowAll] = useState(false);

  const filteredValues = facet.values.filter((v) =>
    v.value.toLowerCase().includes(search.toLowerCase())
  );

  const displayValues = showAll ? filteredValues : filteredValues.slice(0, 5);
  const hasMore = filteredValues.length > 5;

  const toggleValue = (value: string) => {
    if (selected.includes(value)) {
      onChange(selected.filter((v) => v !== value));
    } else {
      onChange([...selected, value]);
    }
  };

  return (
    <div className="space-y-2">
      {/* Search within facet */}
      {facet.values.length > 10 && (
        <div className="relative">
          <Search className="absolute left-2 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={`Search ${facet.label}...`}
            className="w-full pl-8 pr-2 py-1.5 text-sm border rounded"
          />
        </div>
      )}

      {/* Values */}
      <div className="space-y-1">
        {displayValues.map((item) => (
          <label
            key={item.value}
            className="flex items-center gap-2 cursor-pointer hover:bg-gray-50 px-1 py-0.5 rounded"
          >
            <input
              type="checkbox"
              checked={selected.includes(item.value)}
              onChange={() => toggleValue(item.value)}
              className="rounded text-yellow-500"
            />
            <span className="text-sm flex-1 truncate">{item.value}</span>
            <span className="text-xs text-gray-400">({item.count})</span>
          </label>
        ))}
      </div>

      {/* Show more/less */}
      {hasMore && (
        <button
          onClick={() => setShowAll(!showAll)}
          className="text-sm text-blue-600 hover:underline"
        >
          {showAll ? 'Show less' : `Show all ${filteredValues.length}`}
        </button>
      )}
    </div>
  );
}
```

---

## 13. Product Detail Page

```tsx
// pages/product/[slug].tsx
import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';

export default function ProductDetailPage({ slug }: { slug: string }) {
  const { data: product, isLoading } = useQuery({
    queryKey: ['product', slug],
    queryFn: () => fetch(`/api/products/${slug}`).then((r) => r.json()),
  });

  const [selectedVariant, setSelectedVariant] = useState<string | null>(null);
  const [quantity, setQuantity] = useState(1);

  if (isLoading) return <ProductDetailSkeleton />;
  if (!product) return <NotFound />;

  const currentVariant = product.variants.find((v) => v.id === selectedVariant);
  const currentPrice = currentVariant?.price ?? product.price;
  const currentInventory = currentVariant?.inventory ?? product.inventory;

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Image Gallery */}
        <ProductImageGallery
          images={product.images}
          selectedVariantImage={currentVariant?.image}
        />

        {/* Product Info */}
        <div className="space-y-6">
          <div>
            <p className="text-sm text-blue-600 hover:underline">{product.brand.name}</p>
            <h1 className="text-2xl font-bold text-gray-900 mt-1">{product.title}</h1>

            {/* Rating */}
            <div className="flex items-center gap-2 mt-2">
              <StarRating rating={product.rating.average} />
              <a href="#reviews" className="text-sm text-blue-600 hover:underline">
                {product.reviewCount.toLocaleString()} reviews
              </a>
            </div>
          </div>

          {/* Price */}
          <div className="border-t border-b py-4">
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-bold">
                {formatPrice(currentPrice.amount, currentPrice.currency)}
              </span>
              {currentPrice.compareAt && (
                <>
                  <span className="text-lg text-gray-500 line-through">
                    {formatPrice(currentPrice.compareAt, currentPrice.currency)}
                  </span>
                  <span className="text-red-600 font-medium">
                    Save {Math.round((1 - currentPrice.amount / currentPrice.compareAt) * 100)}%
                  </span>
                </>
              )}
            </div>
          </div>

          {/* Variants */}
          {product.variants.length > 0 && (
            <VariantSelector
              variants={product.variants}
              selected={selectedVariant}
              onSelect={setSelectedVariant}
            />
          )}

          {/* Add to Cart */}
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <QuantitySelector
                value={quantity}
                onChange={setQuantity}
                max={currentInventory.quantity}
              />
              <span className={currentInventory.inStock ? 'text-green-600' : 'text-red-600'}>
                {currentInventory.inStock
                  ? currentInventory.quantity < 10
                    ? `Only ${currentInventory.quantity} left`
                    : 'In Stock'
                  : 'Out of Stock'}
              </span>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => addToCart(product, quantity, selectedVariant)}
                disabled={!currentInventory.inStock}
                className="flex-1 py-3 bg-yellow-400 hover:bg-yellow-500 font-medium rounded-lg disabled:bg-gray-200"
              >
                Add to Cart
              </button>
              <button
                onClick={() => buyNow(product, quantity, selectedVariant)}
                disabled={!currentInventory.inStock}
                className="flex-1 py-3 bg-orange-500 hover:bg-orange-600 text-white font-medium rounded-lg disabled:bg-gray-200"
              >
                Buy Now
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
```

---

## 14. Product Image Gallery

```tsx
// components/ProductImageGallery.tsx
import { useState, useRef } from 'react';
import { ChevronLeft, ChevronRight, ZoomIn } from 'lucide-react';

interface ProductImageGalleryProps {
  images: ProductImage[];
  selectedVariantImage?: ProductImage;
}

export function ProductImageGallery({ images, selectedVariantImage }: ProductImageGalleryProps) {
  const allImages = selectedVariantImage
    ? [selectedVariantImage, ...images.filter((i) => i.id !== selectedVariantImage.id)]
    : images;

  const [activeIndex, setActiveIndex] = useState(0);
  const [isZoomed, setIsZoomed] = useState(false);
  const [zoomPosition, setZoomPosition] = useState({ x: 0, y: 0 });
  const imageRef = useRef<HTMLDivElement>(null);

  const activeImage = allImages[activeIndex];

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!imageRef.current || !isZoomed) return;

    const rect = imageRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setZoomPosition({ x, y });
  };

  const goToPrev = () => setActiveIndex((i) => (i > 0 ? i - 1 : allImages.length - 1));
  const goToNext = () => setActiveIndex((i) => (i < allImages.length - 1 ? i + 1 : 0));

  return (
    <div className="space-y-4">
      {/* Main Image */}
      <div
        ref={imageRef}
        className="relative aspect-square bg-white rounded-lg overflow-hidden cursor-zoom-in"
        onMouseEnter={() => setIsZoomed(true)}
        onMouseLeave={() => setIsZoomed(false)}
        onMouseMove={handleMouseMove}
      >
        <img
          src={activeImage.url}
          alt={activeImage.alt}
          className={cn(
            'w-full h-full object-contain transition-transform duration-200',
            isZoomed && 'scale-150'
          )}
          style={
            isZoomed
              ? { transformOrigin: `${zoomPosition.x}% ${zoomPosition.y}%` }
              : undefined
          }
        />

        {/* Navigation arrows */}
        {allImages.length > 1 && (
          <>
            <button
              onClick={goToPrev}
              className="absolute left-2 top-1/2 -translate-y-1/2 p-2 bg-white/80 rounded-full shadow hover:bg-white"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={goToNext}
              className="absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-white/80 rounded-full shadow hover:bg-white"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </>
        )}

        {/* Zoom indicator */}
        <div className="absolute bottom-2 right-2 flex items-center gap-1 px-2 py-1 bg-black/50 text-white text-xs rounded">
          <ZoomIn className="w-3 h-3" />
          Hover to zoom
        </div>
      </div>

      {/* Thumbnails */}
      <div className="flex gap-2 overflow-x-auto pb-2">
        {allImages.map((image, index) => (
          <button
            key={image.id}
            onClick={() => setActiveIndex(index)}
            className={cn(
              'flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden border-2',
              index === activeIndex ? 'border-yellow-400' : 'border-transparent hover:border-gray-300'
            )}
          >
            <img
              src={image.url}
              alt={image.alt}
              className="w-full h-full object-cover"
            />
          </button>
        ))}
      </div>
    </div>
  );
}
```

---

## 15. Variant Selector

```tsx
// components/VariantSelector.tsx
import { useMemo } from 'react';

interface VariantSelectorProps {
  variants: ProductVariant[];
  selected: string | null;
  onSelect: (variantId: string) => void;
}

export function VariantSelector({ variants, selected, onSelect }: VariantSelectorProps) {
  // Group options by type (e.g., Color, Size)
  const optionGroups = useMemo(() => {
    const groups = new Map<string, Set<string>>();

    variants.forEach((variant) => {
      variant.options.forEach((opt) => {
        if (!groups.has(opt.name)) {
          groups.set(opt.name, new Set());
        }
        groups.get(opt.name)!.add(opt.value);
      });
    });

    return Array.from(groups.entries()).map(([name, values]) => ({
      name,
      values: Array.from(values),
    }));
  }, [variants]);

  // Get selected options
  const selectedVariant = variants.find((v) => v.id === selected);
  const selectedOptions = new Map(
    selectedVariant?.options.map((o) => [o.name, o.value]) ?? []
  );

  // Check if option combination is available
  const isOptionAvailable = (optionName: string, value: string): boolean => {
    return variants.some(
      (v) =>
        v.inventory.inStock &&
        v.options.some((o) => o.name === optionName && o.value === value) &&
        Array.from(selectedOptions.entries())
          .filter(([name]) => name !== optionName)
          .every(([name, val]) => v.options.some((o) => o.name === name && o.value === val))
    );
  };

  // Select option and find matching variant
  const selectOption = (optionName: string, value: string) => {
    const newOptions = new Map(selectedOptions);
    newOptions.set(optionName, value);

    const matchingVariant = variants.find((v) =>
      Array.from(newOptions.entries()).every(([name, val]) =>
        v.options.some((o) => o.name === name && o.value === val)
      )
    );

    if (matchingVariant) {
      onSelect(matchingVariant.id);
    }
  };

  return (
    <div className="space-y-4">
      {optionGroups.map((group) => (
        <div key={group.name}>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            {group.name}: <span className="font-normal">{selectedOptions.get(group.name)}</span>
          </label>

          <div className="flex flex-wrap gap-2">
            {group.values.map((value) => {
              const isSelected = selectedOptions.get(group.name) === value;
              const isAvailable = isOptionAvailable(group.name, value);
              const isColor = group.name.toLowerCase() === 'color';

              if (isColor) {
                return (
                  <button
                    key={value}
                    onClick={() => selectOption(group.name, value)}
                    disabled={!isAvailable}
                    className={cn(
                      'w-10 h-10 rounded-full border-2 relative',
                      isSelected ? 'border-yellow-400' : 'border-transparent',
                      !isAvailable && 'opacity-50 cursor-not-allowed'
                    )}
                    style={{ backgroundColor: value.toLowerCase() }}
                    title={value}
                  >
                    {!isAvailable && (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-full h-0.5 bg-gray-400 rotate-45" />
                      </div>
                    )}
                  </button>
                );
              }

              return (
                <button
                  key={value}
                  onClick={() => selectOption(group.name, value)}
                  disabled={!isAvailable}
                  className={cn(
                    'px-4 py-2 border rounded-lg text-sm',
                    isSelected
                      ? 'border-yellow-400 bg-yellow-50'
                      : 'border-gray-300 hover:border-gray-400',
                    !isAvailable && 'opacity-50 line-through cursor-not-allowed'
                  )}
                >
                  {value}
                </button>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}
```

---

## 16. Cart Drawer

```tsx
// components/CartDrawer.tsx
import { useEffect } from 'react';
import { X, Minus, Plus, Trash2, ShoppingBag } from 'lucide-react';
import { useCartStore } from '@/stores/cartStore';

export function CartDrawer() {
  const { cart, isOpen, closeCart, updateQuantity, removeItem } = useCartStore();

  // Close on escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeCart();
    };
    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [closeCart]);

  // Prevent body scroll when open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 z-40"
        onClick={closeCart}
      />

      {/* Drawer */}
      <div className="fixed right-0 top-0 h-full w-full max-w-md bg-white shadow-xl z-50 flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b">
          <h2 className="text-lg font-semibold flex items-center gap-2">
            <ShoppingBag className="w-5 h-5" />
            Cart ({cart?.itemCount ?? 0})
          </h2>
          <button onClick={closeCart} className="p-2 hover:bg-gray-100 rounded-full">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Items */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {!cart?.items.length ? (
            <div className="text-center py-12 text-gray-500">
              Your cart is empty
            </div>
          ) : (
            cart.items.map((item) => (
              <CartItem
                key={item.id}
                item={item}
                onUpdateQuantity={(qty) => updateQuantity(item.id, qty)}
                onRemove={() => removeItem(item.id)}
              />
            ))
          )}
        </div>

        {/* Footer */}
        {cart?.items.length > 0 && (
          <div className="border-t p-4 space-y-4">
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Subtotal</span>
                <span>{formatPrice(cart.subtotal, cart.currency)}</span>
              </div>
              {cart.discount > 0 && (
                <div className="flex justify-between text-sm text-green-600">
                  <span>Discount</span>
                  <span>-{formatPrice(cart.discount, cart.currency)}</span>
                </div>
              )}
              <div className="flex justify-between font-semibold text-lg border-t pt-2">
                <span>Total</span>
                <span>{formatPrice(cart.total, cart.currency)}</span>
              </div>
            </div>

            <button
              onClick={() => router.push('/checkout')}
              className="w-full py-3 bg-yellow-400 hover:bg-yellow-500 font-medium rounded-lg"
            >
              Proceed to Checkout
            </button>
          </div>
        )}
      </div>
    </>
  );
}
```

---

## 17. Cart Item Component

```tsx
// components/CartItem.tsx
import { Minus, Plus, Trash2 } from 'lucide-react';

interface CartItemProps {
  item: CartItem;
  onUpdateQuantity: (quantity: number) => void;
  onRemove: () => void;
}

export function CartItem({ item, onUpdateQuantity, onRemove }: CartItemProps) {
  return (
    <div className="flex gap-4 p-3 bg-gray-50 rounded-lg">
      {/* Image */}
      <img
        src={item.image}
        alt={item.title}
        className="w-20 h-20 object-cover rounded"
      />

      {/* Details */}
      <div className="flex-1 min-w-0">
        <h4 className="font-medium text-sm line-clamp-2">{item.title}</h4>

        {/* Variant */}
        {item.variant && (
          <p className="text-xs text-gray-500 mt-1">
            {item.variant.map((v) => v.value).join(' / ')}
          </p>
        )}

        {/* Price */}
        <p className="font-semibold mt-1">
          {formatPrice(item.price * item.quantity, 'USD')}
        </p>

        {/* Quantity Controls */}
        <div className="flex items-center gap-3 mt-2">
          <div className="flex items-center border rounded">
            <button
              onClick={() => onUpdateQuantity(Math.max(1, item.quantity - 1))}
              disabled={item.quantity <= 1}
              className="p-1 hover:bg-gray-100 disabled:opacity-50"
            >
              <Minus className="w-4 h-4" />
            </button>
            <span className="px-3 text-sm font-medium">{item.quantity}</span>
            <button
              onClick={() => onUpdateQuantity(Math.min(item.maxQuantity, item.quantity + 1))}
              disabled={item.quantity >= item.maxQuantity}
              className="p-1 hover:bg-gray-100 disabled:opacity-50"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>

          <button
            onClick={onRemove}
            className="p-1 text-red-500 hover:bg-red-50 rounded"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
```

---

## 18. Multi-Step Checkout

```tsx
// pages/checkout/index.tsx
import { useState } from 'react';
import { Check } from 'lucide-react';

type CheckoutStep = 'shipping' | 'payment' | 'review';

const STEPS: { key: CheckoutStep; label: string }[] = [
  { key: 'shipping', label: 'Shipping' },
  { key: 'payment', label: 'Payment' },
  { key: 'review', label: 'Review' },
];

export default function CheckoutPage() {
  const [currentStep, setCurrentStep] = useState<CheckoutStep>('shipping');
  const [completedSteps, setCompletedSteps] = useState<Set<CheckoutStep>>(new Set());

  const [shippingData, setShippingData] = useState<ShippingData | null>(null);
  const [paymentData, setPaymentData] = useState<PaymentData | null>(null);

  const currentStepIndex = STEPS.findIndex((s) => s.key === currentStep);

  const goToStep = (step: CheckoutStep) => {
    const stepIndex = STEPS.findIndex((s) => s.key === step);
    // Can only go to completed steps or the next uncompleted one
    if (stepIndex <= currentStepIndex || completedSteps.has(STEPS[stepIndex - 1]?.key)) {
      setCurrentStep(step);
    }
  };

  const completeStep = (step: CheckoutStep, data: any) => {
    if (step === 'shipping') setShippingData(data);
    if (step === 'payment') setPaymentData(data);

    setCompletedSteps((prev) => new Set([...prev, step]));

    const nextStep = STEPS[currentStepIndex + 1];
    if (nextStep) {
      setCurrentStep(nextStep.key);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {/* Progress Steps */}
      <nav className="mb-8">
        <ol className="flex items-center">
          {STEPS.map((step, index) => (
            <li key={step.key} className="flex items-center">
              <button
                onClick={() => goToStep(step.key)}
                className={cn(
                  'flex items-center gap-2',
                  currentStep === step.key && 'text-yellow-600',
                  completedSteps.has(step.key) && 'text-green-600'
                )}
              >
                <span
                  className={cn(
                    'w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium border-2',
                    currentStep === step.key && 'border-yellow-500 bg-yellow-50',
                    completedSteps.has(step.key) && 'border-green-500 bg-green-500 text-white'
                  )}
                >
                  {completedSteps.has(step.key) ? <Check className="w-4 h-4" /> : index + 1}
                </span>
                <span className="font-medium">{step.label}</span>
              </button>

              {index < STEPS.length - 1 && (
                <div className={cn(
                  'w-24 h-0.5 mx-4',
                  completedSteps.has(step.key) ? 'bg-green-500' : 'bg-gray-200'
                )} />
              )}
            </li>
          ))}
        </ol>
      </nav>

      {/* Step Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          {currentStep === 'shipping' && (
            <ShippingForm
              initialData={shippingData}
              onSubmit={(data) => completeStep('shipping', data)}
            />
          )}
          {currentStep === 'payment' && (
            <PaymentForm
              initialData={paymentData}
              onSubmit={(data) => completeStep('payment', data)}
              onBack={() => setCurrentStep('shipping')}
            />
          )}
          {currentStep === 'review' && (
            <OrderReview
              shipping={shippingData!}
              payment={paymentData!}
              onEdit={(step) => setCurrentStep(step)}
              onSubmit={handlePlaceOrder}
            />
          )}
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-1">
          <OrderSummary />
        </div>
      </div>
    </div>
  );
}
```

---

## 19. Review & Rating System

```tsx
// components/ProductReviews.tsx
import { useState } from 'react';
import { useInfiniteQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Star, ThumbsUp, ThumbsDown, Image as ImageIcon } from 'lucide-react';

interface ProductReviewsProps {
  productId: string;
  rating: Rating;
}

export function ProductReviews({ productId, rating }: ProductReviewsProps) {
  const [sortBy, setSortBy] = useState<'recent' | 'helpful' | 'rating_high' | 'rating_low'>('helpful');
  const [filterRating, setFilterRating] = useState<number | null>(null);

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage } = useInfiniteQuery({
    queryKey: ['reviews', productId, sortBy, filterRating],
    queryFn: ({ pageParam = 1 }) =>
      fetch(`/api/products/${productId}/reviews?page=${pageParam}&sort=${sortBy}${filterRating ? `&rating=${filterRating}` : ''}`).then((r) => r.json()),
    getNextPageParam: (lastPage) => lastPage.hasMore ? lastPage.page + 1 : undefined,
  });

  const reviews = data?.pages.flatMap((p) => p.reviews) ?? [];

  return (
    <div id="reviews" className="space-y-6">
      <h2 className="text-xl font-bold">Customer Reviews</h2>

      {/* Summary */}
      <div className="flex gap-8 p-6 bg-gray-50 rounded-lg">
        {/* Overall Rating */}
        <div className="text-center">
          <div className="text-5xl font-bold">{rating.average.toFixed(1)}</div>
          <StarRating rating={rating.average} size="lg" />
          <p className="text-sm text-gray-500 mt-1">{rating.count.toLocaleString()} reviews</p>
        </div>

        {/* Rating Distribution */}
        <div className="flex-1 space-y-1">
          {[5, 4, 3, 2, 1].map((stars) => {
            const count = rating.distribution[stars] ?? 0;
            const percentage = (count / rating.count) * 100;

            return (
              <button
                key={stars}
                onClick={() => setFilterRating(filterRating === stars ? null : stars)}
                className={cn(
                  'flex items-center gap-2 w-full hover:bg-gray-100 px-2 py-1 rounded',
                  filterRating === stars && 'bg-yellow-50'
                )}
              >
                <span className="text-sm w-8">{stars} star</span>
                <div className="flex-1 h-2 bg-gray-200 rounded overflow-hidden">
                  <div
                    className="h-full bg-yellow-400"
                    style={{ width: `${percentage}%` }}
                  />
                </div>
                <span className="text-sm text-gray-500 w-10">{Math.round(percentage)}%</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Sort & Filter */}
      <div className="flex items-center justify-between">
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value as any)}
          className="border rounded-lg px-3 py-2"
        >
          <option value="helpful">Most Helpful</option>
          <option value="recent">Most Recent</option>
          <option value="rating_high">Highest Rated</option>
          <option value="rating_low">Lowest Rated</option>
        </select>

        {filterRating && (
          <button
            onClick={() => setFilterRating(null)}
            className="text-sm text-blue-600 hover:underline"
          >
            Clear filter
          </button>
        )}
      </div>

      {/* Reviews List */}
      <div className="space-y-6">
        {reviews.map((review) => (
          <ReviewCard key={review.id} review={review} productId={productId} />
        ))}
      </div>

      {/* Load More */}
      {hasNextPage && (
        <button
          onClick={() => fetchNextPage()}
          disabled={isFetchingNextPage}
          className="w-full py-2 border rounded-lg hover:bg-gray-50"
        >
          {isFetchingNextPage ? 'Loading...' : 'Load More Reviews'}
        </button>
      )}
    </div>
  );
}
```

---

## 20. Review Card Component

```tsx
// components/ReviewCard.tsx
interface Review {
  id: string;
  author: { name: string; avatar?: string; verified: boolean };
  rating: number;
  title: string;
  content: string;
  images?: string[];
  createdAt: string;
  helpfulCount: number;
  unhelpfulCount: number;
  userVote?: 'helpful' | 'unhelpful';
}

function ReviewCard({ review, productId }: { review: Review; productId: string }) {
  const queryClient = useQueryClient();

  const voteMutation = useMutation({
    mutationFn: (vote: 'helpful' | 'unhelpful') =>
      fetch(`/api/reviews/${review.id}/vote`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ vote }),
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['reviews', productId] });
    },
  });

  return (
    <div className="border-b pb-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        {review.author.avatar ? (
          <img src={review.author.avatar} className="w-10 h-10 rounded-full" alt="" />
        ) : (
          <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center">
            {review.author.name[0]}
          </div>
        )}
        <div>
          <p className="font-medium flex items-center gap-2">
            {review.author.name}
            {review.author.verified && (
              <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded">
                Verified Purchase
              </span>
            )}
          </p>
          <p className="text-sm text-gray-500">
            {new Date(review.createdAt).toLocaleDateString()}
          </p>
        </div>
      </div>

      {/* Rating & Title */}
      <div className="mt-3">
        <div className="flex items-center gap-2">
          <StarRating rating={review.rating} />
          <span className="font-semibold">{review.title}</span>
        </div>
      </div>

      {/* Content */}
      <p className="mt-2 text-gray-700 whitespace-pre-wrap">{review.content}</p>

      {/* Images */}
      {review.images && review.images.length > 0 && (
        <div className="flex gap-2 mt-3">
          {review.images.map((img, i) => (
            <button
              key={i}
              onClick={() => openImageViewer(review.images!, i)}
              className="w-20 h-20 rounded overflow-hidden"
            >
              <img src={img} className="w-full h-full object-cover" alt="" />
            </button>
          ))}
        </div>
      )}

      {/* Helpful Voting */}
      <div className="flex items-center gap-4 mt-4 text-sm">
        <span className="text-gray-500">Was this helpful?</span>
        <button
          onClick={() => voteMutation.mutate('helpful')}
          className={cn(
            'flex items-center gap-1 px-3 py-1 rounded border',
            review.userVote === 'helpful' ? 'border-green-500 text-green-600' : 'hover:bg-gray-50'
          )}
        >
          <ThumbsUp className="w-4 h-4" />
          Yes ({review.helpfulCount})
        </button>
        <button
          onClick={() => voteMutation.mutate('unhelpful')}
          className={cn(
            'flex items-center gap-1 px-3 py-1 rounded border',
            review.userVote === 'unhelpful' ? 'border-red-500 text-red-600' : 'hover:bg-gray-50'
          )}
        >
          <ThumbsDown className="w-4 h-4" />
          No ({review.unhelpfulCount})
        </button>
      </div>
    </div>
  );
}
```

---

## 21. Product Recommendations Carousel

```tsx
// components/ProductCarousel.tsx
import { useRef, useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';

interface ProductCarouselProps {
  title: string;
  type: 'similar' | 'frequently_bought' | 'recently_viewed' | 'trending';
  productId?: string;
}

export function ProductCarousel({ title, type, productId }: ProductCarouselProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  const { data: products, isLoading } = useQuery({
    queryKey: ['recommendations', type, productId],
    queryFn: () =>
      fetch(`/api/recommendations?type=${type}${productId ? `&productId=${productId}` : ''}`).then((r) => r.json()),
    staleTime: 10 * 60 * 1000, // 10 minutes
  });

  const updateScrollButtons = () => {
    if (!scrollRef.current) return;
    const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
    setCanScrollLeft(scrollLeft > 0);
    setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10);
  };

  useEffect(() => {
    updateScrollButtons();
    const el = scrollRef.current;
    el?.addEventListener('scroll', updateScrollButtons);
    return () => el?.removeEventListener('scroll', updateScrollButtons);
  }, [products]);

  const scroll = (direction: 'left' | 'right') => {
    if (!scrollRef.current) return;
    const scrollAmount = scrollRef.current.clientWidth * 0.8;
    scrollRef.current.scrollBy({
      left: direction === 'left' ? -scrollAmount : scrollAmount,
      behavior: 'smooth',
    });
  };

  if (isLoading) {
    return <ProductCarouselSkeleton title={title} />;
  }

  if (!products?.length) return null;

  return (
    <section className="relative">
      <h2 className="text-xl font-bold mb-4">{title}</h2>

      {/* Scroll Buttons */}
      {canScrollLeft && (
        <button
          onClick={() => scroll('left')}
          className="absolute left-0 top-1/2 -translate-y-1/2 z-10 w-10 h-10 bg-white shadow-lg rounded-full flex items-center justify-center hover:bg-gray-50"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>
      )}
      {canScrollRight && (
        <button
          onClick={() => scroll('right')}
          className="absolute right-0 top-1/2 -translate-y-1/2 z-10 w-10 h-10 bg-white shadow-lg rounded-full flex items-center justify-center hover:bg-gray-50"
        >
          <ChevronRight className="w-6 h-6" />
        </button>
      )}

      {/* Products */}
      <div
        ref={scrollRef}
        className="flex gap-4 overflow-x-auto scrollbar-hide scroll-smooth pb-2"
      >
        {products.map((product: Product) => (
          <div key={product.id} className="flex-shrink-0 w-48">
            <ProductCard product={product} variant="compact" />
          </div>
        ))}
      </div>
    </section>
  );
}

function ProductCarouselSkeleton({ title }: { title: string }) {
  return (
    <section>
      <h2 className="text-xl font-bold mb-4">{title}</h2>
      <div className="flex gap-4 overflow-hidden">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="flex-shrink-0 w-48 animate-pulse">
            <div className="aspect-square bg-gray-200 rounded mb-2" />
            <div className="h-4 bg-gray-200 rounded w-3/4 mb-1" />
            <div className="h-4 bg-gray-200 rounded w-1/2" />
          </div>
        ))}
      </div>
    </section>
  );
}
```

---

## 22. Wishlist Management

```tsx
// stores/wishlistStore.ts
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface WishlistState {
  items: string[]; // Product IDs
  isInWishlist: (productId: string) => boolean;
  toggleWishlist: (productId: string) => void;
  removeFromWishlist: (productId: string) => void;
  clearWishlist: () => void;
}

export const useWishlistStore = create<WishlistState>()(
  persist(
    (set, get) => ({
      items: [],

      isInWishlist: (productId) => get().items.includes(productId),

      toggleWishlist: (productId) => {
        set((state) => ({
          items: state.items.includes(productId)
            ? state.items.filter((id) => id !== productId)
            : [...state.items, productId],
        }));

        // Sync with server (fire and forget)
        fetch('/api/wishlist/toggle', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ productId }),
        });
      },

      removeFromWishlist: (productId) => {
        set((state) => ({
          items: state.items.filter((id) => id !== productId),
        }));
      },

      clearWishlist: () => set({ items: [] }),
    }),
    { name: 'wishlist-storage' }
  )
);

// components/WishlistPage.tsx
export function WishlistPage() {
  const { items, removeFromWishlist } = useWishlistStore();

  const { data: products, isLoading } = useQuery({
    queryKey: ['wishlist-products', items],
    queryFn: () =>
      fetch(`/api/products?ids=${items.join(',')}`).then((r) => r.json()),
    enabled: items.length > 0,
  });

  if (items.length === 0) {
    return (
      <div className="text-center py-16">
        <Heart className="w-16 h-16 mx-auto text-gray-300 mb-4" />
        <h2 className="text-xl font-semibold mb-2">Your wishlist is empty</h2>
        <p className="text-gray-500 mb-4">Save items you love to your wishlist</p>
        <Link href="/" className="text-blue-600 hover:underline">
          Continue Shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">My Wishlist ({items.length} items)</h1>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {products?.map((product: Product) => (
          <div key={product.id} className="relative">
            <ProductCard product={product} />
            <button
              onClick={() => removeFromWishlist(product.id)}
              className="absolute top-2 right-2 p-2 bg-white rounded-full shadow hover:bg-red-50"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
```

---

## 23. URL-Based Filter State

```tsx
// hooks/useFilterParams.ts
import { useSearchParams, useRouter } from 'next/navigation';
import { useMemo, useCallback } from 'react';

export function useFilterParams() {
  const searchParams = useSearchParams();
  const router = useRouter();

  // Parse filters from URL
  const filters: ProductFilters = useMemo(() => ({
    category: searchParams.get('category') ?? undefined,
    brand: searchParams.getAll('brand'),
    priceMin: searchParams.get('priceMin') ? Number(searchParams.get('priceMin')) : undefined,
    priceMax: searchParams.get('priceMax') ? Number(searchParams.get('priceMax')) : undefined,
    rating: searchParams.get('rating') ? Number(searchParams.get('rating')) : undefined,
    inStock: searchParams.get('inStock') === 'true',
    sort: (searchParams.get('sort') as ProductFilters['sort']) ?? undefined,
    search: searchParams.get('q') ?? undefined,
  }), [searchParams]);

  // Update URL with new filters
  const setFilters = useCallback((newFilters: ProductFilters) => {
    const params = new URLSearchParams();

    if (newFilters.category) params.set('category', newFilters.category);
    if (newFilters.brand?.length) {
      newFilters.brand.forEach((b) => params.append('brand', b));
    }
    if (newFilters.priceMin) params.set('priceMin', String(newFilters.priceMin));
    if (newFilters.priceMax) params.set('priceMax', String(newFilters.priceMax));
    if (newFilters.rating) params.set('rating', String(newFilters.rating));
    if (newFilters.inStock) params.set('inStock', 'true');
    if (newFilters.sort) params.set('sort', newFilters.sort);
    if (newFilters.search) params.set('q', newFilters.search);

    router.push(`/products?${params.toString()}`, { scroll: false });
  }, [router]);

  // Update single filter
  const updateFilter = useCallback(<K extends keyof ProductFilters>(
    key: K,
    value: ProductFilters[K]
  ) => {
    setFilters({ ...filters, [key]: value });
  }, [filters, setFilters]);

  // Clear all filters
  const clearFilters = useCallback(() => {
    router.push('/products', { scroll: false });
  }, [router]);

  return { filters, setFilters, updateFilter, clearFilters };
}

// Usage in ProductListPage
export function ProductListPage() {
  const { filters, setFilters, clearFilters } = useFilterParams();

  const { data } = useProducts(filters);

  return (
    <div className="flex">
      <FilterSidebar
        facets={data?.pages[0]?.facets ?? []}
        filters={filters}
        onChange={setFilters}
      />
      <div className="flex-1">
        {/* Active Filters */}
        <ActiveFilters filters={filters} onRemove={setFilters} onClearAll={clearFilters} />
        <ProductGrid filters={filters} viewMode="grid" />
      </div>
    </div>
  );
}
```

---

## 24. Performance Optimizations

```tsx
// Lazy load heavy components
const ProductReviews = lazy(() => import('./ProductReviews'));
const ProductQA = lazy(() => import('./ProductQA'));
const ImageZoom = lazy(() => import('./ImageZoom'));

// Image optimization component
function OptimizedImage({ src, alt, width, height, priority = false }: OptimizedImageProps) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [error, setError] = useState(false);

  // Generate srcset for responsive images
  const generateSrcSet = (baseUrl: string) => {
    const widths = [320, 480, 640, 768, 1024, 1280];
    return widths
      .map((w) => `${baseUrl}?w=${w}&q=75 ${w}w`)
      .join(', ');
  };

  if (error) {
    return (
      <div className="bg-gray-200 flex items-center justify-center" style={{ width, height }}>
        <ImageIcon className="w-8 h-8 text-gray-400" />
      </div>
    );
  }

  return (
    <div className="relative" style={{ width, height }}>
      {/* Blur placeholder */}
      {!isLoaded && (
        <div className="absolute inset-0 bg-gray-200 animate-pulse" />
      )}
      <img
        src={src}
        srcSet={generateSrcSet(src)}
        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        alt={alt}
        width={width}
        height={height}
        loading={priority ? 'eager' : 'lazy'}
        decoding="async"
        onLoad={() => setIsLoaded(true)}
        onError={() => setError(true)}
        className={cn(
          'transition-opacity duration-300',
          isLoaded ? 'opacity-100' : 'opacity-0'
        )}
      />
    </div>
  );
}

// Intersection observer for infinite scroll
function useInfiniteScroll(callback: () => void, hasMore: boolean) {
  const observer = useRef<IntersectionObserver | null>(null);

  const lastElementRef = useCallback((node: HTMLElement | null) => {
    if (observer.current) observer.current.disconnect();

    observer.current = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting && hasMore) {
        callback();
      }
    }, { threshold: 0.1, rootMargin: '100px' });

    if (node) observer.current.observe(node);
  }, [callback, hasMore]);

  return lastElementRef;
}

// Prefetch product on hover
function usePrefetchProduct() {
  const queryClient = useQueryClient();

  const prefetch = useCallback((productId: string) => {
    queryClient.prefetchQuery({
      queryKey: ['product', productId],
      queryFn: () => fetch(`/api/products/${productId}`).then((r) => r.json()),
      staleTime: 5 * 60 * 1000,
    });
  }, [queryClient]);

  return prefetch;
}
```

---

## 25. Recently Viewed Products

```tsx
// hooks/useRecentlyViewed.ts
const STORAGE_KEY = 'recently-viewed';
const MAX_ITEMS = 20;

export function useRecentlyViewed() {
  const [items, setItems] = useState<string[]>([]);

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      setItems(JSON.parse(stored));
    }
  }, []);

  const addItem = useCallback((productId: string) => {
    setItems((prev) => {
      // Remove if exists, add to front
      const filtered = prev.filter((id) => id !== productId);
      const updated = [productId, ...filtered].slice(0, MAX_ITEMS);

      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      return updated;
    });
  }, []);

  const clearHistory = useCallback(() => {
    localStorage.removeItem(STORAGE_KEY);
    setItems([]);
  }, []);

  return { items, addItem, clearHistory };
}

// Track product view
export function useTrackProductView(productId: string) {
  const { addItem } = useRecentlyViewed();

  useEffect(() => {
    addItem(productId);

    // Also send to analytics
    trackEvent('product_view', { productId });
  }, [productId, addItem]);
}

// Display recently viewed
export function RecentlyViewedSection() {
  const { items } = useRecentlyViewed();

  if (items.length === 0) return null;

  return (
    <ProductCarousel
      title="Recently Viewed"
      type="recently_viewed"
      productIds={items}
    />
  );
}
```

---

## 26. Accessibility Considerations

```tsx
// Accessible star rating input
function StarRatingInput({ value, onChange, label }: StarRatingInputProps) {
  const [hovered, setHovered] = useState<number | null>(null);

  return (
    <fieldset>
      <legend className="sr-only">{label}</legend>
      <div
        className="flex gap-1"
        role="radiogroup"
        aria-label={label}
        onMouseLeave={() => setHovered(null)}
      >
        {[1, 2, 3, 4, 5].map((star) => (
          <label
            key={star}
            onMouseEnter={() => setHovered(star)}
            className="cursor-pointer"
          >
            <input
              type="radio"
              name="rating"
              value={star}
              checked={value === star}
              onChange={() => onChange(star)}
              className="sr-only"
              aria-label={`${star} star${star > 1 ? 's' : ''}`}
            />
            <Star
              className={cn(
                'w-6 h-6 transition-colors',
                (hovered ?? value) >= star
                  ? 'fill-yellow-400 text-yellow-400'
                  : 'text-gray-300'
              )}
            />
          </label>
        ))}
      </div>
    </fieldset>
  );
}

// Focus trap for modals
function useFocusTrap(isOpen: boolean) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isOpen || !containerRef.current) return;

    const container = containerRef.current;
    const focusableElements = container.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    const firstEl = focusableElements[0] as HTMLElement;
    const lastEl = focusableElements[focusableElements.length - 1] as HTMLElement;

    // Focus first element
    firstEl?.focus();

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key !== 'Tab') return;

      if (e.shiftKey && document.activeElement === firstEl) {
        e.preventDefault();
        lastEl?.focus();
      } else if (!e.shiftKey && document.activeElement === lastEl) {
        e.preventDefault();
        firstEl?.focus();
      }
    };

    container.addEventListener('keydown', handleKeyDown);
    return () => container.removeEventListener('keydown', handleKeyDown);
  }, [isOpen]);

  return containerRef;
}

// Skip to main content link
function SkipLink() {
  return (
    <a
      href="#main-content"
      className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-yellow-400 focus:text-black focus:rounded"
    >
      Skip to main content
    </a>
  );
}

// Announce dynamic content to screen readers
function useLiveRegion() {
  const announce = useCallback((message: string, priority: 'polite' | 'assertive' = 'polite') => {
    const el = document.createElement('div');
    el.setAttribute('role', 'status');
    el.setAttribute('aria-live', priority);
    el.setAttribute('aria-atomic', 'true');
    el.className = 'sr-only';
    el.textContent = message;

    document.body.appendChild(el);
    setTimeout(() => document.body.removeChild(el), 1000);
  }, []);

  return announce;
}

// Usage: Announce cart updates
function useCartAnnouncements() {
  const announce = useLiveRegion();
  const prevCount = useRef<number>(0);
  const { cart } = useCartStore();

  useEffect(() => {
    if (!cart) return;

    if (cart.itemCount > prevCount.current) {
      announce(`Item added to cart. Cart now has ${cart.itemCount} items.`);
    } else if (cart.itemCount < prevCount.current) {
      announce(`Item removed from cart. Cart now has ${cart.itemCount} items.`);
    }

    prevCount.current = cart.itemCount;
  }, [cart?.itemCount, announce]);
}
```

