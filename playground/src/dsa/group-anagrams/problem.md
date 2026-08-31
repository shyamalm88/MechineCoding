# Group Anagrams (LeetCode #49)

Given an array of strings strs, group the anagrams together. You can return
the answer in any order.

An Anagram is a word or phrase formed by rearranging the letters of a
different word or phrase, typically using all the original letters exactly once.

Example 1:
Input: strs = ["eat","tea","tan","ate","nat","bat"]
Output: [["bat"],["nat","tan"],["ate","eat","tea"]]

Constraints:
- 1 <= strs.length <= 10^4
- 0 <= strs[i].length <= 100

## Approach

Character Count Hash Map

## Intuition

Two strings are anagrams if they have the exact same character counts.
We can use an array of size 26 to count characters for each string.
This count array (converted to a string key) serves as the unique identifier
for that anagram group.

Time Complexity: O(N * K) where N is number of strings, K is max length.
Space Complexity: O(N * K) to store the map.
