# Decode String (LeetCode #394)

Given an encoded string, return its decoded form.
Encoding rule: k[encoded_string] means encoded_string repeated k times.
k is always a positive integer. Input is always valid.

Example 1:
Input: "3[a]2[bc]"  → Output: "aaabcbc"

Example 2:
Input: "3[a2[c]]"   → Output: "accaccacc"  (nested!)

Example 3:
Input: "2[abc]3[cd]ef" → Output: "abcabccdcdcdef"

Constraints:
- 1 <= s.length <= 30
- s consists of lowercase letters, digits, and square brackets
- All integers in s are in [1, 300]

## Approach

Stack — push on '[', pop and expand on ']'

## Story / intuition

Think of nested gift boxes. When you see `3[`, you set aside what you've
built so far (push to stack) and start filling the inner box.
When you see `]`, you close the box, repeat its contents k times,
and attach it to whatever you had before (pop from stack).

Stack stores pairs: [countSoFar, stringSoFar]

## Dry run

"3[a2[c]]"
'3'  → curNum=3
'['  → push(3, ""), curStr="", curNum=0
'a'  → curStr="a"
'2'  → curNum=2
'['  → push(2, "a"), curStr="", curNum=0
'c'  → curStr="c"
']'  → pop(2,"a"), curStr = "a" + "c".repeat(2) = "acc"
']'  → pop(3,""),  curStr = "" + "acc".repeat(3) = "accaccacc"
Result: "accaccacc" ✓

Time:  O(maxK^depth * N) where maxK is max multiplier, depth is nesting
```text
       In practice O(output_length) which is the unavoidable cost of building the string
```

Space: O(N) for stack
