/**
 * Minimum Area Rectangle II
 * @param {number[][]} points
 * @return {number}
 */
function minAreaFreeRect(points) {
  const map = new Map();
  let minArea = Infinity;

  const n = points.length;

  // Step 1: Store all diagonals by midpoint + length
  for (let i = 0; i < n; i++) {
    for (let j = i + 1; j < n; j++) {
      const [x1, y1] = points[i];
      const [x2, y2] = points[j];

      const mx = (x1 + x2) / 2;
      const my = (y1 + y2) / 2;

      const dx = x1 - x2;
      const dy = y1 - y2;
      const len = dx * dx + dy * dy;

      const key = `${mx},${my},${len}`;

      if (!map.has(key)) map.set(key, []);
      map.get(key).push([i, j]);
    }
  }

  // Step 2: Check each group
  for (const pairs of map.values()) {
    if (pairs.length < 2) continue;

    for (let i = 0; i < pairs.length; i++) {
      for (let j = i + 1; j < pairs.length; j++) {
        const [a, c] = pairs[i];
        const [b, d] = pairs[j];

        const [x1, y1] = points[a];
        const [x2, y2] = points[b];
        const [x3, y3] = points[c];

        // Compute two sides from point a
        const side1 = Math.hypot(x1 - x2, y1 - y2);
        const side2 = Math.hypot(x1 - x3, y1 - y3);

        const area = side1 * side2;
        minArea = Math.min(minArea, area);
      }
    }
  }

  return minArea === Infinity ? 0 : minArea;
}
