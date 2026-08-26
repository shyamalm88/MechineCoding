/**
 * Fluent interface: every mutator returns `this`, so calls chain.
 * A terminal method (.result()) ends the chain and returns the value.
 */
export class Calculator {
  constructor(value = 0) { this.value = value }

  add(n) { this.value += n; return this }
  subtract(n) { this.value -= n; return this }
  multiply(n) { this.value *= n; return this }
  divide(n) {
    if (n === 0) throw new Error('Division by zero')
    this.value /= n
    return this
  }
  result() { return this.value }   // terminal -- breaks the chain deliberately
}

/** Closure-based variant: no class, no `this` fragility. */
export function calc(initial = 0) {
  let value = initial
  const api = {
    add: (n) => { value += n; return api },
    subtract: (n) => { value -= n; return api },
    multiply: (n) => { value *= n; return api },
    divide: (n) => { if (n === 0) throw new Error('Division by zero'); value /= n; return api },
    result: () => value,
  }
  return api
}
