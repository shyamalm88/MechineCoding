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
