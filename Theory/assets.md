# Asset Loading & Optimization: A Senior Engineer's Guide

A comprehensive guide to script loading, resource hints, and performance optimization for system design interviews.

---

## 1. Script Loading: async vs defer

This is the most fundamental optimization for the **Critical Rendering Path (CRP)**.

### How the Browser Works

Browsers use a **"Preload Scanner"** to find URLs in your HTML and start downloads as soon as possible. But the `async` and `defer` attributes dictate **when** the JavaScript engine is allowed to actually run that code.

### The Three Modes

```html
<!-- Blocks everything -->
<script src="app.js"></script>

<!-- Downloads in parallel, executes immediately when ready -->
<script src="analytics.js" async></script>

<!-- Downloads in parallel, executes after DOM is ready, in order -->
<script src="main.js" defer></script>
```

---

## 2. The `defer` Attribute: Order is King

If you have multiple script tags with `defer`, they behave like a well-drilled team.

| Phase | Behavior |
|-------|----------|
| **Downloading** | All scripts download in parallel immediately upon discovery |
| **Execution Order** | Execute in exact order they appear in HTML (top to bottom) |
| **Timing** | Wait until HTML parser has completely finished building the DOM |

### Why Name/Size Doesn't Matter

```html
<script src="script_A.js" defer></script>  <!-- 2MB, takes 2 seconds -->
<script src="script_B.js" defer></script>  <!-- 1KB, takes 10ms -->
```

Even if `script_B.js` finishes downloading in 10ms while `script_A.js` takes 2 seconds, the browser **waits** for `script_A.js` to finish and executes it **first**.

**Use for:** Main application logic where DOM must be ready and order matters.

---

## 3. The `async` Attribute: The "Race"

If you have multiple scripts with `async`, it's a **"first-come, first-served" race**.

| Phase | Behavior |
|-------|----------|
| **Downloading** | All scripts download in parallel (like defer) |
| **Execution Order** | Execute in order they **finish downloading** |
| **Timing** | Immediately when download completes (pauses HTML parser) |

### Non-Deterministic Behavior

```html
<script src="script_A.js" async></script>  <!-- 2MB -->
<script src="script_B.js" async></script>  <!-- 1KB -->
```

If `script_B.js` finishes first (smaller file), it executes first—**regardless of HTML order**.

**Use for:** Independent scripts like analytics, ads, or tracking that don't depend on DOM or each other.

---

## 4. Comparison Summary

| Attribute | Download | Execution Order | Blocks HTML Parser? |
|-----------|----------|-----------------|---------------------|
| **None** | Immediate | Document Order | Yes (blocks both download & execution) |
| **defer** | Parallel | Document Order | No (executes after parsing) |
| **async** | Parallel | Download Order | Yes (only during execution) |

---

## 5. Resource Hints: Managing the Browser's "Wishlist"

As a system designer, you use these to override the browser's default discovery process.

### preload vs prefetch

| Hint | Priority | Purpose |
|------|----------|---------|
| **preload** | High | Resources the **current page** needs (LCP hero image, critical font) |
| **prefetch** | Low | Resources the **next page** might need |

```html
<!-- Current page needs this font NOW -->
<link rel="preload" href="/fonts/main.woff2" as="font" crossorigin>

<!-- User might click "About" next -->
<link rel="prefetch" href="/about.js">
```

### preconnect vs dns-prefetch

| Hint | What It Does | Cost |
|------|--------------|------|
| **dns-prefetch** | Resolves IP address only | Very cheap |
| **preconnect** | DNS + TCP handshake + TLS negotiation | ~200-500ms saved on first request |

```html
<!-- Just resolve the IP (cheap) -->
<link rel="dns-prefetch" href="https://fonts.googleapis.com">

<!-- Full connection setup (use for critical origins only) -->
<link rel="preconnect" href="https://api.example.com">
```

**Warning:** Don't use preconnect for more than 2-3 key origins, or you'll waste CPU and battery.

---

## 6. The `async defer` Combo

You may see this pattern:

```html
<script src="app.js" async defer></script>
```

**The Logic:**
- Modern browsers see `async` and **ignore** `defer`
- Very old browsers (IE9) that don't support `async` will see `defer` and use that instead
- It's a **fallback pattern** for legacy browser support

---

## 7. Tree Shaking & The `sideEffects` Flag

Tree shaking isn't just "deleting code"—it's a **static analysis process**.

### How It Works

```
1. Bundler builds a dependency graph
2. If a function is exported but never imported → "dead code"
3. Dead code is removed during minification
```

### The `sideEffects: false` Trap

JavaScript is highly dynamic. If a file modifies a global variable or adds a polyfill, the bundler is afraid to remove it.

```json
// package.json
{
  "sideEffects": false  // "I guarantee no side effects"
}
```

**Warning:** If you have a file that just imports CSS:

```js
import './styles.css';  // No JS export!
```

With `sideEffects: false`, the bundler might **delete your CSS** because it doesn't see a JavaScript export being used.

**Fix:**
```json
{
  "sideEffects": ["*.css", "*.scss"]
}
```

---

## 8. INP: The Evolution of Responsiveness

**Interaction to Next Paint (INP)** has replaced FID as a Core Web Vital.

| Metric | What It Measures | Problem |
|--------|------------------|---------|
| **FID (Old)** | Delay of the **first** click only | Easy to cheat by making first 5 seconds fast |
| **INP (New)** | Latency of **every** interaction, reports the worst | Measures real user experience |

### The "Long Task" Problem

If a user clicks a button and your JavaScript takes 200ms to run, the browser can't "paint" the button's "clicked" state until that code finishes.

### Architectural Fix: Yield Points

Break up heavy logic to let the browser "breathe":

```js
// Bad - blocks for 200ms
function processData(items) {
  items.forEach(item => heavyComputation(item));
}

// Good - yields control back to browser
async function processData(items) {
  for (const item of items) {
    heavyComputation(item);

    // Let browser paint a frame
    await scheduler.yield?.() ||
          new Promise(r => setTimeout(r, 0));
  }
}
```

---

## 9. HTTP/2 and Chunking Strategy

### The Old Days (HTTP/1.1)

- Browsers could only open **6 connections** at once
- We used "CSS Sprites" and "Bundling" to minimize requests

### Modern Strategy (HTTP/2)

- **Multiplexing:** Send hundreds of small files over one connection
- **Granular Chunking:** Smaller, more frequent chunks

| Strategy | On Code Change | User Downloads |
|----------|----------------|----------------|
| One 2MB bundle | Change 1 line | Re-download 2MB |
| Granular chunks | Change 1 line | Re-download 50KB chunk |

---

## 10. Interview Tip

> "For script loading, I default to `defer` for application code since it maintains execution order and doesn't block parsing. I use `async` only for independent third-party scripts like analytics. For critical resources hidden from the parser (fonts in CSS, hero images), I use `preload`. And I always `preconnect` to my API origin to save the connection setup time on the first data fetch."
