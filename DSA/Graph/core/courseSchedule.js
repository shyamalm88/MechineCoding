/**
 * ============================================================================
 * PROBLEM: Course Schedule (LeetCode #207)
 * ============================================================================
 *
 * There are a total of numCourses courses you have to take, labeled from
 * 0 to numCourses - 1. You are given an array prerequisites where
 * prerequisites[i] = [ai, bi] indicates that you must take course bi
 * first if you want to take course ai.
 *
 * Return true if you can finish all courses. Otherwise, return false.
 *
 * Example 1:
 *
 *   0 --> 1
 *
 * Input: numCourses = 2, prerequisites = [[1,0]]
 * Output: true
 * Explanation: Take course 0 first, then course 1.
 *
 * Example 2:
 *
 *   0 --> 1
 *   ^     |
 *   |_____|
 *
 * Input: numCourses = 2, prerequisites = [[1,0],[0,1]]
 * Output: false
 * Explanation: Course 0 requires 1, but 1 requires 0. Cycle = impossible!
 *
 * Example 3:
 *
 *   0 --> 1 --> 2
 *         |
 *         v
 *         3
 *
 * Input: numCourses = 4, prerequisites = [[1,0],[2,1],[3,1]]
 * Output: true
 * Explanation: 0 -> 1 -> 2 and 0 -> 1 -> 3
 *
 * Constraints:
 * - 1 <= numCourses <= 2000
 * - 0 <= prerequisites.length <= 5000
 * - prerequisites[i].length == 2
 * - 0 <= ai, bi < numCourses
 * - All pairs [ai, bi] are distinct
 *
 * ============================================================================
 * INTUITION: Cycle Detection in Directed Graph (3-State DFS)
 * ============================================================================
 *
 * Core Insight:
 * - This is a DIRECTED graph (prerequisites have direction)
 * - Can finish all courses = No cycles in the graph
 * - Different from undirected cycle detection!
 *
 * Why 3 states instead of 2?
 *
 *        0 --> 1 --> 2
 *              |
 *              v
 *              3
 *
 * With 2 states (visited/unvisited):
 * - DFS from 0: visits 1, 2, 3 (marks all visited)
 * - If we later check 1, it's "visited" but NOT a cycle!
 *
 * 3-State System:
 * - 0 = UNVISITED: Haven't seen this node yet
 * - 1 = VISITING: Currently in recursion stack (path from start)
 * - 2 = VISITED: Fully processed, all descendants checked
 *
 * Cycle Detection:
 * - If we hit a node with state=1 (VISITING), we found a cycle!
 * - We're still on the path from that node, so it's a back edge
 *
 * Algorithm:
 * 1. Build adjacency list (prereq -> courses that need it)
 * 2. DFS from each unvisited node
 * 3. Mark node as VISITING before exploring neighbors
 * 4. If neighbor is VISITING -> CYCLE FOUND
 * 5. Mark node as VISITED after all neighbors explored
 * 6. No cycles = can finish all courses
 *
 * Time Complexity: O(V + E) - visit each node and edge once
 * Space Complexity: O(V + E) - adjacency list + recursion stack
 * ============================================================================
 */

/**
 * @param {number} numCourses
 * @param {number[][]} prerequisites
 * @return {boolean}
 */
const canFinish = (numCourses, prerequisites) => {
  // Step 1: Build Adjacency List
  // graph[i] = courses that depend on course i
  const graph = Array.from({ length: numCourses }, () => []);

  for (let [course, prereq] of prerequisites) {
    graph[prereq].push(course); // prereq -> course
  }

  // State array: 0 = Unvisited, 1 = Visiting, 2 = Visited
  const state = new Array(numCourses).fill(0);

  /**
   * DFS to detect cycles
   * @param {number} node - current course
   * @returns {boolean} true if cycle found
   */
  const hasCycle = (node) => {
    // VISITING state means we're still on current path -> CYCLE!
    if (state[node] === 1) return true;

    // VISITED state means fully processed -> safe, no need to check again
    if (state[node] === 2) return false;

    // Mark as VISITING (currently in recursion stack)
    state[node] = 1;

    // Check all dependent courses
    for (let neighbor of graph[node]) {
      if (hasCycle(neighbor)) return true;
    }

    // Done with all descendants, mark as VISITED (safe)
    state[node] = 2;
    return false;
  };

  // Step 2: Check each course for cycles
  for (let i = 0; i < numCourses; i++) {
    if (state[i] === 0) {
      if (hasCycle(i)) {
        return false; // Cycle found -> cannot finish
      }
    }
  }

  return true; // No cycles -> can finish all courses
};

// ============================================================================
// ALTERNATIVE: BFS (Kahn's Algorithm - Topological Sort)
// ============================================================================
const canFinishBFS = (numCourses, prerequisites) => {
  const graph = Array.from({ length: numCourses }, () => []);
  const inDegree = new Array(numCourses).fill(0);

  // Build graph and count in-degrees
  for (let [course, prereq] of prerequisites) {
    graph[prereq].push(course);
    inDegree[course]++;
  }

  // Start with courses that have no prerequisites
  const queue = [];
  for (let i = 0; i < numCourses; i++) {
    if (inDegree[i] === 0) queue.push(i);
  }

  let completed = 0;

  while (queue.length > 0) {
    const course = queue.shift();
    completed++;

    for (let nextCourse of graph[course]) {
      inDegree[nextCourse]--;
      if (inDegree[nextCourse] === 0) {
        queue.push(nextCourse);
      }
    }
  }

  // If we completed all courses, no cycle exists
  return completed === numCourses;
};

// ============================================================================
// TEST CASES
// ============================================================================

// Test 1: Simple chain (can finish)
console.log("Test 1:", canFinish(2, [[1, 0]]));
// Expected: true (Take 0, then 1)

// Test 2: Simple cycle (cannot finish)
console.log(
  "Test 2:",
  canFinish(2, [
    [1, 0],
    [0, 1],
  ])
);
// Expected: false (0 needs 1, 1 needs 0)

// Test 3: No prerequisites
console.log("Test 3:", canFinish(3, []));
// Expected: true (No dependencies)

// Test 4: Complex valid graph
console.log(
  "Test 4:",
  canFinish(4, [
    [1, 0],
    [2, 1],
    [3, 1],
  ])
);
// Expected: true (0 -> 1 -> 2,3)

// Test 5: Complex cycle
console.log(
  "Test 5:",
  canFinish(4, [
    [1, 0],
    [2, 1],
    [0, 2],
  ])
);
// Expected: false (0 -> 1 -> 2 -> 0)

// Test 6: Multiple components, one has cycle
console.log(
  "Test 6:",
  canFinish(4, [
    [1, 0],
    [3, 2],
    [2, 3],
  ])
);
// Expected: false (2 <-> 3 is a cycle)

// Test 7: Diamond dependency (valid)
console.log(
  "Test 7:",
  canFinish(4, [
    [1, 0],
    [2, 0],
    [3, 1],
    [3, 2],
  ])
);
// Expected: true (0 -> 1,2 -> 3)

// Test 8: Single course
console.log("Test 8:", canFinish(1, []));
// Expected: true

// Test 9: BFS approach
console.log("\n--- BFS Approach ---");
console.log("Test 9:", canFinishBFS(2, [[1, 0]]));
// Expected: true

console.log(
  "Test 10:",
  canFinishBFS(2, [
    [1, 0],
    [0, 1],
  ])
);
// Expected: false
