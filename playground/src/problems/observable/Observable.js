// Observable — lazy, cancellable stream of values
// Difference from Promise: multiple values, lazy (runs on subscribe), cancellable

class Observable {
  constructor(fn) {
    this._fn = fn; // fn receives observer, returns teardown
  }

  subscribe(observer) {
    let active = true;
    const safe = {
      next:     v => active && observer.next(v),
      error:    e => active && (observer.error?.(e), active = false),
      complete: () => active && (observer.complete?.(), active = false),
    };
    const teardown = this._fn(safe) || (() => {});
    return { unsubscribe: () => { active = false; teardown(); } };
  }

  map(fn) {
    return new Observable(obs => this.subscribe({
      next: v => obs.next(fn(v)),
      error: e => obs.error(e),
      complete: () => obs.complete(),
    }).unsubscribe);
  }

  filter(fn) {
    return new Observable(obs => this.subscribe({
      next: v => fn(v) && obs.next(v),
      error: e => obs.error(e),
      complete: () => obs.complete(),
    }).unsubscribe);
  }

  // Static creators
  static of(...values) {
    return new Observable(obs => {
      values.forEach(v => obs.next(v));
      obs.complete();
    });
  }

  static interval(ms) {
    return new Observable(obs => {
      let i = 0;
      const id = setInterval(() => obs.next(i++), ms);
      return () => clearInterval(id); // teardown
    });
  }
}

export { Observable }
