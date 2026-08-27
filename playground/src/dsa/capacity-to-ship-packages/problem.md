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
