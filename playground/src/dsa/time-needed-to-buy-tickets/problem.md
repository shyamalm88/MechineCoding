# Time Needed to Buy Tickets (LeetCode #2073)

Everyone in a queue buys one ticket per second, then rejoins the back if they
still need more. How long until person k finishes?

## Intuition

Simulating the queue works and is the obvious answer. The O(n) insight is
that you can just COUNT the tickets each person buys before k finishes:

```text
  in front of k (i < k) : min(tickets[i], tickets[k])
  behind k     (i > k)  : min(tickets[i], tickets[k] - 1)
```

The -1 is the crux: once k buys their last ticket the process stops, so
people behind never get that final round.

## Complexity

TIME: O(n) · SPACE: O(1)
