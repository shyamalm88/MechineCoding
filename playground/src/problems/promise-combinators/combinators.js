/**
 * Promise.all / allSettled / race / any, implemented from scratch.
 *
 * Shared shape: return a new Promise, iterate the inputs, and resolve or
 * reject once the relevant condition is met. Promise.resolve() wraps each
 * input so non-promise values ("thenables" or plain values) work too.
 */

export function all(iterable) {
  const items = [...iterable]
  return new Promise((resolve, reject) => {
    const results = new Array(items.length)
    let remaining = items.length
    if (remaining === 0) return resolve([])

    items.forEach((item, i) => {
      Promise.resolve(item).then((value) => {
        // Assign by INDEX, not push -- results must keep input order
        // regardless of which settles first.
        results[i] = value
        if (--remaining === 0) resolve(results)
      }, reject) // first rejection wins; later ones are ignored
    })
  })
}

export function allSettled(iterable) {
  const items = [...iterable]
  return new Promise((resolve) => {
    const results = new Array(items.length)
    let remaining = items.length
    if (remaining === 0) return resolve([])

    items.forEach((item, i) => {
      Promise.resolve(item).then(
        (value) => { results[i] = { status: 'fulfilled', value } },
        (reason) => { results[i] = { status: 'rejected', reason } },
      ).finally(() => { if (--remaining === 0) resolve(results) })
    })
  })
}

export function race(iterable) {
  return new Promise((resolve, reject) => {
    // No counter needed: the first settle of any kind wins, and further
    // resolve/reject calls on an already-settled promise are no-ops.
    for (const item of iterable) Promise.resolve(item).then(resolve, reject)
  })
}

export function any(iterable) {
  const items = [...iterable]
  return new Promise((resolve, reject) => {
    const errors = new Array(items.length)
    let remaining = items.length
    if (remaining === 0) {
      return reject(new AggregateError([], 'All promises were rejected'))
    }

    items.forEach((item, i) => {
      Promise.resolve(item).then(resolve, (err) => {
        errors[i] = err
        // Only reject once EVERY input has failed.
        if (--remaining === 0) {
          reject(new AggregateError(errors, 'All promises were rejected'))
        }
      })
    })
  })
}
