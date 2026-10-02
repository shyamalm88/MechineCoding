// ---- call.js ----
Function.prototype.myCall = function (context = window, ...args) {
  // 1. Create a unique key (Symbol) to avoid overwriting existing properties
  const fnSymbol = Symbol();

  // 2. Attach "this" (the function) to the context
  context[fnSymbol] = this;

  // 3. Execute it
  const result = context[fnSymbol](...args);

  // 4. Cleanup
  delete context[fnSymbol];

  return result;
};

// ---- apply.js ----
Function.prototype.myApply = function (context = window, args = []) {
  const fnSymbol = Symbol();
  context[fnSymbol] = this;
  const result = context[fnSymbol](...args);
  delete context[fnSymbol];
  return result;
};

// ---- bind.js ----
Function.prototype.myBind = function (context, ...args) {
  const fn = this;

  return function (...newArgs) {
    // Merge outer args (from bind) and inner args (from call)
    return fn.apply(context, [...args, ...newArgs]);
  };
};

