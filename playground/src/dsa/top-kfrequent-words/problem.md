# Top K Frequent Words (LeetCode #692)

## Category

🟢 IMPORTANT (Min-Heap with Multi-Key Custom Comparator)
Given an array of strings `words` and an integer k, return the k most
frequent strings. Sort the answer by frequency from highest to lowest.
Words with the SAME frequency are sorted by LEXICOGRAPHICAL order (smaller
string first).

Example 1:
Input: words=["i","love","leetcode","i","love","coding"], k=2
Output: ["i","love"]
Explanation: "i" and "love" both appear twice; "i" < "love" lexicographically.

Example 2:
Input: words=["the","day","is","sunny","the","the","the","sunny","is","is"], k=4
Output: ["the","is","sunny","day"]

Constraints:
- 1 <= words.length <= 500
- 1 <= words[i].length <= 10
- words[i] consists of lowercase English letters
- k is in the range [1, the number of unique words]
