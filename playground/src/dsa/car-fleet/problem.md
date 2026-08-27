# Car Fleet (LeetCode #853)

n cars travel to the same destination at `target` miles away.
position[i] and speed[i] give the starting position and speed of car i.
A car that catches up to another car ahead never passes it — they form a fleet.
Return the number of fleets that arrive at the destination.

Example 1:
Input: target=12, position=[10,8,0,5,3], speed=[2,4,1,1,3]
Output: 3
(Car at 10 takes 1hr. Car at 8 takes 1hr → same fleet. Car at 5 takes 3.5hr.
 Car at 3 takes 3hr → catches car at 5? Car at 5 arrives 3.5hr, car at 3 arrives 3hr.
 3 < 3.5, so car at 3 catches car at 5 → same fleet. Car at 0 takes 12hr. → 3 fleets)

Example 2:
Input: target=10, position=[3], speed=[3]
Output: 1

Constraints:
- 1 <= n <= 10^5
- 0 < target <= 10^6
- 0 <= position[i] < target
- All positions are unique
