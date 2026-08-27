/**
 * PROBLEM: Reorder List (LeetCode #143)
 *
 * Reorder 1→2→3→4→5 into 1→5→2→4→3, in place.
 *
 * INTUITION:
 * The target interleaves the list with its own reverse. Three known steps:
 *   1. split at the middle
 *   2. reverse the second half
 *   3. weave the two halves alternately
 *
 * This problem is really a test of whether you can COMPOSE the primitives
 * rather than invent something new.
 *
 * DRY RUN: 1 2 3 4
 *   halves: [1,2] and [3,4] → reverse second → [4,3]
 *   weave: 1 → 4 → 2 → 3
 *
 * TIME: O(n)   SPACE: O(1)
 */
function ListNode(val, next = null) { this.val = val; this.next = next; }
const toList = (a) => { const d = new ListNode(0); let t = d; for (const v of a) t = t.next = new ListNode(v); return d.next; };
const toArray = (h) => { const o = []; for (let n = h; n; n = n.next) o.push(n.val); return o; };

const reorderList = (head) => {
  if (!head || !head.next) return head;

  // 1. first middle
  let slow = head, fast = head;
  while (fast.next && fast.next.next) { slow = slow.next; fast = fast.next.next; }

  // 2. reverse the second half and CUT the link, or the weave cycles forever
  let second = slow.next;
  slow.next = null;
  let prev = null;
  while (second) { const next = second.next; second.next = prev; prev = second; second = next; }

  // 3. weave
  let first = head;
  second = prev;
  while (second) {
    const f = first.next, s = second.next;
    first.next = second;
    second.next = f;
    first = f;
    second = s;
  }
  return head;
};

console.log(toArray(reorderList(toList([1, 2, 3, 4, 5])))); // [1,5,2,4,3]
console.log(toArray(reorderList(toList([1, 2, 3, 4])))); // [1,4,2,3]
