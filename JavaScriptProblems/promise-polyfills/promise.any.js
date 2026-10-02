Promise.any = function (promises) {
  return new Promise((resolve, reject) => {
    if (promises.length === 0) {
      reject(new AggregateError([], "All promises were rejected"));
      return;
    }
    let errors = new Array(promises.length);
    let counter = 0;
    promises.forEach((p, i) => {
      Promise.resolve(p)
        .then((val) => {
          resolve(val);
        })
        .catch((err) => {
          errors[i] = err;
          counter++;
          if (counter === promises.length) {
            reject(new AggregateError(errors, "All promises were rejected"));
          }
        });
    });
  });
};
