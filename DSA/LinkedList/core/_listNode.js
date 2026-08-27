/**
 * PROBLEM: Linked List helpers (shared ListNode + array converters)
 *
 * INTUITION:
 * Every linked-list problem needs the same node shape and the same two
 * converters for testing. Keeping them in one place stops each solution file
 * re-declaring them.
 */
function ListNode(val, next = null) {
  this.val = val;
  this.next = next;
}

const toList = (arr) => {
  const dummy = new ListNode(0);
  let tail = dummy;
  for (const v of arr) tail = tail.next = new ListNode(v);
  return dummy.next;
};

const toArray = (head) => {
  const out = [];
  for (let n = head; n; n = n.next) out.push(n.val);
  return out;
};

console.log(toArray(toList([1, 2, 3]))); // [1,2,3]
