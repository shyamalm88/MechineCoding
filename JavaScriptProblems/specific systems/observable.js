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

// ─── Usage ───────────────────────────────────────────────────────────────────

// 1. Basic
Observable.of(1, 2, 3, 4, 5)
  .filter(x => x % 2 === 0)
  .map(x => x * 10)
  .subscribe({ next: v => console.log(v) }); // 20, 40

// 2. Cancel interval after 3 ticks
const sub = Observable.interval(100)
  .map(i => `tick ${i}`)
  .subscribe({ next: v => console.log(v) });

setTimeout(() => sub.unsubscribe(), 350); // tick 0, tick 1, tick 2

// Key talking points:
// 1. Lazy — _fn doesn't run until subscribe() is called
// 2. unsubscribe() calls the teardown returned by _fn (clears interval, removes listener)
// 3. Observable vs Promise: multiple values + cancellable + lazy
// 4. Observable vs EventEmitter: operators (map/filter), complete/error lifecycle
