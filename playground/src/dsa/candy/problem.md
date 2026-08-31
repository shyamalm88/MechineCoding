# Candy (LeetCode #135)

N children stand in a line, each with a rating. You are distributing candy
under two rules:

1. Every child must get at least one candy.
2. A child with a HIGHER rating than an immediate neighbour must get MORE
candies than that neighbour.

Return the minimum number of candies you need.

Example 1:
Input: ratings = [1,0,2] → Output: 5 (candies [2,1,2])

Example 2:
Input: ratings = [1,2,2] → Output: 4 (candies [1,2,1] — equal ratings carry
no obligation in either direction)

Constraints:
- 1 <= ratings.length <= 2 * 10^4
- 0 <= ratings[i] <= 2 * 10^4

## Approach

Two Sweeps — Left-to-Right, Then Right-to-Left

## Story / intuition

Each child sits under TWO constraints — one from the left neighbour, one from
the right. Trying to satisfy both in a single pass is where people get stuck,
because fixing the right side can break the left side.

The unlock: handle one direction at a time, then MERGE with a max.

```text
  Pass 1 (left → right): if ratings[i] > ratings[i-1], then
                         candies[i] = candies[i-1] + 1.
                         Now every LEFT constraint holds.
  Pass 2 (right → left): if ratings[i] > ratings[i+1], then
                         candies[i] = max(candies[i], candies[i+1] + 1).
```

The max() in pass 2 is the crux. Taking the max preserves what pass 1
established while additionally satisfying the right constraint — a plain
assignment would destroy pass 1's work on peaks that dominate both sides.

## Why the greedy choice is safe

Every child starts at 1, the legal minimum, and we only ever raise a value
when a constraint forces it, by the smallest possible step (+1). So each
candies[i] is a lower bound that MUST hold in any valid distribution — the
final array is the pointwise minimum of all valid distributions, hence its
sum is minimal. Equal adjacent ratings impose nothing, which is exactly why
[1,2,2] gives [1,2,1] rather than [1,2,3].

## Dry run

ratings = [1,0,2]
init                → [1,1,1]
pass 1: i=1 (0>1? no) → [1,1,1];  i=2 (2>0 yes) → [1,1,2]
pass 2: i=1 (0>2? no) → [1,1,2];  i=0 (1>0 yes) → max(1, 1+1)=2 → [2,1,2]
sum = 5

Time:  O(N) — two linear passes
Space: O(N) for the candies array
