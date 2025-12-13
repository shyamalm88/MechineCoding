/**
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
