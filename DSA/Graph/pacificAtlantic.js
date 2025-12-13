/**
 * @param {number[][]} heights
 * @return {number[][]}
 */
var pacificAtlantic = function (heights) {
  // 1. Edge Case: Always handle empty inputs
  if (!heights || heights.length === 0) return [];

  const rows = heights.length;
  const cols = heights[0].length;

  // We use Sets to track which cells can reach each ocean.
  // We store coordinates as strings "r-c" because JS Sets compare objects by reference,
  // so storing arrays like [r,c] directly wouldn't work for uniqueness checks.
  const pacificReachable = new Set();
  const atlanticReachable = new Set();

  /**
   * DFS Helper (The "Rescue Climber")
   * @param {number} r - Current Row
   * @param {number} c - Current Col
   * @param {Set} visitSet - The Set we are currently filling (Pacific or Atlantic)
   * @param {number} prevHeight - The height of the cell we came FROM
   */
  const dfs = (r, c, visitSet, prevHeight) => {
    const key = `${r}-${c}`;

    // 🛑 STOP CONDITIONS (The "Bouncer" Logic)
    if (
      // A. Bounds Check: Are we off the map?
      r < 0 ||
      r >= rows ||
      c < 0 ||
      c >= cols ||
      // B. Visited Check: Have we already marked this cell for this ocean?
      visitSet.has(key) ||
      // C. The "Uphill" Rule (CRITICAL LOGIC):
      // We are moving backwards from the Ocean to the Mountain.
      // Normal water flows High -> Low.
      // So our reverse-search must go Low -> High (or Equal).
      // If the current cell is SHORTER than where we came from, water couldn't flow down to us.
      heights[r][c] < prevHeight
    ) {
      return;
    }

    // ✅ MARK AS REACHABLE
    visitSet.add(key);

    // 🔄 RECURSE: Visit all 4 neighbors
    // Note: We pass the CURRENT cell's height as the new 'prevHeight' limit.
    // The neighbor must be taller or equal to THIS cell to continue the path.
    dfs(r + 1, c, visitSet, heights[r][c]);
    dfs(r - 1, c, visitSet, heights[r][c]);
    dfs(r, c + 1, visitSet, heights[r][c]);
    dfs(r, c - 1, visitSet, heights[r][c]);
  };

  // 2. Start DFS from the Oceans (The Edges)

  // Loop through every ROW (Left and Right edges)
  for (let i = 0; i < rows; i++) {
    dfs(i, 0, pacificReachable, heights[i][0]); // Left Edge -> Pacific
    dfs(i, cols - 1, atlanticReachable, heights[i][cols - 1]); // Right Edge -> Atlantic
  }

  // Loop through every COLUMN (Top and Bottom edges)
  for (let i = 0; i < cols; i++) {
    dfs(0, i, pacificReachable, heights[0][i]); // Top Edge -> Pacific
    dfs(rows - 1, i, atlanticReachable, heights[rows - 1][i]); // Bottom Edge -> Atlantic
  }

  // 3. Find the Intersection
  // Iterate through the grid one last time.
  // If a cell is in BOTH sets, it means water flows to both oceans.
  const result = [];
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const key = `${r}-${c}`;
      if (pacificReachable.has(key) && atlanticReachable.has(key)) {
        result.push([r, c]);
      }
    }
  }

  return result;
};
