/**
 * ============================================================================
 * PROBLEM: Number of Islands II — 3D (Google follow-up, no official LC #)
 * ============================================================================
 * Generalization of LeetCode #305 to a 3D grid of size X x Y x Z, initially
 * all water (0). Given a stream of `positions = [[x,y,z], ...]` that each
 * turn a cell into land (1), return an array where result[i] is the number
 * of islands after the i-th cell is added. Two land cells are connected if
 * they are adjacent along exactly one axis (6-directional connectivity:
 * +-x, +-y, +-z).
 *
 * Example:
 * Input: X=2, Y=2, Z=2, positions = [[0,0,0],[1,0,0],[0,1,0],[0,0,1]]
 * Output: [1,1,1,1]   (every new cell touches the origin cell)
 *
 * Constraints:
 * 1 <= X, Y, Z <= 50
 * 1 <= positions.length <= 10^4
 */

// ============================================================================
// APPROACH: Union-Find over a flattened 3D index, same idea as LC305
// ============================================================================
/**
 * STORY / INTUITION:
 * Identical to the 2D version (LC305), but each cell (x,y,z) is flattened to
 * a single index `x*Y*Z + y*Z + z`, and each new cell checks 6 neighbors
 * (one step along each of the 3 axes, in both directions) instead of 4.
 *
 * DRY RUN: X=2,Y=2,Z=2, positions=[[0,0,0],[1,1,1]]
 *  (0,0,0): new island. count=1                -> result=[1]
 *  (1,1,1): new island (count=2). Its 6 neighbors are (0,1,1),(1,0,1),(1,1,0)
 *           (the +1 directions are out of bounds since X=Y=Z=2) — none are
 *           active land, so no merge.          -> result=[1,2]
 *
 * Time:  O(k * α(X*Y*Z)) for k positions.
 * Space: O(X*Y*Z) for the Union-Find arrays.
 */
class UnionFind {
  constructor(size) {
    this.parent = Array(size).fill(-1);
    this.count = 0;
  }

  add(x) {
    if (this.parent[x] !== -1) return;
    this.parent[x] = x;
    this.count++;
  }

  find(x) {
    if (this.parent[x] !== x) {
      this.parent[x] = this.find(this.parent[x]);
    }
    return this.parent[x];
  }

  union(x, y) {
    const rx = this.find(x);
    const ry = this.find(y);
    if (rx === ry) return;
    this.parent[ry] = rx;
    this.count--;
  }
}

function numIslands3D(X, Y, Z, positions) {
  const uf = new UnionFind(X * Y * Z);
  const active = new Set();
  const result = [];

  const directions = [
    [1, 0, 0],
    [-1, 0, 0],
    [0, 1, 0],
    [0, -1, 0],
    [0, 0, 1],
    [0, 0, -1],
  ];

  const index = (x, y, z) => x * Y * Z + y * Z + z;

  for (const [x, y, z] of positions) {
    const id = index(x, y, z);
    if (active.has(id)) {
      result.push(uf.count);
      continue;
    }

    active.add(id);
    uf.add(id);

    for (const [dx, dy, dz] of directions) {
      const nx = x + dx;
      const ny = y + dy;
      const nz = z + dz;

      if (nx >= 0 && ny >= 0 && nz >= 0 && nx < X && ny < Y && nz < Z) {
        const nid = index(nx, ny, nz);
        if (active.has(nid)) {
          uf.union(id, nid);
        }
      }
    }

    result.push(uf.count);
  }

  return result;
}

// ============================================================================
// TEST CASES
// ============================================================================
console.log("=== Number of Islands II (3D) Tests ===\n");

console.log(
  "Test 1 (all merge into one island):",
  numIslands3D(2, 2, 2, [
    [0, 0, 0],
    [1, 0, 0],
    [0, 1, 0],
    [0, 0, 1],
  ]),
);
// Expected: [1, 1, 1, 1]

console.log(
  "Test 2 (two separate islands, opposite corners):",
  numIslands3D(2, 2, 2, [
    [0, 0, 0],
    [1, 1, 1],
  ]),
);
// Expected: [1, 2]

console.log(
  "Test 3 (duplicate position):",
  numIslands3D(2, 2, 2, [
    [0, 0, 0],
    [0, 0, 0],
  ]),
);
// Expected: [1, 1]

module.exports = { numIslands3D };
