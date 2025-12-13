# Traffic Light Simulator

## Problem Statement

Build a **Traffic Light** component that simulates a real traffic signal, automatically cycling through red, yellow, and green lights with appropriate timing.

## Requirements

### Core Features
1. Display three lights: Red, Yellow, Green
2. Only one light is active at a time
3. Lights cycle automatically: Red → Green → Yellow → Red
4. Each light has configurable duration
5. Visual indication of active vs inactive lights

### Timing Requirements
- **Red**: 4 seconds (longest - safety)
- **Yellow**: 0.9 seconds (brief warning)
- **Green**: 3 seconds (go!)

## Visual Representation

```
    ┌──────────┐
    │  ┌────┐  │
    │  │ 🔴 │  │  ← Red (4s)
    │  └────┘  │
    │  ┌────┐  │
    │  │ ⚫ │  │  ← Yellow (inactive)
    │  └────┘  │
    │  ┌────┐  │
    │  │ ⚫ │  │  ← Green (inactive)
    │  └────┘  │
    └──────────┘

         ↓ (after 4 seconds)

    ┌──────────┐
    │  ┌────┐  │
    │  │ ⚫ │  │  ← Red (inactive)
    │  └────┘  │
    │  ┌────┐  │
    │  │ ⚫ │  │  ← Yellow (inactive)
    │  └────┘  │
    │  ┌────┐  │
    │  │ 🟢 │  │  ← Green (3s)
    │  └────┘  │
    └──────────┘
```

## State Machine

Traffic lights follow a simple **state machine**:

```
    ┌─────────────────────────────────────┐
    │                                     │
    ▼                                     │
┌───────┐        ┌─────────┐        ┌─────┴───┐
│  RED  │───────▶│  GREEN  │───────▶│ YELLOW  │
└───────┘ 4000ms └─────────┘ 3000ms └─────────┘
                                      900ms
```

## Key Concepts & Intuition

### 1. Configuration-Driven Design

Instead of hardcoding logic, use a **config object** that defines each state:

```javascript
const LIGHTS_CONFIG = {
  red: {
    backgroundColor: "red",
    duration: 4000,
    next: "green"       // What comes next?
  },
  yellow: {
    backgroundColor: "yellow",
    duration: 900,
    next: "red"
  },
  green: {
    backgroundColor: "green",
    duration: 3000,
    next: "yellow"
  }
};
```

**Benefits:**
- Easy to modify timing
- Easy to add/remove lights
- Logic is declarative, not imperative
- Single source of truth

### 2. State Transitions with useEffect

The `useEffect` hook handles automatic transitions:

```javascript
const [activeLight, setActiveLight] = useState("red");

useEffect(() => {
  const currentConfig = LIGHTS_CONFIG[activeLight];

  // Schedule transition to next light
  const timer = setTimeout(() => {
    setActiveLight(currentConfig.next);
  }, currentConfig.duration);

  // Cleanup: cancel timer if light changes early
  return () => clearTimeout(timer);
}, [activeLight]);
```

**How it works:**
1. Effect runs when `activeLight` changes
2. Sets timeout for current light's duration
3. Timeout fires → updates to next light
4. State change triggers re-render
5. Effect runs again (goto step 2)
6. Infinite cycle!

### 3. Cleanup Function - Why It Matters

```javascript
return () => clearTimeout(timer);
```

**Without cleanup:**
- If component unmounts mid-cycle, timer still fires
- Tries to update state on unmounted component
- React warning: "Can't perform state update on unmounted component"

**With cleanup:**
- Timer is cancelled when effect re-runs or component unmounts
- No memory leaks or warnings

### 4. Dynamic Rendering with Config

```jsx
{Object.keys(LIGHTS_CONFIG).map((colorKey) => (
  <div
    key={colorKey}
    className="light"
    style={{
      backgroundColor: colorKey === activeLight
        ? LIGHTS_CONFIG[colorKey].backgroundColor
        : ""  // Inactive lights get no color
    }}
  />
))}
```

This approach:
- Renders lights from config (not hardcoded)
- Easy to add a 4th light if needed
- Consistent order from config keys

## Implementation Tips

### CSS for Traffic Light

```css
.traffic-light-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
  background-color: #333;      /* Dark housing */
  padding: 20px;
  border-radius: 10px;
  width: 60px;
  margin: 50px auto;
}

.light {
  width: 50px;
  height: 50px;
  border-radius: 50%;          /* Circular lights */
  transition: opacity 0.3s;    /* Smooth on/off */
  box-shadow: 0 0 10px rgba(0,0,0,0.5) inset;  /* 3D depth */
}
```

### Adding a "Glow" Effect for Active Light

```css
.light.active {
  box-shadow:
    0 0 20px currentColor,     /* Outer glow */
    0 0 40px currentColor,     /* Bigger glow */
    inset 0 0 10px rgba(255,255,255,0.5);  /* Inner shine */
}
```

## Common Interview Questions

1. **Why use setTimeout instead of setInterval?**
   - Each light has different duration
   - setTimeout with dynamic delay is simpler
   - setInterval would need complex duration tracking

2. **How would you pause/resume the traffic light?**
   ```javascript
   const [isPaused, setIsPaused] = useState(false);

   useEffect(() => {
     if (isPaused) return;  // Don't schedule if paused
     // ... rest of effect
   }, [activeLight, isPaused]);
   ```

3. **How to handle a "pedestrian crossing" button?**
   - Add intermediate state or interrupt logic
   - Force transition to red, hold for crossing duration
   - Resume normal cycle

4. **Why start with red?**
   - Safety: red is the safest default
   - Real traffic lights start with red

## Edge Cases to Handle

- [ ] Component unmount during transition
- [ ] Very fast duration changes (race conditions)
- [ ] Browser tab becomes inactive (timers may throttle)
- [ ] Accessibility: add ARIA labels for screen readers

## Potential Extensions

1. **Countdown timer** display for each light
2. **Pedestrian signal** (walk/don't walk)
3. **Emergency mode** (all red or flashing)
4. **Configurable durations** via props
5. **Multiple traffic lights** in sync
6. **Sound effects** for visually impaired

## Complexity Analysis

| Operation | Time | Space |
|-----------|------|-------|
| Render | O(1) | O(1) |
| State Transition | O(1) | O(1) |
| Timer Setup | O(1) | O(1) |

Extremely lightweight component!

## Key Insight

This pattern (config-driven state machine with useEffect) applies to many UI components:

- **Carousels/Slideshows**: auto-advance slides
- **Toast notifications**: auto-dismiss
- **Animation sequences**: timed transitions
- **Game timers**: countdown mechanics
- **Pomodoro timers**: work/break cycles

Master this pattern for any time-based UI behavior!
