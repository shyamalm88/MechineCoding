# Majority Element (LeetCode #169)

> Majority Element (LeetCode #169)

Return the element appearing more than ⌊n/2⌋ times. One is guaranteed to exist.

## Intuition

A hash map is O(n) time and O(n) space. The expected answer is
BOYER-MOORE VOTING, which is O(1) space:

```text
  keep a candidate and a count; a matching element votes +1, any other votes
  -1; when the count hits 0, adopt the current element as the new candidate.
```

Why it works: the true majority occurs more than all others COMBINED, so
every cancellation removes one majority and one non-majority element. The
majority cannot be exhausted first, so it survives as the final candidate.

## Dry run

[2,2,1,1,1,2,2]
```text
  2(c=1) 2(c=2) 1(c=1) 1(c=0) 1→candidate=1(c=1) 2(c=0) 2→candidate=2(c=1)
  answer 2
```

## Note

without the guarantee you must verify the candidate in a second pass --
the algorithm always returns something, even when no majority exists.

## Time

O(n)   SPACE: O(1)
