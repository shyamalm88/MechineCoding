function throttle(fn, delay) {
  let lastRun = 0;
  let timer = null;

  return function (...args) {
    const now = Date.now();

    if (now - lastRun >= delay) {
      fn.apply(this, args);
      lastRun = now;
    } else if (!timer) {
      timer = setTimeout(() => {
        fn.apply(this, args);
        lastRun = Date.now();
        timer = null;
      }, delay - (now - lastRun));
    }
  };
}