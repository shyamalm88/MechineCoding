/**
 * @param {number[]} nums
 * @param {number} k
 * @return {number}
 */
var subarraySum = function (nums, k) {
  // 📖 The Logbook: Stores { OdometerReading : HowManyTimesSeen }
  const map = new Map();

  // START: We start at mile 0 before driving anywhere.
  map.set(0, 1);

  let currentSum = 0; // 🚗 The Odometer
  let count = 0; // 🏆 How many valid segments found

  for (let num of nums) {
    // Drive! Add distance to odometer.
    currentSum += num;

    // 🤔 THE QUESTION:
    // "To have driven exactly 'k' miles ending right here,
    // I must have been at (currentSum - k) in the past.
    // Is that number in my logbook?"
    const neededHistory = currentSum - k;

    if (map.has(neededHistory)) {
      // Yes! I was there before.
      // The number of times I was there = number of valid segments ending here.
      count += map.get(neededHistory);
    }

    // 📝 WRITE IN LOGBOOK:
    // Record that we have reached this odometer reading.
    map.set(currentSum, (map.get(currentSum) || 0) + 1);
  }

  return count;
};
