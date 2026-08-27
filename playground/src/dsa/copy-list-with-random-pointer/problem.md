# Copy List with Random Pointer (LeetCode #138)

> Copy List with Random Pointer (LeetCode #138)

Deep-copy a list where each node has `next` AND a `random` pointer to any
node (or null).

## Intuition

The difficulty is that when you copy node A, its `random` may point at a node
you have not created yet. Two standard answers:

```text
  1. HashMap (O(n) space) — pass 1 clones every node into a Map<old,new>;
     pass 2 wires next/random by looking up the originals.
```

```text
  2. Interleaving (O(1) extra space) — weave clones into the original list
     so every clone sits directly AFTER its original. Then
     `clone.random = original.random.next` works because "the clone of X" is
     always "X.next". Finally unzip the two lists apart.
```

DRY RUN (interleaved): A → B
```text
  weave  : A → A' → B → B'
  random : A.random=B ⇒ A'.random = B.next = B'
  unzip  : A → B  and  A' → B'
```

## Time

O(n) both   SPACE: O(n) map / O(1) interleaved
