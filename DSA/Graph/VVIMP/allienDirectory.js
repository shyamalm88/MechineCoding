/**
 * ============================================================================
 * PROBLEM: Alien Dictionary (LeetCode #269, Premium)
 * CATEGORY: 🔴 VVIMP (Topological Sort — Order Extraction from Adjacent Pairs)
 * ============================================================================
 * There is a foreign language with its own alphabet, all using lowercase
 * English letters. You are given `words` — a list of words from this
 * language's dictionary, where the words are SORTED LEXICOGRAPHICALLY by
 * the rules of this foreign language.
 *
 * Derive the order of letters in this language. If the order is invalid
 * (a cycle, or a contradiction like a longer word being a prefix of a
 * shorter one), return "". If there are multiple valid orders, return any.
 *
 * Example 1:
 * Input: words = ["wrt","wrf","er","ett","rftt"]
 * Output: "wertf"
 *
 * Example 2:
 * Input: words = ["z","x"]
 * Output: "zx"
 *
 * Example 3 (cycle -> invalid):
 * Input: words = ["z","x","z"]
 * Output: ""
 *
 * Constraints:
 * - 1 <= words.length <= 100
 * - 1 <= words[i].length <= 100
 * - words[i] consists of lowercase English letters
 */

// ============================================================================
// APPROACH: Build a Letter Graph from Adjacent Word Pairs + Kahn's Algorithm
// ============================================================================
/**
 * STORY / INTUITION:
 * The dictionary is "sorted", but we only get to compare ADJACENT words —
 * each adjacent pair reveals exactly ONE ordering constraint: the first
 * pair of letters where they differ tells us "this letter comes before
 * that letter" in the alien alphabet. Everything after that first
 * difference is irrelevant (standard lexicographic comparison stops there).
 *
 * Build a directed graph: an edge u -> v means "u comes before v". Then a
 * valid overall ordering is just a TOPOLOGICAL SORT of this graph (Kahn's
 * algorithm: repeatedly remove nodes with in-degree 0). If the topological
 * sort can't include every letter, there's a CYCLE -> contradiction -> "".
 *
 * One sneaky edge case: if word A is a PREFIX of word B but comes AFTER it
 * (e.g., ["abc","ab"]), that's impossible in any ordering — return "".
 *
 * DRY RUN: words = ["wrt","wrf","er","ett","rftt"]
 * Compare adjacent pairs, take first differing char:
 *   "wrt" vs "wrf": differ at index 2 -> t before f   (t -> f)
 *   "wrf" vs "er":  differ at index 0 -> w before e   (w -> e)
 *   "er"  vs "ett": differ at index 1 -> r before t   (r -> t)
 *   "ett" vs "rftt": differ at index 0 -> e before r  (e -> r)
 *
 * Edges: t->f, w->e, r->t, e->r
 * In-degrees: w=0, e=1(from w), r=1(from e), t=1(from r), f=1(from t)
 * Kahn's: start with w (in-degree 0) -> "w"
 *   remove w -> e's in-degree becomes 0 -> "we"
 *   remove e -> r's in-degree becomes 0 -> "wer"
 *   remove r -> t's in-degree becomes 0 -> "wert"
 *   remove t -> f's in-degree becomes 0 -> "wertf"
 * Result: "wertf" ✓ (5 letters used, matches inDegree.size)
 *
 * Time:  O(C) where C = total length of all words (building edges)
 * Space: O(1) — alphabet size is fixed at 26
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

// ============================================================================
// TEST CASES
// ============================================================================
console.log("=== Alien Dictionary Tests ===\n");

console.log("Test 1:", alienOrder(["wrt", "wrf", "er", "ett", "rftt"])); // Expected: "wertf"
console.log("Test 2:", alienOrder(["z", "x"]));                          // Expected: "zx"
console.log("Test 3:", alienOrder(["z", "x", "z"]));                     // Expected: "" (cycle)
console.log("Test 4:", alienOrder(["abc", "ab"]));                       // Expected: "" (invalid prefix order)

module.exports = { alienOrder };
