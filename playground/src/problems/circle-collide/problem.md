# Circle Collision Detection

## Problem Statement

Build an interactive canvas where users can click to place circles. Circles should detect collisions with other circles and change color to indicate overlap. This demonstrates fundamental collision detection algorithms used in games and physics simulations.

This pattern is essential for:
- Game development (character/object collisions)
- Physics simulations
- Drag-and-drop interfaces with collision awareness
- Interactive data visualizations
- UI element overlap detection

---

## Requirements

### Functional Requirements

1. **Circle Placement**
   - Click anywhere on the canvas to place a circle
   - Circle appears centered at click position
   - Each circle has a fixed radius (50px)

2. **Collision Detection**
   - Detect when circles overlap
   - Check new circle against all existing circles
   - Re-check all circles when a new one is added

3. **Visual Feedback**
   - Non-colliding circles are blue
   - Colliding circles turn red
   - Both overlapping circles should be red

4. **State Management**
   - Track all circles with their positions
   - Update colors based on collision state
   - Each circle needs unique identifier

### Non-Functional Requirements

- Smooth placement without lag
- Accurate collision detection
- Clean visual representation
- Responsive to container size

---

## Visual Representation

```
Initial State (Empty Canvas):
+------------------------------------------+
|                                          |
|                                          |
|                                          |
|        Click anywhere to place           |
|               a circle                   |
|                                          |
|                                          |
+------------------------------------------+

After First Click:
+------------------------------------------+
|                                          |
|         ┌─────────┐                      |
|         │  BLUE   │                      |
|         │    ●    │  <- No collision     |
|         │         │                      |
|         └─────────┘                      |
|                                          |
+------------------------------------------+

After Second Click (No Collision):
+------------------------------------------+
|                                          |
|    ┌─────────┐          ┌─────────┐     |
|    │  BLUE   │          │  BLUE   │     |
|    │    ●    │          │    ●    │     |
|    │         │          │         │     |
|    └─────────┘          └─────────┘     |
|                                          |
+------------------------------------------+

After Third Click (Collision!):
+------------------------------------------+
|                                          |
|    ┌─────────┐    ┌─────────┐           |
|    │  BLUE   │    │   RED   │           |
|    │    ●    │    │    ●────┼───┐       |
|    │         │    │         │RED│       |
|    └─────────┘    └─────────┼───┘       |
|                             └───┘        |
|         distance < r1 + r2 = COLLISION   |
+------------------------------------------+
```

---

## Key Concepts & Intuition

### 1. Euclidean Distance Formula

```javascript
// Distance between two points in 2D space
function getDistance(c1, c2) {
    const dx = c1.x - c2.x;  // Horizontal distance
    const dy = c1.y - c2.y;  // Vertical distance
    return Math.sqrt(dx * dx + dy * dy);  // Pythagorean theorem
}
```

```
        c1 (x1, y1)
         ●
         |\
         | \
      dy |  \ distance
         |   \
         |____\
              ● c2 (x2, y2)
           dx

distance = √(dx² + dy²)
```

### 2. Circle Collision Condition

```javascript
function isColliding(c1, c2) {
    const distance = getDistance(c1, c2);
    return distance < c1.r + c2.r;  // Sum of radii
}
```

```
No Collision (distance > r1 + r2):
    ●───────────●
   r1    gap    r2

Touching (distance = r1 + r2):
    ●─────●
   r1    r2

Collision (distance < r1 + r2):
    ●──●
   r1 r2  (overlapping)
```

### 3. Coordinate Transformation

```javascript
function handleClick(e) {
    const rect = containerRef.current.getBoundingClientRect();

    // Convert viewport coordinates to container-relative
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
}
```

```
Viewport (screen):           Container (relative):
+------------------+         +------------------+
| Browser          |         | (0,0)            |
|   +----------+   |         |   ●              |
|   | Container|   |   -->   |  (x,y)           |
|   |    ●     |   |         |                  |
|   +----------+   |         +------------------+
+------------------+

x = clientX - rect.left
y = clientY - rect.top
```

