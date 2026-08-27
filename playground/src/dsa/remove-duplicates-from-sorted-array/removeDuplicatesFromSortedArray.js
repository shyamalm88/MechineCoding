const removeDuplicates = (nums) => {
  if (nums.length === 0) return 0;
  let slow = 0;
  for (let fast = 1; fast < nums.length; fast++) {
    if (nums[fast] !== nums[slow]) {
      slow++;
      nums[slow] = nums[fast];
    }
  }
  return slow + 1; // length, not index
};

const a = [0, 0, 1, 1, 1, 2, 2, 3, 3, 4];
console.log(removeDuplicates(a), a.slice(0, 5)); // 5 [0,1,2,3,4]
console.log(removeDuplicates([1, 1, 2])); // 2
console.log(removeDuplicates([])); // 0
