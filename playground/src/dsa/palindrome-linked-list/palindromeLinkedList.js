function ListNode(val, next = null) { this.val = val; this.next = next; }
const toList = (a) => { const d = new ListNode(0); let t = d; for (const v of a) t = t.next = new ListNode(v); return d.next; };

const reverse = (head) => {
  let prev = null;
  while (head) { const next = head.next; head.next = prev; prev = head; head = next; }
  return prev;
};

const isPalindrome = (head) => {
  if (!head || !head.next) return true;

  // 1. first middle, so the list splits evenly
  let slow = head, fast = head;
  while (fast.next && fast.next.next) { slow = slow.next; fast = fast.next.next; }

  // 2. reverse everything after slow
  let second = reverse(slow.next);
  const secondHead = second;

  // 3. compare; the first half may be one longer, which is fine because we
  //    stop when the (shorter) reversed half runs out
  let first = head;
  let ok = true;
  while (second) {
    if (first.val !== second.val) { ok = false; break; }
    first = first.next;
    second = second.next;
  }

  slow.next = reverse(secondHead); // restore the list
  return ok;
};

console.log(isPalindrome(toList([1, 2, 2, 1]))); // true
console.log(isPalindrome(toList([1, 2]))); // false
console.log(isPalindrome(toList([1, 2, 3, 2, 1]))); // true (odd length)
