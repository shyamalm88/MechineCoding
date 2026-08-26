# Virtual List (Windowing)

## Problem Statement

Build a **Virtualized List** component that efficiently renders large datasets (10,000+ items) by only rendering items visible in the viewport. This is a critical performance optimization for data-heavy applications.

This pattern is essential for:
- Large data tables and spreadsheets
- Chat applications (message history)
- Social media feeds
- File explorers
- Log viewers
- IDE code editors
- Dropdown menus with many options

---

## Requirements

### Functional Requirements

1. **Render Visible Items Only**
   - Calculate which items are in the viewport
   - Render only those items (plus buffer)
   - Update on scroll

2. **Dynamic Height Measurement**
   - Measure item height automatically
   - Don't hardcode item dimensions
   - Support variable heights (optional)

3. **Scroll Behavior**
   - Maintain native scroll feel
   - Show correct scrollbar size
   - Support smooth scrolling

4. **Overscan Buffer**
   - Render extra items above/below viewport
   - Prevent blank flashes during fast scroll
   - Configurable buffer size

5. **Performance**
   - Handle 20,000+ items smoothly
   - 60fps scroll performance
   - Minimal DOM nodes

### Non-Functional Requirements

- No scroll jank or stuttering
- Accurate scrollbar representation
- Memory efficient
- Quick initial render

---

## Visual Representation

```
Traditional Rendering (20,000 items):
+------------------------------------------+
|  DOM: 20,000 nodes                       |
|  +------------------------------------+  |
|  | Item 1                             |  |
|  | Item 2                             |  |
|  | Item 3                             |  |
|  | ...                                |  |
|  | Item 19,998                        |  |
|  | Item 19,999                        |  |
|  | Item 20,000                        |  |
|  +------------------------------------+  |
|  Memory: HIGH | Performance: SLOW        |
+------------------------------------------+

Virtual Rendering (20,000 items):
+------------------------------------------+
|  DOM: ~15-20 nodes                       |
|  +------------------------------------+  |
|  | Spacer (maintains scroll height)   |  |
|  |  +------------------------------+  |  |
|  |  | Translated Window            |  |  |
|  |  |  +------------------------+  |  |  |
|  |  |  | Item 45 (overscan)     |  |  |  |
|  |  |  | Item 46 (overscan)     |  |  |  |
|  |  |  | Item 47 (visible)      |  |  |  | <- Viewport
|  |  |  | Item 48 (visible)      |  |  |  |
|  |  |  | Item 49 (visible)      |  |  |  |
|  |  |  | Item 50 (overscan)     |  |  |  |
|  |  |  | Item 51 (overscan)     |  |  |  |
|  |  |  +------------------------+  |  |  |
|  |  +------------------------------+  |  |
|  +------------------------------------+  |
|  Memory: LOW | Performance: FAST         |
+------------------------------------------+

Spacer Technique:
+------------------------------------------+
| Container (overflow: auto)               |
|  +------------------------------------+  |
|  | Spacer div                         |  |
|  | height: totalItems × itemHeight    |  |
|  | (creates correct scrollbar)        |  |
|  |                                    |  |
|  |  ↓ translateY(startIndex × height) |  |
|  |  +----------------------------+    |  |
|  |  | Actual rendered items      |    |  |
|  |  | (only visible + buffer)    |    |  |
|  |  +----------------------------+    |  |
|  |                                    |  |
|  +------------------------------------+  |
+------------------------------------------+
```

---

## Key Concepts & Intuition

### 1. The Core Formula

```javascript
// How many items fit in the viewport?
const visibleCount = Math.ceil(CONTAINER_HEIGHT / itemHeight);

// Which item is at the top of the viewport?
const startIndex = Math.floor(scrollTop / itemHeight);

// Add overscan buffer
const bufferedStart = Math.max(0, startIndex - OVERSCAN);
const bufferedEnd = Math.min(totalItems, startIndex + visibleCount + OVERSCAN);
```

### 2. Spacer for Correct Scrollbar

```jsx
// Outer container: scrollable, fixed height
<div style={{ height: CONTAINER_HEIGHT, overflowY: 'auto' }}>
    {/* Spacer: full height of all items (creates scrollbar) */}
    <div style={{ height: totalItems * itemHeight, position: 'relative' }}>
        {/* Window: positioned at correct scroll offset */}
        <div style={{ transform: `translateY(${startIndex * itemHeight}px)` }}>
            {/* Only render visible items */}
            {visibleItems.map(...)}
        </div>
    </div>
</div>
```

