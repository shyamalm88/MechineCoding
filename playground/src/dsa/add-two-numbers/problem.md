# Add Two Numbers (LeetCode #2)

Two non-empty lists hold digits in REVERSE order. Add them and return the
sum as a list, also reversed.

## Intuition

Reverse order is a gift: the heads are the least-significant digits, so you
add left to right exactly as you would on paper, carrying as you go.

## Dry run

[2,4,3] + [5,6,4]  (342 + 465 = 807)
```text
  2+5=7  carry 0 → 7
  4+6=10 carry 1 → 0
  3+4+1=8 carry 0 → 8
  result [7,0,8]
```

## Time

O(max(n,m)) · SPACE: O(max(n,m)) for the output
