# Graph Mastery Roadmap (Google-Oriented)

This document defines the **exact order** to study graph problems so that
you build **deep intuition**, not memorized solutions.

Follow this order strictly.
Do NOT jump ahead.

Each section builds a mental model that later problems depend on.

---

## LEVEL 0 — Graph Warm-Up (Traversal & Components)

🎯 Goal:

- Stop thinking of graphs as “questions”
- Start thinking in **connected components & reachability**

### Study Order

1. numberOfIslands.js
2. maxAreaOfIsland.js
3. connectedComponent.js
4. numberOfProvinces.js

### What to Learn

- DFS vs BFS equivalence
- When recursion is safe
- Counting components
- Grid ↔ graph equivalence

🧠 Mental Model:

> “A graph is just nodes + reachability. Everything else is a constraint.”

---

## LEVEL 1 — BFS as Shortest Path (Unweighted)

🎯 Goal:

- BFS = shortest path when all edges cost the same

### Study Order

5. rottenOranges.js
6. wallsAndGates.js
7. O1Matrix.js
8. openLock.js

### What to Learn

- Multi-source BFS
- Layered BFS
- Distance propagation
- Why BFS guarantees optimality

🧠 Mental Model:

> “Each BFS layer represents +1 cost.”

---

## LEVEL 2 — Graph Validation & Cycles (Union-Find + DFS)

🎯 Goal:

- Understand **what makes a graph valid**
- Learn Union-Find as a graph invariant tool

### Study Order

9. graphValidTree.js
10. redundantConnections.js

### What to Learn

- Cycle detection
- Connectivity vs acyclic
- Why `edges = n - 1` matters
- Union-Find intuition (components shrinking)

🧠 Mental Model:

> “Union-Find tracks components as they collapse.”

---

## LEVEL 3 — Directed Graphs & Dependencies

🎯 Goal:

- Reason about **ordering**, not just reachability

### Study Order

11. courseSchedule.js
12. courseScheduleII.js
13. alienDictionary.js

### What to Learn

- Directed cycles
- Topological sorting
- DFS vs Kahn’s algorithm
- Why order matters more than path

🧠 Mental Model:

> “Directed graphs encode constraints, not distances.”

---

## LEVEL 4 — Shortest Path Foundations (Dijkstra Core)

🎯 Goal:

- Truly understand Dijkstra (not memorize it)

### Study Order

14. networkDelayTime.js
15. maxProbability.js

### What to Learn

- Why greedy works
- Min-heap invariants
- When Dijkstra applies / doesn’t apply
- Cost monotonicity

🧠 Mental Model:

> “Dijkstra expands the _best guaranteed state_.”

---

## LEVEL 5 — BFS with State (Constraint Expansion)

🎯 Goal:

- Learn when `visited[node]` is WRONG

### Study Order

16. shortestPathWithAlternateColors.js
17. shortestPathWithObstacleElimination.js
18. cheapestFlightsWithinKStops.js

### What to Learn

- State = (node + constraint)
- Why different states matter
- BFS vs Dijkstra with state
- State explosion control

🧠 Mental Model:

> “Same node ≠ same future.”

---

## LEVEL 6 — Implicit Graphs (State Generation)

🎯 Goal:

- Solve problems where edges are NOT given

### Study Order

19. wordLadder.js
20. minimumGeneticMutation.js
21. slidingPuzzle.js

### What to Learn

- On-the-fly neighbor generation
- State serialization
- BFS on abstract spaces

🧠 Mental Model:

> “If I can generate neighbors, I have a graph.”

---

## LEVEL 7 — Multi-Source & Reverse Thinking

🎯 Goal:

- Solve problems from the _end backwards_

### Study Order

22. pacificAtlantic.js
23. smallest-bridge.js

### What to Learn

- Reverse BFS / DFS
- Boundary-driven traversal
- Why reversing simplifies logic

🧠 Mental Model:

> “Sometimes it’s easier to ask: who can reach me?”

---

## LEVEL 8 — Non-Standard Shortest Path (VVIMP)

🎯 Goal:

- Handle problems where cost ≠ sum of edges

### Study Order

24. pathWithMinimumEffort.js
25. SwimInRisingWater.js
26. minimumCostToMakeAValidPath.js

### What to Learn

- Max-cost Dijkstra
- 0–1 BFS
- Monotonic cost functions

🧠 Mental Model:

> “Shortest path ≠ smallest sum.”

---

## LEVEL 9 — One-Time Powers & Teleports (VVIMP)

🎯 Goal:

- Master state dominance & future potential

### Study Order

27. shortestPathWithTeleport.js

### What to Learn

- Used vs unused power states
- Why future options matter
- Dominance pruning

🧠 Mental Model:

> “State value includes remaining abilities.”

---

## LEVEL 10 — Exponential State Graphs (Staff-Level)

🎯 Goal:

- Comfort with exponential but bounded state spaces

### Study Order

28. shortestPathVisitingAllNodes.js

### What to Learn

- Bitmask BFS
- Multi-source initialization
- Why BFS still works

🧠 Mental Model:

> “When the goal is a state, not a node.”

---

## LEVEL 11 — Eulerian Paths & Ordering (Staff-Level)

🎯 Goal:

- Use every edge exactly once, in order

### Study Order

29. Reconstruct Itinerary (wordLadderII.js / itinerary variant)

### What to Learn

- Eulerian path
- Hierholzer’s algorithm
- Post-order DFS
- Why greedy fails

🧠 Mental Model:

> “Commit only after exhausting choices.”

---

## LEVEL 12 — Graphs in Real Systems (Optional Depth)

🎯 Goal:

- Model real-world problems

### Study Order

30. busRoute.js
31. minimumCostToReachDestinationInTime.js
32. workerShiftSplitter.js
33. findValidRoot.js
34. isBipartite.js

### What to Learn

- Graph modeling
- Constraints vs optimization
- Coloring & partitioning

🧠 Mental Model:

> “Graphs describe relationships — algorithms enforce rules.”

---

## Final Note

If you complete this roadmap **in order**, you will:

- Think like a Big Tech engineer
- Explain graph problems calmly
- Recognize patterns instantly
- Handle Medium → Hard without panic

This is **depth-first mastery**, not LeetCode grinding.
