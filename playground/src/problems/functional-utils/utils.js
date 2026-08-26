/** Left-to-right composition: pipe(a, b)(x) === b(a(x)) */
export const pipe = (...fns) => (input) => fns.reduce((acc, fn) => fn(acc), input)

/** Right-to-left composition: compose(a, b)(x) === a(b(x)) */
export const compose = (...fns) => (input) => fns.reduceRight((acc, fn) => fn(acc), input)

/** Lodash-style groupBy: iteratee may be a function or a property name. */
export function groupBy(collection, iteratee) {
  const fn = typeof iteratee === 'function' ? iteratee : (item) => item[iteratee]
  return collection.reduce((acc, item) => {
    const key = fn(item)
    ;(acc[key] ??= []).push(item)
    return acc
  }, {})
}

/** Balanced brackets check. */
export function isBalanced(str) {
  const pairs = { ')': '(', ']': '[', '}': '{' }
  const stack = []
  for (const char of str) {
    if (char === '(' || char === '[' || char === '{') stack.push(char)
    else if (char in pairs) {
      // Must match the MOST RECENT opener -- that's why a stack, not a counter.
      if (stack.pop() !== pairs[char]) return false
    }
  }
  return stack.length === 0 // leftovers mean unclosed brackets
}

/** QuickSort with a comparator, out of place for clarity. */
export function quickSort(arr, compare = (a, b) => a - b) {
  if (arr.length <= 1) return arr
  const [pivot, ...rest] = arr
  const left = rest.filter((x) => compare(x, pivot) < 0)
  const right = rest.filter((x) => compare(x, pivot) >= 0)
  return [...quickSort(left, compare), pivot, ...quickSort(right, compare)]
}
