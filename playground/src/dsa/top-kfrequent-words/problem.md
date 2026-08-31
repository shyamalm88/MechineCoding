# Top K Frequent Words (LeetCode #692)

Given an array of strings `words` and an integer k, return the k most
frequent strings. Sort the answer by frequency from highest to lowest.
Words with the SAME frequency are sorted by LEXICOGRAPHICAL order (smaller
string first).

Example 1:
Input: words=["i","love","leetcode","i","love","coding"], k=2
Output: ["i","love"]
Explanation: "i" and "love" both appear twice; "i" < "love" lexicographically.

Example 2:
Input: words=["the","day","is","sunny","the","the","the","sunny","is","is"], k=4
Output: ["the","is","sunny","day"]

Constraints:
- 1 <= words.length <= 500
- 1 <= words[i].length <= 10
- words[i] consists of lowercase English letters
- k is in the range [1, the number of unique words]

## Approach

Min-Heap of Size K with a "Least Desirable First" Comparator

## Story / intuition

This is `topKFrequentElements` (LC347) with a TWIST: when frequencies tie,
we need a SECOND sort key (lexicographic order) — a single number can't
capture "priority" anymore, so the heap needs a CUSTOM COMPARATOR over
[word, count] pairs.

Maintain a MIN-HEAP of size k where the "smallest" (root, popped first
when oversized) is the LEAST desirable candidate:
```text
  - lower frequency is less desirable, OR
  - equal frequency AND lexicographically LARGER word is less desirable
    (because smaller words should rank higher / survive).
```

Push every (word, count) pair; whenever size exceeds k, pop the least
desirable one. What remains are the k best, but in "worst-to-best" heap
order — pop them all and REVERSE to get "best-to-worst".

## Dry run

words=["i","love","leetcode","i","love","coding"], k=2
freq: i=2, love=2, leetcode=1, coding=1
push(i,2)        -> heap=[(i,2)]
push(love,2)     -> tie on freq, "love">"i" (less desirable) -> bubbles to root
```text
                    heap root=(love,2)
```

push(leetcode,1) -> freq1<2, least desirable -> becomes root; size=3>2 -> pop root
```text
                    pops (leetcode,1); heap=[(love,2),(i,2)]
```

push(coding,1)   -> freq1, least desirable -> root; size=3>2 -> pop root
```text
                    pops (coding,1); heap=[(love,2),(i,2)]
```

Pop remaining (worst-first): (love,2) then (i,2) -> ["love","i"]
Reverse -> ["i","love"] ✓

Time:  O(N log K) — N words, heap operations bounded by size K
Space: O(N) — frequency map + heap
