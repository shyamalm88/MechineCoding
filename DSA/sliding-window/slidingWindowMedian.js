/**
 * ============================================================================
 * PROBLEM: Sliding Window Median
 * CATEGORY: 🔴 VVIMP Sliding Window + Heaps
 * ============================================================================
 */

function slidingWindowMedian(nums, k) {
  const low = new MaxHeap(); // smaller half
  const high = new MinHeap(); // larger half
  const delayed = new Map();

  let lowSize = 0;
  let highSize = 0;

  function prune(heap) {
    while (heap.size() > 0) {
      const top = heap.peek();
      if (delayed.has(top)) {
        delayed.set(top, delayed.get(top) - 1);
        if (delayed.get(top) === 0) delayed.delete(top);
        heap.pop();
      } else {
        break;
      }
    }
  }

  function balance() {
    if (lowSize > highSize + 1) {
      high.push(low.pop());
      lowSize--;
      highSize++;
      prune(low);
    } else if (lowSize < highSize) {
      low.push(high.pop());
      highSize--;
      lowSize++;
      prune(high);
    }
  }

  function add(num) {
    if (low.size() === 0 || num <= low.peek()) {
      low.push(num);
      lowSize++;
    } else {
      high.push(num);
      highSize++;
    }
    balance();
  }

  function remove(num) {
    delayed.set(num, (delayed.get(num) || 0) + 1);

    if (num <= low.peek()) {
      lowSize--;
      if (num === low.peek()) prune(low);
    } else {
      highSize--;
      if (num === high.peek()) prune(high);
    }
    balance();
  }

  const result = [];

  for (let i = 0; i < nums.length; i++) {
    add(nums[i]);

    if (i >= k) {
      remove(nums[i - k]);
    }

    if (i >= k - 1) {
      if (k % 2 === 1) {
        result.push(low.peek());
      } else {
        result.push((low.peek() + high.peek()) / 2);
      }
    }
  }

  return result;
}
