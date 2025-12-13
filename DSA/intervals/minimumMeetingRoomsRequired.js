/**
 * @param {number[][]} intervals
 * @return {number}
 */
var minMeetingRooms = function (intervals) {
  if (intervals.length === 0) return 0;

  // 1. Separate and Sort
  const starts = intervals.map((i) => i[0]).sort((a, b) => a - b);
  const ends = intervals.map((i) => i[1]).sort((a, b) => a - b); // Fixed .maps() to .map()

  let rooms = 0;
  let endPtr = 0;

  // 2. Loop from i = 0 (Check EVERY meeting)
  for (let i = 0; i < starts.length; i++) {
    // 3. Collision Logic
    if (starts[i] < ends[endPtr]) {
      // A meeting started before the earliest one ended.
      // We need a NEW room.
      rooms++;
    } else {
      // A meeting ended. We reuse that room.
      // We do NOT increment rooms.
      // We shift endPtr to the next available slot.
      endPtr++;
    }
  }

  return rooms;
};
