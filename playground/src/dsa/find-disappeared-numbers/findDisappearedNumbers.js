const findDisappearedNumbers = (nums) => {
  for (const n of nums) {
    const idx = Math.abs(n) - 1;
    if (nums[idx] > 0) nums[idx] = -nums[idx]; // mark as seen
  }
  const out = [];
  for (let i = 0; i < nums.length; i++) if (nums[i] > 0) out.push(i + 1);
  return out;
};

console.log(findDisappearedNumbers([4, 3, 2, 7, 8, 2, 3, 1])); // [5,6]
console.log(findDisappearedNumbers([1, 1])); // [2]
