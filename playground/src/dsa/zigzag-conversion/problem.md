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

## Approach

Simulate row placement with a bouncing pointer

## Story / intuition

Don't think of this as building a 2D grid — think of it as DEALING CARDS
into `numRows` piles, one character at a time, where the "dealing finger"
bounces back and forth between the top row and the bottom row:

```text
  row 0 → row 1 → ... → row (numRows-1) → row (numRows-2) → ... → row 0 → ...
```

Keep one string per row. For each character in `s`, append it to the
current row, then move the pointer one step in the current direction.
Whenever the pointer HITS a boundary (row 0 or the last row), flip the
direction — that's the "bounce".

At the end, concatenate all rows top to bottom — that's the zigzag
reading order.

Special case: numRows === 1 means there's no zigzag at all (every
character is its own "row"), so just return `s` unchanged.

## Dry run

s = "PAYPALISHIRING", numRows = 3
rows = ["", "", ""], curRow = 0, direction = +1 (starts moving down)

P → row0="P"  at row0 (boundary) → flip → direction=+1, curRow→1
A → row1="A"  curRow→2
Y → row2="Y"  at row2 (boundary) → flip → direction=-1, curRow→1
P → row1="AP" curRow→0
A → row0="PA" at row0 → flip → direction=+1, curRow→1
L → row1="APL" curRow→2
I → row2="YI" at row2 → flip → direction=-1, curRow→1
S → row1="APLS" curRow→0
H → row0="PAH" at row0 → flip → direction=+1, curRow→1
I → row1="APLSI" curRow→2
R → row2="YIR" at row2 → flip → direction=-1, curRow→1
I → row1="APLSII" curRow→0
N → row0="PAHN" at row0 → flip → direction=+1, curRow→1
G → row1="APLSIIG" curRow→2

rows = ["PAHN", "APLSIIG", "YIR"]
Result: "PAHN" + "APLSIIG" + "YIR" = "PAHNAPLSIIGYIR" ✓

Time:  O(N) — each character is placed exactly once
Space: O(N) — for the row strings
