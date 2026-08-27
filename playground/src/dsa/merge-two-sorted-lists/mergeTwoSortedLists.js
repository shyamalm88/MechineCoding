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
