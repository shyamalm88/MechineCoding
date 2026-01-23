// Dry run for composeAsync(add1, mul2, sub3) called with composed(5)
//
// Step 1:
// composeAsync(add1, mul2, sub3) returns an async function
//
// Step 2:
// composed(5) is called
// initialValue = 5
// result = 5
//
// Step 3: Loop over functions
//
// Iteration 1:
// fn = add1
// result = await add1(5)
// add1 returns 6
// result becomes 6
//
// Iteration 2:
// fn = mul2
// result = await mul2(6)
// mul2 returns 12
// result becomes 12
//
// Iteration 3:
// fn = sub3
// result = await sub3(12)
// sub3 returns 9
// result becomes 9
//
// Step 4:
// Loop ends
// return result
//
// Final output:
// composed(5) resolves to 9

function composeAsync(...fns) {
  return async function (initialValue) {
    let result = initialValue;

    for (const fn of fns) {
      result = await fn(result);
    }

    return result;
  };
}

/**
 * Alternative Approach
 */

function composeAsync(...fns) {
  return function (initialValue) {
    return fns.reduce(
      (promise, fn) => promise.then(fn),
      Promise.resolve(initialValue),
    );
  };
}

const pipeline = composeAsync(
  (x) => x + 1, // sync
  async (x) => x * 2, // async
  (x) => Promise.resolve(x + 10), // promise-returning
);

pipeline(5).then(console.log);
// Output: 22
