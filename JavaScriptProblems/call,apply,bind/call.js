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
