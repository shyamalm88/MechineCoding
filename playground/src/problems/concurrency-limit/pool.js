/**
 * Run async tasks with at most `limit` in flight, preserving result order.
 *
 * Pattern: start `limit` workers, each pulling the next index from a shared
 * cursor until the queue is exhausted. Simpler and more efficient than
 * chunking into batches -- a batch waits for its slowest member before
 * starting the next, leaving workers idle.
 */
export async function mapWithLimit(items, limit, worker) {
  const results = new Array(items.length)
  let cursor = 0

  async function run() {
    while (cursor < items.length) {
      const index = cursor++            // claim an index
      results[index] = await worker(items[index], index)
    }
  }

  await Promise.all(Array.from({ length: Math.min(limit, items.length) }, run))
  return results
}

/** Run tasks strictly one after another, recording every outcome. */
export async function series(tasks) {
  const out = []
  for (const task of tasks) {
    try {
      out.push({ status: 'fulfilled', value: await task() })
    } catch (reason) {
      out.push({ status: 'rejected', reason: reason.message })
    }
  }
  return out
}
