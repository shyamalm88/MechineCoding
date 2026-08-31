# Word Break (LeetCode #139)

Given a string s and a dictionary of strings wordDict, return true if s can
be segmented into a space-separated sequence of one or more dictionary words.

Note that the same word in the dictionary may be reused multiple times in
the segmentation.

Example 1:
Input: s = "leetcode", wordDict = ["leet","code"]
Output: true
Explanation: Return true because "leetcode" can be segmented as "leet code".

Example 2:
Input: s = "applepenapple", wordDict = ["apple","pen"]
Output: true
Explanation: Return true because "applepenapple" can be segmented as "apple pen apple".

Example 3:
Input: s = "catsandog", wordDict = ["cats","dog","sand","and","cat"]
Output: false

Constraints:
- 1 <= s.length <= 300
- 1 <= wordDict.length <= 1000
- 1 <= wordDict[i].length <= 20

## Approach

Recursion with Memoization (Top-Down DP)

## Intuition

We check every possible prefix of the string starting at `index`.
If the prefix is in the dictionary, we recursively check if the remaining
substring (starting at `i + 1`) can be segmented.

We use a map (memoization) to store the result for each starting index to
avoid re-calculating the same subproblems.

Time Complexity: O(N^3) - N states, loop N times, slice takes N.
Space Complexity: O(N) - Recursion stack and memoization map.
