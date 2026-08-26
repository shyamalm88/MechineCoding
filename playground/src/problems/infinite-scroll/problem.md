# Infinite Scroll

## Problem Statement

Build an **Infinite Scroll** component that automatically loads more content as the user scrolls to the bottom of the page. This is a core UX pattern used in social media feeds, product listings, and content-heavy applications.

This pattern is essential for:
- Social media feeds (Twitter, Facebook, Instagram)
- E-commerce product listings
- News/blog article feeds
- Image galleries
- Chat message history

---

## Requirements

### Functional Requirements

1. **Initial Load**
   - Load first batch of items (20 posts) on mount
   - Display items in a scrollable list

2. **Scroll Detection**
   - Detect when user scrolls near the bottom
   - Use IntersectionObserver (not scroll events)
   - Trigger next page fetch automatically

3. **Pagination**
   - Track current page number
   - Fetch next page of data when triggered
   - Append new items to existing list

4. **Loading State**
   - Show loading indicator while fetching
   - Prevent duplicate fetches during loading
   - Display "Scroll down to load" when idle

5. **End of Data**
   - Detect when no more data is available
   - Hide loading indicator when done
   - Stop observing when `hasMore` is false

### Non-Functional Requirements

- Smooth scrolling experience
- No scroll jank or stuttering
- Efficient DOM updates
- Memory-efficient observer cleanup

---

## Visual Representation

```
Initial State (Loading):
+------------------------------------------+
|  +------------------------------------+  |
|  | Post #1 - this is the content      |  |
|  +------------------------------------+  |
|  +------------------------------------+  |
|  | Post #2 - this is the content      |  |
|  +------------------------------------+  |
|  +------------------------------------+  |
|  | Post #3 - this is the content      |  |
|  +------------------------------------+  |
|                   ...                    |
|  +------------------------------------+  |
|  | Post #20 - this is the content     |  |
|  +------------------------------------+  |
|                                          |
|         [ Scroll Down to load ]          |
|          ^^^^^^^^^^^^^^^^^^^^^^^^^       |
|          Sentinel element (observed)     |
+------------------------------------------+

Scrolled to Bottom (Loading More):
+------------------------------------------+
|  +------------------------------------+  |
|  | Post #18 - this is the content     |  |
|  +------------------------------------+  |
|  +------------------------------------+  |
|  | Post #19 - this is the content     |  |
|  +------------------------------------+  |
|  +------------------------------------+  |
|  | Post #20 - this is the content     |  |
|  +------------------------------------+  |
|                                          |
|              [ Loading... ]              |
|                                          |
+------------------------------------------+

After Load (New Items Appended):
+------------------------------------------+
|  +------------------------------------+  |
|  | Post #20 - this is the content     |  |
|  +------------------------------------+  |
|  +------------------------------------+  |
|  | Post #21 - this is the content     |  | <- New
|  +------------------------------------+  |
|  +------------------------------------+  |
|  | Post #22 - this is the content     |  | <- New
|  +------------------------------------+  |
|                   ...                    |
|         [ Scroll Down to load ]          |
+------------------------------------------+
```

---

## Key Concepts & Intuition

### 1. IntersectionObserver vs Scroll Events

```javascript
// BAD: Scroll events fire constantly (performance killer)
window.addEventListener('scroll', () => {
    const bottom = window.innerHeight + window.scrollY >= document.body.offsetHeight;
    if (bottom) loadMore();
});

// GOOD: IntersectionObserver only fires on visibility change
const observer = new IntersectionObserver((entries) => {
    if (entries[0].isIntersecting) {
        loadMore();
    }
}, { threshold: 1.0 });
```

**Why IntersectionObserver?**
- Browser-optimized, runs off main thread
- Only fires when visibility changes
- No need for debouncing/throttling
- Built-in threshold control

### 2. Sentinel Element Pattern

```jsx
// The "sentinel" is an empty element at the bottom
<div ref={observerTarget} style={{ height: '50px' }}>
    {isLoading ? 'Loading...' : 'Scroll down'}
</div>

// When this element becomes visible, trigger load
```

**Key insight:** We observe a sentinel element, not scroll position. When it enters the viewport, we know the user has scrolled to the bottom.

### 3. Preventing Race Conditions

```javascript
useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
        // Guard conditions prevent duplicate fetches
        if (entries[0].isIntersecting && !isLoading && hasMore) {
            setPage(prev => prev + 1);
        }
    }, { threshold: 1.0 });
    // ...
}, [isLoading, hasMore]); // Re-create observer when guards change
```

### 4. Data Fetching Pattern

```javascript
// Separate effect for data fetching
useEffect(() => {
    const loadData = async () => {
        setIsLoading(true);
        const newItems = await fetchPosts(page);
        setData(prev => [...prev, ...newItems]); // Append, don't replace
        setIsLoading(false);

        if (newItems.length === 0) setHasMore(false);
    };
    loadData();
}, [page]); // Triggers when page changes
```

### 5. Cleanup on Unmount

```javascript
useEffect(() => {
    // Setup
    observer.observe(observerTarget.current);

    // Cleanup - CRITICAL for preventing memory leaks
    return () => {
        if (observerTarget.current) {
            observer.unobserve(observerTarget.current);
        }
    };
}, [isLoading, hasMore]);
```

---

## Implementation Tips

### 1. Generating Unique IDs

```javascript
// Combine random + timestamp for uniqueness
id: Math.random() + Date.now()

// Better: Use index offset for predictable IDs
id: page * PAGE_SIZE + index + 1
```

