# Star Rating

## Problem Statement

Build an interactive **Star Rating** component that allows users to rate items on a configurable scale. This is a fundamental UI pattern used across e-commerce, review platforms, and feedback systems.

This pattern is essential for:
- E-commerce product reviews (Amazon, Flipkart)
- App store ratings (Google Play, App Store)
- Restaurant/hotel reviews (Yelp, TripAdvisor)
- Service feedback (Uber, Ola driver ratings)
- Content ratings (Netflix, IMDb)

---

## Requirements

### Functional Requirements

1. **Star Display**
   - Render configurable number of stars (default: 5)
   - Each star is clickable
   - Stars should be visually distinct (filled vs empty)

2. **Hover Preview**
   - Highlight stars up to the hovered position
   - Show user what rating they would set
   - Reset preview when mouse leaves

3. **Click Selection**
   - Click a star to set the rating
   - Rating persists after mouse leaves
   - Notify parent component via callback

4. **Reset Functionality**
   - Double-click to reset rating to 0
   - Clear both rating and hover state

5. **Customization**
   - Support custom total stars (5, 10, etc.)
   - Accept onChange callback for parent notification

### Non-Functional Requirements

- Smooth hover transitions
- Accessible via keyboard (button elements)
- No external dependencies
- Responsive to different sizes

---

## Visual Representation

```
Initial State (No Rating):
+------------------------------------------+
|                                          |
|     ☆     ☆     ☆     ☆     ☆           |
|    (1)   (2)   (3)   (4)   (5)          |
|                                          |
|     Current Rating: 0 / 5                |
+------------------------------------------+

Hover State (Hovering on star 3):
+------------------------------------------+
|                                          |
|     ★     ★     ★     ☆     ☆           |
|    (1)   (2)   (3)   (4)   (5)          |
|     ^     ^     ^                        |
|   Highlighted (preview)                  |
|                                          |
+------------------------------------------+

After Click (Rating set to 3):
+------------------------------------------+
|                                          |
|     ★     ★     ★     ☆     ☆           |
|    (1)   (2)   (3)   (4)   (5)          |
|                                          |
|     Current Rating: 3 / 5                |
+------------------------------------------+

Hover After Selection (Hovering on star 5):
+------------------------------------------+
|                                          |
|     ★     ★     ★     ★     ★           |
|    (1)   (2)   (3)   (4)   (5)          |
|                 ^     ^     ^            |
|           Preview overrides rating       |
|                                          |
+------------------------------------------+
```

---

## Key Concepts & Intuition

### 1. Dual State Management

```javascript
const [rating, setRating] = useState(0);  // Persisted selection
const [hover, setHover] = useState(0);    // Temporary preview

// The magic: hover takes precedence over rating
const displayValue = hover || rating;
```

**Why two states?**
- `rating` persists after mouse leaves
- `hover` provides preview without committing
- OR operator gives hover priority when non-zero

### 2. Star Highlighting Logic

```jsx
className={`star ${starValue <= (hover || rating) ? "on" : "off"}`}
```

**How it works:**
```
If hover = 3: stars 1,2,3 are "on", stars 4,5 are "off"
If hover = 0, rating = 2: stars 1,2 are "on", stars 3,4,5 are "off"
```

### 3. Converting Index to Value

```javascript
{[...Array(totalStars)].map((_, index) => {
    const starValue = index + 1;  // 0-based to 1-based
    // ...
})}
```

**Why +1?**
- Array index is 0-based (0, 1, 2, 3, 4)
- Star values are 1-based (1, 2, 3, 4, 5)
- Rating of "0" means no selection

### 4. Event Handlers

```jsx
<button
    onClick={() => {
        setRating(starValue);
        onChange?.(starValue);  // Optional chaining
    }}
    onMouseEnter={() => setHover(starValue)}
    onMouseLeave={() => setHover(0)}
    onDoubleClick={() => {
        setRating(0);
        setHover(0);
        onChange?.(0);
    }}
>
```

### 5. Using Buttons for Accessibility

```jsx
// Good: Buttons are focusable and keyboard accessible
<button className="star">★</button>

// Bad: Divs require manual accessibility handling
<div className="star" tabIndex={0} role="button">★</div>
```

---

## Implementation Tips

### 1. Creating Star Array

```javascript
// Method 1: Spread empty array
[...Array(5)].map((_, i) => ...)

// Method 2: Array.from
Array.from({ length: 5 }, (_, i) => ...)

// Method 3: Array.fill
Array(5).fill().map((_, i) => ...)
```

### 2. Unicode Stars

```javascript
// Filled star
<span>&#9733;</span>  // ★

// Empty star
<span>&#9734;</span>  // ☆

// Or use CSS to toggle
.star.on { color: gold; }
.star.off { color: gray; }
```

