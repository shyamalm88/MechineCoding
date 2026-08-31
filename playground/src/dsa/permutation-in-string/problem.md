# Permutation in String (LeetCode #567)

Given two strings s1 and s2, return true if s2 contains a permutation of s1,
or false otherwise.

In other words, return true if one of s1's permutations is the substring of s2.

Example 1:
Input: s1 = "ab", s2 = "eidbaooo"
Output: true
Explanation: s2 contains one permutation of s1 ("ba").

Example 2:
Input: s1 = "ab", s2 = "eidboaoo"
Output: false

Constraints:
- 1 <= s1.length, s2.length <= 10^4
- s1 and s2 consist of lowercase English letters.

## Approach

Fixed Sliding Window

## Intuition

We need to find a substring in s2 of length `s1.length` that has the exact
same character counts as s1.
We maintain a window of size `s1.length` on s2.
We compare the frequency arrays (or maps) of s1 and the current window in s2.

## Dry run

Input: s1 = "ab", s2 = "eidbaooo"
s1 length = 2. Target counts: {a:1, b:1}

1. Init Window (indices 0-1): "ei"
```text
   - s2 counts: {e:1, i:1}. Match? No.
```

2. Slide (index 2): Add 'd', Remove 'e'
```text
   - Window: "id". s2 counts: {i:1, d:1}. Match? No.
```

3. Slide (index 3): Add 'b', Remove 'i'
```text
   - Window: "db". s2 counts: {d:1, b:1}. Match? No.
```

4. Slide (index 4): Add 'a', Remove 'd'
```text
   - Window: "ba". s2 counts: {b:1, a:1}. Match? Yes!
   - Return true.
```

Time Complexity: O(N) where N is length of s2.
Space Complexity: O(1) (Array of size 26).
