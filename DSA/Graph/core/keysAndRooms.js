/**
 * PROBLEM: Keys and Rooms (LeetCode #841)
 *
 * Room 0 is unlocked; each room holds keys to others. Can you visit them all?
 *
 * INTUITION:
 * Rooms are nodes, keys are directed edges. "Can all rooms be visited?" is
 * exactly "is every node reachable from node 0?" — one traversal from 0, then
 * compare the visited count to n.
 *
 * DFS or BFS both work; nothing here favours either, since we only care about
 * reachability, not distance.
 *
 * TIME: O(V + E)   SPACE: O(V)
 */
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
