/**
 * @param {number[][]} isConnected
 * @return {number}
 */
const findCircleNum = (isConnected) => {
  let n = isConnected.length;
  let visited = new Array(n).fill(0);
  let provinces = 0;

  const dfs = (city) => {
    // Renamed 'cities' to 'city' for clarity
    for (let neighbor = 0; neighbor < n; neighbor++) {
      // FIX: Check if connected AND if the NEIGHBOR is unvisited
      if (isConnected[city][neighbor] === 1 && visited[neighbor] === 0) {
        visited[neighbor] = 1; // Mark neighbor as visited
        dfs(neighbor); // Recurse
      }
    }
  };

  for (let i = 0; i < n; i++) {
    if (visited[i] === 0) {
      provinces++;
      visited[i] = 1; // Mark the start node
      dfs(i);
    }
  }

  return provinces;
};
