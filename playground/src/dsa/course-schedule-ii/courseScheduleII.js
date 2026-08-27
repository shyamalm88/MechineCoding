/**
 * @param {number} numCourses
 * @param {number[][]} prerequisites
 * @return {number[]}
 */
const findOrder = (numCourses, prerequisites) => {
  // Step 1: Build Adjacency List
  const graph = Array.from({ length: numCourses }, () => []);

  for (let [course, prereq] of prerequisites) {
    graph[prereq].push(course); // prereq -> course
  }

  // State: 0 = Unvisited, 1 = Visiting, 2 = Visited
  const state = new Array(numCourses).fill(0);

  // Result array (will be in reverse topological order)
  const result = [];

  /**
   * DFS with cycle detection
   * Returns true if cycle found
   */
  const dfs = (node) => {
    // Currently visiting = cycle detected
    if (state[node] === 1) return true;

    // Already fully processed = safe
    if (state[node] === 2) return false;

    // Mark as visiting
    state[node] = 1;

    // Visit all neighbors (courses that depend on this one)
    for (let neighbor of graph[node]) {
      if (dfs(neighbor)) return true;
    }

    // Mark as visited
    state[node] = 2;

    // POST-ORDER: Add to result after all descendants processed
    // This ensures all dependent courses are added before this one
    result.push(node);

    return false;
  };

  // Try DFS from each node
  for (let i = 0; i < numCourses; i++) {
    if (state[i] === 0) {
      if (dfs(i)) {
        return []; // Cycle found = impossible
      }
    }
  }

  // Reverse for correct topological order
  return result.reverse();
};

// ============================================================================
// ALTERNATIVE: BFS (Kahn's Algorithm)
// ============================================================================
const findOrderBFS = (numCourses, prerequisites) => {
  const graph = Array.from({ length: numCourses }, () => []);
  const inDegree = new Array(numCourses).fill(0);

  // Build graph and count in-degrees
  for (let [course, prereq] of prerequisites) {
    graph[prereq].push(course);
    inDegree[course]++;
  }

  // Start with courses that have no prerequisites (in-degree = 0)
  const queue = [];
  for (let i = 0; i < numCourses; i++) {
    if (inDegree[i] === 0) queue.push(i);
  }

  const result = [];

  while (queue.length > 0) {
    const course = queue.shift();
    result.push(course); // Add to order as we process

    // Reduce in-degree for dependent courses
    for (let nextCourse of graph[course]) {
      inDegree[nextCourse]--;
      if (inDegree[nextCourse] === 0) {
        queue.push(nextCourse);
      }
    }
  }

  // If we processed all courses, return order; else cycle exists
  return result.length === numCourses ? result : [];
};

// ============================================================================
// TEST CASES
// ============================================================================

// Test 1: Simple chain
console.log("Test 1:", findOrder(2, [[1, 0]]));
// Expected: [0, 1]

// Test 2: Diamond dependency
console.log(
  "Test 2:",
  findOrder(4, [
    [1, 0],
    [2, 0],
    [3, 1],
    [3, 2],
  ]),
);
// Expected: [0, 1, 2, 3] or [0, 2, 1, 3]

// Test 3: Single course
console.log("Test 3:", findOrder(1, []));
// Expected: [0]

// Test 4: No prerequisites
console.log("Test 4:", findOrder(3, []));
// Expected: [0, 1, 2] (any order)

// Test 5: Cycle (impossible)
console.log(
  "Test 5:",
  findOrder(2, [
    [1, 0],
    [0, 1],
  ]),
);
// Expected: []

// Test 6: Complex valid graph
console.log(
  "Test 6:",
  findOrder(6, [
    [1, 0],
    [2, 0],
    [3, 1],
    [4, 2],
    [5, 3],
    [5, 4],
  ]),
);
// Expected: [0, 1, 2, 3, 4, 5] or similar valid order

// Test 7: Multiple components
console.log(
  "Test 7:",
  findOrder(4, [
    [1, 0],
    [3, 2],
  ]),
);
// Expected: [0, 1, 2, 3] or [2, 3, 0, 1] or similar

// Test 8: Longer chain
console.log(
  "Test 8:",
  findOrder(4, [
    [1, 0],
    [2, 1],
    [3, 2],
  ]),
);
// Expected: [0, 1, 2, 3]

// Test 9: BFS approach
console.log("\n--- BFS Approach (Kahn's Algorithm) ---");
console.log("Test 9:", findOrderBFS(2, [[1, 0]]));
// Expected: [0, 1]

console.log(
  "Test 10:",
  findOrderBFS(4, [
    [1, 0],
    [2, 0],
    [3, 1],
    [3, 2],
  ]),
);
// Expected: [0, 1, 2, 3] or [0, 2, 1, 3]

console.log(
  "Test 11:",
  findOrderBFS(2, [
    [1, 0],
    [0, 1],
  ]),
);
// Expected: [] (cycle)
