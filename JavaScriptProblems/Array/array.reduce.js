Array.prototype.myReduce = function (callback, initialValue) {
  // 1. Initialize variables
  let accumulator = initialValue;
  let startIndex = 0;

  // 2. Check if initialValue is MISSING
  // We check arguments.length because 'undefined' counts as a value
  if (arguments.length < 2) {
    if (this.length === 0) {
      throw new Error("Reduce of empty array with no initial value");
    }
    accumulator = this[0]; // Use first item as base
    startIndex = 1; // Start loop from second item
  }

  // 3. Loop through the array
  for (let i = startIndex; i < this.length; i++) {
    accumulator = callback(accumulator, this[i], i, this);
  }

  return accumulator;
};
