/**
 * ============================================================================
 * PROBLEM: Minimum Genetic Mutation (LeetCode #433)
 * CATEGORY: 🟢 IMPORTANT (BFS on Implicit Graph)
 * ============================================================================
 *
 * A gene string consists of 8 characters, each being one of:
 *   'A', 'C', 'G', 'T'
 *
 * You are given:
 * - startGene
 * - endGene
 * - bank[] : list of valid gene strings
 *
 * A mutation:
 * - Changes EXACTLY one character
 * - Resulting gene must exist in the bank
 *
 * Return the MINIMUM number of mutations needed to transform
 * startGene → endGene.
 * If impossible, return -1.
 *
 * ---------------------------------------------------------------------------
 * Example 1:
 *
 *   start = "AACCGGTT"
 *   end   = "AACCGGTA"
 *   bank  = ["AACCGGTA"]
 *
 *   Output: 1
 *
 * Example 2:
 *
 *   start = "AACCGGTT"
 *   end   = "AAACGGTA"
 *   bank  = ["AACCGGTA","AACCGCTA","AAACGGTA"]
 *
 *   Output: 2
 *
 * ---------------------------------------------------------------------------
 * Constraints:
 * - All gene strings have length 8
 * - bank size <= 10
 *
 * ============================================================================
 * INTUITION: This Is a Graph — Even Though You Can’t See It
 * ============================================================================
 *
 * This problem does NOT give you edges.
 *
 * Key Insight (VERY IMPORTANT):
 *
 *   Each gene string is a NODE.
 *   An edge exists between two genes
 *   IF they differ by exactly ONE character.
 *
 * This is called an IMPLICIT GRAPH.
 *
 * We must:
 * - Generate neighbors ON THE FLY
 * - Instead of reading an adjacency list
 *
 * ============================================================================
 * WHY BFS IS THE CORRECT ALGORITHM
 * ============================================================================
 *
 * Each mutation:
 * - Has equal cost (1 step)
 *
 * We want:
 * - Minimum number of mutations
 *
 * This is EXACTLY the definition of:
 *   ➤ Shortest path in an unweighted graph
 *
 * So:
 * - BFS is the correct and optimal choice
 *
 * ============================================================================
 * STATE MODELING
 * ============================================================================
 *
 * State = currentGene
 *
 * Transition:
 * - Change one position (0..7)
 * - Try all 4 characters
 * - Result must be in bank
 *
 * Visited:
 * - A gene should NOT be visited twice
 *
 * ============================================================================
 * ALGORITHM (BFS)
 * ============================================================================
 *
 * 1. Put all bank genes into a Set for O(1) lookup
 *
 * 2. If endGene not in bank → return -1
 *
 * 3. BFS queue:
 *      [gene, steps]
 *
 * 4. For each gene:
 *      - Generate all valid one-char mutations
 *      - If mutation is in bank and not visited:
 *           enqueue
 *
 * 5. First time reaching endGene → return steps
 *
 * ============================================================================
 * TIME & SPACE COMPLEXITY
 * ============================================================================
 *
 * Let:
 * - B = size of bank (≤ 10)
 * - L = gene length (8)
 *
 * Time:
 *   O(B × L × 4)
 *
 * Space:
 *   O(B)
 *
 * ============================================================================
 * WHY THIS PROBLEM IS 🟢 IMPORTANT
 * ============================================================================
 *
 * Interviewers are testing:
 * - BFS instinct WITHOUT adjacency list
 * - Ability to generate neighbors safely
 * - Proper visited handling
 *
 * This is a direct cousin of:
 * - Word Ladder
 * - Open the Lock
 * ============================================================================
 */

function minMutation(startGene, endGene, bank) {
  const bankSet = new Set(bank);
  if (!bankSet.has(endGene)) return -1;

  const genes = ["A", "C", "G", "T"];
  const visited = new Set([startGene]);
  const queue = [[startGene, 0]];

  while (queue.length > 0) {
    const [gene, steps] = queue.shift();

    if (gene === endGene) return steps;

    const chars = gene.split("");

    for (let i = 0; i < chars.length; i++) {
      const original = chars[i];

      for (const g of genes) {
        if (g === original) continue;

        chars[i] = g;
        const mutated = chars.join("");

        if (bankSet.has(mutated) && !visited.has(mutated)) {
          visited.add(mutated);
          queue.push([mutated, steps + 1]);
        }
      }

      chars[i] = original; // restore
    }
  }

  return -1;
}

// ============================================================================
// TEST CASES
// ============================================================================
console.log("=== Minimum Genetic Mutation Tests ===\n");

console.log("Test 1:", minMutation("AACCGGTT", "AACCGGTA", ["AACCGGTA"])); // Expected: 1
console.log(
  "Test 2:",
  minMutation("AACCGGTT", "AAACGGTA", ["AACCGGTA", "AACCGCTA", "AAACGGTA"])
); // Expected: 2
console.log("Test 3:", minMutation("AACCGGTT", "AACCGGTA", [])); // Expected: -1 (endGene not in bank)

module.exports = { minMutation };
