/**
 * PROBLEM: Merge Two Sorted Lists (LeetCode #21)
 *
 * Splice two sorted lists into one sorted list.
 *
 * INTUITION:
 * The classic merge step of merge sort. A DUMMY head removes every
 * special case for "is this the first node?" — you always append to
 * `tail.next` and return `dummy.next` at the end.
 *
 * DRY RUN: [1,2,4] and [1,3,4]
 *   compare 1,1 → take a → 1
 *   compare 2,1 → take b → 1
 *   compare 2,3 → take a → 2
 *   compare 4,3 → take b → 3
 *   compare 4,4 → take a → 4
 *   a exhausted → attach rest of b → 4
 *   result 1 1 2 3 4 4
 *
 * TIME: O(n + m)   SPACE: O(1) — nodes are relinked, not copied
 */
function ListNode(val, next = null) { this.val = val; this.next = next; }
const toList = (a) => { const d = new ListNode(0); let t = d; for (const v of a) t = t.next = new ListNode(v); return d.next; };
const toArray = (h) => { const o = []; for (let n = h; n; n = n.next) o.push(n.val); return o; };

const mergeTwoLists = (a, b) => {
  const dummy = new ListNode(0);
  let tail = dummy;

  while (a && b) {
    if (a.val <= b.val) { tail.next = a; a = a.next; }
    else { tail.next = b; b = b.next; }
    tail = tail.next;
  }
  // At most one list remains; attach it wholesale.
  tail.next = a ?? b;
  return dummy.next;
};

console.log(toArray(mergeTwoLists(toList([1, 2, 4]), toList([1, 3, 4])))); // [1,1,2,3,4,4]
console.log(toArray(mergeTwoLists(toList([]), toList([0])))); // [0]
