/**
 * PROBLEM: Reverse Nodes in k-Group (LeetCode #25)
 *
 * Reverse every consecutive group of k nodes. A trailing group with fewer than
 * k nodes is left as-is.
 *
 * INTUITION:
 * Reversing k nodes is the standard 3-pointer reverse. The hard part is the
 * BOOKKEEPING between groups: after reversing a group, the node that was its
 * head is now its tail and must be linked to whatever comes next.
 *
 * The dummy node plus a `groupPrev` pointer makes that manageable:
 *   groupPrev → [ ...k nodes reversed... ] → rest
 *
 * Crucially you must FIRST check that k nodes remain — otherwise you reverse a
 * partial tail and violate the spec.
 *
 * DRY RUN: 1 2 3 4 5, k = 2
 *   group [1,2] → 2 1, groupPrev now 1
 *   group [3,4] → 4 3, groupPrev now 3
 *   only [5] left → untouched
 *   result 2 1 4 3 5
 *
 * TIME: O(n)   SPACE: O(1)
 */
function ListNode(val, next = null) { this.val = val; this.next = next; }
const toList = (a) => { const d = new ListNode(0); let t = d; for (const v of a) t = t.next = new ListNode(v); return d.next; };
const toArray = (h) => { const o = []; for (let n = h; n; n = n.next) o.push(n.val); return o; };

const reverseKGroup = (head, k) => {
  const dummy = new ListNode(0, head);
  let groupPrev = dummy;

  for (;;) {
    // Is there a full group of k ahead?
    let kth = groupPrev;
    for (let i = 0; i < k && kth; i++) kth = kth.next;
    if (!kth) break;

    const groupNext = kth.next;

    // reverse the group, seeding prev with groupNext so the tail links onward
    let prev = groupNext;
    let curr = groupPrev.next;
    while (curr !== groupNext) {
      const next = curr.next;
      curr.next = prev;
      prev = curr;
      curr = next;
    }

    const newGroupPrev = groupPrev.next; // old head is the new tail
    groupPrev.next = kth;                // link into the reversed group
    groupPrev = newGroupPrev;
  }
  return dummy.next;
};

console.log(toArray(reverseKGroup(toList([1, 2, 3, 4, 5]), 2))); // [2,1,4,3,5]
console.log(toArray(reverseKGroup(toList([1, 2, 3, 4, 5]), 3))); // [3,2,1,4,5]
console.log(toArray(reverseKGroup(toList([1, 2, 3]), 4)));       // [1,2,3] fewer than k