**Why this structure?**
- Container gives us `scrollTop` and scroll events
- Spacer creates correct total height (accurate scrollbar)
- Inner div uses `translateY` to position visible items

### 3. Dynamic Height Measurement

```javascript
const [itemHeight, setItemHeight] = useState(null);
const firstItemRef = useRef(null);

// Measure first item ONCE on mount
useLayoutEffect(() => {
    if (firstItemRef.current && !itemHeight) {
        const height = firstItemRef.current.getBoundingClientRect().height;
        setItemHeight(height);
    }
}, [itemHeight]);

// Initial render: show only first item for measurement
if (!itemHeight) {
    return (
        <div style={{ height: CONTAINER_HEIGHT, overflowY: 'auto' }}>
            <div ref={firstItemRef}>{items[0]}</div>
        </div>
    );
}
```

**Why useLayoutEffect?**
- Runs synchronously after DOM mutation
- Blocks paint until complete
- Prevents flash of un-virtualized content

### 4. Scroll Handler

```javascript
const handleScroll = useCallback((e) => {
    setScrollTop(e.target.scrollTop);
}, []);

// scrollTop triggers re-calculation of visible window
```

### 5. Overscan Buffer

```javascript
const OVERSCAN = 5;  // Render 5 extra items above/below

const startIndex = Math.max(0, Math.floor(scrollTop / itemHeight) - OVERSCAN);
const endIndex = Math.min(totalItems, startIndex + visibleCount + OVERSCAN * 2);
```

**Why overscan?**
- Prevents blank areas during fast scrolling
- Items pre-rendered before they become visible
- Trade-off: more DOM nodes vs smoother experience

---

## Implementation Tips

### 1. Calculate Visible Window

```javascript
const totalItems = items.length;
const visibleCount = Math.ceil(CONTAINER_HEIGHT / itemHeight);

const startIndex = Math.max(0, Math.floor(scrollTop / itemHeight) - OVERSCAN);
const endIndex = Math.min(totalItems, startIndex + visibleCount + OVERSCAN * 2);

const visibleItems = items.slice(startIndex, endIndex);
const totalHeight = totalItems * itemHeight;
const offsetY = startIndex * itemHeight;
```

### 2. Use Transform (GPU Accelerated)

```jsx
// Good: GPU-accelerated, smooth
<div style={{ transform: `translateY(${offsetY}px)` }}>

// Bad: Causes layout recalculation
<div style={{ marginTop: offsetY }}>
<div style={{ top: offsetY, position: 'absolute' }}>
```

### 3. Key Strategy

```jsx
// Use actual index as key, not array position
{visibleItems.map((item, localIndex) => (
    <div key={startIndex + localIndex}>  {/* Real index */}
        {item}
    </div>
))}
```

### 4. Container Styles

```jsx
<div
    onScroll={handleScroll}
    style={{
        height: CONTAINER_HEIGHT,
        overflowY: 'auto',
        border: '1px solid #ccc'
    }}
>
```

---

## Common Interview Questions

### Q1: Why not just use CSS `overflow: auto` and let browser handle it?

**Answer:** The browser will still create DOM nodes for all 20,000 items. Each DOM node consumes memory (~1KB+ with styles). Virtual scrolling keeps DOM count constant (~20 nodes) regardless of data size.

### Q2: How would you handle variable height items?

```javascript
// Option 1: Measure all heights upfront (expensive)
const heights = items.map(item => measureHeight(item));

// Option 2: Measure on demand and cache
const heightCache = useRef(new Map());

const getItemHeight = (index) => {
    if (!heightCache.current.has(index)) {
        // Render offscreen, measure, cache
        heightCache.current.set(index, measuredHeight);
    }
    return heightCache.current.get(index);
};

// Option 3: Estimate + adjust (react-virtualized approach)
const estimatedHeight = 50;
const [measuredHeights, setMeasuredHeights] = useState({});

// Calculate positions using known heights + estimates
```

### Q3: How would you implement scroll-to-index?

```javascript
const scrollToIndex = (index) => {
    const targetOffset = index * itemHeight;
    containerRef.current.scrollTop = targetOffset;
};

// For variable heights:
const scrollToIndex = (index) => {
    const targetOffset = heights
        .slice(0, index)
        .reduce((sum, h) => sum + h, 0);
    containerRef.current.scrollTop = targetOffset;
};
```

### Q4: How would you implement infinite loading with virtual list?

```javascript
useEffect(() => {
    // When near bottom, load more
    const remainingItems = totalItems - (startIndex + visibleCount);
    if (remainingItems < OVERSCAN && hasMore && !isLoading) {
        loadMoreItems();
    }
}, [startIndex, visibleCount, hasMore, isLoading]);
```

