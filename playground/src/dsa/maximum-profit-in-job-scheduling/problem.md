# Maximum Profit in Job Scheduling (LeetCode #1235)

## Category

🟢 IMPORTANT (DP + Binary Search on Sorted Intervals)
You are given n jobs, where job i starts at startTime[i], ends at
endTime[i], and pays profit[i].

You can only work on ONE job at a time. A job CAN start the exact instant
another job ends (intervals are allowed to touch, not overlap).

Return the maximum total profit you can earn.

Example 1:
Input: startTime=[1,2,3,3], endTime=[3,4,5,6], profit=[50,10,40,70]
Output: 120
Explanation: job 1 (1-3, profit 50) + job 4 (3-6, profit 70) = 120

Example 2:
Input: startTime=[1,2,3,4,6], endTime=[3,5,10,6,9], profit=[20,20,100,70,60]
Output: 150

Example 3:
Input: startTime=[1,1,1], endTime=[2,3,4], profit=[5,6,4]
Output: 6

Constraints:
- 1 <= startTime.length == endTime.length == profit.length <= 5*10^4
- 1 <= startTime[i] < endTime[i] <= 10^9
- 1 <= profit[i] <= 10^4
