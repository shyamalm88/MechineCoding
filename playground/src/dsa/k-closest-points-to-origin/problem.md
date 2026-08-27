# K Closest Points to Origin (LeetCode #973)

Given an array of points on a 2D plane and an integer k, return the k
closest points to the origin (0, 0). Distance = sqrt(x² + y²).
The answer may be returned in any order.

Example 1:
Input: points=[[1,3],[-2,2]], k=1 → Output: [[-2,2]]
(sqrt(1+9)=√10 vs sqrt(4+4)=√8, so (-2,2) is closer)

Example 2:
Input: points=[[3,3],[5,-1],[-2,4]], k=2 → Output: [[3,3],[-2,4]]

Constraints:
- 1 <= k <= points.length <= 10^4
- -10^4 <= xi, yi <= 10^4
