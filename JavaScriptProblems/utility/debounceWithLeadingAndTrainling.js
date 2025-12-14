const debounceLeadingTrailing = function (
  fn,
  delay,
  { leading = false, trailing = false } = {}
) {
  let context;
  let lastArgs;
  let timer;

  return function debounced(...args) {
    context = this;
    lastArgs = args;

    let callNow = !timer && leading;

    if (timer) clearTimeout(timer);

    timer = setTimeout(() => {
      if (trailing && !callNow) {
        fn.apply(context, lastArgs);
      }
      timer = null;
    }, delay);

    if (callNow) {
      fn.apply(context, lastArgs);
    }
  };
};
