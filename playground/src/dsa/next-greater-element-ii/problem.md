# Next Greater Element II (LeetCode #503)

> Next Greater Element II (LeetCode #503)

Same as #496 but the array is CIRCULAR — after the last element you wrap
around to the front.

## Intuition

The circular twist has a standard trick: iterate 2n times and index with
`i % n`. That simulates walking the array twice, which is enough for every
element to see every other element to its right exactly once.

Push indices rather than values, because duplicates are allowed here (unlike
#496) so a value is no longer a unique key.

Guard: only PUSH during the first pass (i < n). Pushing on the second pass
would create phantom entries that never resolve.

## Dry run

[1,2,1]
```text
  i0 push0; i1 pops0 → res[0]=2, push1; i2 push2
  wrap: i3(=0) val1, no pop; i4(=1) val2 pops2 → res[2]=2
  result [2,-1,2]
```

## Time

O(n)   SPACE: O(n)
