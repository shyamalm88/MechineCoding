# React Performance Optimization: A Senior Engineer's Guide

A comprehensive guide to optimizing React applications for system design interviews.

---

## 1. Understanding React's Rendering Model

Before optimizing, you must understand **why** React re-renders.

```
Component Re-renders When:
├── Props change (shallow comparison)
├── State changes (useState, useReducer)
├── Context value changes
└── Parent re-renders (even if props haven't changed!)
```

### The Re-render Cascade

```
┌─────────────────────────────────────────────────────────────┐
│  <App>                           ← State changes here       │
│    ├── <Header />                ← Re-renders (child)       │
│    ├── <Sidebar />               ← Re-renders (child)       │
│    └── <MainContent>             ← Re-renders (child)       │
│          ├── <ProductList />     ← Re-renders (grandchild)  │
│          └── <ProductItem /> x100← ALL 100 re-render!       │
└─────────────────────────────────────────────────────────────┘
```

**The Problem:** By default, when a parent re-renders, ALL children re-render regardless of whether their props changed.

---

## 2. Memoization: The First Line of Defense

### React.memo (Component Memoization)

```jsx
// Without memo - re-renders on every parent render
function ProductItem({ product }) {
  return <div>{product.name}</div>;
}

// With memo - only re-renders if props change
const ProductItem = React.memo(function ProductItem({ product }) {
  return <div>{product.name}</div>;
});
```

### When React.memo Fails

```jsx
// ❌ BROKEN - onClick is a new function every render
function Parent() {
  const handleClick = () => console.log('clicked');

  return <MemoizedChild onClick={handleClick} />;
}

// ✅ FIXED - useCallback stabilizes the reference
function Parent() {
  const handleClick = useCallback(() => {
    console.log('clicked');
  }, []);

  return <MemoizedChild onClick={handleClick} />;
}
```

### useMemo (Value Memoization)

```jsx
function ProductList({ products, filter }) {
  // ❌ Recalculates on EVERY render
  const filtered = products.filter(p => p.category === filter);

  // ✅ Only recalculates when products or filter changes
  const filtered = useMemo(() =>
    products.filter(p => p.category === filter),
    [products, filter]
  );

  return filtered.map(p => <ProductItem key={p.id} product={p} />);
}
```

### The Memoization Decision Framework

```
Should I memoize?
│
├─▶ Is the component expensive to render?
│   └─▶ YES → Use React.memo
│
├─▶ Is the calculation expensive (>1ms)?
│   └─▶ YES → Use useMemo
│
├─▶ Is this function passed to a memoized child?
│   └─▶ YES → Use useCallback
│
└─▶ Otherwise → Don't memoize (adds overhead)
```

---

## 3. State Management Optimization

### Colocate State (Move State Down)

```jsx
// ❌ BAD - State at top causes entire tree to re-render
function App() {
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <div>
      <Header />                    {/* Re-renders unnecessarily */}
      <SearchBar
        query={searchQuery}
        onChange={setSearchQuery}
      />
      <Footer />                    {/* Re-renders unnecessarily */}
    </div>
  );
}

// ✅ GOOD - State colocated where it's used
function App() {
  return (
    <div>
      <Header />                    {/* Stable */}
      <SearchBar />                 {/* Contains its own state */}
      <Footer />                    {/* Stable */}
    </div>
  );
}

function SearchBar() {
  const [searchQuery, setSearchQuery] = useState('');
  // ...
}
```

### Lift Content Up (Composition Pattern)

```jsx
// ❌ BAD - ExpensiveComponent re-renders when theme changes
function Parent() {
  const [theme, setTheme] = useState('light');

  return (
    <div className={theme}>
      <ThemeToggle onChange={setTheme} />
      <ExpensiveComponent />        {/* Re-renders! */}
    </div>
  );
}

// ✅ GOOD - Pass children as props (they're already created)
function Parent({ children }) {
  const [theme, setTheme] = useState('light');

  return (
    <div className={theme}>
      <ThemeToggle onChange={setTheme} />
      {children}                    {/* Stable reference! */}
    </div>
  );
}

// Usage
<Parent>
  <ExpensiveComponent />
</Parent>
```

### State Splitting

