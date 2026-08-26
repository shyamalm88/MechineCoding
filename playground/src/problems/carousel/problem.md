# Carousel / Slider

## Problem Statement

Build a **Carousel** (image slider) component that displays items one at a time with smooth sliding transitions, navigation controls, and indicator dots. This is one of the most common UI patterns on the web.

This pattern is essential for:
- Hero banners on landing pages
- Product image galleries (e-commerce)
- Testimonial showcases
- Feature highlights
- Photo galleries
- Onboarding flows (mobile apps)

---

## Requirements

### Functional Requirements

1. **Slide Display**
   - Show one slide at a time
   - Each slide fills the visible area
   - Support any content (images, text, components)

2. **Navigation Buttons**
   - Previous (←) and Next (→) buttons
   - Navigate to adjacent slides
   - Loop from last to first and vice versa

3. **Dot Indicators**
   - Show one dot per slide
   - Highlight current slide's dot
   - Click dot to jump to that slide

4. **Smooth Transitions**
   - Animate slide changes
   - CSS-based transitions
   - No janky movements

5. **Infinite Loop**
   - Next on last slide → goes to first
   - Previous on first slide → goes to last

### Non-Functional Requirements

- Smooth 60fps animations
- Responsive to container width
- Touch-friendly (clickable areas)
- No external dependencies

---

## Visual Representation

```
Component Structure:
+--------------------------------------------------+
|                carousel-container                 |
|  +----------------------------------------------+|
|  |                  carousel                     ||
|  | +----+  +------------------------------+ +--+||
|  | | ← |  |      carousel-window          | |→ |||
|  | |prev|  |   (overflow: hidden)         | |nxt|||
|  | +----+  |  +--------+--------+--------+| +--+||
|  |         |  | Slide  | Slide  | Slide  ||     ||
|  |         |  |   1    |   2    |   3    ||     ||
|  |         |  +--------+--------+--------+|     ||
|  |         |       carousel-track         |     ||
|  |         |   (flex, translateX)         |     ||
|  |         +------------------------------+     ||
|  +----------------------------------------------+|
|                    ●  ○  ○                        |
|                     dots                          |
+--------------------------------------------------+

Sliding Mechanism:
+------------------+
|  Visible Window  |  (overflow: hidden)
|  +---------------|---------------------------+
|  | +-----------+ | +-----------+ +-----------+
|  | |  Slide 1  | | |  Slide 2  | |  Slide 3  |
|  | |  (100%)   | | |  (100%)   | |  (100%)   |
|  | +-----------+ | +-----------+ +-----------+
|  +---------------|---------------------------+
|                  |     translateX(-100%)
+------------------+

Index 0: translateX(0%)      → Shows Slide 1
Index 1: translateX(-100%)   → Shows Slide 2
Index 2: translateX(-200%)   → Shows Slide 3
```

---

## Key Concepts & Intuition

### 1. The Sliding Mechanism

```jsx
<div className="carousel-window" style={{ overflow: 'hidden' }}>
    <div
        className="carousel-track"
        style={{
            display: 'flex',
            transform: `translateX(-${currentIndex * 100}%)`
        }}
    >
        {slides.map(slide => (
            <div className="carousel-item" style={{ width: '100%', flexShrink: 0 }}>
                {slide}
            </div>
        ))}
    </div>
</div>
```

**How it works:**
1. All slides sit side-by-side in a flex container (track)
2. Each slide is 100% width of the window
3. Track is wider than window (300% for 3 slides)
4. Window hides overflow
5. `translateX` shifts the track left to reveal different slides

### 2. Infinite Loop Navigation

```javascript
// Next: wrap around using modulo
function next() {
    setCurrentIndex((prev) => (prev + 1) % total);
}

// Prev: add total before modulo to handle negative
function prev() {
    setCurrentIndex((prev) => (prev - 1 + total) % total);
}
```

**Why `+ total` for prev?**
```
Without + total:
  (0 - 1) % 3 = -1 % 3 = -1  ❌ Invalid index!

With + total:
  (0 - 1 + 3) % 3 = 2 % 3 = 2  ✓ Last slide
```

### 3. Modulo Operator Magic

