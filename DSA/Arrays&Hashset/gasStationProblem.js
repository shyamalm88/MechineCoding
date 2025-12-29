/**
 * ============================================================================
 * PROBLEM: Gas Station (LeetCode #134)
 * ============================================================================
 * There are n gas stations along a circular route, where the amount of gas at
 * the ith station is gas[i].
 *
 * You have a car with an unlimited gas tank and it costs cost[i] of gas to
 * travel from the ith station to its next (i + 1)th station. You begin the
 * journey with an empty tank at one of the gas stations.
 *
 * Given two integer arrays gas and cost, return the starting gas station's
 * index if you can travel around the circuit once in the clockwise direction,
 * otherwise return -1. If there exists a solution, it is guaranteed to be
 * unique.
 *
 * Example 1:
 * Input: gas = [1,2,3,4,5], cost = [3,4,5,1,2]
 * Output: 3
 * Explanation: Start at station 3 (index 3) and fill up with 4 unit of gas.
 * Your tank = 0 + 4 = 4
 * Travel to station 4. Your tank = 4 - 1 + 5 = 8
 * ...
 *
 * Constraints:
 * - n == gas.length == cost.length
 * - 1 <= n <= 10^5
 */

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
