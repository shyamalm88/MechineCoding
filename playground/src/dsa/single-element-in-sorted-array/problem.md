# Single Element in a Sorted Array (LeetCode #540)

You are given a sorted array consisting of only integers where every
element appears exactly twice, except for one element which appears
exactly once. Return the single element.

You must write a solution running in O(log n) time and O(1) space.

Example 1:
Input: nums=[1,1,2,3,3,4,4,8,8] → Output: 2

Example 2:
Input: nums=[3,3,7,7,10,11,11] → Output: 10

Constraints:
- 1 <= nums.length <= 10^5
- 0 <= nums[i] <= 10^5

## Approach

Binary Search on Pair-Boundary Parity

## Story / intuition

BEFORE the single element, every pair "starts" at an EVEN index:
nums[0]==nums[1], nums[2]==nums[3], etc. The single element shifts
everything after it by one position, so AFTER it, pairs instead start at
ODD indices: nums[k]==nums[k+1] where k is odd.

So binary search for the FIRST even index `i` where `nums[i] != nums[i+1]`
— that `i` is exactly the single element's index.

To keep `mid` always even, if `mid` is odd, decrement it by 1 (its pair
partner is at mid-1, checking the even one is equivalent and keeps the
"even index" invariant clean).

```text
  - If nums[mid] == nums[mid+1]: the pairing is still "normal" up through
    mid+1, so the single element is AFTER this pair -> left = mid + 2
  - Else: the pairing is already broken at or before mid, so the single
    element is AT or BEFORE mid -> right = mid
```

Converges to `left === right`, which is the single element's index.

## Dry run

nums=[1,1,2,3,3,4,4,8,8]  (expect 2, at index 2)
left=0, right=8
mid=4 (even). nums[4]=3, nums[5]=4 -> different -> right=4
left=0, right=4
mid=2 (even). nums[2]=2, nums[3]=3 -> different -> right=2
left=0, right=2
mid=1 -> odd -> mid=0. nums[0]=1, nums[1]=1 -> same -> left=2
left==right==2 -> nums[2]=2 ✓

## Dry run

nums=[3,3,7,7,10,11,11]  (expect 10, at index 4)
left=0, right=6
mid=3 -> odd -> mid=2. nums[2]=7, nums[3]=7 -> same -> left=4
left=4, right=6
mid=5 -> odd -> mid=4. nums[4]=10, nums[5]=11 -> different -> right=4
left==right==4 -> nums[4]=10 ✓

Time:  O(log n)
Space: O(1)
