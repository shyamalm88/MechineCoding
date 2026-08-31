# Encode and Decode Strings (LeetCode #271)

Design an algorithm to encode a list of strings to a string. The encoded string
is then sent over the network and is decoded back to the original list of strings.

Example 1:
Input: ["Hello","World"]
Output: ["Hello","World"]

Constraints:
- 0 <= strs.length <= 200
- strs[i] contains any possible characters out of 256 valid ASCII characters.

## Approach

Length Prefixing

## Intuition

We cannot simply use a delimiter like ',' or '#' because the strings themselves
might contain that delimiter.
Instead, we prefix each string with its length followed by a delimiter (e.g., '#').
Format: "length#string"
Example: ["ab", "c"] -> "2#ab1#c"
When decoding, we read the integer up to '#', then read that many characters.

Time Complexity: O(N) where N is total characters.
Space Complexity: O(N)
