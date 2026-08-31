# Find All Numbers Disappeared in an Array (LeetCode #448)

nums has n integers in [1, n]. Return every value in that range that is absent.

## Intuition

The O(n) space answer is a Set. The interesting one uses the array ITSELF as
the marker: value v belongs at index v-1, so for each value mark that index
negative. Any index still positive at the end was never visited, so index+1
is missing.

Math.abs is essential when reading — the slot may already be marked.

## Dry run

[4,3,2,7,8,2,3,1]
```text
  mark idx 3,2,1,6,7,1,2,0 negative
  positive slots remain at idx 4 and 5 → missing 5 and 6
```

## Complexity

TIME: O(n) · SPACE: O(1) excluding the output
