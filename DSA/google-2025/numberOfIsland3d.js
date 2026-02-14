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
