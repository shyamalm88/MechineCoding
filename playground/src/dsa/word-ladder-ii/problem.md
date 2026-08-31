# Word Ladder II (LeetCode #126)

A transformation sequence from word beginWord to word endWord using a dictionary
wordList is a sequence of words beginWord -> s1 -> s2 -> ... -> sk such that:

1. Every adjacent pair of words differs by a single letter.
2. Every si for 1 <= i <= k is in wordList. Note that beginWord does not need
```text
   to be in wordList.
```

3. sk == endWord

Given two words, beginWord and endWord, and a dictionary wordList, return
all the shortest transformation sequences from beginWord to endWord, or an
empty list if no such sequence exists. Each sequence should be returned as a
list of the words [beginWord, s1, s2, ..., sk].

Example 1:
Input: beginWord = "hit", endWord = "cog", wordList = ["hot","dot","dog","lot","log","cog"]
Output: [["hit","hot","dot","dog","cog"],["hit","hot","lot","log","cog"]]

Example 2:
Input: beginWord = "hit", endWord = "cog", wordList = ["hot","dot","dog","lot","log"]
Output: []

Constraints:
- 1 <= beginWord.length <= 5
- endWord.length == beginWord.length
- 1 <= wordList.length <= 500
- wordList[i].length == beginWord.length
- beginWord, endWord, and wordList[i] consist of lowercase English letters.
- beginWord != endWord
- All the words in wordList are unique.

## Approach

BFS + DFS (Backtracking)

## Intuition

To find ALL shortest paths, we need two steps:
1. BFS: Find the shortest distance from beginWord to every other word.
```text
   While doing BFS, we build a "parents" graph (DAG).
   - If we reach a word for the first time, record its distance and parent.
   - If we reach a word again at the SAME shortest distance, add the new parent.
   - This allows us to capture multiple paths of the same length.
```

2. DFS: Reconstruct paths from endWord back to beginWord using the parents graph.
```text
   - Start at endWord.
   - Recursively visit all parents until we reach beginWord.
   - Collect the paths.
```

Time Complexity: O(N * M * 26 + P), where P is the total length of all paths returned.
Space Complexity: O(N * M) to store the graph and distances.