### 3. Preventing Text Selection

```css
.star-container {
    user-select: none;  /* Prevent text selection on double-click */
}
```

### 4. Smooth Transitions

```css
.star {
    transition: color 0.2s ease, transform 0.1s ease;
}

.star:hover {
    transform: scale(1.1);
}
```

---

## Common Interview Questions

### Q1: How does the hover preview work without affecting the saved rating?

**Answer:** We maintain two separate states: `rating` for the persisted selection and `hover` for the temporary preview. The display logic uses `hover || rating`, so hover takes precedence when non-zero. When the mouse leaves (`onMouseLeave`), we reset hover to 0, revealing the saved rating.

### Q2: How would you implement half-star ratings?

```javascript
const [rating, setRating] = useState(0);

const handleClick = (e, starValue) => {
    const rect = e.target.getBoundingClientRect();
    const isLeftHalf = e.clientX - rect.left < rect.width / 2;
    setRating(isLeftHalf ? starValue - 0.5 : starValue);
};

// Render with gradient for half-filled stars
<div style={{
    background: `linear-gradient(90deg, gold ${percentage}%, gray ${percentage}%)`
}}>
```

### Q3: How would you make this a controlled component?

```javascript
// Controlled: value comes from props
function StarRating({ value, onChange, totalStars = 5 }) {
    const [hover, setHover] = useState(0);

    return (
        // Use 'value' prop instead of internal state
        // Call onChange instead of internal setRating
    );
}

// Usage
<StarRating value={userRating} onChange={setUserRating} />
```

### Q4: How would you add keyboard navigation?

```javascript
const handleKeyDown = (e, starValue) => {
    if (e.key === 'ArrowRight') {
        setRating(Math.min(starValue + 1, totalStars));
    } else if (e.key === 'ArrowLeft') {
        setRating(Math.max(starValue - 1, 0));
    } else if (e.key === 'Enter' || e.key === ' ') {
        setRating(starValue);
    }
};
```

### Q5: How would you handle read-only display?

```jsx
function StarRating({ value, readOnly = false, totalStars = 5 }) {
    if (readOnly) {
        return (
            <div className="star-container">
                {[...Array(totalStars)].map((_, i) => (
                    <span key={i} className={`star ${i < value ? 'on' : 'off'}`}>
                        ★
                    </span>
                ))}
            </div>
        );
    }
    // ... interactive version
}
```

---

## Edge Cases to Consider

1. **Rapid clicking** - Multiple clicks in quick succession
2. **Touch devices** - No hover state available
3. **Zero rating** - Valid state vs no selection
4. **Fractional ratings** - Display 3.5 stars from API
5. **Very large scales** - 100-star rating (rare but possible)
6. **RTL languages** - Stars should go right-to-left
7. **Color blindness** - Don't rely only on color
8. **Screen readers** - Announce current rating

---

## Complexity Analysis

| Operation | Time | Space |
|-----------|------|-------|
| Initial render | O(n) | O(1) |
| Hover update | O(n) | O(1) |
| Click update | O(n) | O(1) |
| Re-render | O(n) | O(1) |

Where n = number of stars (typically 5-10)

---

## Performance Optimizations

### 1. Memoize Star Component

```jsx
const Star = React.memo(({ value, isActive, onHover, onClick }) => (
    <button
        className={`star ${isActive ? 'on' : 'off'}`}
        onMouseEnter={() => onHover(value)}
        onClick={() => onClick(value)}
    >
        ★
    </button>
));
```

### 2. useCallback for Handlers

```javascript
const handleHover = useCallback((value) => setHover(value), []);
const handleClick = useCallback((value) => {
    setRating(value);
    onChange?.(value);
}, [onChange]);
```

### 3. CSS-only Hover (No JS)

```css
/* Pure CSS hover using sibling selectors */
.star-container:hover .star { color: gray; }
.star:hover,
.star:hover ~ .star { color: gold; }  /* This won't work - need inverse */

/* Actually need flexbox row-reverse trick for pure CSS */
```

---

## Real-World Applications

1. **E-commerce** - Product reviews and ratings
2. **App Stores** - App rating and feedback
3. **Food Delivery** - Restaurant and dish ratings
4. **Ride Sharing** - Driver and rider ratings
5. **Streaming** - Content recommendations
6. **Hotels/Travel** - Accommodation reviews
7. **Job Portals** - Company and interview ratings

---

## Related Patterns

- **Like/Dislike** - Binary rating (thumbs up/down)
- **Emoji Reactions** - Multiple sentiment options
- **NPS Score** - 0-10 scale rating
- **Slider Rating** - Continuous value selection
- **Review Form** - Rating + text feedback
