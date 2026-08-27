const nextGreaterElement = (nums1, nums2) => {
  const nextGreater = new Map();
  const stack = []; // decreasing

  for (const num of nums2) {
    while (stack.length && stack[stack.length - 1] < num) {
      nextGreater.set(stack.pop(), num);
    }
    stack.push(num);
  }
  // anything still stacked has nothing greater to its right
  for (const leftover of stack) nextGreater.set(leftover, -1);

  return nums1.map((n) => nextGreater.get(n) ?? -1);
};

console.log(nextGreaterElement([4, 1, 2], [1, 3, 4, 2])); // [-1,3,-1]
console.log(nextGreaterElement([2, 4], [1, 2, 3, 4])); // [3,-1]
