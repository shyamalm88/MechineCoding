# Online Stock Span (LeetCode #901)

For each daily price, return the number of consecutive days up to and
including today where the price was <= today's price.

## Intuition

The span ends at the first STRICTLY GREATER price to the left — a
"previous greater element" problem, which is what a monotonic decreasing
stack solves.

The key move: when popping a smaller price, ABSORB its span. That day's span
has already accounted for the days behind it, so you never rescan. Each price
is pushed and popped at most once → amortised O(1) per call.

## Dry run

100 80 60 70 60 75 85
```text
  100 → stack empty, span 1            stack [(100,1)]
   80 → 100 > 80, span 1               [(100,1),(80,1)]
   60 → 80 > 60, span 1                [...,(60,1)]
   70 → pop (60,1) absorb → span 2     [(100,1),(80,1),(70,2)]
   60 → span 1
   75 → pop (60,1) and (70,2) → span 4
   85 → pop (80,1) and (75,4) → span 6
```

## Complexity

TIME: O(1) amortised per next() · SPACE: O(n)
