/**
 * PROBLEM: Remove Nth Node From End of List (LeetCode #19)
 *
 * Remove the nth node from the end and return the head — in one pass.
 *
 * INTUITION:
 * Two pointers separated by a GAP of n. Advance fast by n first, then move
 * both together; when fast hits the end, slow is exactly n from the end.
 *
 * The dummy head is what makes removing the FIRST node need no special case —
 * without it, deleting head requires a separate branch.
 *
 * DRY RUN: 1 2 3 4 5, n = 2
 *   fast advances 2 → at 3
 *   move both until fast.next null → slow at 3, fast at 5
 *   slow.next = slow.next.next → removes 4
 *   result 1 2 3 5
 *
 * TIME: O(n) one pass   SPACE: O(1)
 */
function ListNode(val, next = null) { this.val = val; this.next = next; }
const toList = (a) => { const d = new ListNode(0); let t = d; for (const v of a) t = t.next = new ListNode(v); return d.next; };
const toArray = (h) => { const o = []; for (let n = h; n; n = n.next) o.push(n.val); return o; };

const removeNthFromEnd = (head, n) => {
  const dummy = new ListNode(0, head);
  let slow = dummy;
  let fast = dummy;

  for (let i = 0; i < n; i++) fast = fast.next; // open the gap

  while (fast.next) { slow = slow.next; fast = fast.next; }

  slow.next = slow.next.next;
  return dummy.next; // NOT head -- head may have been the node removed
};

console.log(toArray(removeNthFromEnd(toList([1, 2, 3, 4, 5]), 2))); // [1,2,3,5]
console.log(toArray(removeNthFromEnd(toList([1]), 1))); // [] -- dummy earns its keep
console.log(toArray(removeNthFromEnd(toList([1, 2]), 2))); // [2] removes the head
