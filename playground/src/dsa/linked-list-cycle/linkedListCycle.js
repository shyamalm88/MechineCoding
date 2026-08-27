function ListNode(val, next = null) { this.val = val; this.next = next; }

const hasCycle = (head) => {
  let slow = head;
  let fast = head;
  while (fast && fast.next) {
    slow = slow.next;
    fast = fast.next.next;
    if (slow === fast) return true;
  }
  return false; // fast fell off the end
};

const a = new ListNode(3), b = new ListNode(2), c = new ListNode(0), d = new ListNode(-4);
a.next = b; b.next = c; c.next = d; d.next = b; // cycle back to b
console.log(hasCycle(a)); // true
const x = new ListNode(1); x.next = new ListNode(2);
console.log(hasCycle(x), hasCycle(null)); // false false
