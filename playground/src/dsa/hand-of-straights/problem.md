# Hand of Straights (LeetCode #846)

Alice has a hand of cards given as an integer array. She wants to rearrange
the cards into groups so that each group is of size groupSize and consists
of groupSize CONSECUTIVE cards. Return true if it is possible.

(Identical to LeetCode #1296, "Divide Array in Sets of K Consecutive
Numbers".)

Example 1:
Input: hand = [1,2,3,6,2,3,4,7,8], groupSize = 3 → Output: true
(Groups: [1,2,3], [2,3,4], [6,7,8])

Example 2:
Input: hand = [1,2,3,4,5], groupSize = 4 → Output: false

Constraints:
- 1 <= hand.length <= 10^4
- 0 <= hand[i] <= 10^9
- 1 <= groupSize <= hand.length
