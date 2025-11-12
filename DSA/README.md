# DSA Practice (JavaScript)

Pure JavaScript algorithms and data structures for FAANG interview prep.

## Structure

Each subfolder contains related problems:

```
DSA/
  arrays/       - Array manipulation, two pointers, sliding window
  graphs/       - BFS, DFS, shortest path, topological sort
  trees/        - Binary trees, BST, traversals
  heaps/        - Min/max heap, priority queue
  strings/      - Pattern matching, parsing
  dp/           - Dynamic programming
```

## Running Scripts

All scripts are standalone Node.js files with built-in tests.

```bash
# Run any script directly
node DSA/arrays/two-sum.js
node DSA/graphs/bfs-grid.js

# Scripts print test results to console
```

## Format

Each file follows this pattern:

1. **Problem statement** (top comment)
2. **Approach explanation** (brute + optimal)
3. **Code with dense inline comments**
4. **Time & space complexity**
5. **Test cases** (assertEq helper)
6. **Edge cases** covered

## Conventions

- **JavaScript only** (no TypeScript)
- **No external libs** (pure JS + built-in Node modules)
- **Generous comments** (teaching-grade clarity)
- **Two solutions** where applicable (brute → optimal)
- **Big-O analysis** in comments
- **Runnable tests** at bottom of each file
