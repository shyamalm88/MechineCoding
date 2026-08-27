/**
 * @param {string[]} deadends
 * @param {string} target
 * @return {number}
 */
const openLock = (deadends, target) => {
  const dead = new Set(deadends);

  // Edge case: If the starting position '0000' is a deadend, we cannot move at all.
  if (dead.has("0000")) return -1;

  const visited = new Set();
  const queue = ["0000"];
  visited.add("0000");

  let turns = 0;

  while (queue.length > 0) {
    let size = queue.length; // Process all states at the current depth (level)

    for (let i = 0; i < size; i++) {
      const currentCombo = queue.shift();
      if (currentCombo === target) return turns;

      // Generate all 8 possible next moves from the current state
      for (let nextCombo of getNextStates(currentCombo)) {
        // Only proceed if the state is not a deadend and hasn't been visited yet
        if (!dead.has(nextCombo) && !visited.has(nextCombo)) {
          visited.add(nextCombo); // Mark visited immediately to prevent duplicates in queue
          queue.push(nextCombo);
        }
      }
    }
    turns++; // Increment turn count after finishing the current level
  }
  return -1;
};

/**
 * Helper to generate all 8 possible next states
 * @param {string} s - current lock state
 * @return {string[]} - list of next states
 */
const getNextStates = (s) => {
  const res = [];

  for (let i = 0; i < 4; i++) {
    const digit = Number(s[i]);
    // Calculate next digit with wrap-around (0 -> 1, ..., 9 -> 0)
    const up = (digit + 1) % 10;
    // Calculate previous digit with wrap-around (0 -> 9, ..., 9 -> 8)
    const down = (digit + 9) % 10;

    // Create new state strings by replacing the digit at index i
    res.push(s.slice(0, i) + up + s.slice(i + 1));
    res.push(s.slice(0, i) + down + s.slice(i + 1));
  }
  return res;
};

// ============================================================================
// TEST CASES
// ============================================================================

// Test 1: Standard case
console.log(
  "Test 1:",
  openLock(["0201", "0101", "0102", "1212", "2002"], "0202")
);
// Expected: 6

// Test 2: Reverse move
console.log("Test 2:", openLock(["8888"], "0009"));
// Expected: 1

// Test 3: Impossible (trapped)
console.log(
  "Test 3:",
  openLock(
    ["8887", "8889", "8878", "8898", "8788", "8988", "7888", "9888"],
    "8888"
  )
);
// Expected: -1

// Test 4: Start is deadend
console.log("Test 4:", openLock(["0000"], "8888"));
// Expected: -1
