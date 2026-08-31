# Word Ladder (LeetCode #127)

A transformation sequence from word beginWord to word endWord using a dictionary
wordList is a sequence of words beginWord -> s1 -> s2 -> ... -> sk such that:

1. Every adjacent pair of words differs by a single letter.
2. Every si for 1 <= i <= k is in wordList. Note that beginWord does not need
```text
   to be in wordList.
```

3. sk == endWord

Given two words, beginWord and endWord, and a dictionary wordList, return
the number of words in the shortest transformation sequence from beginWord
to endWord, or 0 if no such sequence exists.

Example 1:
Input: beginWord = "hit", endWord = "cog", wordList = ["hot","dot","dog","lot","log","cog"]
Output: 5
Explanation: One shortest transformation sequence is "hit" -> "hot" -> "dot" -> "dog" -> "cog", which is 5 words long.

Example 2:
Input: beginWord = "hit", endWord = "cog", wordList = ["hot","dot","dog","lot","log"]
Output: 0
Explanation: The endWord "cog" is not in wordList, therefore there is no valid transformation sequence.

Constraints:
- 1 <= beginWord.length <= 10
- endWord.length == beginWord.length
- 1 <= wordList.length <= 5000
- wordList[i].length == beginWord.length
- beginWord, endWord, and wordList[i] consist of lowercase English letters.
- beginWord != endWord
- All the words in wordList are unique.

## Approach

Breadth-First Search (BFS)

## Intuition

We can model this problem as a graph where:
- Nodes are words.
- Edges exist between words that differ by exactly one letter.

We need to find the SHORTEST path from beginWord to endWord.
BFS is the standard algorithm for finding the shortest path in an unweighted graph.

Algorithm:
1. Start BFS from beginWord.
2. For each word, generate all possible next words by changing 1 letter (26 * L possibilities).
3. If a generated word exists in our wordList (Set), it's a valid neighbor.
4. Add neighbor to queue and remove from Set (to mark visited).
5. Track 'level' (distance). Return level + 1 when endWord is found.

Time Complexity: O(M^2 * N)
- M is length of each word, N is number of words in list.
- For each word in BFS, we iterate M positions and try 26 chars.
- String creation/hashing takes O(M).
- Total: N words * M positions * 26 chars * M string op cost.

Space Complexity: O(M * N)
- To store wordList in a Set and queue for BFS.
