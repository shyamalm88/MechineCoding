# Maximum Units on a Truck (LeetCode #1710)

boxTypes[i] = [numberOfBoxes_i, numberOfUnitsPerBox_i]. You may load at most
truckSize BOXES onto the truck (you can take a partial group). Return the
maximum total number of UNITS you can carry.

Example 1:
Input: boxTypes = [[1,3],[2,2],[3,1]], truckSize = 4 → Output: 8
(Take the 1 box of 3 units, both boxes of 2 units, and 1 box of 1 unit:
 3 + 2*2 + 1 = 8.)

Example 2:
Input: boxTypes = [[5,10],[2,5],[4,7],[3,9]], truckSize = 10 → Output: 91

Constraints:
- 1 <= boxTypes.length <= 1000
- 1 <= numberOfBoxes_i, numberOfUnitsPerBox_i <= 1000
- 1 <= truckSize <= 10^6

## Approach

Sort by Units Per Box Descending — Fractional Knapsack

## Story / intuition

Every box costs exactly the same amount of truck capacity: one slot. So the
only thing that distinguishes boxes is how many units they carry. Load the
densest boxes first until the truck is full.

## Why the greedy choice is safe

This is FRACTIONAL knapsack, not 0/1 knapsack — and that difference is the
whole reason greedy works here. Because all items have identical weight and
a group can be split, exchange is always available: if an optimal loading
includes a box worth u1 while a box worth u2 > u1 sits unloaded, swap them.
Capacity used is unchanged and the total rises. So no optimal solution can
skip a denser box in favour of a lighter one. (Contrast 0/1 knapsack with
differing weights, where this swap can overflow capacity and greedy breaks —
that is exactly when you need DP.)

## Dry run

[[1,3],[2,2],[3,1]], truckSize = 4
sort by units desc → [[1,3],[2,2],[3,1]]
take min(1,4)=1 box × 3 = 3    units=3,  remaining=3
take min(2,3)=2 boxes × 2 = 4  units=7,  remaining=1
take min(3,1)=1 box × 1 = 1    units=8,  remaining=0 → stop
answer 8

Time:  O(N log N) — the sort dominates
Space: O(1) extra (sorts in place)
