# Top K Frequent Elements (LeetCode #347)

Given an integer array nums and an integer k, return the k most frequent elements.
You may return the answer in any order.

Example 1:
Input: nums = [1,1,1,2,2,3], k = 2
Output: [1,2]

Example 2:
Input: nums = [1], k = 1
Output: [1]

Constraints:
- 1 <= nums.length <= 10^5
- k is in the range [1, the number of unique elements in the array].

## Approach

Bucket Sort

## Intuition

Instead of sorting frequencies (O(N log N)), we can use the fact that
the maximum possible frequency is N (length of array).
1. Count frequencies of each number.
2. Create "buckets" where index i stores a list of numbers that appear i times.
3. Iterate backwards from the last bucket (highest frequency) to collect k numbers.

## Dry run

Input: nums = [1, 1, 1, 2, 2, 3], k = 2

1. Count Frequencies:
```text
   - Map = {1: 3, 2: 2, 3: 1}
```

2. Fill Buckets (Index = Frequency):
```text
   - buckets array size 7 (indices 0-6).
   - Process 1 (freq 3) -> buckets[3] = [1]
   - Process 2 (freq 2) -> buckets[2] = [2]
   - Process 3 (freq 1) -> buckets[1] = [3]
   - State: [ [], [3], [2], [1], [], [], [] ]
```

3. Gather Top K (Iterate backwards):
```text
   - i=6, 5, 4: Empty.
   - i=3: Found [1]. Result = [1]. (Need 1 more)
   - i=2: Found [2]. Result = [1, 2]. (Limit k=2 reached)
   - Stop.
```

Result: [1, 2]

Time Complexity: O(N)
Space Complexity: O(N)
