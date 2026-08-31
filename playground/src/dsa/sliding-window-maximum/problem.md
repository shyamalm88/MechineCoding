# Sliding Window Maximum (LeetCode #239)

You are given an array of integers nums, there is a sliding window of size k
which is moving from the very left of the array to the very right. You can
only see the k numbers in the window. Each time the sliding window moves right
by one position.

Return the max sliding window.

Example 1:
Input: nums = [1,3,-1,-3,5,3,6,7], k = 3
Output: [3,3,5,5,6,7]
Explanation:
Window position                Max
---------------               -----
[1  3  -1] -3  5  3  6  7       3
 1 [3  -1  -3] 5  3  6  7       3
 1  3 [-1  -3  5] 3  6  7       5
 1  3  -1 [-3  5  3] 6  7       5
 1  3  -1  -3 [5  3  6] 7       6
 1  3  -1  -3  5 [3  6  7]      7

Constraints:
- 1 <= nums.length <= 10^5
- -10^4 <= nums[i] <= 10^4
- 1 <= k <= nums.length

## Approach

Monotonic Decreasing Queue (Deque)

## Intuition

We need the max of the current window in O(1) time.
A simple queue doesn't help. A heap takes O(log k).
We use a Deque (Double-ended queue) to store *indices*.

The Deque will maintain indices of elements in decreasing order of their values.
- Front of Deque: Index of the largest element in the current window.
- When adding a new element `nums[i]`:
```text
  1. Remove indices from the BACK that are smaller than `nums[i]` (they are useless now).
  2. Remove indices from the FRONT that are out of the window (index <= i - k).
  3. Add `i` to the BACK.
  4. If window size reached (i >= k - 1), add `nums[deque[0]]` to result.
```

## Dry run

Input: nums = [1, 3, -1, -3, 5, 3, 6, 7], k = 3

1. i=0 (val=1): Deque=[0] (val:1)
2. i=1 (val=3): 3 > 1, pop 0. Deque=[1] (val:3)
3. i=2 (val=-1): -1 < 3. Deque=[1, 2] (vals:3, -1).
```text
   - Window full. Max=nums[1]=3. Res=[3]
```

4. i=3 (val=-3): -3 < -1. Deque=[1, 2, 3] (vals:3, -1, -3).
```text
   - Check window: deque[0]=1 is valid (1 > 3-3).
   - Max=nums[1]=3. Res=[3, 3]
```

5. i=4 (val=5): 5 > -3 (pop 3), 5 > -1 (pop 2), 5 > 3 (pop 1). Deque=[4] (val:5).
```text
   - Max=nums[4]=5. Res=[3, 3, 5]
```

6. i=5 (val=3): 3 < 5. Deque=[4, 5] (vals:5, 3).
```text
   - Max=nums[4]=5. Res=[3, 3, 5, 5]
```

7. i=6 (val=6): 6 > 3 (pop 5), 6 > 5 (pop 4). Deque=[6] (val:6).
```text
   - Max=nums[6]=6. Res=[..., 6]
```

8. i=7 (val=7): 7 > 6 (pop 6). Deque=[7] (val:7). Max=7. Res=[..., 7]

Time Complexity: O(N) - Each element is added and removed at most once.
Space Complexity: O(K) - Deque size.
