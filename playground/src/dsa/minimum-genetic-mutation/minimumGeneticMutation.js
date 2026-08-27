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