```jsx
// ❌ BAD - One big state object
const [state, setState] = useState({
  user: null,
  products: [],
  cart: [],
  ui: { modal: false, sidebar: true }
});

// Changing cart re-renders everything that uses ANY part of state

// ✅ GOOD - Split into logical pieces
const [user, setUser] = useState(null);
const [products, setProducts] = useState([]);
const [cart, setCart] = useState([]);
const [ui, setUI] = useState({ modal: false, sidebar: true });

// Changing cart only affects cart consumers
```

---

## 4. Context Optimization

### The Context Re-render Problem

```jsx
// ❌ PROBLEM - Every consumer re-renders when ANY value changes
const AppContext = createContext();

function AppProvider({ children }) {
  const [user, setUser] = useState(null);
  const [theme, setTheme] = useState('light');
  const [notifications, setNotifications] = useState([]);

  return (
    <AppContext.Provider value={{ user, theme, notifications, setTheme }}>
      {children}
    </AppContext.Provider>
  );
}
```

### Solution 1: Split Contexts

```jsx
// ✅ Separate contexts for different concerns
const UserContext = createContext();
const ThemeContext = createContext();
const NotificationContext = createContext();

// Now theme changes don't affect user consumers
```

### Solution 2: Memoize Context Value

```jsx
function AppProvider({ children }) {
  const [user, setUser] = useState(null);
  const [theme, setTheme] = useState('light');

  // ✅ Memoize the value object
  const value = useMemo(() => ({
    user,
    theme,
    setTheme
  }), [user, theme]);

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  );
}
```

### Solution 3: State/Dispatch Split

```jsx
// Separate read and write contexts
const StateContext = createContext();
const DispatchContext = createContext();

function Provider({ children }) {
  const [state, dispatch] = useReducer(reducer, initialState);

  return (
    <StateContext.Provider value={state}>
      <DispatchContext.Provider value={dispatch}>
        {children}
      </DispatchContext.Provider>
    </StateContext.Provider>
  );
}

// dispatch never changes, so components that only write don't re-render on state changes
```

---

## 5. List Virtualization

Render only what's visible in the viewport.

### The Problem

```
┌─────────────────────────────────────────────────────────────┐
│  10,000 items rendered                                       │
│                                                              │
│  ┌─────────────────┐  ← Visible (10 items)                  │
│  │ Item 1          │                                         │
│  │ Item 2          │                                         │
│  │ ...             │                                         │
│  │ Item 10         │                                         │
│  └─────────────────┘                                         │
│                                                              │
│  Items 11-10,000 are in DOM but INVISIBLE                    │
│  → Wasted memory, slow initial render                        │
└─────────────────────────────────────────────────────────────┘
```

### The Solution: Windowing

```jsx
import { FixedSizeList } from 'react-window';

function VirtualizedList({ items }) {
  return (
    <FixedSizeList
      height={600}        // Viewport height
      itemCount={items.length}
      itemSize={50}       // Height of each row
      width="100%"
    >
      {({ index, style }) => (
        <div style={style}>
          {items[index].name}
        </div>
      )}
    </FixedSizeList>
  );
}
```

### Libraries

| Library | Best For |
|---------|----------|
| `react-window` | Simple lists, smaller bundle (6KB) |
| `react-virtuoso` | Variable height items, grouped lists |
| `@tanstack/react-virtual` | Framework-agnostic, headless |

---

## 6. Code Splitting & Lazy Loading

### Route-Based Splitting

```jsx
import { lazy, Suspense } from 'react';

// These are loaded only when needed
const Dashboard = lazy(() => import('./pages/Dashboard'));
const Settings = lazy(() => import('./pages/Settings'));
const Analytics = lazy(() => import('./pages/Analytics'));

function App() {
  return (
    <Suspense fallback={<PageSkeleton />}>
      <Routes>
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="/analytics" element={<Analytics />} />
      </Routes>
    </Suspense>
  );
}
```

### Component-Based Splitting

```jsx
// Heavy component loaded only when needed
const HeavyEditor = lazy(() => import('./components/HeavyEditor'));

function Document({ isEditing }) {
  return (
    <div>
      {isEditing ? (
        <Suspense fallback={<EditorSkeleton />}>
          <HeavyEditor />
        </Suspense>
      ) : (
        <ReadOnlyView />
      )}
    </div>
  );
}
```

### Preloading for Better UX

```jsx
// Preload on hover
function NavLink({ to, children }) {
  const handleMouseEnter = () => {
    // Start loading before click
    if (to === '/analytics') {
      import('./pages/Analytics');
    }
  };

  return (
    <Link to={to} onMouseEnter={handleMouseEnter}>
      {children}
    </Link>
  );
}
```

