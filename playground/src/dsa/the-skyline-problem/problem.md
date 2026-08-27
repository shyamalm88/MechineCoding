# The Skyline Problem (LeetCode #218)

## Category

🔴 HARD / VVIMP (Sweep Line + Lazy-Eviction Max-Heap)
A city's skyline is the outer contour of the silhouette formed by all the
buildings. Given `buildings` where buildings[i] = [left_i, right_i, height_i],
return the skyline as a list of "key points" [x, height] in left-to-right
order, where each key point is the LEFT endpoint of a horizontal segment.
The last key point has height 0, marking the end of the skyline. Consecutive
key points must NOT have the same height.

Example 1:
Input: buildings=[[2,9,10],[3,7,15],[5,12,12],[15,20,10],[19,24,8]]
Output: [[2,10],[3,15],[7,12],[12,0],[15,10],[20,8],[24,0]]

Example 2:
Input: buildings=[[0,2,3],[2,5,3]]
Output: [[0,3],[5,0]]

Constraints:
- 1 <= buildings.length <= 10^4
- buildings[i].length == 3
- 0 <= left_i < right_i <= 2^31 - 1
- 1 <= height_i <= 2^31 - 1
