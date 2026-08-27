# Same Tree (LeetCode #100)

## Category

🔵 CORE (Tree Comparison / Structural Equality)

Given the roots of two binary trees p and q,
return true if they are the SAME.

Two trees are the same if:
- They have the same structure
- They have the same values at each node

Example:

```text
    Tree 1:        Tree 2:
       1              1
      / \            / \
     2   3          2   3
```

Output: true

INTUITION

Two trees are the same IF AND ONLY IF:

1️⃣ Both nodes are null → same
2️⃣ One is null, the other is not → different
3️⃣ Values differ → different
4️⃣ Left subtrees are same AND right subtrees are same

This is a PURE structural recursion problem.

SUBTREE QUESTION

Ask:
```text
  “Are these two subtrees identical?”
```

The parent just combines answers.

BASE CASES (VERY IMPORTANT)

- p === null && q === null → true
- p === null || q === null → false

Order matters here.

TRAVERSAL TYPE

PREORDER-style logical comparison:
- check current node
- then recurse to children

TIME & SPACE COMPLEXITY

Time:  O(n)   (compare every node)
Space: O(h)   (recursion stack)

WHY THIS IS 🔵 CORE

This problem tests:
- base case discipline
- structural recursion
- careful null handling

Interviewers LOVE this as a warm-up.
