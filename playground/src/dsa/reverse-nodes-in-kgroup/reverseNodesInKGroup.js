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
