/**
 * A minimal Observable -- the primitive behind RxJS.
 *
 * Differences from a Promise, all of which matter:
 *   Promise:    ONE value,  EAGER (starts immediately), NOT cancellable
 *   Observable: MANY values, LAZY (starts on subscribe), cancellable
 */
export class Observable {
  constructor(producer) { this._producer = producer }

  subscribe(observer) {
    let active = true
    const safe = {
      next: (v) => { if (active) observer.next?.(v) },
      error: (e) => { if (active) { active = false; observer.error?.(e) } },
      complete: () => { if (active) { active = false; observer.complete?.() } },
    }
    // The producer runs HERE, not at construction -- that is what "lazy" means.
    const teardown = this._producer(safe) ?? (() => {})
    return { unsubscribe: () => { active = false; teardown() } }
  }

  map(fn) {
    return new Observable((obs) => {
      const sub = this.subscribe({
        next: (v) => obs.next(fn(v)),
        error: (e) => obs.error(e),
        complete: () => obs.complete(),
      })
      return () => sub.unsubscribe()   // teardown must propagate upstream
    })
  }

  filter(predicate) {
    return new Observable((obs) => {
      const sub = this.subscribe({
        next: (v) => predicate(v) && obs.next(v),
        error: (e) => obs.error(e),
        complete: () => obs.complete(),
      })
      return () => sub.unsubscribe()
    })
  }

  take(n) {
    return new Observable((obs) => {
      let taken = 0
      const sub = this.subscribe({
        next: (v) => {
          obs.next(v)
          if (++taken >= n) { obs.complete(); sub.unsubscribe() }
        },
        error: (e) => obs.error(e),
        complete: () => obs.complete(),
      })
      return () => sub.unsubscribe()
    })
  }

  static interval(ms) {
    return new Observable((obs) => {
      let i = 0
      const id = setInterval(() => obs.next(i++), ms)
      return () => clearInterval(id)
    })
  }

  static of(...values) {
    return new Observable((obs) => { values.forEach((v) => obs.next(v)); obs.complete() })
  }
}
