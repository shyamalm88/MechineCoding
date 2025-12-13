const nonOverlappingIntervals = (intervals) => {
  if (intervals.length === 0) return 0;
  let count = 0;
  let sorted = [...intervals].sort((a, b) => a[1] - b[1]);
  let prevEnd = sorted[0][1];

  for (let i = 1; i < sorted.length; i++) {
    let [start, end] = sorted[i];
    if (start < prevEnd) {
      count++;
    } else {
      prevEnd = end;
    }
  }
  return count;
};
