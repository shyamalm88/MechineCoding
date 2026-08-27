/**
 * PROBLEM: Reverse String (LeetCode #344)
 *
 * Reverse an array of characters IN PLACE with O(1) extra memory.
 *
 * INTUITION:
 * The canonical converging two-pointer: swap the ends and walk inwards. The
 * loop stops when the pointers meet, so a middle element in an odd-length array
 * is correctly left alone.
 *
 * The in-place constraint is the whole point — `arr.reverse()` or building a
 * new array defeats the exercise.
 *
 * TIME: O(n)   SPACE: O(1)
 */
const reverseString = (s) => {
  let left = 0;
  let right = s.length - 1;
  while (left < right) {
    [s[left], s[right]] = [s[right], s[left]];
    left++;
    right--;
  }
  return s;
};

console.log(reverseString(['h', 'e', 'l', 'l', 'o'])); // [o,l,l,e,h]
console.log(reverseString(['a', 'b'])); // [b,a]
console.log(reverseString(['a'])); // [a]
