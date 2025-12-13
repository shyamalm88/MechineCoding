Array.prototype.myReduce = function (callback, initialValue) {
  if (typeof callback !== "function") {
    throw new TypeError(callback + " is not a function");
  }

  const length = this.length;
  let i = 0;
  let accumulator;

  // 1. Check if initialValue is provided
  if (arguments.length >= 2) {
    accumulator = initialValue;
  } else {
    // 2. Handle Empty Array Case (Error if no initial value)
    if (length === 0) {
      throw new TypeError("Reduce of empty array with no initial value");
    }

    // 3. Find the first existing element (skip empty slots)
    // In strict implementations, reduce skips holes until it finds the first value
    while (i < length && !(i in this)) {
      i++;
    }

    // If array was all holes
    if (i >= length) {
      throw new TypeError("Reduce of empty array with no initial value");
    }

    accumulator = this[i];
    i++; // Start loop from the next item
  }

  // 4. Loop through the rest
  for (; i < length; i++) {
    if (i in this) {
      accumulator = callback(accumulator, this[i], i, this);
    }
  }

  return accumulator;
};
