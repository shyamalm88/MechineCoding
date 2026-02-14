/**
 * Generic Priority Queue / Binary Heap implementation.
 * For Min Heap: (a, b) => a < b
 * For Max Heap: (a, b) => a > b
 */
class PriorityQueue {
  constructor(compare = (a, b) => a < b) {
    this.heap = [];
    this.compare = compare; // return true if a has higher priority than b
  }

  size() {
    return this.heap.length;
  }

  peek() {
    // Return the root element without removing it
    return this.heap[0] ?? null;
  }

  push(x) {
    // Add new element to the end of the array
    this.heap.push(x);
    // Restore heap property by bubbling up from the last position
    this._bubbleUp(this.heap.length - 1);
  }

  pop() {
    if (this.heap.length === 0) return null;

    const top = this.heap[0]; // Store the root (highest priority)
    const last = this.heap.pop(); // Remove the last element

    if (this.heap.length > 0) {
      this.heap[0] = last; // Move the last element to the root
      this._bubbleDown(0); // Restore heap property by bubbling down
    }
    return top;
  }

  _bubbleUp(i) {
    while (i > 0) {
      const p = Math.floor((i - 1) / 2); // Parent index
      // If current element does not have higher priority than parent, stop
      if (!this.compare(this.heap[i], this.heap[p])) break;
      // Swap with parent
      [this.heap[i], this.heap[p]] = [this.heap[p], this.heap[i]];
      i = p; // Move up to parent's index
    }
  }

  _bubbleDown(i) {
    const n = this.heap.length;
    while (true) {
      let best = i; // Assume current is the highest priority among itself and children
      const l = 2 * i + 1; // Left child index
      const r = 2 * i + 2; // Right child index

      // Compare with left child
      if (l < n && this.compare(this.heap[l], this.heap[best])) best = l;
      // Compare with right child
      if (r < n && this.compare(this.heap[r], this.heap[best])) best = r;

      if (best === i) break; // Heap property satisfied
      // Swap with the higher priority child
      [this.heap[i], this.heap[best]] = [this.heap[best], this.heap[i]];
      i = best; // Continue bubbling down
    }
  }
}
