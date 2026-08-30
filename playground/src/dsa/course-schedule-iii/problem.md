# Course Schedule III (LeetCode #630)

courses[i] = [duration_i, lastDay_i] means course i takes duration_i days
and must be FINISHED on or before lastDay_i. You start on day 1 and can take
only one course at a time. Return the maximum number of courses you can take.

Example 1:
Input: courses = [[100,200],[200,1300],[1000,1250],[2000,3200]] → Output: 3
Example 2:
Input: courses = [[1,2]] → Output: 1
Example 3:
Input: courses = [[3,2],[4,3]] → Output: 0

Constraints:
- 1 <= courses.length <= 10^4
- 1 <= duration_i, lastDay_i <= 10^4