### 4. O(n²) Collision Check

```javascript
// Check every circle against every other circle
return updatedCircles.map(circle => {
    let hasCollision = false;

    for (let other of updatedCircles) {
        if (circle.id === other.id) continue;  // Skip self

        if (isColliding(circle, other)) {
            hasCollision = true;
            break;  // One collision is enough
        }
    }

    return { ...circle, color: hasCollision ? 'red' : 'blue' };
});
```

### 5. Functional State Update

```javascript
setCircles(prevCircles => {
    // 1. Add new circle
    const updatedCircles = [...prevCircles, newCircle];

    // 2. Recalculate collisions for ALL circles
    return updatedCircles.map(circle => ({
        ...circle,
        color: checkCollision(circle, updatedCircles) ? 'red' : 'blue'
    }));
});
```

**Why functional update?**
- Access previous state correctly
- Avoid stale closure issues
- Atomic update (add + recalculate in one render)

---

## Implementation Tips

### 1. Circle Data Structure

```javascript
const circle = {
    id: Date.now(),     // Unique identifier
    x: 150,             // Center X coordinate
    y: 200,             // Center Y coordinate
    r: 50,              // Radius
    color: 'blue'       // 'blue' or 'red'
};
```

### 2. Rendering Circles with CSS

```jsx
<div
    className="circle"
    style={{
        left: circle.x - circle.r,    // Position from top-left
        top: circle.y - circle.r,
        width: circle.r * 2,          // Diameter
        height: circle.r * 2,
        background: circle.color,
        borderRadius: '50%',
        position: 'absolute'
    }}
/>
```

### 3. Container Setup

```jsx
<div
    ref={containerRef}
    className="canvas"
    onClick={handleClick}
    style={{
        position: 'relative',  // For absolute children
        width: '100%',
        height: '400px',
        border: '1px solid #ccc'
    }}
>
```

### 4. Unique IDs

```javascript
// Simple: timestamp (may collide with rapid clicks)
id: Date.now()

// Better: timestamp + random
id: Date.now() + Math.random()

// Best: UUID or incrementing counter
id: crypto.randomUUID()
```

---

## Common Interview Questions

### Q1: Why check all circles after adding a new one?

**Answer:** When a new circle is added, it might collide with an existing blue circle, turning both red. But also, adding a circle doesn't change existing collision states—so we could optimize by only checking the new circle. However, for simplicity and correctness, rechecking all ensures consistent state.

### Q2: How would you optimize for thousands of circles?

**Answer:** Use spatial partitioning:

```javascript
// Quadtree: Divide space into quadrants
class Quadtree {
    constructor(bounds, capacity = 4) {
        this.bounds = bounds;
        this.capacity = capacity;
        this.circles = [];
        this.divided = false;
    }

    // Only check circles in nearby quadrants
    query(range) { /* ... */ }
}

// Grid-based: Divide into cells
const grid = new Map();  // cellKey -> circles[]
const cellSize = 100;    // Larger than max circle diameter

function getCellKey(x, y) {
    return `${Math.floor(x / cellSize)},${Math.floor(y / cellSize)}`;
}
```

### Q3: How would you implement draggable circles?

```javascript
const [dragging, setDragging] = useState(null);

const handleMouseDown = (circleId) => setDragging(circleId);

const handleMouseMove = (e) => {
    if (!dragging) return;

    const rect = containerRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    setCircles(prev => prev.map(c =>
        c.id === dragging ? { ...c, x, y } : c
    ));

    // Recalculate collisions
    recalculateCollisions();
};

const handleMouseUp = () => setDragging(null);
```

### Q4: How would you handle circles of different sizes?

```javascript
const handleClick = (e) => {
    const radius = Math.random() * 40 + 20;  // 20-60px

    const newCircle = {
        id: Date.now(),
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
        r: radius,  // Variable radius
        color: 'blue'
    };
    // ... collision detection works the same
};
```

