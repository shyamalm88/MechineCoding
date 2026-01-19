/**
 * ============================================================================
 * PROBLEM: Number of Provinces (LeetCode #547)
 * ============================================================================
 *
 * There are n cities. Some of them are connected, while some are not.
 * If city a is connected directly with city b, and city b is connected
 * directly with city c, then city a is connected indirectly with city c.
 *
 * A province is a group of directly or indirectly connected cities and no
 * other cities outside of the group.
 *
 * You are given an n x n matrix isConnected where isConnected[i][j] = 1
 * if the ith city and the jth city are directly connected, and
 * isConnected[i][j] = 0 otherwise.
 *
 * Return the total number of provinces.
 *
 * Example 1:
 *
 *   City 0 ---- City 1
 *
 *   City 2 (isolated)
 *
 * Input: isConnected = [[1,1,0],[1,1,0],[0,0,1]]
 * Output: 2
 * Explanation: City 0 and 1 are connected (province 1). City 2 alone (province 2).
 *
 * Example 2:
 *
 *   City 0     City 1     City 2
 *   (each isolated)
 *
 * Input: isConnected = [[1,0,0],[0,1,0],[0,0,1]]
 * Output: 3
 * Explanation: Each city is its own province.
 *
 * Example 3:
 *
 *   City 0 ---- City 1 ---- City 2
 *
 * Input: isConnected = [[1,1,0],[1,1,1],[0,1,1]]
 * Output: 1
 * Explanation: All cities are connected in one province.
 *
 * Constraints:
 * - 1 <= n <= 200
 * - n == isConnected.length
 * - n == isConnected[i].length
 * - isConnected[i][j] is 1 or 0
 * - isConnected[i][i] == 1 (city is always connected to itself)
 * - isConnected[i][j] == isConnected[j][i] (symmetric matrix)
 *
 * ============================================================================
 * INTUITION: Count Connected Components (DFS)
 * ============================================================================
 *
 * This is the classic "count connected components" problem!
 *
 * Key Observations:
 * - isConnected is an ADJACENCY MATRIX (not adjacency list)
 * - isConnected[i][j] = 1 means city i and j are directly connected
 * - A province = one connected component in the graph
 *
 * Algorithm:
 * 1. Keep a visited array to track which cities we've seen
 * 2. For each unvisited city:
 *    a. Increment province count (found a new province!)
 *    b. DFS to visit all cities in this province
 * 3. Return total province count
 *
 * Why DFS works:
 * - Starting from any city, DFS reaches ALL cities in the same province
 * - After DFS, all cities in that province are marked visited
 * - Next unvisited city must be in a DIFFERENT province
 *
 * Visual:
 *
 *   [1,1,0]      0 -- 1    2
 *   [1,1,0]  =>
 *   [0,0,1]      Province 1   Province 2
 *
 *   DFS from 0: visits 0, 1 (marks both visited)
 *   DFS from 2: visits 2 (marks visited)
 *   Total: 2 provinces
 *
 * Time Complexity: O(N^2) - check all cells in N×N matrix
 * Space Complexity: O(N) - visited array + recursion stack
 * ============================================================================
 */

/**
 * @param {number[][]} isConnected
 * @return {number}
 */
const findCircleNum = (isConnected) => {
  const n = isConnected.length;

  // visited[i] = 1 means city i already belongs to some province
  const visited = new Array(n).fill(0);

  // Count of provinces
  let count = 0;

  /**
   * DFS: Visit all cities in the same province
   * @param {number} city - current city to explore
   */
  const dfs = (city) => {
    // Mark current city as visited
    visited[city] = 1;

    // Check all other cities for direct connections
    for (let neighbor = 0; neighbor < n; neighbor++) {
      // If connected AND not visited yet, explore it
      if (isConnected[city][neighbor] === 1 && visited[neighbor] === 0) {
        dfs(neighbor);
      }
    }
  };

  // Try starting DFS from every city
  for (let i = 0; i < n; i++) {
    // If city i is not visited, it's a new province
    if (visited[i] === 0) {
      count++; // Found a new province!
      dfs(i); // Mark all cities in this province as visited
    }
  }

  return count;
};

