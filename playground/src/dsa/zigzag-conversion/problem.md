# Zigzag Conversion (LeetCode #6)

The string "PAYPALISHIRING" is written in a zigzag pattern on a given
number of rows like this (numRows = 3):

P   A   H   N
A P L S I I G
Y   I   R

Given a string s and an integer numRows, return the string read line by
line (top row first, left to right).

Example 1:
Input: s = "PAYPALISHIRING", numRows = 3
Output: "PAHNAPLSIIGYIR"

Example 2:
Input: s = "PAYPALISHIRING", numRows = 4
Output: "PINALSIGYAHRPI"

Explanation:
P     I    N
A   L S  I G
Y A   H R
P     I

Example 3:
Input: s = "A", numRows = 1
Output: "A"

Constraints:
- 1 <= s.length <= 1000
- s consists of English letters, ',' and '.'
- 1 <= numRows <= 1000
