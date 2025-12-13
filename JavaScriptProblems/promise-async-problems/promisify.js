const promisify = (fn) => {
  return function (...args) {
    return new Promise((resolve, reject) => {
      fn.call(this, ...args, (err, result) => {
        err ? reject(err) : resolve(result);
      });
    });
  };
};
