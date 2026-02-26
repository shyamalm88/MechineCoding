/**
 * lastSettled
 *
 * Returns a promise that resolves with the result
 * of the promise that settles LAST (fulfilled or rejected).
 */
function lastSettled(promises) {
  return new Promise((resolve) => {
    let settledCount = 0;
    let lastResult;

    promises.forEach((p) => {
      Promise.resolve(p)
        .then(
          (value) => {
            lastResult = { status: "fulfilled", value };
          },
          (reason) => {
            lastResult = { status: "rejected", reason };
          },
        )
        .finally(() => {
          settledCount++;
          if (settledCount === promises.length) {
            resolve(lastResult);
          }
        });
    });
  });
}

const p1 = new Promise((res) => setTimeout(() => res("A"), 300));
const p2 = new Promise((_, rej) => setTimeout(() => rej("B"), 900));
const p3 = new Promise((res) => setTimeout(() => res("C"), 500));

lastSettled([p1, p2, p3]).then(console.log);