---

## 7. Avoiding Unnecessary Work

### Stable References

```jsx
// ❌ BAD - New object every render
<Component style={{ color: 'red' }} />

// ✅ GOOD - Stable reference
const style = { color: 'red' };  // Outside component
<Component style={style} />

// Or use useMemo for dynamic styles
const style = useMemo(() => ({ color: theme.primary }), [theme.primary]);
```

### Stable Event Handlers

```jsx
// ❌ BAD - New function every render
{items.map(item => (
  <Item
    key={item.id}
    onClick={() => handleClick(item.id)}
  />
))}

// ✅ GOOD - Pass id as data attribute
function Item({ id, onClick }) {
  return <div data-id={id} onClick={onClick}>...</div>;
}

// Parent uses single handler
const handleClick = useCallback((e) => {
  const id = e.currentTarget.dataset.id;
  // handle click
}, []);
```

### Debounce Expensive Operations

```jsx
function SearchInput() {
  const [query, setQuery] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState('');

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(query);
    }, 300);

    return () => clearTimeout(timer);
  }, [query]);

  // Use debouncedQuery for expensive operations (API calls, filtering)
  const results = useExpensiveSearch(debouncedQuery);
}
```

---

## 8. Concurrent Features (React 18+)

### useTransition (Deprioritize Updates)

```jsx
function FilterableList({ items }) {
  const [filter, setFilter] = useState('');
  const [isPending, startTransition] = useTransition();

  const handleChange = (e) => {
    // Urgent: Update input immediately
    setFilter(e.target.value);

    // Non-urgent: Can be interrupted
    startTransition(() => {
      setFilteredItems(items.filter(/* expensive filter */));
    });
  };

  return (
    <>
      <input value={filter} onChange={handleChange} />
      {isPending ? <Spinner /> : <ItemList items={filteredItems} />}
    </>
  );
}
```

### useDeferredValue (Defer Expensive Renders)

```jsx
function SearchResults({ query }) {
  // deferredQuery lags behind query during rapid updates
  const deferredQuery = useDeferredValue(query);

  // This expensive component uses the deferred value
  // allowing the input to stay responsive
  return <ExpensiveList filter={deferredQuery} />;
}
```

---

## 9. Profiling & Measurement

### React DevTools Profiler

```
1. Open React DevTools → Profiler tab
2. Click "Record"
3. Perform the slow action
4. Click "Stop"
5. Analyze:
   - Flame graph shows component render times
   - Ranked chart shows slowest components
   - "Why did this render?" shows the cause
```

### Custom Performance Marks

```jsx
function ExpensiveComponent({ data }) {
  useEffect(() => {
    performance.mark('expensive-start');

    return () => {
      performance.mark('expensive-end');
      performance.measure('expensive-render', 'expensive-start', 'expensive-end');

      const measure = performance.getEntriesByName('expensive-render')[0];
      if (measure.duration > 16) {
        console.warn(`Slow render: ${measure.duration}ms`);
      }
    };
  });
}
```

### React Profiler API

```jsx
<Profiler id="ProductList" onRender={onRenderCallback}>
  <ProductList />
</Profiler>

function onRenderCallback(id, phase, actualDuration) {
  if (actualDuration > 16) {
    // Log slow renders to monitoring
    analytics.track('slow_render', { id, duration: actualDuration });
  }
}
```

---

## 10. Quick Reference: Optimization Checklist

| Problem | Solution |
|---------|----------|
| Child re-renders when parent changes | `React.memo` |
| Expensive calculation on every render | `useMemo` |
| Callback breaks memoization | `useCallback` |
| State too high in tree | Colocate state |
| Context causes full re-renders | Split contexts |
| Long lists are slow | Virtualization |
| Large bundle size | Code splitting |
| Input feels laggy | `useTransition` / `useDeferredValue` |
| Object/array props break memo | Memoize with `useMemo` |

---

## 11. Interview Tip

> "I approach React performance systematically. First, I profile to identify actual bottlenecks—premature optimization is the root of all evil. Common wins include: memoizing expensive components with React.memo, stabilizing callbacks with useCallback, virtualizing long lists, and splitting code by route. For state, I colocate where possible and split contexts to prevent unnecessary re-renders. React 18's concurrent features like useTransition help keep the UI responsive during expensive updates. The key is measuring before and after—Chrome DevTools and React Profiler are my go-to tools."
