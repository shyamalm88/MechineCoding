/**
 * @param {number} numCourses
 * @param {number[][]} prerequisites
 * @return {boolean}
 */
const canFinish = (numCourses, prerequisites) => {
  // 1. Build Adjacency List
  let graph = Array.from({ length: numCourses }, () => []);

  for (let [course, pre] of prerequisites) {
    graph[pre].push(course);
  }

  // 0: Unvisited, 1: Visiting (Danger), 2: Visited (Safe)
  let state = new Array(numCourses).fill(0);

  const hasCycle = (node) => {
    // Found a node in current recursion stack -> CYCLE!
    if (state[node] === 1) return true;

    // Already finished this node -> SAFE.
    if (state[node] === 2) return false;

    // Mark as Visiting (1)
    state[node] = 1;

    for (let neighbor of graph[node]) {
      if (hasCycle(neighbor)) return true;
    }

    // Mark as Visited (2)
    state[node] = 2;
    return false;
  };

  for (let i = 0; i < numCourses; i++) {
    // Optimization: Only check if we haven't visited it yet
    if (state[i] === 0) {
      if (hasCycle(i)) {
        return false; // 🛑 Found a cycle? Return FALSE (Cannot finish).
      }
    }
  }

  return true; // ✅ No cycles found? Return TRUE (Can finish).
};
