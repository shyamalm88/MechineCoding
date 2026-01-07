const numBusesToDestination = (routes, source, target) => {
  if (source === target) return 0;

  // stop -> routes mapping
  const stopToRoutes = new Map();
  for (let i = 0; i < routes.length; i++) {
    for (let stop of routes[i]) {
      if (!stopToRoutes.has(stop)) {
        stopToRoutes.set(stop, []);
      }
      stopToRoutes.get(stop).push(i);
    }
  }

  const visitedRoutes = new Set();
  const visitedStops = new Set();
  const q = [];

  // start with routes that contain source
  for (let route of stopToRoutes.get(source) || []) {
    q.push(route);
    visitedRoutes.add(route);
  }

  let buses = 1;

  while (q.length) {
    const size = q.length;

    for (let i = 0; i < size; i++) {
      const route = q.shift();

      for (let stop of routes[route]) {
        if (stop === target) return buses;

        if (visitedStops.has(stop)) continue;
        visitedStops.add(stop);

        for (let nextRoute of stopToRoutes.get(stop)) {
          if (!visitedRoutes.has(nextRoute)) {
            visitedRoutes.add(nextRoute);
            q.push(nextRoute);
          }
        }
      }
    }
    buses++;
  }

  return -1;
};