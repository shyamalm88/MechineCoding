// ---- promise.all.polyfill.js ----
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

// ---- promise.allSettled.js ----
Promise.myPromiseAllSettled = function (promises) {
  return new Promise((resolve, reject) => {
    if (promises.length === 0) {
      resolve([]);
      return;
    }
    let counter = 0;
    const resolveWhenDone = () => {
      counter++;
      if (counter === promises.length) {
        resolve(result);
      }
    };
    let result = new Array(promises.length);
    promises.forEach((p, i) => {
      Promise.resolve(p)
        .then((val) => {
          result[i] = { status: "fulfilled", value: val };
          resolveWhenDone();
        })
        .catch((err) => {
          result[i] = { status: "rejected", reason: err };
          resolveWhenDone();
        });
    });
  });
};

// ---- promise.any.js ----
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

// ---- promise.race.js ----
Promise.myRace = function (promises) {
  return new Promise((resolve, reject) => {
    promises.forEach((p) => {
      Promise.resolve(p).then(resolve, reject);
    });
  });
};

export { myPromiseAll }
