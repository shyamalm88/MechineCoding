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
