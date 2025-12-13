function throttle(fn, delay) {
  let lastRun = 0;
  return function (...args) {
    const now = Date.now();
    if (now - lastRun >= delay) {
      fn.apply(this, args);
      lastRun = now;
    }
  };
}
