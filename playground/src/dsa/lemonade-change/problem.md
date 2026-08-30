# Lemonade Change (LeetCode #860)

Each lemonade costs $5. Customers queue up paying with a $5, $10, or $20
bill and you must give correct change immediately. You start with no money.
Return true if you can serve every customer in order.

Example 1:
Input: bills = [5,5,5,10,20] → Output: true
(Take 5,5,5. For 10 give back a 5. For 20 give back 10 + 5.)

Example 2:
Input: bills = [5,5,10,10,20] → Output: false
(At the 20 you hold 10,10 — you cannot make 15.)

Constraints:
- 1 <= bills.length <= 10^5
- bills[i] is either 5, 10, or 20
