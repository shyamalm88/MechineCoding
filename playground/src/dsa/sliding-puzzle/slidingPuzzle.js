function slidingPuzzle(board) {
  const start = board.flat().join("");
  const target = "123450";

  // Precomputed neighbors for each index of '0'
  const neighbors = {
    0: [1, 3],
    1: [0, 2, 4],
    2: [1, 5],
    3: [0, 4],
    4: [1, 3, 5],
    5: [2, 4],
  };

  const queue = [[start, 0]];
  const visited = new Set([start]);

  while (queue.length > 0) {
    const [state, steps] = queue.shift();

    if (state === target) return steps;

    const zeroIdx = state.indexOf("0");

    for (const nei of neighbors[zeroIdx]) {
      const chars = state.split("");
      [chars[zeroIdx], chars[nei]] = [chars[nei], chars[zeroIdx]];
      const nextState = chars.join("");

      if (!visited.has(nextState)) {
        visited.add(nextState);
        queue.push([nextState, steps + 1]);
      }
    }
  }

  return -1;
}
