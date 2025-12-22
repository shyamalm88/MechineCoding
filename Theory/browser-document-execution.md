# How the Browser Executes a Document: A Senior Engineer's Guide

A comprehensive guide to browser document execution for system design interviews.

---

## 1. The Complete Journey: URL to Pixels

```
┌─────────────────────────────────────────────────────────────┐
│                    URL TO PIXELS                             │
│                                                              │
│  1. Navigation ──▶ DNS ──▶ TCP ──▶ TLS ──▶ HTTP Request     │
│                                                              │
│  2. Response ──▶ Parsing ──▶ DOM/CSSOM Construction         │
│                                                              │
│  3. Render Tree ──▶ Layout ──▶ Paint ──▶ Composite          │
│                                                              │
│  4. JavaScript Execution (can interrupt at multiple points) │
└─────────────────────────────────────────────────────────────┘
```

---

## 2. Phase 1: Navigation & Network

### DNS Resolution

```
┌─────────────────────────────────────────────────────────────┐
│  DNS LOOKUP (typically 20-120ms)                             │
│                                                              │
│  1. Browser DNS cache                                        │
│  2. OS DNS cache                                             │
│  3. Router cache                                             │
│  4. ISP DNS resolver                                         │
│  5. Root nameserver → TLD → Authoritative                    │
│                                                              │
│  Result: example.com → 93.184.216.34                         │
└─────────────────────────────────────────────────────────────┘
```

### TCP Connection (3-Way Handshake)

```
Client                         Server
   │                              │
   │──────── SYN ────────────────▶│  Seq=100
   │                              │
   │◀─────── SYN-ACK ─────────────│  Seq=300, Ack=101
   │                              │
   │──────── ACK ────────────────▶│  Seq=101, Ack=301
   │                              │
   │       Connection Open        │

Time: ~1 RTT (Round Trip Time)
```

### TLS Handshake (HTTPS)

```
Client                           Server
   │                               │
   │─── ClientHello ──────────────▶│
   │    (supported ciphers,        │
   │     random number)            │
   │                               │
   │◀── ServerHello + Cert ────────│
   │    (chosen cipher, cert,      │
   │     random number)            │
   │                               │
   │    [Client verifies cert]     │
   │                               │
   │─── Key Exchange + Finished ──▶│
   │    (pre-master secret)        │
   │                               │
   │◀── Finished ──────────────────│
   │                               │
   │    Encrypted Connection       │

Time: ~2 RTT (TLS 1.2) or ~1 RTT (TLS 1.3)
```

### HTTP Request/Response

```
GET /index.html HTTP/1.1
Host: example.com
Accept: text/html
Accept-Encoding: gzip, br
Connection: keep-alive

──────────────────────────────────

HTTP/1.1 200 OK
Content-Type: text/html; charset=utf-8
Content-Encoding: gzip
Cache-Control: max-age=3600
Content-Length: 12345

<!DOCTYPE html>...
```

---

## 3. Phase 2: Parsing & Tree Construction

### HTML Parsing

The browser converts HTML bytes into a **DOM tree**.

```
Bytes ──▶ Characters ──▶ Tokens ──▶ Nodes ──▶ DOM

HTML:
<!DOCTYPE html>
<html>
  <head>
    <title>Page</title>
  </head>
  <body>
    <h1>Hello</h1>
    <p>World</p>
  </body>
</html>

DOM Tree:
Document
└── html
    ├── head
    │   └── title
    │       └── "Page"
    └── body
        ├── h1
        │   └── "Hello"
        └── p
            └── "World"
```

### The Preload Scanner

```
┌─────────────────────────────────────────────────────────────┐
│  PRELOAD SCANNER (Speculative Parser)                        │
│                                                              │
│  While main parser is blocked by JavaScript:                 │
│                                                              │
│  1. Scans ahead in HTML                                      │
│  2. Finds <link>, <script src>, <img>                        │
│  3. Starts downloading them in parallel                      │
│                                                              │
│  This is why resources start loading before parser           │
│  reaches them!                                               │
└─────────────────────────────────────────────────────────────┘
```

### CSS Parsing (CSSOM)

```
CSS:
body { margin: 0; }
h1 { color: blue; font-size: 24px; }
p { color: gray; }

CSSOM Tree:
StyleSheet
├── Rule: body
│   └── margin: 0
├── Rule: h1
│   ├── color: blue
│   └── font-size: 24px
└── Rule: p
    └── color: gray
```

### Parser Blocking

