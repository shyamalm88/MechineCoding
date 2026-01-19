/**
 * ============================================================================
 * PROBLEM: Word Ladder (LeetCode #127)
 * ============================================================================
 * A transformation sequence from word beginWord to word endWord using a dictionary
 * wordList is a sequence of words beginWord -> s1 -> s2 -> ... -> sk such that:
 *
 * 1. Every adjacent pair of words differs by a single letter.
 * 2. Every si for 1 <= i <= k is in wordList. Note that beginWord does not need
 *    to be in wordList.
 * 3. sk == endWord
 *
 * Given two words, beginWord and endWord, and a dictionary wordList, return
 * the number of words in the shortest transformation sequence from beginWord
 * to endWord, or 0 if no such sequence exists.
 *
 * Example 1:
 * Input: beginWord = "hit", endWord = "cog", wordList = ["hot","dot","dog","lot","log","cog"]
 * Output: 5
 * Explanation: One shortest transformation sequence is "hit" -> "hot" -> "dot" -> "dog" -> "cog", which is 5 words long.
 *
 * Example 2:
 * Input: beginWord = "hit", endWord = "cog", wordList = ["hot","dot","dog","lot","log"]
 * Output: 0
 * Explanation: The endWord "cog" is not in wordList, therefore there is no valid transformation sequence.
 *
 * Constraints:
 * - 1 <= beginWord.length <= 10
 * - endWord.length == beginWord.length
 * - 1 <= wordList.length <= 5000
 * - wordList[i].length == beginWord.length
 * - beginWord, endWord, and wordList[i] consist of lowercase English letters.
 * - beginWord != endWord
 * - All the words in wordList are unique.
 */

// ============================================================================
// APPROACH: Breadth-First Search (BFS)
// ============================================================================
/**
 * INTUITION:
 * We can model this problem as a graph where:
 * - Nodes are words.
 * - Edges exist between words that differ by exactly one letter.
 *
 * We need to find the SHORTEST path from beginWord to endWord.
 * BFS is the standard algorithm for finding the shortest path in an unweighted graph.
 *
 * Algorithm:
 * 1. Start BFS from beginWord.
 * 2. For each word, generate all possible next words by changing 1 letter (26 * L possibilities).
 * 3. If a generated word exists in our wordList (Set), it's a valid neighbor.
 * 4. Add neighbor to queue and remove from Set (to mark visited).
 * 5. Track 'level' (distance). Return level + 1 when endWord is found.
 *
 * Time Complexity: O(M^2 * N)
 * - M is length of each word, N is number of words in list.
 * - For each word in BFS, we iterate M positions and try 26 chars.
 * - String creation/hashing takes O(M).
 * - Total: N words * M positions * 26 chars * M string op cost.
 *
 * Space Complexity: O(M * N)
 * - To store wordList in a Set and queue for BFS.
 */
const wordLadder = (beginWord, endWord, wordList) => {
  // Use a Set for O(1) lookups. This acts as our "unvisited" set.
  const wordSet = new Set(wordList);

  // If endWord is not in the dictionary, we can't reach it.
  if (!wordSet.has(endWord)) return 0;

  // BFS Queue: [currentWord]
  const q = [beginWord];
  const alphabet = "abcdefghijklmnopqrstuvwxyz";
  let level = 1; // Start at level 1 (beginWord counts as 1)

  while (q.length) {
    const size = q.length; // Process level by level

    for (let i = 0; i < size; i++) {
      const word = q.shift();

      // Try changing every character of the current word
      for (let j = 0; j < word.length; j++) {
        for (let ch of alphabet) {
          if (ch === word[j]) continue; // Skip same character

          // Generate new word: slice before + new char + slice after
          // Note: String concatenation is O(M)
          const newWord = word.slice(0, j) + ch + word.slice(j + 1);

          // Found the target! Return current length + 1
          if (newWord === endWord) {
            return level + 1;
          }

          // If valid neighbor (exists in set), add to queue and mark visited
          if (wordSet.has(newWord)) {
            q.push(newWord);
            wordSet.delete(newWord); // Mark as visited by removing from set
          }
        }
      }
    }
    // Finished processing current level, increment distance
    level++;
  }

  return 0; // No path found
};

// ============================================================================
// TEST CASES
// ============================================================================
console.log("=== Word Ladder Tests ===\n");

// Test 1: Standard case
console.log(
  "Test 1:",
  wordLadder("hit", "cog", ["hot", "dot", "dog", "lot", "log", "cog"])
);
// Expected: 5 ("hit" -> "hot" -> "dot" -> "dog" -> "cog")

// Test 2: End word not in list
console.log(
  "Test 2:",
  wordLadder("hit", "cog", ["hot", "dot", "dog", "lot", "log"])
);
// Expected: 0

// Test 3: Shortest path choice
// hit -> hot -> dot -> dog -> cog (5)
// hit -> hot -> lot -> log -> cog (5)
console.log(
  "Test 3:",
  wordLadder("hit", "cog", ["hot", "dot", "dog", "lot", "log", "cog"])
);
// Expected: 5

module.exports = { wordLadder };
