const containerWithMostWater = (height) => {
  let left = 0;
  let right = height.length - 1;
  let max = 0;

  while (left < right) {
    // 1. Calculate Area
    // Width = right - left
    // Height = min(height[left], height[right])
    let width = right - left;
    let h = Math.min(height[left], height[right]);
    let area = h * width;

    // 2. Update max
    max = Math.max(area, max);

    // 3. Move the shorter wall inward
    // if height[left] < height[right] -> left++
    // else -> right--
    h[left] < h[right] ? left++ : right--;
  }
  return max;
};
