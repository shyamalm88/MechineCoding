// ============================================================================
// APPROACH: Greedy (One Pass)
// ============================================================================
/**
 * INTUITION:
 * 1. Global Check: If total gas < total cost, it's impossible to complete the
 *    circuit. We can check this by summing differences.
 * 2. Local Check: If we start at A and run out of gas before reaching B, then
 *    no station between A and B can be a starting point. Why? Because A gave
 *    us some positive gas to start with. If we failed starting with that boost,
 *    starting at an intermediate station with 0 gas will fail even faster.
 *    So, we greedily jump our start point to B (current index + 1).
 *
 * DRY RUN:
 * Input: gas = [1, 2, 3, 4, 5], cost = [3, 4, 5, 1, 2]
 *
 * 1. Initialize: totalGas = 0, currentGas = 0, start = 0
 *
 * 2. i=0: net = 1 - 3 = -2.
 *    - totalGas = -2. currentGas = -2.
 *    - currentGas < 0? Yes.
 *    - Reset: start = 1, currentGas = 0.
 *
 * 3. i=1: net = 2 - 4 = -2.
 *    - totalGas = -4. currentGas = -2.
 *    - currentGas < 0? Yes.
 *    - Reset: start = 2, currentGas = 0.
 *
 * 4. i=2: net = 3 - 5 = -2.
 *    - totalGas = -6. currentGas = -2.
 *    - currentGas < 0? Yes.
 *    - Reset: start = 3, currentGas = 0.
 *
 * 5. i=3: net = 4 - 1 = 3.
 *    - totalGas = -3. currentGas = 3.
 *    - currentGas < 0? No.
 *
 * 6. i=4: net = 5 - 2 = 3.
 *    - totalGas = 0. currentGas = 6.
 *    - currentGas < 0? No.
 *
 * 7. End Loop. totalGas (0) >= 0? Yes. Return start (3).
 *
 * Time Complexity: O(N) - Single pass through the arrays.
 * Space Complexity: O(1) - Constant extra space.
 *
 * @param {number[]} gas
 * @param {number[]} cost
 * @return {number}
 */
const gasStationProblem = (gas, cost) => {
  const n = gas.length;

  let currentPosition = 0; // 🚩 The potential starting station
  let totalGas = 0; // 🌍 Tracks Global feasibility (Total Supply vs Total Demand)
  let currentGas = 0; // 🚗 Tracks Local feasibility (Tank level for current trip)

  for (let i = 0; i < n; i++) {
    // Calculate net fuel gain/loss at this specific station
    const netGas = gas[i] - cost[i];

    totalGas += netGas;
    currentGas += netGas;

    // 🛑 CRASH CHECK:
    // If the tank drops below zero, it means the path starting
    // from 'currentPosition' is impossible.
    if (currentGas < 0) {
      // 🧠 THE GREEDY LEAP:
      // We don't try i-1 or i-2. We skip straight to i + 1.
      // Why? Because the previous stations gave us positive gas
      // and we STILL failed. Starting there with 0 gas would fail faster.
      currentPosition = i + 1;

      // Reset the local tank to 0 for the new attempt
      currentGas = 0;
    }
  }

  // 🏁 FINAL REALITY CHECK:
  // If the total gas in the world is less than the total cost,
  // it is impossible to complete the circle, no matter where you start.
  return totalGas >= 0 ? currentPosition : -1;
};

// ============================================================================
// TEST CASES
// ============================================================================
console.log("=== Gas Station Tests ===\n");

console.log("Test 1:", gasStationProblem([1, 2, 3, 4, 5], [3, 4, 5, 1, 2])); // Expected: 3

console.log("Test 2:", gasStationProblem([2, 3, 4], [3, 4, 3])); // Expected: -1

module.exports = { gasStationProblem };
