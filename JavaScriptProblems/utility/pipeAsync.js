const pipeAsync =
  (...funcs) =>
  (initialValue) => {
    return funcs.reduce(async (prevPromise, currentFunc) => {
      const resolvedValue = await prevPromise;
      return currentFunc(resolvedValue);
    }, Promise.resolve(initialValue));
  };
