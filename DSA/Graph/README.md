# Graph Problems — Pattern-Based Progression (Google-Oriented)

This checklist is organized by **PATTERNS**, not just difficulty.

👉 **Rule to follow**

- Finish the **CORE** of a pattern first
- Then move to **IMPORTANT** of the SAME pattern
- Then attempt **VVIMP** (same idea, deeper constraints)
- Do NOT jump across patterns randomly

This builds **intuition**, not memorization.

---

## 🧩 PATTERN 1 — Connected Components (DFS / BFS)

**Core idea:**  
“Start a traversal, mark everything reachable.”  
_Root choice does NOT matter._

### 🔵 CORE

- numberOfIslands
- maxAreaOfIsland
- connectedComponents
- numberOfProvinces

### 🟢 IMPORTANT (same idea, different graphs)

- isBipartite

### 🔴 VVIMP (components + bridge logic)

- smallestBridge

---

## 🧩 PATTERN 2 — BFS as Shortest Path (Unweighted)

**Core idea:**  
“Each BFS layer represents +1 distance.”

### 🔵 CORE

- rottenOranges
- wallsAndGates
- O1Matrix
- openLock

### 🟢 IMPORTANT (harder state / generation)

- wordLadder
- minimumGeneticMutation
- slidingPuzzle

### 🔴 VVIMP (goal is a STATE, not a node)

- shortestPathVisitingAllNodes

---

## 🧩 PATTERN 3 — Graph Validity & Cycles

**Core idea:**  
“Is the graph structure even valid?”

### 🔵 CORE

- graphValidTree
- redundantConnections

### 🟢 IMPORTANT (directed cycles / ordering)

- courseSchedule
- courseScheduleII

### 🔴 VVIMP (ordering with constraints)

- alienDictionary

---

## 🧩 PATTERN 4 — Dijkstra / Priority-Based Expansion

**Core idea:**  
“Always expand the best guaranteed state.”

### 🔵 CORE

- networkDelayTime
- pathWithMaximumProbability

### 🟢 IMPORTANT (constraints added)

- cheapestFlightsWithinKStops
- minimumCostToReachDestinationInTime

### 🔴 VVIMP (non-standard cost functions)

- pathWithMinimumEffort
- SwimInRisingWater
- minimumCostToMakeAValidPath

---

## 🧩 PATTERN 5 — BFS with STATE (Visited ≠ Just Node)

**Core idea:**  
“Same node with different state ≠ same future.”

### 🔵 CORE

- shortestPathWithAlternateColors

### 🟢 IMPORTANT

- shortestPathWithObstacleElimination

### 🔴 VVIMP

- shortestPathWithTeleport

---

## 🧩 PATTERN 6 — Multi-Source & Reverse Thinking

**Core idea:**  
“Sometimes it’s easier to start from all ends.”

### 🔵 CORE (concept reuse)

- wallsAndGates
- rottenOranges

### 🟢 IMPORTANT

- pacificAtlantic

---

## 🧩 PATTERN 7 — Eulerian Path / Ordered Traversal

**Core idea:**  
“Use every edge exactly once.”

### 🔴 VVIMP ONLY

- reconstructItinerary

---

## 🧩 PATTERN 8 — Rooted Tree Validation with Constraints

**Core idea:**  
“Choosing a root induces structure; validate constraints.”

> Root choice **matters**  
> Parent/child direction is **created by rooting**

### 🔴 VVIMP

- findValidRoot <!-- moved here -->

---

## 🧩 PATTERN 9 — Graphs as Real Systems (Modeling)

**Core idea:**  
“Translate real-world constraints into graph rules.”

### 🟢 IMPORTANT

- busRoutes

### 🟡 OPTIONAL

- workerShiftSplitter

---

## 🎯 HIGH-ROI LEARNING ORDER (If You’re Busy)

Complete patterns in this order:

1. Pattern 1 — Connected Components
2. Pattern 2 — BFS Shortest Path
3. Pattern 4 — Dijkstra
4. Pattern 5 — BFS with State

This alone makes you **Google-ready for graphs**.

---

## ✅ Key Reminder

- Problem names change
- Graph patterns do NOT
- **If root choice matters, it is NOT a connected-components problem**

This is **depth-first mastery**, not LeetCode grinding.
