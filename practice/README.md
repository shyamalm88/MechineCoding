# FAANG Practice Arena

Complete interview prep environment for **DSA**, **Low-Level Design**, and **System Design**.

## What's Inside

```
practice/
├── src/                  # React app (Low-Level Design problems)
│   ├── lld/              # LLD problems with problem.md + solution.js
│   └── components/       # Sidebar, Detail, MarkdownView, CodeBlock
├── DSA/                  # JavaScript algorithms (runnable via Node)
│   ├── arrays/           # Two-pointer, sliding window, etc.
│   └── graphs/           # BFS, DFS, shortest path
└── system-design/        # Markdown notes for large-scale systems
```

---

## Quick Start

### 1. Start the React App (LLD viewer)

```bash
cd practice
npm install
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) to browse Low-Level Design problems.

### 2. Run DSA Scripts

```bash
# From practice/ directory
node DSA/arrays/two-sum.js
node DSA/graphs/bfs-grid.js
```

Each script runs tests and prints results to console.

### 3. Read System Design Notes

```bash
# Open in your editor or markdown viewer
cat system-design/sample-notes.md
```

---

## React App Features

- **Sidebar**: Lists all LLD problems (loaded from `src/lld/index.json`)
- **Detail Pane**: Shows `problem.md` (rendered) and `solution.js` (code block)
- **No external libs**: Pure React 18.2.0, no router, no markdown libs
- **File-driven**: Add new LLDs by creating folders in `src/lld/` and updating `index.json`

### Adding a New LLD

1. Create folder: `src/lld/lld-003-my-problem/`
2. Add files: `problem.md`, `solution.js`, `README.md` (optional)
3. Update `src/lld/index.json`:
   ```json
   {
     "id": "lld-003-my-problem",
     "title": "My Problem",
     "summary": "Short description",
     "path": "src/lld/lld-003-my-problem"
   }
   ```
4. Refresh browser — new problem appears in sidebar!

---

## DSA Scripts

All scripts follow this pattern:

1. **Problem statement** (top comment)
2. **Brute force** solution with comments
3. **Optimal** solution with comments
4. **Time & space complexity** analysis
5. **Test cases** with `assertEq()` helper
6. **Edge cases** covered

Run any script directly:

```bash
node DSA/arrays/two-sum.js
```

Expected output:
```
=== Two Sum Tests ===

✅ Brute: basic got: [0, 1] expected: [0, 1]
✅ Optimal: basic got: [0, 1] expected: [0, 1]
...
```

### Adding a New DSA Problem

1. Create file: `DSA/<category>/<problem-name>.js`
2. Follow the template (see existing files)
3. Include:
   - Problem description
   - Brute force + optimal solutions
   - Comments explaining approach
   - Test cases at bottom
4. Run: `node DSA/<category>/<problem-name>.js`

---

## System Design Notes

Markdown files with full design breakdowns:

- **sample-notes.md**: URL Shortener (complete example)
- **README.md**: Framework and tips

Each design includes:
- Requirements (functional + non-functional)
- High-level architecture
- API design
- Data model
- Scaling strategies
- Capacity planning (with math!)
- Security & compliance
- Evolution roadmap

---

## Tech Stack

| Component       | Version/Tech              |
|-----------------|---------------------------|
| React           | **18.2.0** (pinned)       |
| ReactDOM        | **18.2.0** (pinned)       |
| Vite            | Latest (dev server)       |
| DSA Runtime     | Node.js (no external libs)|
| Markdown        | Custom tiny renderer      |
| Routing         | None (hash state)         |
| UI Libs         | None (pure CSS)           |

---

## File Structure (Detailed)

```
practice/
├── package.json              # React 18.2.0 pinned
├── vite.config.js            # Vite config
├── index.html                # HTML entry point
├── src/
│   ├── main.jsx              # React 18 createRoot
│   ├── App.jsx               # Root component (state + layout)
│   ├── styles.css            # Global styles (minimal, clean)
│   ├── components/
│   │   ├── Sidebar.jsx       # LLD list
│   │   ├── Detail.jsx        # Problem + solution viewer
│   │   ├── MarkdownView.jsx  # Tiny markdown renderer
│   │   └── CodeBlock.jsx     # Code display
│   └── lld/
│       ├── index.json        # LLD registry (source of truth)
│       ├── lld-001-tic-tac-toe/
│       │   ├── problem.md
│       │   ├── solution.js
│       │   └── README.md
│       └── lld-002-todo-list/
│           ├── problem.md
│           ├── solution.js
│           └── README.md
├── DSA/
│   ├── README.md             # DSA overview
│   ├── arrays/
│   │   └── two-sum.js        # Brute + optimal + tests
│   └── graphs/
│       └── bfs-grid.js       # BFS shortest path + tests
└── system-design/
    ├── README.md             # Framework & tips
    └── sample-notes.md       # URL shortener (full design)
