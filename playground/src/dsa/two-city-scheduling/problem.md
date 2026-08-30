# Two City Scheduling (LeetCode #1029)

A company is interviewing 2N people. costs[i] = [aCost_i, bCost_i] is the
cost of flying person i to city A or city B. Return the minimum total cost
to fly EXACTLY N people to each city.

Example 1:
Input: costs = [[10,20],[30,200],[400,50],[30,20]] → Output: 110
(Person 0 → A (10), person 1 → A (30), person 2 → B (50), person 3 → B (20))

Example 2:
Input: costs = [[259,770],[448,54],[926,667],[184,139],[840,118],[577,469]]
Output: 1859

Constraints:
- 2 * N == costs.length
- 2 <= costs.length <= 100, costs.length is even
- 1 <= aCost_i, bCost_i <= 1000
