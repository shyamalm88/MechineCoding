# Queue Reconstruction by Height (LeetCode #406)

You are given people[i] = [h_i, k_i], where h_i is the person's height and
k_i is the number of people IN FRONT of them who have a height greater than
or equal to h_i. Reconstruct and return the queue.

Example 1:
Input:  [[7,0],[4,4],[7,1],[5,0],[6,1],[5,2]]
Output: [[5,0],[7,0],[5,2],[6,1],[4,4],[7,1]]

Example 2:
Input:  [[6,0],[5,0],[4,0],[3,2],[2,2],[1,4]]
Output: [[4,0],[5,0],[2,2],[3,2],[1,4],[6,0]]

Constraints:
- 1 <= people.length <= 2000
- 0 <= h_i <= 10^6
- 0 <= k_i < people.length
- The answer is guaranteed to exist
