# Letter Combinations of a Phone Number (LeetCode #17)

Given a string containing digits from 2-9 inclusive, return all possible
letter combinations that the number could represent. Return the answer in
any order.

A mapping of digits to letters (just like on the telephone buttons) is given below.
Note that 1 does not map to any letters.

2: "abc", 3: "def", 4: "ghi", 5: "jkl",
6: "mno", 7: "pqrs", 8: "tuv", 9: "wxyz"

Example 1:
Input: digits = "23"
Output: ["ad","ae","af","bd","be","bf","cd","ce","cf"]

Example 2:
Input: digits = ""
Output: []

Example 3:
Input: digits = "2"
Output: ["a","b","c"]

Constraints:
- 0 <= digits.length <= 4
- digits[i] is a digit in the range ['2', '9'].

## Approach

Backtracking

## Intuition

We need to generate combinations where we pick one letter for the first digit,
one letter for the second digit, and so on.
This is a classic backtracking problem where we explore a decision tree.

At each step (index i), we look at the digit `digits[i]`.
We iterate through all possible letters mapped to that digit.
For each letter, we append it to our current string and move to the next digit (i + 1).
When our current string length equals the input digits length, we have a valid combination.

Time Complexity: O(4^N * N)
- In the worst case (digits 7 or 9), each digit has 4 choices.
- So there are up to 4^N combinations.
- For each combination, we build a string of length N.

Space Complexity: O(N)
- Recursion stack depth is N (length of digits).
