<p align="center">
  <img src="https://img.shields.io/badge/DSA-125%20Problems-blue?style=for-the-badge" alt="DSA Problems"/>
  <img src="https://img.shields.io/badge/JavaScript-34%2B%20Concepts-yellow?style=for-the-badge&logo=javascript" alt="JavaScript"/>
  <img src="https://img.shields.io/badge/React%20LLD-7%20Components-61DAFB?style=for-the-badge&logo=react" alt="React LLD"/>
  <img src="https://img.shields.io/badge/System%20Design-15%20Docs-green?style=for-the-badge" alt="System Design"/>
</p>

<h1 align="center">Interview Prep Hub</h1>

<p align="center">
  <strong>A comprehensive collection for FAANG-style technical interviews</strong><br>
  DSA | JavaScript Core | React LLD | System Design
</p>

<p align="center">
  <img src="https://img.shields.io/badge/node-%3E%3D18.0.0-brightgreen?logo=node.js" alt="Node"/>
  <img src="https://img.shields.io/badge/React-18.2.0-61DAFB?logo=react" alt="React"/>
  <img src="https://img.shields.io/badge/Vite-5.1.0-646CFF?logo=vite" alt="Vite"/>
</p>

---

## Table of Contents

- [Overview](#overview)
- [Quick Start](#quick-start)
- [DSA Problems](#dsa-problems)
- [JavaScript Concepts](#javascript-concepts)
- [React LLD Components](#react-lld-components)
- [React Hooks](#react-hooks)
- [System Design](#system-design)
- [Project Structure](#project-structure)
- [Contributing](#contributing)

---

## Overview

This repository is a **one-stop interview preparation hub** covering all aspects of technical interviews:

| Category | Count | Description |
|----------|-------|-------------|
| **DSA** | 125 | Curated problems with intuitions & optimal solutions |
| **JavaScript** | 34+ | Polyfills, patterns & utility functions |
| **React LLD** | 7 | Interactive UI components |
| **React Hooks** | 6 | Reusable custom hooks |
| **System Design** | 15 | Frontend architecture templates |

### Features

- **Zero Dependencies** - Pure implementations, no external libraries
- **Self-Documenting** - Each file includes problem statement, intuition & complexity analysis
- **Runnable Tests** - Execute DSA files directly with Node.js
- **Interactive Demo** - React app to visualize LLD components
- **Interview Ready** - Common follow-up questions included
- **DSA Tracker** - CSV with 125 problems, categories, priorities & intuitions

---

## Quick Start

### Run DSA Problems
```bash
# Run any DSA problem directly
node DSA/Graph/numberOfIslands.js
node DSA/Two-Pointer/trappingRainWater.js
```

### Run React LLD App
```bash
cd practice
npm install
npm run dev
# Open http://localhost:5173
```

---

## DSA Problems

**125 curated problems** organized by pattern/technique. Full tracking available in [`DSA/dsa-preparation-list.csv`](DSA/dsa-preparation-list.csv) with:
- Problem name & LeetCode number
- Difficulty & Category
- Priority (Must Do / Core / Depth)
- Completion status
- **Algorithm intuition for each problem**

<table>
<tr>
<td width="50%" valign="top">

### Arrays & Strings
- Two Sum, 3Sum
- Product Except Self
- Longest Consecutive Sequence
- Next Permutation
- Subarray Sum Equals K
- Group Anagrams
- Longest Palindromic Substring

### Binary Search
- Search in Rotated Sorted Array
- Find Minimum in Rotated Array
- Time-Based Key-Value Store
- Find Peak Element

### Two Pointer
- Container With Most Water
- Trapping Rain Water
- Move Zeroes
- Valid Palindrome II

### Sliding Window
- Minimum Window Substring
- Longest Substring Without Repeating
- Find All Anagrams
- Longest Repeating Character Replacement

</td>
<td width="50%" valign="top">

### Graph (Comprehensive)
- Number of Islands
- Clone Graph
- Course Schedule I & II
- Pacific Atlantic Water Flow
- Rotting Oranges
- Number of Provinces
- Graph Valid Tree
- Connected Components
- Is Graph Bipartite?
- Accounts Merge
- Word Ladder
- Network Delay Time (Dijkstra)

### Trees
- Level Order Traversal
- Validate BST
- Lowest Common Ancestor
- Serialize/Deserialize
- Path Sum III

### Dynamic Programming
- Climbing Stairs
- House Robber I & II
- Coin Change
- Word Break
- Longest Increasing Subsequence

### Backtracking
- Subsets, Permutations
- Generate Parentheses
- Combination Sum
- Word Search

</td>
</tr>
</table>

### Problem Categories Distribution

```
Arrays/Strings  ████████████████░░░░  28 problems
Graph/Matrix    ████████████████████  26 problems
Trees           ███████████░░░░░░░░░  11 problems
DP              █████████░░░░░░░░░░░   9 problems
Binary Search   ██████░░░░░░░░░░░░░░   6 problems
Sliding Window  ██████░░░░░░░░░░░░░░   6 problems
Stack           ██████░░░░░░░░░░░░░░   6 problems
Linked List     ██████░░░░░░░░░░░░░░   6 problems
Others          █████████████████░░░  27 problems
```

### File Format
Each DSA file follows this structure:
```javascript
/**
 * ============================================================================
 * PROBLEM: [Name] (LeetCode #XXX)
 * ============================================================================
 * [Problem description with examples]
 *
 * ============================================================================
 * INTUITION: [Algorithm Name]
 * ============================================================================
 * [Why this approach works, key insights]
 *
 * Time Complexity: O(...)
 * Space Complexity: O(...)
 */

// Implementation with detailed comments
// Multiple approaches (DFS, BFS, Union-Find, etc.)
// Comprehensive test cases at the bottom
```

---

## JavaScript Concepts

Core JavaScript implementations for interview questions:

<table>
<tr>
<td width="33%" valign="top">

### Array Polyfills
- `Array.prototype.map`
- `Array.prototype.filter`
- `Array.prototype.reduce`
- `Array.prototype.find`
- `Array.prototype.forEach`
- `Array.prototype.flat`

### Promise Polyfills
- `Promise` (from scratch)
- `Promise.all`
- `Promise.allSettled`
- `Promise.any`
- `Promise.race`

</td>
<td width="33%" valign="top">

### Function Methods
- `Function.prototype.call`
- `Function.prototype.apply`
- `Function.prototype.bind`

### Design Patterns
- Singleton
- Factory
- Observer
- Pub/Sub
- Proxy/Interceptor

</td>
<td width="33%" valign="top">

### Utility Functions
- Debounce
- Throttle
- Deep Clone
- Deep Equal
- Curry
- Compose
- Pipe (sync & async)

### Advanced
- Memoization
- Async Memoization
- LRU Cache
- Event Emitter
- Promise Retry
- Async Map with Limit

</td>
</tr>
</table>

---

## React LLD Components

Interactive low-level design problems with working solutions:

| # | Component | Key Concepts | Demo |
|---|-----------|--------------|------|
| 1 | **Progress Bars** | Concurrent animation, queue management | Animated bars with 3-bar limit |
| 2 | **Grid Lights** | State management, FIFO deactivation | 3x3 clickable grid |
| 3 | **Wordle** | Game logic, keyboard events, tile states | Word guessing game |
| 4 | **Typeahead** | Debouncing, AbortController, race conditions | Product search |
| 5 | **File Explorer** | Recursive components, tree traversal | VSCode-like file tree |
| 6 | **Nested Comments** | Recursive data, CRUD operations | Reddit-style threads |
| 7 | **Traffic Light** | Finite state machine, useEffect timing | Auto-cycling signal |

### Each LLD Includes:
- `problem.md` - Requirements & visual representation
- `Solution.jsx` - Working implementation
- Key concepts & interview tips
- Common follow-up questions
- Edge cases to consider

---

## React Hooks

Reusable custom hooks for common UI patterns:

| Hook | Purpose | Use Case |
|------|---------|----------|
| `useDebounce` | Delay value updates | Search inputs |
| `useThrottle` | Limit update frequency | Scroll handlers |
| `useClickOutside` | Detect outside clicks | Dropdowns, modals |
| `usePrevious` | Track previous value | Comparing state changes |
| `useIntersectionObserver` | Visibility detection | Lazy loading, infinite scroll |
| `useQuery` | URL query management | Filters, pagination |

---

## System Design

**15 comprehensive frontend system design documents** for interviews:

<table>
<tr>
<td width="50%" valign="top">

### Core Applications
- **Instagram Photo Feed** - Infinite scroll, lazy loading
- **Twitter/Facebook News Feed** - Real-time updates, feed ranking
- **YouTube Video Streaming** - Adaptive bitrate, player controls
- **Google Photos Grid** - Virtualization, gestures
- **Gmail/Outlook Email Client** - Threading, offline support

### E-commerce & Marketplace
- **Amazon E-commerce** - Product catalog, cart, checkout
- **Uber Eats Restaurant Listing** - Geolocation, filters
- **Zomato Food Delivery** - Real-time tracking

</td>
<td width="50%" valign="top">

### Real-time Applications
- **Zoom Video Conference** - WebRTC, screen sharing
- **Uber/Rapido Ride Booking** - Maps, real-time tracking
- **Chat Application** - WebSocket, message sync

### Productivity Tools
- **Google Docs Collaborative Editor** - CRDT, operational transform
- **Trello Kanban Board** - Drag & drop, real-time sync

### Infrastructure
- **URL Shortener** - Hash generation, caching
- **Design Framework Template** - Architecture patterns

</td>
</tr>
</table>

### Each System Design Doc Includes:
1. Requirements (Functional & Non-Functional)
2. Component Architecture
3. State Management Strategy
4. API Design & Data Flow
5. Performance Optimizations
6. Accessibility Considerations
7. Error Handling & Edge Cases
8. Testing Strategy
9. Security Considerations
10. Deployment & Monitoring

---

## Project Structure

```
.
├── DSA/                          # Data Structures & Algorithms (125 problems)
│   ├── dsa-preparation-list.csv  # Master tracking with intuitions
│   ├── Arrays&Hashset/
│   ├── BinarySearch/
│   ├── Graph/                    # 10 fully documented graph problems
│   ├── Two-Pointer/
│   ├── intervals/
│   ├── matrix/
│   ├── recursion & backtracking/
│   ├── sliding-window/
│   └── tree/
│
├── JavaScriptProblems/           # Pure JavaScript (34+ implementations)
│   ├── Array/                    # Array method polyfills
│   ├── Design Patterns/          # Common patterns
│   ├── call,apply,bind/          # Function context
│   ├── memoization/              # Caching strategies
│   ├── promise-async-problems/   # Async utilities
│   ├── promise-polyfills/        # Promise implementations
│   └── utility/                  # Helper functions
│
├── practice/                     # React LLD App
│   ├── src/
│   │   ├── components/           # App shell components
│   │   └── lld/                  # 7 LLD problem solutions
│   └── package.json
│
├── reactHooks/                   # 6 Custom React hooks
│
├── system-design/                # 15 Frontend architecture templates
│   ├── instagram-photo-feed.md
│   ├── news-feed-facebook-twitter.md
│   ├── video-streaming-youtube.md
│   ├── ecommerce-marketplace-amazon.md
│   └── ... (11 more)
│
└── Theory/                       # Supporting educational content
```

---

## Contributing

Contributions are welcome! Please follow these guidelines:

1. **DSA Problems**: Include problem link, intuition, brute force & optimal solutions, complexity analysis
2. **JavaScript**: Provide polyfill with edge case handling
3. **React LLD**: Include `problem.md` with requirements and visual representation
4. **System Design**: Follow the existing template format with all 10 sections

---

## Resources

- [LeetCode](https://leetcode.com) - DSA practice
- [GreatFrontEnd](https://greatfrontend.com) - Frontend interview prep
- [React Documentation](https://react.dev) - Official React docs
- [NeetCode](https://neetcode.io) - DSA roadmap

---

<p align="center">
  <strong>Happy Coding!</strong><br>
  <sub>Star this repo if you find it helpful!</sub>
</p>
