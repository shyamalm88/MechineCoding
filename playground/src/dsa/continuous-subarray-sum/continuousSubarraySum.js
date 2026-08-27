const checkSubarraySum = (nums, k) => {
  const firstIndex = new Map([[0, -1]]);
  let sum = 0;

  for (let i = 0; i < nums.length; i++) {
    sum += nums[i];
    const rem = ((sum % k) + k) % k; // normalise negatives
    if (firstIndex.has(rem)) {
      if (i - firstIndex.get(rem) >= 2) return true;
    } else {
      firstIndex.set(rem, i); // keep the EARLIEST index only
    }
  }
  return false;
};

console.log(checkSubarraySum([23, 2, 4, 6, 7], 6)); // true  [2,4]
console.log(checkSubarraySum([23, 2, 6, 4, 7], 13)); // false
console.log(checkSubarraySum([1, 0], 2)); // false -- sum 1 is not a multiple of 2
