# Daily Temperatures (LeetCode #739)

Given an array of integers temperatures represents the daily temperatures,
return an array answer such that answer[i] is the number of days you have to
wait after the ith day to get a warmer temperature. If there is no future day
for which this is possible, keep answer[i] == 0.

Example 1:
Input: temperatures = [73,74,75,71,69,72,76,73]
Output: [1,1,4,2,1,1,0,0]

Example 2:
Input: temperatures = [30,40,50,60]
Output: [1,1,1,0]

Constraints:
- 1 <= temperatures.length <= 10^5
- 30 <= temperatures[i] <= 100

## Approach

Monotonic Decreasing Stack

## Intuition

We need to find the *next* greater element for each element.
We can use a stack to store indices of temperatures that haven't found a warmer day yet.
The stack will be monotonic decreasing (temperatures at indices in stack are decreasing).

When we encounter a temperature `T[i]` that is warmer than `T[stack.top()]`,
it means `i` is the next warmer day for `stack.top()`. We pop and calculate the difference.

Time Complexity: O(N) - Each element is pushed and popped at most once.
Space Complexity: O(N) - Stack size.
