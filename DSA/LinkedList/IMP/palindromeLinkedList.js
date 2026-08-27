/**
 * PROBLEM: Palindrome Linked List (LeetCode #234)
 *
 * Determine whether a singly linked list reads the same forwards and backwards,
 * in O(1) extra space.
 *
 * INTUITION:
 * Copying values into an array and two-pointering it is O(n) space and usually
 * rejected. The O(1) answer composes two primitives you already know:
 *   1. find the middle (fast/slow)
 *   2. reverse the second half
 *   3. walk both halves in lockstep comparing values
 *
 * DRY RUN: 1 2 2 1
 *   middle → second half starts at index 2
 *   reverse second half → 1 2
 *   compare 1==1, 2==2 → true
 *
 * TIME: O(n)   SPACE: O(1)
 *
 * IMPORTANT: this MUTATES the input. Interviewers often ask you to restore it —
 * re-reverse the second half before returning.
 */
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
