# Can Place Flowers (LeetCode #605)

You have a long flowerbed where some plots are planted (1) and some are not
(0). Flowers cannot be planted in ADJACENT plots. Given the flowerbed and an
integer n, return true if n new flowers can be planted without violating the
no-adjacent-flowers rule.

Example 1:
Input: flowerbed = [1,0,0,0,1], n = 1 → Output: true

Example 2:
Input: flowerbed = [1,0,0,0,1], n = 2 → Output: false

Constraints:
- 1 <= flowerbed.length <= 2 * 10^4
- flowerbed[i] is 0 or 1
- There are no two adjacent flowers in the input
- 0 <= n <= flowerbed.length
