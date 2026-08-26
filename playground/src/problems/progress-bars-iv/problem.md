# Progress Bars IV - Understanding the Code

## What Are We Building?

Imagine you have multiple progress bars on the screen. When you click "Start", they should fill up gradually — but here's the twist: **only 3 bars can fill at the same time**. When one finishes, the next one in line starts filling.

Think of it like a checkout line at a store with 3 cashiers. When cashier 1 finishes with a customer, the next person in line moves up. That's exactly what we're doing here!

---

## The Big Challenge: Why Not Use CSS?

You might think: "Can't I just use CSS animations?"

```css
.bar {
  transition: width 2s ease;
}
```

**Problem:** CSS animations can't be paused! Once they start, they run to completion. But our requirement says we need a "Pause" button that freezes the bars at their current position and can resume later.

**Solution:** Use JavaScript to control the animation frame-by-frame using `setInterval`.

---

## Part 1: How Do We Store Progress?

### The State

```javascript
const [progression, setProgression] = useState([0])
```

This is an **array of numbers** where each number represents a bar's percentage (0 to 100).

**Example:**
```javascript
[0, 35.5, 60, 100, 20]
```
- Bar 1: 0% (hasn't started)
- Bar 2: 35.5% (halfway done)
- Bar 3: 60% (more than halfway)
- Bar 4: 100% (completely filled)
- Bar 5: 20% (just started)

**Why numbers instead of booleans?**

If we used booleans (`true`/`false`), we could only track "done" or "not done". But we need to know the **exact percentage** so we can pause at, say, 37.5% and resume from there.

---

## Part 2: The Animation Loop

### How do we animate?

We use `setInterval` to run a function **every 10 milliseconds**.

```javascript
setInterval(() => {
  // This runs 100 times per second!
  // Each time, we increment the bars by 0.5%
}, 10)
```

**The Math:**
- Target: Go from 0% → 100% in 2 seconds (2000ms)
- Interval: Run every 10ms
- How many times does it run? 2000ms ÷ 10ms = **200 times**
- Increment per run: 100% ÷ 200 = **0.5%**

So: 0.5% × 200 runs = 100% in 2000ms ✅

**Why 10ms?**
- Humans perceive smooth motion at 60 frames per second (fps)
- 60fps = 16.67ms per frame
- 10ms < 16.67ms → Looks buttery smooth! 🧈

---

## Part 3: The "3 at a Time" Rule

Here's the clever part. How do we make sure only 3 bars fill at once?

### The Algorithm

```javascript
let barsUpdated = 0  // Counter: how many bars did we update?

for (let i = 0; i < bars.length; i++) {
  if (barsUpdated >= 3) break  // Stop after 3 bars

  if (bars[i] < 100) {  // Is this bar not full?
    bars[i] += 0.5      // Increment it
    barsUpdated++       // Count it
  }
}
```

**Let's trace through an example:**

**Initial state:** `[0, 0, 0, 0, 0]` (5 empty bars)

**After Start (tick 1):**
```
Loop i=0: bars[0] = 0 → 0.5, barsUpdated = 1
Loop i=1: bars[1] = 0 → 0.5, barsUpdated = 2
Loop i=2: bars[2] = 0 → 0.5, barsUpdated = 3
Loop i=3: barsUpdated >= 3, STOP
Result: [0.5, 0.5, 0.5, 0, 0]
```

**After bar 0 reaches 100%:** `[100, 99, 98, 0, 0]`
```
Loop i=0: bars[0] = 100, skip it (already full)
Loop i=1: bars[1] = 99 → 99.5, barsUpdated = 1
Loop i=2: bars[2] = 98 → 98.5, barsUpdated = 2
Loop i=3: bars[3] = 0 → 0.5, barsUpdated = 3  ← Bar 4 starts!
Loop i=4: barsUpdated >= 3, STOP
Result: [100, 99.5, 98.5, 0.5, 0]
```

**See the magic?** We don't need a queue! Just loop from the start, skip full bars, and stop after 3 updates.

---

## Part 4: Why useRef for the Timer ID?

When we start the interval, JavaScript gives us an ID so we can stop it later.

```javascript
const timerId = setInterval(() => {...}, 10)
// timerId might be: 123

// Later, to stop it:
clearInterval(123)
```

**Question:** Should we store this ID in state?

```javascript
const [timerId, setTimerId] = useState(null)  // ❌ DON'T DO THIS
```

**Problem:** Every time we update `timerId`, React re-renders the component. That's wasteful!

**Solution:** Use `useRef` — it stores data that **persists across renders but doesn't trigger re-renders**.

```javascript
const timerIdRef = useRef(null)  // ✅ DO THIS

// Set it:
timerIdRef.current = setInterval(...)

// Read it:
clearInterval(timerIdRef.current)
```

Think of `useRef` as a "secret pocket" where you can store stuff without telling React.

---

## Part 5: The Stale Closure Problem (IMPORTANT!)

This is the trickiest part. Let's say you write this:

```javascript
const start = () => {
  setInterval(() => {
    const newProgression = progression.map(p => p + 0.5)
    setProgression(newProgression)
  }, 10)
}
```

**Problem:** The `progression` variable inside the interval is **frozen** at the moment you called `start()`. It never updates!

**Example:**
```
Initial: progression = [0]
You click Start
Interval starts, captures progression = [0]

Tick 1: progression = [0] → [0.5], setProgression([0.5])
Tick 2: progression is STILL [0] in the closure! → [0.5] again
Tick 3: progression is STILL [0]! → [0.5] again
```

The bar is stuck at 0.5% forever! 😱

**Solution: Callback Form of setState**

```javascript
setProgression((currentProgression) => {
  // React gives you the LATEST value here!
  return currentProgression.map(p => p + 0.5)
})
```

Now React gives us the **most recent value** every time, so the animation works correctly.

---

## Part 6: Why Clone the Array?

React uses something called **reference equality** to detect changes.

```javascript
const arr = [1, 2, 3]
arr[0] = 999
setProgression(arr)  // ❌ React says: "Same array reference, no change!"
```

**React only re-renders if the reference changes.**

**Solution: Clone first, then mutate**

```javascript
const newArr = arr.slice()  // Create a copy
newArr[0] = 999
setProgression(newArr)      // ✅ New reference, React re-renders!
```

**Analogy:** Imagine your teacher checks homework by looking at the notebook cover. If it's the same notebook, they assume nothing changed. But if you give them a new notebook (even with similar content), they'll check inside!

---

## Button Handlers Explained

### 1. Start Button

```javascript
const start = () => {
  // Guard: Prevent multiple intervals
  if (timerIdRef.current !== null) return

  setIsRunning(true)

  timerIdRef.current = setInterval(() => {
    setProgression((current) => {
      const copy = current.slice()  // Clone
      let updated = 0

      for (let i = 0; i < copy.length && updated < 3; i++) {
        if (copy[i] < 100) {
          copy[i] = Math.min(copy[i] + 0.5, 100)  // Increment, cap at 100
          updated++
        }
      }

      return copy  // Return new array
    })
  }, 10)
}
```

**Step-by-step:**
1. Check if interval already running → if yes, do nothing
2. Save the interval ID in `timerIdRef`
3. Every 10ms:
   - Clone the array (for React to detect change)
   - Find first 3 non-full bars
   - Increment each by 0.5%
   - Cap at 100 (use `Math.min` to prevent 100.5%)
   - Return new array → triggers re-render

### 2. Pause Button

```javascript
const pause = () => {
  clearInterval(timerIdRef.current)  // Stop the interval
  timerIdRef.current = null          // Clear the ID
  setIsRunning(false)
}
```

Simple! Just stop the timer. The current percentages are preserved in state.

### 3. Add Button

```javascript
const addBar = () => {
  setProgression((current) => current.concat(0))
}
```

Append a new bar at 0%. If the animation is running and there are < 3 active bars, it will start filling automatically on the next tick!

### 4. Reset Button

```javascript
const reset = () => {
  pause()               // Stop animation first
  setProgression([0])   // Reset to one empty bar
}
```

---

## Common Mistakes (Learn from These!)

### ❌ Mistake 1: Mutating State Directly

```javascript
progression[0] += 0.5
setProgression(progression)  // React won't detect this!
```

**Why it fails:** Same array reference.

**Fix:** Clone first!
```javascript
const copy = progression.slice()
copy[0] += 0.5
setProgression(copy)
```

---

### ❌ Mistake 2: Forgetting the Guard Check

```javascript
const start = () => {
  setInterval(...)  // No guard!
}
```

If you click "Start" 5 times, you'll have **5 intervals running**, making bars fill 5× faster!

**Fix:** Add guard check:
```javascript
if (timerIdRef.current !== null) return
```

---

### ❌ Mistake 3: Not Capping at 100

```javascript
bars[i] += 0.5  // Could go 100, 100.5, 101, 101.5...
```

Floating point math isn't perfect. Use `Math.min` to cap:
```javascript
bars[i] = Math.min(bars[i] + 0.5, 100)
```

---

### ❌ Mistake 4: Using setTimeout Instead of setInterval

```javascript
setTimeout(() => { ... }, 10)  // Runs ONCE
```

`setTimeout` runs once. `setInterval` runs repeatedly. Big difference!

---

## Mental Model: The Factory Analogy

Imagine a factory with **3 workers** on an assembly line:

- **Workers** = The 3 concurrent slots
- **Boxes** = The progress bars
- **Filling a box** = Incrementing from 0% → 100%

**Rules:**
1. Workers always work on the first 3 unfilled boxes from the left
2. When a worker finishes a box (100%), they move to the next unfilled box
3. "Pause" = Workers freeze, remember their position
4. "Resume" = Workers continue from where they stopped

---

## Try It Yourself (Exercises)

Play with the component above and observe:

1. **Click Start** → First 3 bars fill together
2. **Click Add 5 times** → Bars 4 and 5 wait in line
3. **Click Pause at 50%** → Notice exact percentages are preserved
4. **Click Start again** → Bars resume from 50%, not restart from 0!
5. **Let all bars fill** → Click Add → New bar starts immediately (slot available)

---

## Key Takeaways

✅ **State = Array of percentages** (so we can pause/resume)
✅ **setInterval every 10ms** (smooth 60fps animation)
✅ **Loop from start, stop after 3** (auto-queue behavior)
✅ **useRef for timer ID** (no unnecessary re-renders)
✅ **Callback setState** (avoid stale closure)
✅ **Clone before mutate** (React detects changes)

---

## Still Confused? Let's Debug Together!

**Q: Why is my bar stuck at 0.5%?**
A: You forgot the callback form of `setState`. The closure captured old state.

**Q: Why do bars fill 10× faster after I click Start multiple times?**
A: You forgot the guard check. Multiple intervals are running.

**Q: Why doesn't React re-render after I change `progression[0]`?**
A: You mutated the array directly. React checks references, not contents.

---

**Now scroll up and play with the component!** Click the buttons, watch the bars, and see the concepts in action. 🚀
