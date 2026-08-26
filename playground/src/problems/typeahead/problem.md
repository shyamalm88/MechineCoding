# Typeahead / Autocomplete Search

## Problem Statement

Build a **Typeahead/Autocomplete** component that searches for products as the user types in an input field. The component should fetch results from an API and display them efficiently.

## Requirements

### Core Features
1. Text input field that triggers search
2. Fetch results from API as user types
3. Display search results below the input
4. Handle loading and error states

### Performance Requirements
- **Debounce** user input to avoid excessive API calls
- **Cancel** pending requests when user types new characters
- Clear results when input is empty

## Visual Representation

```
┌─────────────────────────────────────────┐
│  🔍 Search products (e.g. 'phone')...   │
└─────────────────────────────────────────┘
           │
           ▼  (after debounce delay)
┌─────────────────────────────────────────┐
│  📱 iPhone 15                           │
│  📱 Samsung Galaxy                      │
│  📱 Google Pixel                        │
│  ...                                    │
└─────────────────────────────────────────┘
```

## Key Concepts & Intuition

### 1. Debouncing - Why and How?

**Problem:** If we fetch on every keystroke, typing "phone" creates 5 API calls (p, ph, pho, phon, phone).

**Solution:** Wait for user to stop typing before making the API call.

```
User types: p...h...o...n...e
            │   │   │   │   │
            ▼   ▼   ▼   ▼   ▼
Without debounce: 5 API calls ❌

With 500ms debounce:
p → wait... (user still typing)
h → reset timer, wait...
o → reset timer, wait...
n → reset timer, wait...
e → reset timer, wait... → 500ms passes → 1 API call ✅
```

### 2. Request Cancellation with AbortController

**Problem:** User types "apple", API starts fetching. User changes to "banana". Now we have a **race condition** - what if "apple" results arrive AFTER "banana" results?

**Solution:** Cancel the previous request when a new one starts.

```javascript
const controller = new AbortController();
fetch(url, { signal: controller.signal });

// Later, to cancel:
controller.abort();
```

### 3. Cleanup Function Pattern

The `useEffect` cleanup function runs:
- Before the effect runs again (when dependencies change)
- When the component unmounts

```javascript
useEffect(() => {
  const controller = new AbortController();
  fetch(url, { signal: controller.signal });

  // This runs BEFORE the next effect
  return () => controller.abort();
}, [searchTerm]);
```

## Implementation Tips

### Custom Debounce Hook

```javascript
function useDebounce(value, delay) {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => clearTimeout(timer);
  }, [value, delay]);

  return debouncedValue;
}
```

### Data Flow

```
User Input → useState → useDebounce → Debounced Value → useEffect → API Call
     │                                                                  │
     └────────────────────────────────────────────────────────────────┘
                                Results → UI
```

## Common Interview Questions

1. **Why debounce instead of throttle?**
   - Debounce waits for "quiet time" - perfect for search (user finished typing)
   - Throttle limits rate - better for continuous events (scroll, resize)

2. **What happens if you don't cancel requests?**
   - Race conditions: old results might overwrite new results
   - Memory leaks: state updates on unmounted components
   - Wasted bandwidth

3. **How to handle errors gracefully?**
   - Distinguish between AbortError (intentional) and real errors
   - Don't show error UI when request was intentionally cancelled

## Edge Cases to Handle

- [ ] Empty search term - clear results
- [ ] Network errors - show error state
- [ ] Aborted requests - don't show error
- [ ] Rapid typing - only latest request matters
- [ ] Component unmount during fetch - prevent state update

## API Used

```
https://dummyjson.com/products/search?q={searchTerm}
```

Returns: `{ products: [...], total: number, skip: number, limit: number }`

## Complexity Analysis

| Operation | Time | Space |
|-----------|------|-------|
| Debounce | O(1) | O(1) |
| API Call | O(n) | O(n) |
| Render Results | O(n) | O(n) |

Where n = number of search results
