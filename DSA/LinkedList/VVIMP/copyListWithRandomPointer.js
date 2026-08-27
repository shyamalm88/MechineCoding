/**
 * PROBLEM: Copy List with Random Pointer (LeetCode #138)
 *
 * Deep-copy a list where each node has `next` AND a `random` pointer to any
 * node (or null).
 *
 * INTUITION:
 * The difficulty is that when you copy node A, its `random` may point at a node
 * you have not created yet. Two standard answers:
 *
 *   1. HashMap (O(n) space) — pass 1 clones every node into a Map<old,new>;
 *      pass 2 wires next/random by looking up the originals.
 *
 *   2. Interleaving (O(1) extra space) — weave clones into the original list
 *      so every clone sits directly AFTER its original. Then
 *      `clone.random = original.random.next` works because "the clone of X" is
 *      always "X.next". Finally unzip the two lists apart.
 *
 * DRY RUN (interleaved): A → B
 *   weave  : A → A' → B → B'
 *   random : A.random=B ⇒ A'.random = B.next = B'
 *   unzip  : A → B  and  A' → B'
 *
 * TIME: O(n) both   SPACE: O(n) map / O(1) interleaved
 */
function Node(val, next = null, random = null) { this.val = val; this.next = next; this.random = random; }

const copyRandomListMap = (head) => {
  if (!head) return null;
  const map = new Map();
  for (let n = head; n; n = n.next) map.set(n, new Node(n.val));
  for (let n = head; n; n = n.next) {
    map.get(n).next = n.next ? map.get(n.next) : null;
    map.get(n).random = n.random ? map.get(n.random) : null;
  }
  return map.get(head);
};

const copyRandomList = (head) => {
  if (!head) return null;

  // 1. weave clones in
  for (let n = head; n; n = n.next.next) n.next = new Node(n.val, n.next);

  // 2. wire randoms using the invariant clone === original.next
  for (let n = head; n; n = n.next.next) {
    n.next.random = n.random ? n.random.next : null;
  }

  // 3. unzip, restoring the original list
  const cloneHead = head.next;
  for (let n = head; n; n = n.next) {
    const clone = n.next;
    n.next = clone.next;
    clone.next = n.next ? n.next.next : null;
  }
  return cloneHead;
};

// build A → B → C with randoms A→C, B→A, C→null
const a = new Node(1), b = new Node(2), c = new Node(3);
a.next = b; b.next = c; a.random = c; b.random = a;
const copy = copyRandomList(a);
console.log(copy.val, copy.next.val, copy.next.next.val);         // 1 2 3
console.log(copy.random.val, copy.next.random.val);                // 3 1
console.log(copy !== a, copy.random !== c);                        // true true (deep copy)
console.log(copyRandomListMap(a).next.random.val);                 // 1
