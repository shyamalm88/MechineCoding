# Tabs

## Problem Statement

Build an accessible Tab component with keyboard navigation and lazy rendering. This is a Google and Salesforce staple — interviewers expect ARIA roles and keyboard support, not just click handlers.

## Requirements

1. **Tab list** with multiple tabs; clicking switches the active panel
2. **Keyboard navigation** — ArrowLeft/Right cycles tabs, Home/End jump to first/last
3. **Roving tabIndex** — only the active tab is focusable via Tab key
4. **Lazy rendering** — a tab's content mounts only on first visit, not before
5. **ARIA roles** — `tablist`, `tab`, `tabpanel`, `aria-selected`, `aria-controls`

## Key Interview Points

### Roving tabIndex pattern
```jsx
// Active tab: tabIndex={0} (in the tab sequence)
// Inactive tabs: tabIndex={-1} (focusable only via JS, not Tab key)
tabIndex={isActive ? 0 : -1}
```

### Keyboard handler
```js
function handleKeyDown(e) {
  if (e.key === "ArrowRight") activate(ids[(current + 1) % ids.length]);
  if (e.key === "ArrowLeft")  activate(ids[(current - 1 + ids.length) % ids.length]);
  if (e.key === "Home") activate(ids[0]);
  if (e.key === "End")  activate(ids[ids.length - 1]);
}
```

### Lazy loading with a `visited` Set
```js
const [visited, setVisited] = useState(new Set(["tab1"]));
// On activate:
setVisited(prev => new Set([...prev, id]));
// In panel:
{visited.has(tab.id) ? <tab.Content /> : null}
```

### ARIA wiring
```jsx
<div role="tablist">
  <button role="tab" aria-selected={isActive} aria-controls={`panel-${id}`} />
</div>
<div role="tabpanel" aria-labelledby={`tab-${id}`} hidden={!isActive} />
```

## What interviewers look for

- ARIA roles (many candidates skip this)
- Roving tabIndex — not `tabIndex={0}` on all tabs
- `hidden` attribute on panels (not CSS `display:none` via class)
- Lazy rendering to avoid mounting expensive panels unnecessarily
- Wrapping arrow key navigation (last tab → first, first → last)