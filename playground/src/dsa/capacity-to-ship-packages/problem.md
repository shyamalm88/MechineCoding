# Capacity to Ship Packages Within D Days (LeetCode #1011)

Packages with weights[] must be shipped in D days in the given order.
Find the MINIMUM weight capacity of the ship such that all packages are
shipped within D days. Packages loaded in order, cannot split across days.

Example 1:
Input: weights=[1,2,3,4,5,6,7,8,9,10], days=5 → Output: 15

Example 2:
Input: weights=[3,2,2,4,1,4], days=3 → Output: 6

Example 3:
Input: weights=[1,2,3,1,1], days=4 → Output: 3

Constraints:
- 1 <= days <= weights.length <= 500
- 1 <= weights[i] <= 500

## Approach

Binary Search on the ANSWER (capacity)

## Story / intuition

SAME pattern as Koko (#875) — binary search on the answer.
Answer space: [max(weights), sum(weights)]
```text
  - Minimum: must fit heaviest single package (can't load it otherwise)
  - Maximum: load everything in one day
```

canShip(cap, D): simulate loading — greedily fill each day.
If adding next package exceeds cap, start a new day.
Count days needed. If days ≤ D, capacity works.

Monotone property: if cap C works, any cap > C also works.
→ Binary search: if canShip(mid), try smaller (hi=mid). Else lo=mid+1.

## Dry run

weights=[1,2,3,4,5], days=3
lo=5(max), hi=15(sum) → mid=10
canShip(10,3): [1,2,3,4]→sum=10 day1, [5]→day2. 2 days ≤ 3 ✓ → hi=10
mid=7: [1,2,3]→6 day1, [4]→4 day2, [5]→5 day3. 3 days ≤ 3 ✓ → hi=7
mid=6: [1,2,3]→6 day1, [4]→4 day2, [5]→5 day3. 3 days ≤ 3 ✓ → hi=6
mid=5: [1,2]→3 day1, [3]→3 day2, [4]→4 day3, [5]→5 day4. 4>3 ✗ → lo=6
lo==hi=6 → Answer: 6 ✓

Time:  O(N log(sum-max))
Space: O(1)
