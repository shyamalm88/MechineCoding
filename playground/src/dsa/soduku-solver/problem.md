# Sudoku Solver (LeetCode #37)

## Category

🔴 VVIMP (Backtracking + Constraint Propagation)

Solve a 9x9 Sudoku board.

Rules:
- Each row must contain digits 1–9
- Each column must contain digits 1–9
- Each 3x3 sub-box must contain digits 1–9

Empty cells are represented by '.'

Modify the board IN-PLACE.

INTUITION

Sudoku is NOT brute force.

Key Insight (CRITICAL):

```text
  Every choice restricts future choices.
```

So:
- We must check constraints BEFORE recursing
- Early pruning is everything

BACKTRACKING STATE

State:
- board
- current cell (row, col)

Choice:
- Try digits '1' → '9' that are valid

VALIDITY CHECK

A digit is valid if:
- Not in same row
- Not in same column
- Not in same 3x3 box

ALGORITHM

1. Find first empty cell
2. Try digits 1–9
3. If valid:
```text
     - place digit
     - recurse
     - if success → return true
```

4. If all fail:
```text
     - reset cell
     - backtrack
```

TIME COMPLEXITY

Exponential, but heavily pruned.

WHY THIS IS 🔴 VVIMP

Interviewers are testing:
- Constraint reasoning
- Correct pruning
- Clean recursion

This problem screams “strong problem solver”.
