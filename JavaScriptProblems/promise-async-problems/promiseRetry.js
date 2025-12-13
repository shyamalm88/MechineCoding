const promiseRetry = function (fn, retries = 3, delay = 100) {
  return new Promise((resolve, reject) => {
    const attempt = (currentAttempt) => {
      Promise.resolve(fn())
        .then(resolve)
        .catch((err) => {
          if (currentAttempt >= retries) {
            reject(err);
            return;
          }
          setTimeout(() => {
            attempt(currentAttempt + 1);
          }, delay);
        });
    };
    attempt(1);
  });
};
