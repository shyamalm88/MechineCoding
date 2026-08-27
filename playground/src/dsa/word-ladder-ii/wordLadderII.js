// ============================================================================
// APPROACH: BFS + DFS (Backtracking)
// ============================================================================
/**
 * INTUITION:
 * To find ALL shortest paths, we need two steps:
 * 1. BFS: Find the shortest distance from beginWord to every other word.
 *    While doing BFS, we build a "parents" graph (DAG).
 *    - If we reach a word for the first time, record its distance and parent.
 *    - If we reach a word again at the SAME shortest distance, add the new parent.
 *    - This allows us to capture multiple paths of the same length.
 *
 * 2. DFS: Reconstruct paths from endWord back to beginWord using the parents graph.
 *    - Start at endWord.
 *    - Recursively visit all parents until we reach beginWord.
 *    - Collect the paths.
 *
 * Time Complexity: O(N * M * 26 + P), where P is the total length of all paths returned.
 * Space Complexity: O(N * M) to store the graph and distances.
 */
const findLadders = (beginWord, endWord, wordList) => {
  const wordSet = new Set(wordList);
  if (!wordSet.has(endWord)) return [];

  const graph = new Map(); // child -> parents
  let found = false;

  let q = [beginWord];
  const alphabet = "abcdefghijklmnopqrstuvwxyz";

  while (q.length && !found) {
    const size = q.length;
    const levelVisited = new Set();

    for (let i = 0; i < size; i++) {
      const word = q.shift();

      for (let j = 0; j < word.length; j++) {
        for (let ch of alphabet) {
          if (ch === word[j]) continue;

          const newWord = word.slice(0, j) + ch + word.slice(j + 1);

          if (!wordSet.has(newWord)) continue;

          if (!graph.has(newWord)) graph.set(newWord, []);
          graph.get(newWord).push(word);

          if (newWord === endWord) found = true;

          if (!levelVisited.has(newWord)) {
            levelVisited.add(newWord);
            q.push(newWord);
          }
        }
      }
    }

    // remove words visited in this level only
    for (let w of levelVisited) wordSet.delete(w);
  }

  if (!found) return [];

  // Phase 2: DFS
  const result = [];
  const path = [endWord];

  const dfs = (word) => {
    if (word === beginWord) {
      result.push([...path].reverse());
      return;
    }

    for (let parent of graph.get(word) || []) {
      path.push(parent);
      dfs(parent);
      path.pop();
    }
  };

  dfs(endWord);
  return result;
};

// ============================================================================
// TEST CASES
// ============================================================================
console.log("=== Word Ladder II Tests ===\n");

console.log(
  "Test 1:",
  findLadders("hit", "cog", ["hot", "dot", "dog", "lot", "log", "cog"])
);
// Expected: [["hit","hot","dot","dog","cog"],["hit","hot","lot","log","cog"]]

console.log(
  "Test 2:",
  findLadders("hit", "cog", ["hot", "dot", "dog", "lot", "log"])
);
// Expected: []

module.exports = { findLadders };
