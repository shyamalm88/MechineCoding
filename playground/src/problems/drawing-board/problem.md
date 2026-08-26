# Drawing Board

## Problem Statement

Build a canvas-based freehand drawing tool with pen, eraser, color picker, and brush size controls. Adobe and Google ask this to test Canvas API knowledge and mouse/touch event handling.

## Requirements

1. **Freehand drawing** — mouse drag draws a smooth stroke
2. **Eraser** — overwrites strokes with white
3. **Color palette** + custom color picker
4. **Brush size slider**
5. **Clear canvas** button
6. **Save as PNG** (bonus — tests `toDataURL`)
7. Touch support (`onTouchStart/Move/End`)

## Key Interview Points

### Core drawing loop
```js
// Store last position, draw line segment on each mouse move
const lastPos = useRef(null);

function startDraw(e) {
  drawing = true;
  lastPos.current = getPos(e);
}

function draw(e) {
  if (!drawing) return;
  const pos = getPos(e);
  ctx.beginPath();
  ctx.moveTo(lastPos.current.x, lastPos.current.y);
  ctx.lineTo(pos.x, pos.y);
  ctx.stroke();
  lastPos.current = pos;
}
```

Why `moveTo → lineTo` instead of just `lineTo`: each `mousemove` fires fast but not continuously — drawing line *segments* from last to current gives a smooth stroke. Just `arc` on each point creates dots, not lines.

### Getting position relative to canvas
```js
function getCanvasPos(e) {
  const rect = canvas.getBoundingClientRect();
  return { x: e.clientX - rect.left, y: e.clientY - rect.top };
}
```
`e.offsetX/offsetY` breaks when child elements exist inside the canvas container.

### Eraser = draw in white
```js
ctx.strokeStyle = tool === "eraser" ? "#ffffff" : color;
ctx.lineWidth  = tool === "eraser" ? 24 : size;
```

### Download canvas
```js
const link = document.createElement("a");
link.download = "drawing.png";
link.href = canvas.toDataURL(); // base64 PNG
link.click();
```

### Touch support
```jsx
onTouchStart={startDraw}
onTouchMove={draw}
onTouchEnd={stopDraw}
// In getPos: e.touches ? e.touches[0].clientX : e.clientX
```
Also set `touchAction: "none"` on the canvas to prevent scroll while drawing.

## What interviewers look for

- `lineTo` approach (not `arc` per point)
- `lastPos.current` as a ref, not state (ref avoids re-renders on every mouse move)
- Correct `getBoundingClientRect()` offset calculation
- `lineCap: "round"` and `lineJoin: "round"` for smooth edges
- `onMouseLeave` → `stopDraw` (strokes don't ghost when cursor leaves canvas)