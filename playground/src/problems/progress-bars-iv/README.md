# Progress Bars IV — Solution Notes

## Overview

This is a **JavaScript-controlled animation** problem requiring fine-grain state management and concurrency limiting.

## Key Design Decisions

### 1. State Model: Array of Percentages

```javascript
[0, 35, 60, 100, 20];
// Bar 1: 0% (empty)
// Bar 2: 35% (filling)
// Bar 3: 60% (filling)
// Bar 4: 100% (full)
// Bar 5: 20% (filling)
```

**Why not boolean flags?**

- Pause/resume requires preserving exact progress
- CSS transitions don't support pause mid-animation
- Need numeric values for incremental updates

### 2. Animation: setInterval (Not CSS Transitions)

**Why JavaScript over CSS?**

- CSS transitions can't be paused
- Need to update multiple bars independently
- Need exact control over which bars fill

**Math:**

```
Target: 0% → 100% in 2000ms
Interval: 10ms (100 ticks per second)
Increment: 0.5% per tick
Calculation: 0.5 * 200 ticks = 100% in 2000ms ✅
```

### 3. Concurrency: First 3 Non-Full Bars

**Algorithm:**

```javascript
// Every 10ms:
let barsUpdated = 0;
for (let i = 0; i < bars.length && barsUpdated < 3; i++) {
  if (bars[i] < 100) {
    bars[i] += 0.5; // increment
    barsUpdated++;
  }
}
```

**Why this works:**

- First 3 bars < 100% fill simultaneously
- When bar 1 hits 100%, loop skips it → bar 4 starts
- Automatic queue behavior (no complex queue data structure)

### 4. useRef for Timer ID

**Why useRef instead of useState?**

```javascript
const timerIdRef = useRef(null); // ✅ Correct

// ❌ Wrong:
const [timerId, setTimerId] = useState(null);
// Causes re-render every time we save timerId
```

**Benefits:**

- Persists across renders
- No re-render when updated
- Avoids stale closure issues

### 5. Callback Form of setState

**Problem: Stale Closure**

```javascript
// ❌ Wrong: captures stale progression
setInterval(() => {
  setProgression(progression.map(...))  // progression is STALE
}, 10)
```

**Solution: Callback Form**

```javascript
// ✅ Correct: gets latest progression
setInterval(() => {
  setProgression((current) => {
    return current.map(...)  // current is LATEST
  })
}, 10)
```

### 6. Immutability (No Direct Mutation)

**React best practice:**

```javascript
// ❌ Wrong: mutates state directly
progression[0] += 0.5;
setProgression(progression);

// ✅ Correct: clone first, then mutate
const newProgression = progression.slice(); // clone
newProgression[0] += 0.5;
setProgression(newProgression);
```

## Edge Cases Handled

| Scenario                        | Behavior                                       |
| ------------------------------- | ---------------------------------------------- |
| Click "Start" twice             | Only one interval runs (guard check)           |
| Click "Add" while paused        | Bar added, no animation starts                 |
| Click "Add" while running       | Bar added, starts filling when < 3 bars active |
| All bars full + "Add" + running | New bar fills immediately                      |
| Click "Reset" while running     | Stops animation, clears to [0]                 |
| Click "Pause" mid-animation     | Preserves exact progress (e.g., 37.5%)         |

## Complexity Analysis

### Time Complexity

- **Per tick**: O(n) where n = number of bars
  - Loop through bars to find first 3 non-full
  - Best case: O(3) = O(1) if first 3 bars are filling
  - Worst case: O(n) if all bars are full
- **Add bar**: O(1) — append to array
- **Reset**: O(1) — replace array

### Space Complexity

- **O(n)** — array stores n bar percentages
- Timer ID is O(1) constant

## Performance Considerations

### 60fps Target

- Update every 10ms = 100 ticks/sec
- Human eye perceives smooth motion at 60fps (16.67ms)
- 10ms < 16.67ms → buttery smooth animation ✅

### Memory

- Each bar = 1 number (8 bytes)
- 1000 bars = 8KB (negligible)

### CPU

