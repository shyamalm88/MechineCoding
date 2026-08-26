/**
 * Async composition: pipe/compose that await each step, plus waterfall
 * and a cancellable variant.
 */

/** Left-to-right; each step receives the previous result. */
export const pipeAsync = (...fns) => async (input) => {
  let acc = input
  for (const fn of fns) acc = await fn(acc)   // sequential, NOT Promise.all
  return acc
}

export const composeAsync = (...fns) => pipeAsync(...fns.reverse())

/**
 * Waterfall: like pipeAsync but each step also receives the full history,
 * which is what makes later steps able to reference earlier results.
 */
export async function waterfall(steps, initial) {
  const history = []
  let acc = initial
  for (const step of steps) {
    acc = await step(acc, history)
    history.push(acc)
  }
  return { result: acc, history }
}

/**
 * Cancellable pipeline: checks the signal BETWEEN steps, so an abort stops
 * the chain even though the in-flight step cannot itself be interrupted.
 */
export const pipeAsyncCancellable = (...fns) => (input, signal) =>
  fns.reduce(
    (chain, fn) =>
      chain.then((acc) => {
        if (signal?.aborted) throw Object.assign(new Error('Aborted'), { name: 'AbortError' })
        return fn(acc)
      }),
    Promise.resolve(input),
  )
