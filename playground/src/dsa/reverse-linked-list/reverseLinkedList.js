function ListNode(val, next = null) { this.val = val; this.next = next; }
const toList = (a) => { const d = new ListNode(0); let t = d; for (const v of a) t = t.next = new ListNode(v); return d.next; };
const toArray = (h) => { const o = []; for (let n = h; n; n = n.next) o.push(n.val); return o; };

const reverseList = (head) => {
  let prev = null;
  let curr = head;
  while (curr) {
    const next = curr.next; // save before we clobber it
    curr.next = prev;
    prev = curr;
    curr = next;
  }
  return prev; // curr is null; prev is the new head
};

// Recursive: reverse the tail, then flip the link between head and head.next.
const reverseListRecursive = (head) => {
  if (!head || !head.next) return head;
  const newHead = reverseListRecursive(head.next);
  head.next.next = head;
  head.next = null;
  return newHead;
};

console.log(toArray(reverseList(toList([1, 2, 3, 4, 5])))); // [5,4,3,2,1]
console.log(toArray(reverseListRecursive(toList([1, 2, 3])))); // [3,2,1]
console.log(toArray(reverseList(toList([])))); // []
