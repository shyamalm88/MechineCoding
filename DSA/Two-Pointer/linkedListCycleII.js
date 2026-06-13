/**
 * ============================================================================
 * PROBLEM: Linked List Cycle II (LeetCode #142)
 * ============================================================================
 * Given the head of a linked list, return the node where the cycle begins.
 * If there is no cycle, return null.
 *
 * Example 1:
 * Input: head = [3,2,0,-4], tail connects to node index 1 (value 2)
 * Output: the node with value 2
 *
 * Example 2:
 * Input: head = [1,2], tail connects to node index 0 (value 1)
 * Output: the node with value 1
 *
 * Example 3:
 * Input: head = [1], no cycle
 * Output: null
 *
 * Constraints:
 * - 0 <= number of nodes <= 10^4
 * - -10^5 <= Node.val <= 10^5
 * - Follow up: solve in O(1) extra space
 */

// ============================================================================
// APPROACH: Floyd's Tortoise and Hare (fast/slow pointers)
// ============================================================================
/**
 * STORY / INTUITION:
 * Two runners on a (possibly circular) track: `slow` moves 1 step at a time,
 * `fast` moves 2 steps. If there's no cycle, `fast` simply falls off the end
 * (hits null) first. If there IS a cycle, the faster runner eventually LAPS
 * the slower one and they meet somewhere INSIDE the loop.
 *
 * THE TRICK (why phase 2 lands on the cycle's start):
 * Let `head -> cycle start` = a, `cycle start -> meeting point` = b, and the
 * rest of the loop back to start = c. At the meeting point:
 *   slow traveled = a + b
 *   fast traveled = a + b + (b + c)   <- one extra full lap around the loop
 *   fast = 2 * slow  =>  a + 2b + c = 2(a + b)  =>  a = c
 * So "head -> cycle start" and "meeting point -> cycle start" are the SAME
 * distance. Reset one pointer to `head`, advance both 1 step at a time -
 * they meet exactly at the cycle's start.
 *
 * Time:  O(N)
 * Space: O(1)
 */
class ListNode {
  constructor(val, next = null) {
    this.val = val;
    this.next = next;
  }
}

const detectCycle = (head) => {
  let slow = head;
  let fast = head;

  // Phase 1: find a meeting point inside the cycle (or run off the end)
  while (fast && fast.next) {
    slow = slow.next;
    fast = fast.next.next;

    if (slow === fast) {
      // Phase 2: walk both pointers 1 step at a time to find the start
      let ptr = head;
      while (ptr !== slow) {
        ptr = ptr.next;
        slow = slow.next;
      }
      return ptr;
    }
  }

  return null; // no cycle
};

// ============================================================================
// TEST CASES
// ============================================================================
console.log("=== Linked List Cycle II Tests ===\n");

// Builds a linked list from values, optionally linking the tail back to the
// node at `cycleIndex` (-1 = no cycle). Returns the head node.
const buildList = (values, cycleIndex = -1) => {
  const nodes = values.map((v) => new ListNode(v));
  for (let i = 0; i < nodes.length - 1; i++) nodes[i].next = nodes[i + 1];
  if (cycleIndex >= 0) nodes[nodes.length - 1].next = nodes[cycleIndex];
  return nodes[0] || null;
};

const t1 = buildList([3, 2, 0, -4], 1);
console.log("Test 1:", detectCycle(t1)?.val ?? null); // Expected: 2

const t2 = buildList([1, 2], 0);
console.log("Test 2:", detectCycle(t2)?.val ?? null); // Expected: 1

const t3 = buildList([1], -1);
console.log("Test 3:", detectCycle(t3));               // Expected: null

module.exports = { detectCycle, ListNode };
