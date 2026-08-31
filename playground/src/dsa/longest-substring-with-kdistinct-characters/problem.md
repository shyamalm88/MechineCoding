# Longest Substring with At Most K Distinct Characters (LeetCode #340)

Given a string s and an integer k, return the length of the longest
substring of s that contains at most k distinct characters.

Example 1:
Input: s = "eceba", k = 2
Output: 3
Explanation: The substring is "ece" with length 3.

Example 2:
Input: s = "aa", k = 1
Output: 2
Explanation: The substring is "aa" with length 2.

Constraints:
- 1 <= s.length <= 10^5
- 0 <= k <= 50

## Approach

Sliding Window — at most K distinct chars in window

## Story / intuition

Same template as Fruit Into Baskets (#904), generalized from "2 baskets"
to "K baskets". Use a Map to track { char → count in window }.
When map.size > k, shrink from left until map.size <= k again.
At every step the window is valid (<= k distinct), so track max length.

Edge case: k = 0 → no characters allowed → answer is always 0.

DRY RUN (s = "eceba", k = 2):
r=0('e'): map={e:1}, size=1, win=[0..0] len=1
r=1('c'): map={e:1,c:1}, size=2, win=[0..1] len=2
r=2('e'): map={e:2,c:1}, size=2, win=[0..2] len=3
r=3('b'): map={e:2,c:1,b:1}, size=3 > 2 → shrink:
```text
  l=0('e'): map={e:1,c:1,b:1}, size=3 > 2 → shrink:
  l=1('c'): map={e:1,b:1}, size=2. Stop. win=[2..3] len=2
```

r=4('a'): map={e:1,b:1,a:1}, size=3 > 2 → shrink:
```text
  l=2('e'): map={b:1,a:1}, size=2. Stop. win=[3..4] len=2
```

Result: max length seen = 3

Time:  O(N)
Space: O(K) — map holds at most K+1 entries at any time
