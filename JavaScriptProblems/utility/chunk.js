/**
 * ============================================================================
 * PROBLEM: Implement lodash `_.chunk`
 * ============================================================================
 * Split an array into groups of `size`. The last chunk may be smaller if
 * the array can't be divided evenly.
 *
 * Example:
 * chunk([1,2,3,4,5], 2) -> [[1,2],[3,4],[5]]
 *
 * ============================================================================
 * INTUITION
 * ============================================================================
 * Walk the array in steps of `size`, slicing out one chunk per step.
 * `Array.prototype.slice` already clamps to the array bounds, so the final
 * (possibly shorter) chunk falls out naturally — no special-casing needed.
 */
function chunk(array, size = 1) {
  if (size < 1) return [];

  const result = [];
  for (let i = 0; i < array.length; i += size) {
    result.push(array.slice(i, i + size));
  }
  return result;
}

// ============================================================================
// TEST CASES
// ============================================================================
console.log(chunk([1, 2, 3, 4, 5], 2)); // [[1,2],[3,4],[5]]
console.log(chunk([1, 2, 3, 4, 5, 6], 3)); // [[1,2,3],[4,5,6]]
console.log(chunk([1, 2, 3], 1)); // [[1],[2],[3]]
console.log(chunk([], 2)); // []
console.log(chunk([1, 2, 3], 0)); // []

module.exports = { chunk };
