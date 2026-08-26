/**
 * Time a function that may be sync OR async, without forcing the caller to
 * know which. Awaiting a non-promise is legal and resolves immediately, so a
 * single `await` handles both -- but that would make the sync path async too.
 * Instead we detect a thenable and only go async when we must.
 */
export function measure(fn, label = fn.name || 'anonymous') {
  return function measured(...args) {
    const start = performance.now()

    const finish = (outcome, value) => {
      const duration = performance.now() - start
      return { label, outcome, duration: +duration.toFixed(2), value }
    }

    let result
    try {
      result = fn.apply(this, args)
    } catch (error) {
      return finish('threw', error.message)
    }

    // Thenable check -- covers native promises and custom thenables alike.
    if (result && typeof result.then === 'function') {
      return result.then(
        (value) => finish('resolved', value),
        (error) => finish('rejected', error.message),
      )
    }
    return finish('returned', result)
  }
}
