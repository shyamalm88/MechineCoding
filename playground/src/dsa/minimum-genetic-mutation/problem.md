# Minimum Genetic Mutation (LeetCode #433)

## Category

🟢 IMPORTANT (BFS on Implicit Graph)

A gene string consists of 8 characters, each being one of:
```text
  'A', 'C', 'G', 'T'
```

You are given:
- startGene
- endGene
- bank[] : list of valid gene strings

A mutation:
- Changes EXACTLY one character
- Resulting gene must exist in the bank

Return the MINIMUM number of mutations needed to transform
startGene → endGene.
If impossible, return -1.

Example 1:

```text
  start = "AACCGGTT"
  end   = "AACCGGTA"
  bank  = ["AACCGGTA"]
```

```text
  Output: 1
```

Example 2:

```text
  start = "AACCGGTT"
  end   = "AAACGGTA"
  bank  = ["AACCGGTA","AACCGCTA","AAACGGTA"]
```

```text
  Output: 2
```

Constraints:
- All gene strings have length 8
- bank size <= 10

## Intuition

This Is a Graph — Even Though You Can’t See It

This problem does NOT give you edges.

Key Insight (VERY IMPORTANT):

```text
  Each gene string is a NODE.
  An edge exists between two genes
  IF they differ by exactly ONE character.
```

This is called an IMPLICIT GRAPH.

We must:
- Generate neighbors ON THE FLY
- Instead of reading an adjacency list

WHY BFS IS THE CORRECT ALGORITHM

Each mutation:
- Has equal cost (1 step)

We want:
- Minimum number of mutations

This is EXACTLY the definition of:
```text
  ➤ Shortest path in an unweighted graph
```

So:
- BFS is the correct and optimal choice

STATE MODELING

State = currentGene

Transition:
- Change one position (0..7)
- Try all 4 characters
- Result must be in bank

Visited:
- A gene should NOT be visited twice

ALGORITHM (BFS)

1. Put all bank genes into a Set for O(1) lookup

2. If endGene not in bank → return -1

3. BFS queue:
```text
     [gene, steps]
```

4. For each gene:
```text
     - Generate all valid one-char mutations
     - If mutation is in bank and not visited:
          enqueue
```

5. First time reaching endGene → return steps

TIME & SPACE COMPLEXITY

Let:
- B = size of bank (≤ 10)
- L = gene length (8)

Time:
```text
  O(B × L × 4)
```

Space:
```text
  O(B)
```

WHY THIS PROBLEM IS 🟢 IMPORTANT

Interviewers are testing:
- BFS instinct WITHOUT adjacency list
- Ability to generate neighbors safely
- Proper visited handling

This is a direct cousin of:
- Word Ladder
- Open the Lock
