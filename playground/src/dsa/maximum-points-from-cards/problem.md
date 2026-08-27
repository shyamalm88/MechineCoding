# Maximum Points You Can Obtain from Cards (LeetCode #1423)

> Maximum Points You Can Obtain from Cards (LeetCode #1423)

There are n cards in a row with values cardPoints[]. In one step you can
take one card from the beginning or end. You take exactly k cards total.
Return the maximum sum of the k chosen cards.

Example 1:
Input: cardPoints=[1,2,3,4,5,6,1], k=3
Output: 12  (take [6,1] from right and [1] from left? No: take last 3: 5+6+1=12)

Example 2:
Input: cardPoints=[2,2,2], k=2
Output: 4

Example 3:
Input: cardPoints=[9,7,7,9,7,7,9], k=7
Output: 55  (all cards)

Constraints:
- 1 <= cardPoints.length <= 10^5
- 1 <= cardPoints[i] <= 10^4
- 1 <= k <= cardPoints.length
