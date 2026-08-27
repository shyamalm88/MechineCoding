const nextGreaterElements = (nums) => {
  const n = nums.length;
  const result = new Array(n).fill(-1);
  const stack = []; // indices, values decreasing

  for (let i = 0; i < 2 * n; i++) {
    const value = nums[i % n];
    while (stack.length && nums[stack[stack.length - 1]] < value) {
      result[stack.pop()] = value;
    }
    if (i < n) stack.push(i); // only seed real indices
  }
  return result;
};

console.log(nextGreaterElements([1, 2, 1])); // [2,-1,2]
console.log(nextGreaterElements([1, 2, 3, 4, 3])); // [2,3,4,-1,4]
console.log(nextGreaterElements([5, 5, 5])); // [-1,-1,-1] duplicates
