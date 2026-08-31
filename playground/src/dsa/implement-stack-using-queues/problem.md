# Implement Stack using Queues (LeetCode #225)

## Intuition

A queue is FIFO; a stack is LIFO. To reverse the order you pay somewhere —
the design decision is WHICH operation absorbs the cost.

This implementation makes PUSH expensive with a single queue: after enqueuing
the new element, rotate every earlier element to the back. The newest item
ends up at the front, so pop/top become O(1).

```text
  push(1): [1]
  push(2): [2,1]   (enqueue 2 → [1,2], rotate once → [2,1])
  push(3): [3,2,1]
```

The alternative (two queues, costly pop) is the other accepted answer; say
which you chose and why.

## Complexity

TIME: push O(n), pop/top/empty O(1) · SPACE: O(n)
