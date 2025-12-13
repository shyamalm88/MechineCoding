function debounceAdvanced(fn, delay) {
  let timerId;
  let lastArgs;
  let lastThis;

  const debounced = function (...args) {
    lastArgs = args;
    lastThis = this;

    if (timerId) clearTimeout(timerId);

    timerId = setTimeout(() => {
      fn.apply(lastThis, lastArgs);
      timerId = null;
    }, delay);
  };

  // CANCEL: Stop the timer, don't run.
  debounced.cancel = () => {
    if (timerId) {
      clearTimeout(timerId);
      timerId = null;
    }
  };

  // FLUSH: Run immediately if a timer is pending.
  debounced.flush = () => {
    if (timerId) {
      fn.apply(lastThis, lastArgs);
      debounced.cancel(); // Clear the timer since we just ran it
    }
  };

  return debounced;
}
