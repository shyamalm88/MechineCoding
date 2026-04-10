// Throttle with leading + trailing options

function throttle(fn, delay, { leading = true, trailing = true } = {}) {
  let timer = null;
  let lastArgs = null;
  let lastRun = 0;

  return function (...args) {
    const now = Date.now();
    const remaining = delay - (now - lastRun);

    if (remaining <= 0 && leading) {
      fn.apply(this, args);
      lastRun = now;
    } else if (trailing) {
      lastArgs = args;
      clearTimeout(timer);
      timer = setTimeout(() => {
        fn.apply(this, lastArgs);
        lastRun = Date.now();
        lastArgs = null;
      }, remaining > 0 ? remaining : delay);
    }
  };
}

// Usage
const onScroll = throttle(() => console.log("scroll"), 300);
const onResize = throttle(() => console.log("resize"), 300, { leading: false }); // trailing only

// Key talking points:
// leading=true  → fires immediately on first call
// trailing=true → fires once more at end of window if called during cooldown
// both false    → useless, nothing fires
