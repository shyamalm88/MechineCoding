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
// TEST CASES
// ============================================================================

// Test 1: Two provinces
console.log(
  "Test 1:",
  findCircleNum([
    [1, 1, 0],
    [1, 1, 0],
    [0, 0, 1],
  ]),
);
// Expected: 2

// Test 2: Each city is its own province
console.log(
  "Test 2:",
  findCircleNum([
    [1, 0, 0],
    [0, 1, 0],
    [0, 0, 1],
  ]),
);
// Expected: 3

// Test 3: All cities connected (one province)
console.log(
  "Test 3:",
  findCircleNum([
    [1, 1, 1],
    [1, 1, 1],
    [1, 1, 1],
  ]),
);
// Expected: 1

// Test 4: Chain connection
console.log(
  "Test 4:",
  findCircleNum([
    [1, 1, 0],
    [1, 1, 1],
    [0, 1, 1],
  ]),
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
  ]),
);
// Expected: 1

// Test 7: Two cities not connected
console.log(
  "Test 7:",
  findCircleNum([
    [1, 0],
    [0, 1],
  ]),
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
  ]),
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
  ]),
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
  ]),
);
// Expected: 1 (all connected through various paths)
