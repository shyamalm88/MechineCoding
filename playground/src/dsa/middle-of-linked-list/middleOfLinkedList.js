function ListNode(val, next = null) { this.val = val; this.next = next; }
const toList = (a) => { const d = new ListNode(0); let t = d; for (const v of a) t = t.next = new ListNode(v); return d.next; };
const toArray = (h) => { const o = []; for (let n = h; n; n = n.next) o.push(n.val); return o; };

const middleNode = (head) => {
  let slow = head;
  let fast = head;
  while (fast && fast.next) {
    slow = slow.next;
    fast = fast.next.next;
  }
  return slow;
};

console.log(toArray(middleNode(toList([1, 2, 3, 4, 5])))); // [3,4,5]
console.log(toArray(middleNode(toList([1, 2, 3, 4, 5, 6])))); // [4,5,6] second middle
