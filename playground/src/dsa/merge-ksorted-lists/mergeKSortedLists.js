// ============================================================================
// APPROACH: Min-Heap of size K
// ============================================================================
/**
 * STORY / INTUITION:
 * Think of K sorted queues racing to be the next smallest. At any point,
 * the global minimum must be the FRONT element of one of the K lists.
 * Use a Min-Heap that holds ONE node from each list.
 * Poll the minimum → add to result → push the NEXT node from that same list.
 *
 * This way the heap always holds at most K nodes (one per list).
 *
 * DRY RUN: lists=[[1,4,5],[1,3,4],[2,6]]
 * Init heap: {1→list0, 1→list1, 2→list2}
 * Pop 1 (list0): result=[1], push 4(list0) → heap:{1,2,4}
 * Pop 1 (list1): result=[1,1], push 3(list1) → heap:{2,3,4}
 * Pop 2 (list2): result=[1,1,2], push 6(list2) → heap:{3,4,6}
 * Pop 3 (list1): result=[1,1,2,3], push 4(list1) → heap:{4,4,6}
 * Pop 4 (list0): result=[1,1,2,3,4], push 5(list0) → heap:{4,5,6}
 * ... → [1,1,2,3,4,4,5,6] ✓
 *
 * Time:  O(N log K) where N = total nodes, K = number of lists
 * Space: O(K) for heap
 */
class ListNode {
  constructor(val, next = null) {
    this.val = val;
    this.next = next;
  }
}

// Min-Heap keyed by node.val
class MinHeap {
  constructor() { this.h = []; }
  size() { return this.h.length; }
  push(node) {
    this.h.push(node);
    let i = this.h.length - 1;
    while (i > 0) {
      const p = (i - 1) >> 1;
      if (this.h[p].val <= this.h[i].val) break;
      [this.h[p], this.h[i]] = [this.h[i], this.h[p]];
      i = p;
    }
  }
  pop() {
    if (this.h.length === 1) return this.h.pop();
    const top = this.h[0];
    this.h[0] = this.h.pop();
    let i = 0;
    while (true) {
      let s = i, l = 2*i+1, r = 2*i+2;
      if (l < this.h.length && this.h[l].val < this.h[s].val) s = l;
      if (r < this.h.length && this.h[r].val < this.h[s].val) s = r;
      if (s === i) break;
      [this.h[i], this.h[s]] = [this.h[s], this.h[i]];
      i = s;
    }
    return top;
  }
}

const mergeKLists = (lists) => {
  const heap = new MinHeap();

  // Initialize heap with the head of each list
  for (const head of lists) {
    if (head) heap.push(head);
  }

  const dummy = new ListNode(0);
  let curr = dummy;

  while (heap.size() > 0) {
    const node = heap.pop();
    curr.next = node;
    curr = curr.next;
    if (node.next) heap.push(node.next);
  }

  return dummy.next;
};

// Helper: build linked list from array
const buildList = (arr) => {
  const dummy = new ListNode(0);
  let curr = dummy;
  for (const val of arr) { curr.next = new ListNode(val); curr = curr.next; }
  return dummy.next;
};

// Helper: linked list to array
const toArray = (head) => {
  const res = [];
  while (head) { res.push(head.val); head = head.next; }
  return res;
};

// ============================================================================
// TEST CASES
// ============================================================================
console.log("=== Merge K Sorted Lists Tests ===\n");

console.log("Test 1:", toArray(mergeKLists([
  buildList([1, 4, 5]),
  buildList([1, 3, 4]),
  buildList([2, 6])
]))); // Expected: [1,1,2,3,4,4,5,6]

console.log("Test 2:", toArray(mergeKLists([]))); // Expected: []
console.log("Test 3:", toArray(mergeKLists([buildList([])]))); // Expected: []

module.exports = { mergeKLists };
