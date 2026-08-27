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