```
┌─────────────────────────────────────────────────────────────┐
│  PARSER BLOCKING BEHAVIOR                                    │
│                                                              │
│  CSS:                                                        │
│  └── Blocks rendering (not parsing)                         │
│  └── Must complete before JS can execute                    │
│                                                              │
│  JavaScript (no async/defer):                                │
│  └── Blocks parsing completely                              │
│  └── Waits for CSSOM to complete first                      │
│                                                              │
│  JavaScript (async):                                         │
│  └── Downloads parallel                                      │
│  └── Executes immediately when ready (blocks briefly)       │
│                                                              │
│  JavaScript (defer):                                         │
│  └── Downloads parallel                                      │
│  └── Executes after DOM complete, in order                  │
└─────────────────────────────────────────────────────────────┘
```

```
Timeline Example:

     HTML Parsing
     ├────────────────────────────────────────────────────▶

     CSS Download/Parse
     ├───────────┤

     JS Download (async)
     ├─────────────────┤
                       ↓
                 JS Executes (blocks briefly)
                       ├──┤

     JS Download (defer)
     ├─────────────────────────────┤
                                          ↓
                                    JS Executes (after DOM)
                                          ├──────┤
```

---

## 4. Phase 3: Rendering Pipeline

### Step 1: Render Tree Construction

```
DOM + CSSOM = Render Tree

DOM:                    CSSOM:                 Render Tree:
├── html                ├── html {...}         ├── html
│   ├── head            │   ├── head           │   └── body
│   │   └── title       │   │   └── title      │       ├── h1 (visible)
│   └── body            │   └── body           │       │   └── "Hello"
│       ├── h1          │       ├── h1 {...}   │       └── p (visible)
│       │   └── "Hello" │       └── p {...}    │           └── "World"
│       └── p           │
│           └── "World" │
│       └── script      │   (head, script, display:none excluded)
```

**Excluded from Render Tree:**
- `<head>`, `<script>`, `<meta>` (non-visual)
- Elements with `display: none`
- Elements with `visibility: hidden` ARE included (they affect layout)

### Step 2: Layout (Reflow)

```
┌─────────────────────────────────────────────────────────────┐
│  LAYOUT CALCULATION                                          │
│                                                              │
│  For each node in Render Tree:                               │
│  1. Calculate computed styles                                │
│  2. Determine box model (width, height, margin, padding)     │
│  3. Calculate position (x, y coordinates)                    │
│  4. Handle overflow, floats, positioning                     │
│                                                              │
│  Result: Box tree with exact pixel positions                 │
│                                                              │
│  ┌─────────────────────────────────────────┐                │
│  │ body (0, 0) 1200×800                    │                │
│  │  ┌─────────────────────────────────────┐│                │
│  │  │ h1 (0, 0) 1200×32                   ││                │
│  │  └─────────────────────────────────────┘│                │
│  │  ┌─────────────────────────────────────┐│                │
│  │  │ p (0, 40) 1200×24                   ││                │
│  │  └─────────────────────────────────────┘│                │
│  └─────────────────────────────────────────┘                │
└─────────────────────────────────────────────────────────────┘
```

### Step 3: Paint

```
┌─────────────────────────────────────────────────────────────┐
│  PAINT OPERATIONS                                            │
│                                                              │
│  Convert layout boxes into actual pixels:                    │
│                                                              │
│  1. Background colors                                        │
│  2. Background images                                        │
│  3. Borders                                                  │
│  4. Text                                                     │
│  5. Shadows                                                  │
│  6. Outlines                                                 │
│                                                              │
│  Result: Paint records (list of draw commands)               │
└─────────────────────────────────────────────────────────────┘
```

### Step 4: Composite

```
┌─────────────────────────────────────────────────────────────┐
│  COMPOSITING LAYERS                                          │
│                                                              │
│  Elements promoted to own layer:                             │
│  ├── position: fixed/sticky                                  │
│  ├── transform (3D)                                          │
│  ├── opacity < 1                                             │
│  ├── will-change: transform                                  │
│  ├── <video>, <canvas>                                       │
│  └── CSS filters                                             │
│                                                              │
│  ┌─────────────────────────────────────────┐                │
│  │            Layer 3 (fixed nav)          │                │
│  │  ┌──────────────────────────────────┐   │                │
│  │  │        Layer 2 (modal)           │   │                │
│  │  │  ┌───────────────────────────┐   │   │                │
│  │  │  │    Layer 1 (main content) │   │   │                │
│  │  │  └───────────────────────────┘   │   │                │
│  │  └──────────────────────────────────┘   │                │
│  └─────────────────────────────────────────┘                │
│                                                              │
│  GPU composites layers together                              │
└─────────────────────────────────────────────────────────────┘
```

