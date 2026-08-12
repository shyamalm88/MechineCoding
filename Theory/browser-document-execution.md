# How the Browser Executes a Document: A Senior Engineer's Guide

A comprehensive guide to browser document execution for system design interviews.

---

## 1. The Complete Journey: URL to Pixels

```mermaid
graph TD
    subgraph "URL to Pixels"
        A1["1. Navigation"] --> A2["DNS"] --> A3["TCP"] --> A4["TLS"] --> A5["HTTP Request"]
        B1["2. Response"] --> B2["Parsing"] --> B3["DOM/CSSOM Construction"]
        C1["3. Render Tree"] --> C2["Layout"] --> C3["Paint"] --> C4["Composite"]
        D1["4. JavaScript Execution (can interrupt at multiple points)"]
    end
```

---

## 2. Phase 1: Navigation & Network

### DNS Resolution

```mermaid
graph TD
    subgraph "DNS Lookup (typically 20-120ms)"
        A["1. Browser DNS cache"] --> B["2. OS DNS cache"] --> C["3. Router cache"] --> D["4. ISP DNS resolver"] --> E["5. Root nameserver"] --> F["TLD"] --> G["Authoritative"]
        G --> R["Result: example.com to 93.184.216.34"]
    end
```

### TCP Connection (3-Way Handshake)

```mermaid
sequenceDiagram
    participant Client
    participant Server
    Client->>Server: SYN (Seq=100)
    Server->>Client: SYN-ACK (Seq=300, Ack=101)
    Client->>Server: ACK (Seq=101, Ack=301)
    Note over Client,Server: Connection Open (~1 RTT)
```

### TLS Handshake (HTTPS)

```mermaid
sequenceDiagram
    participant Client
    participant Server
    Client->>Server: ClientHello (supported ciphers, random number)
    Server->>Client: ServerHello + Cert (chosen cipher, cert, random number)
    Note over Client: Client verifies cert
    Client->>Server: Key Exchange + Finished (pre-master secret)
    Server->>Client: Finished
    Note over Client,Server: Encrypted Connection (~2 RTT TLS 1.2, ~1 RTT TLS 1.3)
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

```mermaid
graph TD
    Bytes --> Characters --> Tokens --> Nodes --> DOM

    subgraph "Sample HTML to DOM Tree"
        Document --> html
        html --> head
        head --> title
        title --> PageText["'Page'"]
        html --> body
        body --> h1
        h1 --> HelloText["'Hello'"]
        body --> p
        p --> WorldText["'World'"]
    end
```

### The Preload Scanner

```mermaid
graph TD
    subgraph "Preload Scanner (Speculative Parser)"
        A["While main parser is blocked by JavaScript"] --> B["1. Scans ahead in HTML"] --> C["2. Finds link, script src, img tags"] --> D["3. Starts downloading them in parallel"]
        D --> E["This is why resources start loading before parser reaches them"]
    end
```

### CSS Parsing (CSSOM)

```mermaid
graph TD
    StyleSheet --> RuleBody["Rule: body"]
    RuleBody --> BodyMargin["margin: 0"]
    StyleSheet --> RuleH1["Rule: h1"]
    RuleH1 --> H1Color["color: blue"]
    RuleH1 --> H1Size["font-size: 24px"]
    StyleSheet --> RuleP["Rule: p"]
    RuleP --> PColor["color: gray"]
```

### Parser Blocking

```mermaid
graph TD
    subgraph "Parser Blocking Behavior"
        CSS["CSS"] --> C1["Blocks rendering (not parsing)"] --> C2["Must complete before JS can execute"]
        JSNone["JavaScript (no async/defer)"] --> J1["Blocks parsing completely"] --> J2["Waits for CSSOM to complete first"]
        JSAsync["JavaScript (async)"] --> A1["Downloads parallel"] --> A2["Executes immediately when ready (blocks briefly)"]
        JSDefer["JavaScript (defer)"] --> D1["Downloads parallel"] --> D2["Executes after DOM complete, in order"]
    end
```

```mermaid
graph LR
    subgraph "Timeline Example"
        HP["HTML Parsing (continues throughout)"]
        CD["CSS Download/Parse"]
        JAD["JS Download (async)"] --> JAE["JS Executes (blocks briefly)"]
        JDD["JS Download (defer)"] --> JDE["JS Executes (after DOM complete)"]
    end
```

---

## 4. Phase 3: Rendering Pipeline

### Step 1: Render Tree Construction

```mermaid
graph LR
    subgraph DOM_G["DOM"]
        D_html["html"] --> D_head["head"] --> D_title["title"]
        D_html --> D_body["body"]
        D_body --> D_h1["h1"] --> D_h1t["'Hello'"]
        D_body --> D_p["p"] --> D_pt["'World'"]
        D_body --> D_script["script"]
    end
    subgraph CSSOM_G["CSSOM"]
        C_html["html styles"] --> C_head["head"]
        C_html --> C_body["body"]
        C_body --> C_h1["h1 styles"]
        C_body --> C_p["p styles"]
    end
    subgraph RT_G["Render Tree"]
        R_html["html"] --> R_body["body"]
        R_body --> R_h1["h1 (visible)"] --> R_h1t["'Hello'"]
        R_body --> R_p["p (visible)"] --> R_pt["'World'"]
        R_note["head, script, display:none excluded"]
    end
    DOM_G --> RT_G
    CSSOM_G --> RT_G
