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
