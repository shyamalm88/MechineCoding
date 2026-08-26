# Grid Lights - Understanding the Code

## What Are We Building?

Imagine a 3×3 grid of light switches (but the center one is missing!). When you click a light, it turns green. Once ALL lights are green, they automatically turn off one by one in **reverse order** - like rewinding a video!

Think of it like this: You're turning on Christmas lights, and once they're all on, they turn off in the reverse order you turned them on, creating a satisfying "undo" animation.

---

## The Problem Statement

Build a 3×3 grid of cells (8 cells total, center is omitted):

```
[ ] [ ] [ ]
[ ] [X] [ ]    X = center (omitted)
[ ] [ ] [ ]
```

**Requirements:**
1. Click a cell → it turns green (activated)
2. Once ALL cells are green → they deactivate in **reverse order**
3. Deactivation has a **300ms delay** between each cell
4. You cannot click cells during deactivation animation

---

## Visual Example

**Step 1:** User clicks cells in this order:
```
[1] [2] [3]
[4] [X] [5]
[6] [7] [8]
```

**Step 2:** All cells are green!

**Step 3:** Auto-deactivation (reverse order with 300ms delay):
```
Turn off 8 → wait 300ms
Turn off 7 → wait 300ms
Turn off 6 → wait 300ms
Turn off 5 → wait 300ms
Turn off 4 → wait 300ms
Turn off 3 → wait 300ms
Turn off 2 → wait 300ms
Turn off 1 → done!
```

---

## The Challenge: State Management

### Challenge 1: How Do We Track Click Order?

**Wrong Approach:**
```javascript
const [activated, setActivated] = useState({
  0: false, 1: false, 2: false,
  3: false, /* skip 4 */, 5: false,
  6: false, 7: false, 8: false
})
```

**Problem:** This tells us WHICH cells are active, but not the ORDER they were clicked!

**Correct Approach:**
```javascript
const [activationOrder, setActivationOrder] = useState([])
// Example: [0, 3, 7, 1, ...] means cell 0 was clicked first, then 3, then 7, etc.
```

---

## Key Concepts Explained

### 1. Grid Indexing (Omitting Center)

A 3×3 grid has 9 positions (0-8):
```
[0] [1] [2]
[3] [4] [5]
[6] [7] [8]
```

But we omit index 4 (center), so valid cells are: `[0, 1, 2, 3, 5, 6, 7, 8]`

**How to check if a cell is the center:**
```javascript
const isCenter = (index) => index === 4
```

---

### 2. Tracking Activation Order

We use an **array** to store the order:

```javascript
const [activationOrder, setActivationOrder] = useState([])

// User clicks cell 0 → [0]
// User clicks cell 7 → [0, 7]
// User clicks cell 3 → [0, 7, 3]
```