- setInterval fires 100 times/sec
- Each tick: O(n) loop + O(n) state update
- For n=100 bars: 100 loops \* 100 ticks/sec = 10,000 ops/sec
- Modern JS engines handle this easily

## Common Pitfalls & How We Avoided Them

### Pitfall 1: Multiple Intervals Running

**Problem:** Clicking "Start" multiple times creates multiple intervals.

**Solution:**

```javascript
if (timerIdRef.current !== null) return; // Guard check
```

### Pitfall 2: Stale State in Closure

**Problem:** setInterval callback captures old progression value.

**Solution:** Use callback form of `setProgression((current) => ...)`.

### Pitfall 3: Mutating State Directly

**Problem:** React doesn't detect changes when you mutate arrays.

**Solution:** Clone first with `.slice()`, then mutate clone.

### Pitfall 4: Not Cleaning Up Interval

**Problem:** Interval keeps running after component unmounts → memory leak.

**Solution:** (Not shown in code, but in production):

```javascript
useEffect(() => {
  return () => {
    if (timerIdRef.current) clearInterval(timerIdRef.current);
  };
}, []);
```

### Pitfall 5: Precision Issues with Floats

**Problem:** 0.5 + 0.5 + ... might overshoot 100 due to floating point errors.

**Solution:**

```javascript
Math.min(progress + 0.5, 100); // Cap at 100
```

## Alternative Approaches

### Approach 1: CSS Animations + State Flags

**Pros:** Simpler code, browser-optimized.
**Cons:** Can't pause mid-animation, hard to sync multiple bars.

### Approach 2: requestAnimationFrame

**Pros:** Syncs with browser repaint (better performance).
**Cons:** More complex (need to track elapsed time manually).

### Approach 3: Separate Queues

**Pros:** Cleaner separation of "filling" vs "waiting" bars.
**Cons:** More complex state management, same result.

**Our choice (setInterval + find first 3):** Simplest code, easy to understand, meets all requirements.

## Interview Tips

### What to Explain

1. **Why JavaScript over CSS:** Need pause/resume control.
2. **Why useRef:** Avoid re-renders, persist across renders.
3. **Why callback form of setState:** Avoid stale closure.
4. **Concurrency limit:** Find first 3 non-full bars each tick.
5. **Math:** 0.5% \* 200 ticks = 100% in 2000ms.

### What to Avoid

- Don't mutate state directly (use `.slice()` first).
- Don't create multiple intervals (guard check).
- Don't forget to clear interval on unmount (memory leak).

### Follow-Up Questions You Might Get

**Q: How would you make the animation speed configurable?**
A: Extract constants (INTERVAL, INCREMENT) as props or state.

**Q: What if we want 5 concurrent bars instead of 3?**
A: Change `MAX_CONCURRENT_BARS` constant.

**Q: How would you add a "Remove" button?**
A: Filter out bar at index, pause animation if no bars left.

**Q: What if each bar had different durations?**
A: Store `{progress, duration}` objects instead of numbers, calculate increment per bar.

**Q: How would you optimize for 10,000 bars?**
A: Use a queue data structure (only track filling bars), not loop through all bars.

## Testing Checklist (Manual)

- [ ] Initial state: 1 empty bar, "Start" button
- [ ] Click "Start" → bar fills from 0% to 100% in ~2s
- [ ] Click "Add" 5 times → 6 bars total
- [ ] Click "Start" → first 3 bars fill together
- [ ] 4th bar starts after 3rd completes
- [ ] Click "Pause" mid-animation → progress preserved
- [ ] Click "Start" again → resumes from paused progress
- [ ] Click "Reset" → back to 1 empty bar, animation stops
- [ ] Add bar while paused → bar appears but doesn't fill
- [ ] All bars full + "Add" + "Start" → new bar fills immediately

## Time to Complete in Interview

- **Understanding:** 2-3 min
- **State design:** 3-5 min
- **Animation logic:** 5-8 min
- **UI + buttons:** 5-7 min
- **Testing + edge cases:** 5 min
- **Total:** ~20-30 min (with explanation)