```

**Excluded from Render Tree:**
- `<head>`, `<script>`, `<meta>` (non-visual)
- Elements with `display: none`
- Elements with `visibility: hidden` ARE included (they affect layout)

### Step 2: Layout (Reflow)

```mermaid
graph TD
    subgraph "Layout Calculation"
        S1["For each node in Render Tree"] --> S2["1. Calculate computed styles"] --> S3["2. Determine box model (width, height, margin, padding)"] --> S4["3. Calculate position (x, y coordinates)"] --> S5["4. Handle overflow, floats, positioning"]
        S5 --> R["Result: Box tree with exact pixel positions"]
        subgraph "Box Tree"
            Body["body (0,0) 1200x800"] --> H1["h1 (0,0) 1200x32"]
            Body --> P["p (0,40) 1200x24"]
        end
        R --> Body
    end
```

### Step 3: Paint

```mermaid
graph TD
    subgraph "Paint Operations"
        A["Convert layout boxes into actual pixels"] --> B["1. Background colors"] --> C["2. Background images"] --> D["3. Borders"] --> E["4. Text"] --> F["5. Shadows"] --> G["6. Outlines"]
        G --> R["Result: Paint records (list of draw commands)"]
    end
```

### Step 4: Composite

```mermaid
graph TD
    subgraph "Compositing Layers"
        T["Elements promoted to own layer"] --> E1["position: fixed/sticky"]
        T --> E2["transform (3D)"]
        T --> E3["opacity less than 1"]
        T --> E4["will-change: transform"]
        T --> E5["video, canvas elements"]
        T --> E6["CSS filters"]
        subgraph "Layer Stack"
            L3["Layer 3 (fixed nav)"] --> L2["Layer 2 (modal)"] --> L1["Layer 1 (main content)"]
        end
        L1 --> GPU["GPU composites layers together"]
    end
```

---

## 5. Reflow vs Repaint

### What Triggers Each

```mermaid
graph TD
    subgraph "Reflow (Layout) - Changes that affect geometry"
        RF["Triggers"] --> RF1["width, height, padding, margin, border"]
        RF --> RF2["position, top, left, right, bottom"]
        RF --> RF3["display, float, clear"]
        RF --> RF4["font-size, font-family, font-weight"]
        RF --> RF5["Adding/removing DOM elements"]
        RF --> RF6["Resizing window"]
        RF --> RF7["Reading layout properties (offsetWidth, etc.)"]
        RF7 --> RFC["Cost: HIGH (recalculates entire tree or subtree)"]
    end

    subgraph "Repaint - Changes that affect appearance only"
        RP["Triggers"] --> RP1["color, background-color"]
        RP --> RP2["visibility"]
        RP --> RP3["box-shadow"]
        RP --> RP4["outline"]
        RP4 --> RPC["Cost: MEDIUM (redraw affected pixels)"]
    end

    subgraph "Composite Only - Changes handled by GPU"
        CO["Properties"] --> CO1["transform"]
        CO --> CO2["opacity"]
        CO --> CO3["filter (with GPU acceleration)"]
        CO3 --> COC["Cost: LOW (GPU handles it, no main thread work)"]
    end
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

```mermaid
graph TD
    subgraph "Event Loop"
        CS["Call Stack: main(), fn1(), fn2()"] --> SE{"Stack empty?"}
        TQ["Task Queue (Macro): setTimeout, setInterval, I/O, UI rendering, requestAnimationFrame"]
        MQ["Microtask Queue: Promise.then, queueMicrotask, MutationObserver"]
        SE --> AM["Process ALL microtasks"]
        MQ -.-> AM
        AM --> RN["Render if needed (16.6ms has passed)"]
        RN --> PM["Process ONE macro task"]
        TQ -.-> PM
        PM --> SE
    end
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

```mermaid
graph TD
    subgraph "Long Task (greater than 50ms)"
        P["Problem"] --> P1["Blocks main thread"]
        P --> P2["Prevents rendering"]
        P --> P3["Makes page unresponsive"]
        P --> P4["Hurts INP metric"]
        T["Timeline: Long Task (200ms)"] --> C["User clicks button here"]
        C --> D["Can't respond until task ends"]
    end
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

```mermaid
graph TD
    subgraph "Document Lifecycle"
        A["Parsing"] --> B["DOMContentLoaded: DOM tree complete (doesn't wait for images, stylesheets)"]
        B --> C["document.readyState = interactive"]
        C --> D["Resources loading"]
        D --> E["load: Everything loaded (images, styles, iframes)"]
        E --> F["document.readyState = complete"]
        F --> G["User navigates away"]
        G --> H["beforeunload: Chance to confirm leaving"]
        H --> I["unload: Cleanup"]
    end
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

```mermaid
graph TD
    subgraph "60 FPS = 16.67ms per frame"
        subgraph "Frame 1 (16.67ms budget)"
            J1["JS (10ms)"] --> S1["Style (2ms)"] --> L1["Layout (2ms)"] --> P1["Paint (1ms)"] --> C1["Composite (1ms)"]
            C1 --> OK["Under budget - smooth"]
        end
        subgraph "Frame 2 (16.67ms budget, overrun)"
            J2["JS (25ms)"] --> S2["Style"] --> L2["Layout"] --> Jank["Jank"]
            Jank --> BAD["Over budget - frame dropped"]
        end
    end
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
