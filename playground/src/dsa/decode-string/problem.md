# Decode String (LeetCode #394)

> Decode String (LeetCode #394)

Given an encoded string, return its decoded form.
Encoding rule: k[encoded_string] means encoded_string repeated k times.
k is always a positive integer. Input is always valid.

Example 1:
Input: "3[a]2[bc]"  → Output: "aaabcbc"

Example 2:
Input: "3[a2[c]]"   → Output: "accaccacc"  (nested!)

Example 3:
Input: "2[abc]3[cd]ef" → Output: "abcabccdcdcdef"

Constraints:
- 1 <= s.length <= 30
- s consists of lowercase letters, digits, and square brackets
- All integers in s are in [1, 300]
