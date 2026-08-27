function findItinerary(tickets) {
  // -------------------------------
  // Build graph with min-heaps
  // -------------------------------
  const graph = new Map();

  for (const [from, to] of tickets) {
    if (!graph.has(from)) graph.set(from, []);
    graph.get(from).push(to);
  }

  // Sort destinations lexicographically (reverse for efficient pop)
  for (const dests of graph.values()) {
    dests.sort().reverse();
  }

  const itinerary = [];

  // -------------------------------
  // Hierholzer DFS
  // -------------------------------
  function dfs(airport) {
    const dests = graph.get(airport) || [];

    while (dests.length > 0) {
      const next = dests.pop(); // smallest lex
      dfs(next);
    }

    // Post-order insertion
    itinerary.push(airport);
  }

  dfs("JFK");

  // Reverse because we built itinerary backwards
  return itinerary.reverse();
}
