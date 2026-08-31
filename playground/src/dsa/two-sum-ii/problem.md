# Two Sum II — Input Array is Sorted (LeetCode #167)

Given a 1-indexed sorted array of integers, find two numbers that add to target.
Return their indices [index1, index2] (1-indexed). Exactly one solution exists.

Example 1:
Input: numbers=[2,7,11,15], target=9 → Output: [1,2]

Example 2:
Input: numbers=[2,3,4], target=6 → Output: [1,3]

Example 3:
Input: numbers=[-1,0], target=-1 → Output: [1,2]

Constraints:
- 2 <= numbers.length <= 3 * 10^4
- -1000 <= numbers[i] <= 1000
- numbers sorted in non-decreasing order
- Exactly one solution
- Must use O(1) extra space

## Approach

Two Pointers — left and right converge

## Story / intuition

Sorted array is the perfect setup for two pointers.
Start with left=0, right=n-1 (smallest and largest).
If sum < target → need larger sum → move left RIGHT (increase smaller number)
If sum > target → need smaller sum → move right LEFT (decrease larger number)
If sum == target → found it!

## Why this works

At every step, the pair we're checking is the ONLY candidate
for the current left-right combination. Moving a pointer eliminates all pairs
that can't possibly work.

## Dry run

numbers=[2,7,11,15], target=9
l=0(2), r=3(15): sum=17 > 9 → r=2
l=0(2), r=2(11): sum=13 > 9 → r=1
l=0(2), r=1(7):  sum=9 == 9 → return [1,2] ✓

Time:  O(N)
Space: O(1)
