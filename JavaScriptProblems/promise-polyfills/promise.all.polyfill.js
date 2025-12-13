const myPromiseAll = function (promises) {
  return new Promise((resolve, reject) => {
    if (promises.length === 0) {
      resolve([]);
      return;
    }
    let result = new Array(promises.length);
    let counter = 0;
    promises.forEach((p, i) => {
      Promise.resolve(p)
        .then((val) => {
          result[i] = val;
          counter++;
          if (counter === promises.length) {
            resolve(result);
          }
        })
        .catch((err) => {
          reject(err);
        });
    });
  });
};