```

---

## Usage Examples

### Typical Workflow

```bash
# 1. Start the day: review LLD problems in browser
cd practice
npm run dev
# Browse LLDs, read problem statements, study solutions

# 2. Practice DSA: run scripts and analyze complexity
node DSA/arrays/two-sum.js
# Read output, understand brute vs optimal trade-offs

# 3. Study system design: read markdown notes
cat system-design/sample-notes.md
# Understand scaling, capacity planning, trade-offs

# 4. Add your own problems as you practice
# - Create new LLD folder + update index.json
# - Write new DSA script in DSA/<category>/
# - Take system design notes in system-design/
```

---

## Development Commands

```bash
# Install dependencies
npm install

# Start dev server (hot reload)
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

---

## Design Principles

### Why This Structure?

✅ **Separation of concerns**: DSA, LLD, and system design are distinct skills
✅ **File-driven**: No database, no backend — just files and folders
✅ **Runnable**: DSA scripts execute immediately with Node
✅ **Minimal dependencies**: React 18.2.0 + Vite, nothing else
✅ **Teaching-grade comments**: Every file is self-documenting
✅ **Scalable**: Easy to add new problems without touching infrastructure

### Why React 18.2.0 (not 19)?

- **Stability**: 18.2.0 is LTS, battle-tested
- **Compatibility**: Avoid bleeding-edge breaking changes
- **Interview prep**: Most companies use React 18 in production

### Why No External Libs?

- **Learn fundamentals**: Build tiny markdown renderer, manage state without routers
- **Interview simulation**: FAANG machine coding rounds ban external libs
- **Clarity**: Fewer abstractions = easier to understand

---

## Tips for Interview Prep

### DSA
- Run scripts daily — muscle memory matters
- Focus on **time/space complexity** — always state Big-O
- Cover **edge cases** — empty arrays, single elements, duplicates, negatives
- Explain **why** optimal is better (not just "it's faster")

### Low-Level Design
- Understand **API contracts** — what methods, what return types
- Think about **edge cases** — invalid inputs, state after errors
- Practice **clean code** — readable variable names, generous comments
- Consider **extensibility** — how to add features without rewriting

### System Design
- Start with **requirements** — clarify scope before drawing boxes
- Use **numbers** — "1M DAU, 100 QPS, 1TB/day" beats "lots of users"
- Explain **trade-offs** — every design choice has pros/cons
- Plan for **failure** — retries, timeouts, circuit breakers
- Think **evolution** — MVP first, then scale incrementally

---

## Troubleshooting

### React app won't start
```bash
# Delete node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
npm run dev
```

### DSA script errors
```bash
# Ensure running from practice/ directory
cd practice
node DSA/arrays/two-sum.js

# If still fails, check Node version (need >=14)
node --version
```

### Markdown not rendering in app
- Check `src/lld/index.json` paths match actual folder names
- Verify `problem.md` and `solution.js` exist in LLD folders
- Check browser console for fetch errors

---

## Extending This Project

### Add More LLD Problems
- Study common patterns: rate limiter, LRU cache, parking lot, elevator
- Each problem should have clear requirements and constraints
- Solutions should be runnable (even if just class definitions)

### Add More DSA Categories
```bash
mkdir DSA/trees DSA/heaps DSA/dp DSA/strings
# Add scripts following existing patterns
```

### Add More System Designs
- Common topics: Instagram, YouTube, Uber, Netflix, Google Docs
- Use `sample-notes.md` as a template
- Include capacity math and trade-offs

---

## License

Open source — use freely for interview prep. No attribution required.

---

## Feedback

Found a bug? Have a suggestion? Open an issue or submit a PR.

**Good luck with your FAANG interviews!** 🚀
