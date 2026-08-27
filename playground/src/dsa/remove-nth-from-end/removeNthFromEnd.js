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
