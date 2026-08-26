/**
 * clearAllTimeout(): cancel every pending timeout.
 *
 * There is no built-in registry, so we wrap setTimeout to record ids. The
 * wrapper must also self-clean on natural completion, or the registry grows
 * without bound in a long-lived page.
 */
const pending = new Set()

const nativeSetTimeout = globalThis.setTimeout
const nativeClearTimeout = globalThis.clearTimeout

export function installTimeoutTracking() {
  globalThis.setTimeout = function trackedSetTimeout(fn, delay, ...args) {
    const id = nativeSetTimeout(() => {
      pending.delete(id)   // completed naturally -- stop tracking
      fn(...args)
    }, delay)
    pending.add(id)
    return id
  }

  globalThis.clearTimeout = function trackedClearTimeout(id) {
    pending.delete(id)
    return nativeClearTimeout(id)
  }
}

export function clearAllTimeout() {
  const count = pending.size
  for (const id of pending) nativeClearTimeout(id)
  pending.clear()
  return count
}

export const pendingCount = () => pending.size
