# How to Add a New LLD Problem

Follow these steps to add a new Low-Level Design problem to the practice app.

## Step 1: Create Folder Structure

```bash
# Create new LLD folder (use sequential numbering)
mkdir -p src/lld/lld-004-my-problem
```

## Step 2: Create Required Files

### `problem.md`

Write the problem statement with requirements, constraints, and examples.

```markdown
# My Problem Title

## Problem Statement

Describe what needs to be built...

## Requirements

- Requirement 1
- Requirement 2

## Constraints

- Performance requirements
- Browser support
- No external libraries

## Example

Show expected behavior...
```

### `Solution.jsx`

Create an interactive React component.

```jsx
import { useState } from "react";

function MyProblem() {
  const [state, setState] = useState(initialValue);

  return (
    <div>
      <h2>My Problem Solution</h2>
      {/* Your interactive UI here */}
    </div>
  );
}

export default MyProblem;
```

**Important:** Must export as **default export**, not named export.

### `README.md` (optional)

Add design notes, complexity analysis, and interview tips.

## Step 3: Update `src/lld/index.json`

Add your new problem to the JSON array:

```json
[
  ...,
  {
    "id": "lld-004-my-problem",
    "title": "My Problem",
    "summary": "Short one-line description",
    "path": "src/lld/lld-004-my-problem"
  }
]
```

## Step 4: Register Component in `src/components/Detail.jsx`

### Import the component:

```javascript
import MyProblem from "../lld/lld-004-my-problem/Solution";
```

### Add to SOLUTION_COMPONENTS map:

```javascript
const SOLUTION_COMPONENTS = {
  "lld-001-tic-tac-toe": TicTacToe,
  "lld-002-todo-list": TodoList,
  "lld-003-progress-bars-ii": ProgressBarsIV,
  "lld-004-my-problem": MyProblem, // ← Add this
};
```

## Step 5: Test

```bash
npm run dev
# Open browser, click your new problem in the sidebar
# Verify problem.md renders and Solution component works
```

---

## File Naming Conventions

- **Folder**: `lld-XXX-kebab-case-name`
- **ID**: Same as folder name (e.g., `lld-004-my-problem`)
- **Files**:
  - `problem.md` (lowercase)
  - `Solution.jsx` (capitalized, must be `.jsx` for React components)
  - `README.md` (optional, capitalized)

---

## Common Mistakes to Avoid

❌ **Wrong:** Named export in Solution.jsx

```javascript
export function MyProblem() { ... }
```

✅ **Correct:** Default export

```javascript
export default MyProblem;
```

---

❌ **Wrong:** Forgot to add to SOLUTION_COMPONENTS map

- Component won't render, shows "Solution component not found" error

✅ **Correct:** Always update both import statement AND map in Detail.jsx

---

❌ **Wrong:** Used `.js` extension for React component

```
Solution.js  // Vite can't parse JSX in .js files
```

✅ **Correct:** Use `.jsx` extension

```
Solution.jsx  // ✅
```

---

## Tips

### Styling

- Use inline styles (like examples) for self-contained components
- Or add CSS classes to `src/styles.css`

### State Management

- Use `useState` for simple state
- Consider `useReducer` for complex state (multiple actions)

### Performance

- Use `useMemo` for expensive calculations
- Use `useCallback` for event handlers passed to children
- Avoid re-renders with `React.memo` if needed

### Testing

- Manually test all interactions (clicks, inputs, edge cases)
- Verify on different screen sizes
- Check browser console for errors

---

## Example: Adding "LRU Cache Visualizer"

### 1. Create folder

```bash
mkdir -p src/lld/lld-004-lru-cache
```

### 2. Create files

- `problem.md` → LRU cache requirements
- `Solution.jsx` → Interactive cache with get/put buttons
- `README.md` → Hash map + doubly linked list approach

### 3. Update `index.json`

```json
{
  "id": "lld-004-lru-cache",
  "title": "LRU Cache",
  "summary": "Implement LRU cache with O(1) operations",
  "path": "src/lld/lld-004-lru-cache"
}
```

### 4. Update `Detail.jsx`

```javascript
import LRUCache from '../lld/lld-004-lru-cache/Solution'

const SOLUTION_COMPONENTS = {
  ...,
  'lld-004-lru-cache': LRUCache,
}
```

### 5. Test

```bash
npm run dev
# Click "LRU Cache" in sidebar
# Test get/put operations
```

---

## Need Help?

- **Syntax errors:** Check browser console (F12)
- **Component not rendering:** Verify it's in SOLUTION_COMPONENTS map
- **Styling issues:** Add CSS to `src/styles.css` or use inline styles
- **State bugs:** Use React DevTools to inspect state

---

Happy coding! 🚀
