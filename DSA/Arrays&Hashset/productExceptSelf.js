const productExceptSelf = (nums) => {
  const n = nums.length;
  let result = new Array(n);

  // 1. Pass 1: Left Products
  let leftProduct = 1;
  for (let i = 0; i < n; i++) {
    result[i] = leftProduct;
    leftProduct *= nums[i];
  }

  // 2. Pass 2: Right Products (Backwards)
  let rightProduct = 1;
  for (let i = n - 1; i >= 0; i--) {
    result[i] *= rightProduct;
    rightProduct *= nums[i];
  }

  return result;
};
