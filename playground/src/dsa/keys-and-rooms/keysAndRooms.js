const canVisitAllRooms = (rooms) => {
  const visited = new Set([0]);
  const stack = [0];

  while (stack.length) {
    for (const key of rooms[stack.pop()]) {
      if (!visited.has(key)) { visited.add(key); stack.push(key); }
    }
  }
  return visited.size === rooms.length;
};

console.log(canVisitAllRooms([[1], [2], [3], []])); // true
console.log(canVisitAllRooms([[1, 3], [3, 0, 1], [2], [0]])); // false -- room 2 unreachable