### 2. Observer Configuration

```javascript
const observer = new IntersectionObserver(callback, {
    root: null,           // Use viewport as root
    rootMargin: '0px',    // No margin
    threshold: 1.0        // 100% visible to trigger
});

// For earlier trigger (pre-fetch):
{ rootMargin: '100px' }   // Trigger 100px before visible
{ threshold: 0.5 }        // Trigger when 50% visible
```

### 3. Conditional Rendering of Sentinel

```jsx
{hasMore && (
    <div ref={observerTarget}>
        {isLoading ? 'Loading...' : 'Scroll down'}
    </div>
)}
```

**Why conditional?** When there's no more data, we don't need the sentinel element. Removing it stops unnecessary observations.

### 4. Smooth Loading Experience

```css
.loading-indicator {
    height: 50px;           /* Fixed height prevents layout shift */
    text-align: center;
    padding: 10px;
}
```

---

## Common Interview Questions

### Q1: Why IntersectionObserver instead of scroll events?

**Answer:** IntersectionObserver is browser-optimized and runs asynchronously off the main thread. Scroll events fire on every pixel scrolled (potentially 60+ times per second), requiring manual debouncing and causing scroll jank. IntersectionObserver only fires when visibility actually changes.

### Q2: How would you implement "load more" button as fallback?

```jsx
const LoadMoreButton = ({ onClick, isLoading, hasMore }) => {
    if (!hasMore) return null;

    return (
        <button onClick={onClick} disabled={isLoading}>
            {isLoading ? 'Loading...' : 'Load More'}
        </button>
    );
};

// Useful when IntersectionObserver not supported
// or for accessibility preferences
```

### Q3: How would you handle errors during fetch?

```javascript
const [error, setError] = useState(null);

const loadData = async () => {
    try {
        setIsLoading(true);
        setError(null);
        const newItems = await fetchPosts(page);
        setData(prev => [...prev, ...newItems]);
    } catch (err) {
        setError('Failed to load. Tap to retry.');
        setPage(prev => prev - 1); // Revert page increment
    } finally {
        setIsLoading(false);
    }
};
```

### Q4: How would you implement virtual scrolling for very large lists?

**Answer:** For lists with 10,000+ items, render only visible items plus buffer. Libraries like `react-window` or `react-virtualized` handle this:

```jsx
import { FixedSizeList } from 'react-window';

<FixedSizeList
    height={600}
    itemCount={data.length}
    itemSize={80}
>
    {({ index, style }) => (
        <div style={style}>{data[index].title}</div>
    )}
</FixedSizeList>
```

### Q5: How would you add pull-to-refresh?

```javascript
const [refreshing, setRefreshing] = useState(false);

const handleRefresh = async () => {
    setRefreshing(true);
    setPage(0);
    setData([]);
    setHasMore(true);
    const freshData = await fetchPosts(0);
    setData(freshData);
    setRefreshing(false);
};
```

### Q6: How would you persist scroll position across navigation?

```javascript
// Save position before unmount
useEffect(() => {
    return () => {
        sessionStorage.setItem('scrollPos', window.scrollY);
        sessionStorage.setItem('loadedPages', page);
    };
}, [page]);

// Restore on mount
useEffect(() => {
    const savedPage = sessionStorage.getItem('loadedPages');
    if (savedPage) {
        // Load all pages up to saved position
        // Then restore scroll position
    }
}, []);
```

---

## Edge Cases to Consider

1. **Fast scrolling** - User scrolls faster than data loads
2. **Empty response** - API returns empty array (end of data)
3. **Network failure** - Handle retry logic
4. **Component unmount** - Clean up observer to prevent memory leaks
5. **Duplicate items** - Server returns overlapping data
6. **Rapid page changes** - Multiple concurrent requests
7. **Mobile touch** - Works with touch scrolling
8. **Browser back** - Preserve scroll position and loaded data

---

## Complexity Analysis

| Operation | Time | Space |
|-----------|------|-------|
| Initial render | O(n) | O(n) |
| Append items | O(m) | O(n+m) |
| Observer callback | O(1) | O(1) |
| Cleanup | O(1) | O(1) |

Where n = current items, m = new items per page

---

## Performance Optimizations

### 1. Memoize List Items

```jsx
const MemoizedItem = React.memo(({ item }) => (
    <li>{item.title}</li>
));

// Prevents re-render of existing items when new ones added
```

### 2. Use Keys Properly

```jsx
// Good: Stable, unique keys
<li key={item.id}>

// Bad: Index as key (breaks with prepending)
<li key={index}>
```

### 3. Debounce Rapid Intersections

```javascript
const debouncedSetPage = useMemo(
    () => debounce(() => setPage(p => p + 1), 200),
    []
);
```

---

## Real-World Applications

1. **Social Media Feeds** - Twitter, Instagram, LinkedIn
2. **E-commerce** - Product search results, category pages
3. **Email Clients** - Gmail, Outlook message lists
4. **Chat Applications** - Message history loading
5. **Documentation** - Long article/comment sections
6. **Image Galleries** - Pinterest-style layouts

---

## Related Patterns

- **Virtualized Lists** - Render only visible items
- **Pagination** - Traditional page-based navigation
- **Cursor-based Pagination** - API pattern for infinite scroll
- **Pull to Refresh** - Mobile refresh pattern
- **Skeleton Loading** - Placeholder while fetching