### Q5: How would you implement circle removal on click?

```javascript
const handleCircleClick = (e, circleId) => {
    e.stopPropagation();  // Don't place new circle

    setCircles(prev => {
        const filtered = prev.filter(c => c.id !== circleId);
        // Recalculate: removed circle's partners may no longer collide
        return filtered.map(c => ({
            ...c,
            color: checkCollision(c, filtered) ? 'red' : 'blue'
        }));
    });
};
```

### Q6: How would you animate collision response?

```javascript
// Bounce circles apart on collision
function resolveCollision(c1, c2) {
    const dx = c2.x - c1.x;
    const dy = c2.y - c1.y;
    const distance = Math.sqrt(dx * dx + dy * dy);

    // Overlap amount
    const overlap = (c1.r + c2.r) - distance;

    // Normalize direction
    const nx = dx / distance;
    const ny = dy / distance;

    // Push apart
    c1.x -= nx * overlap / 2;
    c1.y -= ny * overlap / 2;
    c2.x += nx * overlap / 2;
    c2.y += ny * overlap / 2;
}
```

---

## Edge Cases to Consider

1. **Exact overlap** - Circles placed at same position
2. **Boundary circles** - Circle extends outside container
3. **Rapid clicks** - Multiple circles added quickly
4. **Chain collisions** - A collides with B, B collides with C
5. **Touch events** - Mobile support
6. **Circle removal** - Update collision state of remaining
7. **Large circles** - Radius larger than container
8. **Zero distance** - Division by zero in direction calculation

---

## Complexity Analysis

| Operation | Time | Space |
|-----------|------|-------|
| Add circle | O(n) | O(1) |
| Check single collision | O(1) | O(1) |
| Check all collisions | O(n²) | O(1) |
| Render | O(n) | O(n) |

Where n = number of circles

### Optimization with Spatial Partitioning

| Operation | Naive | Quadtree | Grid |
|-----------|-------|----------|------|
| Add | O(n) | O(log n) | O(1) |
| Check all | O(n²) | O(n log n) | O(n × k) |

Where k = average circles per cell

---

## Performance Optimizations

### 1. Early Exit on Collision

```javascript
for (let other of circles) {
    if (isColliding(circle, other)) {
        return true;  // Don't check remaining
    }
}
```

### 2. Skip Redundant Checks

```javascript
// Only check pairs once
for (let i = 0; i < circles.length; i++) {
    for (let j = i + 1; j < circles.length; j++) {  // j starts at i+1
        if (isColliding(circles[i], circles[j])) {
            circles[i].colliding = true;
            circles[j].colliding = true;
        }
    }
}
```

### 3. Squared Distance (Avoid sqrt)

```javascript
function isCollidingFast(c1, c2) {
    const dx = c1.x - c2.x;
    const dy = c1.y - c2.y;
    const distanceSquared = dx * dx + dy * dy;
    const radiusSum = c1.r + c2.r;
    return distanceSquared < radiusSum * radiusSum;  // No sqrt!
}
```

### 4. RequestAnimationFrame for Drag

```javascript
const handleMouseMove = (e) => {
    if (!dragging) return;

    requestAnimationFrame(() => {
        // Update position and check collisions
    });
};
```

---

## Real-World Applications

1. **Game Development** - Character collision, bullet detection
2. **Physics Engines** - Ball simulations, particle systems
3. **CAD Software** - Component overlap detection
4. **Map Applications** - Marker clustering, overlap prevention
5. **UI Libraries** - Tooltip/popover positioning
6. **Data Visualization** - Force-directed graphs, bubble charts

---

## Related Patterns

- **AABB Collision** - Axis-Aligned Bounding Box (rectangles)
- **Spatial Hashing** - Grid-based collision optimization
- **Quadtree** - Hierarchical spatial partitioning
- **Sweep and Prune** - Sorting-based broad phase
- **Physics Simulation** - Velocity, mass, bounce response
