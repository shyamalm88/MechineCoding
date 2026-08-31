# Hand of Straights (LeetCode #846)

Alice has a hand of cards given as an integer array. She wants to rearrange
the cards into groups so that each group is of size groupSize and consists
of groupSize CONSECUTIVE cards. Return true if it is possible.

(Identical to LeetCode #1296, "Divide Array in Sets of K Consecutive
Numbers".)

Example 1:
Input: hand = [1,2,3,6,2,3,4,7,8], groupSize = 3 → Output: true
(Groups: [1,2,3], [2,3,4], [6,7,8])

Example 2:
Input: hand = [1,2,3,4,5], groupSize = 4 → Output: false

Constraints:
- 1 <= hand.length <= 10^4
- 0 <= hand[i] <= 10^9
- 1 <= groupSize <= hand.length

## Approach

Count Map + Always Start a Group at the Smallest Card Left

## Story / intuition

Look at the SMALLEST card still in your hand. Nothing smaller exists, so no
group can contain it in any position other than FIRST. That removes all
choice: the group containing it must be exactly [x, x+1, ..., x+size-1]. If
those cards are not all available, the hand is impossible — no cleverness
later can rescue it.

Repeat: take the smallest remaining card, force out its group, delete.

## Why the greedy choice is safe

There is no greedy "choice" at all — the move is forced. That is the cleanest
kind of greedy argument. Since the minimum card can only ever be a group's
head, every valid solution must contain that exact group, so committing to it
loses nothing.

## Efficiency note

rather than peeling one card at a time, if the smallest card
x appears `need` times, then ALL `need` groups start at x. Consume `need`
copies of each of x..x+size-1 in one go — that is what keeps this near
O(N log N) instead of degenerating.

## Quick reject

if hand.length % groupSize !== 0 the answer is false outright.

## Dry run

[1,2,3,6,2,3,4,7,8], groupSize = 3
counts {1:1, 2:2, 3:2, 4:1, 6:1, 7:1, 8:1}, keys sorted [1,2,3,4,6,7,8]
k=1 need=1 → consume 1,2,3 → {2:1, 3:1, 4:1, 6:1, 7:1, 8:1}
k=2 need=1 → consume 2,3,4 → {6:1, 7:1, 8:1}
k=3 need=0 → skip.  k=4 need=0 → skip
k=6 need=1 → consume 6,7,8 → {}
all consumed → TRUE

Time:  O(N log N) — sorting the distinct keys
Space: O(N) for the count map
