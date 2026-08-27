# Average of Levels in Binary Tree (LeetCode #637)

> Average of Levels in Binary Tree (LeetCode #637)

## Intuition

Any "per level" question is BFS with a LEVEL SNAPSHOT: capture the queue
length before processing, then consume exactly that many nodes. Those are
precisely the nodes of the current depth, so the average is well defined.

Without the snapshot, children enqueued during the loop get mixed into the
same level and the averages are wrong — the single most common bug in
level-order problems.

## Time

O(n)   SPACE: O(w) where w is the widest level
