const pipeAsync =
  (...funcs) =>
  (initialValue) => {
    funcs.reduce(async (prevPromise, currentFunc) => {
      const result = await prevPromise();
      return currentFunc(result);
    }, Promise.resolve(initialValue));
  };
