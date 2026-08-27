/**
 * PROBLEM: Middle of the Linked List (LeetCode #876)
 *
 * Return the middle node. With an even count, return the SECOND middle.
 *
 * INTUITION:
 * Fast/slow pointers. Fast moves two steps for every one of slow, so when
 * fast reaches the end slow is exactly halfway. One pass, no length count.
 *
 * DRY RUN: 1 2 3 4 5
 *   slow=1 fast=1 → slow=2 fast=3 → slow=3 fast=5 → fast.next null, stop
 *   middle = 3
 *
 * The loop condition decides which middle you get on even input:
 *   while (fast && fast.next)      → SECOND middle  (this problem)
 *   while (fast.next && fast.next.next) → FIRST middle
 *
 * TIME: O(n)   SPACE: O(1)
 */
function ListNode(val, next = null) { this.val = val; this.next = next; }
const toList = (a) => { const d = new ListNode(0); let t = d; for (const v of a) t = t.next = new ListNode(v); return d.next; };
const toArray = (h) => { const o = []; for (let n = h; n; n = n.next) o.push(n.val); return o; };

const middleNode = (head) => {
  let slow = head;
  let fast = head;
  while (fast && fast.next) {
    slow = slow.next;
    fast = fast.next.next;
  }
  return slow;
};

console.log(toArray(middleNode(toList([1, 2, 3, 4, 5])))); // [3,4,5]
console.log(toArray(middleNode(toList([1, 2, 3, 4, 5, 6])))); // [4,5,6] second middle
