# Koko Eating Bananas (LeetCode #875)

> Koko Eating Bananas (LeetCode #875)

Koko has piles of bananas and h hours before guards return. She picks a
speed k (bananas/hour). Each hour she eats min(pile, k) from one pile.
Find the MINIMUM k such that she can eat all bananas within h hours.

Example 1:
Input: piles=[3,6,7,11], h=8 → Output: 4

Example 2:
Input: piles=[30,11,23,4,20], h=5 → Output: 30

Example 3:
Input: piles=[30,11,23,4,20], h=6 → Output: 23

Constraints:
- 1 <= piles.length <= 10^4
- piles.length <= h <= 10^9
- 1 <= piles[i] <= 10^9
