/**
 * ============================================================================
 * PROBLEM: Asteroid Collision (LeetCode #735)
 * ============================================================================
 * We are given an array asteroids of integers representing asteroids in a row.
 * For each asteroid, the absolute value represents its size, and the sign
 * represents its direction (positive meaning right, negative meaning left).
 *
 * Each asteroid moves at the same speed. Find out the state of the asteroids
 * after all collisions. If two asteroids meet, the smaller one will explode.
 * If both are the same size, both will explode. Two asteroids moving in the
 * same direction will never meet.
 *
 * Example 1:
 * Input: asteroids = [5,10,-5]
 * Output: [5,10]
 * Explanation: The 10 and -5 collide resulting in 10. The 5 and 10 never collide.
 *
 * Example 2:
 * Input: asteroids = [8,-8]
 * Output: []
 * Explanation: The 8 and -8 collide exploding each other.
 *
 * Example 3:
 * Input: asteroids = [10,2,-5]
 * Output: [10]
 * Explanation: The 2 and -5 collide resulting in -5. The 10 and -5 collide resulting in 10.
 */

// ============================================================================
// APPROACH: Stack
// ============================================================================
/**
 * INTUITION:
 * Iterate through the asteroids. Use a stack to keep track of stable asteroids.
 * - If an asteroid is moving Right (> 0), push it (it won't collide with previous ones).
 * - If an asteroid is moving Left (< 0), it collides with Right-moving asteroids
 *   at the top of the stack.
 *   - If Top < |Current|, Top explodes (pop). Check next.
 *   - If Top == |Current|, Both explode (pop, stop).
 *   - If Top > |Current|, Current explodes (stop).
 *
 * Time Complexity: O(N)
 * Space Complexity: O(N)
 */
const astroidCollision = (asteroids) => {
  const stack = [];
  for (let asteroid of asteroids) {
    // While collision is possible: stack has Right-moving asteroid and current is Left-moving
    while (stack.length && asteroid < 0 && stack[stack.length - 1] > 0) {
      const diff = asteroid + stack[stack.length - 1];
      if (diff < 0) {
        // Top is smaller, top explodes
        stack.pop();
      } else if (diff > 0) {
        // Top is larger, current explodes
        asteroid = 0;
      } else {
        // Both equal, both explode
        asteroid = 0;
        stack.pop();
      }
    }
    if (asteroid) {
      stack.push(asteroid);
    }
  }
  return stack;
};

// ============================================================================
// TEST CASES
// ============================================================================
console.log("=== Asteroid Collision Tests ===\n");
console.log("Test 1:", astroidCollision([5, 10, -5])); // Expected: [5, 10]
console.log("Test 2:", astroidCollision([8, -8])); // Expected: []
console.log("Test 3:", astroidCollision([10, 2, -5])); // Expected: [10]

module.exports = { astroidCollision };
