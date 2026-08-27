function ListNode(val, next = null) { this.val = val; this.next = next; }
const toList = (a) => { const d = new ListNode(0); let t = d; for (const v of a) t = t.next = new ListNode(v); return d.next; };
const toArray = (h) => { const o = []; for (let n = h; n; n = n.next) o.push(n.val); return o; };

const addTwoNumbers = (l1, l2) => {
  const dummy = new ListNode(0);
  let tail = dummy;
  let carry = 0;

  // The carry is part of the loop condition -- otherwise 5+5 loses the final 1.
  while (l1 || l2 || carry) {
    const sum = (l1?.val ?? 0) + (l2?.val ?? 0) + carry;
    carry = Math.floor(sum / 10);
    tail = tail.next = new ListNode(sum % 10);
    l1 = l1?.next ?? null;
    l2 = l2?.next ?? null;
  }
  return dummy.next;
};

console.log(toArray(addTwoNumbers(toList([2, 4, 3]), toList([5, 6, 4])))); // [7,0,8]
console.log(toArray(addTwoNumbers(toList([9, 9]), toList([1])))); // [0,0,1] carry propagates
