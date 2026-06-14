/**
 * ============================================================================
 * PROBLEM: Group Anagrams (LeetCode #49)
 * ============================================================================
 * Given an array of strings strs, group the anagrams together. You can return
 * the answer in any order.
 *
 * An Anagram is a word or phrase formed by rearranging the letters of a
 * different word or phrase, typically using all the original letters exactly once.
 *
 * Example 1:
 * Input: strs = ["eat","tea","tan","ate","nat","bat"]
 * Output: [["bat"],["nat","tan"],["ate","eat","tea"]]
 *
 * Constraints:
 * - 1 <= strs.length <= 10^4
 * - 0 <= strs[i].length <= 100
 */

// ============================================================================
// APPROACH: Character Count Hash Map
// ============================================================================
/**
 * INTUITION:
 * Two strings are anagrams if they have the exact same character counts.
 * We can use an array of size 26 to count characters for each string.
 * This count array (converted to a string key) serves as the unique identifier
 * for that anagram group.
 *
 * Time Complexity: O(N * K) where N is number of strings, K is max length.
 * Space Complexity: O(N * K) to store the map.
 */
const groupAnagram = (strs) => {
  let map = new Map();
  for (let str of strs) {
    const freq = new Array(26).fill(0);

    // Count frequency of each character
    for (let ch of str) {
      freq[ch.charCodeAt(0) - "a".charCodeAt(0)]++;
    }

    // Create a unique key based on character counts (e.g., "1#0#2#...")
    const key = freq.join("#");
    if (!map.has(key)) {
      map.set(key, []);
    }
    map.get(key).push(str);
  }

  return Array.from(map.values());
};

// ============================================================================
// TEST CASES
// ============================================================================
console.log("=== Group Anagrams Tests ===\n");

console.log(
  "Test 1:",
  groupAnagram(["eat", "tea", "tan", "ate", "nat", "bat"])
);
