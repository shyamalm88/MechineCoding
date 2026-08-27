class MyCircularDeque {
  constructor(k) {
    this.capacity = k;
    this.buffer = new Array(k);
    this.front = 0;
    this.size = 0;
  }

  insertFront(value) {
    if (this.isFull()) return false;
    this.front = (this.front - 1 + this.capacity) % this.capacity; // guard negatives
    this.buffer[this.front] = value;
    this.size++;
    return true;
  }

  insertLast(value) {
    if (this.isFull()) return false;
    this.buffer[(this.front + this.size) % this.capacity] = value;
    this.size++;
    return true;
  }

  deleteFront() {
    if (this.isEmpty()) return false;
    this.front = (this.front + 1) % this.capacity;
    this.size--;
    return true;
  }

  deleteLast() {
    if (this.isEmpty()) return false;
    this.size--;
    return true;
  }

  getFront() { return this.isEmpty() ? -1 : this.buffer[this.front]; }
  getRear() {
    return this.isEmpty() ? -1 : this.buffer[(this.front + this.size - 1) % this.capacity];
  }
  isEmpty() { return this.size === 0; }
  isFull() { return this.size === this.capacity; }
}

const dq = new MyCircularDeque(3);
console.log(dq.insertLast(1), dq.insertLast(2), dq.insertFront(3), dq.insertFront(4)); // true true true false
console.log(dq.getRear(), dq.isFull(), dq.deleteLast(), dq.insertFront(4), dq.getFront()); // 2 true true true 4
