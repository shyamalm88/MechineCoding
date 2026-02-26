/**
 * firstSuccess
 *
 * Resolves with the FIRST fulfilled promise.
 * Rejects only if ALL promises reject.
 */
function firstSuccess(promises) {
  return new Promise((resolve, reject) => {
    let rejectCount = 0;
    const errors = [];

    promises.forEach((p, index) => {
      Promise.resolve(p).then(
        (value) => {
          // First success wins immediately
          resolve(value);
        },
        (error) => {
          errors[index] = error;
          rejectCount++;

          // If all promises have rejected
          if (rejectCount === promises.length) {
            reject(errors);
          }
        },
      );
    });
  });
}

const p1 = new Promise((_, rej) => setTimeout(() => rej("A"), 100));
const p2 = new Promise((res) => setTimeout(() => res("B"), 300));
const p3 = new Promise((res) => setTimeout(() => res("C"), 200));

firstSuccess([p1, p2, p3]).then(console.log).catch(console.error);
