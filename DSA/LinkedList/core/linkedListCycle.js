/**
 * PROBLEM: Linked List Cycle (LeetCode #141)
 *
 * Does the list contain a cycle?
 *
 * INTUITION:
 * Floyd's tortoise and hare. Move slow one step and fast two. In a cycle the
 * gap between them closes by exactly one each iteration, so they must
 * eventually collide. With no cycle, fast runs off the end.
 *
 * A Set of visited nodes also works in O(n) space -- state the trade, then give
 * the O(1) answer.
 *
 * DRY RUN: 3 → 2 → 0 → -4 → (back to 2)
 *   slow 2, fast 0 → slow 0, fast 2 → slow -4, fast -4 → collision → true
 *
 * TIME: O(n)   SPACE: O(1)
 *
 * FOLLOW-UP (#142, cycle start): after the collision, reset one pointer to the
 * head and advance both one step at a time; they meet at the cycle entrance.
 */
function ListNode(val, next = null) { this.val = val; this.next = next; }

const hasCycle = (head) => {
  let slow = head;
  let fast = head;
  while (fast && fast.next) {
    slow = slow.next;
    fast = fast.next.next;
    if (slow === fast) return true;
  }
  return false; // fast fell off the end
};

const a = new ListNode(3), b = new ListNode(2), c = new ListNode(0), d = new ListNode(-4);
a.next = b; b.next = c; c.next = d; d.next = b; // cycle back to b
console.log(hasCycle(a)); // true
const x = new ListNode(1); x.next = new ListNode(2);
console.log(hasCycle(x), hasCycle(null)); // false false
