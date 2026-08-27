# Alien Dictionary (LeetCode #269, Premium)

> Alien Dictionary (LeetCode #269, Premium)

## Category

🔴 VVIMP (Topological Sort — Order Extraction from Adjacent Pairs)
There is a foreign language with its own alphabet, all using lowercase
English letters. You are given `words` — a list of words from this
language's dictionary, where the words are SORTED LEXICOGRAPHICALLY by
the rules of this foreign language.

Derive the order of letters in this language. If the order is invalid
(a cycle, or a contradiction like a longer word being a prefix of a
shorter one), return "". If there are multiple valid orders, return any.

Example 1:
Input: words = ["wrt","wrf","er","ett","rftt"]
Output: "wertf"

Example 2:
Input: words = ["z","x"]
Output: "zx"

Example 3 (cycle -> invalid):
Input: words = ["z","x","z"]
Output: ""

Constraints:
- 1 <= words.length <= 100
- 1 <= words[i].length <= 100
- words[i] consists of lowercase English letters