---

## 5. Reflow vs Repaint

### What Triggers Each

```
┌─────────────────────────────────────────────────────────────┐
│  REFLOW (Layout)                                             │
│  Changes that affect geometry                                │
│                                                              │
│  Triggers:                                                   │
│  ├── width, height, padding, margin, border                  │
│  ├── position, top, left, right, bottom                     │
│  ├── display, float, clear                                   │
│  ├── font-size, font-family, font-weight                     │
│  ├── Adding/removing DOM elements                            │
│  ├── Resizing window                                         │
│  └── Reading layout properties (offsetWidth, etc.)           │
│                                                              │
│  Cost: HIGH (recalculates entire tree or subtree)            │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│  REPAINT                                                     │
│  Changes that affect appearance only                         │
│                                                              │
│  Triggers:                                                   │
│  ├── color, background-color                                 │
│  ├── visibility                                              │
│  ├── box-shadow                                              │
│  └── outline                                                 │
│                                                              │
│  Cost: MEDIUM (redraw affected pixels)                       │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│  COMPOSITE ONLY                                              │
│  Changes handled by GPU                                      │
│                                                              │
│  Properties:                                                 │
│  ├── transform                                               │
│  ├── opacity                                                 │
│  └── filter (with GPU acceleration)                          │
│                                                              │
│  Cost: LOW (GPU handles it, no main thread work)             │
└─────────────────────────────────────────────────────────────┘
```

### Layout Thrashing

```js
// ❌ BAD - Forces synchronous layout on each iteration
elements.forEach(el => {
  const width = el.offsetWidth;      // READ - forces layout
  el.style.width = width + 10 + 'px'; // WRITE - invalidates layout
  // Next iteration: READ forces new layout calculation
});

// ✅ GOOD - Batch reads, then batch writes
const widths = elements.map(el => el.offsetWidth);  // All READs
elements.forEach((el, i) => {
  el.style.width = widths[i] + 10 + 'px';           // All WRITEs
});
```

```js
// ✅ BETTER - Use requestAnimationFrame
function animate() {
  // Batch DOM reads
  const measurements = elements.map(el => el.getBoundingClientRect());

  // Schedule writes for next frame
  requestAnimationFrame(() => {
    elements.forEach((el, i) => {
      el.style.transform = `translateX(${measurements[i].width}px)`;
    });
  });
}
```

---

## 6. JavaScript Execution

### The Event Loop

```
┌─────────────────────────────────────────────────────────────┐
│                      EVENT LOOP                              │
│                                                              │
│  ┌──────────────────┐      ┌──────────────────────────────┐ │
│  │   Call Stack     │      │      Task Queue (Macro)       │ │
│  │                  │      │  setTimeout, setInterval      │ │
│  │  main()          │      │  I/O, UI rendering            │ │
│  │  fn1()           │      │  requestAnimationFrame        │ │
│  │  fn2()           │      └──────────────────────────────┘ │
│  └────────┬─────────┘                                       │
│           │                ┌──────────────────────────────┐ │
│           │                │   Microtask Queue             │ │
│           ▼                │  Promise.then                 │ │
│      Stack empty?          │  queueMicrotask               │ │
│           │                │  MutationObserver             │ │
│           │                └──────────────────────────────┘ │
│           ▼                                                  │
│    Process ALL microtasks                                   │
│           │                                                  │
│           ▼                                                  │
│    Render if needed (16.6ms has passed)                     │
│           │                                                  │
│           ▼                                                  │
│    Process ONE macro task                                   │
│           │                                                  │
│           └───────── Loop ─────────────────▶                │
└─────────────────────────────────────────────────────────────┘
```

### Execution Order Example

```js
console.log('1');  // Sync

setTimeout(() => console.log('2'), 0);  // Macro task

Promise.resolve().then(() => console.log('3'));  // Microtask

console.log('4');  // Sync

// Output: 1, 4, 3, 2
```

### Long Tasks

```
┌─────────────────────────────────────────────────────────────┐
│  LONG TASK (>50ms)                                           │
│                                                              │
│  Problem:                                                    │
│  ├── Blocks main thread                                      │
│  ├── Prevents rendering                                      │
│  ├── Makes page unresponsive                                 │
│  └── Hurts INP metric                                        │
│                                                              │
│  Timeline:                                                   │
│  ─────────────────────────────────────────────────────────  │
│  │ Long Task (200ms) █████████████████████████             │
│  │                   │                                      │
│  │                   └── User clicks button here            │
│  │                       but can't respond until task ends  │
│  ─────────────────────────────────────────────────────────  │
└─────────────────────────────────────────────────────────────┘
```

