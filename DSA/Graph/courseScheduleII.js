/**
 * ============================================================================
 * PROBLEM: Course Schedule II (LeetCode #210)
 * ============================================================================
 *
 * There are a total of numCourses courses you have to take, labeled from
 * 0 to numCourses - 1. You are given an array prerequisites where
 * prerequisites[i] = [ai, bi] indicates that you must take course bi
 * first if you want to take course ai.
 *
 * Return the ordering of courses you should take to finish all courses.
 * If there are many valid answers, return any of them. If it is impossible
 * to finish all courses, return an empty array.
 *
 * Example 1:
 *
 *   0 <-- 1
 *
 * Input: numCourses = 2, prerequisites = [[1,0]]
 * Output: [0,1]
 * Explanation: Take course 0, then course 1.
 *
 * Example 2:
 *
 *   0 <-- 1
 *   ^     ^
 *   |     |
 *   +--2--+
 *
 * Input: numCourses = 4, prerequisites = [[1,0],[2,0],[3,1],[3,2]]
 * Output: [0,1,2,3] or [0,2,1,3]
 * Explanation: There are two valid orderings.
 *
 * Example 3:
 * Input: numCourses = 1, prerequisites = []
 * Output: [0]
 *
 * Constraints:
 * - 1 <= numCourses <= 2000
 * - 0 <= prerequisites.length <= numCourses * (numCourses - 1)
 * - prerequisites[i].length == 2
 * - 0 <= ai, bi < numCourses
 * - ai != bi
 * - All pairs [ai, bi] are distinct
 *
 * ============================================================================
 * INTUITION: Topological Sort with DFS (Post-order)
 * ============================================================================
 *
 * This is Course Schedule I + return the actual order!
 *
 * Key Insight (Topological Sort):
 * - A valid course order is a TOPOLOGICAL ORDER of the graph
 * - Topological order: for every edge u->v, u appears before v
 * - Only exists if graph has NO CYCLES (DAG - Directed Acyclic Graph)
 *
 * DFS Approach (Post-order):
 *
 *      0 --> 1 --> 3
 *      |           ^
 *      v           |
 *      2 ----------+
 *
 * DFS from 0:
 * - Visit 0, go to 1, go to 3 (done), backtrack
 * - Add 3 to result (post-order)
 * - Add 1 to result
 * - Go to 2, go to 3 (already done)
 * - Add 2 to result
 * - Add 0 to result
 * - Result: [3, 1, 2, 0] -> Reverse: [0, 2, 1, 3]
 *
 * Why Post-order + Reverse?
 * - In post-order, we add a node AFTER all its descendants
 * - So dependencies are added first
 * - Reversing gives us: prerequisites before dependents
 *
 * Algorithm:
 * 1. Build adjacency list (prereq -> courses that need it)
 * 2. DFS with 3 states (same as Course Schedule I)
 * 3. Add node to result AFTER processing all neighbors (post-order)
 * 4. Reverse result at the end (or use unshift/prepend)
 *
 * Time Complexity: O(V + E) - visit each node and edge once
 * Space Complexity: O(V + E) - adjacency list + result array
 * ============================================================================
 */

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
  ])
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
  ])
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
  ])
);
// Expected: [0, 1, 2, 3, 4, 5] or similar valid order

// Test 7: Multiple components
console.log(
  "Test 7:",
  findOrder(4, [
    [1, 0],
    [3, 2],
  ])
);
// Expected: [0, 1, 2, 3] or [2, 3, 0, 1] or similar

// Test 8: Longer chain
console.log(
  "Test 8:",
  findOrder(4, [
    [1, 0],
    [2, 1],
    [3, 2],
  ])
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
  ])
);
// Expected: [0, 1, 2, 3] or [0, 2, 1, 3]

console.log(
  "Test 11:",
  findOrderBFS(2, [
    [1, 0],
    [0, 1],
  ])
);
// Expected: [] (cycle)
