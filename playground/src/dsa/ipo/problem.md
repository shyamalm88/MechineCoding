# IPO (LeetCode #502)

You have w units of starting capital and may finish AT MOST k distinct
projects. Project i requires capital[i] to start and yields a pure profit of
profits[i], which is added to your capital when finished. Projects cannot be
repeated. Return the maximum capital you can end with.

Example 1:
Input: k = 2, w = 0, profits = [1,2,3], capital = [0,1,1] → Output: 4
(Start project 0 → capital 1. Now project 2 is affordable → capital 4.)

Example 2:
Input: k = 3, w = 0, profits = [1,2,3], capital = [0,1,2] → Output: 6

Constraints:
- 1 <= k <= 10^5
- 0 <= w <= 10^9
- 1 <= profits.length == capital.length <= 10^5
