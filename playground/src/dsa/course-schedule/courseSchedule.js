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
