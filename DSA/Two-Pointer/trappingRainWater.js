const trappingRainWater = (height) => {
  let left = 0;
  let right = height.length - 1;

  let leftMax = 0;
  let rightMax = 0;

  let totalWater = 0;

  while (left < right) {
    // 🧠 LOGIC: Always process the side with the SMALLER wall.
    // Why? Because the water level is limited by the shorter side.
    // If height[left] < height[right], we know the bottleneck is on the left.
    // We don't care how huge the right side gets; we are bound by leftMax.
    if (height[left] < height[right]) {
      // Case 1: Is this a new tallest wall?
      // If yes, we can't trap water on top of it. We update the max.
      if (height[left] >= leftMax) {
        leftMax = height[left];
      }
      // Case 2: It's shorter than leftMax.
      // Since we are in the "if (left < right)" block, we know rightMax is >= leftMax.
      // So we can safely trap water here.
      else {
        totalWater += leftMax - height[left];
      }
      left++;
    } else {
      // Mirror logic for the Right side
      if (height[right] >= rightMax) {
        rightMax = height[right];
      } else {
        totalWater += rightMax - height[right];
      }
      right--;
    }
  }
  return totalWater;
};
