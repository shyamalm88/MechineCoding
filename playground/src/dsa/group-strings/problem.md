# Group Shifted Strings (LeetCode #249)

We can shift a string by shifting each of its letters to its successive letter.
For example, "abc" can be shifted to be "bcd".
We can keep shifting the string to form a sequence.
For example, we can keep shifting "abc" to form the sequence:
"abc" -> "bcd" -> ... -> "xyz".

Given an array of strings strings, group all strings[i] that belong to the
same shifting sequence. You may return the answer in any order.

Example 1:
Input: strings = ["abc","bcd","acef","xyz","az","ba","a","z"]
Output: [["acef"],["a","z"],["abc","bcd","xyz"],["az","ba"]]

Constraints:
- 1 <= strings.length <= 200
- 1 <= strings[i].length <= 50
- strings[i] consists of lowercase English letters.

## Approach

Hashing by Relative Difference

## Intuition

Two strings are in the same "shift group" if the difference between consecutive
characters is identical.
E.g., "abc" -> diffs are [1, 1]. "bcd" -> diffs are [1, 1].
E.g., "az" -> diff is [25]. "ba" -> diff is [-1].
Note: We must handle wrap-around (modulo 26). 'a' - 'b' should be treated
consistently. Usually (char2 - char1 + 26) % 26.

We create a unique key for each string based on these differences.

Time Complexity: O(N * K) where N is array length, K is max string length.
Space Complexity: O(N * K) to store the map and output.
