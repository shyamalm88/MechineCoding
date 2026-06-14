/**
 * ============================================================================
 * PROBLEM: Implement lodash `_.groupBy` (and the modern `Object.groupBy`)
 * ============================================================================
 * Group the elements of an array into an object keyed by the result of
 * calling `iteratee` on each element.
 *
 * Example:
 * groupBy([6.1, 4.2, 6.3], Math.floor) -> { '4': [4.2], '6': [6.1, 6.3] }
 * groupBy(['one', 'two', 'three'], 'length') -> { '3': ['one','two'], '5': ['three'] }
 *
 * ============================================================================
 * INTUITION
 * ============================================================================
 * `iteratee` can be a function OR a property-name string (lodash supports
 * both shorthand forms). For each item, compute its key, then push the item
 * into `result[key]`, creating the bucket array on first use.
 *
 * Note: ES2024 added a native `Object.groupBy(items, callbackFn)` that does
 * exactly this (with a null-prototype object) — this polyfill mirrors that
 * behavior for environments/interviews that need it implemented by hand.
 */
function groupBy(array, iteratee) {
  const getKey =
    typeof iteratee === "function" ? iteratee : (item) => item[iteratee];

  const result = {};
  for (const item of array) {
    const key = getKey(item);
    if (!result[key]) result[key] = [];
    result[key].push(item);
  }
  return result;
}

// ============================================================================
// TEST CASES
// ============================================================================
console.log(groupBy([6.1, 4.2, 6.3], Math.floor));
// { '4': [4.2], '6': [6.1, 6.3] }

console.log(groupBy(["one", "two", "three"], "length"));
// { '3': ['one','two'], '5': ['three'] }

console.log(groupBy([], Math.floor)); // {}

module.exports = { groupBy };