// ============================================================================
// ALTERNATIVE: BFS Approach
// ============================================================================
const findCircleNumBFS = (isConnected) => {
  const n = isConnected.length;
  const visited = new Array(n).fill(0);
  let count = 0;

  for (let i = 0; i < n; i++) {
    if (visited[i] === 0) {
      count++;

      // BFS from city i
      const queue = [i];
      visited[i] = 1;

      while (queue.length > 0) {
        const city = queue.shift();

        for (let neighbor = 0; neighbor < n; neighbor++) {
          if (isConnected[city][neighbor] === 1 && visited[neighbor] === 0) {
            visited[neighbor] = 1;
            queue.push(neighbor);
          }
        }
      }
    }
  }

  return count;
};

// ============================================================================
// ALTERNATIVE: Union-Find (Disjoint Set Union)
// ============================================================================
const findCircleNumUnionFind = (isConnected) => {
  const n = isConnected.length;

  // Initially, each city is its own parent (separate component)
  const parent = Array.from({ length: n }, (_, i) => i);
  const rank = new Array(n).fill(0);

  // Find with path compression
  const find = (x) => {
    if (parent[x] !== x) {
      parent[x] = find(parent[x]);
    }
    return parent[x];
  };

  // Union by rank
  const union = (x, y) => {
    const px = find(x);
    const py = find(y);
    if (px === py) return;

    if (rank[px] < rank[py]) {
      parent[px] = py;
    } else if (rank[px] > rank[py]) {
      parent[py] = px;
    } else {
      parent[py] = px;
      rank[px]++;
    }
  };

  // Union connected cities
  for (let i = 0; i < n; i++) {
    for (let j = i + 1; j < n; j++) {
      if (isConnected[i][j] === 1) {
        union(i, j);
      }
    }
  }

  // Count unique parents (provinces)
  let count = 0;
  for (let i = 0; i < n; i++) {
    if (find(i) === i) count++;
  }

  return count;
};

// ============================================================================
// TEST CASES
// ============================================================================

// Test 1: Two provinces
console.log(
  "Test 1:",
  findCircleNum([
    [1, 1, 0],
    [1, 1, 0],
    [0, 0, 1],
  ])
);
// Expected: 2

// Test 2: Each city is its own province
console.log(
  "Test 2:",
  findCircleNum([
    [1, 0, 0],
    [0, 1, 0],
    [0, 0, 1],
  ])
);
// Expected: 3

// Test 3: All cities connected (one province)
console.log(
  "Test 3:",
  findCircleNum([
    [1, 1, 1],
    [1, 1, 1],
    [1, 1, 1],
  ])
);
// Expected: 1

// Test 4: Chain connection
console.log(
  "Test 4:",
  findCircleNum([
    [1, 1, 0],
    [1, 1, 1],
    [0, 1, 1],
  ])
);
// Expected: 1 (0-1-2 chain = all connected)

// Test 5: Single city
console.log("Test 5:", findCircleNum([[1]]));
// Expected: 1

// Test 6: Two cities connected
console.log(
  "Test 6:",
  findCircleNum([
    [1, 1],
    [1, 1],
  ])
);
// Expected: 1

// Test 7: Two cities not connected
console.log(
  "Test 7:",
  findCircleNum([
    [1, 0],
    [0, 1],
  ])
);
// Expected: 2

// Test 8: BFS approach
console.log("\n--- BFS Approach ---");
console.log(
  "Test 8:",
  findCircleNumBFS([
    [1, 1, 0],
    [1, 1, 0],
    [0, 0, 1],
  ])
);
// Expected: 2

// Test 9: Union-Find approach
console.log("\n--- Union-Find Approach ---");
console.log(
  "Test 9:",
  findCircleNumUnionFind([
    [1, 1, 0],
    [1, 1, 0],
    [0, 0, 1],
  ])
);
// Expected: 2

// Test 10: Larger example
console.log(
  "\nTest 10:",
  findCircleNum([
    [1, 0, 0, 1],
    [0, 1, 1, 0],
    [0, 1, 1, 1],
    [1, 0, 1, 1],
  ])
);
// Expected: 1 (all connected through various paths)