```javascript
total = 3 (slides: 0, 1, 2)

// Forward navigation:
(0 + 1) % 3 = 1  // 0 → 1
(1 + 1) % 3 = 2  // 1 → 2
(2 + 1) % 3 = 0  // 2 → 0 (wraps!)

// Backward navigation:
(2 - 1 + 3) % 3 = 4 % 3 = 1  // 2 → 1
(1 - 1 + 3) % 3 = 3 % 3 = 0  // 1 → 0
(0 - 1 + 3) % 3 = 2 % 3 = 2  // 0 → 2 (wraps!)
```

### 4. CSS Transition Animation

```css
.carousel-track {
    display: flex;
    transition: transform 0.3s ease-in-out;
}

.carousel-item {
    width: 100%;
    flex-shrink: 0;  /* Prevent items from shrinking */
}
```

**Why `flex-shrink: 0`?**
Without it, flex items would shrink to fit the container, making all slides visible at once.

### 5. Dot Indicators

```jsx
<div className="dots">
    {items.map((_, index) => (
        <span
            key={index}
            className={`dot ${index === currentIndex ? 'active' : ''}`}
            onClick={() => setCurrentIndex(index)}
        />
    ))}
</div>
```

---

## Implementation Tips

### 1. Basic CSS Setup

```css
.carousel-container {
    width: 100%;
    max-width: 600px;
}

.carousel {
    display: flex;
    align-items: center;
}

.carousel-window {
    overflow: hidden;
    flex: 1;
}

.carousel-track {
    display: flex;
    transition: transform 0.3s ease-in-out;
}

.carousel-item {
    width: 100%;
    flex-shrink: 0;
    display: flex;
    justify-content: center;
    align-items: center;
}
```

### 2. Dot Styling

```css
.dots {
    display: flex;
    justify-content: center;
    gap: 8px;
    margin-top: 10px;
}

.dot {
    width: 10px;
    height: 10px;
    border-radius: 50%;
    background: #ccc;
    cursor: pointer;
    transition: background 0.2s;
}

.dot.active {
    background: #333;
}
```

### 3. Button Styling

```css
.carousel button {
    background: rgba(0, 0, 0, 0.5);
    color: white;
    border: none;
    padding: 10px 15px;
    cursor: pointer;
    font-size: 18px;
}

.carousel button:hover {
    background: rgba(0, 0, 0, 0.8);
}
```

---

## Common Interview Questions

### Q1: How would you implement auto-play?

```javascript
useEffect(() => {
    const interval = setInterval(() => {
        setCurrentIndex(prev => (prev + 1) % total);
    }, 3000);  // Change every 3 seconds

    return () => clearInterval(interval);  // Cleanup
}, [total]);

// Pause on hover
const [isPaused, setIsPaused] = useState(false);

useEffect(() => {
    if (isPaused) return;

    const interval = setInterval(() => {
        setCurrentIndex(prev => (prev + 1) % total);
    }, 3000);

    return () => clearInterval(interval);
}, [total, isPaused]);

// In JSX:
<div
    onMouseEnter={() => setIsPaused(true)}
    onMouseLeave={() => setIsPaused(false)}
>
```

### Q2: How would you add touch/swipe support?

```javascript
const [touchStart, setTouchStart] = useState(0);
const [touchEnd, setTouchEnd] = useState(0);

const handleTouchStart = (e) => {
    setTouchStart(e.targetTouches[0].clientX);
};

const handleTouchMove = (e) => {
    setTouchEnd(e.targetTouches[0].clientX);
};

const handleTouchEnd = () => {
    const swipeDistance = touchStart - touchEnd;
    const minSwipeDistance = 50;

    if (swipeDistance > minSwipeDistance) {
        next();  // Swiped left → next slide
    } else if (swipeDistance < -minSwipeDistance) {
        prev();  // Swiped right → previous slide
    }
};

// In JSX:
<div
    onTouchStart={handleTouchStart}
    onTouchMove={handleTouchMove}
    onTouchEnd={handleTouchEnd}
>
```

### Q3: How would you implement infinite loop with smooth animation?

