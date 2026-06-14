class RangeModule {
  constructor() {
    // Keeps intervals sorted and disjoint: [[start1, end1], [start2, end2]...]
    this.intervals = [];
  }

  /**
   * O(N) worst case, O(log N) to find position.
   * Merges all overlapping intervals.
   */
  addRange(left, right) {
    const next = [];
    let added = false;

    for (const [s, e] of this.intervals) {
      if (e < left) {
        next.push([s, e]);
      } else if (s > right) {
        if (!added) {
          next.push([left, right]);
          added = true;
        }
        next.push([s, e]);
      } else {
        // Overlap found: expand the current range
        left = Math.min(left, s);
        right = Math.max(right, e);
      }
    }

    if (!added) next.push([left, right]);
    this.intervals = next;
  }

  /**
   * O(log N) using Binary Search.
   * Finds if any existing interval completely covers [left, right).
   */
  queryRange(left, right) {
    let low = 0,
      high = this.intervals.length - 1;

    while (low <= high) {
      const mid = Math.floor((low + high) / 2);
      const [s, e] = this.intervals[mid];

      if (s <= left && right <= e) return true;
      if (s > left) high = mid - 1;
      else low = mid + 1;
    }
    return false;
  }

  /**
   * O(N) worst case.
   * May split one interval into two or delete multiple.
   */
  removeRange(left, right) {
    const next = [];

    for (const [s, e] of this.intervals) {
      if (e <= left || s >= right) {
        next.push([s, e]);
      } else {
        // Overlap exists: keep the parts outside [left, right)
        if (s < left) next.push([s, left]);
        if (e > right) next.push([right, e]);
      }
    }
    this.intervals = next;
  }
}
