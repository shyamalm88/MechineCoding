// ============================================================================
// APPROACH: Sort by position (desc) + Monotonic Stack of arrival times
// ============================================================================
/**
 * STORY / INTUITION:
 * Sort cars by starting position in DESCENDING order (closest to target first).
 * For each car, compute time to reach target = (target - position) / speed.
 *
 * A car behind can only SLOW DOWN to match the car ahead — it CANNOT speed up.
 * So if a car's arrival time <= the car ahead's time, it catches up and joins
 * that fleet (we ignore it — it's absorbed).
 *
 * The stack tracks fleet leaders' arrival times (monotonically increasing from
 * closest to farthest). Each push = new fleet. If current time <= stack top,
 * this car merges into the leading fleet (no push).
 *
 * DRY RUN (target=12, sorted by pos: [(10,2),(8,4),(5,1),(3,3),(0,1)]):
 * times: [1.0, 1.0, 3.5, 3.0, 12.0]
 *
 * t=1.0:  stack=[] → push 1.0  → [1.0]       (car at 10, fleet 1)
 * t=1.0:  1.0 <= 1.0 → merge   → [1.0]       (car at 8 joins fleet 1)
 * t=3.5:  3.5 > 1.0  → push    → [1.0, 3.5]  (car at 5, fleet 2)
 * t=3.0:  3.0 <= 3.5 → merge   → [1.0, 3.5]  (car at 3 joins fleet 2)
 * t=12.0: 12.0 > 3.5 → push    → [1.0,3.5,12](car at 0, fleet 3)
 * Result: stack.length = 3 ✓
 *
 * Time:  O(N log N) for sort
 * Space: O(N) for stack
 */
const carFleet = (target, position, speed) => {
  const n = position.length;

  // Pair [position, time_to_target], sort closest to target first
  const cars = position
    .map((pos, i) => [pos, (target - pos) / speed[i]])
    .sort((a, b) => b[0] - a[0]); // descending by position

  const stack = []; // stores arrival times of fleet leaders

  for (const [, time] of cars) {
    // If this car arrives AFTER the fleet ahead, it's a new fleet
    if (stack.length === 0 || time > stack[stack.length - 1]) {
      stack.push(time);
    }
    // else: this car catches up — merges into the fleet ahead (no push)
  }

  return stack.length;
};

// ============================================================================
// TEST CASES
// ============================================================================
console.log("=== Car Fleet Tests ===\n");

console.log("Test 1:", carFleet(12, [10, 8, 0, 5, 3], [2, 4, 1, 1, 3])); // Expected: 3
console.log("Test 2:", carFleet(10, [3], [3]));                           // Expected: 1
console.log("Test 3:", carFleet(100, [0, 2, 4], [4, 2, 1]));             // Expected: 1

module.exports = { carFleet };