```javascript
// Clone first and last slides
const extendedItems = [items[items.length - 1], ...items, items[0]];
// [Clone of Last, ...originals..., Clone of First]

// Start at index 1 (first real slide)
const [displayIndex, setDisplayIndex] = useState(1);

// When reaching clone, jump without animation
useEffect(() => {
    if (displayIndex === 0) {
        // At clone of last, jump to real last
        setTimeout(() => {
            trackRef.current.style.transition = 'none';
            setDisplayIndex(items.length);
            requestAnimationFrame(() => {
                trackRef.current.style.transition = 'transform 0.3s';
            });
        }, 300);
    }
    // Similar for other direction...
}, [displayIndex]);
```

### Q4: How would you accept slides as props?

```jsx
function Carousel({ children, autoPlay = false, interval = 3000 }) {
    const slides = React.Children.toArray(children);
    const total = slides.length;
    // ... rest of implementation
}

// Usage:
<Carousel autoPlay interval={5000}>
    <img src="slide1.jpg" alt="Slide 1" />
    <img src="slide2.jpg" alt="Slide 2" />
    <div className="custom-slide">Custom Content</div>
</Carousel>
```

### Q5: How would you add keyboard navigation?

```javascript
useEffect(() => {
    const handleKeyDown = (e) => {
        if (e.key === 'ArrowLeft') prev();
        if (e.key === 'ArrowRight') next();
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
}, []);
```

### Q6: How would you implement fade transition instead of slide?

```jsx
// Change from translateX to opacity
<div className="carousel-track">
    {items.map((item, index) => (
        <div
            className="carousel-item"
            style={{
                position: 'absolute',
                opacity: index === currentIndex ? 1 : 0,
                transition: 'opacity 0.5s ease-in-out'
            }}
        >
            {item}
        </div>
    ))}
</div>
```

---

## Edge Cases to Consider

1. **Single slide** - Hide navigation buttons
2. **Empty slides** - Handle gracefully
3. **Dynamic slides** - Adding/removing slides
4. **Fast clicking** - Prevent animation stacking
5. **Page visibility** - Pause autoplay when tab hidden
6. **Accessibility** - Keyboard navigation, ARIA labels
7. **RTL languages** - Reverse direction
8. **Lazy loading** - Load images as needed

---

## Complexity Analysis

| Operation | Time | Space |
|-----------|------|-------|
| Initial render | O(n) | O(n) |
| Navigation | O(1) | O(1) |
| Dot click | O(1) | O(1) |
| Re-render | O(n) | O(n) |

Where n = number of slides

---

## Performance Optimizations

### 1. Lazy Load Images

```jsx
<img
    src={index === currentIndex ? slide.src : undefined}
    data-src={slide.src}
    loading="lazy"
/>
```

### 2. Use CSS Transform (GPU Accelerated)

```css
/* Good: Uses GPU */
transform: translateX(-100%);

/* Bad: Causes layout recalculation */
left: -100%;
margin-left: -100%;
```

### 3. Debounce Rapid Navigation

```javascript
const [isAnimating, setIsAnimating] = useState(false);

const next = () => {
    if (isAnimating) return;
    setIsAnimating(true);
    setCurrentIndex(prev => (prev + 1) % total);
    setTimeout(() => setIsAnimating(false), 300);  // Match transition duration
};
```

### 4. Preload Adjacent Images

```javascript
useEffect(() => {
    // Preload next and previous images
    const nextIndex = (currentIndex + 1) % total;
    const prevIndex = (currentIndex - 1 + total) % total;

    [nextIndex, prevIndex].forEach(idx => {
        const img = new Image();
        img.src = slides[idx].src;
    });
}, [currentIndex]);
```

### 5. Use will-change for Animation

```css
.carousel-track {
    will-change: transform;  /* Hint to browser */
}
```

---

## Real-World Applications

1. **E-commerce** - Product image galleries
2. **Landing Pages** - Hero banners, feature highlights
3. **Portfolios** - Project showcases
4. **Testimonials** - Customer review carousels
5. **News Sites** - Featured article sliders
6. **Mobile Apps** - Onboarding screens
7. **Social Media** - Story viewers, post galleries

---

## Related Patterns

- **Infinite Scroll** - Vertical continuous loading
- **Tabs** - Content switching without animation
- **Accordion** - Expandable content sections
- **Lightbox** - Full-screen image viewer
- **Gallery Grid** - Multiple items visible
- **Thumbnail Strip** - Small preview carousel
