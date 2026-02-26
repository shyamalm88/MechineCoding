function customSetTimeout(callback, delay) {
  let start = null;
  let rafId;

  function loop(timestamp) {
    if (start === null) start = timestamp;

    const elapsed = timestamp - start;

    if (elapsed >= delay) {
      callback();
      return; // 🔴 stop scheduling
    }

    rafId = requestAnimationFrame(loop);
  }

  rafId = requestAnimationFrame(loop);

  return function clear() {
    cancelAnimationFrame(rafId);
  };
}