### Q5: Why use translateY instead of absolute positioning?

**Answer:** `transform: translateY()` is GPU-accelerated and doesn't cause layout recalculation. Absolute positioning with `top` triggers layout calculations, which is slower for frequent updates during scrolling.

### Q6: How would you handle horizontal scrolling (virtual grid)?

```javascript
const visibleRowStart = Math.floor(scrollTop / rowHeight);
const visibleRowEnd = visibleRowStart + Math.ceil(containerHeight / rowHeight);

const visibleColStart = Math.floor(scrollLeft / colWidth);
const visibleColEnd = visibleColStart + Math.ceil(containerWidth / colWidth);

// Render only cells in visible range
for (let row = visibleRowStart; row < visibleRowEnd; row++) {
    for (let col = visibleColStart; col < visibleColEnd; col++) {
        // Render cell at (row, col)
    }
}
```

---

## Edge Cases to Consider

1. **Empty list** - Handle gracefully
2. **Single item** - Should still work
3. **Rapid scrolling** - Overscan helps, but may need throttling
4. **Window resize** - Recalculate visible count
5. **Item height change** - Remeasure or invalidate cache
6. **Dynamic data** - Items added/removed during scroll
7. **Scroll restoration** - Maintain position after data change
8. **Accessibility** - Screen readers need all content
9. **Search/filter** - Jump to matched item

---

## Complexity Analysis

| Operation | Traditional | Virtual |
|-----------|-------------|---------|
| Initial render | O(n) | O(k) |
| Memory (DOM) | O(n) | O(k) |
| Scroll | O(n) reflow | O(k) transform |
| Search | O(n) | O(k) render + O(n) search |

Where n = total items, k = visible items + buffer (~20)

### Performance Comparison

| Items | Traditional DOM | Virtual DOM | Memory Savings |
|-------|-----------------|-------------|----------------|
| 100 | 100 nodes | ~20 nodes | 80% |
| 1,000 | 1,000 nodes | ~20 nodes | 98% |
| 10,000 | 10,000 nodes | ~20 nodes | 99.8% |
| 100,000 | Crashes | ~20 nodes | 99.98% |

---

## Performance Optimizations

### 1. Memoize Item Component

```jsx
const ListItem = React.memo(({ item, style }) => (
    <div style={style}>{item.content}</div>
));
```

### 2. Throttle Scroll Handler

```javascript
const handleScroll = useMemo(
    () => throttle((e) => {
        setScrollTop(e.target.scrollTop);
    }, 16),  // ~60fps
    []
);
```

### 3. Use CSS contain

```css
.list-item {
    contain: layout style paint;  /* Isolate repaints */
}
```

### 4. Avoid Inline Styles

```javascript
// Bad: Creates new object every render
style={{ height: itemHeight }}

// Good: Memoize or use CSS
const itemStyle = useMemo(() => ({
    height: itemHeight
}), [itemHeight]);
```

### 5. Use requestAnimationFrame

```javascript
const handleScroll = (e) => {
    if (rafId.current) return;

    rafId.current = requestAnimationFrame(() => {
        setScrollTop(e.target.scrollTop);
        rafId.current = null;
    });
};
```

---

## Real-World Applications

1. **Spreadsheets** - Google Sheets, Excel Online
2. **Chat Apps** - Slack, Discord message history
3. **Social Media** - Twitter, Facebook feeds
4. **File Managers** - Dropbox, Google Drive
5. **Log Viewers** - Developer tools, monitoring
6. **Code Editors** - VSCode, Monaco editor
7. **Data Tables** - Admin dashboards, analytics
8. **Dropdowns** - Select with 1000+ options

---

## Libraries & Alternatives

| Library | Features | Size |
|---------|----------|------|
| react-window | Fixed/Variable heights, Grid | 6kb |
| react-virtualized | Full-featured, complex | 33kb |
| @tanstack/virtual | Framework agnostic | 5kb |
| react-virtuoso | Auto-sizing, grouped | 15kb |

### When to Build Custom vs Use Library

**Build custom when:**
- Fixed height items only
- Simple use case
- Bundle size critical
- Learning purposes

**Use library when:**
- Variable heights needed
- Complex features (sticky headers, infinite load)
- Production application
- Grid virtualization needed

---

## Related Patterns

- **Infinite Scroll** - Load more data on scroll
- **Pagination** - Page-based data loading
- **Windowing** - General term for virtualization
- **Recycling** - Reuse DOM nodes (mobile native)
- **Lazy Loading** - Load content on demand
