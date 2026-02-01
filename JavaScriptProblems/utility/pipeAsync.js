const pipeAsync = (...funcs) => {
  return (initialValue) =>
    funcs.reduce(
      (promise, fn) => promise.then(fn),
      Promise.resolve(initialValue)
    );
};