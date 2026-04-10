// Lazy Chain — ops collected, nothing runs until .value()

function chain(data) {
  const ops = [];

  const api = {
    map(fn)        { ops.push({ type: "map",    fn }); return api; },
    filter(fn)     { ops.push({ type: "filter", fn }); return api; },
    take(n)        { ops.push({ type: "take",   n  }); return api; },

    value() {
      let result = [...data];
      for (const op of ops) {
        if (op.type === "map")    result = result.map(op.fn);
        if (op.type === "filter") result = result.filter(op.fn);
        if (op.type === "take")   result = result.slice(0, op.n);
      }
      return result;
    },
  };

  return api;
}

// ─── Usage ───────────────────────────────────────────────────────────────────

const result = chain([1, 2, 3, 4, 5, 6])
  .filter(x => x % 2 === 0)
  .map(x => x * 10)
  .take(2)
  .value();

console.log(result); // [20, 40]

// Key talking points:
// 1. ops[] collects descriptors — nothing executes until .value()
// 2. Lazy = deferred execution. Eager (pipe/compose) runs immediately.
// 3. take() here is still eager — true lazy needs generators (yield) to short-circuit
