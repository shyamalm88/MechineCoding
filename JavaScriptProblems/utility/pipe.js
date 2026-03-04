const pipe = (...funcs) => {
  if (funcs.length === 0) return (x) => x;
  if (funcs.length === 1) return funcs[0];

  return funcs.reduce(
    (prevFn, nextFn) =>
      (...args) =>
        nextFn(prevFn(...args)),
  );
};