### Breaking Up Long Tasks

```js
// ❌ BAD - Single long task
function processItems(items) {
  items.forEach(item => {
    expensiveOperation(item);  // Total: 500ms
  });
}

// ✅ GOOD - Yield to main thread
async function processItems(items) {
  for (const item of items) {
    expensiveOperation(item);

    // Yield control back to browser
    await scheduler.yield?.() ||
          new Promise(r => setTimeout(r, 0));
  }
}

// ✅ ALSO GOOD - requestIdleCallback for non-urgent work
function processItems(items) {
  const queue = [...items];

  function processChunk(deadline) {
    while (queue.length && deadline.timeRemaining() > 0) {
      expensiveOperation(queue.shift());
    }

    if (queue.length) {
      requestIdleCallback(processChunk);
    }
  }

  requestIdleCallback(processChunk);
}
```

---

## 7. Document Lifecycle Events

```
┌─────────────────────────────────────────────────────────────┐
│  DOCUMENT LIFECYCLE                                          │
│                                                              │
│  Parsing ──────────────────────────────────────▶            │
│                                                              │
│  DOMContentLoaded: DOM tree complete                         │
│       │            (doesn't wait for images, stylesheets)    │
│       ▼                                                      │
│  document.readyState = "interactive"                         │
│                                                              │
│  Resources loading ────────────────────────────▶            │
│                                                              │
│  load: Everything loaded (images, styles, iframes)          │
│       │                                                      │
│       ▼                                                      │
│  document.readyState = "complete"                            │
│                                                              │
│  User navigates away ──────────────────────────▶            │
│                                                              │
│  beforeunload: Chance to confirm leaving                     │
│  unload: Cleanup                                             │
└─────────────────────────────────────────────────────────────┘
```

```js
// DOMContentLoaded - DOM ready, safe to query
document.addEventListener('DOMContentLoaded', () => {
  const button = document.querySelector('#myButton');
  // Safe - DOM exists
});

// load - Everything loaded
window.addEventListener('load', () => {
  // Images are loaded, can get dimensions
  const img = document.querySelector('img');
  console.log(img.naturalWidth);
});

// Check current state
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();  // DOM already ready
}
```

---

## 8. Frame Budget

```
┌─────────────────────────────────────────────────────────────┐
│  60 FPS = 16.67ms per frame                                  │
│                                                              │
│  ┌───────────────────────────────────────────────────┐      │
│  │ 16.67ms                                           │      │
│  │                                                   │      │
│  │ JS ████     Style ██   Layout ██  Paint █  Comp █ │      │
│  │ (10ms)      (2ms)      (2ms)      (1ms)   (1ms)  │      │
│  │                                                   │      │
│  │              ✓ Under budget - smooth!             │      │
│  └───────────────────────────────────────────────────┘      │
│                                                              │
│  ┌───────────────────────────────────────────────────┐      │
│  │ 16.67ms                               ▼ Overrun   │      │
│  │                                                   │      │
│  │ JS ████████████████  Style ███  Layout ███  ▓▓▓▓ │      │
│  │ (25ms)                                     Jank! │      │
│  │                                                   │      │
│  │              ✗ Over budget - frame dropped!       │      │
│  └───────────────────────────────────────────────────┘      │
└─────────────────────────────────────────────────────────────┘
```

---

## 9. Optimization Summary

| Phase | Optimization |
|-------|--------------|
| **Network** | DNS prefetch, preconnect, HTTP/2, CDN |
| **Parsing** | Defer/async scripts, inline critical CSS |
| **Render Tree** | Minimize DOM nodes, avoid deep nesting |
| **Layout** | Batch reads/writes, avoid layout thrashing |
| **Paint** | Use transform/opacity, reduce paint areas |
| **Composite** | Promote animated elements, use will-change |
| **JavaScript** | Break long tasks, use Web Workers |

---

## 10. Interview Tip

> "When a browser receives an HTML document, it goes through several phases. First, it parses HTML to build the DOM while simultaneously parsing CSS to build the CSSOM. The preload scanner runs ahead to fetch resources in parallel. JavaScript blocks parsing unless marked async or defer. Once DOM and CSSOM are ready, they're combined into a Render Tree (excluding invisible elements). Layout calculates exact positions, Paint generates draw commands, and finally Composite layers are sent to the GPU. I optimize by avoiding layout thrashing, using transform for animations, deferring non-critical JavaScript, and breaking long tasks to stay within the 16ms frame budget for 60fps."
