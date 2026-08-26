# Debounce

`debounce(fn, delay)` returns a wrapped function that postpones calling `fn`
until `delay` ms have elapsed since the **last** call. Rapid successive calls
collapse into a single invocation.

## How to see it work

Click the button rapidly in the Preview tab. The raw counter increments on
every click; the debounced counter increments **once**, 500ms after you stop.

## How it works

The pending timer id lives in a closure variable. Every call clears the
previous timer before scheduling a new one, so only the final call in a burst
ever fires.

The returned wrapper is a regular `function`, not an arrow — that keeps `this`
dynamic so it can be forwarded with `fn.apply(this, args)`. An arrow function
would capture `this` from the definition site instead, breaking method usage
like `obj.debouncedMethod()`.

## Debounce vs. throttle

Debounce waits for the activity to *stop* — good for search-as-you-type or
resize handlers. Throttle fires at a steady maximum rate *during* activity —
good for scroll position tracking.
