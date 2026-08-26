/**
 * Convert a Node-style callback function into a promise-returning one.
 * Convention: callback is the LAST argument and receives (error, value).
 */
export function promisify(fn) {
  return function promisified(...args) {
    return new Promise((resolve, reject) => {
      // `this` is forwarded so obj.method() still works after promisifying.
      fn.call(this, ...args, (error, ...values) => {
        if (error) return reject(error)
        resolve(values.length > 1 ? values : values[0])
      })
    })
  }
}

/** The inverse: promise-returning → callback style. */
export function callbackify(fn) {
  return function callbackified(...args) {
    const callback = args.pop()
    fn.apply(this, args).then(
      (value) => callback(null, value),
      // Guarantee an error is passed -- a falsy rejection would look like success.
      (error) => callback(error ?? new Error('Rejected with a falsy value')),
    )
  }
}
