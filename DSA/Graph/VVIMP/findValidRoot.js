function findValidRoot(n, adj, colors, sequence) {
  // sequence could be ['R', 'B', 'W']
  for (let i = 0; i < n; i++) {
    if (adj[i].length > 2) continue; // Root cannot have 3 children

    if (isValidRoot(i, adj, colors, sequence)) return i;
  }
  return -1;
}

function isValidRoot(root, adj, colors, sequence) {
  const q = [[root, 0]];
  const visited = new Set([root]);
  const seqLen = sequence.length;

  while (q.length > 0) {
    const [u, dist] = q.shift();

    // Check if color matches the expected sequence for this depth
    if (colors[u] !== sequence[dist % seqLen]) return false;

    let childrenCount = 0;
    for (const v of adj[u]) {
      if (!visited.has(v)) {
        visited.add(v);
        childrenCount++;
        q.push([v, dist + 1]);
      }
    }
    if (childrenCount > 2) return false; // Must stay binary
  }
  return true;
}
