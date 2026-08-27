const timeRequiredToBuy = (tickets, k) =>
  tickets.reduce(
    (total, t, i) => total + Math.min(t, i <= k ? tickets[k] : tickets[k] - 1),
    0,
  );

console.log(timeRequiredToBuy([2, 3, 2], 2)); // 6
console.log(timeRequiredToBuy([5, 1, 1, 1], 0)); // 8
