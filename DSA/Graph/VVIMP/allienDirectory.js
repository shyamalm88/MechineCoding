/**
 * Alien Dictionary - Topological Sort (Kahn's Algorithm)
 * Time: O(C) where C is the total length of all words
 * Space: O(1) because the alphabet size is fixed (26)
 */
function alienOrder(words) {
  const adj = new Map();
  const inDegree = new Map();

  // 1. Initialize graph for every unique character
  for (const word of words) {
    for (const char of word) {
      if (!adj.has(char)) {
        adj.set(char, new Set());
        inDegree.set(char, 0);
      }
    }
  }

  // 2. Build edges by comparing adjacent words
  for (let i = 0; i < words.length - 1; i++) {
    const w1 = words[i],
      w2 = words[i + 1];

    // Edge Case: Prefix check (e.g., ["apple", "app"])
    if (w1.length > w2.length && w1.startsWith(w2)) return "";

    for (let j = 0; j < Math.min(w1.length, w2.length); j++) {
      if (w1[j] !== w2[j]) {
        if (!adj.get(w1[j]).has(w2[j])) {
          adj.get(w1[j]).add(w2[j]);
          inDegree.set(w2[j], inDegree.get(w2[j]) + 1);
        }
        break; // Only the first differing character defines the order
      }
    }
  }

  // 3. BFS (Kahn's Algorithm)
  const queue = [];
  for (const [char, degree] of inDegree) {
    if (degree === 0) queue.push(char);
  }

  let result = "";
  while (queue.length) {
    const char = queue.shift();
    result += char;

    for (const neighbor of adj.get(char)) {
      inDegree.set(neighbor, inDegree.get(neighbor) - 1);
      if (inDegree.get(neighbor) === 0) {
        queue.push(neighbor);
      }
    }
  }

  // 4. If result length < unique chars, there was a cycle
  return result.length === inDegree.size ? result : "";
}
