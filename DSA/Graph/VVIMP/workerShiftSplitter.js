/**
 * Problem: Worker Shift Intervals (Sweep Line)
 * Time Complexity: O(N log N) due to sorting
 * Space Complexity: O(N) to store events and active set
 */
function generateSchedule(shifts) {
  const events = [];

  // 1. Transform shifts into discrete events
  // Using type 1 for START and -1 for END
  for (const [name, start, end] of shifts) {
    events.push({ time: start, type: 1, name });
    events.push({ time: end, type: -1, name });
  }

  // 2. Sort events by time
  // If times are equal, process ENDS (-1) before STARTS (1)
  // to prevent zero-length intervals [70, 70, [...]]
  events.sort((a, b) => a.time - b.time || a.type - b.type);

  const result = [];
  const activeWorkers = new Set();
  let lastTime = events[0].time;

  for (const event of events) {
    const currentTime = event.time;

    // 3. If time has progressed and we have workers, record the interval
    if (currentTime > lastTime && activeWorkers.size > 0) {
      result.push([
        lastTime,
        currentTime,
        Array.from(activeWorkers).sort(), // Sorted names for consistent output
      ]);
    }

    // 4. Update the active set
    if (event.type === 1) {
      activeWorkers.add(event.name);
    } else {
      activeWorkers.delete(event.name);
    }

    lastTime = currentTime;
  }

  return result;
}

// Example Execution
const input = [
  ["Abby", 10, 100],
  ["Ben", 50, 70],
  ["Carla", 60, 70],
  ["David", 120, 300],
];
console.log(JSON.stringify(generateSchedule(input)));
