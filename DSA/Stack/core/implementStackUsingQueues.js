/**
 * PROBLEM: Implement Stack using Queues (LeetCode #225)
 *
 * INTUITION:
 * A queue is FIFO; a stack is LIFO. To reverse the order you pay somewhere —
 * the design decision is WHICH operation absorbs the cost.
 *
 * This implementation makes PUSH expensive with a single queue: after enqueuing
 * the new element, rotate every earlier element to the back. The newest item
 * ends up at the front, so pop/top become O(1).
 *
 *   push(1): [1]
 *   push(2): [2,1]   (enqueue 2 → [1,2], rotate once → [2,1])
 *   push(3): [3,2,1]
 *
 * The alternative (two queues, costly pop) is the other accepted answer; say
 * which you chose and why.
 *
 * TIME: push O(n), pop/top/empty O(1)   SPACE: O(n)
 */
class MyStack {
  constructor() { this.q = []; }

  push(x) {
    this.q.push(x);
    // rotate the previously queued items behind the new one
    for (let i = 0; i < this.q.length - 1; i++) this.q.push(this.q.shift());
  }

  pop() { return this.q.shift(); }
  top() { return this.q[0]; }
  empty() { return this.q.length === 0; }
}

const st = new MyStack();
st.push(1); st.push(2); st.push(3);
console.log(st.top(), st.pop(), st.pop(), st.empty()); // 3 3 2 false