**Why an array?**
- Preserves order (objects don't)
- Easy to check: "Is cell 5 activated?" → `activationOrder.includes(5)`
- Easy to reverse: `[...activationOrder].reverse()`

---

### 3. The Deactivation Animation

Once all 8 cells are activated, we need to:
1. Reverse the order: `[0, 7, 3, 1, 5, 2, 8, 6]` → `[6, 8, 2, 5, 1, 3, 7, 0]`
2. Remove one cell every 300ms

**Using setTimeout:**
```javascript
const deactivate = () => {
  const reversed = [...activationOrder].reverse()

  reversed.forEach((cellIndex, i) => {
    setTimeout(() => {
      // Remove this cell from activationOrder
      setActivationOrder(current => current.filter(idx => idx !== cellIndex))
    }, i * 300)  // 0ms, 300ms, 600ms, 900ms, ...
  })
}
```

**The Math:**
- Cell at position 0 in reversed array: `i = 0` → `0 * 300 = 0ms` (immediate)
- Cell at position 1: `i = 1` → `1 * 300 = 300ms`
- Cell at position 2: `i = 2` → `2 * 300 = 600ms`
- ...and so on

---

### 4. Preventing Clicks During Animation

**Problem:** User might click during deactivation, breaking the animation!

**Solution:** Track animation state

```javascript
const [isDeactivating, setIsDeactivating] = useState(false)

const handleCellClick = (index) => {
  if (isDeactivating) return  // ✅ Block clicks during animation

  // ... rest of logic
}
```

---

## The Algorithm (Step-by-Step)

### Step 1: Render the Grid

```javascript
const grid = [0, 1, 2, 3, 4, 5, 6, 7, 8]

return (
  <div className="grid">
    {grid.map(index => {
      if (index === 4) {
        return <div key={index} className="empty-cell" />  // Center is empty
      }

      const isActive = activationOrder.includes(index)

      return (
        <div
          key={index}
          className={`cell ${isActive ? 'active' : ''}`}
          onClick={() => handleCellClick(index)}
        />
      )
    })}
  </div>
)
```

---

### Step 2: Handle Cell Clicks

```javascript
const handleCellClick = (index) => {
  // Guard: Don't allow clicks during animation
  if (isDeactivating) return

  // Guard: Cell is already activated
  if (activationOrder.includes(index)) return

  // Add cell to activation order
  const newOrder = [...activationOrder, index]
  setActivationOrder(newOrder)

  // Check if all cells are now activated
  if (newOrder.length === 8) {  // 8 cells (excluding center)
    startDeactivation(newOrder)
  }
}
```

---

### Step 3: Deactivation Animation

```javascript
const startDeactivation = (order) => {
  setIsDeactivating(true)

  const reversed = [...order].reverse()

  reversed.forEach((cellIndex, i) => {
    setTimeout(() => {
      setActivationOrder(current =>
        current.filter(idx => idx !== cellIndex)
      )

      // If this is the last cell, re-enable clicks
      if (i === reversed.length - 1) {
        setIsDeactivating(false)
      }
    }, i * 300)
  })
}
```

---

## Edge Cases to Handle

### Edge Case 1: User Clicks Same Cell Twice

**Problem:** Cell gets added to array twice!

**Solution:** Check before adding
```javascript
if (activationOrder.includes(index)) return  // Already activated
```

---

### Edge Case 2: User Clicks During Deactivation

**Problem:** Animation breaks, order gets messed up

**Solution:** Block all clicks
```javascript
if (isDeactivating) return  // Animation in progress
```

---

### Edge Case 3: User Clicks Center Cell

**Problem:** Center should not be clickable!

**Solution:** Don't render a clickable cell there
```javascript
if (index === 4) {
  return <div key={index} />  // Not clickable
}
```

---

## Common Mistakes (Learn from These!)

### ❌ Mistake 1: Using Object for State

```javascript
// ❌ WRONG: Loses order information
const [cells, setCells] = useState({
  0: false, 1: false, ...
})
```

**Why it fails:** You can't tell which cell was clicked first!

**Fix:** Use an array to track order:
```javascript
const [activationOrder, setActivationOrder] = useState([])
```

---

### ❌ Mistake 2: Not Blocking Clicks During Animation

```javascript
const handleCellClick = (index) => {
  // ❌ Missing guard!
  setActivationOrder([...activationOrder, index])
}
```

**Result:** User can click during deactivation → chaos!

**Fix:**
```javascript
if (isDeactivating) return
```

---

### ❌ Mistake 3: Wrong setTimeout Logic

```javascript
// ❌ WRONG: All setTimeout calls use same 'i'
for (let i = 0; i < reversed.length; i++) {
  setTimeout(() => {
    deactivate(reversed[i])  // 'i' is always the last value!
  }, i * 300)
}
```

**Why it fails:** JavaScript closures! `i` is the same variable.

**Fix:** Use `forEach` or pass `i` correctly:
```javascript
reversed.forEach((cell, i) => {
  setTimeout(() => deactivate(cell), i * 300)
})
```

---

### ❌ Mistake 4: Forgetting to Re-enable Clicks

```javascript
const startDeactivation = () => {
  setIsDeactivating(true)
  // ... animation ...
  // ❌ Forgot to set back to false!
}
```

**Result:** After animation, all clicks are permanently blocked!

**Fix:** Set `isDeactivating` back to `false` when done.

---

## Complexity Analysis

### Time Complexity
- **Rendering grid:** O(9) = O(1) (constant 9 cells)
- **Click handler:** O(n) where n = cells activated (check if includes)
- **Deactivation:** O(n) where n = 8 cells
- **Overall:** O(n) but n is constant (8), so effectively **O(1)**

### Space Complexity
- **activationOrder array:** O(n) where n ≤ 8
- **Timers:** O(n) for setTimeout references
- **Overall:** O(n) but n ≤ 8, so effectively **O(1)**

---

## Interview Tips

### What to Explain

1. **Why use an array for state?** Order matters!
2. **Why block clicks during animation?** Prevent race conditions
3. **How setTimeout works with forEach:** Each iteration gets its own closure
4. **Why filter instead of pop?** Safer state update (immutable)

### What Interviewers Look For

- Do you handle edge cases? (same cell clicked twice, center cell, clicks during animation)
- Do you explain your state management choice?
- Do you test the animation visually?
- Do you write clean, readable code?

### Follow-Up Questions You Might Get

**Q: What if grid is 5×5 instead of 3×3?**
A: Same logic, just change the grid size and omit center index calculation: `Math.floor(size * size / 2)`

**Q: What if we want different delay (not 300ms)?**
A: Extract as a constant or prop: `const DEACTIVATION_DELAY = 300`

**Q: What if user wants to reset manually?**
A: Add a "Reset" button: `onClick={() => setActivationOrder([])}`

**Q: How would you test this?**
A:
1. Click all cells → verify all turn green
2. Wait for animation → verify reverse order
3. Try clicking during animation → verify blocked
4. Click same cell twice → verify no duplicate

---

## Key Takeaways

✅ **Use array for order tracking** (not object)
✅ **Block interactions during animation** (guard clauses)
✅ **setTimeout with forEach** for staggered animations
✅ **Immutable state updates** (filter, spread operator)
✅ **Handle edge cases** (duplicate clicks, animation state)

---

**Now play with the interactive component above!** Try clicking cells in different orders and watch the reverse animation. Notice how it always deactivates in the exact reverse order you clicked them! 🎨
