# Partition Labels (LeetCode #763)

Partition string s into as many parts as possible so that each letter appears
in at most one part. Return a list of the sizes of these parts.

Example 1:
Input: s="ababcbacadefegdehijhklij"
Output: [9,7,8]
("ababcbaca" | "defegde" | "hijhklij")

Example 2:
Input: s="eccbbbbdec" → Output: [10]

Constraints:
- 1 <= s.length <= 500
- s consists of lowercase English letters

## Approach

Last Occurrence Map + Greedy Window Extension

## Story / intuition

A partition boundary can ONLY be placed after a position where all characters
seen so far have their LAST OCCURRENCE within the current window.

Algorithm:
1. Build lastIndex[char] = last index of that char in s.
2. Walk through s with a window [start, end].
```text
   For each char, extend end = max(end, lastIndex[char]).
   When i == end → all chars in [start..end] are contained → CUT here!
```

## Greedy

We extend the window as far right as the farthest last occurrence
of any character we've encountered. When we reach that boundary, we KNOW
nothing inside the window can appear outside it.

## Dry run

s="ababcbacadefegdehijhklij"
lastIndex: a=8,b=5,c=7,d=14,e=15,f=11,g=13,h=19,i=22,j=23,k=20,l=21

start=0, end=0
i=0(a): end=max(0,8)=8
i=1(b): end=max(8,5)=8
...
i=8(a): end=8, i==end → PARTITION! size=8-0+1=9. start=9.
i=9(d): end=max(9,14)=14
i=10(e): end=max(14,15)=15
...
i=15(e): end=15, i==end → PARTITION! size=15-9+1=7. start=16.
...
i=23(j): end=23, i==end → PARTITION! size=23-16+1=8.
Result: [9,7,8] ✓

Time:  O(N)
Space: O(1) — 26 chars max in map
